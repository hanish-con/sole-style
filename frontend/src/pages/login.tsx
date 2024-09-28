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
import { Label } from "@/components/ui/label"
import { FormEvent } from "react";
import { loginUser } from "@/utils/api";
import { UserModel } from "@/models/user";

export const description =
    "A login form with email and password. There's an option to login with Google and a link to sign up if you don't have an account."

export function LoginForm() {
    const navigate = useNavigate();
    const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        const form = evt.target;
        const data = Object.fromEntries(new FormData(form as HTMLFormElement).entries());

        const res = await loginUser((data as unknown) as UserModel);
        if (!res.ok) {
            console.log({ status_code: res.status, data: await res.json()});
            return;
        }
        navigate("/");
        return;
    }
    return (
        <form className="form-card" onSubmit={handleSubmit}>
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
                            <Label htmlFor="email">Email</Label>
                            <Input
                                name="email"
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <Link to="#" className="ml-auto inline-block text-sm underline">
                                    Forgot your password?
                                </Link>
                            </div>
                            <Input name="password" id="password" type="password" required />
                        </div>
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
    )
}