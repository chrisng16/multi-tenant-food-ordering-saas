import Header from "@/components/common/header";
import AuthModal from "@/components/home/auth/auth-modal";
import AuthTrigger from "@/components/home/auth/auth-modal-trigger";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

export const metadata = {
  title: "Order Smarter. Manage Better. | Your App Name",
  description: "A modern multi-tenant food ordering platform for restaurants and their customers.",
  openGraph: {
    title: "Order Smarter. Manage Better.",
    description: "A modern multi-tenant food ordering platform for restaurants and their customers.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <Header />
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Order Smarter. Manage Better.
        </h1>
        <p className="mt-4 text-gray-600">
          A modern multi-tenant food ordering platform for restaurants and their customers.
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <AuthTrigger size="lg" />
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </div>

      {/* Wrap in Suspense for useSearchParams */}
      <Suspense fallback={null}>
        <AuthModal />
      </Suspense>
    </div>
  );
}