"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import networksData from "@/data/network.json";
import discosData from "@/data/discos.json";

type TerminalStage =
    | "COMMAND"
    | "LOGIN_EMAIL" | "LOGIN_PASS"
    | "SIGNUP_USER" | "SIGNUP_EMAIL" | "SIGNUP_PASS"
    | "DATA_NET" | "DATA_PLAN" | "DATA_NUM"
    | "AIRTIME_NET" | "AIRTIME_AMT" | "AIRTIME_NUM"
    | "ELECT_DISCO" | "ELECT_TYPE" | "ELECT_MET" | "ELECT_AMT" | "ELECT_NUM";

interface TerminalLine {
    text: string;
    type: "input" | "output" | "error" | "success" | "warning";
}

interface DataPlan {
    id: string;
    network: string;
    size: string;
    amount: number;
    duration: string;
}

export default function TerminalPage() {
    const { user, login, refreshProfile } = useAuth();
    const router = useRouter();
    const [history, setHistory] = useState<TerminalLine[]>([
        { text: "VTU_CONNECT KERNEL v1.0.4-STABLE", type: "output" },
        { text: "ESTABLISHING SECURE ENCLAVE...", type: "output" },
        { text: "SYSTEM_ACCESS: GRANTED", type: "success" },
        { text: "TYPE 'HELP' FOR AVAILABLE COMMANDS", type: "warning" },
    ]);
    const [input, setInput] = useState("");
    const [stage, setStage] = useState<TerminalStage>("COMMAND");
    const [tempData, setTempData] = useState<any>({});
    const [loading, setLoading] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    const addLine = (text: string, type: TerminalLine["type"] = "output") => {
        setHistory((prev) => [...prev, { text, type }]);
    };

    const resetToCommand = () => {
        setStage("COMMAND");
        setTempData({});
        addLine("RETURNING_TO_IDLE_STATE...", "output");
    };

    const processCommand = async (val: string) => {
        const raw = val.trim();
        const cmd = raw.toUpperCase();

        // Don't log password in clear text if in password stage
        if (stage === "LOGIN_PASS" || stage === "SIGNUP_PASS") {
            addLine("> ********", "input");
        } else {
            addLine(`> ${raw}`, "input");
        }

        if (loading) return;

        if (cmd === "ABORT" || cmd === "CANCEL") {
            resetToCommand();
            return;
        }

        switch (stage) {
            case "COMMAND":
                await handleBaseCommand(cmd);
                break;
            case "LOGIN_EMAIL":
                setTempData({ ...tempData, email: raw });
                setStage("LOGIN_PASS");
                addLine("ENTER ACCESS_KEY:", "warning");
                break;
            case "LOGIN_PASS":
                executeLogin(raw);
                break;
            case "SIGNUP_USER":
                setTempData({ ...tempData, username: raw });
                setStage("SIGNUP_EMAIL");
                addLine("ENTER IDENT_USER_EMAIL:", "warning");
                break;
            case "SIGNUP_EMAIL":
                setTempData({ ...tempData, email: raw });
                setStage("SIGNUP_PASS");
                addLine("ENTER NEW_ACCESS_KEY:", "warning");
                break;
            case "SIGNUP_PASS":
                executeSignup(raw);
                break;
            case "DATA_NET":
                handleNetworkSelect(raw, "DATA");
                break;
            case "DATA_PLAN":
                handlePlanSelect(raw);
                break;
            case "DATA_NUM":
                executeDataPurchase(raw);
                break;
            case "AIRTIME_NET":
                handleNetworkSelect(raw, "AIRTIME");
                break;
            case "AIRTIME_AMT":
                setTempData({ ...tempData, amount: raw });
                setStage("AIRTIME_NUM");
                addLine("ENTER DESTINATION_PROTOCOL_HUB (PH_NUM):", "warning");
                break;
            case "AIRTIME_NUM":
                executeAirtimePurchase(raw);
                break;
            case "ELECT_DISCO":
                handleDiscoSelect(raw);
                break;
            case "ELECT_TYPE":
                const type = cmd === "1" ? "Prepaid" : cmd === "2" ? "Postpaid" : null;
                if (!type) {
                    addLine("INVALID_PROTOCOL. SELECT 1 (PREPAID) OR 2 (POSTPAID):", "error");
                } else {
                    setTempData({ ...tempData, meterType: type });
                    setStage("ELECT_MET");
                    addLine("ENTER METER_IDENTITY_NODE:", "warning");
                }
                break;
            case "ELECT_MET":
                setTempData({ ...tempData, meterNumber: raw });
                setStage("ELECT_AMT");
                addLine("ENTER ENERGY_CREDIT_UNITS (NGN):", "warning");
                break;
            case "ELECT_AMT":
                setTempData({ ...tempData, amount: raw });
                setStage("ELECT_NUM");
                addLine("ENTER ALERT_RECEPIENT_HUB (PH_NUM):", "warning");
                break;
            case "ELECT_NUM":
                executeElectricityPurchase(raw);
                break;
            default:
                setStage("COMMAND");
        }
    };

    const handleBaseCommand = async (cmd: string) => {
        switch (cmd) {
            case "HELP":
                addLine("VTU_OS CORE CMDS:", "output");
                addLine("  HELP      - DISPLAY SYS_CMDS", "output");
                addLine("  CLEAR     - FLUSH BUFFER", "output");
                addLine("  LOGIN     - AUTHENTICATE_USER", "output");
                addLine("  SIGNUP    - INITIALIZE_NEW_ID", "output");
                addLine("  BALANCE   - QUERY_CREDITS", "output");
                addLine("  DATA      - INJECT_DATA_PACKETS", "output");
                addLine("  AIRTIME   - ALLOCATE_VOICE", "output");
                addLine("  ELECT     - GRID_POWER_MOD", "output");
                addLine("  DASHBOARD - RET_GUI", "output");
                addLine("  EXIT      - KILL_PROCESS", "output");
                break;
            case "CLEAR":
                setHistory([]);
                break;
            case "LOGIN":
                setStage("LOGIN_EMAIL");
                addLine("INITIALIZING AUTH_SEQUENCE...", "warning");
                addLine("ENTER IDENT_USER_EMAIL:", "warning");
                break;
            case "SIGNUP":
                setStage("SIGNUP_USER");
                addLine("INITIALIZING REG_SEQUENCE...", "warning");
                addLine("ENTER IDENT_SYS_USERNAME:", "warning");
                break;
            case "BALANCE":
                if (!user) {
                    addLine("ERR: UNAUTHORIZED. RUN 'LOGIN' FIRST.", "error");
                    return;
                }
                addLine("QUERYING_WALLET_RESOURCES...", "output");
                try {
                    await refreshProfile();
                    addLine(`AUTH_USER: ${user.username}`, "output");
                    addLine(`CURRENT_BALANCE: ₦${user.walletBalance}`, "success");
                } catch {
                    addLine("SYNC_ERROR: LINK_FAILED", "error");
                }
                break;
            case "DATA":
                if (!user) {
                    addLine("ERR: UNAUTHORIZED. RUN 'LOGIN' FIRST.", "error");
                    return;
                }
                setStage("DATA_NET");
                addLine("SELECT CARRIER_NODE:", "warning");
                networksData.forEach(n => addLine(`  ${n.id} - ${n.name}`, "output"));
                break;
            case "AIRTIME":
                if (!user) {
                    addLine("ERR: UNAUTHORIZED. RUN 'LOGIN' FIRST.", "error");
                    return;
                }
                setStage("AIRTIME_NET");
                addLine("SELECT CARRIER_NODE:", "warning");
                networksData.forEach(n => addLine(`  ${n.id} - ${n.name}`, "output"));
                break;
            case "ELECT":
                if (!user) {
                    addLine("ERR: UNAUTHORIZED. RUN 'LOGIN' FIRST.", "error");
                    return;
                }
                setStage("ELECT_DISCO");
                addLine("SELECT ENERGY_PROVIDER:", "warning");
                discosData.forEach(d => addLine(`  ${d.id} - ${d.name}`, "output"));
                break;
            case "DASHBOARD":
                router.push("/dashboard");
                break;
            case "EXIT":
                router.push("/");
                break;
            default:
                if (cmd) {
                    addLine(`ERR: CMD_NOT_RECOGNIZED: ${cmd}`, "error");
                    addLine("TYPE 'HELP' FOR MANUAL", "output");
                }
        }
    };

    // --- AUTH EXECUTORS ---
    const executeLogin = async (password: string) => {
        setLoading(true);
        addLine("AUTHENTICATING...", "output");
        try {
            const data = await api.post("/auth/login", { email: tempData.email, password });
            login(data.token, data.user, null);
            addLine("ACCESS_GRANTED. WELCOME_USER.", "success");
            resetToCommand();
        } catch (err: any) {
            addLine(`AUTH_FAILED: ${err.message}`, "error");
            resetToCommand();
        } finally {
            setLoading(false);
        }
    };

    const executeSignup = async (password: string) => {
        setLoading(true);
        addLine("REGISTERING_ID...", "output");
        try {
            await api.post("/auth/signup", { ...tempData, password });
            addLine("ID_CREATED_SUCCESSFULLY. RUN 'LOGIN' TO START.", "success");
            resetToCommand();
        } catch (err: any) {
            addLine(`REG_FAILED: ${err.message}`, "error");
            resetToCommand();
        } finally {
            setLoading(false);
        }
    };

    // --- SERVICE HANDLERS ---
    const handleNetworkSelect = (val: string, type: "DATA" | "AIRTIME") => {
        const net = networksData.find(n => n.id.toString() === val || n.name.toUpperCase() === val.toUpperCase());
        if (!net) {
            addLine("INVALID_CARRIER_NODE. SELECT FROM LIST:", "error");
            return;
        }
        setTempData({ ...tempData, networkId: net.id, networkName: net.name });
        if (type === "DATA") {
            setStage("DATA_PLAN");
            fetchAndShowDataPlans(net.name);
        } else {
            setStage("AIRTIME_AMT");
            addLine("ENTER CREDIT_AMOUNT_(NGN):", "warning");
        }
    };

    const fetchAndShowDataPlans = async (network: string) => {
        setLoading(true);
        addLine(`SCANNING_PACKETS_FOR_${network.toUpperCase()}...`, "output");
        try {
            const data = await api.get("/data/plans");
            const plans = (data.plans as DataPlan[]).filter(p => p.network.toUpperCase() === network.toUpperCase());
            if (plans.length === 0) {
                addLine("NO_PACKETS_AVAILABLE_FOR_THIS_NODE.", "error");
                resetToCommand();
                return;
            }
            addLine("SELECT DATA_PACKET_", "warning");
            plans.forEach((p, i) => addLine(`  ${i + 1} - ${p.size} [₦${p.amount}] (${p.duration})`, "output"));
            setTempData((prev: any) => ({ ...prev, fetchedPlans: plans }));
        } catch {
            addLine("SCAN_ERROR: FAILED_TO_FETCH_PACKETS", "error");
            resetToCommand();
        } finally {
            setLoading(false);
        }
    };

    const handlePlanSelect = (val: string) => {
        const idx = parseInt(val) - 1;
        const plan = tempData.fetchedPlans?.[idx];
        if (!plan) {
            addLine("INVALID_PACKET_INDEX. SELECT FROM LIST:", "error");
            return;
        }
        setTempData({ ...tempData, planId: plan.id, planSize: plan.size });
        setStage("DATA_NUM");
        addLine("ENTER DESTINATION_PROTOCOL_HUB (PH_NUM):", "warning");
    };

    const handleDiscoSelect = (val: string) => {
        const disco = discosData.find(d => d.id.toString() === val || d.name.toUpperCase() === val.toUpperCase());
        if (!disco) {
            addLine("INVALID_PROVIDER_HUB. SELECT FROM LIST:", "error");
            return;
        }
        setTempData({ ...tempData, discoName: disco.name });
        setStage("ELECT_TYPE");
        addLine("SELECT METER_PROTOCOL:", "warning");
        addLine("  1 - PREPAID", "output");
        addLine("  2 - POSTPAID", "output");
    };

    // --- PURCHASE EXECUTORS ---
    const executeDataPurchase = async (num: string) => {
        setLoading(true);
        addLine("INITIATING_INJECTION...", "output");
        try {
            await api.post("/data/purchase", {
                network_id: tempData.networkId.toString(),
                mobile_number: num,
                plan_id: tempData.planId,
                Ported_number: false
            });
            addLine("INJECTION_SUCCESSFUL. DATA_PACKET_DELIVERED.", "success");
            resetToCommand();
        } catch (err: any) {
            addLine(`INJECTION_FAILED: ${err.message}`, "error");
            resetToCommand();
        } finally {
            setLoading(false);
        }
    };

    const executeAirtimePurchase = async (num: string) => {
        setLoading(true);
        addLine("ALLOCATING_CIRCUIT...", "output");
        try {
            await api.post("/airtime", {
                network_id: tempData.networkName,
                phone: num,
                amount: Number(tempData.amount)
            });
            addLine("ALLOCATION_SUCCESSFUL. VOICE_LINK_ACTIVE.", "success");
            resetToCommand();
        } catch (err: any) {
            addLine(`ALLOCATION_FAILED: ${err.message}`, "error");
            resetToCommand();
        } finally {
            setLoading(false);
        }
    };

    const executeElectricityPurchase = async (num: string) => {
        setLoading(true);
        addLine("INJECTING_POWER_UNITS...", "output");
        try {
            await api.post("/electricity/buy", {
                disco_name: tempData.discoName,
                amount: Number(tempData.amount),
                meter_number: tempData.meterNumber,
                MeterType: tempData.meterType,
                mobile_number: num
            });
            addLine("POWER_INJECTION_SUCCESSFUL. GRID_STABLE.", "success");
            resetToCommand();
        } catch (err: any) {
            addLine(`GRID_REJECTED: ${err.message}`, "error");
            resetToCommand();
        } finally {
            setLoading(false);
        }
    };

    const isPasswordInput = stage === "LOGIN_PASS" || stage === "SIGNUP_PASS";

    return (
        <div
            className="h-[100dvh] bg-black text-foreground font-mono p-4 md:p-8 flex flex-col relative overflow-hidden overscroll-behavior-none"
            onClick={() => inputRef.current?.focus()}
        >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-foreground/20 pb-4 mb-4 z-10">
                <div className="flex items-center space-x-2">
                    <span className="text-accent animate-pulse font-bold">#</span>
                    <h1 className="text-sm font-bold tracking-widest uppercase">VTU_CORE_TERMINAL</h1>
                </div>
                <div className="text-[10px] text-foreground/40 uppercase tracking-widest hidden md:block">
                    User: {user?.username || "GUEST"} | Stage: {stage} | {new Date().toLocaleTimeString()}
                </div>
                <div className="flex space-x-2">
                    <Link href="/dashboard" className="text-[10px] border border-foreground/30 px-3 py-1 hover:bg-foreground hover:text-black transition-all uppercase">
                        [ GUI ]
                    </Link>
                    <button onClick={resetToCommand} className="text-[10px] border border-red-500/30 px-3 py-1 text-red-500/60 hover:bg-red-500 hover:text-black transition-all uppercase">
                        [ ABORT ]
                    </button>
                </div>
            </div>

            {/* Terminal Output */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto space-y-1 mb-4 custom-terminal-scroll z-10"
            >
                {history.map((line, i) => (
                    <div key={i} className={`text-sm leading-relaxed break-all ${line.type === "input" ? "pl-2 border-l-2 border-accent/20" : ""}`}>
                        <span className={`
                            ${line.type === "input" ? "text-foreground font-bold" : ""}
                            ${line.type === "output" ? "text-foreground/70" : ""}
                            ${line.type === "success" ? "text-accent" : ""}
                            ${line.type === "error" ? "text-red-500" : ""}
                            ${line.type === "warning" ? "text-yellow-500" : ""}
                        `}>
                            {line.text}
                        </span>
                    </div>
                ))}
                {loading && (
                    <div className="text-xs text-accent animate-pulse">EXECUTING_OPERATION_PLEASE_WAIT...</div>
                )}
            </div>

            {/* Input Line */}
            <form onSubmit={(e) => { e.preventDefault(); if (input.trim() && !loading) { processCommand(input); setInput(""); } }} className="flex items-center space-x-3 z-10">
                <span className="text-accent font-bold animate-pulse">{">"}</span>
                <input
                    ref={inputRef}
                    autoFocus
                    type={isPasswordInput ? "password" : "text"}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onFocus={() => {
                        if (scrollRef.current) {
                            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                        }
                    }}
                    className="flex-1 bg-transparent border-none outline-none text-foreground text-base font-mono placeholder:text-foreground/20"
                    placeholder={loading ? "LOCKED" : "ENTER_VAL..."}
                    disabled={loading}
                    spellCheck={false}
                    autoComplete="off"
                />
            </form>

            {/* Matrix-like Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50">
                <div className="w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]"></div>
            </div>
            {/* Scanline Animation */}
            <div className="fixed top-0 left-0 w-full h-1 bg-white/5 pointer-events-none animate-scanline z-[60]"></div>
        </div>
    );
}
