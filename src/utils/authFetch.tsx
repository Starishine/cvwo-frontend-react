// Handles authenticated fetch requests with automatic token refresh

export default async function authFetch(url: string, options: RequestInit = {}) {

    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    let access_token = sessionStorage.getItem('access_token');

    let response = await fetch(`${BASE_URL}${url}`, {
        ...options,
        credentials: 'include',
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${access_token}`
        }
    });

    // if unauthorized, try to refresh token
    if (response.status === 401) {
        // try refreshing token
        const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
            method: 'POST',
            credentials: 'include'
        });

        if (!refreshResponse.ok) {
            throw new Error('Session expired.');
        }

        const refreshData = await refreshResponse.json();
        sessionStorage.setItem('access_token', refreshData.access_token);

        // retry original request with new token
        access_token = refreshData.access_token;

        response = await fetch(`${BASE_URL}${url}`, {
            ...options,
            credentials: 'include',
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${access_token}`,
            }
        });
    }
    return response;
}