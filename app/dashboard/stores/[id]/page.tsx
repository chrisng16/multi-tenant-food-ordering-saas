
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { notFound } from "next/navigation"
import { use, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"

import { ManageStoreView } from "@/components/dashboard/store/manage-store-view"
import { type StoreFormData, storeSchema } from "@/schemas/auth"

// Mock data - in real app, this would come from API/database
const mockStores = [
    { id: "1", name: "My Awesome Store", slug: "my-awesome-store", description: "A great place to shop!" },
    { id: "2", name: "Tech Hub", slug: "tech-hub", description: "Latest gadgets and electronics" },
]

interface StorePageProps {
    params: Promise<{
        id: string
    }>
}

export default function StorePage({ params }: StorePageProps) {
    const { id: storeId } = use(params)

    // Find the current store
    const store = mockStores.find(s => s.id === storeId)

    if (!store) {
        notFound()
    }

    const [loading, setLoading] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

    const form = useForm<StoreFormData>({
        resolver: zodResolver(storeSchema),
        defaultValues: {
            name: "",
            slug: "",
            description: "",
        },
        mode: "onBlur",
    })

    const { handleSubmit } = form

    const onSubmit = async (data: StoreFormData) => {
        setLoading(true)
        try {
            if (store) {
                // Update existing store
                console.log("Updating store:", data)
                toast.success("Store updated successfully!")
                // In real app, update the store in the database
            } else {
                // Create new store
                console.log("Creating store:", data)
                toast.success("Store created successfully!")
            }
        } catch (_error) {
            toast.error(store ? "Failed to update store" : "Failed to create store")
        } finally {
            setLoading(false)
        }
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <ManageStoreView
                    store={store}
                    loading={loading}
                    isEditDialogOpen={isEditDialogOpen}
                    setIsEditDialogOpen={setIsEditDialogOpen}
                />
            </form>
        </FormProvider>
    )
}
