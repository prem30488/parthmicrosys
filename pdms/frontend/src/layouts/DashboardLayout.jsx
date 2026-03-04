import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => setSidebarOpen((prev) => !prev);

    return (
        <div className="min-h-screen bg-dark-950">
            <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

            <div
                className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}
            >
                <TopNav onToggleSidebar={toggleSidebar} />
                <main className="p-4 lg:p-6 animate-fade-in">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
