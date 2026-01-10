"use client"

import { Button } from "@/components/ui/button"
import { use } from "react"

// Mock data - in real app, this would come from API/database
const mockProducts = [
    {
        id: "1",
        name: "Margherita Pizza",
        description: "Classic pizza with tomato sauce, mozzarella, and fresh basil",
        price: 12.99,
        category: "Pizza",
        image: "/api/placeholder/300/200",
        isAvailable: true,
        subOptions: [
            {
                id: "size",
                name: "Size",
                required: true,
                options: [
                    { id: "small", name: "Small (10\")", price: 0 },
                    { id: "medium", name: "Medium (12\")", price: 2 },
                    { id: "large", name: "Large (14\")", price: 4 }
                ]
            },
            {
                id: "extra_cheese",
                name: "Extra Cheese",
                required: false,
                options: [
                    { id: "extra_cheese", name: "Extra Cheese", price: 1.50 }
                ]
            }
        ]
    },
    {
        id: "2",
        name: "Caesar Salad",
        description: "Crisp romaine lettuce with Caesar dressing, croutons, and parmesan",
        price: 8.99,
        category: "Salads",
        image: "/api/placeholder/300/200",
        isAvailable: true,
        subOptions: []
    },
    {
        id: "3",
        name: "Grilled Chicken Burger",
        description: "Juicy grilled chicken breast with lettuce, tomato, and special sauce",
        price: 10.99,
        category: "Burgers",
        image: "/api/placeholder/300/200",
        isAvailable: true,
        subOptions: [
            {
                id: "size",
                name: "Size",
                required: true,
                options: [
                    { id: "regular", name: "Regular", price: 0 },
                    { id: "large", name: "Large", price: 1.50 }
                ]
            }
        ]
    },
    {
        id: "4",
        name: "French Fries",
        description: "Crispy golden french fries with sea salt",
        price: 4.99,
        category: "Sides",
        image: "/api/placeholder/300/200",
        isAvailable: true,
        subOptions: []
    }
]

interface ProductPageProps {
    params: Promise<{
        storeId: string
        productId: string
    }>
}

export default function ProductPage({ params }: ProductPageProps) {
    const { storeId, productId } = use(params)

    // Find the product by ID
    const product = mockProducts.find(p => p.id === productId)

    if (!product) {
        return (
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <div className="px-4 lg:px-6">
                            <div className="text-center py-12">
                                <h3 className="text-base md:text-lg font-semibold">Product not found</h3>
                                <p className="mt-2 text-muted-foreground">
                                    The product you're looking for doesn't exist.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <div className="px-4 lg:px-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{product.name}</h1>
                                <p className="text-muted-foreground">
                                    Manage your product details and options
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline">
                                    Duplicate
                                </Button>
                                <Button variant="outline">
                                    Delete
                                </Button>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <h2 className="text-base md:text-lg font-semibold mb-4">Product Details</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium">Name</label>
                                            <p className="text-sm text-muted-foreground">{product.name}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Description</label>
                                            <p className="text-sm text-muted-foreground">{product.description}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Price</label>
                                            <p className="text-sm text-muted-foreground">${product.price}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Category</label>
                                            <p className="text-sm text-muted-foreground">{product.category}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Availability</label>
                                            <p className="text-sm text-muted-foreground">
                                                {product.isAvailable ? "Available" : "Unavailable"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-base md:text-lg font-semibold mb-4">Options</h2>
                                    {product.subOptions.length > 0 ? (
                                        <div className="space-y-4">
                                            {product.subOptions.map((option) => (
                                                <div key={option.id} className="border rounded-lg p-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h3 className="font-medium">{option.name}</h3>
                                                        <span className={`text-xs px-2 py-1 rounded ${option.required
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-green-100 text-green-800'
                                                            }`}>
                                                            {option.required ? 'Required' : 'Optional'}
                                                        </span>
                                                    </div>
                                                    <div className="space-y-1">
                                                        {option.options.map((opt) => (
                                                            <div key={opt.id} className="flex justify-between text-sm">
                                                                <span>{opt.name}</span>
                                                                <span className="text-muted-foreground">
                                                                    {opt.price > 0 ? `+$${opt.price}` : 'No extra cost'}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No options configured</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}