"use client"

import { Store } from '@/db/schema'
import { StoreSchema } from '@/schemas/store'
import { BusinessHoursSelector } from '../business-hours/business-hours-selector'
import { WeekHours } from '../business-hours/time-utils'
import StoreForm from './store-form'

type StoreInfoEntryProps =
    | {
        mode: "create"
        hours: WeekHours
        setHours: (hours: WeekHours) => void
        store?: Store
        setStoreDetails: (details: StoreSchema) => void
        setFormValid: (isValid: boolean) => void
        setFormDirty: (isDirty: boolean) => void
    }
    | {
        mode: "edit"
        hours: WeekHours
        setHours: (hours: WeekHours) => void
        store: Store
        setStoreDetails: (details: StoreSchema) => void
        setFormValid: (isValid: boolean) => void
        setFormDirty: (isDirty: boolean) => void

    }

export default function StoreInfoEntry({
    mode,
    hours,
    setHours,
    store,
    setStoreDetails,
    setFormValid,
    setFormDirty,
}: StoreInfoEntryProps) {
    return (
        <div className='pb-[var(--mobile-padding-bottom)] sm:pb-0 space-y-4 md:space-y-6'>
            <StoreForm
                mode={mode}
                store={store}
                onChange={setStoreDetails}
                setFormValid={setFormValid}
                setFormDirty={setFormDirty}
            />
            <BusinessHoursSelector hours={hours} onChangeAction={setHours} setFormDirtyAction={setFormDirty} />
        </div>
    )
}