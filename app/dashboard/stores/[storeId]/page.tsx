
"use client"

import { notFound } from "next/navigation"
import { use, useState } from "react"

import { WeekHours, defaultWeekHours } from "@/components/dashboard/stores/business-hours/time-utils"
import { EditStoreView } from "@/components/dashboard/stores/edit-store-view"
import { StoreSchema } from "@/schemas/store"

// Mock data - in real app, this would come from API/database
const mockStores = [
    { id: "1", name: "My Awesome Store", slug: "my-awesome-store", description: "A great place to shop!", timezone: "America/Los_Angeles" },
    { id: "2", name: "Tech Hub", slug: "tech-hub", description: "Latest gadgets and electronics", timezone: "America/New_York" },
]

interface StorePageProps {
    params: Promise<{
        storeId: string
    }>
}

export default function StorePage({ params }: StorePageProps) {
    const { storeId } = use(params)

    // Find the current store
    const store = mockStores.find(s => s.id === storeId)

    if (!store) {
        notFound()
    }

    const [hours, setHours] = useState<WeekHours>(defaultWeekHours);
    const [storeDetails, setStoreDetails] = useState<StoreSchema>(store);

    return <EditStoreView store={{ ...storeDetails, id: storeId }} hours={hours} setHours={setHours} setStoreDetails={setStoreDetails} />

}
