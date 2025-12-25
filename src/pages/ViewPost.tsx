import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Topics from '../components/Topics';
import Header from '../components/Header';
import DeletePost from '../components/DeletePost';
import { jwtDecode } from 'jwt-decode';
import AddComment from '../components/AddComment';
import CommentsList from '../components/CommentList';
import authFetch from '../utils/authFetch';

export function ViewPost() {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<any>(null);
    const [username, setUsername] = useState('');
    const [comments, setComments] = useState<Array<any>>([]);
    const [loading, setLoading] = useState(false);
    const [loadingComments, setLoadingComments] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function handleLogout() {
        sessionStorage.removeItem('access_token');
        window.location.href = '/';
    }

    async function fetchComments() {
        if (!id) return;
        setLoadingComments(true);
        try {
            const res = await authFetch(`http://localhost:8080/comments/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await res.json();
            if (!res.ok) {
                setComments([]);
            } else {
                console.log("Fetched comments:", data);
                setComments(data);
            }
        } catch (err: any) {
            console.error('Failed to fech comments:', err)
        } finally {
            setLoadingComments(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [id]);

    useEffect(() => {
        const accessToken = sessionStorage.getItem('access_token');
        if (accessToken) {
            try {
                const decoded = jwtDecode<any>(accessToken);
                setUsername(decoded.sub);
            } catch (error) {
                console.error("Failed to decode token", error);
            }
        }
    }, []);

    useEffect(() => {
        if (!id) return;
        const fetchPost = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await authFetch(`http://localhost:8080/post/id/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                const data = await res.json();
                if (!res.ok) {
                    setError(data.error || data.message || 'Failed to load post');
                    setPost(null);
                } else {
                    console.log("Fetched post:", data);
                    setPost(data);
                }
            } catch (err: any) {
                setError(err.message || 'An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    return (
        <div style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            width: '85vw',
            overflow: 'hidden'
        }}>
            <Header onLogout={handleLogout} />
            <div style={{ display: 'flex', flexGrow: 1, width: '100%', height: 'calc(100vh - 64px)' }}>
                <Topics />
                <main style={{
                    flexGrow: 1,
                    width: '100%',
                    padding: '2rem 1rem 4rem 1rem',
                    background: '#fff',
                    height: '100%',
                    overflowY: 'auto'
                }}>
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                    {!loading && !error && !post && <div style={{ color: '#6b7280' }}>No post found</div>}
                    {post && (
                        <article style={{ background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 6px 18px rgba(15,23,42,0.06)' }}>
                            <div style={{ display: 'flex', gap: 20, marginBottom: 16, alignItems: 'flex-start' }}>
                                <div style={{ fontSize: 13, color: '#6b7280' }}>{post.topic}</div>
                                <div style={{ flex: 1 }}>
                                    <h1 style={{ margin: 0 }}>{post.title}</h1>
                                    <p style={{ color: '#6b7280', marginTop: 8, whiteSpace: 'pre-wrap', overflowWrap: 'break-word', wordBreak: 'break-word' }}>{post.content}</p>
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: 12, color: '#9ca3af' }}>{post.CreatedAt ? new Date(post.CreatedAt).toLocaleString() : ''}</div>
                                <div style={{ fontSize: 12, color: '#111823' }}>By {post.author || 'Unknown'}</div>
                            </div>
                            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-start', gap: 8 }}>
                                <Link to={`/topic/${encodeURIComponent(post.topic)}`} style={{ marginRight: 8 }}>← Back</Link>
                                {username === post.author && (
                                    <DeletePost postId={post.ID} />
                                )}
                            </div>
                            <AddComment
                                postId={post.ID}
                                onCommentAdded={fetchComments}
                            />

                            {loadingComments ? (
                                <div style={{ color: '#6b7280', marginTop: 20 }}>Loading comments...</div>
                            ) : (
                                <CommentsList
                                    comments={comments}
                                    currentUser={username}
                                    onCommentDeleted={fetchComments}
                                />)}
                        </article>
                    )}
                </main>
            </div>
        </div>
    );
}
