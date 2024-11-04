"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { signInSchema, SignInSchemaType } from "@/actions/user/schema"
import { signIn } from "next-auth/react"

export default function SignInCard() {
    const router = useRouter()
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<SignInSchemaType>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: SignInSchemaType) {
        setIsLoading(true)
        try {
            const res = await signIn('credentials', {
                username: values?.email,
                password: values?.password,
                redirect: false,
            })
            setIsLoading(false);
            if (res?.error) {
                toast({
                    title: "Error",
                    description: res?.error || "Failed to sign in, try again",
                })
            }
            else {
                toast({
                    title: "Response",
                    description: "Signed in successfully",
                })
                setTimeout(() => {
                    setIsLoading(false)
                    router.push("/");
                }, 2000)
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to sign in, try again",
            })
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md bg-slate-900 border-none text-white">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center text-blue-600">Sign in to WorkStream</CardTitle>
                    <CardDescription className="text-center text-slate-200">
                        Enter your credentials to sign in
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input className="bg-slate-800 border-none placeholder:text-slate-200"
                                                type="email" placeholder="john@example.com" {...field} />
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
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-slate-800 border-none placeholder:text-slate-200"
                                                type="password" placeholder="********" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full bg-blue-600" disabled={isLoading}>
                                {isLoading ? "Signing in..." : "Sign in"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}