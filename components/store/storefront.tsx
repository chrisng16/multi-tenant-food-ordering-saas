"use client";

import { Palette, Search, Sparkles, Utensils } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

type StorefrontProduct = {
    id: string;
    storeId: string;
    name: string;
    description: string | null;
    price: string | number;
    createdAt: Date;
    updatedAt: Date;
};

type ColorTheme = {
    name: string;
    primary: string;
    secondary: string;
    accent: string;
    cta: string;
    ctaHover: string;
    background: string;
    cardBackground: string;
    text: string;
    textMuted: string;
    border: string;
    gradientFrom: string;
    gradientTo: string;
};

const PRESET_THEMES: Record<string, ColorTheme> = {
    vibrant: {
        name: "Vibrant Orange",
        primary: "#FF6B35",
        secondary: "#F7931E",
        accent: "#FDB833",
        cta: "#FF6B35",
        ctaHover: "#E85A2A",
        background: "#FFFFFF",
        cardBackground: "#FFFBF5",
        text: "#1A1A1A",
        textMuted: "#6B6B6B",
        border: "#FFE4D6",
        gradientFrom: "#FF6B35",
        gradientTo: "#FDB833",
    },
    luxury: {
        name: "Luxury Gold",
        primary: "#D4AF37",
        secondary: "#8B7355",
        accent: "#F4E4C1",
        cta: "#D4AF37",
        ctaHover: "#B8962E",
        background: "#FAFAF8",
        cardBackground: "#FFFFFF",
        text: "#2C2C2C",
        textMuted: "#6E6E6E",
        border: "#E8D5B5",
        gradientFrom: "#D4AF37",
        gradientTo: "#8B7355",
    },
    fresh: {
        name: "Fresh Green",
        primary: "#4CAF50",
        secondary: "#8BC34A",
        accent: "#CDDC39",
        cta: "#4CAF50",
        ctaHover: "#43A047",
        background: "#F9FFF9",
        cardBackground: "#FFFFFF",
        text: "#1B5E20",
        textMuted: "#558B2F",
        border: "#C8E6C9",
        gradientFrom: "#4CAF50",
        gradientTo: "#8BC34A",
    },
    ocean: {
        name: "Ocean Blue",
        primary: "#0077BE",
        secondary: "#00A8E8",
        accent: "#48CAE4",
        cta: "#0077BE",
        ctaHover: "#005F96",
        background: "#F0F9FF",
        cardBackground: "#FFFFFF",
        text: "#003049",
        textMuted: "#4A5568",
        border: "#B8E0F6",
        gradientFrom: "#0077BE",
        gradientTo: "#48CAE4",
    },
    sunset: {
        name: "Sunset Pink",
        primary: "#E91E63",
        secondary: "#FF6090",
        accent: "#FFB3D9",
        cta: "#E91E63",
        ctaHover: "#C2185B",
        background: "#FFF5F8",
        cardBackground: "#FFFFFF",
        text: "#880E4F",
        textMuted: "#6B6B6B",
        border: "#F8BBD0",
        gradientFrom: "#E91E63",
        gradientTo: "#FF6090",
    },
};

const CATEGORY_KEYWORDS = [
    "pizza",
    "pasta",
    "salad",
    "beverage",
    "drink",
    "dessert",
    "appetizer",
    "sandwich",
    "burger",
    "soup",
];

function inferCategory(product: StorefrontProduct) {
    const text = `${product.name} ${product.description ?? ""}`.toLowerCase();
    const match = CATEGORY_KEYWORDS.find((keyword) => text.includes(keyword));
    if (!match) return "Uncategorized";
    return match.charAt(0).toUpperCase() + match.slice(1);
}

function formatPrice(value: StorefrontProduct["price"]) {
    const amount = typeof value === "string" ? Number(value) : value;
    if (Number.isNaN(amount)) return "";
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
    }).format(amount);
}

type StorefrontProps = {
    storeId: string;
    products: StorefrontProduct[];
    customTheme?: Partial<ColorTheme>;
    themePreset?: keyof typeof PRESET_THEMES;
};

