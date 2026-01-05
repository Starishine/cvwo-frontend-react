import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import authFetch from "../utils/authFetch";

export default function AddComment({ postId, onCommentAdded }: { postId: string, onCommentAdded: () => void }) {
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [username, setUsername] = useState('');

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

    async function handleSubmit() {
        if (!comment.trim()) {
            setError('Comment cannot be empty');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const res = await authFetch('http://localhost:8080/comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    post_id: postId,
                    comment: comment.trim(),
                    author: username
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || data.message || 'Failed to add comment');
            } else {
                setComment('');
                onCommentAdded();
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }

    }

    return (
        <div className="bg-gray-50 rounded-lg p-4 mt-5">
            <h3 className="m-0 mb-3 text-base font-semibold text-gray-900">Add a Comment</h3>

            {error && (
                <div className="bg-red-50 text-red-600 p-2.5 rounded-md text-sm mb-3">
                    {error}
                </div>
            )}

            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your comment here..."
                disabled={isSubmitting}
                className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md text-sm font-inherit resize-y 
                box-border focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />

            <button
                onClick={handleSubmit}
                disabled={isSubmitting || !comment.trim()}
                className={`mt-3 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 
                    ${isSubmitting || !comment.trim()
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-blue-600 text-white cursor-pointer hover:bg-blue-700 active:bg-blue-800'
                    }`}
            >
                {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
        </div>
    );
}