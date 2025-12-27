export default function Logout() {

    async function handleLogout() {
        try {
            sessionStorage.removeItem('access_token');

            const res = await fetch('http://localhost:8080/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });

            if (res.ok) {
                // Wait for the cookie to be cleared
                await new Promise(resolve => setTimeout(resolve, 100));
            }

        } catch (err) {
            console.error('Logout request failed:', err);
        } finally {
            // Clear everything and redirect
            sessionStorage.clear();
            window.location.href = '/';
        }
    }


    return (
        <button
            onClick={handleLogout}
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
    );
}