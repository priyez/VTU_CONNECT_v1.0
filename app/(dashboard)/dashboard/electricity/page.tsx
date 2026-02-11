"use client";

import React, { useState } from "react";
import TerminalCard from "@/components/terminal/TerminalCard";
import TerminalInput from "@/components/terminal/TerminalInput";
import TerminalButton from "@/components/terminal/TerminalButton";
import { api } from "@/lib/api";
import discos from "@/data/discos.json";

export default function ElectricityPage() {
    const [selectedDiscoId, setSelectedDiscoId] = useState<number | null>(null);
    const [meterType, setMeterType] = useState<"Prepaid" | "Postpaid">("Prepaid");
    const [meterNumber, setMeterNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const selectedDisco = discos.find(d => d.id === selectedDiscoId);

    const handleBillPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDiscoId || !meterNumber || !amount || !phoneNumber) {
            setStatus({ type: "error", message: "MISSING_REQUIRED_PARAMETERS" });
            return;
        }

        setSubmitting(true);
        setStatus(null);

        try {
            await api.post("/electricity/buy", {
                disco_name: selectedDisco?.name,
                amount: Number(amount),
                meter_number: meterNumber,
                MeterType: meterType,
                mobile_number: phoneNumber,
            });
            setStatus({ type: "success", message: "GRID_POWER_INJECTION_SUCCESSFUL. TOKEN: [PENDING]" });
            // Reset form
            setMeterNumber("");
            setAmount("");
            setPhoneNumber("");
        } catch (err: any) {
            setStatus({ type: "error", message: err.message || "OPERATION_FAILED. GRID_OFFLINE." });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto font-mono">
            <div className="flex items-center space-x-2 border-b border-foreground/20 pb-4">
                <span className="text-accent font-bold tracking-tighter">[CMD]</span>
                <h2 className="text-xl font-black uppercase tracking-widest italic">run grid_recharge.sh</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Disco Selection */}
                <div className="lg:col-span-1 space-y-6">
                    <TerminalCard header="ENERGY_DISCOS">
                        <div className="grid grid-cols-1 gap-2">
                            {discos.map((disco) => (
                                <button
                                    key={disco.id}
                                    onClick={() => setSelectedDiscoId(disco.id)}
                                    className={`px-4 py-3 border text-[10px] font-bold uppercase transition-all text-left flex justify-between items-center ${selectedDiscoId === disco.id
                                        ? "bg-foreground text-black border-foreground shadow-[inset_0_0_10px_rgba(0,0,0,0.2)]"
                                        : "bg-black text-foreground/50 border-border-terminal hover:border-foreground/30 hover:text-foreground hover:bg-foreground/5"
                                        }`}
                                >
                                    <span>{disco.name}</span>
                                    {selectedDiscoId === disco.id && <span className="text-[8px] animate-pulse">●_CONNECTED</span>}
                                </button>
                            ))}
                        </div>
                    </TerminalCard>
                </div>

                {/* Form Inputs */}
                <div className="lg:col-span-2 space-y-6">
                    <TerminalCard header="GRID_HANDSHAKE_PARAMETERS">
                        <form onSubmit={handleBillPayment} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex flex-col space-y-2">
                                        <label className="text-[10px] uppercase font-bold text-foreground/40 tracking-widest">METER_PROTOCOL</label>
                                        <div className="flex border border-border-terminal">
                                            <button
                                                type="button"
                                                onClick={() => setMeterType("Prepaid")}
                                                className={`flex-1 py-3 text-[10px] font-black uppercase transition-all ${meterType === "Prepaid" ? "bg-foreground text-black font-black" : "bg-black text-foreground/30 hover:text-foreground/60"
                                                    }`}
                                            >
                                                PREPAID
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setMeterType("Postpaid")}
                                                className={`flex-1 py-3 text-[10px] font-black uppercase transition-all ${meterType === "Postpaid" ? "bg-foreground text-black font-black" : "bg-black text-foreground/30 hover:text-foreground/60"
                                                    }`}
                                            >
                                                POSTPAID
                                            </button>
                                        </div>
                                    </div>

                                    <TerminalInput
                                        label="METER_IDENTITY_NUMBER"
                                        placeholder="ENTER METER ID"
                                        value={meterNumber}
                                        onChange={(e) => setMeterNumber(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-4">
                                    <TerminalInput
                                        label="ENERGY_CREDIT_(NGN)"
                                        type="number"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                    />
                                    <TerminalInput
                                        label="ALERTS_RECIPIENT_NUMBER"
                                        placeholder="080XXXXXXXX"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border-terminal">
                                <TerminalButton
                                    type="submit"
                                    disabled={submitting || !selectedDiscoId}
                                    className="w-full h-14 text-sm"
                                >
                                    {submitting ? "establishing_power_link..." : "INJECT_POWER_UNITS"}
                                </TerminalButton>
                            </div>
                        </form>
                    </TerminalCard>

                    {status && (
                        <div className={`p-4 border text-[10px] font-bold uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(0,255,65,0.1)] flex items-center space-x-3 ${status.type === "success"
                            ? "border-foreground bg-foreground/10 text-foreground"
                            : "border-red-500 bg-red-500/10 text-red-500"
                            }`}>
                            <div className={`w-2 h-2 rounded-full ${status.type === "success" ? "bg-foreground animate-ping" : "bg-red-500 animate-pulse"}`}></div>
                            <span>{status.message}</span>
                        </div>
                    )}

                    <TerminalCard header="SUBSYSTEM_MONITOR" className="opacity-40">
                        <div className="space-y-1 text-[8px] uppercase tracking-tighter">
                            <p className="text-foreground/40 font-bold">[SYS] Monitoring grid frequency: 50.02Hz</p>
                            <p className="text-foreground/40 font-bold">[SYS] Handshake with {selectedDisco?.id || "N/A"}_DISCO established.</p>
                            <p className="text-foreground/40 font-bold">[SYS] Validating meter node: {meterNumber || "WAITING..."}</p>
                            {submitting && <p className="text-accent animate-pulse font-bold">[BUSY] Tokenizing energy packets for delivery...</p>}
                        </div>
                    </TerminalCard>
                </div>
            </div>
        </div>
    );
}
