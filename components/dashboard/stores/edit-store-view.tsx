"use client"

import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { Store } from "@/db/schema"
import { StoreSchema } from "@/schemas/store"
import { BarChart3, MoreHorizontal, MoreHorizontalIcon, Package, Save, ShoppingCart, StoreIcon, Zap } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import MABTemplate from "../common/mobile-action-bar/mab-template"
import { MobileActionBar } from "../common/mobile-action-bar/mobile-action-bar"
import QuickActionButton from "../common/mobile-action-bar/quick-action-button"
import { WeekHours } from "./business-hours/time-utils"
import StoreInfoEntry from "./create-modify-store/store-info-entry"

interface EditStoreViewProps {
    hours: WeekHours
    setHours: (hours: WeekHours) => void
    storeDetails: StoreSchema | undefined
    setStoreDetails: (details: StoreSchema) => void
    onSubmit: () => void
    isSubmitting: boolean
    store: Store
}

export function EditStoreView({
    hours,
    setHours,
    store,
    storeDetails,
    setStoreDetails,
    onSubmit,
    isSubmitting
}: EditStoreViewProps) {
    const [isFormValid, setIsFormValid] = useState(false)

    useEffect(() => {
        console.log("Store details updated:", storeDetails)
    }, [storeDetails])

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
                        <StoreIcon className="h-4 w-4" />
                        <span className="inline">View Store</span>
                    </Button>
                    <QuickActions storeId={store.id} />
                    <MiniQuickActions storeId={store.id} />
                </div>
            </div>

            <StoreInfoEntry
                mode="edit"
                hours={hours}
                setHours={setHours}
                store={store}
                setStoreDetails={setStoreDetails}
                onSave={onSubmit}
                onCancel={() => window.history.back()}
                isFormValid={isFormValid}
                setFormValid={setIsFormValid}
            />

            <MobileActionBar>
                <MABTemplate rightButton={<ActionBarQuickActions store={store} />}>
                    <QuickActionButton
                        disabled={!isFormValid || isSubmitting}
                        className="w-full"
                        onClick={onSubmit}
                        icon={Save}
                        label={isSubmitting ? "Saving..." : "Save"}
                        ariaLabel={"Save Store"}
                    />
                </MABTemplate>
            </MobileActionBar>
        </>
    )
}

function QuickActions({ storeId }: { storeId: string }) {
    return (
        <div className="hidden xl:grid gap-2 grid-cols-4">
            <Button
                variant="outline"
                size="sm"
                className="w-full"
                asChild
            >
                <Link href={`/dashboard/stores/${storeId}/products`}>
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
                <StoreIcon className="h-4 w-4" />
                <span className="inline">View Store</span>
            </Button>
        </div >)
}

export function MiniQuickActions({ storeId }: { storeId: string }) {
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
                        <Link href={`/dashboard/stores/${storeId}/analytics`}>
                            <StoreIcon className="h-4 w-4" />
                            <span className="inline">View Store</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={`/dashboard/stores/${storeId}/products`}>
                            <Package className="h-4 w-4" />
                            <span className="inline">Manage Products</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={`/dashboard/stores/${storeId}/orders`}>
                            <ShoppingCart className="h-4 w-4" />
                            <span className="inline">Manage Orders</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={`/dashboard/stores/${storeId}/analytics`}>
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
                                <StoreIcon className="h-4 w-4" />
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