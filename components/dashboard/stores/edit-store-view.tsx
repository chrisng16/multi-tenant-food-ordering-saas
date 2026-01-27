"use client"

import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Store } from "@/db/schema"
import { StoreSchema } from "@/schemas/store"
import { BarChart3, MoreHorizontal, MoreHorizontalIcon, Package, Save, ShoppingCart, StoreIcon, Zap } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import MABTemplate from "../common/mobile-action-bar/mab-template"
import { MobileActionBar } from "../common/mobile-action-bar/mobile-action-bar"
import QuickActionButton from "../common/mobile-action-bar/quick-action-button"
import { WeekHours } from "./business-hours/time-utils"
import StoreInfoEntry from "./create-modify-store/store-info-entry"

interface EditStoreViewProps {
    store: Store
    initialFormData: { storeDetails: StoreSchema; hours: WeekHours }
    onSubmit: (data: { storeDetails: StoreSchema; hours: WeekHours }) => void
    isSubmitting: boolean
}

export function EditStoreView({
    store,
    initialFormData,
    onSubmit,
    isSubmitting
}: EditStoreViewProps) {

    const [hours, setHours] = useState<WeekHours>(initialFormData.hours as unknown as WeekHours)
    const [storeDetails, setStoreDetails] = useState<StoreSchema>(initialFormData.storeDetails)
    const [isFormValid, setIsFormValid] = useState(true)
    const [isFormDirty, setIsFormDirty] = useState(false)

    const handleSubmit = () => {
        if (!isFormValid || !isFormDirty) return
        onSubmit({ storeDetails, hours })
    }

    const isSaveDisabled = !isFormValid || !isFormDirty || isSubmitting

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
                    <Button size="sm" className="xl:hidden hidden sm:flex w-auto" asChild>
                        <Link href={`/dashboard/stores/${store.id}`}>
                            <StoreIcon className="h-4 w-4" />
                            <span className="inline">View Store</span>
                        </Link>
                    </Button>
                    <QuickActions storeId={store.id} />
                    <MiniQuickActions storeId={store.id} />
                </div>
            </div>

            <StoreInfoEntry
                mode="edit"
                store={store}
                hours={hours}
                setHours={setHours}
                setStoreDetails={setStoreDetails}
                onSave={handleSubmit}
                onCancel={() => window.history.back()}
                isFormValid={isFormValid}
                setFormValid={setIsFormValid}
                setFormDirty={setIsFormDirty}
                isSaveDisabled={isSaveDisabled}
                isSubmitting={isSubmitting}
            />

            <MobileActionBar>
                <MABTemplate rightButton={<ActionBarQuickActions store={store} />}>
                    <QuickActionButton
                        disabled={isSaveDisabled}
                        className="w-full"
                        onClick={handleSubmit}
                        icon={Save}
                        label={isSubmitting ? "Saving..." : "Save"}
                        ariaLabel="Save Store"
                    />
                </MABTemplate>
            </MobileActionBar>
        </>
    )
}

function QuickActions({ storeId }: { storeId: string }) {
    return (
        <div className="hidden xl:grid gap-2 grid-cols-4">
            <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={`/dashboard/stores/${storeId}/products`}>
                    <Package className="h-4 w-4" />
                    <span className="inline">Manage Products</span>
                </Link>
            </Button>
            <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={`/dashboard/stores/${storeId}/orders`}>
                    <ShoppingCart className="h-4 w-4" />
                    <span className="inline">Manage Orders</span>
                </Link>
            </Button>
            <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={`/dashboard/stores/${storeId}/analytics`}>
                    <BarChart3 className="h-4 w-4" />
                    <span className="inline">View Analytics</span>
                </Link>
            </Button>
            <Button size="sm" className="w-full" asChild>
                <Link href={`/dashboard/stores/${storeId}`}>
                    <StoreIcon className="h-4 w-4" />
                    <span className="inline">View Store</span>
                </Link>
            </Button>
        </div>
    )
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
                        <Link href={`/dashboard/stores/${storeId}`}>
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
        </DropdownMenu>
    )
}

export function ActionBarQuickActions({ store }: { store: { id: string } }) {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="action-bar-primary" size="icon" aria-label="Open Quick Actions">
                    <MoreHorizontal />
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle className="flex items-center justify-center gap-2">
                        <Zap className="size-4" />Quick Actions
                    </DrawerTitle>
                    <DrawerDescription>Select an action to perform</DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col p-6 pt-0 space-y-4">
                    <DrawerClose asChild>
                        <Button variant="secondary" asChild>
                            <Link href={`/dashboard/stores/${store.id}`}>
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