"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { DashboardBreadcrumbV2 } from "./dashboard-breadcrumb-v2"

// Mock data - in real app, this would come from context or API
const mockStores = [
  { id: "1", name: "My Awesome Store", slug: "my-awesome-store", description: "A great place to shop!" },
  { id: "2", name: "Tech Hub", slug: "tech-hub", description: "Latest gadgets and electronics" },
]

export function DashboardHeader() {
  const pathname = usePathname()

  // Extract store ID from URL for store-related pages
  let currentStoreId: string | undefined

  if (pathname.startsWith('/dashboard/stores/')) {
    const segments = pathname.split('/').filter(Boolean)
    // Find the store ID in the path (it should be after 'stores')
    const storesIndex = segments.indexOf('stores')
    if (storesIndex !== -1 && segments.length > storesIndex + 1) {
      currentStoreId = segments[storesIndex + 1]
    }
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        <div className="flex flex-1 items-center justify-between">
          <DashboardBreadcrumbV2
            pathname={pathname}
            currentStoreId={currentStoreId}
            stores={mockStores}
          />
        </div>
      </div>
    </header>
  )
}
