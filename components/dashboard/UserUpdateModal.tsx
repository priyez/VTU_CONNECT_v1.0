"use client";

import React, { useState } from "react";
import TerminalInput from "@/components/terminal/TerminalInput";
import TerminalButton from "@/components/terminal/TerminalButton";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface UserUpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function UserUpdateModal({ isOpen, onClose }: UserUpdateModalProps) {
    const { user, login } = useAuth();
    const [activeTab, setActiveTab] = useState<"ACCOUNT" | "SECURITY">("ACCOUNT");
    const [username, setUsername] = useState(user?.username || "");
    const [email, setEmail] = useState(user?.email || "");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

    if (!isOpen) return null;

    const handleUpdateAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setStatus(null);

        try {
            const response = await api.put("/auth/update", { username, email });
            // Update local state by calling login with the new user object and existing token
            const token = localStorage.getItem("token");
            if (token) {
                login(token, {
                    id: response.user.id || response.user._id,
                    username: response.user.username,
                    email: response.user.email,
                    walletBalance: user?.walletBalance || 0
                });
            }
            setStatus({ type: "success", message: "ACCOUNT_INFO_SYNCHRONIZED_SUCCESSFULLY" });
        } catch (err: any) {
            setStatus({ type: "error", message: err.message || "SYNC_PROCEDURE_FAILED" });
        } finally {
            setSubmitting(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setStatus(null);

        try {
            await api.post("/auth/change-password", { oldPassword, newPassword });
            setOldPassword("");
            setNewPassword("");
            setStatus({ type: "success", message: "SECURITY_CREDENTIALS_REKEYED" });
        } catch (err: any) {
            setStatus({ type: "error", message: err.message || "REKEYING_PROCEDURE_ABORTED" });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative w-full max-w-md bg-black border-2 border-foreground shadow-[0_0_50px_rgba(0,255,65,0.2)] font-mono">
                {/* Terminal Header */}
                <div className="bg-foreground text-black px-4 py-2 flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-[0.2em]">user_profile_edit.sh</span>
                    <button onClick={onClose} className="hover:bg-black/10 px-2 font-bold font-sans">✕</button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-border-terminal">
                    <button
                        onClick={() => setActiveTab("ACCOUNT")}
                        className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "ACCOUNT" ? "bg-foreground/10 text-foreground border-b-2 border-foreground" : "text-foreground/30 hover:text-foreground/60"
                            }`}
                    >
                        [ ACCOUNT_INFO ]
                    </button>
                    <button
                        onClick={() => setActiveTab("SECURITY")}
                        className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "SECURITY" ? "bg-foreground/10 text-foreground border-b-2 border-foreground" : "text-foreground/30 hover:text-foreground/60"
                            }`}
                    >
                        [ SECURITY_OPS ]
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {activeTab === "ACCOUNT" ? (
                        <form onSubmit={handleUpdateAccount} className="space-y-4">
                            <TerminalInput
                                label="SYSTEM_IDENTIFIER"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <TerminalInput
                                label="COMMS_CHANNEL_(EMAIL)"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <TerminalButton type="submit" disabled={submitting} className="w-full">
                                {submitting ? "SYNCING..." : "COMMIT_CHANGES"}
                            </TerminalButton>
                        </form>
                    ) : (
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <TerminalInput
                                label="EXISTING_KEY"
                                type="password"
                                placeholder="********"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                            />
                            <TerminalInput
                                label="NEW_SECURITY_TOKEN"
                                type="password"
                                placeholder="********"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <TerminalButton type="submit" disabled={submitting} className="w-full">
                                {submitting ? "REKEYING..." : "UPDATE_CREDENTIALS"}
                            </TerminalButton>
                        </form>
                    )}

                    {status && (
                        <div className={`p-3 border text-[9px] font-bold uppercase tracking-widest shadow-lg ${status.type === "success"
                            ? "border-foreground bg-foreground/10 text-foreground"
                            : "border-red-500 bg-red-500/10 text-red-500"
                            }`}>
                            {status.type === "success" ? ">>_PROC_COMPLETE: " : ">>_ERR_CODE_01: "}
                            {status.message}
                        </div>
                    )}
                </div>

                <div className="px-6 pb-6 text-[8px] text-foreground/20 uppercase tracking-tighter">
                    <p>[SYS] Authoritative synchronization with Railway_Core cluster 01.</p>
                    <p>[SYS] Metadata hashing: SHA-256 enabled.</p>
                </div>
            </div>
        </div>
    );
}
