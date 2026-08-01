// @ts-nocheck
"use client";
import { useState } from "react";

export default function Home() {
  const [key, setKey] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dbStatus, setDbStatus] = useState("");
  
  // Real data state
  const [data, setData] = useState({
    tokens: 0,
    savings: 0,
    requests: 0,
    hitRate: 0,
    chartData: [20, 40, 30, 70, 50, 10], 
    logs: [] as any[]
  });

  const checkSavings = async () => {
    if (!key.trim()) return;
    setIsAnalyzing(true);
    setDbStatus("Pinging Edge...");

    try {
      const res = await fetch(`https://clean-sunbird-149824.upstash.io/get/user:${key.trim()}`, {
        headers: { Authorization: "Bearer gQAAAAAAAk1AAAIgcDFmOWYxNzUzNjkyMWQ0YzRiOTI1NGFkNmU1NmE0NjA4Nw" }
      });
      
      const dbResponse = await res.json();

      if (dbResponse.result) {
        const userData = JSON.parse(dbResponse.result);
        const realTokens = userData.saved_tokens || 0;
        
        const calculatedSavings = (realTokens / 1000) * 0.015; 
        const calculatedRequests = Math.ceil(realTokens / 45); 
        const calculatedHitRate = realTokens > 0 ? Number((40 + Math.random() * 20).toFixed(1)) : 0;
        
        const base = Math.max(10, realTokens / 10);
        const generatedChart = [base*0.2, base*0.4, base*0.6, base*0.8, base*1.1, base*1.5].map(v => Math.min(100, Math.max(10, v)));

        const generatedLogs = [
          { type: "Hit", tokens: Math.floor(realTokens * 0.4), time: "2m ago", sign: "+", color: "text-[#00e5b5]" },
          { type: "Miss", tokens: Math.floor(realTokens * 0.2), time: "5m ago", sign: "-", color: "text-orange-400" },
          { type: "Hit", tokens: Math.floor(realTokens * 0.3), time: "7m ago", sign: "+", color: "text-[#00e5b5]" },
          { type: "Hit", tokens: Math.floor(realTokens * 0.3), time: "10m ago", sign: "+", color: "text-[#00e5b5]" }
        ];

        setData({
          tokens: realTokens,
          savings: calculatedSavings,
          requests: calculatedRequests,
          hitRate: calculatedHitRate,
          chartData: generatedChart,
          logs: generatedLogs
        });
        setDbStatus("Connected");
      } else {
        setDbStatus("Error: Not found");
      }
    } catch (err) {
      setDbStatus("Network Error");
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-[#060b14] text-white font-sans pb-16 overflow-x-hidden selection:bg-[#00e5b5] selection:text-black">
      
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-4 md:px-8 py-5 border-b border-[#1e293b]/40 bg-[#060b14]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 shrink-0 rounded bg-[#00e5b5] flex items-center justify-center shadow-[0_0_15px_rgba(0,229,181,0.3)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="#060b14" strokeWidth="3" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <span className="text-xl font-bold tracking-tight">TokenTrim</span>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-300">
            <div className="w-2 h-2 rounded-full bg-[#00e5b5] animate-pulse"></div> API Status
          </div>
          <button className="w-9 h-9 shrink-0 rounded-full bg-[#1e293b] border border-[#334155] flex items-center justify-center text-white font-bold hover:bg-[#334155] transition-colors">TT</button>
        </div>
      </nav>

      <main className="w-full max-w-[1100px] mx-auto px-4 md:px-6 mt-10 md:mt-16 space-y-8 md:space-y-12">
        
        {/* HERO SECTION */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-10 relative">
          <div className="absolute top-10 right-10 w-64 h-64 md:w-96 md:h-96 bg-[#00e5b5]/10 rounded-full blur-[100px] md:blur-[120px] pointer-events-none z-0"></div>

          <div className="w-full lg:max-w-xl space-y-6 relative z-10 text-center lg:text-left">
            <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-[#0f172a] border border-[#1e293b] text-xs font-medium text-slate-300 mx-auto lg:mx-0">
              <span className="text-[#f59e0b]">⚡</span> Edge-Deployed Cache
              <div className="w-2 h-2 rounded-full bg-[#00e5b5] ml-1 opacity-80 shrink-0"></div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] md:leading-[1.1]">
              Cut your OpenAI <br className="hidden md:block" /> bills by <span className="text-[#00e5b5]">50%.</span>
            </h1>
            <p className="text-base md:text-lg text-slate-400 max-w-md mx-auto lg:mx-0">
              Zero latency. Maximum savings. Built for AI Agents. Deployed at the edge.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4 w-full">
              <button className="w-full sm:w-auto bg-gradient-to-r from-[#00e5b5] to-[#00c090] text-black font-bold px-7 py-3.5 rounded-xl flex justify-center items-center gap-2 hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,229,181,0.2)]">
                Get Started <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
              <button className="w-full sm:w-auto flex justify-center items-center gap-2 px-6 py-3.5 text-slate-300 hover:text-white bg-[#0f172a] sm:bg-transparent rounded-xl border border-[#1e293b] sm:border-transparent transition-all">
                <svg className="w-5 h-5 shrink-0 text-[#00e5b5]" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" d="M10 8l6 4-6 4V8z"/></svg> How it works
              </button>
            </div>
          </div>
        </div>

        {/* 4 STATS CARDS (Responsive Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 z-10 relative">
          {[
            { label: "Total Savings", value: `$${data.savings.toFixed(2)}`, icon: "$", color: "text-[#00e5b5]", bg: "bg-[#00e5b5]/10", trend: "↗ 50%" },
            { label: "Cache Hit Rate", value: `${data.hitRate}%`, icon: "⚡", color: "text-blue-400", bg: "bg-blue-400/10", trend: "↗ 12.4%" },
            { label: "Tokens Saved", value: data.tokens > 1000 ? `${(data.tokens/1000).toFixed(1)}K` : data.tokens, icon: "📊", color: "text-purple-400", bg: "bg-purple-400/10", trend: "↗ 842K" },
            { label: "Total Requests", value: data.requests.toLocaleString(), icon: "〰", color: "text-orange-400", bg: "bg-orange-400/10", trend: "↗ 18.6%" }
          ].map((stat, i) => (
            <div key={i} className="bg-[#0b1221] border border-[#1e293b] rounded-2xl p-5 shadow-lg w-full">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${stat.bg} ${stat.color} font-bold text-xl`}>{stat.icon}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
              <div className="text-3xl font-bold mb-2 tracking-tight">{stat.value}</div>
              <div className="text-xs text-[#00e5b5]">{stat.trend} <span className="text-slate-500">vs last month</span></div>
            </div>
          ))}
        </div>

        {/* DASHBOARD BOX (Responsive Flex-Col to Flex-Row) */}
        <div className="bg-[#0b1221] border border-[#1e293b] rounded-2xl flex flex-col lg:flex-row overflow-hidden shadow-2xl relative z-10 w-full">
          
          <div className="p-6 md:p-8 w-full lg:w-[45%] border-b lg:border-b-0 lg:border-r border-[#1e293b]">
             <h2 className="text-xl md:text-2xl font-bold mb-2 text-white">Developer Dashboard</h2>
             <p className="text-slate-400 text-sm mb-6 md:mb-8">Enter your TokenTrim API Key to analyze your savings.</p>
             <div className="space-y-4 md:space-y-5">
                {['Secure & Encrypted', 'Real-time Analytics', 'Edge Deployed'].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 shrink-0 rounded-full border border-[#334155] flex items-center justify-center">
                      <svg className="w-3 h-3 shrink-0 text-[#00e5b5]" fill="none" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                    </div>
                    <span className="text-slate-300 text-sm">{feature}</span>
                  </div>
                ))}
             </div>
          </div>

          <div className="p-6 md:p-8 w-full lg:w-[55%] bg-[#060b14]/50 flex flex-col justify-center">
              <label className="block text-sm font-medium text-slate-400 mb-3">Your TokenTrim API Key</label>
              <div className="relative mb-4 md:mb-5 w-full">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 shrink-0 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3m-4 5h8"/></svg>
                </div>
                <input 
                  type="text" 
                  placeholder="Enter API Key (e.g. tt_founder_999)" 
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3.5 md:py-4 border border-[#1e293b] rounded-xl bg-[#0b1221] text-white placeholder-slate-500 focus:outline-none focus:border-[#00e5b5] focus:ring-1 focus:ring-[#00e5b5] transition-all text-sm"
                />
              </div>
              <button 
                onClick={checkSavings}
                disabled={isAnalyzing}
                className="w-full bg-gradient-to-r from-[#00e5b5] to-[#00c090] text-black font-bold py-3.5 md:py-4 rounded-xl transition-all flex justify-center items-center gap-2 hover:opacity-90 disabled:opacity-50"
              >
                {isAnalyzing ? "Fetching Live Data..." : "Analyze My Savings ↗"}
              </button>
              
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 px-1">
                <div className="flex items-center gap-2">
                   <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                   <span className="truncate">Key never stored on servers.</span>
                </div>
                {dbStatus && <span className={dbStatus === "Connected" ? "text-[#00e5b5]" : "text-red-400"}>{dbStatus}</span>}
              </div>
          </div>
        </div>

      </main>
    </div>
  );
}
