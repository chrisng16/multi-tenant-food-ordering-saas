"use client"

import { Button } from "@/components/ui/button"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { StoreFormData } from "@/schemas/auth"
import { Edit, Plus } from "lucide-react"
import { useFormContext } from "react-hook-form"

interface StoreFormProps {
    mode: 'create' | 'edit'
    loading: boolean
    onCancel?: () => void
}

export function StoreForm({ mode, loading, onCancel }: StoreFormProps) {
    const { register, formState: { errors }, watch } = useFormContext<StoreFormData>()

    // Use a ref to avoid re-renders that cause focus issues
    const slugValue = watch("slug")

    return (
        <>
            <FieldSet>
                <FieldGroup>
                    <Field>
                        <FieldLabel>Store Name</FieldLabel>
                        <Input
                            {...register("name")}
                            placeholder="Enter your store name"
                            disabled={loading}
                        />
                        <FieldError>{errors.name?.message}</FieldError>
                    </Field>
                </FieldGroup>

                <FieldGroup>
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
                </FieldGroup>

                <FieldGroup>
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
                </FieldGroup>
            </FieldSet>

            <div className="flex gap-3 pt-3">
                <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? (
                        `${mode === 'create' ? 'Creating' : 'Updating'} Store...`
                    ) : (
                        <>
                            {mode === 'create' ? <Plus className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                            {mode === 'create' ? 'Create Store' : 'Update Store'}
                        </>
                    )}
                </Button>
                {mode === 'edit' && onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                )}
            </div>
        </>
    )
}