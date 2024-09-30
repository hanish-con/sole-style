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
import { useState } from "react";
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { UserModel } from "@/models/user";
import { registerUser } from "@/utils/api";

const formSchema = z.object({
  firstName: z.string(),
  lastName: z.string().optional(),
  email: z.string().email(),
  password: z.string({ required_error: "Password is required" }).min(6),
});

export function SignUpForm() {
  const navigate = useNavigate();
  const [signUpError, setSignUpError] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  })

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log({ values });
    const res = await registerUser((values as unknown) as UserModel);
    // console.log({ res });
    if (!res.ok) {
      const { error } = await res.json();
      console.log({ status_code: res.status, error });
      setSignUpError(error);
      form.setError("email", {message: ""});
      return;
    }
    navigate("/login");
    return;
  }

  return (
    <Form {...form}>
      <form className="form-card" onSubmit={form.handleSubmit(handleSubmit)}>
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl">Sign Up</CardTitle>
            <CardDescription>
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex" htmlFor="firstName">First Name</FormLabel>
                        <FormControl>
                          <Input
                            id="first-name"
                            placeholder="Max"
                            required
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="flex" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex" htmlFor="lastName">Last Name</FormLabel>
                        <FormControl>
                          <Input
                            id="last-name"
                            placeholder="Planck"
                            required
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="flex" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
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
                          type="email"
                          placeholder="m@example.com"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="flex" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex" htmlFor="password">Password</FormLabel>
                      <FormControl>
                        <Input
                          id="password"
                          type="password"
                          placeholder="6+ characters"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="flex" />
                    </FormItem>
                  )}
                />
              </div>
              { signUpError && <FormMessage>{ signUpError }</FormMessage>}
              <Button type="submit" className="w-full">
                Create an account
              </Button>
              {/* <Button variant="outline" className="w-full">
                Sign up with GitHub
              </Button> */}
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}