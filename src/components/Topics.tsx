export default function Topics() {
    const topics = ['Technology', 'Health', 'Science', 'Art', 'Travel'];

    return (
        <aside style={{
            width: 200,
            background: '#f8fafc',
            borderRight: '1px solid rgba(0,0,0,0.08)',
            padding: '1rem 0',
            overflowY: 'auto',
            height: 'calc(100vh - 64px)',
        }}>
            <div style={{
                padding: '0 1rem',
                marginBottom: '1rem',
                fontWeight: 700,
                fontSize: 14
            }}>
                Topics
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {topics.map((topic) => (
                    <li key={topic}>
                        <button
                            style={{
                                width: '100%',
                                textAlign: 'left',
                                padding: '10px 1rem',
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                                color: '#6b7280',
                                fontSize: 14,
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            {topic}
                        </button>
                    </li>
                ))}
            </ul>
        </aside>
    );
}
