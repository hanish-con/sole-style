import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "../userprofile/sidebar-nav";
import { Toaster } from "@/components/ui/toaster";

export const metadata: {title: string, description: string} = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
}

const sidebarNavItems = [
  {
    title: "Products",
    href: "/admin",
  },
  {
    title: "Orders",
    href: "/admin/orders",
  },

]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function AdminSettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      <div className="md:hidden">
        <img
          src="/examples/forms-light.png"
          width={1280}
          height={791}
          alt="Forms"
          className="block dark:hidden"
        />
        <img
          src="/examples/forms-dark.png"
          width={1280}
          height={791}
          alt="Forms"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden space-y-6 p-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          {/* <p className="text-muted-foreground">
            Manage your account settings.
          </p> */}
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/6">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg">{children}</div>
        </div>
      </div>
      <Toaster />
    </>
  )
}