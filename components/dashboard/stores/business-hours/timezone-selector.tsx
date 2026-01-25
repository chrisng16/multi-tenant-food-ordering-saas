import { Field, FieldLabel } from "@/components/ui/field";
import { Check, Search } from "lucide-react";
import { useMemo, useState } from "react";

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

function getTimezoneOffset(timezone: string): number {
    try {
        const date = new Date();
        const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
        const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
        return (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
    } catch {
        return 0;
    }
}

function formatTimezoneLabel(timezone: string): string {
    const offset = getTimezoneOffset(timezone);
    const sign = offset >= 0 ? '+' : '-';
    const hours = Math.floor(Math.abs(offset));
    const formattedOffset = `${sign}${hours}`;
    const displayName = timezone.replace(/_/g, ' ');
    return `(GMT${formattedOffset}) ${displayName}`;
}

type TimezoneSelectorProps = {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
};

export const TimezoneSelector = ({ value, onChange, disabled }: TimezoneSelectorProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const timezones = useMemo(() => safeSupportedTimezones(), []);

    const timezonesWithLabels = useMemo(() => {
        return timezones.map(tz => ({
            value: tz,
            label: formatTimezoneLabel(tz),
            offset: getTimezoneOffset(tz)
        })).sort((a, b) => a.offset - b.offset || a.label.localeCompare(b.label));
    }, [timezones]);

    const selectedTimezone = useMemo(() => {
        return timezonesWithLabels.find(tz => tz.value === value) || timezonesWithLabels[0];
    }, [value, timezonesWithLabels]);

    const filteredTimezones = useMemo(() => {
        if (!searchQuery) return timezonesWithLabels;
        const query = searchQuery.toLowerCase();
        return timezonesWithLabels.filter(tz =>
            tz.label.toLowerCase().includes(query) ||
            tz.value.toLowerCase().includes(query)
        );
    }, [searchQuery, timezonesWithLabels]);

    const handleSelect = (timezone: string) => {
        onChange(timezone);
        setIsOpen(false);
        setSearchQuery("");
    };

    return (
        <Field>
            <FieldLabel>Timezone</FieldLabel>
            <div className="relative">
                {/* Selector Button */}
                <button
                    type="button"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                    className="w-full px-3 py-2 text-left bg-white dark:bg-input/30 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:border-zinc-400 dark:hover:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-900 dark:text-zinc-100">
                            {selectedTimezone.label}
                        </span>
                        <svg
                            className={`w-4 h-4 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </button>

                {/* Dropdown */}
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown Content */}
                        <div className="absolute z-20 w-full mt-2 bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl overflow-hidden">
                            {/* Search Input */}
                            <div className="p-3 border-b border-zinc-800">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                    <input
                                        type="text"
                                        placeholder="Search timezones..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 bg-zinc-800 text-zinc-100 text-sm rounded-md border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-zinc-500"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {/* Timezone List */}
                            <div className="max-h-64 overflow-y-auto">
                                {filteredTimezones.length > 0 ? (
                                    filteredTimezones.map((timezone) => (
                                        <button
                                            key={timezone.value}
                                            type="button"
                                            onClick={() => handleSelect(timezone.value)}
                                            className="w-full px-4 py-2.5 text-left text-sm text-zinc-100 hover:bg-zinc-800 transition-colors flex items-center justify-between group"
                                        >
                                            <span>{timezone.label}</span>
                                            {timezone.value === value && (
                                                <Check className="w-4 h-4 text-green-500" />
                                            )}
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-4 py-8 text-center text-sm text-zinc-500">
                                        No timezones found
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Field>
    );
};