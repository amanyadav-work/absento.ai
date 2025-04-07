import { Outlet } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"
import { AppSidebar } from "./app-sidebar"
import { SidebarProvider } from "./ui/sidebar"
const AppLayout = () => {
    return (
        <>


            <SidebarProvider defaultOpen={false}>
                <div className="w-full">
                    <Header />
                    <div className="min-h-screen my-container mx-auto px-3.5 py-13">
                        <AppSidebar />
                        <Outlet />
                    </div>
                    <Footer />
                </div>
            </SidebarProvider>

        </>
    )
}

export default AppLayout
