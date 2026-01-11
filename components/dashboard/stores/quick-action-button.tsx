import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface QuickActionButtonProps {
    label: string;
    ariaLabel: string;
    icon: LucideIcon;
    onClick: () => void
}

export default function QuickActionButton({ label, ariaLabel, icon: Icon, onClick }: QuickActionButtonProps) {
    return (
        <Button variant="action-bar-primary" className='w-full rounded-full' size='lg' aria-label={ariaLabel} onClick={onClick}>
            <Icon /> {label}
        </Button>
    )
}