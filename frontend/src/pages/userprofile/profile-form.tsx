import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { updateUserDetails } from "@/utils/api";
import { Separator } from "@/components/ui/separator";


// address: {
//   street: { type: String, default: "" },
//   city: { type: String, default: "" },
//   state: { type: String, default: "" },
//   zipCode: { type: String, default: "" },
//   country: { type: String, default: "" }
// },

const profileFormSchema = z.object({
  firstName: z.string().min(1, {
    message: "First Name is required"
  }),
  lastName: z.string().min(1, {
    message: "Last Name is required"
  }),
  email: z.string().email(),
  street: z.string().min(1, {
    message: "Street name is required"
  }),
  city: z.string().min(1, {
    message: "City name is required"
  }),
  state: z.string().min(1, {
    message: "State name is required"
  }),
  zipCode: z.string().regex(/^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/, {
    message: "Invalid ZIP code format",
  }),
  country: z.string().min(1, {
    message: "Country name is required"
  }),

})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileForm() {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log({ user });
  const defaultValues: Partial<ProfileFormValues> = {
    ...user, ...user.address,
  }

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  })

  const cities = [
    "Toronto", "Ottawa", "Hamilton", "London", "Kingston", "Mississauga", "Windsor", "Kitchener-Waterloo",
  ];

  async function onSubmit(data: ProfileFormValues) {
    const firstName = data.firstName;
    const lastName = data.lastName;
    const email = data.email;
    delete data?.firstName;
    delete data?.lastName;
    delete data?.email;
    const userDetails = {
      firstName,
      lastName,
      email,
      address: {
        ...data
      }
    }
    console.log({ userDetails });
    const user = await updateUserDetails(userDetails);
    localStorage.setItem('user', JSON.stringify(user));
    toast({
      title: "Notification",
      description: (
        <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <p className="text-white fw-bold">Details Updated!</p>
        </div>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <input type="hidden" value={form.getValues('email')} />
        <div className="grid max-w-md grid-cols-2 gap-8 pt-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Maverik" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <h3 className="text-lg font-medium pt-4">Address</h3>
        <Separator />
        <div className="grid grid-cols-3 gap-8 pt-2">
          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street</FormLabel>
                <FormControl>
                  <Input placeholder="Activa Ave" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {
                      cities.map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)
                    }
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ontario">Ontario</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="zipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zip</FormLabel>
              <FormControl>
                <Input placeholder="N2E 4K4" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="canada">Canada</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update profile</Button>
      </form>
    </Form>
  )
}
