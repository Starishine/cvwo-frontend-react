import { useState } from 'react';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Topics from '../components/Topics';
import Header from '../components/Header';
import authFetch from '../utils/authFetch';

export default function AddPost() {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [customTopic, setCustomTopic] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const defaultTopics = ['Technology', 'Health', 'Science', 'Travel', 'Education', 'Entertainment', 'Sports', 'Business'];

    useEffect(() => {
        const access_token = sessionStorage.getItem('access_token');

        if (!access_token) {
            window.location.href = '/';
            return;
        }

        try {
            const decoded = jwtDecode<any>(access_token);
            const username = decoded.sub;
            console.log("Username from token:", username);
            setUsername(username);
        } catch (error) {
            console.error("Failed to decode token", error);
            window.location.href = '/';
        }

    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // determine actual topic (use custom if selected)
        const actualTopic = selectedTopic === '__custom__' ? customTopic.trim() : selectedTopic.trim();

        if (!actualTopic.trim() || !title.trim() || !content.trim()) {
            setError('All fields are required.');
            setLoading(false);
            return;
        }

        try {
            const response = await authFetch('/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ topic: actualTopic.trim(), title: title.trim(), content: content.trim(), author: username }),
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.error || data.message);
            }
            else {
                alert('Post added successfully!')
                setSelectedTopic('');
                setCustomTopic('');
                setTitle('');
                setContent('');
                window.location.href = `/topic/${actualTopic.trim()}`;
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }


    }

    const inputStyle = "w-full p-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2"
        + "focus:ring-blue-500/20 focus:border-blue-500 transition-all";

    return (
        <div className="font-sans flex flex-col min-h-screen w-[85vw] overflow-hidden">
            <Header />
            <div className="flex flex-grow w-full h-[calc(100vh-64px)]">
                <Topics />
                <main className="flex-grow p-8 bg-white h-full overflow-y-auto">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Add a new post</h2>
                    {error && <div className="text-red-600">{error}</div>}
                    <p className="text-gray-500 mb-6">Logged in as <span className="text-blue-600 font-medium">{username || 'guest'}</span></p>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-3xl">
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
                                onChange={e => setCustomTopic(e.target.value)}
                                className={inputStyle}
                            />
                        )}
                        <input
                            type="text"
                            value={title}
                            onChange={e => { setTitle(e.target.value) }} required
                            placeholder="Post Title"
                            className={inputStyle}
                        />
                        <textarea
                            placeholder="Write your content here"
                            value={content}
                            onChange={e => { setContent(e.target.value) }} required
                            className={`${inputStyle} min-h-[200px] resize-y`}
                        />
                        <div className="flex gap-3 pt-2">
                            <button type="submit"
                                disabled={loading}
                                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700
                             disabled:bg-gray-400 transition-colors shadow-sm">
                                {loading ? 'Adding…' : 'Add Post'}
                            </button>
                            <a href="/dashboard"
                                className="inline-block px-6 py-2.5 rounded-lg border border-gray-200 text-gray-700 
                            text-sm font-medium hover:bg-gray-50 transition-colors">
                                Cancel
                            </a>
                        </div>
                    </form>
                </main>
            </div>
        </div >
    );


}