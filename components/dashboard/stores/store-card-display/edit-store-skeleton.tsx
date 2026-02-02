"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function EditStoreSkeleton() {
    return (
        <>
            <div className="flex items-center justify-between p-4 md:p-6 pb-0 md:pb-0">
                <div>
                    <Skeleton className="h-6.5 w-40 mb-2" />
                    <Skeleton className="h-5.5 w-60" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-30 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                </div>
            </div>

            <div className="pb-[var(--mobile-padding-bottom)] sm:pb-0 px-4 md:px-6">
                <div className="bg-card rounded-lg border p-6">
                    <div className="mb-4">
                        <Skeleton className="h-6 w-40 mb-2" />
                        <Skeleton className="h-4 w-60" />
                    </div>

                    <div className="space-y-4">
                        <Skeleton className="h-4 w-30" />
                        <Skeleton className="h-8 w-full" />

                        <Skeleton className="h-4 w-30" />
                        <Skeleton className="h-8 w-full" />

                        <Skeleton className="h-30 w-full" />
                    </div>

                    <div className="hidden sm:flex gap-3 sm:justify-end border-t p-4 mt-6">
                        <Skeleton className="h-10 w-36 rounded-md" />
                        <Skeleton className="h-10 w-24 rounded-md" />
                    </div>
                </div>
            </div>
        </>

    )
}

export default EditStoreSkeleton
