"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Store } from "lucide-react"
import { StoreForm } from "./store-form"

interface CreateStoreViewProps {
    loading: boolean
}

export function CreateStoreView({ loading }: CreateStoreViewProps) {
    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <div className="px-4 lg:px-6">
                        <Card className="max-w-2xl mx-auto">
                            <CardHeader className="text-center">
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                    <Store className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="text-2xl">Create Your Store</CardTitle>
                                <CardDescription>
                                    Set up your business to start managing your products and orders
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <StoreForm mode="create" loading={loading} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}