"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    InputGroup,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group"
import { authClient } from "@/lib/auth-client"
import { handleAuthError } from "@/lib/auth-errors-handler"
import { SignInFormData, signInSchema } from "@/schemas/auth"

const SignInForm = () => {
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const form = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    })

    const {
        handleSubmit,
        register,
        formState: { errors },
        watch,
        setValue,
    } = form

    const onSubmit = async (values: SignInFormData) => {
        setLoading(true)
        await authClient.signIn.email(
            {
                email: values.email,
                password: values.password,
                callbackURL: "/dashboard",
                rememberMe: values.rememberMe,
            },
            {
                onRequest: () => setLoading(true),
                onSuccess: (_ctx) => {
                    toast.success("Successfully signed in! Redirecting...")
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
                {/* Email Field */}
                <Field data-invalid={!!errors.email}>
                    <FieldLabel htmlFor="signin-email">Email</FieldLabel>
                    <Input
                        id="signin-email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        disabled={loading}
                        aria-invalid={!!errors.email}
                        {...register("email")}
                    />
                    <FieldError>{errors.email?.message}</FieldError>
                </Field>

                {/* Password + Remember Me */}
                <Field data-invalid={!!errors.password}>
                    <div className="flex justify-between items-center">
                        <FieldLabel htmlFor="signin-password">Password</FieldLabel>
                        <Link
                            href="/forgot-password"
                            className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline transition-colors"
                            tabIndex={-1}
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <FieldGroup className="flex flex-col gap-3">
                        {/* Password InputGroup */}
                        <InputGroup>
                            <InputGroupInput
                                id="signin-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                disabled={loading}
                                aria-invalid={!!errors.password}
                                {...register("password")}
                            />
                            <InputGroupButton
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowPassword((prev) => !prev)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                disabled={loading}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                                ) : (
                                    <Eye className="h-5 w-5" aria-hidden="true" />
                                )}
                            </InputGroupButton>
                        </InputGroup>

                        {/* Remember Me */}
                        <Field orientation="horizontal" className="items-center gap-2">
                            <Checkbox
                                id="remember-me"
                                checked={watch("rememberMe")}
                                onCheckedChange={(checked) =>
                                    setValue("rememberMe", checked as boolean)
                                }
                                disabled={loading}
                            />
                            <FieldLabel
                                htmlFor="remember-me"
                                className="text-sm font-normal cursor-pointer"
                            >
                                Remember me
                            </FieldLabel>
                        </Field>
                    </FieldGroup>

                    <FieldError>{errors.password?.message}</FieldError>
                </Field>
            </FieldSet>

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
            </Button>
        </form>
    )
}

export default SignInForm
