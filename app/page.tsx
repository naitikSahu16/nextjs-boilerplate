"use client";

import { useState, FormEvent } from "react";

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
const int = new Intl.NumberFormat("en-US");

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

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
      <TopNav />
      <Hero />
      <section className="mx-auto max-w-6xl px-6 pb-28">
        <StatsRow stats={stats} />
        <InputModule
          apiKey={apiKey}
          setApiKey={setApiKey}
          loading={loading}
          error={error}
          verified={stats !== null}
          onSubmit={handleSubmit}
        />
      </section>
      <Footer />
    </main>
  );
}

function TopNav() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-7">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-cyan/10 text-cyan">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 12h9M13 12l-3.5-3.5M13 12l-3.5 3.5M17 6v12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="font-display text-lg font-medium tracking-tight">
          TokenTrim
        </span>
      </div>
      <nav className="hidden items-center gap-8 text-sm text-white/60 md:flex">
        <a href="#" className="transition hover:text-white">
          Docs
        </a>
        <a href="#" className="transition hover:text-white">
          Pricing
        </a>
        <a href="#" className="transition hover:text-white">
          GitHub
        </a>
      </nav>
      <a
        href="#analyze"
        className="rounded-full border border-cyan/30 bg-cyan/10 px-4 py-2 text-sm font-medium text-cyan transition hover:bg-cyan/20"
      >
        Get API Key
      </a>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl gap-16 px-6 pb-20 pt-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
      <div className="animate-fade-up">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-widest text-cyan">
          Edge-deployed semantic cache
        </span>
        <h1 className="mt-6 font-display text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl">
          Cut your OpenAI bills
          <br />
          by{" "}
          <span className="text-cyan text-glow">50%.</span>
        </h1>
        <p className="mt-6 max-w-md text-base leading-relaxed text-white/60">
          TokenTrim sits in front of every agent request. It prunes dead
          conversation history, hashes what&apos;s left, and serves a cached
          reply before your OpenAI bill even notices — built for CrewAI and
          LangChain agents running at scale.
        </p>
        <div className="mt-8 flex items-center gap-4">
          <a
            href="#analyze"
            className="rounded-lg bg-cyan px-5 py-3 text-sm font-semibold text-base transition hover:bg-cyan-soft glow-cyan"
          >
            Analyze my savings
          </a>
          <span className="font-mono text-xs text-white/40">
            no signup · just your API key
          </span>
        </div>
      </div>

      <TrimVisualization />
    </section>
  );
}

/**
 * The signature element: a literal picture of what the Cloudflare Worker
 * does on every request — collapsing a long conversation down to just the
 * system prompt and the final user message before it ever reaches OpenAI.
 */
function TrimVisualization() {
  const kept = "border-signal/40 bg-signal/[0.07] text-white";
  const pruned =
    "border-white/10 bg-white/[0.02] text-white/30 line-through decoration-white/20";

  return (
    <div className="glass animate-fade-up rounded-2xl p-5" style={{ animationDelay: "120ms" }}>
      <div className="mb-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-white/40">
        <span>payload · before forwarding</span>
        <span className="rounded-full bg-cyan/10 px-2 py-0.5 text-cyan">−73% tokens</span>
      </div>

      <ol className="space-y-2 font-mono text-xs">
        <li className={`rounded-lg border px-3 py-2 ${kept}`}>
          <span className="text-signal">[system]</span> You are a support agent for…
        </li>
        <li className={`rounded-lg border px-3 py-2 ${pruned}`}>
          [user] Here&apos;s my order number, it&apos;s…
        </li>
        <li className={`rounded-lg border px-3 py-2 ${pruned}`}>
          [assistant] Thanks, let me look that up…
        </li>
        <li className={`rounded-lg border px-3 py-2 ${pruned}`}>
          [user] It still hasn&apos;t arrived and…
        </li>
        <li className={`rounded-lg border px-3 py-2 ${pruned}`}>
          [assistant] I understand the frustration…
        </li>
        <li className={`rounded-lg border px-3 py-2 ${kept} glow-cyan`}>
          <span className="text-signal">[user]</span> Can you just refund it?
        </li>
      </ol>

      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4 font-mono text-[11px] text-white/40">
        <span>812 tokens in</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 12h14M13 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-cyan">219 tokens out</span>
      </div>
    </div>
  );
}

function StatsRow({ stats }: { stats: Stats | null }) {
  const cards = [
    {
      label: "Total savings",
      value: stats ? usd.format(stats.totalSavingsUsd) : "—",
    },
    {
      label: "Cache hit rate",
      value: stats && stats.cacheHitRate !== null ? `${stats.cacheHitRate}%` : "—",
      note: !stats ? undefined : "not yet tracked by backend",
    },
    {
      label: "Tokens saved",
      value: stats ? int.format(stats.savedTokens) : "—",
    },
    {
      label: "Requests processed",
      value: stats ? int.format(stats.totalRequests) : "—",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 pt-8 lg:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="glass rounded-xl p-5">
          <p className="text-xs font-medium uppercase tracking-widest text-white/40">
            {c.label}
          </p>
          <p className="mt-3 font-mono text-3xl font-semibold text-white">
            {c.value}
          </p>
          {c.note && (
            <p className="mt-1 text-[11px] text-white/30">{c.note}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function InputModule({
  apiKey,
  setApiKey,
  loading,
  error,
  verified,
  onSubmit,
}: {
  apiKey: string;
  setApiKey: (v: string) => void;
  loading: boolean;
  error: string | null;
  verified: boolean;
  onSubmit: (e: FormEvent) => void;
}) {
  return (
    <div id="analyze" className="glass mt-10 scroll-mt-24 rounded-2xl p-6 sm:p-8">
      <h2 className="font-display text-xl font-medium">Check your savings</h2>
      <p className="mt-1 text-sm text-white/50">
        Enter your TokenTrim API key to pull real usage from your account.
      </p>

      <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="tt_live_••••••••••••"
          className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 font-mono text-sm text-white placeholder:text-white/25 outline-none transition focus:border-cyan/50 focus:ring-1 focus:ring-cyan/50"
          spellCheck={false}
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={loading || !apiKey.trim()}
          className="rounded-lg bg-cyan px-6 py-3 text-sm font-semibold text-base transition hover:bg-cyan-soft disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Analyzing…" : "Analyze My Savings"}
        </button>
      </form>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      {verified && !error && (
        <p className="mt-3 text-sm text-signal">Key verified — figures above are live.</p>
      )}
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
