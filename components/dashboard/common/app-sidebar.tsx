"use client"

import {
  IconBuildingStore,
  IconChartBar,
  IconDatabase,
  IconFileWord,
  IconHelp,
  IconInnerShadowTop,
  IconPackage,
  IconReport,
  IconReportSearch,
  IconSearch,
  IconSettings,
  IconUsers
} from "@tabler/icons-react"
import * as React from "react"

import { NavDocuments } from "@/components/dashboard/common/nav-documents"
import { NavMain } from "@/components/dashboard/common/nav-main"
import { NavSecondary } from "@/components/dashboard/common/nav-secondary"
import { NavUser } from "@/components/dashboard/common/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { isPathActive } from "@/lib/utils"
import { usePathname } from "next/navigation"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  navMain: [
    {
      id: "overview",
      title: "Overview",
      url: "/dashboard/overview",
      icon: IconReportSearch,
    },
    {
      id: "stores",
      title: "Stores",
      url: "/dashboard/stores",
      icon: IconBuildingStore,
    },
    {
      id: "products",
      title: "Products",
      url: "/dashboard/products",
      icon: IconPackage,
    },
    {
      id: "analytics",
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: IconChartBar,
    },
    {
      id: "team",
      title: "Team",
      url: "/team",
      icon: IconUsers,
    },
  ],

  navSecondary: [
    {
      id: "settings",
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
    {
      id: "help",
      title: "Get Help",
      url: "/help",
      icon: IconHelp,
    },
    {
      id: "search",
      title: "Search",
      url: "/search",
      icon: IconSearch,
    },
  ],

  documents: [
    {
      id: "data-library",
      name: "Data Library",
      url: "/documents/data-library",
      icon: IconDatabase,
    },
    {
      id: "reports",
      name: "Reports",
      url: "/documents/reports",
      icon: IconReport,
    },
    {
      id: "word-assistant",
      name: "Word Assistant",
      url: "/documents/word-assistant",
      icon: IconFileWord,
    },
  ],
}


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  const withActive = <T extends { url: string }>(items: T[]) =>
    items.map((item) => ({
      ...item,
      isActive: isPathActive(pathname, item.url),
    }))

  return (
    <Sidebar collapsible="icon" {...props} className="pr-0">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">StoreFront</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={withActive(data.navMain)} />
        <NavDocuments items={withActive(data.documents)} />
        <NavSecondary items={withActive(data.navSecondary)} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
