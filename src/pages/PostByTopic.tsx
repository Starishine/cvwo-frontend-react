import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Topics from '../components/Topics';
import Header from '../components/Header';
import authFetch from '../utils/authFetch';
import type { Post } from '../types/Post';

export default function PostByTopic() {
    const { topic } = useParams<{ topic: string }>();
    const decodedTopic = topic ? decodeURIComponent(topic) : '';
    const [posts, setPosts] = useState<Array<Post>>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    function viewPost(postId: number) {
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
                console.log(data)
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

    // This will log every time the post state changes
    useEffect(() => {
        console.log('Posts state has been updated:', posts);
    }, [posts]);

    return (
        <div className="font-sans flex flex-col min-h-screen w-[85vw] overflow-hidden">
            <Header />
            <div className="flex flex-grow w-full h-[calc(100vh-64px)]">
                <Topics />

                <main className="flex-grow w-full p-8 bg-white h-full overflow-y-auto">
                    <h2 className="text-2xl font-bold mb-6">Posts on {decodedTopic}</h2>

                    {loading && <div className="text-gray-500 italic">Loading posts…</div>}
                    {error && <div className="text-red-600">{error}</div>}

                    {!loading && !error && posts.length === 0 && (
                        <div className="text-gray-500 italic">There are no posts yet.</div>
                    )}
                    <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                        {posts.map(p => (
                            <article key={p.ID} className="flex flex-col md:flex-row gap-4 bg-white rounded-xl 
                            p-6 shadow-md border border-gray-50 min-h-[120px] hover:shadow-lg transition-shadow">
                                <div className="flex-1 flex flex-col gap-2">
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">{p.topic}</span>
                                        <span className="text-xs text-gray-400">{p.CreatedAt ? new Date(p.CreatedAt).toLocaleDateString() : ''}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">{p.title}</h3>
                                    <p className="text-sm text-gray-500 line-clamp-3">
                                        {p.content}
                                    </p>
                                    <div className="mt-auto pt-4 flex justify-between items-center">
                                        <span className="text-xs text-gray-400">By {p.author || 'Unknown'}</span>
                                        <button
                                            onClick={() => viewPost(p.ID)}
                                            className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                                        >
                                            View More
                                        </button>
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