import { Outlet } from "react-router-dom";
import Header from "./commons/header";
import Footer from "./commons/footer";

export default function MainLayout({ token, setToken }) {
    return (
        <>
            <Header token={token} callback={(t: string) => setToken(t)} />
                <Outlet />
            <Footer />
        </>
    );
}
