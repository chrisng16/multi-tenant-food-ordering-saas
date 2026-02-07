"use client"

import { getAllProducts } from "@/actions/product/get-all-products"
import { Skeleton } from "@/components/ui/skeleton"
import { Product } from "@/db/schema"
import { useQuery } from "@tanstack/react-query"
import { Package2 } from "lucide-react"
import { useEffect, useState } from "react"
import { ProductCard } from "./product-card"
import { ProductListItem } from "./product-list-item"
import { ViewMode, ViewToggle } from "./view-toggle"

export default function ProductsDisplay({ storeId }: { storeId: string }) {
    const { status, data: result } = useQuery({
        queryKey: ["products", storeId],
        queryFn: () => getAllProducts(storeId)
    })

    const [products, setProducts] = useState<Product[]>([])
    const [view, setView] = useState<ViewMode>("grid")

    useEffect(() => {
        if (result?.ok && result.data) {
            const products = result.data
            setProducts(products)
        }
    }, [result])

    // Load view preference from localStorage
    useEffect(() => {
        const savedView = localStorage.getItem("productView") as ViewMode
        if (savedView) {
            setView(savedView)
        }
    }, [])

    // Save view preference to localStorage
    const handleViewChange = (newView: ViewMode) => {
        setView(newView)
        localStorage.setItem("productView", newView)
    }

    if (status === "pending") {
        return (
            <div className="space-y-4 pb-[var(--mobile-padding-bottom)] sm:pb-0">
                <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
                    <div>
                        <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Products</h2>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Loading...</p>
                    </div>
                    <ViewToggle view={view} onViewChange={handleViewChange} />
                </div>
                {view === "grid" ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <div>
                        <ListViewHeader />
                        <div>
                            {Array.from({ length: 8 }).map((_, i) => (
                                <ProductListSkeleton key={i} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )
    }

    if (!result?.ok)
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <p className="text-sm text-red-600 dark:text-red-400">Error loading products</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{result?.error.message}</p>
                </div>
            </div>
        )

    return products.length > 0 ? (
        <div className="space-y-0 pb-[var(--mobile-padding-bottom)] sm:pb-0">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 sticky top-0 z-10">
                <div>
                    <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Products</h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                        {products.length} {products.length === 1 ? 'item' : 'items'}
                    </p>
                </div>
                <ViewToggle view={view} onViewChange={handleViewChange} />
            </div>

            {view === "grid" ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} storeId={storeId} />
                    ))}
                </div>
            ) : (
                <div>
                    <ListViewHeader />
                    <div>
                        {products.map((product) => (
                            <ProductListItem key={product.id} product={product} storeId={storeId} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    ) : (
        <div className="flex-1 min-h-0 pb-28 flex items-center justify-center">
            <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center mb-4">
                    <Package2 className="h-8 w-8 text-neutral-400 dark:text-neutral-600" />
                </div>
                <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                    No products yet
                </h3>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    Get started by adding your first product
                </p>
            </div>
        </div>
    )
}

function ListViewHeader() {
    return (
        <div className="hidden md:block bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800">
            <div className="px-6 py-3">
                <div className="flex items-center gap-6">
                    <div className="w-2" /> {/* Status indicator space */}
                    <div className="flex-1 grid grid-cols-12 gap-4">
                        <div className="col-span-5">
                            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                Product
                            </p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                SKU
                            </p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                Price
                            </p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                Status
                            </p>
                        </div>
                        <div className="col-span-1" /> {/* Actions space */}
                    </div>
                </div>
            </div>
        </div>
    )
}

function ProductCardSkeleton() {
    return (
        <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <Skeleton className="h-1 w-full" />
            <div className="p-5 space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/3" />
                </div>
                <Skeleton className="h-10 w-full" />
                <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-5 w-20" />
                </div>
            </div>
        </div>
    )
}

function ProductListSkeleton() {
    return (
        <div className="border-b border-neutral-200 dark:border-neutral-800">
            <div className="px-6 py-4">
                <div className="flex items-center gap-6">
                    <Skeleton className="w-2 h-2 rounded-full" />
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-5 space-y-2">
                            <Skeleton className="h-3 w-48" />
                            <Skeleton className="h-3 w-64" />
                        </div>
                        <div className="md:col-span-2">
                            <Skeleton className="h-3 w-20" />
                        </div>
                        <div className="md:col-span-2">
                            <Skeleton className="h-3 w-16" />
                        </div>
                        <div className="md:col-span-2">
                            <Skeleton className="h-5 w-20" />
                        </div>
                        <div className="md:col-span-1 flex justify-end">
                            <Skeleton className="h-8 w-8" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}