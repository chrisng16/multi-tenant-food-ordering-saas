"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { SignInFormData, signInSchema } from "@/schemas/auth"
import { Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

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
        mode: "onBlur"
    })

    const onSubmit = async (values: SignInFormData) => {
        setLoading(true)

        await authClient.signIn.email({
            email: values.email,
            password: values.password,
            callbackURL: "/dashboard",
            rememberMe: values.rememberMe,
        }, {
            onRequest: () => {
                setLoading(true)
            },
            onSuccess: () => {
                toast.success("Successfully signed in! Redirecting...")
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
                className="mt-4 flex flex-col gap-4"
                noValidate
                autoComplete="on"
            >
                {/* Email Field */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="signin-email">Email</FormLabel>
                            <FormControl>
                                <Input
                                    id="signin-email"
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

                {/* Password Field */}
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="signin-password">
                                Password
                            </FormLabel>

                            <FormControl>
                                <div className="relative">
                                    <Input
                                        id="signin-password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                        disabled={loading}
                                        {...field}
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

                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                    <FormField
                        control={form.control}
                        name="rememberMe"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={loading}
                                        id="remember-me"
                                    />
                                </FormControl>
                                <FormLabel
                                    htmlFor="remember-me"
                                    className="text-sm font-normal cursor-pointer"
                                >
                                    Remember me
                                </FormLabel>
                            </FormItem>
                        )}
                    />

                    <Link
                        href="/forgot-password"
                        className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline transition-colors"
                        tabIndex={loading ? -1 : 0}
                    >
                        Forgot password?
                    </Link>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing In..." : "Sign In"}
                </Button>

            </form>
        </Form>
    )
}

export default SignInForm