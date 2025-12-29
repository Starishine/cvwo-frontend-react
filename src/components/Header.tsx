import Logo from "./Logo";
import Logout from "./Logout";
import Search from "./Search";

export default function Header() {
    return (
        <header style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 20px',
            borderBottom: '1px solid rgba(0,0,0,0.08)',
            background: '#fff',
            height: '64px',
            flexShrink: 0
        }}>
            <Logo />

            <nav style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Search />
                <a href="/add-post" style={{ textDecoration: 'none', color: '#111827', padding: '8px 12px', borderRadius: 8 }}>
                    New Post
                </a>
                <a href="/your-posts" style={{ textDecoration: 'none', color: '#111827', padding: '8px 12px', borderRadius: 8 }}>
                    Your Posts
                </a>
                <Logout />
            </nav>
        </header>
    );
}