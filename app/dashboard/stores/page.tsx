"use client";

import { createStore } from "@/actions/store/create-store";
import MABTemplate from "@/components/dashboard/common/mobile-action-bar/mab-template";
import { MobileActionBar } from "@/components/dashboard/common/mobile-action-bar/mobile-action-bar";
import QuickActionButton from "@/components/dashboard/common/mobile-action-bar/quick-action-button";
import {
    WeekHours,
    defaultWeekHours,
} from "@/components/dashboard/stores/business-hours/time-utils";
import StoreInfoEntry from "@/components/dashboard/stores/create-modify-store/store-info-entry";
import StoreCardDisplay from "@/components/dashboard/stores/store-card-display";
import { Button } from "@/components/ui/button";
import { ClientActionError } from "@/lib/action/client-action-error";
import { unwrapActionResult } from "@/lib/action/unwrap-action-result";
import { StoreSchema } from "@/schemas/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const defaultStoreDetails: StoreSchema = {
    name: "",
    slug: "",
    logoUrl: undefined,
    description: undefined,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Los_Angeles",
    phone: undefined,
    email: undefined,
    address: undefined,
}

export default function StoresPage() {
    const [isCreatingStore, setIsCreatingStore] = useState(false);
    const [hours, setHours] = useState<WeekHours>(defaultWeekHours);
    const [isFormValid, setIsFormValid] = useState(false);

    const [storeDetails, setStoreDetails] = useState<StoreSchema>(defaultStoreDetails);

    const router = useRouter();
    const queryClient = useQueryClient();

    useEffect(() => {
        console.log("Store Details Updated:", storeDetails);
    }, [storeDetails]);


    const { isPending, mutate } = useMutation({
        mutationFn: async ({
            storeDetails,
            hours,
        }: {
            storeDetails: StoreSchema;
            hours: WeekHours;
        }) => unwrapActionResult(await createStore(storeDetails, hours)),
        onSuccess: () => {
            setIsCreatingStore(false);
            toast.success("Store successfully created");
            queryClient.invalidateQueries({ queryKey: ["stores"] });
        },
        onError: (err) => {
            if (err instanceof ClientActionError) {
                if (err.status === 401) {
                    router.push("/sign-in");
                    toast.error(err.message);
                    return;
                }

                toast.error(err.message);
                return;
            }

            // fallback (should be rare)
            toast.error("Unexpected error");
        },
    });

    const handleSubmit = () => {
        // Handle form submission logic here
        console.log("Store Details Submitted:", storeDetails, hours);
        // Reset form or navigate as needed
        mutate({ storeDetails, hours });
    };

    return (
        <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                        My Stores
                    </h1>
                    <p className="text-muted-foreground">
                        Manage all your stores from one place
                    </p>
                </div>

                {!isCreatingStore && (
                    <div className="hidden sm:block">
                        <Button
                            onClick={() => setIsCreatingStore(true)}
                            className="sm:w-auto"
                        >
                            <Plus className="size-4" /> Create Store
                        </Button>
                    </div>
                )}
            </div>
            {isCreatingStore ? (
                <StoreInfoEntry
                    mode="create"
                    hours={hours}
                    setHours={setHours}
                    setStoreDetails={setStoreDetails}
                    onSave={handleSubmit}
                    onCancel={() => {
                        setIsCreatingStore(false);
                        setStoreDetails(defaultStoreDetails);
                    }}
                    isFormValid={isFormValid}
                    setFormValid={setIsFormValid}
                />
            ) : (
                <StoreCardDisplay />
            )}

            <MobileActionBar>
                {isCreatingStore ? (
                    <MABTemplate
                        showRightButton={false}
                        leftButton={
                            <LeftButton onClick={() => {
                                setIsCreatingStore(false);
                                setStoreDetails(defaultStoreDetails);
                            }} />
                        }
                    >
                        <QuickActionButton
                            disabled={!isFormValid}
                            className="w-full"
                            onClick={handleSubmit}
                            icon={Save}
                            label={"Save"}
                            ariaLabel={"Create Store"}
                        />
                    </MABTemplate>
                ) : (
                    <MABTemplate showRightButton={false} showLeftButton={false}>
                        <QuickActionButton
                            className="w-full"
                            onClick={() => setIsCreatingStore(true)}
                            icon={Plus}
                            label={"Create Store"}
                            ariaLabel={"Create Store"}
                        />
                    </MABTemplate>
                )}
            </MobileActionBar>
        </>
    );
}

function LeftButton({ onClick }: { onClick: () => void }) {
    return <QuickActionButton ariaLabel={"Cancel"} icon={X} onClick={onClick} />;
}
