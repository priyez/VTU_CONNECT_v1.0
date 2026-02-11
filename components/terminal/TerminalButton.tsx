"use client";

import React from "react";

interface TerminalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "accent" | "outline";
    className?: string;
    italic?: boolean;
}

export default function TerminalButton({
    children,
    variant = "primary",
    className = "",
    italic = true,
    ...props
}: TerminalButtonProps) {
    const baseStyles = "px-6 py-3 font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50 font-mono";

    const variants = {
        primary: "bg-foreground text-black hover:bg-white shadow-[0_0_15px_rgba(0,255,65,0.2)]",
        accent: "bg-accent text-black hover:bg-white shadow-[0_0_15px_rgba(255,176,0,0.2)]",
        outline: "border border-foreground/30 text-foreground/70 hover:text-foreground hover:bg-foreground/5",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${italic ? "italic" : ""} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
