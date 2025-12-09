import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode";

export default function Dashboard() {
    const [username, setUsername] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            window.location.href = '/';
            return;
        }

        try {
            const decoded = jwtDecode<any>(token);
            const username = decoded.sub;
            console.log("Username from token:", username);
            setUsername(username);
        } catch (error) {
            console.error("Failed to decode token", error);
            window.location.href = '/';
            localStorage.removeItem('token');
        }

    }, []);

    return (<div>Welcome back, {username} </div>)
}