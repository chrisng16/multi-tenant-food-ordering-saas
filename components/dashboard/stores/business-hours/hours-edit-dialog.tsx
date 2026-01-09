// components/business-hours/HoursEditDialog.tsx
"use client";

import { X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

import type { DayHours, DayKey, TimeRange, WeekHours } from "@/components/dashboard/stores/business-hours/time-utils";
import {
    DAY_CHIPS,
    DAY_LABELS,
    DAY_ORDER,
    inputValueToMinutes,
    isSameDayHours,
    minutesToInputValue,
    normalizeAndMergeRanges,
} from "@/components/dashboard/stores/business-hours/time-utils";

type Mode = "ranges" | "closed" | "open24";

type Draft = {
    selectedDays: Set<DayKey>;
    mode: Mode;
    ranges: TimeRange[];
};

type HoursEditDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialSelectedDays: DayKey[];
    weekHours: WeekHours;
    onSave: (next: WeekHours) => void;
};

function cloneDayHours(dh: DayHours): { mode: Mode; ranges: TimeRange[] } {
    if (dh.status === "closed") return { mode: "closed", ranges: [] };
    if (dh.status === "open24") return { mode: "open24", ranges: [] };
    return { mode: "ranges", ranges: dh.ranges.map((r) => ({ ...r })) };
}

function getInitialDraft(initialSelectedDays: DayKey[], weekHours: WeekHours): Draft {
    const selected = new Set<DayKey>(initialSelectedDays);

    if (initialSelectedDays.length === 1) {
        const day = initialSelectedDays[0];
        const { mode, ranges } = cloneDayHours(weekHours[day]);
        return { selectedDays: selected, mode, ranges };
    }

    // Multi-day: if identical, use that; else default.
    const first = weekHours[initialSelectedDays[0]];
    const allSame = initialSelectedDays.every((d) => isSameDayHours(first, weekHours[d]));

    if (allSame) {
        const { mode, ranges } = cloneDayHours(first);
        return { selectedDays: selected, mode, ranges };
    }

    return {
        selectedDays: selected,
        mode: "ranges",
        ranges: [{ startMin: 9 * 60, endMin: 17 * 60 + 30 }],
    };
}

function applyDraftToWeek(weekHours: WeekHours, draft: Draft): WeekHours {
    const next: WeekHours = { ...weekHours };

    let dayHours: DayHours;
    if (draft.mode === "closed") {
        dayHours = { status: "closed" };
    } else if (draft.mode === "open24") {
        dayHours = { status: "open24" };
    } else {
        const merged = normalizeAndMergeRanges(draft.ranges);
        dayHours = merged.length ? { status: "ranges", ranges: merged } : { status: "closed" };
    }

    for (const d of draft.selectedDays) next[d] = dayHours;
    return next;
}

function validateDraft(draft: Draft): { ok: boolean; message?: string } {
    if (draft.selectedDays.size === 0) return { ok: false, message: "Select at least one day." };
    if (draft.mode !== "ranges") return { ok: true };

    // Validate raw entries are well-formed; merged result will eliminate overlaps/touching
    for (const r of draft.ranges) {
        if (!Number.isFinite(r.startMin) || !Number.isFinite(r.endMin)) {
            return { ok: false, message: "Enter valid times." };
        }
        if (r.startMin >= r.endMin) return { ok: false, message: "Open time must be before close time." };
    }

    const merged = normalizeAndMergeRanges(draft.ranges);
    if (merged.length === 0) return { ok: false, message: "Add at least one valid time range." };

    return { ok: true };
}

