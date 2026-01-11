import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import StoreForm from "./store-form"

interface StoreInfoCardProps {
    store: {
        name: string
        slug: string
        description?: string
    }
}

export function StoreInfoCard({ store }: StoreInfoCardProps) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
                <CardTitle>
                    Store Information
                </CardTitle>
                <CardDescription>
                    Basic details about your store
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <StoreForm mode="edit" store={store} />
            </CardContent>
        </Card>
    )
}
