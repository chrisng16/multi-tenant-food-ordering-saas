"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils/utils"
import { LayoutGrid, LayoutList } from "lucide-react"

export type ViewMode = "grid" | "list"

interface ViewToggleProps {
    view: ViewMode
    onViewChange: (view: ViewMode) => void
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
    return (
        <div className="inline-flex items-center rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-0.5 shadow-sm gap-1">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewChange("grid")}
                className={cn(
                    "h-7 px-3 rounded-sm transition-all duration-200",
                    view === "grid"
                        ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-sm hover:bg-neutral-900/90 dark:hover:bg-neutral-100/90"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-transparent"
                )}
                aria-label="Grid view"
            >
                <LayoutGrid className="h-3.5 w-3.5 mr-1.5" />
                <span className="text-xs font-medium">Grid</span>
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewChange("list")}
                className={cn(
                    "h-7 px-3 rounded-sm transition-all duration-200",
                    view === "list"
                        ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-sm hover:bg-neutral-900/90 dark:hover:bg-neutral-100/90"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-transparent"
                )}
                aria-label="List view"
            >
                <LayoutList className="h-3.5 w-3.5 mr-1.5" />
                <span className="text-xs font-medium">List</span>
            </Button>
        </div>
    )
}