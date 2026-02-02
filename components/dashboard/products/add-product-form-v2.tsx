"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldContent, FieldError, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AddProductFormData, addProductSchema, PRESET_CATEGORIES } from "@/schemas/product"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronDown, ChevronUp, Info, Plus, Save, Trash2, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"

interface AddProductFormProps {
    onChange: (product: AddProductFormData) => void
    onCancel: () => void
    onSubmit: () => void
}


export function AddProductFormV2({ onCancel, onChange, onSubmit }: AddProductFormProps) {
    const form = useForm<AddProductFormData>({
        resolver: zodResolver(addProductSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            category: "",
            imageUrl: "",
            isAvailable: true,
            subOptions: [],
        },
        mode: "onSubmit",
    })

    const {
        register,
        control,
        formState: { errors, isSubmitting, isDirty },
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

    // Optional: show a small “errors summary” count near the top
    const errorCount = useMemo(() => {
        const e = errors as any
        let count = 0
        if (e?.name) count++
        if (e?.description) count++
        if (e?.price) count++
        if (e?.category) count++
        if (e?.imageUrl) count++
        if (e?.subOptions) count++
        return count
    }, [errors])

    return (
        <div className='pb-[var(--mobile-padding-bottom)] sm:pb-0 space-y-4 md:space-y-6'>
            {/* Header */}

            <div className="flex items-start justify-between gap-4 pt-4 md:pt-6">
                <div>
                    <h2 className="text-xl font-semibold leading-tight">Add New Product</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Create a new product for your menu. Use Options for sizes, add-ons, or variations.
                    </p>
                </div>
            </div>


            <form className="space-y-6">
                {/* Main panel */}
                <div className="rounded-xl border bg-card">
                    <div className="p-5 sm:p-6 space-y-6">
                        {/* Basic Information */}
                        <FieldSet>
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-base font-semibold">Basic Information</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Core details customers will see on the menu.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 space-y-4">
                                <Field>
                                    <FieldLabel>Product Name</FieldLabel>
                                    <FieldContent>
                                        <Input placeholder="e.g., Margherita Pizza" {...register("name")} />
                                        <FieldError>{errors.name?.message as unknown as string}</FieldError>
                                    </FieldContent>
                                </Field>

                                <Field>
                                    <FieldLabel>Description</FieldLabel>
                                    <FieldContent>
                                        <Textarea placeholder="Describe your product..." rows={3} {...register("description")} />
                                        <FieldError>{errors.description?.message as unknown as string}</FieldError>
                                    </FieldContent>
                                </Field>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                        <FieldLabel>Category</FieldLabel>
                                        <div className="relative">
                                            <InputGroup>
                                                <CategoryInput value={watch("category")} onChange={(val) => setValue("category", val)} />
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
                                </div>

                                <Field>
                                    <FieldLabel>Image URL (Optional)</FieldLabel>
                                    <FieldContent>
                                        <Input placeholder="https://example.com/imageUrl.jpg" {...register("imageUrl")} />
                                        <FieldError>{errors.imageUrl?.message as unknown as string}</FieldError>
                                    </FieldContent>
                                </Field>

                                <Field orientation="horizontal">

                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            checked={!!watch("isAvailable")}
                                            onCheckedChange={(val) => setValue("isAvailable", !!val)}
                                            id="product-is-available-checkbox"
                                        />
                                        <FieldLabel htmlFor="product-is-available-checkbox" className="!m-0 font-normal cursor-pointer">Product is available</FieldLabel>
                                    </div>

                                </Field>
                            </div>
                        </FieldSet>

                        {/* Options */}
                        <div className="pt-6 border-t">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-base font-semibold">Options</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Let customers customize this item.
                                    </p>
                                </div>

                                <Button type="button" variant="outline" size="sm" onClick={handleAddSubOption}>
                                    <Plus className="size-4" />
                                    <span className="hidden sm:flex">Add Option</span>
                                </Button>
                            </div>

                            {subOptionsField.fields.length === 0 ? (
                                <div className="mt-4 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                                    No options added yet. Click “Add Option” to create size, add-ons, or other variations.
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
                                                                <FieldLabel className="!m-0 font-normal cursor-pointer" htmlFor={`option-required-checkbox-${index}`}>
                                                                    This option is required
                                                                </FieldLabel>

                                                            </div>
                                                        </Field>

                                                        <SubOptionItems control={control} subOptionIndex={index} register={register} errors={errors} />
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Bar for Desktop */}
                    <div className="hidden p-4 border-t sm:flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                        <div className="text-xs text-muted-foreground">
                            {errorCount > 0 ? (
                                <span className="text-destructive">Please fix the highlighted fields before saving.</span>
                            ) : (
                                <span>{isDirty ? "Changes not saved yet." : " "}</span>
                            )}
                        </div>

                        <div className="flex gap-3 sm:justify-end">
                            <Button type="button" disabled={isSubmitting} className="flex-1 sm:flex-none" onClick={() => onSubmit()}>
                                <Save className="size-4" /> Save Product
                            </Button>
                            <Button type="button" variant="outline" onClick={onCancel} className="flex-1 sm:flex-none">
                                Cancel
                            </Button>
                        </div>
                    </div>


                </div>
            </form>
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

    const filteredCategories = PRESET_CATEGORIES.filter((cat) => cat.toLowerCase().includes(inputValue.toLowerCase()))

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
                                    onMouseDown={(e) => e.preventDefault()} // prevents blur before click
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
                <Button type="button" variant="outline" size="sm" onClick={() => optionsField.append({ id: "", name: "", price: 0 })}>
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
                        {...register(`subOptions.${subOptionIndex}.options.${itemIndex}.price`, { valueAsNumber: true })}
                    />

                    <Button type="button" variant="ghost" size="icon-sm" onClick={() => optionsField.remove(itemIndex)} aria-label="Remove item">
                        <X className="size-3" />
                    </Button>
                </div>
            ))}

            {/* Optional: show nested errors if needed */}
            <FieldError>
                {(errors.subOptions as any)?.[subOptionIndex]?.options?.message as unknown as string}
            </FieldError>
        </div>
    )
}
