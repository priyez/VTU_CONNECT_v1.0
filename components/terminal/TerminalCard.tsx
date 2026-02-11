"use client";

import React from "react";

interface TerminalCardProps {
    children: React.ReactNode;
    header?: string;
    className?: string;
    variant?: "solid" | "ghost" | "accent";
}

export default function TerminalCard({
    children,
    header,
    className = "",
    variant = "ghost",
}: TerminalCardProps) {
    const variants = {
        solid: "bg-foreground/5 border-2 border-foreground",
        ghost: "bg-black border border-border-terminal",
        accent: "bg-accent/5 border border-accent/30",
    };

    return (
        <div className={`relative overflow-hidden ${variants[variant]} ${className} font-mono`}>
            {header && (
                <div className="p-4 border-b border-border-terminal flex justify-between items-center bg-foreground/[0.02]">
                    <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-[0.3em] font-mono">[{header}]</h3>
                    <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-foreground/20"></div>
                        <div className="w-1.5 h-1.5 bg-foreground/10"></div>
                    </div>
                </div>
            )}
            <div className={header ? "p-6" : ""}>
                {children}
            </div>
        </div>
    );
}
