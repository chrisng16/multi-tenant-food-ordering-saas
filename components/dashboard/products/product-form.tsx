"use client"

import { ImageUpload, ImageUploadRef } from '@/components/dashboard/products/image-upload/image-upload'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { centsToDollars } from "@/lib/utils/utils"
import { AddProductFormData, addProductSchema, PRESET_CATEGORIES } from "@/schemas/product"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronDown, ChevronUp, Info, Plus, Trash2, X } from "lucide-react"
import { RefObject, useEffect, useMemo, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"

interface ProductFormProps {
    mode: "create" | "edit"
    product?: AddProductFormData & { id: string } | undefined
    storeId?: string
    onDirtyChange?: (isDirty: boolean) => void
    onValidChange?: (isValid: boolean) => void
    onChange: (product: AddProductFormData) => void
    imageUploadRef?: RefObject<ImageUploadRef | null>
}

export function ProductForm({
    mode,
    product,
    storeId,
    onDirtyChange,
    onValidChange,
    onChange,
    imageUploadRef
}: ProductFormProps) {
    const form = useForm<AddProductFormData>({
        resolver: zodResolver(addProductSchema),
        defaultValues: {
            name: product?.name || "",
            description: product?.description || "",
            price: Number(centsToDollars(product?.price || 0)),
            category: product?.category || "",
            uploadedImages: product?.uploadedImages || [],
            pendingImages: product?.pendingImages || [],
            isAvailable: product?.isAvailable ?? true,
            subOptions: product?.subOptions || [],
        },
        mode: "onBlur",
    })

    const {
        register,
        control,
        formState: { errors, isDirty, isValid },
        setValue,
        watch,
    } = form

    const subOptionsField = useFieldArray({
        control,
        name: "subOptions",
    })

    const [openOptionId, setOpenOptionId] = useState<string | null>(null)
    const prevSubOptionsLengthRef = useMemo(() => ({ current: subOptionsField.fields.length }), [])

    // Open newly-added option automatically
    useEffect(() => {
        const currentLength = subOptionsField.fields.length
        const prevLength = prevSubOptionsLengthRef.current

        if (currentLength > prevLength) {
            const newField = subOptionsField.fields[currentLength - 1]
            setOpenOptionId(newField.id)
        }

        prevSubOptionsLengthRef.current = currentLength

    }, [subOptionsField.fields.length])

    // Notify parent whenever form values change
    useEffect(() => {
        const subscription: any = watch((value) => {
            onChange(value as AddProductFormData)
        })

        return () => {
            if (typeof subscription === "function") subscription()
            else if (subscription?.unsubscribe) subscription.unsubscribe()
        }
    }, [watch, onChange])

    useEffect(() => {
        if (onDirtyChange) {
            onDirtyChange(isDirty)
            console.log("Form dirty state changed:", isDirty)
        }
    }, [isDirty, onDirtyChange])

    useEffect(() => {
        if (onValidChange) {
            onValidChange(isValid)
            console.log("Form valid state changed:", isValid)
        }
    }, [isValid, onValidChange])

    const handleAddSubOption = () => {
        subOptionsField.append({
            id: `suboption-${Date.now()}`,
            name: "",
            required: false,
            options: [{ id: "", name: "", price: 0 }],
        })
    }

    const handleRemoveSubOption = (index: number) => {
        const removed = subOptionsField.fields[index]
        subOptionsField.remove(index)
        if (openOptionId === removed?.id) setOpenOptionId(null)
    }

    // Handle uploaded images (edit mode)
    const handleUploadedImagesChange = (images: unknown) => {
        setValue("uploadedImages", images as any, { shouldDirty: true })
    }

    // Handle pending images (create mode)
    const handlePendingImagesChange = (files: File[]) => {
        setValue("pendingImages", files as any, { shouldDirty: true })
    }

    return (
        <div className='pb-[var(--mobile-padding-bottom)] sm:pb-0 space-y-4 md:space-y-6 px-4 md:px-6'>
            {/* Header */}
            <header className="flex items-start justify-between gap-4 pt-4 md:pt-6">
                <div>
                    <h2 className="text-xl font-semibold leading-tight">
                        {mode === "create" ? "Add New Product" : "Edit Product"}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        {mode === "create"
                            ? "Create a new product for your menu. Images will be uploaded when you save."
                            : "Manage your product details and availability."}
                    </p>
                </div>
            </header>

            <div className="space-y-4 md:space-y-6">


                <form className="space-y-4 md:space-y-6">
                    {/* Core panel */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Core Information</CardTitle>
                            <CardDescription>
                                Core details customers will see on the menu.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                            <Field>
                                <FieldLabel>Product Name</FieldLabel>
                                <FieldContent>
                                    <Input placeholder="e.g., Margherita Pizza" {...register("name")} />
                                    <FieldError>{errors.name?.message as unknown as string}</FieldError>
                                </FieldContent>
                            </Field>
                            <Field>
                                <FieldLabel>Price</FieldLabel>
                                <FieldContent>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                        {...register("price", { valueAsNumber: true })}
                                    />
                                    <FieldError>{errors.price?.message as unknown as string}</FieldError>
                                </FieldContent>
                            </Field>
                            <Field>
                                <FieldLabel>Product Status</FieldLabel>
                                <FieldContent>
                                    <Select
                                        value={watch("isAvailable") ? "available" : "not_available"}
                                        onValueChange={(value) => setValue("isAvailable", value === "available")}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="available">Available</SelectItem>
                                            <SelectItem value="not_available">Not Available</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FieldError>{errors.isAvailable?.message as unknown as string}</FieldError>
                                </FieldContent>
                            </Field>
                            <Field>
                                <FieldLabel>Category</FieldLabel>
                                <div className="relative">
                                    <InputGroup>
                                        <CategoryInput
                                            value={watch("category")}
                                            onChange={(val) => setValue("category", val)}
                                        />
                                        <InputGroupAddon align={"inline-end"}>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Info className="size-4" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Type to create a custom category or select from the preset list.</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </div>
                                <FieldError>{errors.category?.message as unknown as string}</FieldError>
                            </Field>

                            <Field className="col-span-1 md:grid-cols-2">
                                <FieldLabel>Description</FieldLabel>
                                <FieldContent>
                                    <Textarea
                                        placeholder="Describe your product..."
                                        rows={3}
                                        {...register("description")}
                                    />
                                    <FieldError>{errors.description?.message as unknown as string}</FieldError>
                                </FieldContent>
                            </Field>
                        </CardContent>
                    </Card>

                    {/* Options */}
                    <Card>
                        <CardHeader className="flex items-start justify-between gap-4">
                            <div>
                                <CardTitle>Options</CardTitle>
                                <CardDescription>
                                    Let users customize the product with various options
                                </CardDescription>
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={handleAddSubOption}>
                                <Plus className="size-4" />
                                <span className="hidden sm:flex">Add Option</span>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {subOptionsField.fields.length === 0 ? (
                                <div className="mt-4 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                                    No options added yet. Click "Add Option" to create size, add-ons, or other variations.
                                </div>
                            ) : (
                                <div className="mt-4 space-y-3">
                                    {subOptionsField.fields.map((field, index) => {
                                        const isOpen = openOptionId === field.id
                                        const optionName = watch(`subOptions.${index}.name`) as string

                                        return (
                                            <div key={field.id} className="rounded-lg border border-dashed bg-muted/20">
                                                {/* Accordion header */}
                                                <div
                                                    role="button"
                                                    tabIndex={0}
                                                    className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-muted/40"
                                                    onClick={() => setOpenOptionId(isOpen ? null : field.id)}
                                                >
                                                    <div className="min-w-0">
                                                        <div className="text-sm font-semibold">
                                                            {optionName?.trim() ? optionName : `Option ${index + 1}`}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground mt-1">
                                                            {watch(`subOptions.${index}.required`) ? "Required" : "Optional"} •{" "}
                                                            {(watch(`subOptions.${index}.options`) as any[])?.length ?? 0} item(s)
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon-sm"
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                e.stopPropagation()
                                                                handleRemoveSubOption(index)
                                                            }}
                                                            aria-label="Remove option"
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </Button>

                                                        {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                                                    </div>
                                                </div>

                                                {/* Accordion content */}
                                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[500px]" : "max-h-0"}`}>
                                                    <div className={`border-t rounded-b-md p-4 space-y-4`}>
                                                        <Field>
                                                            <FieldLabel>Option Name</FieldLabel>
                                                            <Input
                                                                placeholder="e.g., Size, Extra Cheese"
                                                                {...register(`subOptions.${index}.name`)}
                                                            />
                                                            <FieldError>
                                                                {(errors.subOptions as any)?.[index]?.name?.message as unknown as string}
                                                            </FieldError>
                                                        </Field>

                                                        <Field orientation="horizontal">
                                                            <div className="flex items-center gap-3">
                                                                <Checkbox
                                                                    checked={!!watch(`subOptions.${index}.required`)}
                                                                    onCheckedChange={(val) => setValue(`subOptions.${index}.required`, !!val)}
                                                                    id={`option-required-checkbox-${index}`}
                                                                />
                                                                <FieldLabel
                                                                    className="!m-0 font-normal cursor-pointer"
                                                                    htmlFor={`option-required-checkbox-${index}`}
                                                                >
                                                                    This option is required
                                                                </FieldLabel>
                                                            </div>
                                                        </Field>

                                                        <SubOptionItems
                                                            control={control}
                                                            subOptionIndex={index}
                                                            register={register}
                                                            errors={errors}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </form>
                {/* Images panel */}
                <Card>
                    <CardHeader>
                        <CardTitle>Product Images</CardTitle>
                        <CardDescription>
                            {mode === "create"
                                ? "Add images now. They'll be uploaded when you save the product."
                                : "Add or remove product images. Upload happens when you save."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ImageUpload
                            ref={imageUploadRef}
                            storeId={storeId || ""}
                            productId={mode === "edit" ? product?.id : undefined}
                            tag="product"
                            maxImages={10}
                            existingImages={product?.uploadedImages || []}
                            onImagesChange={handleUploadedImagesChange}
                            onPendingChange={handlePendingImagesChange}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

// Category input with filtering and dropdown
interface CategoryInputProps {
    value: string
    onChange: (value: string) => void
}

function CategoryInput({ value, onChange }: CategoryInputProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [inputValue, setInputValue] = useState(value)
    const TRANSITION_MS = 200

    useEffect(() => setInputValue(value), [value])

    const filteredCategories = PRESET_CATEGORIES.filter((cat) =>
        cat.toLowerCase().includes(inputValue.toLowerCase())
    )

    const handleSelect = (category: string) => {
        setInputValue(category)
        onChange(category)
        setIsOpen(false)
        setTimeout(() => setIsVisible(false), TRANSITION_MS)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
        onChange(e.target.value)
        setIsOpen(true)
        setIsVisible(true)
    }

    return (
        <div className="relative w-full">
            <InputGroupInput
                placeholder="Enter or select category"
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => {
                    setIsOpen(true)
                    setIsVisible(true)
                }}
                onBlur={() =>
                    setTimeout(() => {
                        setIsOpen(false)
                        setTimeout(() => setIsVisible(false), TRANSITION_MS)
                    }, 120)
                }
            />

            {isVisible && (
                <div
                    className={`absolute top-full left-0 right-0 mt-1 border rounded-md bg-popover shadow-md z-50 transition-opacity duration-150 ease-in-out ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                >
                    {filteredCategories.length > 0 ? (
                        <div className="max-h-48 overflow-y-auto">
                            {filteredCategories.map((category) => (
                                <button
                                    key={category}
                                    type="button"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => handleSelect(category)}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    ) : inputValue ? (
                        <div className="px-3 py-2 text-sm text-muted-foreground">
                            Creating custom category: <span className="font-medium">{inputValue}</span>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    )
}

// Sub-component for managing option items within a sub-option
function SubOptionItems({
    control,
    subOptionIndex,
    register,
    errors,
}: {
    control: any
    subOptionIndex: number
    register: any
    errors: any
}) {
    const optionsField = useFieldArray({
        control,
        name: `subOptions.${subOptionIndex}.options`,
    })

    return (
        <div className="space-y-3 pl-4 border-l-2 border-muted pb-2">
            <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Option Items</div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => optionsField.append({ id: "", name: "", price: 0 })}
                >
                    <Plus className="size-3" />
                    <span className="hidden sm:flex">Add Item</span>
                </Button>
            </div>

            {optionsField.fields.map((field, itemIndex) => (
                <div key={field.id} className="flex gap-2">
                    <Input
                        placeholder="e.g., Small, Medium, Large"
                        className="h-8 flex-1"
                        {...register(`subOptions.${subOptionIndex}.options.${itemIndex}.name`)}
                    />

                    <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="h-8 w-20"
                        {...register(`subOptions.${subOptionIndex}.options.${itemIndex}.price`, {
                            valueAsNumber: true
                        })}
                    />

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => optionsField.remove(itemIndex)}
                        aria-label="Remove item"
                    >
                        <X className="size-3" />
                    </Button>
                </div>
            ))}

            <FieldError>
                {(errors.options as any)?.[subOptionIndex]?.subOptions?.message as unknown as string}
            </FieldError>
        </div>
    )
}