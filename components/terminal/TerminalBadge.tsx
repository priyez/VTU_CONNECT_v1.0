"use client";

import React from "react";

interface TerminalBadgeProps {
    children: React.ReactNode;
    status?: "success" | "warning" | "error" | "info";
    className?: string;
}

export default function TerminalBadge({
    children,
    status = "info",
    className = "",
}: TerminalBadgeProps) {
    const statuses = {
        success: "border-foreground/40 text-foreground/60",
        warning: "border-accent/40 text-accent/60",
        error: "border-red-500/40 text-red-500/60",
        info: "border-blue-500/40 text-blue-500/60",
    };

    return (
        <span className={`px-2 py-0.5 border text-[9px] font-bold uppercase tracking-tighter font-mono ${statuses[status]} ${className}`}>
            {children}
        </span>
    );
}
