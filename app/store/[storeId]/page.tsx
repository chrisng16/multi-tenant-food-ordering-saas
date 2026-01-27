import { getAllProducts } from "@/actions/store/get-all-products";
import Storefront from "@/components/store/storefront";

interface StorefrontPageProps {
    params: Promise<{ storeId: string }>;
}

export default async function StorefrontPage({ params }: StorefrontPageProps) {
    const { storeId } = await params;
    const result = await getAllProducts(storeId);

    if (!result.ok) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center px-4">
                <div className="text-center">
                    <h1 className="text-xl font-semibold">We couldn’t load this store</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {result.error.message}
                    </p>
                </div>
            </div>
        );
    }

    return <Storefront storeId={storeId} products={result.data} />;
}
