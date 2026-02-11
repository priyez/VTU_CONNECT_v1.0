"use client";

import React from "react";

interface TerminalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    prompt?: string;
}

export default function TerminalInput({
    label,
    prompt = ">",
    className = "",
    ...props
}: TerminalInputProps) {
    return (
        <div>
            <label className="block text-[10px] font-bold text-foreground/70 uppercase mb-2 tracking-widest font-mono">
                [{label}]
            </label>
            <div className="relative">
                <span className="absolute left-3 top-3 text-foreground font-bold font-mono">{prompt}</span>
                <input
                    {...props}
                    className={`w-full pl-8 pr-4 py-3 bg-black border border-foreground/30 text-foreground focus:border-foreground outline-none transition-all placeholder:text-foreground/20 font-mono text-sm ${className}`}
                />
            </div>
        </div>
    );
}
