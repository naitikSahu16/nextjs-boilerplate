"use client";

import { useState, useEffect, FormEvent } from "react";

interface Stats {
  active: boolean;
  plan: string;
  savedTokens: number;
  totalSavingsUsd: number;
  totalRequests: number;
  cacheHitRate: number | null;
}

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});
const compact = new Intl.NumberFormat("en-US", { notation: "compact" });
const int = new Intl.NumberFormat("en-US");

/* ---------------------------------- icons --------------------------------- */

const IconDollar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M12 2v20M17 6.5c0-1.9-2.2-3-5-3s-5 1.3-5 3 2.2 2.7 5 3 5 1.1 5 3-2.2 3-5 3-5-1.1-5-3"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconBolt = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconBarChart = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M5 20V10M12 20V4M19 20v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconActivity = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M3 12h4l2 8 4-16 2 8h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconShield = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="M12 2 4 5v6c0 5 3.4 8.7 8 11 4.6-2.3 8-6 8-11V5l-8-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);
const IconGlobe = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <path d="M3 12h18M12 3c2.5 2.6 4 6 4 9s-1.5 6.4-4 9c-2.5-2.6-4-6-4-9s1.5-6.4 4-9Z" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);
const IconKey = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="8" cy="15" r="4" stroke="currentColor" strokeWidth="1.8" />
    <path d="M11 12l9-9M16 3l3 3M13 6l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
const IconPlay = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 4v16l14-8L6 4Z" />
  </svg>
);
const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconLock = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M8 10V7a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

/* ---------------------------------- page ---------------------------------- */

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [apiUp, setApiUp] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/health")
      .then((r) => setApiUp(r.ok))
      .catch(() => setApiUp(false));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!apiKey.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/verify-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setStats(null);
      } else {
        setStats(data);
      }
    } catch {
      setError("Network error — try again.");
      setStats(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-base bg-grid">
      <TopNav apiUp={apiUp} />
      <Hero />
      <HowItWorks />
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <StatsRow stats={stats} />
        <DeveloperPanel
          apiKey={apiKey}
          setApiKey={setApiKey}
          loading={loading}
          error={error}
          verified={stats !== null}
          onSubmit={handleSubmit}
        />
        <DataPanels stats={stats} />
        <TrustRow />
      </section>
      <Footer />
    </main>
  );
}

/* --------------------------------- top nav --------------------------------- */

