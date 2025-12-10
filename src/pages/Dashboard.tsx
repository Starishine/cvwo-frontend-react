import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode";
import Topics from "../components/Topics";
import Header from "../components/Header";

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
            <Header onLogout={handleLogout} />

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