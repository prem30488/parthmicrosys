"use client";

import { AuthProvider } from "@/pdms/context/AuthContext";
import { Toaster } from "react-hot-toast";

export default function PdmsLayout({ children }) {
    return (
        <AuthProvider>
            <div className="pdms-scrollbar" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
                {children}
            </div>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: "#1e293b",
                        color: "#e2e8f0",
                        border: "1px solid #334155",
                        borderRadius: "0.75rem",
                        fontSize: "0.875rem",
                    },
                    success: {
                        iconTheme: { primary: "#34d399", secondary: "#1e293b" },
                    },
                    error: {
                        iconTheme: { primary: "#f87171", secondary: "#1e293b" },
                    },
                }}
            />
        </AuthProvider>
    );
}
