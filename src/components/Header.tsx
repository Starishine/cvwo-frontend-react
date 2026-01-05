import Logo from "./Logo";
import Logout from "./Logout";
import Search from "./Search";

export default function Header() {
    return (
        <header className="flex items-center justify-between px-5 py-3 border-b border-black/10 bg-white h-16 shrink-0">
            <Logo />
            <nav className="flex items-center gap-3">
                <Search />
                <a href="/add-post" className="no-underline text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100">
                    New Post
                </a>
                <a href="/your-posts" className="no-underline text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100">
                    Your Posts
                </a>
                <Logout />
            </nav>
        </header>
    );
}