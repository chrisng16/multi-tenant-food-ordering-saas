"use client"

import { MobileActionBar } from "@/components/common/mobile-action-bar"
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

        <div className="flex h-[90dvh] sm:h-[calc(100dvh-var(--header-height)-16px)] flex-col overflow-hidden">
            <div className="@container/main flex flex-1 flex-col min-h-0">
                <div className="flex flex-1 flex-col gap-2 min-h-0">
                    <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6 min-h-0">
                        <div className="flex flex-1 flex-col px-4 lg:px-6 min-h-0">
                            {/* Header */}
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight">My Stores</h1>
                                    <p className="text-muted-foreground">Manage all your stores from one place</p>
                                </div>

                                <div className="hidden sm:block">
                                    <CreateStoreModal />
                                </div>
                            </div>

                            {mockStores.length > 0 ? (
                                <div className="mt-6 flex-1 min-h-0 overflow-y-auto pb-8 sm:pb-0">
                                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                                        {mockStores.map((store) => (
                                            <StoreCard key={store.id} store={store} />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                // Empty state (non-scrolling), still padded so the mobile bar doesn't cover it
                                <div className="mt-6 flex-1 min-h-0 pb-28">
                                    <div className="flex h-full items-center justify-center">
                                        <div className="text-center py-12">
                                            <Store className="mx-auto h-12 w-12 text-muted-foreground" />
                                            <h3 className="mt-4 text-lg font-semibold">No stores yet</h3>
                                            <p className="mt-2 text-muted-foreground">Get started by creating your first store.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile fixed bottom action bar */}
            <MobileActionBar>
                <CreateStoreModal />
            </MobileActionBar>
        </div>
    )
}
