import { Button } from "@/components/ui/button";
import FacebookLogo from '@/public/logos/facebook-logo.png';
import Image from "next/image";

const AuthButtonFacebook = () => {
    return (
        <Button className="w-full flex items-center justify-center gap-2.5 bg-[#1877F2] text-white hover:bg-blue-500 hover:text-white" type="button">
            <Image src={FacebookLogo} alt="Facebook Logo" className="size-5" />
            Continue with Facebook
        </Button>)
}

export default AuthButtonFacebook