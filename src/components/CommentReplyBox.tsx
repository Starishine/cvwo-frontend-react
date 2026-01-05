import { useState, useEffect } from 'react';
import authFetch from '../utils/authFetch';
import { jwtDecode } from 'jwt-decode';

export default function CommentReplyBox({ postId, parentId, onReplyAdded }: { postId: number, parentId: number, onReplyAdded: () => void }) {
    const [reply, setReply] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const access_token = sessionStorage.getItem('access_token');
        if (!access_token) return;
        try {
            const decoded = jwtDecode<any>(access_token);
            setUsername(decoded.sub);
        } catch (err) {
            console.warn('Invalid token', err);
        }
    }, []);

    async function handleReply() {
        if (!reply.trim()) {
            setError('Reply cannot be empty');
            return;
        }
        setSubmitting(true);
        setError(null);
        try {
            const res = await authFetch('/comment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ post_id: postId, comment: reply.trim(), author: username, parent_id: parentId })
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || data.message || 'Failed to post reply');
            } else {
                setReply('');
                onReplyAdded();
            }
        } catch (err: any) {
            setError(err.message || 'Unexpected error');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="mt-2">
            {error &&
                <div className="text-red-600 text-xs mb-2 bg-red-50 p-2 rounded border border-red-100">
                    {error}
                </div>}
            <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Write your reply..."
                className="w-full min-h-[80px] p-2 border border-gray-200 rounded-lg 
                text-sm font-sans focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />

            <div className="flex gap-2 mt-2">
                <button
                    onClick={handleReply}
                    disabled={submitting || !reply.trim()}
                    className="bg-blue-600 text-white border-none px-3 py-1.5 rounded-md cursor-pointer text-sm font-medium hover:bg-blue-700 
                    disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"

                >{submitting ? 'Replying...' : 'Reply'}</button>
                <button onClick={() => setReply('')}
                    className="bg-white border border-gray-200 px-3 py-1.5 rounded-md text-sm font-medium
                    text-gray-700 hover:bg-gray-50 transition-colors">
                    Cancel</button>
            </div>
        </div>
    );
}