import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminProducts from "./products";
import Products from "@/pages/products";
import Page from "./products";
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
                <Page />
            </main>
      </SidebarProvider>
    );
}