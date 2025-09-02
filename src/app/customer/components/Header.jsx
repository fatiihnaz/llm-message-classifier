"use client";

import { User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
    const [username, setUsername] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        setUsername(storedUsername);
    }, []);

    const handleLogout = () => {
        router.push("/");
    };

    return (
        <header className="">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                        </div>
                        {username && (
                            <h1 className="text-lg font-semibold text-gray-900">Hoş geldiniz, {username}</h1>
                        )}
                    </div>

                    <button onClick={handleLogout} className="inline-flex items-center space-x-2 px-2 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 transition-all duration-100">
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </header>
    );
}