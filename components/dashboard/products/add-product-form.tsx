"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldContent, FieldError, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { zodResolver } from "@hookform/resolvers/zod"
import { Info, Plus, Trash2, X } from "lucide-react"
import { useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

const PRESET_CATEGORIES = ["Pizza", "Pasta", "Salads", "Beverages", "Desserts", "Appetizers"]

// Validation schema
const optionSchema = z.object({
    id: z.string().min(1, "Option ID is required"),
    name: z.string().min(1, "Option name is required"),
    price: z.number().min(0, "Price must be 0 or greater"),
})

const subOptionSchema = z.object({
    id: z.string().min(1, "Sub-option ID is required"),
    name: z.string().min(1, "Sub-option name is required"),
    required: z.boolean(),
    options: z.array(optionSchema).min(1, "At least one option is required"),
})

const addProductSchema = z.object({
    name: z.string().min(1, "Product name is required").min(3, "Name must be at least 3 characters"),
    description: z.string().min(1, "Description is required").min(10, "Description must be at least 10 characters"),
    price: z.number().min(0.01, "Price must be greater than 0"),
    category: z.string().min(1, "Category is required"),
    image: z.url("Please enter a valid image URL").optional().or(z.literal("")),
    isAvailable: z.boolean(),
    subOptions: z.array(subOptionSchema).optional(),
})

type AddProductFormData = z.infer<typeof addProductSchema>

interface AddProductFormProps {
    onProductAdded: (product: AddProductFormData) => void
    onCancel: () => void
}

export function AddProductForm({ onProductAdded, onCancel }: AddProductFormProps) {
    const [addingSubOption, setAddingSubOption] = useState(false)

    const form = useForm<AddProductFormData>({
        resolver: zodResolver(addProductSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            category: "",
            image: "",
            isAvailable: true,
        },
    })

    const subOptionsField = useFieldArray({
        control: form.control,
        name: "subOptions",
    })

    const { register, handleSubmit, control, formState: { errors }, setValue, watch } = form

    const onSubmit = (data: AddProductFormData) => {
        onProductAdded(data)
    }

    const handleAddSubOption = () => {
        subOptionsField.append({
            id: `suboption-${Date.now()}`,
            name: "",
            required: false,
            options: [{ id: "", name: "", price: 0 }],
        })
        setAddingSubOption(true)
    }

    const handleRemoveSubOption = (index: number) => {
        subOptionsField.remove(index)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Product</CardTitle>
                <CardDescription>Create a new product for your menu</CardDescription >
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <FieldSet>
                        <h3 className="font-semibold text-base">Basic Information</h3>

                        {/* Product Name */}
                        <Field>
                            <FieldLabel>Product Name</FieldLabel>
                            <FieldContent>
                                <Input placeholder="e.g., Margherita Pizza" {...register("name")} />
                                <FieldError>{errors.name?.message as unknown as string}</FieldError>
                            </FieldContent>
                        </Field>

                        {/* Description */}
                        <Field>
                            <FieldLabel>Description</FieldLabel>
                            <FieldContent>
                                <Textarea placeholder="Describe your product..." rows={3} {...register("description")} />
                                <FieldError>{errors.description?.message as unknown as string}</FieldError>
                            </FieldContent>
                        </Field>

                        {/* Price and Category */}
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
                                <InputGroup>
                                    <CategoryInput
                                        value={watch("category")}
                                        onChange={(val) => setValue("category", val)}
                                    />
                                    <InputGroupAddon align={'inline-end'}>
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
                                <FieldError>{errors.category?.message as unknown as string}</FieldError>

                            </Field>
                        </div>

                        {/* Image URL */}
                        <Field>
                            <FieldLabel>Image URL (Optional)</FieldLabel>
                            <FieldContent>
                                <Input placeholder="https://example.com/image.jpg" {...register("image")} />
                                <FieldError>{errors.image?.message as unknown as string}</FieldError>
                            </FieldContent>
                        </Field>

                        {/* Availability Checkbox */}
                        <Field orientation="horizontal">
                            <FieldContent>
                                <div className="flex items-center gap-3">
                                    <Checkbox checked={!!watch("isAvailable")} onCheckedChange={(val) => setValue("isAvailable", !!val)} />
                                    <FieldLabel className="!m-0 font-normal cursor-pointer">Product is available</FieldLabel>
                                </div>
                            </FieldContent>
                        </Field>
                    </FieldSet>

                    {/* Sub Options */}
                    <FieldSet className="pt-4 border-t">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-base">Options (Size, Add-ons, etc.)</h3>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleAddSubOption}
                            >
                                <Plus className="size-4" />
                                <span className="hidden sm:flex">Add Option</span>
                            </Button>
                        </div>

                        {subOptionsField.fields.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                No options added yet. Click "Add Option" to create size, add-ons, or other variations.
                            </p>
                        )}

                        {subOptionsField.fields.map((field, index) => (
                            <Card key={field.id} className="p-4 bg-muted/30 border-dashed">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium">Option {index + 1}</h4>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon-sm"
                                            onClick={() => handleRemoveSubOption(index)}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>

                                    {/* Option Name */}
                                    <Field>
                                        <FieldLabel>Option Name</FieldLabel>
                                        <FieldContent>
                                            <Input placeholder="e.g., Size, Extra Cheese" {...register(`subOptions.${index}.name`)} />
                                            <FieldError>{(errors.subOptions as any)?.[index]?.name?.message as unknown as string}</FieldError>
                                        </FieldContent>
                                    </Field>

                                    {/* Required Checkbox */}
                                    <Field orientation="horizontal">
                                        <FieldContent>
                                            <div className="flex items-center gap-3">
                                                <Checkbox checked={!!watch(`subOptions.${index}.required`)} onCheckedChange={(val) => setValue(`subOptions.${index}.required`, !!val)} />
                                                <FieldLabel className="!m-0 font-normal cursor-pointer">
                                                    This option is required
                                                </FieldLabel>
                                            </div>
                                        </FieldContent>
                                    </Field>

                                    {/* Sub-option items */}
                                    <SubOptionItems control={control} subOptionIndex={index} register={register} errors={errors} />
                                </div>
                            </Card>
                        ))}
                    </FieldSet>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t sm:justify-end">
                        <Button type="submit" className="flex-1 sm:flex-0 sm:w-auto">
                            Add Product
                        </Button>
                        <Button type="button" variant="outline" className="flex-1 sm:flex-0 sm:w-auto" onClick={onCancel}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card >
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
    const TRANSITION_MS = 500

    const filteredCategories = PRESET_CATEGORIES.filter(
        (cat) => cat.toLowerCase().includes(inputValue.toLowerCase())
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
        <>
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
                    }, 100)
                }
            />
            {isVisible && (
                <div
                    className={`absolute top-full left-0 right-0 mt-1 border rounded-md bg-popover shadow-md z-50 transition-opacity duration-200 ease-in-out ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                >
                    {filteredCategories.length > 0 ? (
                        <div className="max-h-48 overflow-y-auto">
                            {filteredCategories.map((category) => (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => handleSelect(category)}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
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
        </>
    )
}

// Sub-component for managing option items within a sub-option
function SubOptionItems({ control, subOptionIndex, register, errors }: { control: any; subOptionIndex: number; register: any; errors: any }) {
    const optionsField = useFieldArray({
        control,
        name: `subOptions.${subOptionIndex}.options`,
    })

    return (
        <div className="space-y-3 pl-2 border-l-2 border-muted">
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
                        {...register(`subOptions.${subOptionIndex}.options.${itemIndex}.price`, { valueAsNumber: true })}
                    />

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => optionsField.remove(itemIndex)}
                    >
                        <X className="size-3" />
                    </Button>
                </div>
            ))}
        </div>
    )
}
