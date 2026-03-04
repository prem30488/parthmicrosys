"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import {
    HiOutlineViewGrid,
    HiOutlineCube,
    HiOutlinePlusCircle,
    HiOutlineLogout,
    HiOutlineChevronLeft,
} from "react-icons/hi";

const navItems = [
    { path: "/pdms/dashboard", label: "Dashboard", icon: HiOutlineViewGrid },
    { path: "/pdms/products", label: "Products", icon: HiOutlineCube },
    { path: "/pdms/products/new", label: "Add Product", icon: HiOutlinePlusCircle },
];

const Sidebar = ({ isOpen, onToggle }) => {
    const { logout } = useAuth();
    const pathname = usePathname();

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
                    onClick={onToggle}
                />
            )}

            <aside
                className={`
          fixed top-0 left-0 z-50 h-full
          bg-dark-900/95 backdrop-blur-xl border-r border-dark-700/50
          transition-all duration-300 ease-in-out
          ${isOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full lg:w-20 lg:translate-x-0"}
        `}
            >
                {/* Logo area */}
                <div className="h-16 flex items-center px-5 border-b border-dark-700/50">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/20">
                            <span className="text-white font-bold text-sm">P</span>
                        </div>
                        <span
                            className={`font-bold text-lg gradient-text whitespace-nowrap transition-opacity duration-200
              ${isOpen ? "opacity-100" : "opacity-0 lg:opacity-0 hidden lg:block"}`}
                        >
                            PDMS
                        </span>
                    </div>

                    {/* Collapse button */}
                    <button
                        onClick={onToggle}
                        className="ml-auto text-dark-400 hover:text-white p-1 rounded-lg hover:bg-dark-700/50 transition-colors lg:block hidden"
                    >
                        <HiOutlineChevronLeft
                            className={`w-4 h-4 transition-transform duration-300 ${!isOpen ? "rotate-180" : ""}`}
                        />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="mt-4 px-3 flex flex-col gap-1">
                    {navItems.map(({ path, label, icon: Icon }) => {
                        const isActive = pathname === path;
                        return (
                            <Link
                                key={path}
                                href={path}
                                onClick={() => window.innerWidth < 1024 && onToggle()}
                                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 group relative
                  ${isActive
                                        ? "bg-primary-500/15 text-primary-400 shadow-sm"
                                        : "text-dark-400 hover:text-dark-200 hover:bg-dark-800/50"
                                    }
                `}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                <span
                                    className={`whitespace-nowrap transition-opacity duration-200
                  ${isOpen ? "opacity-100" : "opacity-0 lg:opacity-0 hidden lg:block"}`}
                                >
                                    {label}
                                </span>
                                {/* Tooltip for collapsed state */}
                                {!isOpen && (
                                    <span className="absolute left-full ml-3 px-2 py-1 bg-dark-800 text-dark-200 text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap hidden lg:block shadow-xl border border-dark-700">
                                        {label}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="absolute bottom-6 left-0 right-0 px-3">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                    >
                        <HiOutlineLogout className="w-5 h-5 flex-shrink-0" />
                        <span
                            className={`whitespace-nowrap transition-opacity duration-200
              ${isOpen ? "opacity-100" : "opacity-0 lg:opacity-0 hidden lg:block"}`}
                        >
                            Logout
                        </span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
