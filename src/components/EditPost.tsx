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
            const res = await authFetch(`/update/${post.ID}`, {
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

    const inputStyle = "w-full p-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2"
        + "focus:ring-blue-500/20 focus:border-blue-500 transition-all";
    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-3xl mt-4">
            {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm font-medium">
                    {error}
                </div>
            )}
            <select
                value={selectedTopic}
                onChange={e => setSelectedTopic(e.target.value)}
                className={inputStyle}
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
                    className={inputStyle}
                />
            )}
            <input
                type="text"
                value={updatedTitle}
                onChange={e => setUpdatedTitle(e.target.value)} required
                placeholder="Post Title"
                className={inputStyle}
            />
            <textarea
                placeholder="Write your content here"
                value={updatedContent}
                onChange={e => setUpdatedContent(e.target.value)} required
                className={`${inputStyle} min-h-[200px] resize-y`}
            />
            <div className="flex gap-3 pt-2">
                <button type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 
                    disabled:bg-gray-400 transition-colors shadow-sm"
                >
                    {loading ? 'Updating…' : 'Update Post'}
                </button>
                <button type="button"
                    onClick={() => onCancel && onCancel()}
                    className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-700 text-sm 
                    font-medium hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}