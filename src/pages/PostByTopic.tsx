import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Topics from '../components/Topics';
import Header from '../components/Header';
import authFetch from '../utils/authFetch';


export default function PostByTopic() {
    const { topic } = useParams<{ topic: string }>();
    const decodedTopic = topic ? decodeURIComponent(topic) : '';
    const [posts, setPosts] = useState<Array<any>>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    function viewPost(postId: string) {
        window.location.href = `/post/id/${postId}`;
    }

    useEffect(() => {
        if (!decodedTopic) return;
        const fetchPosts = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await authFetch(`http://localhost:8080/post/topic/${encodeURIComponent(decodedTopic)}`);
                const data = await res.json();

                if (!res.ok) {
                    setError(data.error || data.message || 'Failed to load posts');
                    setPosts([]);
                } else {
                    setPosts(data);
                }
            } catch (err: any) {
                setError(err.message || 'An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [decodedTopic]);

    return (
        <div style={{
            fontFamily: 'Inter, Roboto, system-ui, -apple-system, "Segoe UI", sans-serif',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            width: '85vw',
            overflow: 'hidden'
        }}>
            <Header />
            <div style={{
                display: 'flex',
                flexGrow: 1,
                width: '100%',
                height: 'calc(100vh - 64px)'
            }}>
                <Topics />

                <main style={{
                    flexGrow: 1,
                    width: '100%',
                    padding: '2rem 1rem',
                    background: '#fff',
                    height: '100%',
                    overflowY: 'auto'
                }}>
                    <h2>Posts on {decodedTopic}</h2>

                    {loading && <div style={{ color: '#6b7280' }}>Loading posts…</div>}
                    {error && <div style={{ color: 'red' }}>{error}</div>}

                    {!loading && !error && posts.length === 0 && (
                        <div style={{ color: '#6b7280' }}>There are no posts yet.</div>
                    )}
                    <section style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(700px, 1fr))',
                        gap: 16,
                        marginTop: 12,
                        marginBottom: 32,
                    }}>
                        {posts.map(p => (
                            <article key={p.ID} style={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 16,
                                alignItems: 'flex-start',
                                background: '#fff',
                                borderRadius: 10,
                                padding: 16,
                                boxShadow: '0 6px 18px rgba(15,23,42,0.06)',
                                minHeight: 120,
                            }}>

                                <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 6 }}>{p.topic}</div>
                                <div style={{ fontSize: 12, color: '#111823ff' }}>{p.CreatedAt ? new Date(p.CreatedAt).toLocaleDateString() : ''}</div>

                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    <h3 style={{ margin: 0 }}>{p.title}</h3>
                                    <p
                                        style={{
                                            margin: 0,
                                            color: '#6b7280',
                                            fontSize: 14,
                                            whiteSpace: 'normal',
                                            overflowWrap: 'break-word',
                                            wordBreak: 'break-word'
                                        }}
                                    >
                                        {p.content.length > 350 ? p.content.slice(0, 350) + '…' : p.content}
                                    </p>
                                    <div style={{ fontSize: 12, color: '#111823' }}>By {p.author || 'Unknown'}</div>

                                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                        <button onClick={() => viewPost(p.ID)} style={{
                                            background: '#2563eb', color: '#fff', border: 'none',
                                            padding: '6px 10px', borderRadius: 8, cursor: 'pointer'
                                        }}>View More</button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </section>
                </main>
            </div>
        </div>
    );
}