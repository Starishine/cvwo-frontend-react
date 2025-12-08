import { useState, type FormEvent } from 'react';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


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
            const response = await fetch('http://localhost:8080/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: username.trim(), password: password.trim() }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            } else {
                alert('Registration successful!');
                setUsername('');
                setPassword('');
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
        <div style={{ maxWidth: 420, margin: '2rem auto', padding: '1rem', border: '1px solid #eee' }}>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <div style={{ marginBottom: 8 }}>
                    <label>Username</label><br />
                    <input value={username} onChange={e => setUsername(e.target.value)} required />
                </div>
                <div style={{ marginBottom: 8 }}>
                    <label>Password</label><br />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
                <button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
            </form>
        </div>
    );
}