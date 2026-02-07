"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Product } from "@/db/schema"
import { centsToDollars } from "@/lib/utils/utils"
import { MoreVertical } from "lucide-react"
import Link from "next/link"

interface ProductCardProps {
    product: Product
    storeId?: string
}

export function ProductCard({ product, storeId }: ProductCardProps) {
    const cardContent = (
        <div className="group relative bg-white dark:bg-neutral-950 border rounded-lg overflow-hidden hover:shadow-lg hover:border-neutral-100/20 transition-all duration-250 cursor-pointer">
            <div className="p-5">
                {/* Title and Actions */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0 pr-3">
                        <h3 className="font-semibold text-base text-neutral-900 dark:text-neutral-100 mb-1 truncate">
                            {product.name}
                        </h3>
                        {product.sku && (
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                                {product.sku}
                            </p>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <MoreVertical className="h-4 w-4 text-neutral-400" />
                    </Button>
                </div>

                {/* Description */}
                <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-4 min-h-[40px]">
                    {product.description || "No description available"}
                </p>

                {/* Footer with Price and Status */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800">
                    <div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Price</p>
                        <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                            ${centsToDollars(product.price)}
                        </p>
                    </div>
                    <Badge
                        variant={product.isAvailable ? "default" : "secondary"}
                        className={product.isAvailable
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800"
                            : "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700"
                        }
                    >
                        {product.isAvailable ? "In Stock" : "Out of Stock"}
                    </Badge>
                </div>
            </div>
        </div>
    )

    if (storeId) {
        return (
            <Link href={`/dashboard/stores/${storeId}/products/${product.id}`}>
                {cardContent}
            </Link>
        )
    }

    return cardContent
}