"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BarChart3, MoreHorizontalIcon, Package, ShoppingCart, Store } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { BusinessHoursSelector } from "./business-hours/business-hours-selector"
import { WeekHours, defaultWeekHours } from "./business-hours/time-utils"
import { StoreInfoCard } from "./store-info-card"

interface ManageStoreViewProps {
    store: {
        id: string
        name: string
        slug: string
        description?: string
    }
}

export function ManageStoreView({
    store
}: ManageStoreViewProps) {
    const [hours, setHours] = useState<WeekHours>(defaultWeekHours);

    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <div className="px-4 lg:px-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-lg lg:text-2xl font-bold tracking-tight">{store.name}</h1>
                                <p className="text-sm md:text-base text-muted-foreground">
                                    Manage your store settings and preferences
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" className="xl:hidden hidden sm:flex w-auto">
                                    <Store className="h-4 w-4" />
                                    <span className="inline">View Store</span>
                                </Button>
                                <QuickActions store={store} />
                                <MiniQuickActions store={store} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 mt-6 gap-6">
                            <StoreInfoCard store={store} />
                            <div>
                                <BusinessHoursSelector value={hours} onChange={setHours} />
                                {/* <pre className="mt-6 rounded-md bg-muted p-3 text-xs">{JSON.stringify(hours, null, 2)}</pre> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function QuickActions({ store }: { store: { id: string } }) {
    return (
        <div className="hidden xl:grid gap-2 grid-cols-4">
            <Button
                variant="outline"
                size="sm"
                className="w-full"
                asChild
            >
                <Link href={`/dashboard/stores/${store.id}/products`}>
                    <Package className="h-4 w-4" />
                    <span className="inline">Manage Products</span>
                </Link>
            </Button>
            <Button variant="outline" size="sm" className="w-full">
                <ShoppingCart className="h-4 w-4" />
                <span className="inline">Manage Orders</span>
            </Button>

            <Button variant="outline" size="sm" className="w-full">
                <BarChart3 className="h-4 w-4" />
                <span className="inline">View Analytics</span>
            </Button>

            <Button size="sm" className="w-full">
                <Store className="h-4 w-4" />
                <span className="inline">View Store</span>
            </Button>
        </div >)
}

function MiniQuickActions({ store }: { store: { id: string } }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className="xl:hidden flex">
                <Button aria-label="Open menu" size="icon-sm">
                    <MoreHorizontalIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-50" align="end">
                <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild className="flex sm:hidden">
                        <Link href={`/dashboard/stores/${store.id}/analytics`}>
                            <Store className="h-4 w-4" />
                            <span className="inline">View Store</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={`/dashboard/stores/${store.id}/products`}>
                            <Package className="h-4 w-4" />
                            <span className="inline">Manage Products</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={`/dashboard/stores/${store.id}/orders`}>
                            <ShoppingCart className="h-4 w-4" />
                            <span className="inline">Manage Orders</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={`/dashboard/stores/${store.id}/analytics`}>
                            <BarChart3 className="h-4 w-4" />
                            <span className="inline">View Analytics</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>)
}