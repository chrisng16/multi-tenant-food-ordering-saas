"use client"

import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useProductSearchStore } from "@/stores/use-product-search-store"
import { Search } from "lucide-react"
import { usePathname } from "next/navigation"
import { useCallback, useRef, useState } from "react"
import { DashboardBreadcrumbV2 } from "./dashboard-breadcrumb-v2"

export function DashboardHeader() {
  const pathname = usePathname()
  const { searchQuery, setSearchQuery, openSearchModal } = useProductSearchStore()
  const [localQuery, setLocalQuery] = useState(searchQuery)
  const inputRef = useRef<HTMLInputElement>(null)


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
  console.log(currentStoreId)

  const handleSearchKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchQuery(localQuery)
      openSearchModal()
    }
  }, [localQuery, setSearchQuery, openSearchModal])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value)
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center border-b gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="hidden sm:flex flex-1 items-center justify-between ">
          <DashboardBreadcrumbV2
            pathname={pathname}
            currentStoreId={currentStoreId}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative hidden sm:block">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search products..."
            value={localQuery}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            className="pl-8 w-48 lg:w-64"
          />
        </div>
      </div>

    </header>
  )
}
