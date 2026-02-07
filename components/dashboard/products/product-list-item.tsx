"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Product } from "@/db/schema"
import { centsToDollars } from "@/lib/utils/utils"
import { MoreVertical } from "lucide-react"
import Link from "next/link"

interface ProductListItemProps {
    product: Product
    storeId?: string
}

export function ProductListItem({ product, storeId }: ProductListItemProps) {
    const listContent = (
        <div className="group bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors duration-150 cursor-pointer">
            <div className="px-6 py-4">
                <div className="flex items-center gap-6">
                    {/* Status Indicator */}
                    <div className="flex-shrink-0">
                        <div className={`w-2 h-2 rounded-full ${product.isAvailable ? 'bg-emerald-500' : 'bg-neutral-300 dark:bg-neutral-600'}`} />
                    </div>

                    {/* Product Info - Flex Basis for Consistent Widths */}
                    <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        {/* Name & Description */}
                        <div className="md:col-span-5 min-w-0">
                            <h3 className="font-medium text-sm text-neutral-900 dark:text-neutral-100 mb-0.5 truncate">
                                {product.name}
                            </h3>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                                {product.description || "No description"}
                            </p>
                        </div>

                        {/* SKU */}
                        <div className="md:col-span-2 hidden md:block">
                            {product.sku ? (
                                <p className="text-xs font-mono text-neutral-600 dark:text-neutral-400 truncate">
                                    {product.sku}
                                </p>
                            ) : (
                                <p className="text-xs text-neutral-400 dark:text-neutral-600">—</p>
                            )}
                        </div>

                        {/* Price */}
                        <div className="md:col-span-2">
                            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">
                                ${centsToDollars(product.price)}
                            </p>
                        </div>

                        {/* Status Badge */}
                        <div className="md:col-span-2">
                            <Badge
                                variant={product.isAvailable ? "default" : "secondary"}
                                className={product.isAvailable
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800 text-xs"
                                    : "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700 text-xs"
                                }
                            >
                                {product.isAvailable ? "In Stock" : "Out of Stock"}
                            </Badge>
                        </div>

                        {/* Actions */}
                        <div className="md:col-span-1 flex justify-end">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <MoreVertical className="h-4 w-4 text-neutral-400" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    if (storeId) {
        return (
            <Link href={`/dashboard/stores/${storeId}/products/${product.id}`}>
                {listContent}
            </Link>
        )
    }

    return listContent
}