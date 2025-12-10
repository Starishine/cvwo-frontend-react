export default function Header({ onLogout }: { onLogout?: () => void }) {
    return (
        <header style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 20px',
            borderBottom: '1px solid rgba(0,0,0,0.08)',
            background: '#fff',
            height: '64px',
            flexShrink: 0
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    background: '#111827',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 18
                }}>
                    R
                </div>
                <div style={{ fontWeight: 700, fontSize: 18 }}>eadIT</div>
            </div>

            <nav style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <a href="/add-post" style={{ textDecoration: 'none', color: '#111827', padding: '8px 12px', borderRadius: 8 }}>
                    New Post
                </a>
                <button
                    onClick={onLogout}
                    style={{
                        background: '#ef4444',
                        color: '#fff',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: 8,
                        cursor: 'pointer'
                    }}
                >
                    Logout
                </button>
            </nav>
        </header>
    );
}