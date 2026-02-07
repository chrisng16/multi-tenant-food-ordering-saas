'use client';

import { getProduct } from '@/actions/product/get-product';
import { updateProduct } from '@/actions/product/update-product';
import MABTemplate from '@/components/dashboard/common/mobile-action-bar/mab-template';
import { MobileActionBar } from '@/components/dashboard/common/mobile-action-bar/mobile-action-bar';
import QuickActionButton from '@/components/dashboard/common/mobile-action-bar/quick-action-button';
import { ImageUploadRef } from '@/components/dashboard/products/image-upload/image-upload';
import { ProductForm } from '@/components/dashboard/products/product-form';
import { Button } from '@/components/ui/button';
import { AddProductFormData } from '@/schemas/product';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { isValid } from 'zod/v3';

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
    const [isUploadingImages, setIsUploadingImages] = useState(false);

    // Ref to access ImageUpload's upload method
    const imageUploadRef = useRef<ImageUploadRef>(null);

    const queryClient = useQueryClient();

    const { status, data: result } = useQuery({
        queryKey: ['product', productId],
        queryFn: () => getProduct(productId),
        enabled: !!productId,
    })

    const { isPending, mutate } = useMutation({
        mutationFn: () => updateProduct(storeId, productId, product ?? {}),
        onSuccess: () => {
            setIsDirty(false);
            queryClient.invalidateQueries({ queryKey: ['product', productId] });
            toast("Success",
                {
                    description: "Product updated successfully",
                });
        },
        onError: (error) => {
            console.error("Error updating product:", error);
            toast.error("Error", {
                description: "Failed to update product",
            });
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
                isAvailable: productData.isAvailable,
                subOptions: productData.optionGroups || [],
                uploadedImages: productData?.uploadedImages || [],
            });
        }
    }, [status]);

    const handleSubmit = async () => {
        try {
            // First, upload any pending images
            const pendingCount = imageUploadRef.current?.getPendingCount() ?? 0;

            if (pendingCount > 0) {
                setIsUploadingImages(true);
                toast("Uploading images", {
                    description: `Uploading ${pendingCount} image(s)...`,
                });

                await imageUploadRef.current?.uploadPendingFiles();
                setIsUploadingImages(false);
            }

            // Then save the product
            mutate();
        } catch (error) {
            console.error("Error during save:", error);
            setIsUploadingImages(false);
            toast.error("Error", {
                description: "Failed to upload images",
            });
        }
    };

    const isSaving = isPending || isUploadingImages;
    const hasPendingImages = (imageUploadRef.current?.getPendingCount() ?? 0) > 0;

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
                        onClick={() => router.push(`/dashboard/stores/${storeId}/products`)}
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
            <ProductForm
                mode="edit"
                product={{ id: productId, ...product }}
                onDirtyChange={setIsDirty}
                onChange={setProduct}
                storeId={storeId}
                imageUploadRef={imageUploadRef}
            />
            <div className="sticky bottom-0 bg-background border-t hidden p-4 sm:flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div className="text-xs text-muted-foreground">
                    <span>
                        {isUploadingImages
                            ? "Uploading images..."
                            : isDirty || hasPendingImages
                                ? "Changes not saved yet."
                                : " "}
                    </span>
                </div>

                <div className="flex gap-3 sm:justify-end">
                    <Button
                        type="button"
                        disabled={isSaving || (!isDirty && !hasPendingImages)}
                        className="flex-1 sm:flex-none"
                        onClick={handleSubmit}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                {isUploadingImages ? "Uploading..." : "Saving..."}
                            </>
                        ) : (
                            <>
                                <Save className="size-4" /> Save Product
                            </>
                        )}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => window.history.back()}
                        className="flex-1 sm:flex-none"
                        disabled={isSaving}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
            <MobileActionBar>
                <MABTemplate showRightButton={false}>
                    <QuickActionButton className="w-full" onClick={handleSubmit} disabled={!isDirty || !isValid || isPending} icon={Save} label={"Save Product"} ariaLabel={"Create Product"} />
                </MABTemplate>
            </MobileActionBar >
        </>
    );
}