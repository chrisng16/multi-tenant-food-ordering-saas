"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Store } from "@/db/schema"
import { ExternalLink, StoreIcon } from "lucide-react"
import Link from "next/link"

interface StoreCardProps {
    store: Store
    navigatePath?: string
}

export function StoreCard({ store, navigatePath }: StoreCardProps) {
    const path = navigatePath || `/dashboard/stores/${store.id}`

    return (
        <Link href={path} className="block group">
            <Card className="h-full transition-all duration-200 hover:shadow-lg hover:border-primary/20">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="p-2.5 bg-primary/10 rounded-lg transition-colors group-hover:bg-primary/15 shrink-0">
                                <StoreIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <CardTitle className="text-base md:text-lg truncate">
                                    {store.name}
                                </CardTitle>
                                <CardDescription className="text-sm flex items-center gap-1.5 mt-1">
                                    <span className="truncate">{store.slug}.app.com</span>
                                    <ExternalLink className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </CardDescription>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                {store.description && (
                    <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {store.description}
                        </p>
                    </CardContent>
                )}
            </Card>
        </Link>
    )
}