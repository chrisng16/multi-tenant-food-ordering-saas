"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { BarChart3, Plus, ShoppingCart, Store } from "lucide-react"
import { StoreForm } from "./store-form"
import { StoreInfoCard } from "./store-info-card"

interface ManageStoreViewProps {
    store: {
        id: string
        name: string
        slug: string
        description?: string
    }
    loading: boolean
    isEditDialogOpen: boolean
    setIsEditDialogOpen: (open: boolean) => void
}

export function ManageStoreView({
    store,
    loading,
    isEditDialogOpen,
    setIsEditDialogOpen
}: ManageStoreViewProps) {
    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <div className="px-4 lg:px-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Store Management</h1>
                                <p className="text-muted-foreground">
                                    Manage your store settings and preferences
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                        <Plus className="mr-2 h-4 w-4" />
                                        <span className="hidden sm:inline">Add Product</span>
                                        <span className="sm:hidden">Product</span>
                                    </Button>
                                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                        <span className="hidden sm:inline">Manage Orders</span>
                                        <span className="sm:hidden">Orders</span>
                                    </Button>
                                </div>
                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                        <BarChart3 className="mr-2 h-4 w-4" />
                                        <span className="hidden sm:inline">View Analytics</span>
                                        <span className="sm:hidden">Analytics</span>
                                    </Button>
                                    <Button size="sm" className="w-full sm:w-auto">
                                        <Store className="mr-2 h-4 w-4" />
                                        <span className="hidden sm:inline">View Store</span>
                                        <span className="sm:hidden">Store</span>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                <DialogTrigger asChild>
                                    <div>
                                        <StoreInfoCard
                                            store={store}
                                            onEdit={() => setIsEditDialogOpen(true)}
                                        />
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>Edit Store Information</DialogTitle>
                                        <DialogDescription>
                                            Update your store details and settings.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <StoreForm
                                        mode="edit"
                                        loading={loading}
                                        onCancel={() => setIsEditDialogOpen(false)}
                                    />
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}