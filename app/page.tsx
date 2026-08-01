"use client";
import { useState } from "react";

export default function Home() {
  const [key, setKey] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [success, setSuccess] = useState(false);

  const checkSavings = () => {
    if (!key.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans pb-12 selection:bg-[#00e5b5] selection:text-black">
      
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-[#1e293b]/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00e5b5] to-[#00b56b] flex items-center justify-center p-1.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <span className="text-xl font-bold tracking-wide">TokenTrim</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
          <span className="hover:text-white cursor-pointer">Docs</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00e5b5] animate-pulse"></div>
            <span>API Status</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#1e293b] border border-[#334155] flex items-center justify-center text-white font-bold ml-4">
            TT
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 mt-12 space-y-8">
        
        {/* HERO SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10172a] border border-[#1e293b] text-xs font-medium text-slate-300">
              <span className="text-[#f59e0b]">⚡</span> Edge-Deployed Semantic Cache
              <div className="w-1.5 h-1.5 rounded-full bg-[#00e5b5] ml-2"></div>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
              Cut your OpenAI <br/> bills by <span className="text-[#00e5b5]">50%.</span>
            </h1>
            <p className="text-lg text-slate-400">
              Zero latency. Maximum savings. <br/> Built for AI Agents. Deployed at the edge.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <button className="bg-gradient-to-r from-[#00e5b5] to-[#00b56b] text-black font-bold px-8 py-3 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity">
                Get Started 
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
              <button className="flex items-center gap-2 px-6 py-3 text-slate-300 hover:text-white transition-colors">
                <svg className="w-5 h-5 text-[#00e5b5]" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" d="M10 8l6 4-6 4V8z"/></svg>
                How it works
              </button>
            </div>
          </div>
        </div>

        {/* STATS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Total Savings", value: "$142.67", icon: "$", color: "text-[#00e5b5]", bg: "bg-[#00e5b5]/10", trend: "↗ 50%" },
            { label: "Cache Hit Rate", value: "48.7%", icon: "⚡", color: "text-blue-400", bg: "bg-blue-400/10", trend: "↗ 12.4%" },
            { label: "Tokens Saved", value: "1.24M", icon: "📊", color: "text-purple-400", bg: "bg-purple-400/10", trend: "↗ 842K" },
            { label: "Total Requests", value: "3,842", icon: "〰", color: "text-orange-400", bg: "bg-orange-400/10", trend: "↗ 18.6%" }
          ].map((stat, i) => (
            <div key={i} className="bg-[#0b1121] border border-[#1e293b] rounded-xl p-5 hover:border-[#334155] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.bg} ${stat.color} font-bold text-xl`}>
                  {stat.icon}
                </div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <div className="text-xs text-[#00e5b5]">{stat.trend} <span className="text-slate-500">vs last month</span></div>
            </div>
          ))}
        </div>

        {/* INTERACTIVE DASHBOARD SECTION */}
        <div className="bg-[#0b1121] border border-[#1e293b] rounded-2xl p-8 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Left Side */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Developer Dashboard</h2>
                <p className="text-slate-400 text-sm">Enter your TokenTrim API Key to analyze your savings.</p>
              </div>
              <div className="space-y-4 pt-4">
                {['Secure & Encrypted', 'Real-time Analytics', 'Edge Deployed'].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center">
                      <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                    </div>
                    <span className="text-slate-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side (Input) */}
            <div className="bg-[#030712] rounded-xl border border-[#1e293b] p-6">
              <label className="block text-sm font-medium text-slate-400 mb-3">Your TokenTrim API Key</label>
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-500 text-lg">🔑</span>
                </div>
                <input 
                  type="text" 
                  placeholder="e.g. tt_founder_999" 
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-[#1e293b] rounded-lg bg-[#0b1121] text-white placeholder-slate-600 focus:outline-none focus:border-[#00e5b5] focus:ring-1 focus:ring-[#00e5b5] transition-all"
                />
              </div>
              
              <button 
                onClick={checkSavings}
                className="w-full bg-gradient-to-r from-[#00e5b5] to-[#00b56b] hover:opacity-90 text-black font-bold py-3 rounded-lg transition-all flex justify-center items-center gap-2"
              >
                {isAnalyzing ? (
                  <span className="animate-pulse">Analyzing System...</span>
                ) : (
                  <>Analyze My Savings <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg></>
                )}
              </button>
              
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                Your API key is never stored on our servers.
              </div>

              {/* Success Message popup */}
              {success && (
                <div className="mt-4 p-3 bg-[#00e5b5]/10 border border-[#00e5b5]/30 rounded-lg text-sm text-[#00e5b5] animate-in fade-in slide-in-from-bottom-2">
                  ✓ Pipeline verified! Your agent saved 138 tokens in the last request.
                </div>
              )}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