export function HoursEditDialog(props: HoursEditDialogProps) {
    const { open, onOpenChange, initialSelectedDays, weekHours, onSave } = props;

    const [draft, setDraft] = React.useState<Draft>(() =>
        getInitialDraft(initialSelectedDays, weekHours),
    );
    const [error, setError] = React.useState<string | null>(null);

    // Reset draft whenever the dialog opens (or selection changes)
    React.useEffect(() => {
        if (!open) return;
        setDraft(getInitialDraft(initialSelectedDays, weekHours));
        setError(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, initialSelectedDays.join("|")]);

    const selectedCount = draft.selectedDays.size;

    const validation = React.useMemo(() => validateDraft(draft), [draft]);

    const toggleDay = (day: DayKey) => {
        setDraft((prev) => {
            const next = new Set(prev.selectedDays);
            if (next.has(day)) next.delete(day);
            else next.add(day);
            return { ...prev, selectedDays: next };
        });
    };

    const setMode = (mode: Mode) => {
        setDraft((prev) => {
            if (mode === "ranges" && prev.ranges.length === 0) {
                return { ...prev, mode, ranges: [{ startMin: 9 * 60, endMin: 17 * 60 + 30 }] };
            }
            return { ...prev, mode };
        });
    };

    const updateRange = (idx: number, field: "startMin" | "endMin", value: number) => {
        setDraft((prev) => {
            const ranges = prev.ranges.map((r, i) => (i === idx ? { ...r, [field]: value } : r));
            return { ...prev, ranges };
        });
    };

    /**
     * "Automatic merge": do it after user commits an input (blur),
     * so the UI doesn’t jump while they’re editing.
     */
    const mergeRangesNow = () => {
        setDraft((prev) => ({ ...prev, ranges: normalizeAndMergeRanges(prev.ranges) }));
    };

    const addRange = () => {
        setDraft((prev) => {
            const merged = normalizeAndMergeRanges(prev.ranges);
            const last = merged[merged.length - 1];
            const startMin = last ? Math.min(last.endMin, 23 * 60 + 59) : 9 * 60;
            const endMin = Math.min(startMin + 60, 1440);
            const nextRanges = [...merged, { startMin, endMin }];
            return { ...prev, mode: "ranges", ranges: nextRanges };
        });
    };

    const removeRange = (idx: number) => {
        setDraft((prev) => {
            const ranges = prev.ranges.filter((_, i) => i !== idx);
            return { ...prev, ranges };
        });
    };

    const handleSave = () => {
        const v = validateDraft(draft);
        if (!v.ok) {
            setError(v.message ?? "Fix errors and try again.");
            return;
        }
        setError(null);

        // Ensure merge is applied on save as well (required).
        const finalized: Draft =
            draft.mode === "ranges"
                ? { ...draft, ranges: normalizeAndMergeRanges(draft.ranges) }
                : draft;

        const next = applyDraftToWeek(weekHours, finalized);
        onSave(next);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[640px]">
                <DialogHeader>
                    <DialogTitle>Select days &amp; time</DialogTitle>
                </DialogHeader>

                {/* Day chips */}
                <div className="flex flex-wrap items-center gap-2">
                    {DAY_ORDER.map((d) => {
                        const selected = draft.selectedDays.has(d);
                        return (
                            <Button
                                key={d}
                                type="button"
                                variant={selected ? "secondary" : "outline"}
                                size="icon"
                                aria-pressed={selected}
                                aria-label={`Toggle ${DAY_LABELS[d]}`}
                                onClick={() => toggleDay(d)}
                                className={cn("rounded-full")}
                            >
                                {DAY_CHIPS[d]}
                            </Button>
                        );
                    })}

                    <div className="ml-2 text-sm text-muted-foreground">
                        {selectedCount === 0 ? "No days selected" : `${selectedCount} day(s) selected`}
                    </div>
                </div>

                {/* Mode selector */}
                <div className="mt-4 grid gap-3">
                    <Label className="text-sm">Status</Label>
                    <RadioGroup
                        value={draft.mode}
                        onValueChange={(v) => setMode(v as Mode)}
                        className="flex flex-col gap-2 sm:flex-row sm:items-center"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="ranges" id="mode-ranges" />
                            <Label htmlFor="mode-ranges">Custom hours</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="open24" id="mode-open24" />
                            <Label htmlFor="mode-open24">Open 24 hours</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="closed" id="mode-closed" />
                            <Label htmlFor="mode-closed">Closed</Label>
                        </div>
                    </RadioGroup>
                </div>

                {/* Ranges */}
                {draft.mode === "ranges" && (
                    <div className="mt-4 grid gap-3">
                        {draft.ranges.map((r, idx) => (
                            <div key={idx} className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                                <div className="grid gap-1">
                                    <Label className="text-sm">Open time</Label>
                                    <Input
                                        type="time"
                                        value={minutesToInputValue(r.startMin)}
                                        onChange={(e) => updateRange(idx, "startMin", inputValueToMinutes(e.target.value))}
                                        onBlur={mergeRangesNow}
                                        aria-label={`Open time for range ${idx + 1}`}
                                    />
                                </div>

                                <div className="grid gap-1">
                                    <Label className="text-sm">Close time</Label>
                                    <Input
                                        type="time"
                                        value={minutesToInputValue(r.endMin)}
                                        onChange={(e) => updateRange(idx, "endMin", inputValueToMinutes(e.target.value))}
                                        onBlur={mergeRangesNow}
                                        aria-label={`Close time for range ${idx + 1}`}
                                    />
                                </div>

                                <div className="flex items-center">
                                    {draft.ranges.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeRange(idx)}
                                            aria-label={`Remove range ${idx + 1}`}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}

                        <div>
                            <Button type="button" variant="link" className="px-0" onClick={addRange}>
                                Add hours
                            </Button>
                            <div className="text-xs text-muted-foreground">
                                Overlapping or touching ranges are merged automatically (for example, 9:00–13:00 and 12:00–17:00 becomes 9:00–17:00).
                            </div>
                        </div>
                    </div>
                )}

                {error && <div className="mt-2 text-sm text-destructive">{error}</div>}
                {!error && !validation.ok && (
                    <div className="mt-2 text-sm text-muted-foreground">{validation.message}</div>
                )}

                <DialogFooter className="mt-6">
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleSave} disabled={!validation.ok}>
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
