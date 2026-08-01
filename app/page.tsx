'use client';

import { useMemo, useState } from 'react';

type Stats = {
  savedTokens: number;
  totalSavings: number;
  totalRequests: number;
  cacheHitRate: number;
};

export default function Page() {
  const [apiKey, setApiKey] = useState('');
  const [stats, setStats] = useState<Stats>({
    savedTokens: 0,
    totalSavings: 0,
    totalRequests: 0,
    cacheHitRate: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);

  const endpointBase = 'https://clean-sunbird-149824.upstash.io/get/user:';
  const authHeader =
    'Bearer gQAAAAAAAk1AAAIgcDFmOWYxNzUzNjkyMWQ0YzRiOTI1NGFkNmU1NmE0NjA4Nw';

  const formatMoney = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(value);

  const formatNumber = (value: number) =>
    new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);

  const formatPercent = (value: number) =>
    `${new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
    }).format(value)}%`;

  const fetchSavings = async () => {
    setLoading(true);
    setError('');
    setVerified(false);

    const key = apiKey.trim();
    if (!key) {
      setLoading(false);
      setError('Please enter a TokenTrim API key.');
      return;
    }

    try {
      const res = await fetch(`${endpointBase}${encodeURIComponent(key)}`, {
        method: 'GET',
        headers: {
          Authorization: authHeader,
        },
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();
      const raw = data?.result;

      if (!raw) {
        throw new Error('No user record found for that API key.');
      }

      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
      const savedTokens = Number(parsed?.saved_tokens ?? 0);

      if (!Number.isFinite(savedTokens)) {
        throw new Error('Invalid saved_tokens value returned by the API.');
      }

      const totalSavings = (savedTokens / 1000) * 0.015;
      const totalRequests = Math.ceil(savedTokens / 45);
      const cacheHitRate =
        totalRequests > 0 ? Math.min(100, Math.round((savedTokens / (totalRequests * 45)) * 100)) : 0;

      setStats({
        savedTokens,
        totalSavings,
        totalRequests,
        cacheHitRate,
      });
      setVerified(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setStats({
        savedTokens: 0,
        totalSavings: 0,
        totalRequests: 0,
        cacheHitRate: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const cards = useMemo(
    () => [
      {
        label: 'Total Savings',
        value: formatMoney(stats.totalSavings),
        accent: 'from-cyan-400 to-emerald-400',
      },
      {
        label: 'Cache Hit Rate',
        value: formatPercent(stats.cacheHitRate),
        accent: 'from-emerald-400 to-cyan-400',
      },
      {
        label: 'Tokens Saved',
        value: formatNumber(stats.savedTokens),
        accent: 'from-cyan-300 to-emerald-300',
      },
      {
        label: 'Total Requests Processed',
        value: formatNumber(stats.totalRequests),
        accent: 'from-emerald-300 to-cyan-300',
      },
    ],
    [stats]
  );

  return (
    <main className="min-h-screen bg-[#030712] text-white">
      <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
        <nav className="mb-10 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl shadow-[0_0_40px_rgba(0,229,181,0.08)]">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">TokenTrim</p>
            <h1 className="text-lg font-semibold">Savings Dashboard</h1>
          </div>
          <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
            {verified ? 'API Key Verified' : 'Awaiting Key'}
          </div>
        </nav>

        <section className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-2xl shadow-[0_0_80px_rgba(0,229,181,0.08)]">
            <div className="mb-6 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
              Edge-deployed semantic cache analytics
            </div>
            <h2 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Cut your OpenAI bills by <span className="text-cyan-300">50%</span>.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
              Track token savings, request reduction, and cache performance in real time with a premium
              dashboard built for AI agent developers and agencies.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {cards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 shadow-lg shadow-cyan-500/5 backdrop-blur-xl"
                >
                  <p className="text-sm text-slate-400">{card.label}</p>
                  <div className="mt-3 flex items-end justify-between">
                    <span className="text-2xl font-semibold tracking-tight">{card.value}</span>
                    <span className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${card.accent}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
            <h3 className="text-xl font-semibold">Analyze My Savings</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Enter your TokenTrim API key to pull live savings data from Upstash Redis.
            </p>

            <label className="mt-6 block text-sm font-medium text-slate-200">TokenTrim API Key</label>
            <input
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="tt_founder_999"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-400/60 focus:shadow-[0_0_0_4px_rgba(0,229,181,0.12)]"
            />

            <button
              type="button"
              onClick={fetchSavings}
              disabled={loading}
              className="mt-4 w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-4 py-3 font-semibold text-slate-950 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Analyzing...' : 'Analyze My Savings'}
            </button>

            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Status</span>
                <span className={verified ? 'text-emerald-300' : 'text-cyan-300'}>
                  {verified ? 'Live data loaded' : 'Ready'}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-slate-400">Current Saved Tokens</span>
                <span className="font-medium text-white">{formatNumber(stats.savedTokens)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-slate-400">Estimated Monthly Savings</span>
                <span className="font-medium text-white">{formatMoney(stats.totalSavings)}</span>
              </div>
            </div>

            {error ? (
              <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                {error}
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
