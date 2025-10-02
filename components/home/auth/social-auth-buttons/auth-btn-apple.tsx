import { Button } from "@/components/ui/button";
import AppleLogo from '@/public/logos/apple-logo-dark.svg';
import Image from "next/image";

const AuthButtonApple = () => {
    return (
        <Button className="w-full flex items-center justify-center gap-2.5" type="button">
            <Image src={AppleLogo} alt="Apple Logo" className="size-5" />
            Continue with Apple
        </Button>)
}

export default AuthButtonApple