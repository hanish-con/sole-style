import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function NotFound() {
    return (
        <div className="grid place-content-center text-center min-h-screen gap-2">
                <h1 className="text-3xl">Oops!</h1>
                <p className="text-xl">Sorry, an unexpected error has occurred.</p>
                <p>
                    <Link to="/">
                        <Button className="hover:bg-violet-800">Home</Button>
                    </Link>
                </p>
        </div>
    )
}
