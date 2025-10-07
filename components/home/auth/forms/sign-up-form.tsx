"use client"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { SignUpFormData, signUpSchema } from "@/schemas/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, Eye, EyeOff } from "lucide-react"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const SignUpForm = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [passwordFocused, setPasswordFocused] = useState(false)

    const form = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        }
    })

    const password = form.watch("password")
    const confirmPassword = form.watch("confirmPassword")

    // Password requirements validation - matches Zod schema
    const requirements = useMemo(() => [
        {
            label: "At least 8 characters",
            met: password.length >= 8
        },
        {
            label: "Contains a number",
            met: /[0-9]/.test(password)
        },
        {
            label: "Contains uppercase letter",
            met: /[A-Z]/.test(password)
        },
    ], [password])

    const unmetRequirements = requirements.filter(req => !req.met)
    const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword

    const onSubmit = async (values: SignUpFormData) => {
        setLoading(true)
        const { name, email, password } = values

        await authClient.signUp.email({
            email,
            password,
            name,
            callbackURL: "/dashboard"
        }, {
            onRequest: () => {
                setLoading(true)
            },
            onSuccess: () => {
                toast.success("Account created! Check your email for verification.")
            },
            onError: (ctx) => {
                toast.error(ctx.error.message)
                setLoading(false)
            },
        })
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-4 grid gap-4"
                noValidate
                autoComplete="on"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="signup-name">Name</FormLabel>
                            <FormControl>
                                <Input
                                    id="signup-name"
                                    type="text"
                                    placeholder="Enter your display name"
                                    autoComplete="name"
                                    disabled={loading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="signup-email">Email</FormLabel>
                            <FormControl>
                                <Input
                                    id="signup-email"
                                    type="email"
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    disabled={loading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="signup-password">
                                Password
                            </FormLabel>

                            <FormControl>
                                <div className="relative">
                                    <Input
                                        id="signup-password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                        disabled={loading}
                                        {...field}
                                        onFocus={() => setPasswordFocused(true)}
                                        onBlur={() => setPasswordFocused(false)}
                                        className="pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        tabIndex={-1}
                                        disabled={loading}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" aria-hidden="true" />
                                        ) : (
                                            <Eye className="h-5 w-5" aria-hidden="true" />
                                        )}
                                    </button>
                                </div>
                            </FormControl>

                            {/* Password Requirements */}
                            {passwordFocused && password.length > 0 && (
                                <div className="mt-2 space-y-1.5 text-sm">
                                    {requirements.map((requirement, index) => (
                                        <div
                                            key={index}
                                            className={`flex items-center gap-2 transition-all duration-300 ${requirement.met
                                                ? 'text-green-600 opacity-100'
                                                : 'text-muted-foreground opacity-100'
                                                }`}
                                        >
                                            <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${requirement.met
                                                ? 'bg-green-600'
                                                : 'border border-muted-foreground/30'
                                                }`}>
                                                {requirement.met && (
                                                    <Check className="w-3 h-3 text-white" />
                                                )}
                                            </div>
                                            <span>{requirement.label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="signup-confirm-password">
                                Confirm Password
                            </FormLabel>

                            <FormControl>
                                <div className="relative">
                                    <Input
                                        id="signup-confirm-password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                        disabled={loading}
                                        {...field}
                                        className="pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                                        className="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                        tabIndex={-1}
                                        disabled={loading}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-5 w-5" aria-hidden="true" />
                                        ) : (
                                            <Eye className="h-5 w-5" aria-hidden="true" />
                                        )}
                                    </button>
                                </div>
                            </FormControl>

                            {/* Password Match Indicator */}
                            {confirmPassword.length > 0 && (
                                <div className="mt-2 flex items-center gap-2 text-sm">
                                    {passwordsMatch ? (
                                        <>
                                            <Check className="w-4 h-4 text-green-600" />
                                            <span className="text-green-600">Passwords match</span>
                                        </>
                                    ) : (
                                        <span className="text-destructive">Passwords don't match</span>
                                    )}
                                </div>
                            )}

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="text-xs text-muted-foreground">
                    By signing up, you agree to our{" "}
                    <Button variant="link" className="px-0 h-auto text-xs" type="button">
                        Terms of Service
                    </Button>{" "}
                    and{" "}
                    <Button variant="link" className="px-0 h-auto text-xs" type="button">
                        Privacy Policy
                    </Button>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating Account..." : "Create Account"}
                </Button>
            </form>
        </Form>
    )
}

export default SignUpForm