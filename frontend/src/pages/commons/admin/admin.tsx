import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminProducts from "./products";
export default function AdminDashboard({ children }: { children: React.ReactNode }) {
    const projects = [
        {
            name: "Products",
            url: "/products",
            icon: "",
        }
    ];
    return (
        <SidebarProvider>
            <AppSidebar />
            <main>
                <SidebarTrigger />
                {children}
                <AdminProducts />
            </main>
      </SidebarProvider>
    );
}