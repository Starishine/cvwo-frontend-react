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
        <div style={{ marginTop: 8, paddingBottom: 12 }}>
            {loading && <div style={{ color: '#6b7280', fontSize: 13 }}>Loading replies…</div>}
            {error && <div style={{ color: '#dc2626', fontSize: 13 }}>{error}</div>}
            {!loading && !error && replies.length === 0 && <div style={{ color: '#6b7280', fontSize: 13 }}>No replies yet.</div>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                {replies.map((r) => {
                    const key = r.ID ?? r.id ?? r._id ?? Math.random();
                    const author = r.author ?? r.Author ?? 'Unknown';
                    const content = r.comment ?? r.content ?? '';
                    const time = r.CreatedAt ?? r.created_at ?? r.created ?? null;
                    const initial = author ? String(author)[0].toUpperCase() : '?';

                    return (
                        <div key={key} style={{
                            display: 'flex',
                            gap: 12,
                            alignItems: 'flex-start',
                            padding: 12,
                            background: '#fff',
                            borderRadius: 8,
                            border: '1px solid #e5e7eb'
                        }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: 999,
                                background: '#f1f5f9', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                fontWeight: 700, color: '#111827'
                            }}>
                                {initial}
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    gap: 12,
                                    marginBottom: 6,
                                    alignItems: 'center'
                                }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{author}</div>
                                    <div style={{ fontSize: 12, color: '#9ca3af' }}>{time ? new Date(time).toLocaleString() : ''}</div>
                                </div>

                                <div style={{
                                    color: '#374151',
                                    fontSize: 14,
                                    lineHeight: 1.6,
                                    whiteSpace: 'pre-wrap',
                                    overflowWrap: 'break-word'
                                }}>
                                    {content}
                                </div>
                            </div>
                            {currentUser === r.author && (
                                <DeleteComment commentId={r.ID} onCommentDeleted={() => fetchReplies()} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}