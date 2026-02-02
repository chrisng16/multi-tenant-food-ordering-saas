'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2, Save, Upload, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    sku: string;
    images: string[];
    status: 'active' | 'draft' | 'archived';
}

interface EditProductPageProps {
    params: Promise<{
        storeId: string
        productId: string
    }>
}


export default function EditProductPage({ params }: EditProductPageProps) {
    const { storeId, productId } = use(params);
    const router = useRouter();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [imagePreview, setImagePreview] = useState<string[]>([]);

    useEffect(() => {
        // Simulate API call to fetch product
        const fetchProduct = async () => {
            setLoading(true);
            // Replace with actual API call
            // const response = await fetch(`/api/stores/${storeId}/products/${productId}`);
            // const data = await response.json();

            // Mock data
            setTimeout(() => {
                const mockProduct: Product = {
                    id: productId,
                    name: 'Premium Wireless Headphones',
                    description: 'High-fidelity wireless headphones with active noise cancellation and 30-hour battery life.',
                    price: 299.99,
                    category: 'electronics',
                    stock: 45,
                    sku: 'WH-PRO-001',
                    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
                    status: 'active',
                };
                setProduct(mockProduct);
                setImagePreview(mockProduct.images);
                setLoading(false);
            }, 800);
        };

        fetchProduct();
    }, [storeId, productId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        // Simulate API call
        setTimeout(() => {
            // Replace with actual API call
            // await fetch(`/api/stores/${storeId}/products/${productId}`, {
            //   method: 'PATCH',
            //   body: JSON.stringify(product),
            // });

            setSaving(false);
            router.push(`/stores/${storeId}/products`);
        }, 1000);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newImages = Array.from(files).map(file => URL.createObjectURL(file));
            setImagePreview([...imagePreview, ...newImages]);
            if (product) {
                setProduct({ ...product, images: [...product.images, ...newImages] });
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

    if (loading) {
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
        <div className="min-h-screen bg-background">
            <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Work+Sans:wght@300;400;500;600&display=swap');
        
        * {
          font-feature-settings: "liga" 1, "calt" 1;
        }
        
        .heading-font {
          font-family: 'Cormorant Garamond', serif;
        }
        
        .body-font {
          font-family: 'Work Sans', sans-serif;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slide-in {
          animation: slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .stagger-1 {
          animation-delay: 0.1s;
          opacity: 0;
        }

        .stagger-2 {
          animation-delay: 0.2s;
          opacity: 0;
        }

        .stagger-3 {
          animation-delay: 0.3s;
          opacity: 0;
        }

        input, textarea, select {
          font-family: 'Work Sans', sans-serif !important;
        }

        .image-preview-item {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .image-preview-item:hover {
          transform: scale(1.02);
        }
      `}</style>

            {/* Header */}
            <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10 animate-fade-in">
                <div className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="heading-font text-3xl font-semibold text-foreground tracking-tight">
                                Edit Product
                            </h1>
                            <p className="body-font text-sm text-muted-foreground mt-1">
                                Store ID: {storeId}
                            </p>
                        </div>
                    </div>
                    <Badge
                        variant={product.status === 'active' ? 'default' : 'secondary'}
                        className="body-font"
                    >
                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                    </Badge>
                </div>

            </header>

            {/* Main Content */}
            <main className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card className="animate-slide-in stagger-2">
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="body-font text-foreground font-medium">
                                        Product Name
                                    </Label>
                                    <Input
                                        id="name"
                                        value={product.name}
                                        onChange={(e) => setProduct({ ...product, name: e.target.value })}
                                        className="body-font"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sku" className="body-font text-foreground font-medium">
                                        SKU
                                    </Label>
                                    <Input
                                        id="sku"
                                        value={product.sku}
                                        onChange={(e) => setProduct({ ...product, sku: e.target.value })}
                                        className="body-font"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="body-font text-foreground font-medium">
                                    Description
                                </Label>
                                <Textarea
                                    id="description"
                                    value={product.description}
                                    onChange={(e) => setProduct({ ...product, description: e.target.value })}
                                    className="body-font min-h-[120px] resize-none"
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Product Images */}
                    <Card className="p-8 border-border shadow-sm animate-slide-in stagger-1">
                        <h2 className="heading-font text-2xl font-semibold text-foreground mb-6">
                            Product Images
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            {imagePreview.map((image, index) => (
                                <div
                                    key={index}
                                    className="relative aspect-square rounded-lg overflow-hidden bg-muted border border-border image-preview-item group"
                                >
                                    <img
                                        src={image}
                                        alt={`Product ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10"
                                    >
                                        <X className="w-4 h-4 text-foreground hover:text-destructive" />
                                    </button>
                                </div>
                            ))}

                            <label className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center cursor-pointer transition-colors bg-muted/50 hover:bg-muted">
                                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                                <span className="body-font text-sm text-muted-foreground">Upload</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        <p className="body-font text-xs text-muted-foreground">
                            Add up to 10 product images. First image will be the primary display.
                        </p>
                    </Card>

                    {/* Pricing & Inventory */}
                    <Card className="p-8 border-border shadow-sm animate-slide-in stagger-3">
                        <h2 className="heading-font text-2xl font-semibold text-foreground mb-6">
                            Pricing & Inventory
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="price" className="body-font text-foreground font-medium">
                                    Price (USD)
                                </Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground body-font">
                                        $
                                    </span>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        value={product.price}
                                        onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
                                        className="body-font pl-7"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="stock" className="body-font text-foreground font-medium">
                                    Stock Quantity
                                </Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    value={product.stock}
                                    onChange={(e) => setProduct({ ...product, stock: parseInt(e.target.value) })}
                                    className="body-font"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category" className="body-font text-foreground font-medium">
                                    Category
                                </Label>
                                <Select
                                    value={product.category}
                                    onValueChange={(value) => setProduct({ ...product, category: value })}
                                >
                                    <SelectTrigger className="body-font">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="electronics">Electronics</SelectItem>
                                        <SelectItem value="clothing">Clothing</SelectItem>
                                        <SelectItem value="accessories">Accessories</SelectItem>
                                        <SelectItem value="home">Home & Garden</SelectItem>
                                        <SelectItem value="sports">Sports & Outdoors</SelectItem>
                                        <SelectItem value="books">Books</SelectItem>
                                        <SelectItem value="toys">Toys & Games</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </Card>

                    {/* Status */}
                    <Card className="p-8 border-border shadow-sm animate-slide-in stagger-3">
                        <h2 className="heading-font text-2xl font-semibold text-foreground mb-6">
                            Product Status
                        </h2>

                        <div className="space-y-2">
                            <Label htmlFor="status" className="body-font text-foreground font-medium">
                                Status
                            </Label>
                            <Select
                                value={product.status}
                                onValueChange={(value: 'active' | 'draft' | 'archived') =>
                                    setProduct({ ...product, status: value })
                                }
                            >
                                <SelectTrigger className="body-font max-w-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="body-font text-xs text-muted-foreground mt-2">
                                Active products are visible to customers. Drafts are hidden.
                            </p>
                        </div>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-6 border-t border-border">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push(`/stores/${storeId}/products`)}
                            className="body-font"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={saving}
                            className="body-font px-8"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </main>
        </div>
    );
}