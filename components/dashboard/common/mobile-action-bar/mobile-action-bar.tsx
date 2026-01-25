"use client"

import { cn } from "@/lib/utils"
import * as React from "react"

type MobileActionBarProps = React.HTMLAttributes<HTMLDivElement> & {
    /**
     * When true, uses iOS safe-area inset padding (env(safe-area-inset-bottom)).
     * Keep enabled by default unless you have your own safe-area handling.
     */
    safeArea?: boolean
}

export function MobileActionBar({
    className,
    children,
    safeArea = true,
    ...props
}: MobileActionBarProps) {
    return (
        <div
            className={cn(
                "fixed inset-x-0 bottom-0 z-50 sm:hidden h-[var(--mobile-action-bar-height)] bg-background/50 backdrop-blur flex items-center justify-center",
                className
            )}
            style={{
                paddingBottom: safeArea ? "calc(1rem + env(safe-area-inset-bottom))" : undefined,
                paddingTop: "1rem",
                paddingLeft: "1rem",
                paddingRight: "1rem",
            }}
            {...props}
        >
            {children}
        </div>
    )
}
