"use client";

import React, { useState, useEffect } from "react";
import TerminalCard from "@/components/terminal/TerminalCard";
import TerminalInput from "@/components/terminal/TerminalInput";
import TerminalButton from "@/components/terminal/TerminalButton";
import TerminalBadge from "@/components/terminal/TerminalBadge";
import { api } from "@/lib/api";
import networks from "@/data/network.json";

interface DataPlan {
    id: string;
    network: string;
    size: string;
    amount: number;
    duration: string;
}

export default function DataPage() {
    const [selectedNetworkId, setSelectedNetworkId] = useState<number | null>(null);
    const [plans, setPlans] = useState<DataPlan[]>([]);
    const [loadingPlans, setLoadingPlans] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isPorted, setIsPorted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const selectedNetwork = networks.find(n => n.id === selectedNetworkId);

    useEffect(() => {
        const fetchPlans = async () => {
            setLoadingPlans(true);
            try {
                const data = await api.get("/data/plans");
                setPlans(data.plans || []);
            } catch (err) {
                console.error("Failed to fetch plans:", err);
            } finally {
                setLoadingPlans(false);
            }
        };
        fetchPlans();
    }, []);

    const filteredPlans = plans.filter(p =>
        selectedNetwork ? p.network.toUpperCase() === selectedNetwork.name.toUpperCase() : true
    );

    const handlePurchase = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedNetworkId || !selectedPlanId || !phoneNumber) {
            setStatus({ type: "error", message: "MISSING_REQUIRED_PARAMETERS" });
            return;
        }

        setSubmitting(true);
        setStatus(null);

        try {
            await api.post("/data/purchase", {
                network_id: selectedNetworkId.toString(),
                mobile_number: phoneNumber,
                plan_id: selectedPlanId,
                Ported_number: isPorted,
            });
            setStatus({ type: "success", message: "DATA_INJECTION_SUCCESSFUL. TRANS_ID: [PENDING]" });
            // Reset form
            setPhoneNumber("");
            setSelectedPlanId(null);
        } catch (err: any) {
            setStatus({ type: "error", message: err.message || "OPERATION_FAILED. CHECK_LINK." });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto font-mono">
            <div className="flex items-center space-x-2 border-b border-foreground/20 pb-4">
                <span className="text-accent font-bold tracking-tighter">[CMD]</span>
                <h2 className="text-xl font-black uppercase tracking-widest italic">run data_injection.exe</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Step 1 & 2: Network & Form */}
                <div className="lg:col-span-1 space-y-6">
                    <TerminalCard header="NETWORK_SELECT">
                        <div className="grid grid-cols-2 gap-2">
                            {networks.map((net) => (
                                <button
                                    key={net.id}
                                    onClick={() => {
                                        setSelectedNetworkId(net.id);
                                        setSelectedPlanId(null);
                                    }}
                                    className={`p-3 border text-xs font-bold uppercase transition-all ${selectedNetworkId === net.id
                                            ? "bg-foreground text-black border-foreground"
                                            : "bg-black text-foreground/40 border-border-terminal hover:border-foreground/50 hover:text-foreground"
                                        }`}
                                >
                                    {net.name}
                                </button>
                            ))}
                        </div>
                    </TerminalCard>

                    <TerminalCard header="PARAMETER_INPUTS">
                        <form onSubmit={handlePurchase} className="space-y-4">
                            <TerminalInput
                                label="MOBILE_NUMBER"
                                placeholder="08123456789"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                            />

                            <div className="flex items-center space-x-3 p-2 border border-border-terminal bg-foreground/[0.02]">
                                <input
                                    type="checkbox"
                                    id="ported"
                                    className="w-4 h-4 accent-foreground"
                                    checked={isPorted}
                                    onChange={(e) => setIsPorted(e.target.checked)}
                                />
                                <label htmlFor="ported" className="text-[10px] uppercase font-bold text-foreground/60 cursor-pointer">
                                    PORTED_NUMBER_FLAG?
                                </label>
                            </div>

                            <TerminalButton
                                type="submit"
                                disabled={submitting || !selectedPlanId}
                                className="w-full"
                            >
                                {submitting ? "executing..." : "INITIATE_UP_LINK"}
                            </TerminalButton>
                        </form>
                    </TerminalCard>

                    {status && (
                        <div className={`p-4 border text-[10px] font-bold uppercase tracking-widest italic ${status.type === "success" ? "border-foreground bg-foreground/10 text-foreground" : "border-red-500 bg-red-500/10 text-red-500"
                            }`}>
                            [{status.type === "success" ? "SUCCESS" : "ERROR"}]: {status.message}
                        </div>
                    )}
                </div>

                {/* Step 3: Plan Selection */}
                <div className="lg:col-span-2">
                    <TerminalCard header="AVAILABLE_PACKETS" className="h-full">
                        {!selectedNetworkId ? (
                            <div className="flex flex-col items-center justify-center h-64 text-foreground/20 italic space-y-2">
                                <span className="text-2xl opacity-20">📡</span>
                                <p className="text-[10px] uppercase tracking-[0.3em]">-- awaiting_network_initialization --</p>
                            </div>
                        ) : loadingPlans ? (
                            <div className="flex flex-col items-center justify-center h-64 animate-pulse">
                                <p className="text-[10px] uppercase tracking-[0.5em] text-foreground/40 font-bold">Scanning_Frequencies...</p>
                            </div>
                        ) : filteredPlans.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-accent/50 italic">
                                <p className="text-[10px] uppercase tracking-[0.2em]">No_Plans_Found_For_{selectedNetwork?.name}</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {filteredPlans.map((plan) => (
                                    <div
                                        key={plan.id}
                                        onClick={() => setSelectedPlanId(plan.id)}
                                        className={`p-4 border cursor-pointer transition-all relative group ${selectedPlanId === plan.id
                                                ? "bg-foreground/10 border-foreground shadow-[inset_0_0_10px_rgba(0,255,65,0.2)]"
                                                : "bg-black border-border-terminal hover:border-foreground/30 hover:bg-foreground/[0.02]"
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className={`text-lg font-black ${selectedPlanId === plan.id ? "text-foreground" : "text-foreground/70"}`}>
                                                {plan.size}
                                            </h4>
                                            <TerminalBadge status={selectedPlanId === plan.id ? "success" : "info"}>
                                                ₦{plan.amount}
                                            </TerminalBadge>
                                        </div>
                                        <div className="flex justify-between text-[9px] uppercase tracking-widest font-bold">
                                            <span className="text-foreground/40 italic">{plan.duration}</span>
                                            <span className="text-accent">{plan.network}</span>
                                        </div>
                                        {selectedPlanId === plan.id && (
                                            <div className="absolute top-1 right-1">
                                                <div className="w-1.5 h-1.5 bg-foreground animate-ping"></div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-8 pt-4 border-t border-border-terminal flex justify-between items-center text-[9px] text-foreground/30 uppercase tracking-[0.2em]">
                            <span>Link_Strength: HIGH</span>
                            <span>Packets_Found: {filteredPlans.length}</span>
                            <span>Node: VTU_EDGE_S14</span>
                        </div>
                    </TerminalCard>
                </div>
            </div>
        </div>
    );
}
