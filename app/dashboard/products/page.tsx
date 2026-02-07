import { getAllStores } from "@/actions/store/get-all-store"
import { StoreCard } from "@/components/dashboard/stores/store-card-display/store-card"
import { Package } from "lucide-react"


export default async function ProductsPage() {
    const res = await getAllStores()

    const stores = res.ok ? res.data : null

    if (!stores) {
        return <div className="flex-1 min-h-0 pb-28 flex items-center justify-center">
            <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-base md:text-lg font-semibold">No stores available</h3>
                <p className="mt-2 text-muted-foreground">
                    Create a store first to start managing products.
                </p>
            </div>
        </div>
    }

    return (
        <div className="flex h-[90dvh] sm:h-[calc(100dvh-var(--header-height)-16px)] flex-col overflow-hidden">
            <div className="@container/main flex flex-1 flex-col gap-4 md:gap-6 min-h-0 p-4 md:p-6">
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Products</h1>
                    <p className="text-muted-foreground">
                        Select a store to manage its products and menu items
                    </p>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto pb-8 sm:pb-0">
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 pb-[var(--mobile-padding-bottom)] sm:pb-0">
                        {stores.map((store) => (
                            <StoreCard
                                key={store.id}
                                store={store}
                                navigatePath={`/dashboard/stores/${store.id}/products`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
