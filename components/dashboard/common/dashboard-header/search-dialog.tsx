"use client"

import { getAllProducts } from '@/actions/product/get-all-products'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Product } from '@/db/schema'
import { cn } from '@/lib/utils/utils'
import { useProductSearchStore } from '@/stores/use-product-search-store'
import { DialogTitle } from '@radix-ui/react-dialog'
import { Package, Search } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import QuickActionButton from '../mobile-action-bar/quick-action-button'

export default function SearchDialog() {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [focusedIndex, setFocusedIndex] = useState(0)
    const pathname = usePathname()
    const router = useRouter()
    const { setSearchQuery } = useProductSearchStore()
    const itemsRef = useRef<(HTMLButtonElement | null)[]>([])

    // Extract store ID from pathname
    const storeId = useMemo(() => {
        if (pathname.startsWith('/dashboard/stores/')) {
            const segments = pathname.split('/').filter(Boolean)
            const storesIndex = segments.indexOf('stores')
            if (storesIndex !== -1 && segments.length > storesIndex + 1) {
                return segments[storesIndex + 1]
            }
        }
        return null
    }, [pathname])

    // Fetch products when dialog opens
    useEffect(() => {
        if (open && storeId) {
            setIsLoading(true)
            getAllProducts(storeId).then((result) => {
                if (result.ok) {
                    setProducts(result.data)
                }
                setIsLoading(false)
            })
        }
    }, [open, storeId])

    // Filter products based on search query
    const filteredProducts = useMemo(() => {
        if (!query.trim()) return []

        const searchLower = query.toLowerCase()
        return products.filter((product) =>
            product.name.toLowerCase().includes(searchLower) ||
            product.description?.toLowerCase().includes(searchLower) ||
            product.sku?.toLowerCase().includes(searchLower)
        )
    }, [query, products])

    // Reset focused index when filtered products change
    useEffect(() => {
        setFocusedIndex(0)
    }, [filteredProducts])

    // Scroll focused item into view
    useEffect(() => {
        if (filteredProducts.length > 0 && itemsRef.current[focusedIndex]) {
            itemsRef.current[focusedIndex]?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        }
    }, [focusedIndex, filteredProducts])

    const handleProductSelect = (product: Product) => {
        setSearchQuery(product.name)
        setOpen(false)
        setQuery('')
        setFocusedIndex(0)
        router.push(`/dashboard/stores/${storeId}/products/${product.id}`)
    }

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // If there are filtered products and one is focused, select it
        if (filteredProducts.length > 0 && filteredProducts[focusedIndex]) {
            handleProductSelect(filteredProducts[focusedIndex])
        } else if (query.trim()) {
            // Otherwise, just do a general search
            setSearchQuery(query)
            setOpen(false)
            setQuery('')
            setFocusedIndex(0)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (filteredProducts.length === 0) return

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault()
                setFocusedIndex((prev) => (prev + 1) % filteredProducts.length)
                break
            case 'ArrowUp':
                e.preventDefault()
                setFocusedIndex((prev) =>
                    prev === 0 ? filteredProducts.length - 1 : prev - 1
                )
                break
        }
    }

    return (
        <Dialog open={open} onOpenChange={(open) => {
            setOpen(open)
            if (!open) {
                setQuery('')
                setFocusedIndex(0)
            }
        }}>
            <DialogTrigger asChild>
                <QuickActionButton ariaLabel={"Search"} icon={Search} />
            </DialogTrigger>
            <DialogContent showCloseButton={false} className="bg-card shadow-2xl ring-2 ring-neutral-200/80 dark:bg-neutral-900 dark:ring-neutral-800 p-2 top-[20%]">
                <DialogHeader className='sr-only'>
                    <DialogTitle>Search Products</DialogTitle>
                    <DialogDescription>Type your search query and press Enter to search for products.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSearchSubmit}>
                    <div className="relative mb-2">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search products..."
                            autoFocus
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="pl-9 focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-transparent focus-visible:bg-transparent focus-visible:text-primary"
                        />
                    </div>

                    {/* Suggestions */}
                    {query.trim() ? (
                        <ScrollArea className="max-h-[400px]">
                            {isLoading ? (
                                <div className="py-8 text-center text-sm text-muted-foreground">
                                    Loading products...
                                </div>
                            ) : filteredProducts.length > 0 ? (
                                <div className="space-y-1">
                                    {filteredProducts.map((product, index) => (
                                        <button
                                            key={product.id}
                                            ref={(el) => {
                                                itemsRef.current[index] = el
                                            }}
                                            type="button"
                                            onClick={() => handleProductSelect(product)}
                                            className={cn(
                                                "w-full flex items-start gap-3 rounded-lg p-3 text-left transition-colors",
                                                "hover:bg-accent focus:bg-accent focus:outline-none",
                                                focusedIndex === index && "bg-accent"
                                            )}
                                        >
                                            <Package className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm">{product.name}</p>
                                                {product.description && (
                                                    <p className="text-xs text-muted-foreground line-clamp-1">
                                                        {product.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-sm font-medium">
                                                        ${(product.price / 100).toFixed(2)}
                                                    </span>
                                                    {product.sku && (
                                                        <span className="text-xs text-muted-foreground">
                                                            SKU: {product.sku}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 text-center text-sm text-muted-foreground">
                                    No products found matching "{query}"
                                </div>
                            )}
                        </ScrollArea>
                    ) : (
                        <div className="py-8 text-center text-sm text-muted-foreground">
                            Start typing to search for products...
                        </div>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    )
}