export default async function authFetch(url: string, options: RequestInit = {}) {
    let access_token = sessionStorage.getItem('accessToken');

    let response = await fetch(url, {
        ...options,
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
        sessionStorage.setItem('accessToken', refreshData.accessToken);

        // retry original request with new token
        access_token = refreshData.accessToken;

        response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${access_token}`
            }
        });
    }
    return response;
}