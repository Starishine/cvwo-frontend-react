import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import Topics from "../components/Topics";

export default function Dashboard() {
    const [username, setUsername] = useState('');

    function handleLogout() {
        localStorage.removeItem('token');
        window.location.href = '/';
    }

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            window.location.href = '/';
            return;
        }

        try {
            const decoded = jwtDecode<any>(token);
            const username = decoded.sub;
            console.log("Username from token:", username);
            setUsername(username);
        } catch (error) {
            console.error("Failed to decode token", error);
            window.location.href = '/';
            localStorage.removeItem('token');
        }

    }, []);

    return (
        <div style={{
            fontFamily: 'Inter, Roboto, system-ui, -apple-system, "Segoe UI", sans-serif',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            width: '85vw',
            overflow: 'hidden',
        }}>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        background: '#111827',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: 18
                    }}>
                        R
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 18 }}>eadIT</div>
                </div>

                <nav style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <Link to="/post" style={{ textDecoration: 'none', color: '#111827', padding: '8px 12px', borderRadius: 8 }}>
                        Post
                    </Link>
                    <button
                        onClick={handleLogout}
                        style={{
                            background: '#ef4444',
                            color: '#fff',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: 8,
                            cursor: 'pointer'
                        }}
                    >
                        Logout
                    </button>
                </nav>
            </header>

            {/* fixd full width */}
            <div style={{
                display: 'flex',
                flexGrow: 1,
                width: '100%',
                height: 'calc(100vh - 64px)',
            }}>
                <Topics />

                <main style={{
                    flexGrow: 1,
                    padding: '2rem 1rem',
                    background: '#fff',
                    height: '100%',
                    overflowY: 'auto'
                }}>
                    <h2>Welcome to readIT, {username}</h2>
                    <p style={{ color: '#6b7280' }}>
                        Use the Topics link to explore content.
                    </p>
                </main>
            </div>
        </div>
    );
}