"use client"

import { getProduct } from "@/actions/product/get-product"
import { getAllStores } from "@/actions/store/get-all-store"
import { CompactStoreSwitcher } from "@/components/dashboard/stores/compact-store-switcher"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import React from "react"

interface DashboardBreadcrumbV2Props {
    pathname: string
    currentStoreId?: string
}

type Crumb =
    | { id: string; kind: "link"; label: string; href: string }
    | { id: string; kind: "page"; label: string }
    | { id: string; kind: "switcher"; type: "stores" | "products" }

export function DashboardBreadcrumbV2({ pathname, currentStoreId }: DashboardBreadcrumbV2Props) {
    const segments = pathname.split("/").filter(Boolean)
    const dashboardSegments = segments.slice(1) // drop 'dashboard'

    let productId: string | undefined = undefined
    if (dashboardSegments.length >= 4 && dashboardSegments[2] === "products") {
        productId = dashboardSegments[3]
    }

    const { data: storesRes } = useQuery({
        queryKey: ['stores'],
        queryFn: () => getAllStores()
    })

    const { data: productsRes } = useQuery({
        queryKey: ['products', productId],
        queryFn: () => getProduct(productId!),
        enabled: !!productId
    })

    const stores = storesRes?.ok ? storesRes.data : []
    const product = productsRes?.ok ? productsRes.data : null

    const getSegmentLabel = (segment: string) =>
        segment === "overview"
            ? "Overview"
            : segment === "products"
                ? "Products"
                : segment === "stores"
                    ? "Stores"
                    : segment.charAt(0).toUpperCase() + segment.slice(1)

    const getSegmentHref = (index: number) => {
        const pathSegments = ["dashboard", ...dashboardSegments.slice(0, index + 1)]
        return "/" + pathSegments.join("/")
    }

    const crumbs: Crumb[] = []

    // Overview / root
    if (dashboardSegments.length === 0 || (dashboardSegments.length === 1 && dashboardSegments[0] === "overview")) {
        crumbs.push({ id: `page-overview-${Date.now()}`, kind: "page", label: "Overview" })
    } else if (
        dashboardSegments[0] === "stores" &&
        dashboardSegments.length >= 3 &&
        dashboardSegments[2] === "products" &&
        currentStoreId &&
        stores.length > 0
    ) {
        // stores/[storeId]/products(/[productId])
        crumbs.push({ id: `switcher-products-${Date.now()}`, kind: "switcher", type: "products" })
        crumbs.push({ id: `link-products-${Date.now()}`, kind: "link", label: "Products", href: `/dashboard/stores/${currentStoreId}/products` })
        if (product?.name) {
            crumbs.push({ id: `page-product-${Date.now()}`, kind: "page", label: `${product.name}` })
        }
    } else if (dashboardSegments[0] === "stores" && dashboardSegments.length > 1 && currentStoreId && stores) {
        // stores/[id]
        crumbs.push({ id: `link-stores-${Date.now()}`, kind: "link", label: "Stores", href: "/dashboard/stores" })
        crumbs.push({ id: `switcher-stores-${Date.now()}`, kind: "switcher", type: "stores" })
    } else {
        // Generic: map segments to links/pages
        dashboardSegments.forEach((seg, i) => {
            const label = getSegmentLabel(seg)
            if (i === dashboardSegments.length - 1) {
                crumbs.push({ id: `page-${seg}-${Date.now()}`, kind: "page", label })
            } else {
                crumbs.push({ id: `link-${seg}-${Date.now()}`, kind: "link", label, href: getSegmentHref(i) })
            }
        })
    }

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {crumbs.map((c, i) => (
                    <React.Fragment key={c.id}>
                        {i > 0 && (
                            <BreadcrumbSeparator />
                        )}
                        <BreadcrumbItem>
                            {c.kind === "link" && (
                                <BreadcrumbLink asChild>
                                    <Link href={c.href}>{c.label}</Link>
                                </BreadcrumbLink>
                            )}
                            {c.kind === "page" && <BreadcrumbPage>{c.label}</BreadcrumbPage>}
                            {c.kind === "switcher" && currentStoreId && stores && (
                                <CompactStoreSwitcher
                                    currentStoreId={currentStoreId}
                                    stores={stores}
                                    type={c.type}
                                />
                            )}
                        </BreadcrumbItem>
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
