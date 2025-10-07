"use client";

import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores/use-ui-store";

export default function AuthTrigger() {
    const openAuthModal = useUIStore((state) => state.openAuthModal);

    return (
        <Button size="lg" onClick={() => openAuthModal()}>
            Get Started
        </Button>
    );
}