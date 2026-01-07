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
}

export function CompactStoreSwitcher({ currentStoreId, stores }: CompactStoreSwitcherProps) {
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
                <Button variant="ghost" size="sm" className="h-8 px-2 hover:bg-accent">
                    {/* <Store className="mr-2 h-4 w-4" /> */}
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
                        {/* <Store className="mr-2 h-4 w-4" /> */}
                        {store.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}