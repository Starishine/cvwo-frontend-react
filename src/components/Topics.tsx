import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import authFetch from '../utils/authFetch';

export default function Topics() {
    const [topics, setTopics] = useState<Array<string>>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const res = await authFetch(`/post/topics`);
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
        fetchTopics();
    }, []);

    return (
        <aside className="w-[200px] bg-slate-50 border-r border-black/10 py-4 overflow-y-auto h-[calc(100vh-64px)]">
            <div className="px-4 mb-4 font-bold text-sm tracking-wider">Topics</div>

            {loading && <div style={{ padding: '0 1rem' }}>Loading topics...</div>}
            {error && <div style={{ padding: '0 1rem', color: 'red' }}>{error}</div>}

            <ul className="list-none p-0 m-0">
                {topics.map((topic) => (
                    <li key={topic}>
                        <Link to={`/topic/${encodeURIComponent(topic)}`}
                            className="block w-full text-left px-4 py-2.5 no-underline text-gray-500 text-sm 
                            transition-colors hover:bg-gray-200">
                            {topic}
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
}
