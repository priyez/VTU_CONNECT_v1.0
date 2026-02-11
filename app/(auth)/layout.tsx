"use client";

import React from "react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4 overflow-hidden relative">
            {/* Matrix background effect simulation */}
            <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
                <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--color-foreground)_0.5px,_transparent_1px)] bg-[size:24px_24px]"></div>
            </div>

            <div className="w-full max-w-md bg-black border-2 border-foreground rounded-none p-8 z-10 shadow-[0_0_15px_rgba(0,255,65,0.2)]">
                <div className="mb-8 text-left border-b border-foreground/30 pb-4">
                    <div className="flex items-center space-x-2 text-foreground font-bold text-xl">
                        <span className="animate-pulse">_</span>
                        <span>VTU_OS v1.0.4</span>
                    </div>
                    <p className="text-foreground/60 text-xs mt-1 uppercase tracking-widest">Secure Terminal Access Required</p>
                </div>
                {children}
            </div>

            {/* Bottom status bar */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between text-[10px] text-foreground/40 uppercase tracking-widest uppercase">
                <span>system.status: standby</span>
                <span>node: front-end-alpha</span>
                <span>sec_level: 4</span>
            </div>
        </div>
    );
}
