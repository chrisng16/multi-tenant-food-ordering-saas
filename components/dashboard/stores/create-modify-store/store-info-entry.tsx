"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { StoreFormData } from '@/schemas/auth'
import { BusinessHoursSelector } from '../business-hours/business-hours-selector'
import { WeekHours } from '../business-hours/time-utils'
import StoreForm from '../store-form'



type StoreInfoEntryProps =
    | {
        mode: "create"
        hours: WeekHours
        setHours: (hours: WeekHours) => void
        store?: StoreFormData
        setStoreDetails: (details: StoreFormData) => void
    }
    | {
        mode: "edit"
        hours: WeekHours
        setHours: (hours: WeekHours) => void
        store: StoreFormData
        setStoreDetails: (details: StoreFormData) => void
    }

export default function StoreInfoEntry({ mode, hours, setHours, store, setStoreDetails }: StoreInfoEntryProps) {
    return (
        <div className='grid grid-cols-1 gap-4 lg:gap-6 w-full max-w-3xl mx-auto pb-[var(--mobile-padding-bottom)] sm:pb-0'>
            <Card>
                <CardHeader>
                    <CardTitle>{mode === "create" ? "Create Store" : "Edit Store"}</CardTitle>
                    <CardDescription>
                        {mode === "create" ? "Create your store to manage products and orders" : "Edit your store details"}
                    </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                    <StoreForm mode={mode} store={store} onChange={setStoreDetails} />
                    <Separator />
                    <BusinessHoursSelector value={hours} onChangeAction={setHours} />
                </CardContent>
            </Card>
        </div>
    )
}
