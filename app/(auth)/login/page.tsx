"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TerminalInput from "@/components/terminal/TerminalInput";
import TerminalButton from "@/components/terminal/TerminalButton";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = await api.post("/auth/login", { email, password });
            // Based on provided API docs, response is { message, token, user: { id, username, email, walletBalance } }
            login(data.token, data.user);
            // The login function from useAuth is expected to handle redirection to /dashboard
        } catch (err: any) {
            setError(err.message || "Authentication failed. check_logs()");
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-3 border border-red-500/50 bg-red-500/10 text-red-500 text-[10px] font-mono uppercase tracking-widest italic">
                    [ERR_AUTH]: {error}
                </div>
            )}
            <div className="space-y-4">
                <TerminalInput
                    label="IDENT_USER_EMAIL"
                    type="email"
                    required
                    placeholder="user@vtu_os"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <TerminalInput
                    label="IDENT_ACCESS_KEY"
                    type="password"
                    prompt="*"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <TerminalButton
                type="submit"
                disabled={loading}
                className="w-full"
            >
                {loading ? "exec auth..." : "run login.exe"}
            </TerminalButton>

            <div className="text-center pt-2">
                <p className="text-[10px] text-foreground/50 uppercase tracking-widest font-mono">
                    New terminal user?{" "}
                    <Link href="/signup" className="text-foreground hover:underline border-b border-foreground/30">
                        register_new()
                    </Link>
                </p>
            </div>
        </form>
    );
}
