"use client"

import { getStore } from "@/actions/store/get-store";
import { updateStore } from "@/actions/store/update-store";
import { DAY_ORDER, WeekHours } from "@/components/dashboard/stores/business-hours/time-utils";
import { EditStoreView } from "@/components/dashboard/stores/create-edit-store/edit-store-view";
import EditStoreSkeleton from "@/components/dashboard/stores/store-card-display/edit-store-skeleton";
import { ClientActionError } from "@/lib/action/client-action-error";
import { unwrapActionResult } from "@/lib/action/unwrap-action-result";
import { StoreSchema } from "@/schemas/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notFound, useRouter } from "next/navigation";
import { use, useMemo } from "react";
import { toast } from "sonner";

interface StorePageProps {
    params: Promise<{
        storeId: string
    }>
}

export default function StorePage({ params }: StorePageProps) {
    const { storeId } = use(params)
    const router = useRouter()
    const queryClient = useQueryClient()

    const { status, data: result } = useQuery({
        queryKey: ["store", storeId],
        queryFn: () => getStore(storeId)
    })

    const store = result?.ok ? result.data : null

    // Initialize form data from store
    const initialFormData = useMemo(() => {
        if (!store) return null

        const weekHours: WeekHours = {} as WeekHours
        for (const day of DAY_ORDER) {
            const dayRows = store.weeklyRanges
                .filter((r: any) => r.dayOfWeek === day)
                .map((r: any) => ({ startMin: r.startMin, endMin: r.endMin }))
            if (dayRows.length === 0) {
                weekHours[day] = { status: "closed" }
            } else {
                weekHours[day] = { status: "ranges", ranges: dayRows }
            }
        }

        return {
            storeDetails: {
                name: store.name,
                slug: store.slug,
                logoUrl: store.logoUrl || null,
                description: store.description || null,
                timezone: store.timezone,
                phone: store.phone || null,
                email: store.email || null,
                address: store.address || null,
            } as StoreSchema,
            hours: weekHours
        }
    }, [store])

    const { isPending, mutate } = useMutation({
        mutationFn: async ({
            storeDetails,
            hours,
        }: {
            storeDetails: StoreSchema
            hours: WeekHours
        }) => unwrapActionResult(await updateStore(storeId, storeDetails, hours)),
        onSuccess: (res) => {
            console.log("Store updated:", res)
            toast.success("Store successfully updated")
            queryClient.invalidateQueries({ queryKey: ["store", storeId] })
            queryClient.invalidateQueries({ queryKey: ["stores"] })
        },
        onError: (err) => {
            if (err instanceof ClientActionError) {
                if (err.status === 401) {
                    router.push("/sign-in")
                    toast.error(err.message)
                    return
                }
                toast.error(err.message)
                return
            }
            toast.error("Unexpected error")
        },
    })

    if (status === "pending") {
        return <EditStoreSkeleton />
    }

    if (!result?.ok || !store || !initialFormData) {
        return notFound()
    }

    return (
        <EditStoreView
            store={store}
            initialFormData={initialFormData}
            onSubmit={mutate}
            isSubmitting={isPending}
        />
    )
}