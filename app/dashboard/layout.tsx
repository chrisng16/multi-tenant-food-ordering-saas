import { AppSidebar } from '@/components/dashboard/app-sidebar';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import React from 'react';

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
  return (
      <SidebarProvider
          style={
              {
                  "--sidebar-width": "calc(var(--spacing) * 60)",
                  "--header-height": "calc(var(--spacing) * 12)",
              } as React.CSSProperties
          }
      >
          <AppSidebar variant="inset" />
          <SidebarInset>
              <DashboardHeader />
              {children}
          </SidebarInset>
      </SidebarProvider>  )
}
