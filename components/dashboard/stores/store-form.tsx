"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
    Field,
    FieldError,
    FieldLabel,
    FieldSet
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { StoreFormData, storeSchema } from "@/schemas/auth"

type StoreFormProps =
    | { mode: "create"; store?: never }
    | { mode: "edit"; store: StoreFormData };

const StoreForm = ({ mode, store }: StoreFormProps) => {
    const [loading, setLoading] = useState(false)

    const defaultValues = mode === "edit" && store ? {
        name: store.name,
        slug: store.slug,
        description: store.description,
    } : {
        name: "",
        slug: "",
        description: "",
    };

    const form = useForm<StoreFormData>({
        resolver: zodResolver(storeSchema),
        defaultValues
    })

    const {
        handleSubmit,
        register,
        formState: { errors },
        watch,
    } = form

    const slugValue = watch("slug")

    const onSubmit = async (values: StoreFormData) => {
        setLoading(true)
        console.log(values)
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
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
                    <div className="relative">
                        <Input
                            {...register("slug")}
                            placeholder="your-store-slug"
                            disabled={loading}
                            className="pr-20"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-muted-foreground">
                            .app.com
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        This will be your store's URL: {slugValue ? `${slugValue}.app.com` : 'your-store-slug.app.com'}
                    </p>
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

            <div className="flex gap-3 pt-3 justify-end">
                <Button type="submit" disabled={loading || !form.formState.isDirty}>
                    {loading ? (
                        `${mode === 'create' ? 'Creating' : 'Updating'} Store...`
                    ) : (
                        <>
                            {mode === 'create' ? 'Create Store' : 'Update Store'}
                        </>
                    )}
                </Button>
            </div>
        </form>
    )
}

export default StoreForm
