"use client"

import { MobileActionBar } from "@/components/dashboard/common/mobile-action-bar"
import MABTemplate from "@/components/dashboard/common/mobile-action-bar/mab-template"
import CreateStoreButton from "@/components/dashboard/stores/create-store-button"
import { CreateStoreModal } from "@/components/dashboard/stores/create-store-modal"
import { StoreCard } from "@/components/dashboard/stores/store-card"
import { Store } from "lucide-react"

// Mock data - in real app, this would come from API/database
const mockStores = [
    { id: "1", name: "My Awesome Store", slug: "my-awesome-store", description: "A great place to shop!" },
    { id: "2", name: "Tech Hub", slug: "tech-hub", description: "Latest gadgets and electronics" },
    { id: "4", name: "Home Essentials", slug: "home-essentials", description: "Everything you need for your home" },
    { id: "5", name: "Book Haven", slug: "book-haven", description: "A paradise for book lovers" },
    { id: "6", name: "Fitness Factory", slug: "fitness-factory", description: "Gear and equipment for an active lifestyle" },
    { id: "7", name: "Beauty Bliss", slug: "beauty-bliss", description: "Skincare, makeup, and self-care products" },
    { id: "8", name: "Pet Paradise", slug: "pet-paradise", description: "Supplies and treats for your furry friends" }
]

export default function StoresPage() {
    return (
        <>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">My Stores</h1>
                    <p className="text-muted-foreground">Manage all your stores from one place</p>
                </div>

                <div className="hidden sm:block">
                    <CreateStoreModal />
                </div>
            </div>

            {mockStores.length > 0 ? (

                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 pb-[var(--mobile-padding-bottom)] sm:pb-0">
                    {mockStores.map((store) => (
                        <StoreCard key={store.id} store={store} />
                    ))}
                </div>

            ) : (
                // Empty state (non-scrolling), still padded so the mobile bar doesn't cover it
                <div className="flex-1 min-h-0 pb-28 flex items-center justify-center">
                    <div className="text-center py-12">
                        <Store className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">No stores yet</h3>
                        <p className="mt-2 text-muted-foreground">Get started by creating your first store.</p>
                    </div>
                </div>
            )}

            <MobileActionBar>
                <MABTemplate showRightButton={false} showLeftButton={false}>
                    <CreateStoreButton />
                </MABTemplate>
            </MobileActionBar >
        </>
    )
}
