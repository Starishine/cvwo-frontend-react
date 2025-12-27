import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode";
import Topics from "../components/Topics";
import Header from "../components/Header";

export default function Dashboard() {
    const [username, setUsername] = useState('');

    useEffect(() => {
        const access_token = sessionStorage.getItem('access_token');
        if (!access_token) {
            window.location.href = '/';
            return;
        }

        try {
            const decoded = jwtDecode<any>(access_token);
            setUsername(decoded.sub);
        } catch (err) {
            window.location.href = '/';
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
            <Header />

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