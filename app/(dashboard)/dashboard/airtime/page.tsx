"use client";

import React, { useState } from "react";
import TerminalCard from "@/components/terminal/TerminalCard";
import TerminalInput from "@/components/terminal/TerminalInput";
import TerminalButton from "@/components/terminal/TerminalButton";
import { api } from "@/lib/api";
import networks from "@/data/network.json";

export default function AirtimePage() {
    const [selectedNetworkId, setSelectedNetworkId] = useState<number | null>(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const selectedNetwork = networks.find(n => n.id === selectedNetworkId);

    const handlePurchase = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedNetworkId || !phoneNumber || !amount) {
            setStatus({ type: "error", message: "MISSING_REQUIRED_PARAMETERS" });
            return;
        }

        setSubmitting(true);
        setStatus(null);

        try {
            await api.post("/airtime", {
                network_id: selectedNetwork?.name, // Backend API documentation says network_id expects string (e.g. "MTN")
                phone: phoneNumber,
                amount: Number(amount),
            });
            setStatus({ type: "success", message: "AIRTIME_TOP_UP_SUCCESSFUL. TRANS_ID: [PENDING]" });
            // Reset form
            setPhoneNumber("");
            setAmount("");
        } catch (err: any) {
            setStatus({ type: "error", message: err.message || "OPERATION_FAILED. CHECK_LINK." });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto font-mono">
            <div className="flex items-center space-x-2 border-b border-foreground/20 pb-4">
                <span className="text-accent font-bold tracking-tighter">[CMD]</span>
                <h2 className="text-xl font-black uppercase tracking-widest italic">run airtime_topup.exe</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Network Selection */}
                <TerminalCard header="NETWORK_MATRIX">
                    <div className="grid grid-cols-2 gap-3">
                        {networks.map((net) => (
                            <button
                                key={net.id}
                                onClick={() => setSelectedNetworkId(net.id)}
                                className={`p-4 border text-xs font-black uppercase transition-all relative overflow-hidden group ${selectedNetworkId === net.id
                                        ? "bg-foreground text-black border-foreground shadow-[0_0_15px_rgba(0,255,65,0.3)]"
                                        : "bg-black text-foreground/40 border-border-terminal hover:border-foreground/50 hover:text-foreground hover:bg-foreground/5"
                                    }`}
                            >
                                {selectedNetworkId === net.id && (
                                    <div className="absolute top-0 left-0 w-full h-[1px] bg-black/20 animate-scanline"></div>
                                )}
                                {net.name}
                            </button>
                        ))}
                    </div>
                    <div className="mt-4 text-[9px] text-foreground/30 uppercase tracking-widest italic border-t border-foreground/10 pt-4">
                        SEL_STATUS: {selectedNetwork ? `CONNECTED_TO_${selectedNetwork.name}` : "AWAITING_SIGNAL..."}
                    </div>
                </TerminalCard>

                {/* Input Form */}
                <div className="space-y-6">
                    <TerminalCard header="TOPUP_PARAMETERS">
                        <form onSubmit={handlePurchase} className="space-y-5">
                            <TerminalInput
                                label="DESTINATION_NUMBER"
                                placeholder="080XXXXXXXX"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                            />

                            <TerminalInput
                                label="CREDIT_AMOUNT_(NGN)"
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />

                            <div className="pt-2">
                                <TerminalButton
                                    type="submit"
                                    disabled={submitting || !selectedNetworkId}
                                    className="w-full h-12"
                                >
                                    {submitting ? "encrypting_packet..." : "INITIATE_TRANSFER"}
                                </TerminalButton>
                            </div>
                        </form>
                    </TerminalCard>

                    {status && (
                        <div className={`p-4 border text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg ${status.type === "success"
                                ? "border-foreground bg-foreground/10 text-foreground animate-pulse"
                                : "border-red-500 bg-red-500/10 text-red-500"
                            }`}>
                            {status.type === "success" ? ">>_TRANSMISSION_COMPLETE: " : ">>_SYS_ERROR: "}
                            {status.message}
                        </div>
                    )}
                </div>
            </div>

            {/* Console Output Log */}
            <TerminalCard header="SUBSYSTEM_LOGS" className="opacity-50">
                <div className="space-y-1 text-[9px]">
                    <p className="text-foreground/40">[OK] Initializing airtime_topup_v1.0.4...</p>
                    <p className="text-foreground/40">[OK] Encapsulating network request packets...</p>
                    <p className="text-foreground/40">[OK] Connecting to carrier gateway node: EDGE_77</p>
                    {submitting && <p className="text-accent animate-pulse">[BUSY] Executing transaction handshake...</p>}
                    {status?.type === "success" && <p className="text-foreground">[OK] Transaction verified by carrier.</p>}
                </div>
            </TerminalCard>
        </div>
    );
}
