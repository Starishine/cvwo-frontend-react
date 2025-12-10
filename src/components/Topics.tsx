import { useEffect, useState } from 'react';
import { Link } from 'react-router';

export default function Topics() {
    const [topics, setTopics] = useState<Array<string>>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch(`http://localhost:8080/post/topics`);
                const data = await res.json();

                if (!res.ok) {
                    setError(data.error || data.message);
                }
                else {
                    console.log("Fetched topics:", data);
                    setTopics(data || []);
                }
            } catch (err: any) {
                setError(err.message || 'An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    return (
        <aside style={{
            width: 200,
            background: '#f8fafc',
            borderRight: '1px solid rgba(0,0,0,0.08)',
            padding: '1rem 0',
            overflowY: 'auto',
            height: 'calc(100vh - 64px)',
        }}>
            <div style={{
                padding: '0 1rem',
                marginBottom: '1rem',
                fontWeight: 700,
                fontSize: 14
            }}>
                Topics
            </div>

            {loading && <div style={{ padding: '0 1rem' }}>Loading topics...</div>}
            {error && <div style={{ padding: '0 1rem', color: 'red' }}>{error}</div>}

            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {topics.map((topic) => (
                    <li key={topic}>
                        <Link
                            to={`/topic/${encodeURIComponent(topic)}`}
                            style={{
                                display: 'block',
                                width: '100%',
                                textAlign: 'left',
                                padding: '10px 1rem',
                                textDecoration: 'none',
                                color: '#6b7280',
                                fontSize: 14,
                                transition: 'background .15s',
                            }}
                        >
                            {topic}
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
}
