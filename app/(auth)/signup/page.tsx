"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TerminalInput from "@/components/terminal/TerminalInput";
import TerminalButton from "@/components/terminal/TerminalButton";
import { api } from "@/lib/api";

export default function SignupPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await api.post("/auth/signup", { username, email, password });
            setSuccess(true);
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (err: any) {
            setError(err.message || "Registration failed. check_logs()");
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-3 border border-red-500/50 bg-red-500/10 text-red-500 text-[10px] font-mono uppercase tracking-widest italic">
                    [ERR_SIGNUP]: {error}
                </div>
            )}
            {success && (
                <div className="p-3 border border-foreground/50 bg-foreground/10 text-foreground text-[10px] font-mono uppercase tracking-widest italic">
                    [SUCCESS]: ACCOUNT_CREATED. REDIRECTING...
                </div>
            )}
            <div className="space-y-4">
                <TerminalInput
                    label="IDENT_SYS_USERNAME"
                    type="text"
                    required
                    placeholder="root_user"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <TerminalInput
                    label="IDENT_USER_EMAIL"
                    type="email"
                    required
                    placeholder="user@vtu_os"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <TerminalInput
                    label="IDENT_NEW_ACCESS_KEY"
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
                disabled={loading || success}
                className="w-full"
            >
                {loading ? "creating_user..." : "run signup.exe"}
            </TerminalButton>

            <div className="text-center pt-2">
                <p className="text-[10px] text-foreground/50 uppercase tracking-widest font-mono">
                    Already registered?{" "}
                    <Link href="/login" className="text-foreground hover:underline border-b border-foreground/30">
                        return_to_login()
                    </Link>
                </p>
            </div>
        </form>
    );
}
