"use client"

import { CompactStoreSwitcher } from "@/components/dashboard/stores/compact-store-switcher"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

interface DashboardBreadcrumbV2Props {
    pathname: string
    currentStoreId?: string
    stores?: Array<{
        id: string
        name: string
    }>
}

type Crumb =
    | { kind: "link"; label: string; href: string }
    | { kind: "page"; label: string }
    | { kind: "switcher"; type: "stores" | "products" }

export function DashboardBreadcrumbV2({ pathname, currentStoreId, stores }: DashboardBreadcrumbV2Props) {
    const segments = pathname.split("/").filter(Boolean)
    const dashboardSegments = segments.slice(1) // drop 'dashboard'

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
        crumbs.push({ kind: "page", label: "Overview" })
    } else if (
        dashboardSegments[0] === "stores" &&
        dashboardSegments.length >= 3 &&
        dashboardSegments[2] === "products" &&
        currentStoreId &&
        stores
    ) {
        // stores/[storeId]/products(/[productId])
        crumbs.push({ kind: "link", label: "Products", href: "/dashboard/products" })
        crumbs.push({ kind: "switcher", type: "products" })
        if (dashboardSegments.length >= 4) {
            const productId = dashboardSegments[3]
            crumbs.push({ kind: "page", label: `Product ${productId}` })
        }
    } else if (dashboardSegments[0] === "stores" && dashboardSegments.length > 1 && currentStoreId && stores) {
        // stores/[id]
        crumbs.push({ kind: "link", label: "Stores", href: "/dashboard/stores" })
        crumbs.push({ kind: "switcher", type: "stores" })
    } else {
        // Generic: map segments to links/pages
        dashboardSegments.forEach((seg, i) => {
            const label = getSegmentLabel(seg)
            if (i === dashboardSegments.length - 1) {
                crumbs.push({ kind: "page", label })
            } else {
                crumbs.push({ kind: "link", label, href: getSegmentHref(i) })
            }
        })
    }

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {crumbs.map((c, i) => (
                    <div key={i} className="flex items-center">
                        {i > 0 && (
                            <BreadcrumbSeparator>
                                <ChevronRight className="h-4 w-4" />
                            </BreadcrumbSeparator>
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
                    </div>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
