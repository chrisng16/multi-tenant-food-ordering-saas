import { Button } from "@/components/ui/button"
import Image from "next/image"
import GoogleLogo from '@/public/logos/google-icon.svg';

const AuthButtonGoogle = () => {
    return (
        <Button variant="outline" className="w-full flex items-center justify-center gap-2.5 bg-[#f2f2f2]" type="button">
            <Image src={GoogleLogo} alt="Google Logo" className="size-5" />
            Continue with Google
        </Button>)
}

export default AuthButtonGoogle