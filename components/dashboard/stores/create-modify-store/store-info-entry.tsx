"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Store } from '@/db/schema'
import { StoreSchema } from '@/schemas/store'
import { Save } from 'lucide-react'
import { BusinessHoursSelector } from '../business-hours/business-hours-selector'
import { WeekHours } from '../business-hours/time-utils'
import StoreForm from '../store-form'

type StoreInfoEntryProps =
    | {
        mode: "create"
        hours: WeekHours
        setHours: (hours: WeekHours) => void
        store?: Store
        setStoreDetails: (details: StoreSchema) => void
        onSave: () => void
        onCancel: () => void
        isFormValid: boolean
        setFormValid: (isValid: boolean) => void
    }
    | {
        mode: "edit"
        hours: WeekHours
        setHours: (hours: WeekHours) => void
        store: Store
        setStoreDetails: (details: StoreSchema) => void
        onSave: () => void
        onCancel: () => void
        isFormValid: boolean
        setFormValid: (isValid: boolean) => void
    }

export default function StoreInfoEntry({ mode, hours, setHours, store, setStoreDetails, onSave, onCancel, isFormValid, setFormValid }: StoreInfoEntryProps) {
    return (
        <div className='pb-[var(--mobile-padding-bottom)] sm:pb-0'>
            <Card className='sm:pb-0'>
                <CardHeader>
                    <CardTitle>{mode === "create" ? "Create Store" : "Edit Store"}</CardTitle>
                    <CardDescription>
                        {mode === "create" ? "Create your store to manage products and orders" : "Edit your store details"}
                    </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                    <StoreForm mode={mode} store={store} onChange={setStoreDetails} setFormValid={setFormValid} />
                    <Separator />
                    <BusinessHoursSelector value={hours} onChangeAction={setHours} />
                </CardContent>
                <div className="hidden sm:flex gap-3 sm:justify-end border-t p-4">
                    <Button type="submit" className="flex-1 sm:flex-none" onClick={onSave} disabled={!isFormValid}>
                        <Save className="size-4" /> Save Store
                    </Button>
                    <Button type="button" variant="outline" className="flex-1 sm:flex-none" onClick={onCancel}>
                        Cancel
                    </Button>
                </div>
            </Card>
        </div>
    )
}
