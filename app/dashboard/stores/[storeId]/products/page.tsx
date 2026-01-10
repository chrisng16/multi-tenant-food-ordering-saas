"use client"

import { MobileActionBar } from "@/components/dashboard/common/mobile-action-bar"
import { AddProductForm } from "@/components/dashboard/products/add-product-form"
import { ProductCard } from "@/components/dashboard/products/product-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { use, useState } from "react"

// Mock data - in real app, this would come from API/database
const mockProducts: Record<string, any[]> = {
    "1": [
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
        }
    ],
    "2": [
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
}

interface StoreProductsPageProps {
    params: Promise<{
        storeId: string
    }>
}

export default function StoreProductsPage({ params }: StoreProductsPageProps) {
    const { storeId } = use(params)
    const [showAddForm, setShowAddForm] = useState(false)
    const [products, setProducts] = useState(mockProducts)

    const handleAddProduct = () => {
        setShowAddForm(true)
    }

    const handleProductAdded = (newProduct: any) => {
        setProducts(prev => ({ ...prev, [storeId]: [...prev[storeId], { ...newProduct, id: Date.now().toString() }] }))
        setShowAddForm(false)
    }

    const handleCancelAdd = () => {
        setShowAddForm(false)
    }

    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                        <p className="text-muted-foreground">
                            Manage your store's products and menu items
                        </p>
                    </div>
                    <Button onClick={handleAddProduct} className="w-full sm:w-auto">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Product
                    </Button>
                </div>

                {showAddForm ? (
                    <AddProductForm
                        onProductAdded={handleProductAdded}
                        onCancel={handleCancelAdd}
                    />
                ) : (
                    <>
                        {products[storeId].length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {products[storeId].map((product) => (
                                    <ProductCard key={product.id} product={product} storeId={storeId} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="mx-auto h-12 w-12 text-muted-foreground">
                                    <Plus className="h-full w-full" />
                                </div>
                                <h3 className="mt-4 text-lg font-semibold">No products yet</h3>
                                <p className="mt-2 text-muted-foreground">
                                    Get started by adding your first product.
                                </p>
                                <Button onClick={handleAddProduct} className="mt-4">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Your First Product
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Mobile fixed bottom action bar */}
            <MobileActionBar>
                <Button onClick={handleAddProduct} className="w-full">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Add Product</span>
                    <span className="sm:hidden">Add</span>
                </Button>
            </MobileActionBar>
        </div>
    )
}