import { useState } from "react";
import CommentReplyBox from "./CommentReplyBox";
import ReplyList from "./ReplyList";
import DeleteComment from "./DeleteComment";
import type { Comment } from "../types/Comment";

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
        <div className="pb-6">
            <h3 className="m-0 mb-4 text-base font-semibold text-gray-900">
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

            <div className="flex flex-col gap-3 pb-2">
                {comments.map((comment) => (
                    <div
                        key={comment.ID}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-sm"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-900">
                                    {comment.author}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {new Date(comment.CreatedAt).toLocaleString()}
                                </span>
                            </div>

                            <div className="flex gap-2 items-center">
                                <button
                                    onClick={() => setOpenReplyFor(openReplyFor === comment.ID ? null : comment.ID)}
                                    className="bg-transparent text-blue-600 border-none cursor-pointer text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                                >
                                    Reply
                                </button>

                                {currentUser === comment.author && (
                                    <DeleteComment
                                        commentId={comment.ID}
                                        onCommentDeleted={onCommentDeleted}
                                    />
                                )}
                            </div>
                        </div>

                        <p className="m-0 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {comment.comment}
                        </p>

                        {openReplyFor === comment.ID && (
                            <div className="mt-4 ml-5 pl-4 border-l-2 border-gray-200">
                                <CommentReplyBox
                                    postId={comment.post_id}
                                    parentId={comment.ID}
                                    onReplyAdded={() => setReplyRefresh((r) => r + 1)}
                                />
                                <ReplyList
                                    currentUser={currentUser}
                                    parentId={comment.ID}
                                    refresh={replyRefresh}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}