"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/pdms/context/AuthContext";
import toast from "react-hot-toast";

const RegisterPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { register, isAuthenticated } = useAuth();
    const router = useRouter();

    if (isAuthenticated) {
        router.push("/pdms/dashboard");
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        setLoading(true);
        try {
            await register(email, password);
            toast.success("Account created! Please login.");
            router.push("/pdms/login");
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary-700/5 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md relative animate-slide-up">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-primary-500/20 mb-4">
                        <span className="text-white font-bold text-2xl">P</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">Create Account</h1>
                    <p className="text-dark-400 text-sm mt-1">Get started with PDMS</p>
                </div>

                <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-5">
                    <div>
                        <label htmlFor="reg-email" className="block text-sm font-medium text-dark-300 mb-1.5">
                            Email Address
                        </label>
                        <input
                            id="reg-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="admin@example.com"
                            className="w-full px-4 py-2.5 bg-dark-800/50 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="reg-password" className="block text-sm font-medium text-dark-300 mb-1.5">
                            Password
                        </label>
                        <input
                            id="reg-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Min 6 characters"
                            className="w-full px-4 py-2.5 bg-dark-800/50 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="reg-confirm" className="block text-sm font-medium text-dark-300 mb-1.5">
                            Confirm Password
                        </label>
                        <input
                            id="reg-confirm"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 bg-dark-800/50 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all text-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        id="register-btn"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Creating account...
                            </span>
                        ) : (
                            "Create Account"
                        )}
                    </button>

                    <p className="text-center text-dark-400 text-sm">
                        Already have an account?{" "}
                        <Link href="/pdms/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                            Sign In
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
