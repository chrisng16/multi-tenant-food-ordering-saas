import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface QuickActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
    ariaLabel: string;
    icon: LucideIcon;
}

export default function QuickActionButton({ label, ariaLabel, icon: Icon, ...props }: QuickActionButtonProps) {
    return (
        <Button {...props} variant="action-bar-primary" size={label ? "default" : "icon"} aria-label={ariaLabel}>
            <Icon /> {label}
        </Button>
    )
}