import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updatePassword } from "@/utils/api";


const accountFormSchema = z.object({
  newPassword: z.string({
    required_error: "Please enter the password",
  }).min(6, {
    message: "Password must be atleast 6 characters",
  }),
  repeatPassword: z.string({
    required_error: "Please repeat the password",
  }).min(6, {
    message: "Password must be atleast 6 characters",
  }),
}).refine((values) => {
  return values.newPassword === values.repeatPassword;
}, {
  message: "Password don't match",
  path: ['repeatPassword'],
})

type AccountFormValues = z.infer<typeof accountFormSchema>

// This can come from your database or API.
const defaultValues: Partial<AccountFormValues> = {
  newPassword: "",
  repeatPassword: "",
}

export function AccountForm() {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  })

  async function onSubmit(data: AccountFormValues) {
    const user = JSON.parse(localStorage.getItem('user'));
    const updatedUser = await updatePassword({ email: user.email, password: data.newPassword });
    console.log({ user, updatedUser });
    toast({
      title: "Notification",
      description: (
        <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <p className="text-white">Password updated successfully!</p>
        </div>
      ),
    });

  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="New Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="repeatPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repeat Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Repeat Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update Password</Button>
      </form>
    </Form>
  )
}