"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import UserUpdateModal from "@/components/dashboard/UserUpdateModal";
import { useState } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, logout, loading } = useAuth();
    const router = useRouter();
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const handleLogout = () => {
        logout();
    };

    React.useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-foreground font-mono italic animate-pulse">
                [INITIALIZING_SYS_CLEARANCE...]
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex flex-col md:flex-row text-foreground overflow-hidden">
            {/* Sidebar - Terminal Directory Layout */}
            <aside className="hidden md:flex w-72 bg-black border-r border-border-terminal flex-col p-6 space-y-8 z-20">
                <div>
                    <div className="flex items-center space-x-2 text-foreground font-bold text-xl mb-1">
                        <span className="text-accent animate-pulse">#</span>
                        <span>VTU_CONSOLE</span>
                    </div>
                    <p className="text-[10px] text-foreground/40 uppercase tracking-[0.2em]">System Root Access Enabled</p>
                </div>

                <nav className="flex-1 space-y-6 text-sm">
                    <div className="space-y-2">
                        <p className="text-[10px] text-foreground/30 uppercase font-bold tracking-widest pl-2">/root/system</p>
                        <Link href="/dashboard" className="flex items-center px-4 py-2 border border-foreground bg-foreground/5 text-foreground font-bold group">
                            <span className="mr-3 text-accent group-hover:translate-x-1 transition-transform">{">"}</span>
                            <span>DASHBOARD.SH</span>
                        </Link>
                        <Link href="/terminal" className="flex items-center px-4 py-2 text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-all text-left uppercase group relative border border-transparent hover:border-foreground/30">
                            <span className="mr-3 text-foreground/30">{">"}</span>
                            <span>TERMINAL_PROMPT</span>
                            <span className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] text-accent">OPEN</span>
                        </Link>
                    </div>

                    <div className="space-y-2">
                        <p className="text-[10px] text-foreground/30 uppercase font-bold tracking-widest pl-2">/root/services</p>
                        <div className="space-y-1">
                            <Link href="/dashboard/data" className="w-full flex items-center px-4 py-2 text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-all text-left uppercase group relative">
                                <span className="mr-3 text-foreground/30">|--</span>
                                <span>DATA_SUBS.EXE</span>
                                <span className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] text-accent">RUN</span>
                            </Link>
                            <Link href="/dashboard/airtime" className="w-full flex items-center px-4 py-2 text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-all text-left uppercase group relative">
                                <span className="mr-3 text-foreground/30">|--</span>
                                <span>AIRTIME.EXE</span>
                                <span className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] text-accent">RUN</span>
                            </Link>
                            <Link href="/dashboard/electricity" className="w-full flex items-center px-4 py-2 text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-all text-left uppercase group relative">
                                <span className="mr-3 text-foreground/30">|--</span>
                                <span>ELECT_BILL.EXE</span>
                                <span className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] text-accent">RUN</span>
                            </Link>
                            <Link href="/dashboard/history" className="w-full flex items-center px-4 py-2 text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-all text-left uppercase group relative">
                                <span className="mr-3 text-foreground/30">`--</span>
                                <span>HISTORY.LOG</span>
                                <span className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] text-accent">OPEN</span>
                            </Link>
                        </div>
                    </div>
                </nav>

                <div className="pt-4 border-t border-border-terminal">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-accent/70 hover:text-accent hover:bg-accent/5 transition-all text-[11px] font-bold uppercase tracking-widest"
                    >
                        <span className="mr-3">[!]</span> SHUTDOWN_SESSION
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Header - System Stats */}
                <header className="h-14 bg-black border-b border-border-terminal flex items-center justify-between px-6 z-10">
                    <div className="flex items-center space-x-6">
                        <div className="hidden lg:flex items-center space-x-2 text-[10px] uppercase tracking-widest">
                            <span className="text-foreground/40 text-[10px]">CPU_LOAD:</span>
                            <span className="text-foreground">0.12%</span>
                        </div>
                    </div>

                    <div
                        className="flex items-center space-x-4 cursor-pointer hover:bg-foreground/5 p-2 transition-all group"
                        onClick={() => setIsUpdateModalOpen(true)}
                    >
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-foreground tracking-widest uppercase group-hover:text-accent transition-colors">USER: {user?.username || "GUEST"}</p>
                            <p className="text-[9px] text-accent tracking-tighter uppercase font-mono italic">STATUS: {user ? "HIGH_CLEARANCE" : "UNAUTHORIZED"}</p>
                        </div>
                        <div className="w-8 h-8 border border-foreground flex items-center justify-center text-foreground text-xs font-bold bg-foreground/5 uppercase group-hover:bg-foreground group-hover:text-black transition-all">
                            {user?.username?.[0] || "G"}
                        </div>
                    </div>

                    <UserUpdateModal
                        isOpen={isUpdateModalOpen}
                        onClose={() => setIsUpdateModalOpen(false)}
                    />
                </header>

                {/* Dynamic Display */}
                <div className="flex-1 px-3 lg:px-6 lg:p-6 overflow-y-auto custom-terminal-scroll">
                    {children}
                </div>
            </main>
        </div>
    );
}
