"use client";

import { useState, useEffect, useRef } from "react";

/* ────────────────────────────────────────────
   Upstash Configuration
   ──────────────────────────────────────────── */
const UPSTASH_ENDPOINT = "https://clean-sunbird-149824.upstash.io";
const UPSTASH_TOKEN =
  "gQAAAAAAAk1AAAIgcDFmOWYxNzUzNjkyMWQ0YzRiOTI1NGFkNmU1NmE0NjA4Nw";

/* ────────────────────────────────────────────
   Types
   ──────────────────────────────────────────── */
interface Stats {
  totalSavings: number;
  cacheHitRate: number;
  tokensSaved: number;
  totalRequests: number;
}

/* ────────────────────────────────────────────
   Custom Hook: Smooth Count-Up Animation
   ──────────────────────────────────────────── */
function useCountUp(target: number, active: boolean, duration = 1400): number {
  const [value, setValue] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    if (!active) {
      setValue(target);
      prevRef.current = target;
      return;
    }

    const start = prevRef.current;
    const t0 = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setValue(start + (target - start) * ease);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        prevRef.current = target;
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);

  return value;
}

/* ────────────────────────────────────────────
   Stat Card Component
   ──────────────────────────────────────────── */
function StatCard({
  label,
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  active,
  icon,
}: {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  active: boolean;
  icon: React.ReactNode;
}) {
  const animated = useCountUp(value, active);
  const display =
    decimals > 0
      ? animated.toFixed(decimals)
      : Math.round(animated).toLocaleString("en-US");

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 backdrop-blur-xl transition-all duration-300 hover:border-[#00e5b5]/30 hover:bg-white/[0.05] hover:shadow-[0_0_30px_rgba(0,229,181,0.07)]">
      {/* Top accent line on hover */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00e5b5]/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Icon */}
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#00e5b5]/10 text-[#00e5b5]">
        {icon}
      </div>

      {/* Value */}
      <div className="text-3xl font-bold tracking-tight text-white tabular-nums">
        {prefix}
        {display}
        {suffix}
      </div>

      {/* Label */}
      <div className="mt-1.5 text-sm text-slate-400">{label}</div>
    </div>
  );
}

/* ────────────────────────────────────────────
   How-It-Works Step Card
   ──────────────────────────────────────────── */
