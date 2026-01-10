
"use client"

import { notFound } from "next/navigation"
import { use } from "react"

import { MobileActionBar } from "@/components/dashboard/common/mobile-action-bar"
import MABTemplate from "@/components/dashboard/common/mobile-action-bar/mab-template"
import { ActionBarQuickActions, ManageStoreView } from "@/components/dashboard/stores/manage-store-view"

// Mock data - in real app, this would come from API/database
const mockStores = [
    { id: "1", name: "My Awesome Store", slug: "my-awesome-store", description: "A great place to shop!" },
    { id: "2", name: "Tech Hub", slug: "tech-hub", description: "Latest gadgets and electronics" },
]

interface StorePageProps {
    params: Promise<{
        storeId: string
    }>
}

export default function StorePage({ params }: StorePageProps) {
    const { storeId } = use(params)

    console.log(storeId)

    // Find the current store
    const store = mockStores.find(s => s.id === storeId)

    if (!store) {
        notFound()
    }

    return (
        <>
            <ManageStoreView store={store} />
            <MobileActionBar>
                <MABTemplate showRightButton={false} >
                    <ActionBarQuickActions store={store} />
                </MABTemplate>
            </MobileActionBar >
        </>
    )
}
