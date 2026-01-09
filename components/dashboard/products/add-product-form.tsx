"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
            <CardHeader>
                <div className="flex items-center justify-between">
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
                </div>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Basic Product Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
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
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category *</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="pizza">Pizza</SelectItem>
                                                <SelectItem value="pasta">Pasta</SelectItem>
                                                <SelectItem value="salads">Salads</SelectItem>
                                                <SelectItem value="beverages">Beverages</SelectItem>
                                                <SelectItem value="desserts">Desserts</SelectItem>
                                                <SelectItem value="appetizers">Appetizers</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Base Price ($) *</FormLabel>
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
                                name="isAvailable"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
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

                        {/* Sub-Options Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-medium">Product Options</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Add customization options like size, toppings, etc.
                                    </p>
                                </div>
                                <Button type="button" variant="outline" size="sm" onClick={addSubOption}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Option Group
                                </Button>
                            </div>

                            {subOptionFields.map((subOption, subOptionIndex) => (
                                <Card key={subOption.id} className="p-4">
                                    <div className="space-y-4">
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

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                                            <FormLabel>Required option</FormLabel>
                                                            <FormDescription>
                                                                Customer must select this option
                                                            </FormDescription>
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        {/* Options within this sub-option */}
                                        <div className="space-y-2">
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
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <Separator />

                        <div className="flex justify-end gap-2">
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