import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react";
import { loginUser } from "@/utils/api";
import { UserModel } from "@/models/user";
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

const formSchema = z.object({
    email: z.string().email(),
    password: z.string({ required_error: "Password is required"}),
})


export function LoginForm() {
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        },
    })
    const [loginError, setLoginError] = useState("");

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log({ values });
        const res = await loginUser((values as unknown) as UserModel);
        if (!res.ok) {
            const { error } = await res.json();
            console.log({ status_code: res.status, data: error });
            setLoginError(error);
            form.setError("email", { message: ""});
            form.setError("password", { message: ""});
            return;
        }
        navigate("/");
        return;
    }

    return (
        <Form {...form}>
            <form className="form-card" onSubmit={form.handleSubmit(handleSubmit)}>
                <Card className="mx-auto max-w-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl">Login</CardTitle>
                        <CardDescription>
                            Enter your email below to login to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex" htmlFor="email">Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="email"
                                                    placeholder="m@example.com"
                                                    required
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="flex" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center">
                                                <FormLabel htmlFor="password">Password</FormLabel>
                                                <Link to="#" className="ml-auto inline-block text-sm underline">
                                                    Forgot your password?
                                                </Link>
                                            </div>
                                            <FormControl>
                                                <Input id="password" type="password" {...field} required />

                                            </FormControl>
                                            <FormMessage className="flex" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            { loginError && <FormMessage>{ loginError }</FormMessage>}
                            <Button type="submit" className="w-full">
                                Login
                            </Button>
                            <Button variant="outline" className="w-full">
                                <Link to="/">
                                    Login with Google
                                </Link>
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link to="/signup" className="underline">
                                Sign up
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </Form>
    )
}