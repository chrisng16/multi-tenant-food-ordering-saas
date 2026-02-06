"use client"

import { Button } from "@/components/ui/button"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { authClient } from "@/lib/auth/auth-client"
import { handleAuthError } from "@/lib/auth/auth-errors-handler"
import { SignUpFormData, signUpSchema } from "@/schemas/auth"
import { useUIStore } from "@/stores/use-ui-store"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, Eye, EyeOff } from "lucide-react"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const SignUpForm = () => {
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const { closeAuthModal } = useUIStore()

    const form = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        mode: "onBlur",
    })

    const { register, watch, handleSubmit, formState: { errors } } = form

    const password = watch("password")

    const requirements = useMemo(() => [
        { label: "At least 8 characters", met: password.length >= 8 },
        { label: "Contains a number", met: /[0-9]/.test(password) },
        { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    ], [password])


    const onSubmit = async (values: SignUpFormData) => {
        setLoading(true)
        const { name, email, password } = values

        await authClient.signUp.email(
            { email, password, name, callbackURL: "/dashboard/overview" },
            {
                onRequest: () => setLoading(true),
                onSuccess: () => {
                    toast.success("Account created! Check your email for verification.")
                    setLoading(false)
                    closeAuthModal()
                },
                onError: (ctx) => {
                    handleAuthError(ctx)
                    setLoading(false)
                },
            }
        )
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-4 flex flex-col gap-6"
            noValidate
            autoComplete="on"
        >
            <FieldSet>
                {/* Name */}
                <Field data-invalid={!!errors.name}>
                    <FieldLabel htmlFor="signup-name">Name</FieldLabel>
                    <Input
                        id="signup-name"
                        type="text"
                        placeholder="Enter your display name"
                        autoComplete="name"
                        disabled={loading}
                        {...register("name")}
                    />
                    <FieldError>{errors.name?.message}</FieldError>
                </Field>

                {/* Email */}
                <Field data-invalid={!!errors.email}>
                    <FieldLabel htmlFor="signup-email">Email</FieldLabel>
                    <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        disabled={loading}
                        {...register("email")}
                    />
                    <FieldError>{errors.email?.message}</FieldError>
                </Field>

                {/* Password + Confirm Password Group */}
                <FieldGroup>
                    {/* Password */}
                    <Field data-invalid={!!errors.password}>
                        <FieldLabel htmlFor="signup-password">Password</FieldLabel>
                        <InputGroup>
                            <InputGroupInput
                                id="signup-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                autoComplete="new-password"
                                disabled={loading}
                                {...register("password")}
                            />
                            <InputGroupButton
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowPassword(prev => !prev)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                tabIndex={-1}
                                disabled={loading}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </InputGroupButton>
                        </InputGroup>

                        {/* Password Requirements */}
                        {password.length > 0 && !requirements.every(req => req.met) && (
                            <div className="mt-2 space-y-1.5 text-sm">
                                {requirements.map((req, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex items-center gap-2 ${req.met ? 'text-green-600' : 'text-muted-foreground'}`}
                                    >
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${req.met ? 'bg-green-600' : 'border border-muted-foreground/30'}`}>
                                            {req.met && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                        <span>{req.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <FieldError>{errors.password?.message}</FieldError>
                    </Field>

                    {/* Confirm Password */}
                    <Field data-invalid={!!errors.confirmPassword}>
                        <FieldLabel htmlFor="signup-confirm-password">Confirm Password</FieldLabel>
                        <InputGroup>
                            <InputGroupInput
                                id="signup-confirm-password"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                autoComplete="new-password"
                                disabled={loading}
                                {...register("confirmPassword")}
                            />
                            <InputGroupButton
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowConfirmPassword(prev => !prev)}
                                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                tabIndex={-1}
                                disabled={loading}
                            >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </InputGroupButton>
                        </InputGroup>

                        <FieldError>{errors.confirmPassword?.message}</FieldError>
                    </Field>
                </FieldGroup>
            </FieldSet>

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
    )
}

export default SignUpForm
