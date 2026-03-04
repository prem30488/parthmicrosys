"use client";

import { useAuth } from "../context/AuthContext";
import { HiOutlineMenuAlt2, HiOutlineBell } from "react-icons/hi";

const TopNav = ({ onToggleSidebar }) => {
    const { admin } = useAuth();

    return (
        <header className="h-16 bg-dark-900/80 backdrop-blur-xl border-b border-dark-700/50 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
            {/* Left side */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onToggleSidebar}
                    className="p-2 text-dark-400 hover:text-white hover:bg-dark-800 rounded-xl transition-colors"
                    id="toggle-sidebar-btn"
                >
                    <HiOutlineMenuAlt2 className="w-5 h-5" />
                </button>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
                {/* Notifications */}
                <button className="p-2 text-dark-400 hover:text-white hover:bg-dark-800 rounded-xl transition-colors relative" id="notifications-btn">
                    <HiOutlineBell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />
                </button>

                {/* Admin avatar */}
                <div className="flex items-center gap-3 pl-3 border-l border-dark-700/50">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/10">
                        <span className="text-white text-xs font-bold">
                            {admin?.email?.charAt(0)?.toUpperCase() || "A"}
                        </span>
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-medium text-dark-200 leading-none">{admin?.email || "Admin"}</p>
                        <p className="text-xs text-dark-500 mt-0.5 capitalize">{admin?.role || "admin"}</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopNav;
