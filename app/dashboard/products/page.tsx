"use client"

import { StoreCard } from "@/components/dashboard/stores/store-card"
import { Package } from "lucide-react"

// Mock data - in real app, this would come from API/database
const mockStores = [
    { id: "1", name: "My Awesome Store", slug: "my-awesome-store", description: "A great place to shop!" },
    { id: "2", name: "Tech Hub", slug: "tech-hub", description: "Latest gadgets and electronics" },
]

export default function ProductsPage() {
    return (
        <div className="flex h-[90dvh] sm:h-[calc(100dvh-var(--header-height)-16px)] flex-col overflow-hidden">
            <div className="@container/main flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6 min-h-0 px-4 lg:px-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                    <p className="text-muted-foreground">
                        Select a store to manage its products and menu items
                    </p>
                </div>

                {mockStores.length > 0 ? (
                    <div className="flex-1 min-h-0 overflow-y-auto pb-8 sm:pb-0">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {mockStores.map((store) => (
                                <StoreCard
                                    key={store.id}
                                    store={store}
                                    navigatePath={`/dashboard/stores/${store.id}/products`}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 min-h-0 pb-28 flex items-center justify-center">
                        <div className="text-center py-12">
                            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold">No stores available</h3>
                            <p className="mt-2 text-muted-foreground">
                                Create a store first to start managing products.
                            </p>
                        </div>
                    </div>
                )}
            </div>


        </div>
    )
}
