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
            const res = await authFetch('http://localhost:8080/comment', {
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
        <div style={{ marginTop: 8 }}>
            {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
            <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Write your reply..."
                style={{ width: '100%', minHeight: 80, padding: 8, borderRadius: 6, border: '1px solid #e5e7eb', fontFamily: 'inherit' }}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button
                    onClick={handleReply}
                    disabled={submitting || !reply.trim()}
                    style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer' }}
                >{submitting ? 'Replying...' : 'Reply'}</button>
                <button onClick={() => setReply('')} style={{ background: '#fff', border: '1px solid #e5e7eb', padding: '6px 10px', borderRadius: 6 }}>Cancel</button>
            </div>
        </div>
    );
}