"use client"

import { getStore } from "@/actions/store/get-store"
import { updateStore } from "@/actions/store/update-store"; // You'll need this action
import { WeekHours, defaultWeekHours } from "@/components/dashboard/stores/business-hours/time-utils"
import { EditStoreView } from "@/components/dashboard/stores/edit-store-view"
import { ClientActionError } from "@/lib/action/client-action-error"
import { unwrapActionResult } from "@/lib/action/unwrap-action-result"
import { StoreSchema } from "@/schemas/store"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { notFound, useRouter } from "next/navigation"
import { use, useEffect, useState } from "react"
import { toast } from "sonner"
import EditStoreSkeleton from "@/components/dashboard/stores/edit-store-skeleton"

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

    const [hours, setHours] = useState<WeekHours>(defaultWeekHours)
    const [storeDetails, setStoreDetails] = useState<StoreSchema | undefined>()

    useEffect(() => {
        if (result?.ok && result.data) {
            const store = result.data
            setStoreDetails({
                name: store.name,
                slug: store.slug,
                logoUrl: store.logoUrl || undefined,
                description: store.description || undefined,
                timezone: store.timezone,
                phone: store.phone || undefined,
                email: store.email || undefined,
                address: store.address || undefined,
            })
            // Also set hours if they exist in the store data
            // setHours(store.hours || defaultWeekHours)
        }
    }, [result])

    const { isPending, mutate } = useMutation({
        mutationFn: async ({
            storeDetails,
            hours,
        }: {
            storeDetails: StoreSchema
            hours: WeekHours
        }) => unwrapActionResult(await updateStore(storeId, storeDetails)),
        onSuccess: () => {
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

    const handleSubmit = () => {
        if (!storeDetails) {
            toast.error("Store details are missing")
            return
        }
        console.log("Submitting store details:", storeDetails, "Hours:", hours)
        mutate({ storeDetails, hours })
    }

    const store = result?.ok ? result.data : null

    if (status === "pending") {
        return <EditStoreSkeleton />
    }

    if (!result?.ok || !store) {
        return notFound()
    }

    return (
        <EditStoreView
            store={store}
            hours={hours}
            setHours={setHours}
            storeDetails={storeDetails}
            setStoreDetails={setStoreDetails}
            onSubmit={handleSubmit}
            isSubmitting={isPending}
        />
    )
}