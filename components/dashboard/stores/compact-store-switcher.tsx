"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"

interface CompactStoreSwitcherProps {
    currentStoreId: string
    stores: Array<{
        id: string
        name: string
    }>
    type?: 'stores' | 'products'
}

export function CompactStoreSwitcher({ currentStoreId, stores, type = 'stores' }: CompactStoreSwitcherProps) {
    const router = useRouter()

    const currentStore = stores.find(store => store.id === currentStoreId)

    if (!currentStore) {
        return null
    }

    const handleStoreChange = (storeId: string) => {
        const basePath = `/dashboard/stores/${storeId}`
        const fullPath = type === 'products' ? `${basePath}/products` : basePath
        router.push(fullPath)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-2 hover:bg-accent">
                    <span className="font-medium">{currentStore.name}</span>
                    <ChevronDown className="ml-2 h-3 w-3" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
                {stores.map((store) => (
                    <DropdownMenuItem
                        key={store.id}
                        onClick={() => handleStoreChange(store.id)}
                        className={store.id === currentStoreId ? "bg-accent" : ""}
                    >
                        {store.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}