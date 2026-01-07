"use client"

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
import { CompactStoreSwitcher } from "../stores/compact-store-switcher"

interface DashboardBreadcrumbV2Props {
    pathname: string
    currentStoreId?: string
    stores?: Array<{
        id: string
        name: string
    }>
}

export function DashboardBreadcrumbV2({ pathname, currentStoreId, stores }: DashboardBreadcrumbV2Props) {
    const segments = pathname.split('/').filter(Boolean)

    // Remove 'dashboard' from segments as it's the root
    const dashboardSegments = segments.slice(1)

    const getSegmentLabel = (segment: string) => {
        switch (segment) {
            case 'overview':
                return 'Overview'
            case 'products':
                return 'Products'
            case 'stores':
                return 'Stores'
            default:
                return segment.charAt(0).toUpperCase() + segment.slice(1)
        }
    }

    const getSegmentHref = (index: number) => {
        const pathSegments = ['dashboard', ...dashboardSegments.slice(0, index + 1)]
        return '/' + pathSegments.join('/')
    }

    // Special handling for stores/[id] - show "Stores -> [Store Switcher]"
    if (dashboardSegments[0] === 'stores' && dashboardSegments.length > 1 && currentStoreId && stores) {
        return (
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard/stores">Stores</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <ChevronRight className="h-4 w-4" />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <CompactStoreSwitcher
                            currentStoreId={currentStoreId}
                            stores={stores}
                        />
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        )
    }

    // Regular breadcrumb for other pages
    if (dashboardSegments.length === 0) {
        return (
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Overview</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        )
    }

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {dashboardSegments.map((segment, index) => (
                    <div key={segment} className="flex items-center">
                        {index > 0 && (
                            <BreadcrumbSeparator>
                                <ChevronRight className="h-4 w-4" />
                            </BreadcrumbSeparator>
                        )}
                        <BreadcrumbItem>
                            {index === dashboardSegments.length - 1 ? (
                                <BreadcrumbPage>{getSegmentLabel(segment)}</BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink asChild>
                                    <Link href={getSegmentHref(index)}>{getSegmentLabel(segment)}</Link>
                                </BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                    </div>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}