
import * as React from "react";
import { Link } from "react-router-dom";
import { Menu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Header() {
    const [state, setState] = React.useState(false)

    const menus = [
        { title: "Home", path: "/home" },
        { title: "Blog", path: "/your-path" },
        { title: "About Us", path: "/your-path" },
        { title: "Contact Us", path: "/your-path" },
    ]
    return (
        <header>
            <nav className="w-full border-b md:border-0 rotate-0 scale-100 transition-all dark:-rotate-0 dark:scale-100">
                <div className="items-center px-4 max-w-screen-xl mx-auto md:flex md:px-8">
                    <div className="flex items-center justify-between py-3 md:py-5 md:block">
                        <Link to="/">
                            <h1 className="text-3xl font-bold text-purple-600">Logo</h1>
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
                        <ul className="justify-center items-center space-y-8 md:flex md:space-x-6 md:space-y-0">
                            {menus.map((item, idx) => (
                                <li key={idx} className="text-gray-600 hover:text-indigo-600">
                                    <Link to={item.path}>{item.title}</Link>
                                </li>
                            ))}
                            <form>
                                <Input type="text" placeholder="Search" />
                            </form>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}