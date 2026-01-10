import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function CreateStoreButton() {
    return (
        <Button variant="action-bar-primary" className='h-11 w-full' aria-label="Edit Store">
            <Plus /> Create Store
        </Button>
    )
}
