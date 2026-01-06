"use client";

import SignInForm from "@/components/home/auth/auth-forms/sign-in-form";
import SignUpForm from "@/components/home/auth/auth-forms/sign-up-form";
import AuthButtonApple from "@/components/home/auth/social-auth-buttons/auth-btn-apple";
import AuthButtonFacebook from "@/components/home/auth/social-auth-buttons/auth-btn-facebook";
import AuthButtonGoogle from "@/components/home/auth/social-auth-buttons/auth-btn-google";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthTab, useUIStore } from "@/stores/use-ui-store";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function AuthModal() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isAuthModalOpen, activeAuthTab, toggleAuthModal, openAuthModal, setActiveAuthTab } = useUIStore();

    useEffect(() => {
        const authParam = searchParams.get('auth');
        if (authParam === 'sign-in' || authParam === 'sign-up') {
            openAuthModal(authParam);
            router.replace('/');
        }
    }, [searchParams, openAuthModal, router]);

    return (
        <Dialog open={isAuthModalOpen} onOpenChange={toggleAuthModal}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Welcome to StoreFront</DialogTitle>
                    <DialogDescription>
                        Please sign in or create an account to get started.
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeAuthTab} onValueChange={(value) => setActiveAuthTab(value as AuthTab)} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="sign-in">Sign In</TabsTrigger>
                        <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
                    </TabsList>

                    <TabsContent value="sign-in">
                        <SignInForm />
                    </TabsContent>

                    <TabsContent value="sign-up">
                        <SignUpForm />
                    </TabsContent>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                OR
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <AuthButtonGoogle />
                        <AuthButtonFacebook />
                        <AuthButtonApple />
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}