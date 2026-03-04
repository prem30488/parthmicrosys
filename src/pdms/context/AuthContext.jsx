"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize token from localStorage on mount (client-side only)
    useEffect(() => {
        const savedToken = localStorage.getItem("pdms_token");
        if (savedToken) {
            setToken(savedToken);
        } else {
            setLoading(false);
        }
    }, []);

    // Auto-logout timer
    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const expiresAt = payload.exp * 1000;
            const timeUntilExpiry = expiresAt - Date.now();

            if (timeUntilExpiry <= 0) {
                logout();
                return;
            }

            const timer = setTimeout(() => {
                logout();
            }, timeUntilExpiry);

            return () => clearTimeout(timer);
        } catch {
            logout();
        }
    }, [token]);

    // Load admin on mount if token exists
    useEffect(() => {
        const loadAdmin = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const savedAdmin = localStorage.getItem("pdms_admin");
                if (savedAdmin) {
                    setAdmin(JSON.parse(savedAdmin));
                }

                const response = await api.get("/auth/me");
                if (response.data.success) {
                    setAdmin(response.data.data);
                    localStorage.setItem("pdms_admin", JSON.stringify(response.data.data));
                }
            } catch {
                logout();
            } finally {
                setLoading(false);
            }
        };

        loadAdmin();
    }, [token]);

    const login = async (email, password) => {
        const response = await api.post("/auth/login", { email, password });
        if (response.data.success) {
            const { token: newToken, admin: adminData } = response.data.data;
            setToken(newToken);
            setAdmin(adminData);
            localStorage.setItem("pdms_token", newToken);
            localStorage.setItem("pdms_admin", JSON.stringify(adminData));
            return adminData;
        }
        throw new Error(response.data.message);
    };

    const register = async (email, password) => {
        const response = await api.post("/auth/register", { email, password });
        return response.data;
    };

    const logout = useCallback(() => {
        setToken(null);
        setAdmin(null);
        localStorage.removeItem("pdms_token");
        localStorage.removeItem("pdms_admin");
    }, []);

    const value = {
        admin,
        token,
        loading,
        isAuthenticated: !!token && !!admin,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
