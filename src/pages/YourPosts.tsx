import { useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode";
import Topics from "../components/Topics";
import Header from "../components/Header";
import authFetch from "../utils/authFetch";
import type { Post } from "../types/Post";

export default function YourPosts() {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [posts, setPosts] = useState<Array<Post>>([]);

    function viewPost(postId: number) {
        window.location.href = `/post/id/${postId}`;
    }

    useEffect(() => {
        const access_token = sessionStorage.getItem('access_token');
        if (!access_token) {
            window.location.href = '/';
            return;
        }

        try {
            const decoded = jwtDecode<any>(access_token);
            const username = decoded.sub;
            console.log("Username from token:", username);
            setUsername(username);
        } catch (error) {
            console.error("Failed to decode token", error);
            window.location.href = '/';
            sessionStorage.removeItem('access_token');
        }

    }, []);

    useEffect(() => {
        if (!username) return;
        const fetchPosts = async () => {
            try {
                const res = await authFetch(`http://localhost:8080/post/${username}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                const data = await res.json();
                console.log("Fetched posts response:", data);

                if (!res.ok) {
                    setError(data.error || data.message);
                }
                else {
                    console.log("Fetched posts:", data);
                    setPosts(data || []);
                }

            } catch (err: any) {
                setError(err.message || 'An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [username]);

    return (
        <div className="font-sans flex flex-col min-h-screen w-[85vw] overflow-hidden">
            <Header />
            <div className="flex flex-grow w-full h-[calc(100vh-64px)]">
                <Topics />
                <main className="flex-grow w-full p-8 bg-white h-full overflow-y-auto">
                    <h2 className="text-2xl font-bold mb-6">Your published posts</h2>

                    {loading && <div className="text-gray-500 italic">Loading posts…</div>}
                    {error && <div className="text-red-600">{error}</div>}

                    {!loading && !error && posts.length === 0 && (
                        <div className="text-gray-500 italic">There are no posts yet.</div>
                    )}

                    <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                        {posts.map(p => (
                            <article key={p.ID} className="flex flex-col md:flex-row gap-4 bg-white rounded-xl p-6 shadow-md border border-gray-50 min-h-[120px] hover:shadow-lg transition-shadow">
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