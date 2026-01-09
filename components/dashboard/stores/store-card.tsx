"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Store } from "lucide-react"
import { useRouter } from "next/navigation"

interface StoreCardProps {
    store: {
        id: string
        name: string
        slug: string
        description?: string
    }
    navigatePath?: string
}

export function StoreCard({ store, navigatePath }: StoreCardProps) {
    const router = useRouter()

    const handleClick = () => {
        const path = navigatePath || `/dashboard/stores/${store.id}`
        router.push(path)
    }

    return (
        <Card
            className="cursor-pointer hover:shadow-md transition-all duration-200"
            onClick={handleClick}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Store className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">{store.name}</CardTitle>
                            <CardDescription className="text-sm">
                                {store.slug}.app.com
                            </CardDescription>
                        </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                        Active
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                {store.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {store.description}
                    </p>
                )}
            </CardContent>
        </Card>
    )
}