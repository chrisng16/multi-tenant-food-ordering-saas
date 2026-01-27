"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Store } from "@/db/schema";
import { StoreSchema, storeSchema } from "@/schemas/store";
import { TimezoneSelector } from "./business-hours/timezone-selector";
import SlugSelector from "./slug-selector";

type StoreFormProps = {
    mode: "create" | "edit";
    store?: Store;
    onChange?: (formValues: StoreSchema) => void;
    setFormValid: (isValid: boolean) => void;
};

const StoreForm = ({ mode, store, onChange, setFormValid }: StoreFormProps) => {
    const [loading, setLoading] = useState(false);

    const defaultValues: StoreSchema = useMemo(() => {
        if (mode === "edit" && store) {
            return {
                name: store.name,
                slug: store.slug,
                description: store.description ?? "",
                timezone: store.timezone,
                logoUrl: store.logoUrl ?? undefined,
                phone: store.phone ?? undefined,
                email: store.email ?? undefined,
                address: store.address ?? undefined,
            };
        }
        return {
            name: "",
            slug: "",
            description: "",
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Los_Angeles",
            logoUrl: undefined,
            phone: undefined,
            email: undefined,
            address: undefined,
        };
    }, [mode, store]);

    const form = useForm<StoreSchema>({
        resolver: zodResolver(storeSchema),
        defaultValues,
        mode: "onBlur",
    });

    const {
        register,
        formState: { errors, isValid },
        watch,
    } = form;

    useEffect(() => {
        setFormValid(isValid);
    }, [isValid, setFormValid]);

    useEffect(() => {
        const subscription = watch((formValues) => {
            if (onChange) {
                console.log(formValues)
                onChange(formValues as StoreSchema);
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, onChange]);

    return (
        <form
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
            noValidate
            autoComplete="on"
        >
            <FieldSet>
                <Field>
                    <FieldLabel>Store Name</FieldLabel>
                    <Input
                        {...register("name")}
                        placeholder="Enter your store name"
                        disabled={loading}
                    />
                    <FieldError>{errors.name?.message}</FieldError>
                </Field>
                {/* 
                <Field>
                    <FieldLabel>Store Slug</FieldLabel>
                    <InputGroup>
                        <InputGroupAddon align="inline-start">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Info className="h-4 w-4" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>This slug will be used as prefix for your store URL.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </InputGroupAddon>
                        <InputGroupInput
                            {...register("slug")}
                            placeholder="your-store-slug"
                            disabled={loading || mode === "edit"}
                        />
                        <InputGroupAddon align="inline-end">.app.com</InputGroupAddon>
                        <InputGroupAddon align="inline-end">
                            <CircleCheck />
                        </InputGroupAddon>
                    </InputGroup>
                    <FieldError>{errors.slug?.message}</FieldError>
                </Field> */}

                <SlugSelector
                    mode={mode}
                    nameValue={form.watch("name")}
                    slugValue={form.watch("slug")}
                    setSlugValueAction={(next) =>
                        form.setValue("slug", next, { shouldValidate: true, shouldDirty: true })
                    }
                    error={errors.slug?.message}
                    disabled={loading}
                    domainSuffix=".app.com"
                />


                <Field>
                    <FieldLabel>Description (Optional)</FieldLabel>
                    <Textarea
                        {...register("description")}
                        placeholder="Tell customers about your store..."
                        disabled={loading}
                        rows={3}
                    />
                    <FieldError>{errors.description?.message}</FieldError>
                </Field>

                <TimezoneSelector
                    value={form.watch("timezone")}
                    onChange={(value) => form.setValue("timezone", value, { shouldValidate: true })}
                    disabled={loading}
                />
            </FieldSet>
            <FieldSet>
                <Field>
                    <FieldLabel>Store Phone Number</FieldLabel>
                    <Input
                        {...register("phone")}
                        placeholder="Enter your store phone number"
                        disabled={loading}
                    />
                    <FieldError>{errors.phone?.message}</FieldError>
                </Field>
                <Field>
                    <FieldLabel>Store Email (Optional)</FieldLabel>
                    <Input
                        {...register("email")}
                        placeholder="Enter your store email"
                        disabled={loading}
                    />
                    <FieldError>{errors.email?.message}</FieldError>
                </Field>
                <Field>
                    <FieldLabel>Store Address (Optional)</FieldLabel>
                    <Textarea
                        {...register("address")}
                        placeholder="Enter your store address"
                        disabled={loading}
                        rows={3}
                    />
                    <FieldError>{errors.address?.message}</FieldError>
                </Field>
            </FieldSet>
        </form>
    );
};

export default StoreForm;