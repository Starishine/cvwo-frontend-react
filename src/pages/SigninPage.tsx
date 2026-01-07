import React, { useEffect, useState } from 'react';
import Logo from '../components/Logo';
import { Link } from 'react-router-dom';

export default function SigninPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        initSession();
    }, []);

    async function initSession() {
        const access_token = sessionStorage.getItem('access_token');
        // no access token, try to refresh
        if (!access_token) {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
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
        } else {
            // has access token, go to dashboard
            window.location.href = '/dashboard';
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
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
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
        <div className="max-w-md mx-auto my-16 p-8 bg-white border border-gray-100 rounded-xl shadow-sm">
            <Logo />
            <h2 className="text-2xl font-bold my-6">Sign In</h2>
            <form onSubmit={handleSignin} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Username</label>
                    <input
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                        type="password"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
                <div className="text-center text-sm text-gray-600 mt-4">
                    Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Sign Up</Link>
                </div>
            </form>
        </div>
    );

}