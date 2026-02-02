"use client"
import { getAllProducts } from "@/actions/product/get-all-products"
import { Skeleton } from "@/components/ui/skeleton"
import { Product } from "@/db/schema"
import { useQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { ProductCard } from "./product-card"

export default function ProductCardDisplay({ storeId }: { storeId: string }) {

    const { status, data: result } = useQuery({
        queryKey: ["products", storeId],
        queryFn: () => getAllProducts(storeId)
    })

    const [products, setProducts] = useState<Product[]>([])

    useEffect(() => {
        if (result?.ok && result.data) {
            const products = result.data
            setProducts(products)
        }
    }, [result])

    if (status === "pending") {
        return (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 pb-[var(--mobile-padding-bottom)] sm:pb-0">
                {Array.from({ length: 6 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                ))}
            </div>
        )
    }

    if (!result?.ok)
        return <div>Error loading products. {result?.error.message}</div>


    return (products.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 pb-[var(--mobile-padding-bottom)] sm:pb-4 md:pb-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} storeId={storeId} />
            ))}
        </div>
    ) : (
        <div className="flex-1 min-h-0 pb-28 flex items-center justify-center">
            <div className="text-center py-12">
                <Plus className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-base md:text-lg font-semibold">
                    No products yet
                </h3>
                <p className="mt-2 text-muted-foreground">
                    Get started by adding your first product.
                </p>
            </div>
        </div>
    ))
}

function ProductCardSkeleton() {
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