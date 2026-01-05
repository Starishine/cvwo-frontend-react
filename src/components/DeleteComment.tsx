import { useState } from "react";
import authFetch from "../utils/authFetch";

export default function DeleteComment({ commentId, onCommentDeleted }: { commentId: number; onCommentDeleted: () => void }) {

    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function handleDelete(commentId: number) {
        setDeletingId(commentId);
        setError(null);
        try {
            const res = await authFetch(`/deletecomment/id/${commentId}`, {
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

    const isDeleting = deletingId === commentId;
    return (
        <div className="flex flex-col items-end">
            {error && <div className="text-red-600">{error}</div>}
            <button
                onClick={() => handleDelete(commentId)}
                disabled={isDeleting}
                className={`
                    bg-transparent text-red-600 border-none text-xs px-2 py-1 rounded transition-colors duration-200
                    ${isDeleting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-red-100 active:bg-red-200'}
                `}
            >
                {deletingId === commentId ? 'Deleting...' : 'Delete'}
            </button>
        </div>
    )
}
