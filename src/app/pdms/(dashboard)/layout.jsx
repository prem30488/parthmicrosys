"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/pdms/components/Sidebar";
import TopNav from "@/pdms/components/TopNav";
import { useAuth } from "@/pdms/context/AuthContext";

export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    const toggleSidebar = () => setSidebarOpen((prev) => !prev);

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-dark-400 text-sm">Loading PDMS...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        router.push("/pdms/login");
        return null;
    }

    return (
        <div className="min-h-screen bg-dark-950">
            <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

            <div
                className={`transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}`}
            >
                <TopNav onToggleSidebar={toggleSidebar} />
                <main className="p-4 lg:p-6 animate-fade-in">
                    {children}
                </main>
            </div>
        </div>
    );
}
