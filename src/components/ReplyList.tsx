import { useEffect } from "react";
import authFetch from "../utils/authFetch";
import { useState } from "react";
import DeleteComment from "./DeleteComment";

export default function ReplyList({ currentUser, parentId, refresh }: { currentUser: string, parentId: number, refresh: number }) {
    const [replies, setReplies] = useState<Array<any>>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchReplies = async () => {
        try {
            const res = await authFetch(`http://localhost:8080/comments/replies/${parentId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (res.ok) {
                const data = await res.json();
                setReplies(data.replies);
                console.log("Fetched replies:", data);
            } else {
                console.error("Failed to fetch replies");
            }
        } catch (err) {
            console.error("Error fetching replies:", err);
        }
    };

    useEffect(() => {
        fetchReplies();
    }, [parentId, refresh]);

    return (
        <div className="mt-2 pb-3">
            {loading && replies.length === 0 && (
                <div className="text-gray-500 text-xs animate-pulse">Loading replies…</div>
            )}
            {error && (
                <div className="text-red-600 text-xs font-medium">{error}</div>
            )}
            {!loading && !error && replies.length === 0 && (
                <div className="text-gray-400 text-xs italic">No replies yet.</div>
            )}
            <div className="flex flex-col gap-2 mt-2">
                {replies.map((r) => {
                    const key = r.ID ?? r.id ?? r._id ?? Math.random();
                    const author = r.author ?? r.Author ?? 'Unknown';
                    const content = r.comment ?? r.content ?? '';
                    const time = r.CreatedAt ?? r.created_at ?? r.created ?? null;
                    const initial = author ? String(author)[0].toUpperCase() : '?';

                    return (
                        <div key={key} className="flex gap-3 items-start p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                            {/* Avatar Icon */}
                            <div className="w-9 h-9 shrink-0 rounded-full bg-slate-100 flex items-center justify-center font-bold text-gray-900 text-sm">
                                {initial}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center gap-3 mb-1.5">
                                    <div className="text-xs font-semibold text-gray-900 truncate">
                                        {author}
                                    </div>
                                    <div className="text-[11px] text-gray-400 whitespace-nowrap">
                                        {time ? new Date(time).toLocaleString() : ''}
                                    </div>
                                </div>

                                <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap break-words">
                                    {content}
                                </div>
                            </div>

                            {currentUser === r.author && (
                                <div className="ml-2">
                                    <DeleteComment
                                        commentId={r.ID}
                                        onCommentDeleted={() => fetchReplies()}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}