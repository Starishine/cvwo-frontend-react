import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Topics from '../components/Topics';
import Header from '../components/Header';
import DeletePost from '../components/DeletePost';
import { jwtDecode } from 'jwt-decode';
import AddComment from '../components/AddComment';
import CommentsList from '../components/CommentList';
import authFetch from '../utils/authFetch';
import LikePost from '../components/LikePost';
import EditPost from '../components/EditPost';

export function ViewPost() {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<any>(null);
    const [username, setUsername] = useState('');
    const [comments, setComments] = useState<Array<any>>([]);
    const [loading, setLoading] = useState(false);
    const [loadingComments, setLoadingComments] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showEdit, setShowEdit] = useState(false);


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
            console.log("Fetch comments response", res.status, data);
            if (!res.ok) {
                console.warn('Comments fetch failed:', data);
                setComments([]);
            } else {
                // handle different shapes: array, { comments: [...] }, { data: [...] }
                const list = Array.isArray(data) ? data : (Array.isArray(data.comments) ? data.comments : (Array.isArray(data.data) ? data.data : []));
                if (list.length === 0) console.debug('No comments found in response');
                setComments(list);
            }
        } catch (err: any) {
            console.error('Failed to fetch comments:', err);
            setComments([]);
        } finally {
            setLoadingComments(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [id]);

    useEffect(() => {
        const access_token = sessionStorage.getItem('access_token');
        if (access_token) {
            try {
                const decoded = jwtDecode<any>(access_token);
                setUsername(decoded.sub);
            } catch (error) {
                console.error("Failed to decode token", error);
            }
        }
    }, []);

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

    useEffect(() => {
        if (!id) return;
        fetchPost();
    }, [id]);

    return (
        <div className="font-sans flex flex-col min-h-screen w-[85vw] overflow-hidden">
            <Header />
            <div className="flex flex-grow w-full h-[calc(100vh-64px)]">
                <Topics />
                <main className="flex-grow w-full p-8 bg-white h-full overflow-y-auto pb-16">
                    {error && <div className="text-red-600 mb-4 font-medium">{error}</div>}
                    {!loading && !error && !post && <div className="text-gray-500 italic">No post found</div>}

                    {post && (
                        <article className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 max-w-4xl mx-auto">
                            <div className="flex flex-col md:flex-row gap-6 mb-6 items-start">
                                <div className="text-xs font-bold text-blue-600 uppercase tracking-widest">{post.topic}</div>
                                <div className="flex-1">
                                    <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{post.title}</h1>
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap break-words text-lg">
                                        {post.content}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1 border-t border-gray-100 pt-4">
                                <div className="text-xs text-gray-400">
                                    {post.CreatedAt ? new Date(post.CreatedAt).toLocaleString() : ''}
                                </div>
                                <div className="text-sm font-medium text-gray-900">
                                    By <span className="text-blue-600">{post.author || 'Unknown'}</span>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-between border-b border-gray-100 pb-6">
                                <div className="flex gap-4 items-center">
                                    <Link
                                        to={`/topic/${encodeURIComponent(post.topic)}`}
                                        className="text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors"
                                    >
                                        ← Back to {post.topic}
                                    </Link>

                                    {username === post.author && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setShowEdit(s => !s)}
                                                className="px-4 py-1.5 rounded-lg text-sm font-semibold text-green-700 hover:bg-green-50 border border-green-200 transition-colors"
                                            >
                                                {showEdit ? 'Cancel Edit' : 'Edit'}
                                            </button>
                                            <DeletePost postId={post.ID} />
                                        </div>
                                    )}
                                </div>
                                <LikePost postId={post.ID} />
                            </div>

                            {showEdit && (
                                <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
                                    <EditPost
                                        post={post}
                                        onUpdated={() => {
                                            fetchPost();
                                            setShowEdit(false);
                                        }}
                                        onCancel={() => setShowEdit(false)}
                                    />
                                </div>
                            )}

                            <div className="mt-8">
                                <AddComment
                                    postId={post.ID}
                                    onCommentAdded={fetchComments}
                                />
                            </div>

                            <div className="mt-12">
                                {loadingComments ? (
                                    <div className="text-gray-500 text-sm animate-pulse">Loading comments...</div>
                                ) : (
                                    <CommentsList
                                        comments={comments}
                                        currentUser={username}
                                        onCommentDeleted={fetchComments}
                                    />
                                )}
                            </div>
                        </article>
                    )}
                </main>
            </div>
        </div>
    );
}
