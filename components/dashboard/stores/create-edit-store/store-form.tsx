"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Store } from "@/db/schema";
import { StoreSchema, storeSchema } from "@/schemas/store";
import { TimezoneSelector } from "../business-hours/timezone-selector";
import SlugSelector from "../slug-selector";

type StoreFormProps = {
    mode: "create" | "edit";
    store?: Store;
    onChange: (formValues: StoreSchema) => void;
    setFormValid: (isValid: boolean) => void;
    setFormDirty: (isDirty: boolean) => void;
};

const StoreForm = ({
    mode,
    store,
    onChange,
    setFormValid,
    setFormDirty
}: StoreFormProps) => {
    const defaultValues: StoreSchema = useMemo(() => {
        if (mode === "edit" && store) {
            return {
                name: store.name,
                slug: store.slug,
                description: store.description ?? "",
                timezone: store.timezone,
                logoUrl: store.logoUrl ?? null,
                phone: store.phone ?? null,
                email: store.email ?? null,
                address: store.address ?? null,
            };
        }
        return {
            name: "",
            slug: "",
            description: "",
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Los_Angeles",
            logoUrl: null,
            phone: null,
            email: null,
            address: null,
        };
    }, [mode, store]);

    const form = useForm<StoreSchema>({
        resolver: zodResolver(storeSchema),
        defaultValues,
        mode: "onBlur",
    });

    const {
        register,
        formState: { errors, isValid, isDirty },
        watch,
    } = form;

    // Track form validity
    useEffect(() => {
        setFormValid(isValid);
    }, [isValid, setFormValid]);

    // Track form dirty state
    useEffect(() => {
        setFormDirty(isDirty);
    }, [isDirty, setFormDirty]);

    // Propagate form changes to parent
    useEffect(() => {
        const subscription = watch((formValues) => {
            onChange(formValues as StoreSchema);
        });
        return () => subscription.unsubscribe();
    }, [watch, onChange]);

    return (
        <form
            className="grid gap-4 md:gap-6"
            noValidate
            autoComplete="on"
        >
            <Card>
                <CardHeader>
                    <CardTitle>General Information</CardTitle>
                    <CardDescription>Provide the general details about your store.</CardDescription>
                </CardHeader>
                <CardContent>
                    <FieldSet>
                        <Field>
                            <FieldLabel>Store Name</FieldLabel>
                            <Input
                                {...register("name")}
                                placeholder="Enter your store name"
                            />
                            <FieldError>{errors.name?.message}</FieldError>
                        </Field>

                        <SlugSelector
                            mode={mode}
                            nameValue={form.watch("name")}
                            slugValue={form.watch("slug")}
                            setSlugValueAction={(next) =>
                                form.setValue("slug", next, { shouldValidate: true, shouldDirty: true })
                            }
                            error={errors.slug?.message}
                            domainSuffix=".app.com"
                        />

                        <TimezoneSelector
                            value={form.watch("timezone")}
                            onChange={(value) => form.setValue("timezone", value, { shouldValidate: true, shouldDirty: true })}
                        />

                        <Field>
                            <FieldLabel>Description (Optional)</FieldLabel>
                            <Textarea
                                {...register("description")}
                                placeholder="Tell customers about your store..."
                                rows={3}
                            />
                            <FieldError>{errors.description?.message}</FieldError>
                        </Field>

                    </FieldSet>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>
                        Provide contact details for your store.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <FieldSet className="grid grid-cols-1 lg:grid-cols-2">
                        <Field>
                            <FieldLabel>Store Phone Number</FieldLabel>
                            <Input
                                {...register("phone")}
                                placeholder="Enter your store phone number"
                            />
                            <FieldError>{errors.phone?.message}</FieldError>
                        </Field>
                        <Field>
                            <FieldLabel>Store Email (Optional)</FieldLabel>
                            <Input
                                {...register("email")}
                                placeholder="Enter your store email"
                            />
                            <FieldError>{errors.email?.message}</FieldError>
                        </Field>
                        <Field>
                            <FieldLabel>Store Address (Optional)</FieldLabel>
                            <Textarea
                                {...register("address")}
                                placeholder="Enter your store address"
                                rows={3}
                            />
                            <FieldError>{errors.address?.message}</FieldError>
                        </Field>
                    </FieldSet>
                </CardContent>
            </Card>
        </form>
    );
};

export default StoreForm;