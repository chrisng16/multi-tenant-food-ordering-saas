"use client"

import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { StoreFormData } from "@/schemas/auth"
import { BarChart3, MoreHorizontal, MoreHorizontalIcon, Package, Save, ShoppingCart, Store, Zap } from "lucide-react"
import Link from "next/link"
import { MobileActionBar } from "../common/mobile-action-bar"
import MABTemplate from "../common/mobile-action-bar/mab-template"
import { WeekHours } from "./business-hours/time-utils"
import StoreInfoEntry from "./create-modify-store/store-info-entry"
import QuickActionButton from "./quick-action-button"

interface EditStoreViewProps {
    hours: WeekHours
    setHours: (hours: WeekHours) => void
    setStoreDetails: (details: StoreFormData) => void
    store: {
        id: string
        name: string
        slug: string
        description?: string
    }
}

export function EditStoreView({
    hours,
    setHours,
    store,
    setStoreDetails
}: EditStoreViewProps) {



    const handleSubmit = () => {
        // Handle form submission logic here
        console.log("Store details saved:", store);
    }

    return (

        <>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold tracking-tight">{store.name}</h1>
                    <p className="text-sm md:text-base text-muted-foreground">
                        Edit your store settings and preferences
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

            <StoreInfoEntry mode="edit" hours={hours} setHours={setHours} store={store} setStoreDetails={setStoreDetails} />

            <MobileActionBar>
                <MABTemplate rightButton={<ActionBarQuickActions store={store} />}>
                    <QuickActionButton className="w-full" onClick={() => handleSubmit()} icon={Save} label={"Save"} ariaLabel={"Create Store"} />
                </MABTemplate>
            </MobileActionBar >
        </>
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

export function MiniQuickActions({ store }: { store: { id: string } }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className="xl:hidden hidden sm:flex">
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

export function ActionBarQuickActions({ store }: { store: { id: string } }) {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="action-bar-primary" size='icon' aria-label="Open Quick Actions">
                    <MoreHorizontal />
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle className="flex items-center justify-center gap-2"><Zap className="size-4" />Quick Actions</DrawerTitle>
                    <DrawerDescription>Select an action to perform</DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col p-6 pt-0 space-y-4">
                    <DrawerClose asChild>
                        <Button variant="secondary" asChild>
                            <Link href={`/dashboard/stores/${store.id}/analytics`}>
                                <Store className="h-4 w-4" />
                                <span className="inline">View Store</span>
                            </Link>
                        </Button>
                    </DrawerClose>
                    <DrawerClose asChild>
                        <Button variant="secondary" asChild>
                            <Link href={`/dashboard/stores/${store.id}/products`}>
                                <Package className="h-4 w-4" />
                                <span className="inline">Manage Products</span>
                            </Link>
                        </Button>
                    </DrawerClose>
                    <DrawerClose asChild>
                        <Button variant="secondary" asChild>
                            <Link href={`/dashboard/stores/${store.id}/orders`}>
                                <ShoppingCart className="h-4 w-4" />
                                <span className="inline">Manage Orders</span>
                            </Link>
                        </Button>
                    </DrawerClose>
                    <DrawerClose asChild>
                        <Button variant="secondary" asChild>
                            <Link href={`/dashboard/stores/${store.id}/analytics`}>
                                <BarChart3 className="h-4 w-4" />
                                <span className="inline">View Analytics</span>
                            </Link>
                        </Button>
                    </DrawerClose>
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </div>
            </DrawerContent>
        </Drawer>
    )
}