"use client"

import { addProduct } from "@/actions/product/add-product"
import MABTemplate from "@/components/dashboard/common/mobile-action-bar/mab-template"
import { MobileActionBar } from "@/components/dashboard/common/mobile-action-bar/mobile-action-bar"
import QuickActionButton from "@/components/dashboard/common/mobile-action-bar/quick-action-button"
import { AddProductFormV2 } from "@/components/dashboard/products/add-product-form-v2"
import ProductCardDisplay from "@/components/dashboard/products/product-card-display"
import { Button } from "@/components/ui/button"
import { AddProductFormData } from "@/schemas/product"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Save, X } from "lucide-react"
import { use, useState } from "react"
import { toast } from "sonner"

interface StoreProductsPageProps {
    params: Promise<{
        storeId: string
    }>
}

export default function StoreProductsPage({ params }: StoreProductsPageProps) {
    const { storeId } = use(params)
    const [showAddForm, setShowAddForm] = useState<boolean>(false)
    const [newProduct, setNewProduct] = useState<AddProductFormData | null>(null)

    const queryClient = useQueryClient();
    const handleAddProduct = () => setShowAddForm(true)
    const { isPending, mutateAsync } = useMutation({
        mutationFn: (newProduct: AddProductFormData) => addProduct(storeId, newProduct),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products', storeId] }),
    });

    const handleSubmit = () => {
        console.log("Product added:", newProduct)

        if (newProduct) {
            toast.promise(
                mutateAsync(newProduct),
                {
                    loading: 'Adding product...',
                    success: (data) => {
                        console.log("Product added successfully:", data)
                        setShowAddForm(false)
                        setNewProduct(null)
                        return 'Product added successfully!'
                    },
                    error: (error) => {
                        console.error("Error adding product:", error)
                        return 'Failed to add product. Please try again.'
                    }
                }
            )
        }
    }

    const handleCancelAdd = () => setShowAddForm(false)

    return (
        <>
            {!showAddForm && (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-4 md:p-6 pb-0 md:pb-0">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold tracking-tight">Products</h1>
                        <p className="text-muted-foreground">Manage your store's products and menu items</p>
                    </div>
                    <Button onClick={handleAddProduct} className="hidden sm:flex sm:w-auto">
                        <Plus className="size-4" />
                        Add Product
                    </Button>
                </div >
            )
            }
            <div className="px-4 md:px-6">
                {showAddForm ? (
                    <AddProductFormV2
                        onChange={setNewProduct}
                        onCancel={handleCancelAdd}
                        onSubmit={handleSubmit}
                    />
                ) :
                    <ProductCardDisplay storeId={storeId} />
                }
            </div>

            {showAddForm && <div className="sticky bottom-0 bg-background hidden sm:flex gap-3 sm:justify-end border-t p-4">
                <Button
                    type="submit"
                    className="flex-1 sm:flex-none"
                    onClick={handleSubmit}
                    disabled={isPending}
                >
                    <Save className="size-4" />
                    {isPending ? "Saving..." : "Save Store"}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    className="flex-1 sm:flex-none"
                    onClick={() => window.history.back()}
                >
                    Cancel
                </Button>
            </div>}

            <MobileActionBar>
                {showAddForm ?
                    <MABTemplate showRightButton={false} leftButton={<LeftButton onClick={() => setShowAddForm(false)} />}>
                        <QuickActionButton className="w-full" onClick={handleSubmit} icon={Save} label={"Save Product"} ariaLabel={"Create Product"} />
                    </MABTemplate> :
                    <MABTemplate showRightButton={false} showLeftButton={false}>
                        <QuickActionButton className="w-full" onClick={() => setShowAddForm(true)} label={"Add Product"} ariaLabel={"Add Product"} icon={Plus} />
                    </MABTemplate>
                }
            </MobileActionBar >

        </>
    )
}

function LeftButton({ onClick }: { onClick: () => void }) {
    return <QuickActionButton ariaLabel={"Cancel"} icon={X} onClick={onClick} />
}