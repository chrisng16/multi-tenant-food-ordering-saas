"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronsUpDown } from "lucide-react"
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
            <div className="flex items-center gap-1">
                <span>{currentStore.name}</span>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                        <ChevronsUpDown className="size-3.5" />
                    </Button>
                </DropdownMenuTrigger>
            </div>
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