function StepCard({
  step,
  title,
  desc,
  delay,
}: {
  step: string;
  title: string;
  desc: string;
  delay: number;
}) {
  return (
    <div
      className="step-card rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="text-xs font-bold tracking-widest text-[#00e5b5]/50">
        {step}
      </span>
      <h3 className="mt-2 text-base font-semibold text-white">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{desc}</p>
    </div>
  );
}

/* ────────────────────────────────────────────
   Main Page Component
   ──────────────────────────────────────────── */
export default function Dashboard() {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalSavings: 0,
    cacheHitRate: 0,
    tokensSaved: 0,
    totalRequests: 0,
  });

  /* ── Fetch user data from Upstash ── */
  const handleAnalyze = async () => {
    const key = apiKey.trim();
    if (!key) {
      setError("Please enter your TokenTrim API key.");
      return;
    }

    setLoading(true);
    setError("");
    setVerified(false);

    try {
      const res = await fetch(`${UPSTASH_ENDPOINT}/get/user:${key}`, {
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      });

      if (!res.ok) throw new Error("Network error — please try again.");

      const json = await res.json();

      if (!json.result) {
        throw new Error("Invalid API key — no data found for this key.");
      }

      let user: { active: boolean; plan: string; saved_tokens: number };
      try {
        user = JSON.parse(json.result);
      } catch {
        throw new Error("Corrupted data — please contact support.");
      }

      if (!user.active) {
        throw new Error("This API key is currently inactive.");
      }

      const st = user.saved_tokens || 0;

      setStats({
        totalSavings: (st / 1000) * 0.015,
        cacheHitRate: st > 0 ? Math.min(72.4, 28 + st / 80) : 0,
        tokensSaved: st,
        totalRequests: Math.ceil(st / 45),
      });
      setVerified(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAnalyze();
  };

  /* ── Derived breakdown values ── */
  const pruningSavings = ((stats.tokensSaved * 0.6) / 1000) * 0.015;
  const cacheSavings = ((stats.tokensSaved * 0.4) / 1000) * 0.015;

  return (
    <>
      {/* ── Injected keyframe animations ── */}
      <style>{`
        @keyframes orb-drift-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -60px) scale(1.06); }
          66% { transform: translate(-25px, 25px) scale(0.94); }
        }
        @keyframes orb-drift-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-50px, 35px) scale(0.93); }
          66% { transform: translate(30px, -40px) scale(1.08); }
        }
        @keyframes orb-drift-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(25px, 45px) scale(1.04); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-up-breakdown {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-fade-up {
          opacity: 0;
          animation: fade-up 0.7s ease-out forwards;
        }
        .step-card {
          opacity: 0;
          animation: fade-up 0.6s ease-out forwards;
        }
        .breakdown-enter {
          animation: fade-up-breakdown 0.5s ease-out forwards;
        }
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .skeleton-shimmer {
          background: linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.04) 50%, transparent 75%);
          background-size: 200% 100%;
          animation: shimmer 1.8s ease-in-out infinite;
        }
      `}</style>

      {/* ══════════════════════════════════════
          BACKGROUND EFFECTS
          ══════════════════════════════════════ */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        {/* Cyan orb — top-left */}
        <div
          className="absolute -top-48 -left-48 h-[650px] w-[650px] rounded-full opacity-[0.18] blur-[130px]"
          style={{
            background:
              "radial-gradient(circle, #00e5b5 0%, transparent 70%)",
            animation: "orb-drift-1 22s ease-in-out infinite",
          }}
        />

        {/* Green orb — right */}
        <div
          className="absolute -right-56 top-1/2 h-[520px] w-[520px] rounded-full opacity-[0.13] blur-[110px]"
          style={{
            background:
              "radial-gradient(circle, #22c55e 0%, transparent 70%)",
            animation: "orb-drift-2 28s ease-in-out infinite",
          }}
        />

        {/* Cyan orb — bottom */}
        <div
          className="absolute -bottom-44 left-1/3 h-[420px] w-[420px] rounded-full opacity-[0.09] blur-[110px]"
          style={{
            background:
              "radial-gradient(circle, #00e5b5 0%, transparent 70%)",
            animation: "orb-drift-3 19s ease-in-out infinite",
          }}
        />

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute h-[2px] w-[2px] rounded-full bg-[#00e5b5]/30"
            style={{
              top: `${12 + i * 11}%`,
              left: `${5 + i * 12}%`,
              animation: `orb-drift-${(i % 3) + 1} ${14 + i * 3}s ease-in-out infinite`,
              animationDelay: `${i * 0.7}s`,
            }}
          />
        ))}
      </div>

      {/* ══════════════════════════════════════
          NAVIGATION
          ══════════════════════════════════════ */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#030712]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00e5b5]/15">
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#00e5b5"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="4 17 10 11 4 5" />
                <line x1="12" y1="19" x2="20" y2="19" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              TokenTrim
            </span>
          </div>

          {/* Links */}
          <div className="hidden items-center gap-8 text-sm text-slate-400 sm:flex">
            <a
              href="#how-it-works"
              className="transition-colors duration-200 hover:text-white"
            >
              How It Works
            </a>
            <a
              href="#dashboard"
              className="transition-colors duration-200 hover:text-white"
            >
              Dashboard
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-200 hover:text-white"
            >
              Docs
            </a>
          </div>

          {/* Badge */}
          <span className="hidden text-[11px] font-medium tracking-wide text-slate-600 sm:inline">
            EDGE DEPLOYED
          </span>
        </div>
      </nav>

      {/* ══════════════════════════════════════
          MAIN CONTENT
          ══════════════════════════════════════ */}
      <main className="mx-auto max-w-6xl px-6 pb-28">
        {/* ─── Hero Section ─── */}
        <section className="pt-24 pb-16 text-center">
          {/* Live badge */}
          <div
            className="anim-fade-up mb-7 inline-flex items-center gap-2 rounded-full border border-[#00e5b5]/20 bg-[#00e5b5]/[0.06] px-4 py-1.5 text-xs font-medium text-[#00e5b5]"
            style={{ animationDelay: "0ms" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00e5b5] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00e5b5]" />
            </span>
            Live on Cloudflare Edge — Zero Cold Starts
          </div>

          {/* Headline */}
          <h1
            className="anim-fade-up text-5xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "120ms" }}
          >
            Cut Your OpenAI Bills
            <br />
            <span className="bg-gradient-to-r from-[#00e5b5] via-[#34d399] to-[#22c55e] bg-clip-text text-transparent">
              by 50%
            </span>
          </h1>

          {/* Sub-headline */}
          <p
            className="anim-fade-up mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400"
            style={{ animationDelay: "240ms" }}
          >
            TokenTrim sits between your AI agents and OpenAI, silently pruning
            redundant context and caching semantic duplicates — saving tokens on
            every single request.
          </p>

          {/* CTA buttons */}
          <div
            className="anim-fade-up mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
            style={{ animationDelay: "360ms" }}
          >
            <a
              href="#dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-[#00e5b5] px-7 py-3.5 text-sm font-semibold text-[#030712] transition-all duration-200 hover:bg-[#00d4a7] hover:shadow-[0_0_28px_rgba(0,229,181,0.3)] active:scale-[0.97]"
            >
              Analyze My Savings
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <polyline points="19 12 12 19 5 12" />
              </svg>
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-7 py-3.5 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.04] active:scale-[0.97]"
            >
              See How It Works
            </a>
          </div>
        </section>

        {/* ─── How It Works ─── */}
        <section id="how-it-works" className="mb-20 scroll-mt-24">
          <div className="grid gap-4 sm:grid-cols-3">
            <StepCard
              step="01"
              title="Context Pruning"
              desc="Strips redundant conversation history, keeping only the system prompt and the latest user message."
              delay={480}
            />
            <StepCard
              step="02"
              title="Semantic Cache"
              desc="SHA-256 hashes every pruned payload. Identical requests return cached responses in milliseconds."
              delay={600}
            />
            <StepCard
              step="03"
              title="Transparent Proxy"
              desc="Streams responses from OpenAI with zero added latency. Your agents continue working unchanged."
              delay={720}
            />
          </div>
        </section>

        {/* ─── Dashboard Section ─── */}
        <section id="dashboard" className="scroll-mt-24">
          {/* Section heading */}
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Your Savings Dashboard
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Enter your TokenTrim API key to unlock real-time analytics.
            </p>
          </div>

          {/* ── API Key Input Panel ── */}
          <div className="mx-auto mb-12 max-w-xl">
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 backdrop-blur-xl transition-all duration-300 focus-within:border-[#00e5b5]/20 focus-within:shadow-[0_0_24px_rgba(0,229,181,0.04)]">
              <label
                htmlFor="api-key"
                className="mb-2.5 block text-sm font-medium text-slate-300"
              >
                TokenTrim API Key
              </label>
              <div className="flex gap-3">
                <input
                  id="api-key"
                  type="text"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="tt_founder_999"
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    if (error) setError("");
                  }}
                  onKeyDown={handleKeyDown}
                  className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-all duration-200 focus:border-[#00e5b5]/40 focus:ring-1 focus:ring-[#00e5b5]/20"
                />
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#00e5b5] px-5 py-3 text-sm font-semibold text-[#030712] transition-all duration-200 hover:bg-[#00d4a7] hover:shadow-[0_0_20px_rgba(0,229,181,0.25)] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Analyzing...
                    </>
                  ) : (
                    "Analyze My Savings"
                  )}
                </button>
              </div>

              {/* Feedback messages */}
              {error && (
                <p className="mt-3 flex items-center gap-1.5 text-sm text-red-400">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                  {error}
                </p>
              )}
              {verified && !error && (
                <p className="mt-3 flex items-center gap-1.5 text-sm text-[#00e5b5]">
                  <svg
                    width="14"
                  
