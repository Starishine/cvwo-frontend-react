export default async function authFetch(url: string, options: RequestInit = {}) {
    let access_token = sessionStorage.getItem('access_token');

    let response = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${access_token}`
        }
    });

    if (response.status === 401) {
        // try refreshing token
        const refreshResponse = await fetch('http://localhost:8080/auth/refresh', {
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

        response = await fetch(url, {
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