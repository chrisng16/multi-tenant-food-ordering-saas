"use client";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores/use-ui-store";

type AuthTriggerProps = {
  size?: "sm" | "default" | "lg";
};

export default function AuthTrigger({ size = "default" }: AuthTriggerProps) {
  const openAuthModal = useUIStore((state) => state.openAuthModal);

  return (
    <Button size={size} onClick={() => openAuthModal()}>
      Get Started
    </Button>
  );
}
