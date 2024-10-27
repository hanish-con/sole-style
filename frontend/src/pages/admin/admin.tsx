import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
export default function AdminDashboard({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            {/* <AppSidebar /> */}
            {/* <SidebarTrigger /> */}
            <main className="container mx-24 w-full">
                <Outlet />
                {children}
            </main>
      </SidebarProvider>
    );
}