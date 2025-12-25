import { useState } from 'react';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Topics from '../components/Topics';
import Header from '../components/Header';
import authFetch from '../utils/authFetch';

export default function AddPost() {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [topic, setTopic] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const defaultTopics = ['Technology', 'Health', 'Science', 'Travel', 'Education', 'Entertainment', 'Sports', 'Business'];

    useEffect(() => {
        const accessToken = sessionStorage.getItem('access_token');

        if (!accessToken) {
            window.location.href = '/';
            return;
        }

        try {
            const decoded = jwtDecode<any>(accessToken);
            const username = decoded.sub;
            console.log("Username from token:", username);
            setUsername(username);
        } catch (error) {
            console.error("Failed to decode token", error);
            window.location.href = '/';
            localStorage.removeItem('token');
        }

    }, []);

    function handleLogout() {
        sessionStorage.removeItem('access_token');
        window.location.href = '/';
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!topic.trim() || !title.trim() || !content.trim()) {
            setError('All fields are required.');
            setLoading(false);
            return;
        }

        try {
            const response = await authFetch('http://localhost:8080/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ topic: topic.trim(), title: title.trim(), content: content.trim(), author: username }),
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.error || data.message);
            }
            else {
                alert('Post added successfully!')
                setTopic('');
                setTitle('');
                setContent('');
                window.location.href = '/dashboard';
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }


    }

    return (
        <div style={{
            fontFamily: 'Inter, Roboto, system-ui, -apple-system, "Segoe UI", sans-serif',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            width: '85vw',
            overflow: 'hidden'
        }}>
            <Header onLogout={handleLogout} />
            <div style={{
                display: 'flex',
                flexGrow: 1,
                width: '100%',
                height: 'calc(100vh - 64px)'
            }}>
                <Topics />

                <main style={{
                    flexGrow: 1,
                    padding: '2rem 1rem',
                    background: '#fff',
                    height: '85%',
                    overflowY: 'auto'
                }}>
                    <h2>Add a new post</h2>
                    <p style={{ color: '#6b7280' }}>Logged in as {username || 'guest'}</p>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 720 }}>
                        <select
                            value={topic}
                            onChange={e => setTopic(e.target.value)}
                            style={{
                                width: '100%',
                                padding: 10,
                                borderRadius: 8,
                                border: '1px solid #e5e7eb',
                                fontFamily: 'inherit',
                                fontSize: 14
                            }}
                        >
                            <option value="">Select a topic...</option>
                            {defaultTopics.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                            <option value="__custom__">+ Add custom topic</option>
                        </select>
                        {topic === '__custom__' && (
                            <input
                                type="text"
                                placeholder="Enter custom topic"
                                onChange={e => setTopic(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: 10,
                                    borderRadius: 8,
                                    border: '1px solid #e5e7eb',
                                    marginTop: 8,
                                    fontFamily: 'inherit'
                                }}
                            />
                        )}
                        <input
                            type="text"
                            value={title}
                            onChange={e => { setTitle(e.target.value) }} required
                            placeholder="Post Title"
                            style={{ padding: 10, borderRadius: 8, border: '1px solid #e5e7eb' }}
                        />
                        <textarea
                            placeholder="Write your content here"
                            value={content}
                            onChange={e => { setContent(e.target.value) }} required
                            style={{ padding: 10, borderRadius: 8, border: '1px solid #e5e7eb', minHeight: 200 }}
                        />
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button type="submit" style={{
                                background: '#2563eb', color: '#fff', border: 'none',
                                padding: '10px 14px', borderRadius: 8, cursor: 'pointer'
                            }}>
                                {loading ? 'Adding…' : 'Add Post'}
                            </button>
                            <a href="/dashboard" style={{
                                display: 'inline-block',
                                padding: '10px 14px',
                                borderRadius: 8,
                                border: '1px solid #e5e7eb',
                                color: '#111827',
                                textDecoration: 'none'
                            }}>
                                Cancel
                            </a>
                        </div>
                    </form>
                </main>
            </div>
        </div >
    );


}