import { Outlet, Link } from "react-router-dom";

export default function RootLayout() {
    return (
        <>
            <header className="h-24 bg-black">
                <nav>
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Sign Up</Link>
                </nav>
            </header>
            <main>
                <Outlet />
            </main>
        </>
    );
}
