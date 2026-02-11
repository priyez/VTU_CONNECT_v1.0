"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import TerminalCard from "@/components/terminal/TerminalCard";
import TerminalButton from "@/components/terminal/TerminalButton";
import TerminalBadge from "@/components/terminal/TerminalBadge";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

interface Transaction {
    id: string;
    type: string;
    amount: number;
    reference: string;
    status: string;
    createdAt: string;
}

const services = [
    { id: "data", code: "DATA_SUB", icon: "📱", description: "DATA PACKET INJECTION", href: "/dashboard/data" },
    { id: "airtime", code: "AIRTIME", icon: "📞", description: "LTE VOICE ALLOCATION", href: "/dashboard/airtime" },
    { id: "electricity", code: "ELECT_B", icon: "💡", description: "GRID POWER TOKEN", href: "/dashboard/electricity" },
];

export default function DashboardPage() {
    const { user, refreshProfile } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await api.get("/transactions/history");
                console.log(data);
                setTransactions(data.transactions || []);
            } catch (err: any) {
                console.error("Failed to fetch history:", err);
                setError("DATA_SYNC_FAILED");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const formatCurrency = (amt: number) => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
        }).format(amt);
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto font-mono">
            {/* Mode Switcher */}
            <div className="flex items-center space-x-4 bg-foreground/[0.03] p-1 border border-border-terminal/30 w-fit rounded-sm">
                <div className="px-4 py-1.5 text-[10px] font-bold bg-foreground text-black tracking-widest uppercase">
                    GUI_MODE
                </div>
                <Link
                    href="/terminal"
                    className="px-4 py-1.5 text-[10px] font-bold text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-all tracking-widest uppercase cursor-pointer"
                >
                    TERMINAL_MODE
                </Link>
            </div>

            {/* Wallet / Sys Config Section */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <TerminalCard
                    header="SYS_WALLET_RESOURCES"
                    variant="solid"
                    className="lg:col-span-2"
                >
                    <div className="relative ">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] text-accent font-bold animate-pulse">ENCRYPTED</span>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <p className="text-[10px] text-foreground/60 uppercase mb-1">Avaliable_Credits</p>
                                <div className="flex items-baseline space-x-2">
                                    <span className="text-4xl md:text-5xl font-bold text-foreground">
                                        {user ? formatCurrency(user.walletBalance) : "₦0.00"}
                                    </span>
                                    <span className="text-xs text-foreground/30">_NGN</span>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <TerminalButton onClick={() => refreshProfile()}>sync_wallet()</TerminalButton>
                                <TerminalButton variant="outline">inject_funds()</TerminalButton>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-foreground/5 -mr-16 -mt-16 rotate-45"></div>
                </TerminalCard>

                <TerminalCard header="ENV_SUBSYSTEMS">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-foreground/50">DATA_GATEWAY:</span>
                                <span className="text-foreground font-bold">ONLINE</span>
                            </div>
                            <div className="w-full bg-border-terminal h-1">
                                <div className="bg-foreground w-[92%] h-full animate-pulse"></div>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-foreground/50">API_LATENCY:</span>
                                <span className="text-accent font-bold">42MS</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-foreground/50">NODE_VERSION:</span>
                                <span className="text-foreground font-bold">v1.2.4-stable</span>
                            </div>
                        </div>
                    </div>
                </TerminalCard>
            </div>

            {/* Services Grid - Commands */}
            <section>
                <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-[0.3em] mb-6">[AVAILABLE_MODULES]</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services.map((service) => (
                        <Link key={service.id} href={service.href} className="block">
                            <TerminalCard className="group hover:border-foreground hover:bg-foreground/[0.02] transition-all cursor-pointer h-full">
                                <div className="flex items-center space-x-3 mb-3">
                                    <span className="text-lg grayscale group-hover:grayscale-0 transition-all">{service.icon}</span>
                                    <h4 className="font-bold text-foreground text-sm tracking-tight group-hover:text-white uppercase">{service.code}</h4>
                                </div>
                                <p className="text-[9px] text-foreground/40 uppercase tracking-widest">{service.description}</p>
                                <div className="absolute bottom-1 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] text-foreground/30">RUN_EXE</div>
                            </TerminalCard>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Transaction Logs */}
            <TerminalCard header="TRANSACTION_LOGS" className="!p-0">
                {loading ? (
                    <div className="p-8 text-center text-[10px] text-foreground/40 uppercase animate-pulse">Fetching_Transaction_Data...</div>
                ) : error ? (
                    <div className="p-8 text-center text-[10px] text-red-500 uppercase italic">[{error}]</div>
                ) : transactions.length === 0 ? (
                    <div className="p-8 text-center text-[10px] text-foreground/20 uppercase">No_Transactions_Recorded</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-[11px]">
                            <thead>
                                <tr className="border-b border-border-terminal/50 text-foreground/40 uppercase tracking-widest">
                                    <th className="px-6 py-3 font-bold">OP_CODE</th>
                                    <th className="px-6 py-3 font-bold">CREDITS</th>
                                    <th className="px-6 py-3 font-bold">HASH_REF</th>
                                    <th className="px-6 py-3 font-bold">STA</th>
                                    <th className="px-6 py-3 font-bold">TS_MARK</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-terminal/20">
                                {transactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-foreground/[0.03] transition-colors group">
                                        <td className="px-6 py-3 font-bold text-foreground/80 group-hover:text-foreground">{tx.type}</td>
                                        <td className="px-6 py-3 text-foreground font-bold">{formatCurrency(tx.amount)}</td>
                                        <td className="px-6 py-3 text-foreground/40 text-[10px] truncate max-w-[100px]">{tx.reference}</td>
                                        <td className="px-6 py-3">
                                            <TerminalBadge status={tx.status === "SUCCESS" || tx.status === "completed" ? "success" : "warning"}>
                                                {tx.status}
                                            </TerminalBadge>
                                        </td>
                                        <td className="px-6 py-3 text-foreground/30">{new Date(tx.createdAt).toLocaleTimeString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </TerminalCard>

            {/* Footer System Status */}
            <div className="flex justify-center space-x-12 pt-8 text-[9px] text-foreground/20 uppercase tracking-[0.4em]">
                <span>sys_kernel: stable</span>
                <span>host: 127.0.0.1</span>
                <span>entropy: maximized</span>
            </div>
        </div>
    );
}
