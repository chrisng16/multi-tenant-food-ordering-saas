"use client"

import StoreForm from "@/components/dashboard/stores/store-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { useState } from "react"

export function CreateStoreModal() {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

    return (
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                    <Plus className="h-4 w-4" />
                    Create Store
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Create Store</DialogTitle>
                    <DialogDescription>
                        Create a new store to start selling your products.
                    </DialogDescription>
                </DialogHeader>
                <StoreForm mode="create" />
            </DialogContent>
        </Dialog>
    )
}