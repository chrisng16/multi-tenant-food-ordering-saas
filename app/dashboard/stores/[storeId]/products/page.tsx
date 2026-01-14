"use client"

import { MobileActionBar } from "@/components/dashboard/common/mobile-action-bar"
import MABTemplate from "@/components/dashboard/common/mobile-action-bar/mab-template"
import { AddProductForm } from "@/components/dashboard/products/add-product-form"
import { ProductCard } from "@/components/dashboard/products/product-card"
import QuickActionButton from "@/components/dashboard/stores/quick-action-button"
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
                        { id: "extra_cheese", name: "Extra Cheese", price: 1.5 }
                    ]
                }
            ]
        },
        {
            id: "2",
            name: "Pepperoni Pizza",
            description: "Classic pizza topped with mozzarella and spicy pepperoni",
            price: 13.99,
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
                    id: "extra_toppings",
                    name: "Extra Toppings",
                    required: false,
                    options: [
                        { id: "extra_pepperoni", name: "Extra Pepperoni", price: 2 },
                        { id: "mushrooms", name: "Mushrooms", price: 1 }
                    ]
                }
            ]
        },
        {
            id: "3",
            name: "BBQ Chicken Pizza",
            description: "BBQ sauce, grilled chicken, red onions, and mozzarella",
            price: 14.99,
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
                }
            ]
        },
        {
            id: "4",
            name: "Veggie Pizza",
            description: "Bell peppers, onions, olives, mushrooms, and mozzarella",
            price: 13.49,
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
                }
            ]
        },
        {
            id: "5",
            name: "Caesar Salad",
            description: "Crisp romaine lettuce with Caesar dressing, croutons, and parmesan",
            price: 8.99,
            category: "Salads",
            image: "/api/placeholder/300/200",
            isAvailable: true,
            subOptions: [
                {
                    id: "add_protein",
                    name: "Add Protein",
                    required: false,
                    options: [
                        { id: "chicken", name: "Grilled Chicken", price: 3 },
                        { id: "shrimp", name: "Shrimp", price: 4 }
                    ]
                }
            ]
        },
    ],
    "2": [
        {
            id: "6",
            name: "Greek Salad",
            description: "Tomatoes, cucumbers, olives, red onions, and feta cheese",
            price: 9.49,
            category: "Salads",
            image: "/api/placeholder/300/200",
            isAvailable: true,
            subOptions: []
        },
        {
            id: "7",
            name: "Garlic Bread",
            description: "Toasted bread with garlic butter and herbs",
            price: 4.99,
            category: "Sides",
            image: "/api/placeholder/300/200",
            isAvailable: true,
            subOptions: [
                {
                    id: "add_cheese",
                    name: "Add Cheese",
                    required: false,
                    options: [
                        { id: "mozzarella", name: "Mozzarella Cheese", price: 1.5 }
                    ]
                }
            ]
        },
        {
            id: "8",
            name: "Chicken Wings",
            description: "Crispy wings tossed in your choice of sauce",
            price: 11.99,
            category: "Appetizers",
            image: "/api/placeholder/300/200",
            isAvailable: true,
            subOptions: [
                {
                    id: "sauce",
                    name: "Sauce",
                    required: true,
                    options: [
                        { id: "buffalo", name: "Buffalo", price: 0 },
                        { id: "bbq", name: "BBQ", price: 0 },
                        { id: "garlic_parmesan", name: "Garlic Parmesan", price: 0 }
                    ]
                }
            ]
        },
        {
            id: "9",
            name: "French Fries",
            description: "Golden, crispy fries served with ketchup",
            price: 4.49,
            category: "Sides",
            image: "/api/placeholder/300/200",
            isAvailable: true,
            subOptions: []
        },
        {
            id: "10",
            name: "Chocolate Lava Cake",
            description: "Warm chocolate cake with a molten center",
            price: 6.99,
            category: "Desserts",
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

    const handleAddProduct = () => setShowAddForm(true)
    const handleProductAdded = (newProduct: any) => {
        setProducts(prev => ({ ...prev, [storeId]: [...prev[storeId], { ...newProduct, id: Date.now().toString() }] }))
        setShowAddForm(false)
    }
    const handleCancelAdd = () => setShowAddForm(false)

    return (
        <>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Products</h1>
                    <p className="text-muted-foreground">Manage your store's products and menu items</p>
                </div>
                {!showAddForm && (
                    <Button onClick={handleAddProduct} className="hidden sm:flex sm:w-auto">
                        <Plus className="size-4" />
                        Add Product
                    </Button>
                )}
            </div>

            {showAddForm ? (
                <>
                    <AddProductForm
                        onProductAdded={handleProductAdded}
                        onCancel={handleCancelAdd}
                    />
                </>

            ) :
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 pb-[var(--mobile-padding-bottom)] sm:pb-0">
                    {products[storeId].length > 0 ? (
                        products[storeId].map((product) => (
                            <ProductCard key={product.id} product={product} storeId={storeId} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <div className="mx-auto h-12 w-12 text-muted-foreground">
                                <Plus className="h-full w-full" />
                            </div>
                            <h3 className="mt-4 text-base md:text-lg font-semibold">No products yet</h3>
                            <p className="mt-2 text-muted-foreground">
                                Get started by adding your first product.
                            </p>
                            {!showAddForm && (
                                <Button onClick={handleAddProduct} className="mt-4">
                                    <Plus className="size-4" />
                                    Add Your First Product
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            }
            {!showAddForm &&
                <MobileActionBar>
                    <MABTemplate showRightButton={false} showLeftButton={false}>
                        <QuickActionButton className="w-full" onClick={() => setShowAddForm(true)} label={"Add Product"} ariaLabel={"Add Product"} icon={Plus} />
                    </MABTemplate>
                </MobileActionBar >
            }
        </>
    )
}