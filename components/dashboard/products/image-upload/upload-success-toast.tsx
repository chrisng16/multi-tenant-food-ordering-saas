import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";
import { CheckCircle2, X } from "lucide-react";
import { useEffect, useState } from "react";

interface UploadSuccessToastProps {
    show: boolean;
    count: number;
    onClose: () => void;
    onViewGallery: () => void;
}

export function UploadSuccessToast({
    show,
    count,
    onClose,
    onViewGallery,
}: UploadSuccessToastProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (show) {
            setIsVisible(true);
            // Auto-dismiss after 5 seconds
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(onClose, 300); // Wait for animation
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div
            className={cn(
                "fixed bottom-4 right-4 z-50 max-w-sm transition-all duration-300",
                isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            )}
        >
            <div className="bg-card border rounded-lg shadow-lg p-4 flex items-start gap-3">
                <div className="flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex-1 space-y-2">
                    <p className="font-medium text-sm">Upload Complete!</p>
                    <p className="text-sm text-muted-foreground">
                        {count} image{count !== 1 ? "s" : ""} uploaded successfully
                    </p>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                            onViewGallery();
                            setIsVisible(false);
                            setTimeout(onClose, 300);
                        }}
                        className="w-full"
                    >
                        View in Gallery
                    </Button>
                </div>
                <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 flex-shrink-0"
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(onClose, 300);
                    }}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}