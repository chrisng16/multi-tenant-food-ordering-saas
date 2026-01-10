"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Store } from "lucide-react"
import { useRouter } from "next/navigation"

interface StoreSwitcherProps {
    currentStoreId: string
    stores: Array<{
        id: string
        name: string
    }>
}

export function StoreSwitcher({ currentStoreId, stores }: StoreSwitcherProps) {
    const router = useRouter()

    const currentStore = stores.find(store => store.id === currentStoreId)

    if (!currentStore) {
        return null
    }

    const handleStoreChange = (storeId: string) => {
        router.push(`/dashboard/stores/${storeId}`)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-auto p-0 hover:bg-accent">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Store className="h-4 w-4" />
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{currentStore.name}</h1>
                            <ChevronDown className="h-4 w-4" />
                        </div>
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
                {stores.map((store) => (
                    <DropdownMenuItem
                        key={store.id}
                        onClick={() => handleStoreChange(store.id)}
                        className={store.id === currentStoreId ? "bg-accent" : ""}
                    >
                        <Store className="mr-2 h-4 w-4" />
                        {store.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}