function TopNav({ apiUp }: { apiUp: boolean | null }) {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-7">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-cyan/10 text-cyan">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M4 12h9M13 12l-3.5-3.5M13 12l-3.5 3.5M17 6v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="font-display text-lg font-medium tracking-tight">
          Token<span className="text-cyan">Trim</span>
        </span>
      </div>
      <nav className="flex items-center gap-6 text-sm text-white/60">
        <a href="#how-it-works" className="hidden transition hover:text-white sm:inline">
          Docs
        </a>
        <span className="flex items-center gap-1.5 text-xs text-white/50">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              apiUp === null ? "bg-white/30" : apiUp ? "bg-signal animate-pulse" : "bg-red-400"
            }`}
          />
          {apiUp === null ? "Checking…" : apiUp ? "API Status: Operational" : "API Status: Unreachable"}
        </span>
      </nav>
    </header>
  );
}

/* ----------------------------------- hero ---------------------------------- */

function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl gap-16 px-6 pb-20 pt-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
      <div className="animate-fade-up">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-widest text-cyan">
          Edge-Deployed Semantic Cache
          <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse" />
        </span>
        <h1 className="mt-6 font-display text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl">
          Cut your OpenAI bills
          <br />
          by <span className="text-cyan text-glow">50%.</span>
        </h1>
        <p className="mt-6 max-w-md text-base leading-relaxed text-white/60">
          Zero added latency. Real savings. Built for AI agents, deployed at
          the edge — TokenTrim prunes dead context and serves cached replies
          before your OpenAI bill notices.
        </p>
        <div className="mt-8 flex items-center gap-6">
          <a
            href="#analyze"
            className="flex items-center gap-2 rounded-lg bg-cyan px-5 py-3 text-sm font-semibold text-base transition hover:bg-cyan-soft glow-cyan"
          >
            Get Started <IconArrow />
          </a>
          <a href="#how-it-works" className="flex items-center gap-2 text-sm font-medium text-white/70 transition hover:text-white">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20">
              <IconPlay />
            </span>
            How it works
          </a>
        </div>
      </div>

      <HeroGraphic />
    </section>
  );
}

/** Layered glass panel graphic — stylized, no external image assets. */
function HeroGraphic() {
  return (
    <div className="relative flex h-72 items-center justify-center sm:h-96">
      <div className="absolute h-56 w-56 rounded-full border border-cyan/20 sm:h-72 sm:w-72" />
      <div className="absolute h-40 w-40 rounded-full border border-cyan/10 sm:h-52 sm:w-52" />
      <div className="absolute -rotate-12 h-44 w-32 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm sm:h-56 sm:w-40" />
      <div className="absolute rotate-6 h-44 w-32 translate-x-6 rounded-2xl border border-cyan/20 bg-cyan/5 backdrop-blur-sm sm:h-56 sm:w-40" />
      <div className="glass glow-cyan relative flex h-28 w-28 -translate-x-2 items-center justify-center rounded-2xl sm:h-36 sm:w-36">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-cyan">
          <path d="M4 12h9M13 12l-3.5-3.5M13 12l-3.5 3.5M17 6v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span className="absolute right-4 top-6 h-1.5 w-1.5 rounded-full bg-cyan/70" />
      <span className="absolute bottom-10 left-2 h-1 w-1 rounded-full bg-white/40" />
      <span className="absolute right-10 bottom-4 h-1 w-1 rounded-full bg-signal/70" />
    </div>
  );
}

/* ------------------------------ how it works ------------------------------- */

function HowItWorks() {
  const kept = "border-signal/40 bg-signal/[0.07] text-white";
  const pruned = "border-white/10 bg-white/[0.02] text-white/30 line-through decoration-white/20";

  return (
    <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-20">
      <h2 className="font-display text-2xl font-medium">How it works</h2>
      <p className="mt-2 max-w-lg text-sm text-white/50">
        On every request, the Worker checks your key, strips dead history
        down to the system prompt and the final message, hashes what's left,
        and serves a cached reply on a match.
      </p>

      <div className="glass mt-6 rounded-2xl p-5">
        <div className="mb-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-white/40">
          <span>example request</span>
          <span className="rounded-full bg-cyan/10 px-2 py-0.5 text-cyan">−73% tokens</span>
        </div>
        <ol className="space-y-2 font-mono text-xs">
          <li className={`rounded-lg border px-3 py-2 ${kept}`}>
            <span className="text-signal">[system]</span> You are a support agent for…
          </li>
          <li className={`rounded-lg border px-3 py-2 ${pruned}`}>[user] Here&apos;s my order number, it&apos;s…</li>
          <li className={`rounded-lg border px-3 py-2 ${pruned}`}>[assistant] Thanks, let me look that up…</li>
          <li className={`rounded-lg border px-3 py-2 ${pruned}`}>[user] It still hasn&apos;t arrived and…</li>
          <li className={`rounded-lg border px-3 py-2 ${kept} glow-cyan`}>
            <span className="text-signal">[user]</span> Can you just refund it?
          </li>
        </ol>
        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4 font-mono text-[11px] text-white/40">
          <span>812 tokens in</span>
          <IconArrow />
          <span className="text-cyan">219 tokens out</span>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- stats row -------------------------------- */

function StatsRow({ stats }: { stats: Stats | null }) {
  const cards = [
    {
      icon: <IconDollar />, iconBg: "bg-signal/15 text-signal",
      label: "Total Savings", value: stats ? usd.format(stats.totalSavingsUsd) : "—",
      sub: !stats ? "Enter your key below" : "Live from your account",
    },
    {
      icon: <IconBolt />, iconBg: "bg-blue-400/15 text-blue-300",
      label: "Cache Hit Rate", value: "—",
      sub: "Not tracked by backend yet",
    },
    {
      icon: <IconBarChart />, iconBg: "bg-purple-400/15 text-purple-300",
      label: "Tokens Saved", value: stats ? compact.format(stats.savedTokens) : "—",
      sub: !stats ? "Enter your key below" : "Live from your account",
    },
    {
      icon: <IconActivity />, iconBg: "bg-orange-400/15 text-orange-300",
      label: "Total Requests", value: stats ? int.format(stats.totalRequests) : "—",
      sub: !stats ? "Enter your key below" : "Live from your account",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 pt-2 lg:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="glass rounded-xl p-5">
          <span className={`mb-3 flex h-8 w-8 items-center justify-center rounded-full ${c.iconBg}`}>
            {c.icon}
          </span>
          <p className="text-xs font-medium text-white/40">{c.label}</p>
          <p className="mt-1 font-mono text-2xl font-semibold text-white sm:text-3xl">{c.value}</p>
          <p className={`mt-1 text-[11px] ${stats ? "text-signal" : "text-white/30"}`}>{c.sub}</p>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------ developer panel ----------------------------- */

function DeveloperPanel({
  apiKey, setApiKey, loading, error, verified, onSubmit,
}: {
  apiKey: string; setApiKey: (v: string) => void; loading: boolean;
  error: string | null; verified: boolean; onSubmit: (e: FormEvent) => void;
}) {
  const bullets = [
    { icon: <IconShield />, label: "Secure & Encrypted" },
    { icon: <IconBolt />, label: "Real-time Analytics" },
    { icon: <IconGlobe />, label: "Edge Deployed" },
  ];

  return (
    <div id="analyze" className="glass mt-10 scroll-mt-24 rounded-2xl p-6 sm:p-8">
      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="font-display text-xl font-medium">Developer Dashboard</h2>
          <p className="mt-2 text-sm text-white/50">
            Enter your TokenTrim API key to analyze your savings.
          </p>
          <ul className="mt-6 space-y-3">
            {bullets.map((b) => (
              <li key={b.label} className="flex items-center gap-2 text-sm text-white/60">
                <span className="text-cyan">{b.icon}</span>
                {b.label}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <label className="text-xs font-medium uppercase tracking-widest text-white/40">
            Your TokenTrim API Key
          </label>
          <form onSubmit={onSubmit} className="mt-3 flex flex-col gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 transition focus-within:border-cyan/50 focus-within:ring-1 focus-within:ring-cyan/50">
              <span className="text-white/30"><IconKey /></span>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your TokenTrim API key (e.g. tt_founder_999)"
                className="w-full bg-transparent font-mono text-sm text-white placeholder:text-white/25 outline-none"
                spellCheck={false}
                autoComplete="off"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !apiKey.trim()}
              className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan to-signal px-6 py-3 text-sm font-semibold text-base transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? "Analyzing…" : "Analyze My Savings"} {!loading && <IconArrow />}
            </button>
          </form>
          <p className="mt-3 flex items-center gap-1.5 text-[11px] text-white/35">
            <IconLock /> Your API key is never stored on our servers.
          </p>
          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
          {verified && !error && <p className="mt-2 text-sm text-signal">Key verified — figures above are live.</p>}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- data panels -------------------------------- */
/* Matches the layout of the reference design, but honestly reflects what the
   backend can actually provide today — no invented history or event logs. */

function DataPanels({ stats }: { stats: Stats | null }) {
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-5">
      <div className="glass rounded-2xl p-6 lg:col-span-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-medium">Savings Overview</h3>
          <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-white/40">Coming soon</span>
        </div>
        <p className="mt-1 font-mono text-3xl font-semibold">
          {stats ? usd.format(stats.totalSavingsUsd) : "—"}
        </p>
        <p className="text-xs text-white/40">Total savings, current snapshot</p>

        <div className="mt-6 flex h-32 items-end gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex-1 rounded-t bg-white/[0.06]" style={{ height: "40%" }} />
          ))}
        </div>
        <p className="mt-3 text-[11px] text-white/30">
          Monthly trend needs request-level history logging in the Worker — not tracked yet.
        </p>
      </div>

      <div className="glass rounded-2xl p-6 lg:col-span-2">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-medium">Recent Activity</h3>
          <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-white/40">Coming soon</span>
        </div>
        <div className="mt-4 space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5">
              <span className="h-2 w-24 rounded bg-white/10" />
              <span className="h-2 w-10 rounded bg-white/10" />
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-white/30">
          Per-request event logging isn&apos;t stored by the backend yet.
        </p>
      </div>
    </div>
  );
}

/* --------------------------------- trust row --------------------------------- */

function TrustRow() {
  const items = ["OpenAI", "Anthropic", "LangChain", "Vercel", "Next.js"];
  return (
    <div className="mt-16 border-t border-white/5 pt-10 text-center">
      <p className="text-[11px] uppercase tracking-widest text-white/30">
        Trusted by developers building with
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm font-medium text-white/40">
        {items.map((i) => (
          <span key={i}>{i}</span>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-6 pb-10 pt-4 text-xs text-white/30">
      TokenTrim — token counts are estimates based on character-length pruning, not exact tokenizer output.
    </footer>
  );
}
