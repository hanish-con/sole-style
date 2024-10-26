import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminProducts from "./products";
import Products from "@/pages/products";
import ProductPage from "./products";
import { Outlet } from "react-router-dom";
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
            <SidebarTrigger />
            <main className="container mx-24 w-full">
                <Outlet />
                {/* <ProductPage /> */}
            </main>
      </SidebarProvider>
    );
}