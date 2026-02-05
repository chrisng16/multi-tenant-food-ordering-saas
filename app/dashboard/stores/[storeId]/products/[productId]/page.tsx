'use client';

import { getProduct } from '@/actions/product/get-product';
import { ProductForm } from '@/components/dashboard/products/product-form';
import { Button } from '@/components/ui/button';
import { AddProductFormData } from '@/schemas/product';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';

interface EditProductPageProps {
    params: Promise<{
        storeId: string
        productId: string
    }>
}


export default function EditProductPage({ params }: EditProductPageProps) {
    const { storeId, productId } = use(params);
    const router = useRouter();

    const [product, setProduct] = useState<AddProductFormData>();
    const [isDirty, setIsDirty] = useState<boolean>(false);

    const [imagePreview, setImagePreview] = useState<string[]>([]);

    const { status, data: result } = useQuery({
        queryKey: ['product', productId],
        queryFn: () => getProduct(productId),
        enabled: !!productId,
    })

    const { isPending, mutate } = useMutation({
        mutationFn: async (updatedProduct: AddProductFormData) => {
            // Implement the update product action here
            // For example:
            // return await updateProduct(storeId, productId, updatedProduct);
        }
    })

    const productData = result?.ok ? result.data : null;

    useEffect(() => {
        if (productData) {
            setProduct({
                name: productData.name,
                description: productData.description || '',
                price: productData.price,
                category: productData.category.name,
                images: productData.images,
                isAvailable: productData.isAvailable,
                subOptions: productData.optionGroups || [],
            });
            setImagePreview(prev => [...prev, ...(productData.images || [])]);

        }
    }, [status]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        // Simulate API call
        setTimeout(() => {
            // Replace with actual API call
            // await fetch(`/api/stores/${storeId}/products/${productId}`, {
            //   method: 'PATCH',
            //   body: JSON.stringify(product),
            // });


            router.push(`/stores/${storeId}/products`);
        }, 1000);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newImages = Array.from(files).map(file => URL.createObjectURL(file));
            setImagePreview([...imagePreview, ...newImages]);
            if (product) {
                setProduct({ ...product, images: [...(product.images ?? []), ...newImages] });
            }
        }
    };

    const removeImage = (index: number) => {
        const newImages = imagePreview.filter((_, i) => i !== index);
        setImagePreview(newImages);
        if (product) {
            setProduct({ ...product, images: newImages });
        }
    };

    if (status === 'pending') {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                    <p className="text-muted-foreground font-light tracking-wide">Loading product...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <p className="text-foreground text-lg">Product not found</p>
                    <Button
                        variant="outline"
                        onClick={() => router.push(`/stores/${storeId}/products`)}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Products
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <ProductForm mode="edit" product={product} onDirtyChange={setIsDirty} onChange={setProduct} storeId={storeId} />
            <div className="sticky bottom-0 bg-background border-t hidden p-4 sm:flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div className="text-xs text-muted-foreground">
                    <span>{isDirty ? "Changes not saved yet." : " "}</span>
                </div>

                <div className="flex gap-3 sm:justify-end">
                    <Button type="button" disabled={isPending || !isDirty} className="flex-1 sm:flex-none" onClick={handleSubmit}>
                        <Save className="size-4" /> Save Product
                    </Button>
                    <Button type="button" variant="outline" onClick={() => window.history.back()} className="flex-1 sm:flex-none">
                        Cancel
                    </Button>
                </div>
            </div>
        </>
    );
}