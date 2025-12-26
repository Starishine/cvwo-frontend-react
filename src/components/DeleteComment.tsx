import { useState } from "react";
import authFetch from "../utils/authFetch";

export default function DeleteComment({ commentId, onCommentDeleted }: { commentId: number; onCommentDeleted: () => void }) {

    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function handleDelete(commentId: number) {
        setDeletingId(commentId);
        setError(null);
        try {
            const res = await authFetch(`http://localhost:8080/deletecomment/id/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (res.ok) {
                onCommentDeleted();
            } else {
                setError('Failed to delete comment');
            }
        } catch (err) {
            setError('Failed to delete comment');
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <button
            onClick={() => handleDelete(commentId)}
            disabled={deletingId === commentId}
            style={{
                background: 'transparent',
                color: '#dc2626',
                border: 'none',
                cursor: deletingId === commentId ? 'not-allowed' : 'pointer',
                fontSize: 12,
                padding: '4px 8px',
                borderRadius: 4,
                transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => {
                if (deletingId !== commentId) {
                    e.currentTarget.style.background = '#fee2e2';
                }
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
            }}
        >
            {deletingId === commentId ? 'Deleting...' : 'Delete'}
        </button>
    )
}
