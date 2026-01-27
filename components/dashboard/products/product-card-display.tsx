"use client"

import { getAllStores } from "@/actions/store/get-all-store"
import { Skeleton } from "@/components/ui/skeleton"
import { useQuery } from "@tanstack/react-query"
import { Store } from "lucide-react"
import { StoreCard } from "./store-card"

export default function StoreCardDisplay() {
    const { data: result, status } = useQuery({
        queryKey: ["stores"],
        queryFn: getAllStores
    })

    if (status === "pending") {
        return (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 pb-[var(--mobile-padding-bottom)] sm:pb-0">
                {Array.from({ length: 6 }).map((_, i) => (
                    <StoreCardSkeleton key={i} />
                ))}
            </div>
        )
    }

    if (!result?.ok)
        return <div>Error loading stores. {result?.error.message}</div>

    const stores = result.data

    return (
        stores.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 pb-[var(--mobile-padding-bottom)] sm:pb-0">
                {stores.map((store) => (
                    <StoreCard key={store.id} store={store} />
                ))}
            </div>
        ) : (
            // Empty state (non-scrolling), still padded so the mobile bar doesn't cover it
            <div className="flex-1 min-h-0 pb-28 flex items-center justify-center">
                <div className="text-center py-12">
                    <Store className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-base md:text-lg font-semibold">
                        No stores yet
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                        Get started by creating your first store.
                    </p>
                </div>
            </div>
        )
    )
}

function StoreCardSkeleton() {
    return (
        <div className="rounded-lg border bg-card p-6 space-y-4">
            <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-10 w-10 rounded-md" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        </div>
    )
}