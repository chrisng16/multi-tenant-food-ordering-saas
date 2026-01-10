
import { ChevronLeft, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

type MobileActionBarProps = {
    children: React.ReactNode,
    leftButton?: React.ReactNode,
    rightButton?: React.ReactNode,
    showLeftButton?: boolean
    showRightButton?: boolean
}

export default function MABTemplate({
    children,
    leftButton,
    rightButton,
    showLeftButton = true,
    showRightButton = true,
}: MobileActionBarProps) {
    return (
        <>
            {/* Spacer so content doesn't sit under the bar */}
            <div className="h-24" aria-hidden="true" />

            <TooltipProvider delayDuration={150}>
                <nav
                    aria-label="Page actions"
                    className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]"
                >
                    <div className={`flex w-full items-center ${showLeftButton === showRightButton ? "justify-center" : "justify-between"} gap-2 rounded-2xl`}>

                        {showLeftButton && (leftButton ? leftButton : defaultLeftButton())}
                        {/* Primary Button */}
                        <div className={`${!showLeftButton && !showRightButton ? "flex-grow" : ""}`}>
                            {children}
                        </div>

                        {showRightButton && (rightButton ? rightButton : defaultRightButton())}

                    </div>
                </nav>
            </TooltipProvider>
        </>
    )
}

function defaultLeftButton() {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    type="button"
                    variant="action-bar-primary"
                    aria-label="Go back"
                    className="size-11"
                    onClick={() => window.history.back()}
                >
                    <ChevronLeft className="size-5" />
                </Button>
            </TooltipTrigger>
            <TooltipContent>Back</TooltipContent>
        </Tooltip>
    )
}

function defaultRightButton() {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    type="button"
                    variant="action-bar-primary"
                    aria-label="More"
                    className="size-11"
                >
                    <MoreHorizontal className="size-5" />
                </Button>
            </TooltipTrigger>
            <TooltipContent>More</TooltipContent>
        </Tooltip>
    )
}