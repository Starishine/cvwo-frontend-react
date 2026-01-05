import React, { useEffect, useState, useRef } from 'react';
import authFetch from '../utils/authFetch';

export default function Search() {
    interface Post {
        id: number;
        title: string;
        content: string;
    }

    const [query, setQuery] = useState('');
    const [posts, setPosts] = useState<Array<any>>([]);
    const [filteredPosts, setFilteredPosts] = useState<Array<any>>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // when user types in the search box, make query all lowercase
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value.toLowerCase());
    }

    const fetchPostContents = async () => {
        try {
            const fetchPosts = await authFetch('http://localhost:8080/getallposts', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!fetchPosts.ok) {
                console.error('Failed to fetch posts');
                return;
            }

            const data = await fetchPosts.json();
            console.log(data);

            const normalied: Post[] = data.map((post: any) => ({
                id: post.ID,
                title: post.title ?? '',
                content: post.content ?? ''
            }));

            setPosts(normalied);

        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    useEffect(() => {
        fetchPostContents();
    }, []);

    const handleSearch = () => {
        const trimmedQuery = query.trim().toLowerCase();
        if (!trimmedQuery) {
            setFilteredPosts([]);
            setShowDropdown(false);
            return;
        }

        const filtered = posts.filter(post =>
            post.title.toLowerCase().includes(trimmedQuery) ||
            post.content.toLowerCase().includes(trimmedQuery)
        );

        setFilteredPosts(filtered);
        setShowDropdown(filtered.length > 0);
    };

    useEffect(() => {
        handleSearch();
    }, [query, posts]);

    // listen for clicks outside the component to close dropdown
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // when a search result is clicked, navigate to that post's page
    const handleResultClick = (post: Post) => {
        window.location.href = `/post/id/${post.id}`;
        setShowDropdown(false);
    }

    const snippet = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    }

    return (
        <div className="relative" ref={containerRef}>
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Search posts..."
                    className="w-full pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm 
                    focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
            </div>
            {showDropdown && (
                <ul className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg 
                shadow-xl max-h-80 overflow-y-auto z-50 divide-y divide-gray-100">
                    {filteredPosts.map((p, idx) => (
                        <li
                            key={p.id ?? idx}
                            onClick={() => handleResultClick(p)}
                            className="p-4 cursor-pointer hover:bg-blue-50 transition-colors"
                        >
                            <div className="font-semibold text-gray-900">{p.title}</div>
                            <div className="text-xs text-gray-500 mt-1">
                                {snippet(p.content, 100)}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}