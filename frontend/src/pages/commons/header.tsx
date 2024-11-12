
import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SoleStyleLogo from '../../assets/SoleStyleLogo.svg';
import { UserModel } from "@/models/user";

export default function Header({ callback }: { callback: (_: string) => void }) {
    const [state, setState] = React.useState(false)
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    const menus = [
        { title: "Home", path: "/" },
        { title: "Products", path: "/products" },
        { title: "Cart", path: "/cart" },
        { title: "About", path: "/about" },
        { title: "Contact", path: "/contact" },
        // { title: "Admin", path: "/admin" },
        { title: "Settings", path: "/settings" },
    ]

    const logout = (e) => {
        // unset token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        callback("");
        navigate("/login", { replace: true });
    }
    return (
        <header>
            <nav className="w-full border-b md:border-0 rotate-0 scale-100 transition-all dark:-rotate-0 dark:scale-100">
                <div className="items-center px-4 max-w-screen-xl mx-auto md:flex md:px-8">
                    <div className="flex items-center justify-between py-3 md:py-5 md:block">
                        <Link to="/">
                            <img
                                src={SoleStyleLogo}
                                alt="Logo"
                                className="h-16 w-auto"
                            />
                        </Link>
                        <div className="md:hidden">
                            <button
                                className="text-gray-700 outline-none p-2 rounded-md focus:border-gray-400 focus:border"
                                onClick={() => setState(!state)}
                            >
                                <Menu />
                            </button>
                        </div>
                    </div>
                    <div
                        className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${state ? "block" : "hidden"
                            }`}
                    >
                        <ul className="justify-end items-center space-y-8 md:flex md:space-x-6 md:space-y-0 me-4">
                            {user?.role !== "Admin" && menus.map((item, idx) => (
                                <li key={idx} className="text-gray-600 hover:text-violet-600">
                                    <Link to={item.path}>{item.title}</Link>
                                </li>
                            ))}
                            {
                                // if token is set show logout button
                                token &&
                                (
                                    <li key="logout" className="text-gray-600 hover:text-violet-600">
                                        <button onClick={logout}>Logout</button>
                                    </li>
                                )
                            }
                            {
                                // if token is not set, show login and signup
                                !token && (
                                    <>
                                        <li key="login" className="text-gray-600 hover:text-violet-600">
                                            <Link to="/login">Login</Link>
                                        </li>
                                        <li key="signup" className="text-gray-600 hover:text-violet-600">
                                            <Link to="/signup">SignUp</Link>
                                        </li>
                                    </>
                                )
                            }
                        </ul>
                    </div>
                    <div>
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </nav>
        </header>
    );
}