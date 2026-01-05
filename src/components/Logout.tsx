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
            className="bg-red-500 text-white border-none px-3 py-2 rounded-lg cursor-pointer 
            font-medium hover:bg-red-600 active:bg-red-700 transition-colors shadow-sm"
        >
            Logout
        </button>
    );
}