import { useState } from "react";
import authFetch from "../utils/authFetch";
interface Comment {
    ID: number
    post_id: number
    comment: string
    author: string
    CreatedAt: string
}
export default function CommentList({ comments, currentUser, onCommentDeleted }
    : { comments: Comment[], currentUser: string, onCommentDeleted: () => void }) {

    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    console.log("Rendering CommentList with comments:", comments);

    if (comments.length == 0) {
        return (
            <div style={{
                color: '#6b7280',
                fontSize: 14,
                fontStyle: 'italic',
                marginTop: 20,
                paddingBottom: 24
            }}>
                No comments yet. Be the first to comment!
            </div>
        );
    }

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
        <div style={{ paddingBottom: 24 }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 600 }}>
                Comments ({comments.length})
            </h3>

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

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 8 }}>
                {comments.map((comment) => (
                    <div
                        key={comment.ID}
                        style={{
                            background: '#f9fafb',
                            borderRadius: 8,
                            padding: 16,
                            border: '1px solid #e5e7eb'
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: 8
                        }}>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <span style={{
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: '#111827'
                                }}>
                                    {comment.author}
                                </span>
                                <span style={{
                                    fontSize: 12,
                                    color: '#9ca3af'
                                }}>
                                    {new Date(comment.CreatedAt).toLocaleString()}
                                </span>
                            </div>

                            {currentUser === comment.author && (
                                <button
                                    onClick={() => handleDelete(comment.ID)}
                                    disabled={deletingId === comment.ID}
                                    style={{
                                        background: 'transparent',
                                        color: '#dc2626',
                                        border: 'none',
                                        cursor: deletingId === comment.ID ? 'not-allowed' : 'pointer',
                                        fontSize: 12,
                                        padding: '4px 8px',
                                        borderRadius: 4,
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (deletingId !== comment.ID) {
                                            e.currentTarget.style.background = '#fee2e2';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                    }}
                                >
                                    {deletingId === comment.ID ? 'Deleting...' : 'Delete'}
                                </button>
                            )}
                        </div>

                        <p style={{
                            margin: 0,
                            color: '#374151',
                            fontSize: 14,
                            lineHeight: 1.6,
                            whiteSpace: 'pre-wrap',
                            overflowWrap: 'break-word'
                        }}>
                            {comment.comment}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}