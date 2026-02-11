"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface User {
    id: string;
    username: string;
    email: string;
    walletBalance: number;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string, userData: User, redirectTo?: string | null) => void;
    logout: () => void;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const refreshProfile = useCallback(async () => {
        const token = localStorage.getItem("vtu_token");
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            // Assuming there's a /auth/profile or /auth/me endpoint
            // Adjust according to backend reality. Based on docs provided earlier:
            // The login response returns user data, but we might need a fetch for refresh.
            // For now, let's assume we can fetch balance/profile.
            const data = await api.get("/auth/profile");
            setUser(data.user);
        } catch (error) {
            console.error("Failed to fetch profile:", error);
            // logout(); // Optional: logout on failed profile fetch
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshProfile();
    }, [refreshProfile]);

    const login = (token: string, userData: User, redirectTo: string | null = "/dashboard") => {
        localStorage.setItem("vtu_token", token);
        setUser(userData);
        if (redirectTo) {
            router.push(redirectTo);
        }
    };

    const logout = () => {
        localStorage.removeItem("vtu_token");
        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
