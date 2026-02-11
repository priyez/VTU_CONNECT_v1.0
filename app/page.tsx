import Link from "next/link";
import TerminalButton from "@/components/terminal/TerminalButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-foreground font-mono flex flex-col relative overflow-hidden">
      {/* Background Grid Hack */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="w-full h-full bg-[linear-gradient(to_right,#00FF41_1px,transparent_1px),linear-gradient(to_bottom,#00FF41_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <header className="px-6 py-8 flex justify-between items-center max-w-7xl mx-auto w-full z-10">
        <div className="flex items-center space-x-2">
          <span className="text-accent animate-pulse font-bold">#</span>
          <h1 className="text-sm lg:text-xl font-bold tracking-tighter uppercase italic">VTU_CONNECT_v1.0</h1>
        </div>
        <div className="space-x-6 flex flex-col lg:flex-row text-xs uppercase tracking-[0.2em] font-bold">
          <Link href="/login" className="text-foreground/60 hover:text-foreground transition-colors p-2 hover:bg-foreground/5">[ LOGIN ]</Link>
          <Link href="/signup" className="text-accent hover:text-white transition-colors underline underline-offset-4 p-2 hover:bg-accent/5">[ INITIALIZE ]</Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto z-10 relative">
        {/* Terminal Header Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-foreground/50 to-transparent mb-12"></div>

        <div className="mb-8 space-y-2">
          <p className="text-[10px] text-accent tracking-[0.5em] uppercase font-bold animate-pulse">Establishing secure link...</p>
          <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter leading-none uppercase italic">
            DIGITAL_RECHARGE <br />
            <span className="text-foreground/40 font-light tracking-widest text-3xl md:text-5xl border-y border-foreground/20 py-2 inline-block my-4">SIMPLIFIED.SYS</span>
          </h2>
        </div>

        <p className="text-sm md:text-base text-foreground/60 mb-12 max-w-2xl leading-relaxed uppercase tracking-wider">
          The ultimate terminal interface for mobile data, voice (airtime), and electricity tokens.
          High-speed transaction kernels. Zero-latency delivery.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto items-center">
          <Link href="/signup">
            <TerminalButton className="shadow-[0_0_20px_rgba(0,255,65,0.3)] min-w-[240px]">
              GENERATE_ACCOUNT()
            </TerminalButton>
          </Link>
          <Link href="/terminal">
            <TerminalButton variant="outline" className="italic min-w-[240px]">
              RUN_TERMINAL
            </TerminalButton>
          </Link>
        </div>

        {/* Console stats decoration */}
        <div className="mt-20 flex space-x-8 text-[9px] text-foreground/30 uppercase tracking-[0.3em] font-bold">
          <span>{">"} UPTIME: 99.98%</span>
          <span>{">"} NODES: 2,451</span>
          <span>{">"} SEC: AES-256</span>
        </div>
      </main>

      <footer className="py-8 border-t border-foreground/10 text-center text-foreground/30 text-[9px] uppercase tracking-[0.5em] z-10">
        VTU_OS // KERNEL_RELEASE_2026 // NO_LIMITS
      </footer>
    </div>
  );
}
