import React, { useEffect, useState } from 'react';
import Logo from '../components/Logo';
import { Link } from 'react-router-dom';

export default function SigninPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Don't auto-refresh if we just cleared everything
        const hasAnySessionData = sessionStorage.length > 0;

        if (hasAnySessionData) {
            initSession();
        } else {
            console.log("No session data, staying on login page");
        }
    }, []);

    async function initSession() {
        const access_token = sessionStorage.getItem('access_token');

        if (!access_token) {
            try {
                const res = await fetch('http://localhost:8080/auth/refresh', {
                    method: 'POST',
                    credentials: 'include',
                });

                if (!res.ok) {
                    console.log('No valid refresh token, staying on signin page');
                    return;
                }

                const data = await res.json();
                sessionStorage.setItem('access_token', data.access_token);
                window.location.href = '/dashboard';
            } catch (err) {
                console.error('Refresh failed:', err);
            }
        }
    }
    async function handleSignin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!username.trim() || !password.trim()) {
            setError('Username and password cannot be empty.');
            setLoading(false);
            return;
        }
        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    username: username.trim(),
                    password: password.trim()
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.error || data.message);
            }
            else {
                localStorage.removeItem('logged_out');
                sessionStorage.setItem('access_token', data.access_token);
                alert('Login successful!')
                window.location.href = '/dashboard';
                setUsername('');
                setPassword('');
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ margin: '2rem auto', padding: '1rem', border: '1px solid #eee' }}>
            <Logo />
            <h2>Sign In</h2>
            <form onSubmit={handleSignin}>
                <div style={{ marginBottom: 8 }}>
                    <label>Username</label><br />
                    <input value={username} onChange={e => setUsername(e.target.value)} required />
                </div>
                <div style={{ marginBottom: 8 }}>
                    <label>Password</label><br />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
                <div>
                    Don't have an account? <Link to="/register">Sign Up</Link>
                </div>
            </form>
        </div>
    );

}