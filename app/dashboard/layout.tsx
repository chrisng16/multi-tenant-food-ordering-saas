import { DashboardHeader } from '@/components/dashboard/common/dashboard-header/dashboard-header';
import { AppSidebar } from '@/components/dashboard/common/sidebar/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const sessionData = await auth.api.getSession({ headers: await headers() })

    if (!sessionData?.user) redirect("/")

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 60)",
                    "--header-height": "calc(var(--spacing) * 12)",
                    "--mobile-action-bar-height": "calc(var(--spacing) * 18)",
                    "--mobile-padding-bottom": "calc(var(--spacing) * 18 - 1rem)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" user={sessionData.user} />
            <SidebarInset>
                <DashboardHeader />
                {children}
            </SidebarInset>
        </SidebarProvider>)
}
