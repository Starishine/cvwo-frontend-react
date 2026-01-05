import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode";
import Topics from "../components/Topics";
import Header from "../components/Header";

export default function Dashboard() {
    const [username, setUsername] = useState('');

    useEffect(() => {
        const access_token = sessionStorage.getItem('access_token');
        if (!access_token) {
            window.location.href = '/';
            return;
        }

        try {
            const decoded = jwtDecode<any>(access_token);
            setUsername(decoded.sub);
        } catch (err) {
            window.location.href = '/';
        }
    }, []);

    return (
        <div className="font-sans flex flex-col min-h-screen w-[85vw] overflow-hidden">
            <Header />
            <div className="flex flex-grow w-full h-[calc(100vh-64px)]">
                <Topics />
                <main className="flex-grow p-8 bg-white items-center h-full overflow-y-auto">
                    <h2 className="text-2xl font-bold mb-4">Welcome to readIT, {username}</h2>
                    <p className="text-gray-500" >
                        Use the Topics link to explore content.
                    </p>
                </main>
            </div>
        </div>
    );
}