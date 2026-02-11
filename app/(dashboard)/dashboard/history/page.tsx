"use client";

import React, { useState, useEffect } from "react";
import TerminalCard from "@/components/terminal/TerminalCard";
import TerminalInput from "@/components/terminal/TerminalInput";
import TerminalBadge from "@/components/terminal/TerminalBadge";
import { api } from "@/lib/api";

interface Transaction {
    _id: string;
    reference: string;
    type: string;
    amount: number;
    status: "success" | "failed" | "pending";
    description: string;
    createdAt: string;
    balanceBefore?: number;
    balanceAfter?: number;
}

export default function HistoryPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<string>("ALL");
    const [filterStatus, setFilterStatus] = useState<string>("ALL");

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await api.get("/transactions/history");
                setTransactions(data.transactions || []);
            } catch (err) {
                console.error("Failed to fetch history:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const filteredTransactions = transactions.filter((t) => {
        const matchesSearch =
            t.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === "ALL" || t.type.toUpperCase() === filterType;
        const matchesStatus = filterStatus === "ALL" || t.status.toUpperCase() === filterStatus;

        return matchesSearch && matchesType && matchesStatus;
    });

    const uniqueTypes = ["ALL", ...Array.from(new Set(transactions.map(t => t.type.toUpperCase())))];
    const uniqueStatuses = ["ALL", "SUCCESS", "FAILED", "PENDING"];

    return (
        <div className="space-y-8 max-w-6xl mx-auto font-mono">
            <div className="flex items-center justify-between border-b border-foreground/20 pb-4">
                <div className="flex items-center space-x-2">
                    <span className="text-accent font-bold tracking-tighter">[LOG]</span>
                    <h2 className="text-xl font-black uppercase tracking-widest italic">system_activity.log</h2>
                </div>
                <div className="text-[10px] text-foreground/40 uppercase tracking-widest">
                    TOTAL_ENTRIES: {filteredTransactions.length} / {transactions.length}
                </div>
            </div>

            {/* Filters Overlay */}
            <TerminalCard header="LOG_FILTERS" className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-2">
                        <TerminalInput
                            label="SEARCH_BY_REF_OR_DESC"
                            placeholder="SEARCHING..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-foreground/40 tracking-widest pl-1">OP_TYPE</label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full bg-black border border-border-terminal text-foreground text-xs p-2.5 uppercase font-bold focus:border-foreground outline-none cursor-pointer"
                        >
                            {uniqueTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-foreground/40 tracking-widest pl-1">EXIT_STATUS</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full bg-black border border-border-terminal text-foreground text-xs p-2.5 uppercase font-bold focus:border-foreground outline-none cursor-pointer"
                        >
                            {uniqueStatuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </TerminalCard>

            {/* History Table */}
            <TerminalCard header="RECORDS_STREAM" className="overflow-hidden">
                <div className="overflow-x-auto custom-terminal-scroll">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border-terminal bg-foreground/[0.02]">
                                <th className="p-4 text-[10px] uppercase font-bold text-foreground/40 tracking-widest w-40">TIMESTAMP</th>
                                <th className="p-4 text-[10px] uppercase font-bold text-foreground/40 tracking-widest w-24">TYPE</th>
                                <th className="p-4 text-[10px] uppercase font-bold text-foreground/40 tracking-widest">DESCRIPTION</th>
                                <th className="p-4 text-[10px] uppercase font-bold text-foreground/40 tracking-widest w-32">AMOUNT</th>
                                <th className="p-4 text-[10px] uppercase font-bold text-foreground/40 tracking-widest w-28 text-center">STATUS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-terminal/30">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center animate-pulse">
                                        <p className="text-[10px] uppercase tracking-[0.5em] text-foreground/40">Fetching_System_Logs...</p>
                                    </td>
                                </tr>
                            ) : filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center text-foreground/20 italic">
                                        <p className="text-[10px] uppercase tracking-[0.2em]">-- no_matching_records_found --</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredTransactions.map((tx) => (
                                    <tr key={tx._id} className="hover:bg-foreground/[0.03] transition-colors group">
                                        <td className="p-4 text-[10px] font-bold text-foreground/60 whitespace-nowrap">
                                            {new Date(tx.createdAt).toLocaleString()}
                                        </td>
                                        <td className="p-4">
                                            <span className="text-[9px] font-black border border-border-terminal px-2 py-0.5 rounded-sm uppercase tracking-tighter text-accent/80">
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td className="p-4 min-w-[200px]">
                                            <p className="text-xs font-bold text-foreground mb-1 group-hover:text-accent transition-colors">
                                                {tx.description}
                                            </p>
                                            <p className="text-[9px] text-foreground/30 font-mono tracking-tighter uppercase">REF: {tx.reference}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-xs font-black text-foreground">
                                                ₦{tx.amount.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <TerminalBadge status={tx.status === "success" ? "success" : tx.status === "failed" ? "error" : "info"}>
                                                {tx.status}
                                            </TerminalBadge>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 pt-4 border-t border-border-terminal flex justify-between items-center text-[8px] text-foreground/30 uppercase tracking-[0.2em]">
                    <span>Source: DB_TRANS_CLUSTER_02</span>
                    <span>Access: {filterType === "ALL" ? "FULL_LOG" : `FILTERED_${filterType}`}</span>
                    <span>Buffer: {loading ? "CONNECTING..." : "SYNCED"}</span>
                </div>
            </TerminalCard>
        </div>
    );
}
