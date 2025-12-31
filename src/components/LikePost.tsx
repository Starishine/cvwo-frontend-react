import { useEffect, useState } from 'react';
import authFetch from '../utils/authFetch';

interface LikePostProps {
    postId: string;
    initialLikes?: number;
}

export default function LikePost({ postId, initialLikes = 0 }: LikePostProps) {
    const [likes, setLikes] = useState<number>(initialLikes);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        fetchLikes();
    }, []);

    const fetchLikes = async () => {
        try {
            const res = await authFetch(`http://localhost:8080/getAllLikes/${postId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            const data = await res.json();
            console.log('Likes', data);

            if (!res.ok) {
                setError(data.error || 'Failed to like post');
                console.error('Failed to like post:', data);
            } else {
                setLikes(data);
            }
        } catch (err: any) {
            setError(err.message)
        }

    }

    const handleLike = async () => {
        if (loading) return;

        setLoading(true);
        setError(null);

        try {
            const res = await authFetch(`http://localhost:8080/like/${postId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            const data = await res.json();

            console.log(data);

            if (!res.ok) {
                setError(data.error || 'Failed to like post');
                console.error('Failed to like post:', data);
            } else {
                // Update with the actual count from backend
                if (typeof data?.likes === 'number') {
                    setLikes(data.likes);
                }
            }
        } catch (err: any) {
            setError(err.message || 'Error liking post');
            console.error('Error liking post:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={handleLike} disabled={loading}>
                {loading ? 'Updating…' : `❤️ ${likes}`}
            </button>
            {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        </div>
    );
}