"use client"

import { StoreCard } from "@/components/dashboard/stores/store-card"
import { Button } from "@/components/ui/button"
import { Plus, Store } from "lucide-react"
import { useRouter } from "next/navigation"

// Mock data - in real app, this would come from API/database
const mockStores = [
    { id: "1", name: "My Awesome Store", slug: "my-awesome-store", description: "A great place to shop!" },
    { id: "2", name: "Tech Hub", slug: "tech-hub", description: "Latest gadgets and electronics" },
]

export default function StoresPage() {
    const router = useRouter()

    const handleAddStore = () => {
        // In a real app, this would open a create store modal or navigate to create page
        console.log("Add new store")
        // For now, just redirect to the first store (this would be replaced with proper create flow)
        if (mockStores.length > 0) {
            router.push(`/dashboard/stores/${mockStores[0].id}`)
        }
    }

    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <div className="px-4 lg:px-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">My Stores</h1>
                                <p className="text-muted-foreground">
                                    Manage all your stores from one place
                                </p>
                            </div>
                            <Button onClick={handleAddStore} className="w-full sm:w-auto">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Store
                            </Button>
                        </div>

                        {mockStores.length > 0 ? (
                            <div className="mt-6">
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {mockStores.map((store) => (
                                        <StoreCard key={store.id} store={store} />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="mt-6">
                                <div className="text-center py-12">
                                    <Store className="mx-auto h-12 w-12 text-muted-foreground" />
                                    <h3 className="mt-4 text-lg font-semibold">No stores yet</h3>
                                    <p className="mt-2 text-muted-foreground">
                                        Get started by creating your first store.
                                    </p>
                                    <Button onClick={handleAddStore} className="mt-4">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Your First Store
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}