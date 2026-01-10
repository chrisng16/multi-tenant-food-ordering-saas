"use client"
import { authClient } from "@/lib/auth-client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { redirect } from "next/navigation";
import AuthTrigger from "../home/auth/auth-modal-trigger";

const Header = () => {
    const { data: session } = authClient.useSession()

    const handleSignout = async () => {
        await authClient.signOut();
        redirect("/")
    }

    if (!session) {
        return (
            <header className="bg-white border-b border-gray-200 px-6 py-2 fixed top-0 z-10 w-full">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900">StoreFront</h1>
                    <AuthTrigger />
                </div>
            </header>
        );
    }

    const { user } = session

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-2 fixed top-0 z-10 w-full">
            <div className="flex items-center justify-between">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">Dashboard</h1>

                <DropdownMenu>
                    <DropdownMenuTrigger className="hover:bg-neutral-100 rounded-md focus:ring-0 focus:outline focus:bg-accent transition">
                        <div className="flex items-center gap-3 p-2">
                            <div className="text-right">
                                <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                                <div className="text-xs text-gray-500">{user.email}</div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                {user.name.charAt(0)}
                            </div>
                        </div>

                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                        <DropdownMenuItem>Team</DropdownMenuItem>
                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignout}>Sign out</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}

export default Header