"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"

import {
    Field,
    FieldError,
    FieldLabel,
    FieldSet
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { StoreFormData, storeSchema } from "@/schemas/auth"
import { CircleCheck, Info } from "lucide-react"

type StoreFormProps = { mode: "create" | "edit"; store?: StoreFormData; onChange?: (formValues: StoreFormData) => void }

const StoreForm = ({ mode, store, onChange }: StoreFormProps) => {
    const [loading, setLoading] = useState(false)

    const defaultValues = mode === "edit" && store ? {
        name: store.name,
        slug: store.slug,
        description: store.description,
        phone: store.phone,
        email: store.email,
        address: store.address
    } : {
        name: "",
        slug: "",
        description: "",
        phone: "",
        email: "",
        address: "",
    };

    const form = useForm<StoreFormData>({
        resolver: zodResolver(storeSchema),
        defaultValues
    })

    const {
        register,
        formState: { errors },
    } = form

    return (
        <form
            onChange={() => onChange && onChange(form.getValues())}
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
                    // disabled={loading}
                    />
                    <FieldError>{errors.name?.message}</FieldError>
                </Field>

                <Field>
                    <FieldLabel>Store Slug</FieldLabel>
                    <InputGroup>
                        <InputGroupAddon align='inline-start'>
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
                        <InputGroupInput {...register("slug")} placeholder="your-store-slug" disabled={loading} />
                        <InputGroupAddon align='inline-end'>.app.com</InputGroupAddon>
                        <InputGroupAddon align='inline-end'><CircleCheck /></InputGroupAddon>
                    </InputGroup>
                    <FieldError>{errors.slug?.message}</FieldError>
                </Field>

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

            </FieldSet>
            <FieldSet>
                <Field>
                    <FieldLabel>Store Phone Number</FieldLabel>
                    <Input
                        {...register("phone")}
                        placeholder="Enter your store phone number"
                    // disabled={loading}
                    />
                    <FieldError>{errors.phone?.message}</FieldError>
                </Field>
                <Field>
                    <FieldLabel>Store Email (Optional)</FieldLabel>
                    <Input
                        {...register("email")}
                        placeholder="Enter your store email"
                    // disabled={loading}
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
    )
}

export default StoreForm
