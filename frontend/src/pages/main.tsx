import { Outlet } from "react-router-dom";
import Header from "./commons/header";
import Footer from "./commons/footer";

export default function MainLayout({ token, setToken, user }) {
    return (
        <>
            <Header token={token} user={user} callback={(t: string) => setToken(t)} />
                <Outlet />
            <Footer />
        </>
    );
}
