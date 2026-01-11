"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StoreFormData } from '@/schemas/auth'
import { BusinessHoursSelector } from '../business-hours/business-hours-selector'
import { WeekHours } from '../business-hours/time-utils'
import StoreForm from '../store-form'

interface CreateStoreViewProps {
    hours: WeekHours
    setHours: (hours: WeekHours) => void
    setStoreDetails: (details: StoreFormData) => void
}

export default function CreateStoreView({ hours, setHours, setStoreDetails }: CreateStoreViewProps) {
    return (
        <div className='grid grid-cols-1 gap-4 lg:gap-6'>
            <Card>
                <CardHeader>
                    <CardTitle>Create Store</CardTitle>
                    <CardDescription>
                        Create your store to manage products and orders
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <StoreForm mode="create" onChange={setStoreDetails} />
                </CardContent>
            </Card>
            <BusinessHoursSelector value={hours} onChangeAction={setHours} />

        </div>
    )
}
