import { useEffect, useState } from "react";
import authFetch from "../utils/authFetch";

export default function EditPost({
    post,
    onUpdated,
    onCancel
}: {
    post: any;
    onUpdated?: () => void;
    onCancel?: () => void;
}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [customTopic, setCustomTopic] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [updatedTitle, setUpdatedTitle] = useState('');
    const [updatedContent, setUpdatedContent] = useState('');
    const defaultTopics = ['Technology', 'Health', 'Science', 'Travel', 'Education', 'Entertainment', 'Sports', 'Business'];


    useEffect(() => {
        if (!post) return;
        setSelectedTopic(post.topic || '');
        setCustomTopic(post.topic || '');
        setUpdatedTitle(post.title || '');
        setUpdatedContent(post.content || '');
    }, [post]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        const actualTopic = selectedTopic === '__custom__' ? customTopic.trim() : selectedTopic.trim();

        if (!actualTopic || !updatedTitle.trim() || !updatedContent.trim()) {
            setError('All fields are required.');
            return;
        }

        window.location.reload();

        setLoading(true);
        try {
            const res = await authFetch(`http://localhost:8080/update/${post.ID}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic: actualTopic,
                    title: updatedTitle.trim(),
                    content: updatedContent.trim()
                })
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || data.message || 'Failed to update post');
            } else {
                if (onUpdated) onUpdated();
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 800, marginTop: 16 }}>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <select
                value={selectedTopic}
                onChange={e => setSelectedTopic(e.target.value)}
                style={{
                    width: '100%',
                    padding: 10,
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    fontFamily: 'inherit',
                    fontSize: 14
                }}
            >
                <option value="">Select a topic...</option>
                {defaultTopics.map(t => (
                    <option key={t} value={t}>{t}</option>
                ))}
                <option value="__custom__">+ Add custom topic</option>
            </select>
            {selectedTopic === '__custom__' && (
                <input
                    type="text"
                    placeholder="Enter custom topic"
                    value={customTopic}
                    onChange={e => setCustomTopic(e.target.value)}
                    style={{
                        width: '100%',
                        padding: 10,
                        borderRadius: 8,
                        border: '1px solid #e5e7eb',
                        marginTop: 8,
                        fontFamily: 'inherit'
                    }}
                />
            )}
            <input
                type="text"
                value={updatedTitle}
                onChange={e => setUpdatedTitle(e.target.value)} required
                placeholder="Post Title"
                style={{ padding: 10, borderRadius: 8, border: '1px solid #e5e7eb' }}
            />
            <textarea
                placeholder="Write your content here"
                value={updatedContent}
                onChange={e => setUpdatedContent(e.target.value)} required
                style={{ padding: 10, borderRadius: 8, border: '1px solid #e5e7eb', minHeight: 200 }}
            />
            <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" style={{
                    background: '#2563eb', color: '#fff', border: 'none',
                    padding: '10px 14px', borderRadius: 8, cursor: 'pointer'
                }}>
                    {loading ? 'Updating…' : 'Update Post'}
                </button>
                <button type="button" onClick={() => onCancel && onCancel()} style={{
                    display: 'inline-block',
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    color: '#111827',
                    background: 'transparent',
                    cursor: 'pointer'
                }}>
                    Cancel
                </button>
            </div>
        </form>
    );
}