export default function Storefront({
    storeId,
    products,
    customTheme,
    themePreset = "vibrant"
}: StorefrontProps) {
    const [activeCategory, setActiveCategory] = React.useState("All");
    const [query, setQuery] = React.useState("");
    const [showThemeSelector, setShowThemeSelector] = React.useState(false);
    const [selectedTheme, setSelectedTheme] = React.useState<keyof typeof PRESET_THEMES>(themePreset);
    const sectionRefs = React.useRef<Record<string, HTMLElement | null>>({});

    const activeTheme = React.useMemo(() => {
        const baseTheme = PRESET_THEMES[selectedTheme];
        return customTheme ? { ...baseTheme, ...customTheme } : baseTheme;
    }, [selectedTheme, customTheme]);

    const filteredProducts = React.useMemo(() => {
        const loweredQuery = query.trim().toLowerCase();
        return products.filter((product) => {
            const matchesQuery =
                !loweredQuery ||
                product.name.toLowerCase().includes(loweredQuery) ||
                (product.description ?? "").toLowerCase().includes(loweredQuery);
            return matchesQuery;
        });
    }, [products, query]);

    const groupedProducts = React.useMemo(() => {
        return filteredProducts.reduce<Record<string, StorefrontProduct[]>>((acc, product) => {
            const category = inferCategory(product);
            if (!acc[category]) acc[category] = [];
            acc[category].push(product);
            return acc;
        }, {});
    }, [filteredProducts]);

    const visibleCategories = React.useMemo(() => {
        return Object.keys(groupedProducts).sort();
    }, [groupedProducts]);

    const categories = React.useMemo(() => ["All", ...visibleCategories], [visibleCategories]);
    const categoryKey = React.useMemo(() => categories.join("|"), [categories]);

    React.useEffect(() => {
        if (visibleCategories.length === 0) {
            setActiveCategory("All");
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

                if (visible?.target) {
                    const next = visible.target.getAttribute("data-category");
                    if (next) setActiveCategory(next);
                } else if (window.scrollY < 200) {
                    setActiveCategory("All");
                }
            },
            {
                rootMargin: "-35% 0px -55% 0px",
                threshold: [0, 0.2, 0.6, 1],
            }
        );

        visibleCategories.forEach((category) => {
            const element = sectionRefs.current[category];
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [visibleCategories, categoryKey]);

    const handleCategoryClick = (category: string) => {
        setActiveCategory(category);
        if (category === "All") {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        const target = sectionRefs.current[category];
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <div
            className="min-h-screen transition-colors duration-500"
            style={{
                background: `linear-gradient(to bottom, ${activeTheme.background} 0%, ${activeTheme.cardBackground} 100%)`
            }}
        >
            {/* Theme Selector Toggle */}
            <button
                onClick={() => setShowThemeSelector(!showThemeSelector)}
                className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all hover:scale-[1.02]"
                style={{
                    backgroundColor: activeTheme.cta,
                    color: '#FFFFFF',
                }}
            >
                <Palette className="h-6 w-6" />
            </button>

            {/* Theme Selector Panel */}
            {showThemeSelector && (
                <div
                    className="fixed bottom-24 right-6 z-50 w-72 rounded-lg p-4 shadow-xl"
                    style={{
                        backgroundColor: activeTheme.cardBackground,
                        border: `1px solid ${activeTheme.border}`,
                    }}
                >
                    <h3 className="mb-3 text-sm font-semibold" style={{ color: activeTheme.text }}>
                        Choose Theme
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        {Object.entries(PRESET_THEMES).map(([key, theme]) => (
                            <button
                                key={key}
                                onClick={() => setSelectedTheme(key as keyof typeof PRESET_THEMES)}
                                className="rounded-lg p-3 text-left text-xs font-medium transition-all hover:scale-105"
                                style={{
                                    backgroundColor: selectedTheme === key ? theme.primary : theme.accent,
                                    color: selectedTheme === key ? '#FFFFFF' : theme.text,
                                    border: `2px solid ${selectedTheme === key ? theme.primary : 'transparent'}`,
                                }}
                            >
                                {theme.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Header Section */}
            <section className="relative overflow-hidden border-b" style={{ borderColor: activeTheme.border }}>
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        background: `radial-gradient(circle at top, ${activeTheme.gradientFrom}, transparent)`,
                    }}
                />
                <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="relative flex flex-col gap-6">
                        <div className="flex items-center gap-3 text-sm">
                            <span
                                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
                                style={{
                                    backgroundColor: `${activeTheme.primary}20`,
                                    color: activeTheme.primary,
                                    border: `1px solid ${activeTheme.primary}40`,
                                }}
                            >
                                <Sparkles className="h-3.5 w-3.5" />
                                Fresh picks curated just for you
                            </span>
                        </div>
                        <div className="flex flex-col gap-3">
                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: activeTheme.text }}>
                                Welcome to your store
                            </h1>
                            <p className="max-w-2xl text-base" style={{ color: activeTheme.textMuted }}>
                                Browse delicious offerings, filter by category, and quickly find your favorites.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="mt-2 w-full max-w-xl">
                                <InputGroup
                                    className="rounded-full shadow-sm"
                                    style={{
                                        backgroundColor: `${activeTheme.cardBackground}CC`,
                                        border: `1px solid ${activeTheme.border}`,
                                    }}
                                >
                                    <InputGroupAddon align="inline-start">
                                        <Search className="h-4 w-4" style={{ color: activeTheme.textMuted }} />
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        className="rounded-full"
                                        value={query}
                                        onChange={(event) => setQuery(event.target.value)}
                                        placeholder="Search for dishes, drinks, or flavors"
                                        aria-label="Search products"
                                        style={{ color: activeTheme.text }}
                                    />
                                </InputGroup>
                            </div>
                            <div
                                className="flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
                                style={{
                                    backgroundColor: `${activeTheme.primary}20`,
                                    color: activeTheme.primary,
                                }}
                            >
                                <Utensils className="h-4 w-4" />
                                <span>Ready to order in minutes</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-10 pt-6 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold" style={{ color: activeTheme.text }}>Menu</h2>
                        <p className="text-sm" style={{ color: activeTheme.textMuted }}>
                            Explore what this store has to offer.
                        </p>
                    </div>

                    <Badge
                        variant="outline"
                        className="text-xs"
                        style={{
                            borderColor: activeTheme.border,
                            color: activeTheme.textMuted,
                        }}
                    >
                        Store ID: {storeId}
                    </Badge>
                </div>

                {/* Category Navigation */}
                <div
                    className="sticky top-0 z-20 -mx-4 border-b py-4 px-4 shadow-sm backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
                    style={{
                        backgroundColor: `${activeTheme.cardBackground}E6`,
                        borderColor: activeTheme.border,
                    }}
                >
                    <div className="flex flex-col gap-3">
                        <span
                            className="text-xs font-semibold uppercase tracking-wide"
                            style={{ color: activeTheme.textMuted }}
                        >
                            Categories
                        </span>
                        <div className="flex items-center gap-2 overflow-x-auto pb-1">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => handleCategoryClick(category)}
                                    className="whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all hover:scale-105"
                                    style={
                                        activeCategory === category
                                            ? {
                                                backgroundColor: activeTheme.primary,
                                                color: '#FFFFFF',
                                                borderColor: activeTheme.primary,
                                                boxShadow: `0 4px 12px ${activeTheme.primary}40`,
                                            }
                                            : {
                                                backgroundColor: `${activeTheme.primary}20`,
                                                color: activeTheme.primary,
                                                borderColor: `${activeTheme.primary}40`,
                                            }
                                    }
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                {visibleCategories.length === 0 ? (
                    <Card style={{ backgroundColor: activeTheme.cardBackground, borderColor: activeTheme.border }}>
                        <CardContent className="py-12 text-center">
                            <p className="text-lg font-semibold" style={{ color: activeTheme.text }}>
                                No matching items
                            </p>
                            <p className="mt-2 text-sm" style={{ color: activeTheme.textMuted }}>
                                Try a different search to discover more.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="flex flex-col gap-10">
                        {visibleCategories.map((category) => (
                            <section
                                key={category}
                                data-category={category}
                                ref={(node) => {
                                    sectionRefs.current[category] = node;
                                }}
                                className="scroll-mt-32"
                            >
                                <div className="mb-4 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold" style={{ color: activeTheme.text }}>
                                            {category}
                                        </h3>
                                        <p className="text-sm" style={{ color: activeTheme.textMuted }}>
                                            {groupedProducts[category]?.length ?? 0} item(s)
                                        </p>
                                    </div>
                                    <Badge
                                        className="text-xs"
                                        style={{
                                            backgroundColor: `${activeTheme.primary}20`,
                                            color: activeTheme.primary,
                                            border: `1px solid ${activeTheme.primary}40`,
                                        }}
                                    >
                                        Popular picks
                                    </Badge>
                                </div>

                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {groupedProducts[category].map((product) => (
                                        <Card
                                            key={product.id}
                                            className="group overflow-hidden transition-all hover:scale-[1.02]"
                                            style={{
                                                backgroundColor: activeTheme.cardBackground,
                                                borderColor: activeTheme.border,
                                            }}
                                        >
                                            <CardHeader className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <Badge
                                                        className="text-xs"
                                                        style={{
                                                            backgroundColor: `${activeTheme.primary}20`,
                                                            color: activeTheme.primary,
                                                            border: `1px solid ${activeTheme.primary}40`,
                                                        }}
                                                    >
                                                        {category}
                                                    </Badge>
                                                    <span
                                                        className="text-sm font-semibold"
                                                        style={{ color: activeTheme.primary }}
                                                    >
                                                        {formatPrice(product.price)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-semibold" style={{ color: activeTheme.text }}>
                                                        {product.name}
                                                    </h4>
                                                    {product.description && (
                                                        <p
                                                            className="mt-2 line-clamp-2 text-sm"
                                                            style={{ color: activeTheme.textMuted }}
                                                        >
                                                            {product.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </CardHeader>
                                            <CardContent className="flex items-center justify-between gap-3">
                                                <span className="text-xs" style={{ color: activeTheme.textMuted }}>
                                                    Made fresh on order
                                                </span>
                                                <Button
                                                    size="sm"
                                                    className="shadow-sm transition-all hover:scale-105"
                                                    style={{
                                                        backgroundColor: activeTheme.cta,
                                                        color: '#FFFFFF',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.backgroundColor = activeTheme.ctaHover;
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.backgroundColor = activeTheme.cta;
                                                    }}
                                                >
                                                    Add to cart
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}