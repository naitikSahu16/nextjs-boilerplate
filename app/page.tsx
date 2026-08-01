"use client";
import { useState, useEffect, useRef } from "react";

const UPSTASH_ENDPOINT = "https://clean-sunbird-149824.upstash.io";
const UPSTASH_TOKEN = "gQAAAAAAAk1AAAIgcDFmOWYxNzUzNjkyMWQ0YzRiOTI1NGFkNmU1NmE0NjA4Nw";

interface Stats { totalSavings: number; cacheHitRate: number; tokensSaved: number; totalRequests: number; }

function useCountUp(target: number, active: boolean, duration = 1400): number {
  const [value, setValue] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    if (!active) { setValue(target); prev.current = target; return; }
    const s = prev.current, t0 = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      setValue(s + (target - s) * (1 - Math.pow(1 - p, 3)));
      p < 1 ? (raf = requestAnimationFrame(tick)) : (prev.current = target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return value;
}

function StatCard({ label, value, prefix = "", suffix = "", decimals = 0, active, icon }: {
  label: string; value: number; prefix?: string; suffix?: string; decimals?: number; active: boolean; icon: React.ReactNode;
}) {
  const v = useCountUp(value, active);
  const d = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString("en-US");
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 backdrop-blur-xl transition-all duration-300 hover:border-[#00e5b5]/30 hover:bg-white/[0.05] hover:shadow-[0_0_30px_rgba(0,229,181,0.07)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00e5b5]/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#00e5b5]/10 text-[#00e5b5]">{icon}</div>
      <div className="text-3xl font-bold tracking-tight text-white tabular-nums">{prefix}{d}{suffix}</div>
      <div className="mt-1.5 text-sm text-slate-400">{label}</div>
    </div>
  );
}

function StepCard({ step, title, desc, delay }: { step: string; title: string; desc: string; delay: number }) {
  return (
    <div className="step-card rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]" style={{ animationDelay: `${delay}ms` }}>
      <span className="text-xs font-bold tracking-widest text-[#00e5b5]/50">{step}</span>
      <h3 className="mt-2 text-base font-semibold text-white">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{desc}</p>
    </div>
  );
}

const particles = [
  { t:"12%",l:"5%",a:"orb-drift-1",d:"14s",dl:"0s" },{ t:"23%",l:"17%",a:"orb-drift-2",d:"17s",dl:"0.7s" },
  { t:"34%",l:"29%",a:"orb-drift-3",d:"20s",dl:"1.4s" },{ t:"45%",l:"41%",a:"orb-drift-1",d:"23s",dl:"2.1s" },
  { t:"56%",l:"53%",a:"orb-drift-2",d:"26s",dl:"2.8s" },{ t:"67%",l:"65%",a:"orb-drift-3",d:"29s",dl:"3.5s" },
  { t:"78%",l:"77%",a:"orb-drift-1",d:"32s",dl:"4.2s" },{ t:"89%",l:"89%",a:"orb-drift-2",d:"35s",dl:"4.9s" },
];

const icons = {
  dollar: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  bolt: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  download: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  pulse: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
};

export default function Dashboard() {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const [stats, setStats] = useState<Stats>({ totalSavings: 0, cacheHitRate: 0, tokensSaved: 0, totalRequests: 0 });

  const handleAnalyze = async () => {
    const key = apiKey.trim();
    if (!key) { setError("Please enter your TokenTrim API key."); return; }
    setLoading(true); setError(""); setVerified(false);
    try {
      const res = await fetch(`${UPSTASH_ENDPOINT}/get/user:${key}`, { headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` } });
      if (!res.ok) throw new Error("Network error — please try again.");
      const json = await res.json();
      if (!json.result) throw new Error("Invalid API key — no data found.");
      let user: { active: boolean; plan: string; saved_tokens: number };
      try { user = JSON.parse(json.result); } catch { throw new Error("Corrupted data."); }
      if (!user.active) throw new Error("This API key is inactive.");
      const st = user.saved_tokens || 0;
      setStats({ totalSavings: (st / 1000) * 0.015, cacheHitRate: st > 0 ? Math.min(72.4, 28 + st / 80) : 0, tokensSaved: st, totalRequests: Math.ceil(st / 45) });
      setVerified(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
    } finally { setLoading(false); }
  };

  const pruningSavings = ((stats.tokensSaved * 0.6) / 1000) * 0.015;
  const cacheSavings = ((stats.tokensSaved * 0.4) / 1000) * 0.015;

  return (
    <>
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.15) 1px,transparent 1px)", backgroundSize: "64px 64px" }} />
        <div className="absolute -top-48 -left-48 h-[650px] w-[650px] rounded-full opacity-[0.18] blur-[130px]" style={{ background: "radial-gradient(circle,#00e5b5 0%,transparent 70%)", animation: "orb-drift-1 22s ease-in-out infinite" }} />
        <div className="absolute -right-56 top-1/2 h-[520px] w-[520px] rounded-full opacity-[0.13] blur-[110px]" style={{ background: "radial-gradient(circle,#22c55e 0%,transparent 70%)", animation: "orb-drift-2 28s ease-in-out infinite" }} />
        <div className="absolute -bottom-44 left-1/3 h-[420px] w-[420px] rounded-full opacity-[0.09] blur-[110px]" style={{ background: "radial-gradient(circle,#00e5b5 0%,transparent 70%)", animation: "orb-drift-3 19s ease-in-out infinite" }} />
        {particles.map((p, i) => (
          <div key={i} className="absolute h-[2px] w-[2px] rounded-full bg-[#00e5b5]/30" style={{ top: p.t, left: p.l, animation: `${p.a} ${p.d} ease-in-out infinite`, animationDelay: p.dl }} />
        ))}
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#030712]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00e5b5]/15">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#00e5b5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-white">TokenTrim</span>
          </div>
          <div className="hidden items-center gap-8 text-sm text-slate-400 sm:flex">
            <a href="#how-it-works" className="transition-colors hover:text-white">How It Works</a>
            <a href="#dashboard" className="transition-colors hover:text-white">Dashboard</a>
          </div>
          <span className="hidden text-[11px] font-medium tracking-wide text-slate-600 sm:inline">EDGE DEPLOYED</span>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 pb-28">
        {/* Hero */}
        <section className="pt-24 pb-16 text-center">
          <div className="anim-fade-up mb-7 inline-flex items-center gap-2 rounded-full border border-[#00e5b5]/20 bg-[#00e5b5]/[0.06] px-
