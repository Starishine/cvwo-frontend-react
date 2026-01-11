import { useEffect, useState } from 'react';
import authFetch from '../utils/authFetch';
import type { LikePostProps } from '../types/LikePostProp';

export default function LikePost({ postId, initialLikes = 0 }: LikePostProps) {
    const [likes, setLikes] = useState<number>(initialLikes);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        fetchLikes();
    }, []);

    // fetch current likes from backend and set state of initialLikes
    const fetchLikes = async () => {
        try {
            const res = await authFetch(`/getAllLikes/${postId}`, {
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

    // handle like button click
    const handleLike = async () => {
        if (loading) return;

        setLoading(true);
        setError(null);

        try {
            const res = await authFetch(`/like/${postId}`, {
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
            {error &&
                <div className="text-red-600 text-xs mb-2 bg-red-50 p-2 rounded border border-red-100">
                    {error}
                </div>
            }
        </div>
    );
}