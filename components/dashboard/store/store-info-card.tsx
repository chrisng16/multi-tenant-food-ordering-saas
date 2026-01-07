"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit } from "lucide-react"

interface StoreInfoCardProps {
    store: {
        name: string
        slug: string
        description?: string
    }
    onEdit: () => void
}

export function StoreInfoCard({ store, onEdit }: StoreInfoCardProps) {
    return (
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onEdit}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    Store Information
                    <Edit className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
                <CardDescription>
                    Basic details about your store. Click to edit.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <label className="text-sm font-medium">Store Name</label>
                    <p className="text-sm text-muted-foreground">{store.name}</p>
                </div>
                <div>
                    <label className="text-sm font-medium">Store URL</label>
                    <p className="text-sm text-muted-foreground">{store.slug}.app.com</p>
                </div>
                {store.description && (
                    <div>
                        <label className="text-sm font-medium">Description</label>
                        <p className="text-sm text-muted-foreground">{store.description}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}