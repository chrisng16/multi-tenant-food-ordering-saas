// components/business-hours/timezone-selector.tsx
"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type TimezoneSelectorProps = {
    field: UseFormRegisterReturn;
    error?: string;
    disabled?: boolean;
    placeholder?: string;
    defaultTimezone?: string;
};

function safeSupportedTimezones(): string[] {
    const anyIntl = Intl as any;
    const tzs: unknown = anyIntl?.supportedValuesOf?.("timeZone");
    if (Array.isArray(tzs) && tzs.every((x) => typeof x === "string")) {
        return tzs as string[];
    }

    return [
        "America/Los_Angeles",
        "America/Denver",
        "America/Chicago",
        "America/New_York",
        "Europe/London",
        "Europe/Paris",
        "Asia/Tokyo",
        "Australia/Sydney",
    ];
}

/**
 * GMT offset formatter: (GMT+02:00), (GMT-07:00)
 * Cached and deterministic (no PST/EST)
 */
function computeGmtOffsetLabel(timezone: string): string {
    try {
        const now = new Date();
        const utc = new Date(
            now.toLocaleString("en-US", { timeZone: "UTC" })
        );
        const local = new Date(
            now.toLocaleString("en-US", { timeZone: timezone })
        );

        const offsetMinutes = (local.getTime() - utc.getTime()) / 60000;
        const sign = offsetMinutes >= 0 ? "+" : "-";
        const abs = Math.abs(offsetMinutes);
        const hours = String(Math.floor(abs / 60));

        return `(GMT${sign}${hours}) ${timezone.replace(/_/g, " ")}`;
    } catch {
        return timezone.replace(/_/g, " ");
    }
}

export function TimezoneSelector(props: TimezoneSelectorProps) {
    const {
        field,
        error,
        disabled,
        placeholder = "Select a timezone (e.g., America/New_York)",
        defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Los_Angeles",
    } = props;

    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");

    const timezones = React.useMemo(() => safeSupportedTimezones(), []);

    // ---- label cache (GMT only)
    const labelCache = React.useRef(new Map<string, string>());
    const getLabel = React.useCallback((tz: string) => {
        const cached = labelCache.current.get(tz);
        if (cached) return cached;

        const label = computeGmtOffsetLabel(tz);
        labelCache.current.set(tz, label);
        return label;
    }, []);

    // ---- search cache
    const searchCache = React.useRef(new Map<string, string>());
    const getSearchValue = React.useCallback((tz: string) => {
        const cached = searchCache.current.get(tz);
        if (cached) return cached;

        const value = `${tz} ${tz.replace(/_/g, " ")}`.toLowerCase();
        searchCache.current.set(tz, value);
        return value;
    }, []);

    const [value, setValue] = React.useState<string>(() => defaultTimezone);

    React.useEffect(() => {
        setValue((v) => v || defaultTimezone);
    }, [defaultTimezone]);

    const selectedTz = value || defaultTimezone;
    const selectedLabel = getLabel(selectedTz);

    // ---- MANUAL FILTERING (big win)
    const filteredTimezones = React.useMemo(() => {
        if (!query) return timezones;

        const q = query.toLowerCase();
        return timezones.filter((tz) => getSearchValue(tz).includes(q));
    }, [query, timezones, getSearchValue]);

    // Keep selected timezone at the top
    const orderedTimezones = React.useMemo(() => {
        if (!filteredTimezones.includes(selectedTz)) return filteredTimezones;
        return [
            selectedTz,
            ...filteredTimezones.filter((t) => t !== selectedTz),
        ];
    }, [filteredTimezones, selectedTz]);

    const commit = (tz: string) => {
        setValue(tz);
        field.onChange({ target: { name: field.name, value: tz } });
        setQuery("");
        setOpen(false);
    };

    return (
        <Field>
            <FieldLabel>Timezone</FieldLabel>

            <input
                type="hidden"
                name={field.name}
                ref={field.ref}
                value={value}
                onBlur={field.onBlur}
            />

            <Popover open={open} onOpenChange={setOpen} modal>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        className="relative w-full"
                        disabled={disabled}
                        aria-label="Select timezone"
                    >
                        <Input
                            value={selectedLabel}
                            readOnly
                            placeholder={placeholder}
                            disabled={disabled}
                            className="w-full cursor-pointer pr-10 text-left"
                        />
                        <ChevronsUpDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
                    </button>
                </PopoverTrigger>

                <PopoverContent
                    className="z-50 w-[var(--radix-popover-trigger-width)] p-0"
                    align="start"
                    sideOffset={4}
                >
                    <Command>
                        <CommandInput
                            placeholder="Search timezones..."
                            value={query}
                            onValueChange={setQuery}
                            className="h-9"
                            autoFocus
                        />
                        <CommandList>
                            <CommandEmpty>No timezone found.</CommandEmpty>

                            {/* Do not render list unless open */}
                            {open && (
                                <CommandGroup className="max-h-64 overflow-y-auto">
                                    {orderedTimezones.map((tz) => (
                                        <CommandItem
                                            key={tz}
                                            value={tz}
                                            onSelect={() => commit(tz)}
                                            className="flex items-center gap-2"
                                        >
                                            <span className="flex w-6 items-center">
                                                <Check
                                                    className={
                                                        tz === selectedTz
                                                            ? "h-4 w-4 text-primary opacity-100"
                                                            : "h-4 w-4 opacity-0"
                                                    }
                                                />
                                            </span>
                                            <span className="truncate">
                                                {getLabel(tz)}
                                            </span>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            <FieldError>{error}</FieldError>
        </Field>
    );
}
