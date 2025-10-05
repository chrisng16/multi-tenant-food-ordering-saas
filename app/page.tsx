"use client";

import SignInForm from "@/components/home/auth/forms/sign-in-form";
import SignUpForm from "@/components/home/auth/forms/sign-up-form";
import AuthButtonApple from "@/components/home/auth/social-auth-buttons/auth-btn-apple";
import AuthButtonFacebook from "@/components/home/auth/social-auth-buttons/auth-btn-facebook";
import AuthButtonGoogle from "@/components/home/auth/social-auth-buttons/auth-btn-google";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function HomePage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Order Smarter. Manage Better.
        </h1>
        <p className="mt-4 text-gray-600">
          A modern multi-tenant food ordering platform for restaurants and their customers.
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <Button size="lg" onClick={() => setOpen(true)}>
            Get Started
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </div>

      {/* Auth Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Welcome</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* Sign In */}
            <TabsContent value="signin">
              <SignInForm />
            </TabsContent>

            {/* Sign Up */}
            <TabsContent value="signup">
              <SignUpForm />
            </TabsContent>

            {/* Divider */}
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

            {/* Social Sign-In Buttons */}
            <div className="flex flex-col gap-3">
              {/* Google */}
              <AuthButtonGoogle />

              {/* Facebook */}
              <AuthButtonFacebook />

              {/* Apple */}
              <AuthButtonApple />
            </div>

          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
