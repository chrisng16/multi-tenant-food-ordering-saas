import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const SignUpForm = () => {
    return (
        <form className="mt-4 grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="fname">First Name</Label>
                <Input id="fname" placeholder="Harry" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="lname">Last Name</Label>
                <Input id="lname" placeholder="Potter" />
            </div>
            <div className="space-y-2 col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            <div className="space-y-2 col-span-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full col-span-2">
                Create Account
            </Button>
        </form>)
}

export default SignUpForm