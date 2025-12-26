import { useState } from "react";
import CommentReplyBox from "./CommentReplyBox";
import ReplyList from "./ReplyList";
import DeleteComment from "./DeleteComment";
interface Comment {
    ID: number
    post_id: number
    comment: string
    author: string
    CreatedAt: string
    parent_id: number
}
export default function CommentList({ comments, currentUser, onCommentDeleted }
    : { comments: Comment[], currentUser: string, onCommentDeleted: () => void }) {

    const [error, setError] = useState<string | null>(null);
    const [openReplyFor, setOpenReplyFor] = useState<number | null>(null); // ID of comment to open reply box for
    const [replyRefresh, setReplyRefresh] = useState<number>(0); // to trigger re-render on reply added

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

                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <button
                                    onClick={() => setOpenReplyFor(openReplyFor === comment.ID ? null : comment.ID)}
                                    style={{
                                        background: 'transparent',
                                        color: '#2563eb',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: 12,
                                        padding: '4px 8px',
                                        borderRadius: 4,
                                    }}
                                >
                                    Reply
                                </button>

                                {currentUser === comment.author && (
                                    <DeleteComment commentId={comment.ID} onCommentDeleted={onCommentDeleted} />
                                )}
                            </div>
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
                        {openReplyFor === comment.ID && (
                            <div style={{ marginTop: 8, marginLeft: 20 }}>
                                <CommentReplyBox postId={comment.post_id} parentId={comment.ID} onReplyAdded={() => { setReplyRefresh((r) => r + 1); }} />
                                <ReplyList currentUser={currentUser} parentId={comment.ID} refresh={replyRefresh} />
                            </div>
                        )}

                    </div>
                ))}
            </div>
        </div>
    );
}