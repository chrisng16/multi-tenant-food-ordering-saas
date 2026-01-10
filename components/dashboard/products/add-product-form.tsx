"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2, X } from "lucide-react"
import { useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const productSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.number().min(0, "Price must be positive"),
    category: z.string().min(1, "Category is required"),
    isAvailable: z.boolean(),
    subOptions: z.array(z.object({
        id: z.string(),
        name: z.string().min(1, "Option name is required"),
        required: z.boolean(),
        options: z.array(z.object({
            id: z.string(),
            name: z.string().min(1, "Option name is required"),
            price: z.number().min(0, "Price must be positive")
        })).min(1, "At least one option is required")
    }))
})

type ProductFormData = z.infer<typeof productSchema>

interface AddProductFormProps {
    onProductAdded: (product: ProductFormData) => void
    onCancel: () => void
}

export function AddProductForm({ onProductAdded, onCancel }: AddProductFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            category: "",
            isAvailable: true,
            subOptions: []
        }
    })

    const { fields: subOptionFields, append: appendSubOption, remove: removeSubOption } = useFieldArray({
        control: form.control,
        name: "subOptions"
    })

    const addSubOption = () => {
        appendSubOption({
            id: `option_${Date.now()}`,
            name: "",
            required: false,
            options: [{ id: `opt_${Date.now()}`, name: "", price: 0 }]
        })
    }

    const removeSubOptionField = (index: number) => {
        removeSubOption(index)
    }

    const addOptionToSubOption = (subOptionIndex: number) => {
        const currentOptions = form.getValues(`subOptions.${subOptionIndex}.options`)
        const newOption = { id: `opt_${Date.now()}`, name: "", price: 0 }
        form.setValue(`subOptions.${subOptionIndex}.options`, [...currentOptions, newOption])
    }

    const removeOptionFromSubOption = (subOptionIndex: number, optionIndex: number) => {
        const currentOptions = form.getValues(`subOptions.${subOptionIndex}.options`)
        if (currentOptions.length > 1) {
            form.setValue(`subOptions.${subOptionIndex}.options`,
                currentOptions.filter((_, i) => i !== optionIndex)
            )
        }
    }

    const onSubmit = async (data: ProductFormData) => {
        setIsSubmitting(true)
        try {
            // In a real app, this would make an API call
            console.log("Adding product:", data)
            toast.success("Product added successfully!")
            onProductAdded(data)
        } catch (error) {
            toast.error("Failed to add product")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card>
            <CardHeader className="flex items-center justify-between">
                <div>
                    <CardTitle>Add New Product</CardTitle>
                    <CardDescription>
                        Create a new product for your store menu
                    </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={onCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                </Button>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        {/* Basic Product Information */}
                        <div className="grid grid-cols-4 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="col-span-4 sm:col-span-3">
                                        <FormLabel>Product Name *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Margherita Pizza" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem className="col-span-4 sm:col-span-1">
                                        <FormLabel>Price *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                {...field}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem className="col-span-4 lg:col-span-1">
                                        <FormLabel>Category *</FormLabel>
                                        <FormControl>
                                            <CategoryInput {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="col-span-4">
                                        <FormLabel>Description *</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe your product..."
                                                className="min-h-[80px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            <FormField
                                control={form.control}
                                name="isAvailable"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 col-span-4">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Available for ordering</FormLabel>
                                            <FormDescription>
                                                Make this product available for customers to order
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Separator />

                        {/* Sub-Options Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between gap-2 w-full">
                                <div>
                                    <h3 className="text-lg font-medium">Product Options</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Add customization options like size, toppings, etc.
                                    </p>
                                </div>
                                <Button type="button" variant="outline" size="sm" onClick={addSubOption}>
                                    <Plus className="h-4 w-4" />
                                    <span className="hidden sm:inline">Add Option Group</span>
                                </Button>
                            </div>

                            {subOptionFields.map((subOption, subOptionIndex) => (
                                <Card key={subOption.id} className="p-4 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium">Option Group {subOptionIndex + 1}</h4>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeSubOptionField(subOptionIndex)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="grid gap-4">
                                        <FormField
                                            control={form.control}
                                            name={`subOptions.${subOptionIndex}.name`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Option Name *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g., Size, Toppings" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name={`subOptions.${subOptionIndex}.required`}
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <div className="space-y-1 leading-none">
                                                        <FormLabel>Required</FormLabel>
                                                        <FormDescription>
                                                            Customer must select this option
                                                        </FormDescription>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Options within this sub-option */}
                                    <div className="space-y-2 ">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Options</span>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => addOptionToSubOption(subOptionIndex)}
                                            >
                                                <Plus className="h-3 w-3 mr-1" />
                                                Add Option
                                            </Button>
                                        </div>

                                        {form.watch(`subOptions.${subOptionIndex}.options`)?.map((option, optionIndex) => (
                                            <div key={option.id} className="flex items-center gap-2 p-2 border rounded">
                                                <FormField
                                                    control={form.control}
                                                    name={`subOptions.${subOptionIndex}.options.${optionIndex}.name`}
                                                    render={({ field }) => (
                                                        <FormItem className="flex-1">
                                                            <FormControl>
                                                                <Input placeholder="Option name" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name={`subOptions.${subOptionIndex}.options.${optionIndex}.price`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    step="0.01"
                                                                    placeholder="0.00"
                                                                    className="w-20"
                                                                    {...field}
                                                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />

                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeOptionFromSubOption(subOptionIndex, optionIndex)}
                                                    disabled={form.watch(`subOptions.${subOptionIndex}.options`).length <= 1}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* <Separator /> */}

                        <div className="flex justify-end gap-2 col-span-2">
                            <Button type="button" variant="outline" onClick={onCancel}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Adding..." : "Add Product"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

const PRESET_CATEGORIES = ["Pizza", "Pasta", "Salads", "Beverages", "Desserts", "Appetizers"]

interface CategoryInputProps {
    value: string
    onChange: (value: string) => void
}

function CategoryInput({ value, onChange }: CategoryInputProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [inputValue, setInputValue] = useState(value)

    const filteredCategories = PRESET_CATEGORIES.filter(
        (cat) => cat.toLowerCase().includes(inputValue.toLowerCase())
    )

    const handleSelect = (category: string) => {
        setInputValue(category)
        onChange(category)
        setIsOpen(false)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
        onChange(e.target.value)
        setIsOpen(true)
    }

    return (
        <div className="relative w-full">
            <Input
                placeholder="Enter or select category"
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => setIsOpen(true)}
                className="w-full"
            />
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 border rounded-md bg-popover shadow-md z-50">
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
        </div>
    )
}