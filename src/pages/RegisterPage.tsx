import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    // handle register form submission using react form event type 
    async function handleRegister(e: FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!username.trim() || !password.trim()) {
            setError('Username and password cannot be empty.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: username.trim(), password: password.trim() }),
            });

            const data = await response.json();
            console.log(response);

            if (!response.ok) {
                // throw error with message from response status 
                if (response.status === 409) {
                    setError('Username already exists. Please choose another one.');
                } else if (response.status === 400) {
                    setError('Invalid input. Please check your data and try again.');
                } else {
                    setError(data.error || 'Registration failed');
                }
            } else {
                alert('Registration successful! Pls log in');
                setUsername('');
                setPassword('');
                window.location.href = '/';
            }
        }
        catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-md mx-auto my-16 p-8 bg-white border border-gray-100 rounded-xl shadow-sm">
            <Logo />
            <h2 className="text-2xl font-bold my-6">Register</h2>
            <form onSubmit={handleRegister} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Username</label><br />
                    <input
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Password</label><br />
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
                    {loading ? 'Registering...' : 'Register'}
                </button>
                <div className="text-center text-sm text-gray-600 mt-4">
                    Already have an account? <Link to="/" className="text-blue-600 hover:underline"> Sign In</Link>
                </div>
            </form>
        </div>
    );
}