"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Product } from "@/db/schema"
import { Edit, Package } from "lucide-react"
import Link from "next/link"

interface ProductCardProps {
    product: Product
    storeId?: string
}

export function ProductCard({ product, storeId }: ProductCardProps) {
    const cardContent = (
        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary/20">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-base md:text-lg">{product.name}</CardTitle>
                            <CardDescription className="text-sm">
                                ${product.price}
                            </CardDescription>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant={product.isAvailable ? "default" : "secondary"}>
                            {product.isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                        <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {product.description}
                </p>
            </CardContent>
        </Card>
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