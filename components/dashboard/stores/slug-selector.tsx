"use client";

import { useMutation } from "@tanstack/react-query";
import { AlertTriangle, CircleCheck, Info, Loader2 } from "lucide-react";
import * as React from "react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { checkStoreSlugAvailability } from "@/actions/store/check-store-slug-availability";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";

type SlugSelectorProps = {
    mode: "create" | "edit";
    nameValue: string;
    slugValue: string;
    setSlugValueAction: (next: string) => void;
    error?: string;
    disabled?: boolean;
    domainSuffix?: string;
    originalSlug?: string;
};

function slugifyFromName(name: string) {
    return name
        .trim()
        .toLowerCase()
        .replace(/['"]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

export default function SlugSelector({
    mode,
    nameValue,
    slugValue,
    setSlugValueAction,
    error,
    disabled = false,
    domainSuffix = ".app.com",
    originalSlug,
}: SlugSelectorProps) {
    const [checkResult, setCheckResult] = React.useState<any>(null);
    const [showWarning, setShowWarning] = React.useState(false);
    const [canEditInEditMode, setCanEditInEditMode] = React.useState(false);
    const [pendingSlugValue, setPendingSlugValue] = React.useState<string | null>(null);

    const debounceRef = React.useRef<NodeJS.Timeout | null>(null);
    const hasUserTypedRef = React.useRef(false);

    // Capture the original slug once and keep it constant
    const actualOriginalSlugRef = React.useRef(originalSlug || (mode === "edit" ? slugValue : ""));
    const actualOriginalSlug = actualOriginalSlugRef.current;

    // Auto-sync slug from name in create mode
    React.useEffect(() => {
        if (mode !== "create" || disabled || hasUserTypedRef.current) return;

        const autoSlug = slugifyFromName(nameValue);
        if (autoSlug && autoSlug !== slugValue) {
            setSlugValueAction(autoSlug);
        }
    }, [mode, nameValue, disabled, slugValue, setSlugValueAction]);

    // Debounced availability check
    React.useEffect(() => {
        if (disabled || !slugValue) return;

        // Skip if it's their original slug
        if (mode === "edit" && slugValue === actualOriginalSlug) {
            setCheckResult(null);
            return;
        }

        // In edit mode, only check if user has been warned and confirmed
        if (mode === "edit" && !canEditInEditMode) return;

        // Don't check very short slugs until user has typed
        if (slugValue.length < 3 && !hasUserTypedRef.current) return;

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            checkMutation.mutate(slugValue);
        }, 500);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [slugValue, disabled, mode, actualOriginalSlug, canEditInEditMode]);

    const checkMutation = useMutation({
        mutationFn: (slug: string) => checkStoreSlugAvailability(slug),
        onSuccess: (data) => {
            setCheckResult(data);
        },
        onError: () => {
            setCheckResult({ error: true });
        },
    });

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;

        // Show warning on first edit in edit mode
        if (mode === "edit" && !canEditInEditMode && newValue !== actualOriginalSlug) {
            setPendingSlugValue(newValue);
            setShowWarning(true);
            return;
        }

        hasUserTypedRef.current = true;
        setCheckResult(null);
        setSlugValueAction(newValue);
    };

    const confirmChange = () => {
        setCanEditInEditMode(true);
        setShowWarning(false);

        // Apply the pending value
        if (pendingSlugValue !== null) {
            hasUserTypedRef.current = true;
            setCheckResult(null);
            setSlugValueAction(pendingSlugValue);
            setPendingSlugValue(null);
        }
    };

    const cancelChange = () => {
        setShowWarning(false);
        setPendingSlugValue(null);
    };

    const applySuggestion = () => {
        if (checkResult?.suggestedSlug) {
            setSlugValueAction(checkResult.suggestedSlug);
            hasUserTypedRef.current = true;
            setCheckResult(null);
        }
    };

    const statusIcon = (() => {
        if (!slugValue) return <CircleCheck className="h-4 w-4 text-muted-foreground/30" />;
        if (checkMutation.isPending) return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
        if (checkResult?.available) return <CircleCheck className="h-4 w-4 text-green-600" />;
        if (checkResult && !checkResult.available) return <AlertTriangle className="h-4 w-4 text-red-500" />;
        return <CircleCheck className="h-4 w-4 text-muted-foreground/30" />;
    })();

    const helperText = (() => {
        if (checkResult && !checkResult.available && checkResult.suggestedSlug) {
            return (
                <span>
                    Not available.{" "}
                    <button
                        type="button"
                        onClick={applySuggestion}
                        className="underline hover:no-underline font-medium"
                    >
                        Try "{checkResult.suggestedSlug}"
                    </button>
                </span>
            );
        }
        return null;
    })();

    return (
        <>
            <Field>
                <FieldLabel>Store Slug</FieldLabel>

                <InputGroup>
                    <InputGroupAddon align="inline-start">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="h-4 w-4" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-sm">
                                    Your unique store identifier. Used in your store URL.
                                    {mode === "edit" && " Can only be changed once every 30 days."}
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </InputGroupAddon>

                    <InputGroupInput
                        value={slugValue ?? ""}
                        onChange={handleSlugChange}
                        placeholder="your-store-slug"
                        disabled={disabled}
                        aria-invalid={Boolean(error)}
                    />

                    <InputGroupAddon align="inline-end">{domainSuffix}</InputGroupAddon>
                    <InputGroupAddon align="inline-end">{statusIcon}</InputGroupAddon>
                </InputGroup>

                {helperText && (
                    <p className="mt-1 text-sm text-red-500">
                        {helperText}
                    </p>
                )}

                {error && <FieldError>{error}</FieldError>}
            </Field>

            <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Change your store slug?</AlertDialogTitle>
                        <AlertDialogDescription className="sr-only">
                            Changing your slug will affect your store's URL and can have significant consequences.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-2 text-muted-foreground text-sm">
                        <p>
                            Changing your slug will affect your store's URL and can have significant consequences:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Existing links to your store will break</li>
                            <li>You may lose SEO rankings and search visibility</li>
                            <li>Bookmarks and shared links will stop working</li>
                            <li>You can only change your slug once every 30 days</li>
                        </ul>
                        <p className="pt-2 font-medium">
                            Are you sure you want to proceed?
                        </p>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={cancelChange}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmChange}>
                            Yes, change slug
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}