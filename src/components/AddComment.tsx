import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import authFetch from "../utils/authFetch";

export default function AddComment({ postId, onCommentAdded }: { postId: string, onCommentAdded: () => void }) {
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const accessToken = sessionStorage.getItem('access_token');

        if (!accessToken) {
            window.location.href = '/';
            return;
        }

        try {
            const decoded = jwtDecode<any>(accessToken);
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
        <div style={{
            background: '#f9fafb',
            borderRadius: 8,
            padding: 16,
            marginTop: 20
        }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: 16, fontWeight: 600 }}>Add a Comment</h3>

            {error && (
                <div style={{
                    background: '#fee2e2',
                    color: '#dc2626',
                    padding: 10,
                    borderRadius: 6,
                    fontSize: 14,
                    marginBottom: 12
                }}>
                    {error}
                </div>
            )}

            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your comment here..."
                disabled={isSubmitting}
                style={{
                    width: '100%',
                    minHeight: 100,
                    padding: 12,
                    border: '1px solid #d1d5db',
                    borderRadius: 6,
                    fontSize: 14,
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                }}
            />

            <button
                onClick={handleSubmit}
                disabled={isSubmitting || !comment.trim()}
                style={{
                    marginTop: 12,
                    background: isSubmitting || !comment.trim() ? '#9ca3af' : '#2563eb',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: 6,
                    cursor: isSubmitting || !comment.trim() ? 'not-allowed' : 'pointer',
                    fontSize: 14,
                    fontWeight: 500,
                    transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                    if (!isSubmitting && comment.trim()) {
                        e.currentTarget.style.background = '#1d4ed8';
                    }
                }}
                onMouseLeave={(e) => {
                    if (!isSubmitting && comment.trim()) {
                        e.currentTarget.style.background = '#2563eb';
                    }
                }}
            >
                {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
        </div>
    );
}