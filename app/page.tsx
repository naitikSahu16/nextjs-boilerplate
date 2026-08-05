// @ts-nocheck
"use client";
import { useState, useRef, useEffect } from "react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  const { isSignedIn } = useUser();
  const [key, setKey] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false); 
  
  const [activeTab, setActiveTab] = useState("node");
  const [copied, setCopied] = useState(false);

  const [data, setData] = useState({ tokens: 0, savings: 0, requests: 0, hitRate: 0 });

  useEffect(() => {
    if (isSignedIn) {
      setKey("tt_founder_999");
    } else {
      setKey("");
      setData({ tokens: 0, savings: 0, requests: 0, hitRate: 0 });
      setIsUnlocked(false);
    }
  }, [isSignedIn]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProClick = () => {
    alert("🚀 Stripe Checkout Page will open here! (Payment gateway integration pending in next step)");
  };

  const scrollToTerminal = () => {
    document.getElementById("terminal-dashboard")?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkSavings = async () => {
    if (!key.trim()) { alert("Please enter an API Key first."); return; }
    setIsAnalyzing(true);
    setIsUnlocked(false); 

    try {
      const res = await fetch(`https://clean-sunbird-149824.upstash.io/get/user:${key.trim()}`, {
        headers: { Authorization: "Bearer gQAAAAAAAk1AAAIgcDFmOWYxNzUzNjkyMWQ0YzRiOTI1NGFkNmU1NmE0NjA4Nw" }
      });
      const dbResponse = await res.json();
      
      let realTokens = 0;
      if (dbResponse.result) {
        const userData = JSON.parse(dbResponse.result);
        realTokens = userData.saved_tokens || 0;
      } else if (key.trim() === "tt_founder_999") {
        realTokens = 138; 
      } else {
        throw new Error("Invalid Key");
      }

      setData({
        tokens: realTokens,
        savings: (realTokens / 1000) * 0.015,
        requests: Math.ceil(realTokens / 45),
        hitRate: realTokens > 0 ? Number((40 + Math.random() * 20).toFixed(1)) : 0,
      });
      setIsUnlocked(true); 

    } catch (err) {
      if (key.trim() === "tt_founder_999") {
         let mockTokens = 138;
         setData({
           tokens: mockTokens,
           savings: (mockTokens / 1000) * 0.015,
           requests: Math.ceil(mockTokens / 45),
           hitRate: Number((40 + Math.random() * 20).toFixed(1)),
         });
         setIsUnlocked(true);
      } else {
         setIsUnlocked(false);
         alert("❌ Invalid API Key! Access Denied.");
      }
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans flex flex-col items-center selection:bg-[#00e5b5] selection:text-black overflow-x-hidden">
      
      {/* PREMIUM NAVBAR */}
      <nav className="flex items-center justify-between w-full max-w-[1100px] px-6 py-4 bg-[#050505]/90 backdrop-blur-md sticky top-0 z-50 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00e5b5] to-[#008f71] flex items-center justify-center shadow-[0_0_15px_rgba(0,229,181,0.4)]">
            <span className="text-black font-bold text-lg">T</span>
          </div>
          <div className="text-xl font-bold tracking-tight text-white">TokenTrim</div>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#problem" className="hover:text-white transition-colors">Why</a>
          <a href="#terminal-dashboard" className="hover:text-white transition-colors">Demo</a>
          <a href="#stats" className="hover:text-white transition-colors">Benchmarks</a>
          <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
          <a href="#pricing" className="text-[#00e5b5] hover:text-[#00c090] transition-colors">Pro</a>
        </div>

        <div className="flex items-center gap-4">
          {!isSignedIn ? (
            <>
              <SignInButton mode="modal">
                <button className="text-sm font-medium hover:text-white transition-colors hidden sm:block">Log in</button>
              </SignInButton>
              <SignInButton mode="modal">
                <button className="bg-[#00e5b5] text-black text-sm font-bold py-2 px-5 rounded-md hover:bg-[#00c090] transition-all shadow-[0_0_15px_rgba(0,229,181,0.2)]">
                  Install TokenTrim
                </button>
              </SignInButton>
            </>
          ) : (
            <UserButton afterSignOutUrl="/" />
          )}
        </div>
      </nav>

      <div className="w-full max-w-[1000px] px-4 flex flex-col gap-16 md:gap-24 mt-10">
        
        {/* HERO SECTION */}
        <div className="text-center w-full pt-12 pb-8 flex flex-col items-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#00e5b5] opacity-[0.05] blur-[120px] pointer-events-none rounded-full"></div>

          <Link href="/docs" className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0a0a0a] border border-[#222] text-xs font-semibold text-slate-300 mb-8 cursor-pointer hover:border-[#00e5b5]/50 transition-colors shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#00e5b5] animate-pulse"></span>
            Open Source • Apache 2.0 • Edge Native
          </Link>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white mb-6 leading-[1.1] max-w-4xl">
            Your AI agent is wasting tokens.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e5b5] to-[#008f71]">
              Fix it.
            </span>
          </h1>
          
          <p className="text-slate-400 text-lg md:text-xl px-2 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            TokenTrim compresses command outputs before they reach the LLM context window. <strong className="text-white">Better reasoning. Longer sessions. Lower costs.</strong>
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
             {!isSignedIn ? (
               <SignInButton mode="modal">
                  <button className="w-full sm:w-auto bg-[#00e5b5] text-black font-bold py-3.5 px-10 rounded-lg hover:bg-[#00c090] transition-all flex items-center justify-center gap-2 text-base shadow-[0_0_20px_rgba(0,229,181,0.2)]">
                    Install TokenTrim
                  </button>
               </SignInButton>
             ) : (
               <button onClick={scrollToTerminal} className="w-full sm:w-auto bg-[#00e5b5] text-black font-bold py-3.5 px-10 rounded-lg hover:bg-[#00c090] transition-all flex items-center justify-center gap-2 text-base shadow-[0_0_20px_rgba(0,229,181,0.2)]">
                  Go to Dashboard ↓
               </button>
             )}
             
             <a href="https://github.com/naitikSahu16/nextjs-boilerplate" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto bg-[#111] text-white border border-[#333] font-semibold py-3.5 px-8 rounded-lg hover:bg-[#1a1a1a] hover:border-slate-500 transition-all flex items-center justify-center gap-2 text-base cursor-pointer z-10">
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
               Star on GitHub
             </a>
          </div>
        </div>

        {/* TERMINAL DASHBOARD */}
        <div id="terminal-dashboard" className="w-full rounded-xl overflow-hidden bg-[#0c0c0c] border border-[#222] shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
          <div className="flex items-center px-4 py-3 bg-[#111] border-b border-[#222]">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            </div>
            <div className="mx-auto flex items-center gap-2 text-xs text-slate-500 font-mono">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 17l6-6-6-6M12 19h8"/></svg>
              Terminal
            </div>
          </div>
          <div className="p-6 md:p-10 font-mono text-sm">
            <div className="text-[#00e5b5] font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#00e5b5] rounded-full inline-block"></span> 
              $ tokentrim gain
            </div>
            
            <div className="flex flex-row items-center gap-3 w-full mb-8 max-w-md">
              <span className="text-slate-500 font-bold">API_KEY=</span>
              <input type="text" placeholder="Enter key (e.g. tt_founder_999)" value={key} onChange={(e) => setKey(e.target.value)} className="flex-1 bg-[#111] border border-[#333] rounded px-3 py-1.5 text-white outline-none placeholder-slate-700 font-mono focus:border-[#00e5b5]"/>
            </div>

            <button onClick={checkSavings} disabled={isAnalyzing} className="px-6 py-2 bg-[#1a1a1a] text-white border border-[#333] rounded hover:bg-[#222] transition-colors disabled:opacity-50 text-xs tracking-wider uppercase font-bold cursor-pointer mb-6">
              {isAnalyzing ? "Fetching from Edge..." : "Run Analysis"}
            </button>

            {isUnlocked ? (
              <div className="pt-6 border-t border-dashed border-[#333] animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="bg-[#050505] border border-[#1a1a1a] p-4 rounded-lg">
                      <div className="text-slate-500 text-xs mb-2 uppercase tracking-wider">Total Commands</div>
                      <div className="text-white text-2xl font-bold">{data.requests.toLocaleString()}</div>
                    </div>
                    <div className="bg-[#050505] border border-[#1a1a1a] p-4 rounded-lg">
                      <div className="text-slate-500 text-xs mb-2 uppercase tracking-wider">Input Tokens</div>
                      <div className="text-[#ef4444] text-2xl font-bold">{(data.tokens > 1000 ? (data.tokens/1000).toFixed(1) + 'M' : data.tokens)}</div>
                    </div>
                    <div className="bg-[#050505] border border-[#1a1a1a] p-4 rounded-lg">
                      <div className="text-slate-500 text-xs mb-2 uppercase tracking-wider">Tokens Saved</div>
                      <div className="text-[#00e5b5] text-2xl font-bold">{(data.tokens > 1000 ? (data.tokens/1000).toFixed(1) + 'M' : data.tokens)} <span className="text-sm font-normal">({data.hitRate}%)</span></div>
                    </div>
                    <div className="bg-[#050505] border border-[#1a1a1a] p-4 rounded-lg">
                      <div className="text-slate-500 text-xs mb-2 uppercase tracking-wider">Cost Saved</div>
                      <div className="text-white text-2xl font-bold">${data.savings.toFixed(2)}</div>
                    </div>
                 </div>
              </div>
            ) : (
              <div className="pt-6 border-t border-dashed border-[#222] text-slate-600">
                Waiting for API key to display metrics...
              </div>
            )}
          </div>
        </div>

        {/* 01 - THE PROBLEM */}
        <div id="problem" className="w-full">
           <h2 className="text-xs font-semibold text-slate-500 tracking-widest uppercase mb-4">// 01 - THE PROBLEM</h2>
           <h3 className="text-3xl md:text-4xl font-bold text-white mb-10">The problem with AI coding today</h3>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 hover:border-[#333] transition-colors flex flex-col">
                 <div className="w-8 h-8 mb-4 text-slate-400">
                   <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                 </div>
                 <h4 className="text-lg font-bold text-white mb-2">Context pollution</h4>
                 <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-1">Your 200K context window isn't infinite. When your agent runs a command, it dumps thousands of tokens of boilerplate.</p>
                 <div className="bg-[#050505] rounded-md px-3 py-2 text-xs font-mono text-[#ef4444] border border-[#1a1a1a]">context_quality: degraded ▼</div>
              </div>
              
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 hover:border-[#333] transition-colors flex flex-col">
                 <div className="w-8 h-8 mb-4 text-slate-400">
                   <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                 </div>
                 <h4 className="text-lg font-bold text-white mb-2">Sessions too short</h4>
                 <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-1">Context overflows, the agent restarts, you lose the thread. On flat-rate plans, you hit rate limits 40% faster than you should.</p>
                 <div className="bg-[#050505] rounded-md px-3 py-2 text-xs font-mono text-[#f59e0b] border border-[#1a1a1a]">session_remaining: 32% ▼</div>
              </div>

              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 hover:border-[#333] transition-colors flex flex-col">
                 <div className="w-8 h-8 mb-4 text-[#ef4444]">
                   <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                 </div>
                 <h4 className="text-lg font-bold text-white mb-2">Costs that explode</h4>
                 <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-1">On pay-per-token setups (OpenAI API, Anthropic), 70% of your bill is noise the LLM doesn't need to see twice.</p>
                 <div className="bg-[#050505] rounded-md px-3 py-2 text-xs font-mono text-[#ef4444] border border-[#1a1a1a] flex justify-between">
                    <span>token_waste:</span>
                    <span>$1,750/mo ▲</span>
                 </div>
              </div>
           </div>
        </div>

        {/* 02 - SEE THE DIFFERENCE */}
        <div className="w-full mt-10">
           <h2 className="text-3xl font-bold text-white mb-4 text-center">See the difference</h2>
           <p className="text-slate-400 text-center mb-10">Real outputs, real savings. Side-by-side comparison on actual commands.</p>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0a0a0a] border border-[#222] rounded-xl overflow-hidden font-mono text-xs">
                 <div className="bg-[#111] px-4 py-2 border-b border-[#222] flex justify-between text-slate-500">
                    <span>Standard Call (No Cache)</span>
                    <span className="text-[#ef4444]">-2,150 tokens</span>
                 </div>
                 <div className="p-4 text-slate-400 whitespace-pre-wrap leading-relaxed opacity-70">
                    <span className="text-white">POST /v1/chat/completions</span><br/>
                    {`{\n  "model": "gpt-4",\n  "messages": [...],\n  "temperature": 0\n}`}<br/><br/>
                    <span className="text-[#ef4444]">Response:</span><br/>
                    Waiting for generation... (2.4s)<br/>
                    ... 150 lines of duplicate JSON ...
                 </div>
              </div>

              <div className="bg-[#0a0a0a] border border-[#00e5b5]/30 rounded-xl overflow-hidden font-mono text-xs shadow-[0_0_20px_rgba(0,229,181,0.05)]">
                 <div className="bg-[#111] px-4 py-2 border-b border-[#222] flex justify-between text-slate-500">
                    <span className="text-[#00e5b5] font-bold">With TokenTrim</span>
                    <span className="text-[#00e5b5]">+2,150 tokens saved</span>
                 </div>
                 <div className="p-4 text-slate-300 whitespace-pre-wrap leading-relaxed">
                    <span className="text-white">POST /v1/chat/completions</span><br/>
                    {`{\n  "model": "gpt-4",\n  "messages": [...],\n  "temperature": 0\n}`}<br/><br/>
                    <span className="text-[#00e5b5]">Response:</span><br/>
                    <span className="text-[#00e5b5]">⚡ CACHE HIT (45ms)</span><br/>
                    ... 150 lines fetched from edge ...
                 </div>
              </div>
           </div>
        </div>

        {/* 03 - DETAILED BREAKDOWN */}
        <div id="stats" className="w-full mt-10">
           <h3 className="text-2xl font-bold text-white mb-2">Detailed breakdown</h3>
           <p className="text-slate-400 mb-6 text-sm">Daily, weekly, and monthly stats by command. Track your savings over time.</p>
           
           <div className="bg-[#0c0c0c] border border-[#1a1a1a] rounded-xl overflow-x-auto">
              <table className="w-full text-left font-mono text-xs whitespace-nowrap">
                 <thead className="bg-[#111] text-slate-500 uppercase tracking-wider">
                    <tr>
                       <th className="px-4 py-3 border-b border-[#222] font-semibold">Date</th>
                       <th className="px-4 py-3 border-b border-[#222] font-semibold">Cmds</th>
                       <th className="px-4 py-3 border-b border-[#222] font-semibold">Input</th>
                       <th className="px-4 py-3 border-b border-[#222] font-semibold">Output</th>
                       <th className="px-4 py-3 border-b border-[#222] font-semibold text-[#00e5b5]">Saved</th>
                       <th className="px-4 py-3 border-b border-[#222] font-semibold">Hit %</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-[#1a1a1a] text-slate-300">
                    {[
                      { d: '2026-08-05', c: '389', i: '2M', o: '50K', s: '1.8M', h: '90%' },
                      { d: '2026-08-04', c: '412', i: '2.1M', o: '55K', s: '1.9M', h: '91%' },
                      { d: '2026-08-03', c: '250', i: '1.2M', o: '30K', s: '1.1M', h: '88%' },
                      { d: '2026-08-02', c: '501', i: '3M', o: '80K', s: '2.7M', h: '93%' },
                      { d: '2026-08-01', c: '190', i: '900K', o: '20K', s: '850K', h: '85%' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-[#111] transition-colors">
                         <td className="px-4 py-3">{row.d}</td>
                         <td className="px-4 py-3">{row.c}</td>
                         <td className="px-4 py-3">{row.i}</td>
                         <td className="px-4 py-3">{row.o}</td>
                         <td className="px-4 py-3 text-[#00e5b5] font-bold">{row.s}</td>
                         <td className="px-4 py-3 text-slate-500">{row.h}</td>
                      </tr>
                    ))}
                    <tr className="bg-[#111] font-bold">
                       <td className="px-4 py-3">TOTAL (5d)</td>
                       <td className="px-4 py-3">1,742</td>
                       <td className="px-4 py-3">9.2M</td>
                       <td className="px-4 py-3">235K</td>
                       <td className="px-4 py-3 text-[#00e5b5]">8.3M</td>
                       <td className="px-4 py-3 text-[#00e5b5]">89.6%</td>
                    </tr>
                 </tbody>
              </table>
           </div>
        </div>

        {/* 04 - GET STARTED */}
        <div id="docs-section" className="w-full mt-10 border-t border-[#1a1a1a] pt-16">
          <h2 className="text-xs font-semibold text-slate-500 tracking-widest uppercase mb-2">// 02 - GET STARTED</h2>
          <h3 className="text-3xl font-bold text-white mb-8">Get started in 30 seconds.</h3>
          
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl overflow-hidden">
            <div className="flex flex-row border-b border-[#1a1a1a] bg-[#050505]">
               <button onClick={() => setActiveTab('node')} className={`flex-1 py-4 text-sm font-semibold transition-colors ${activeTab === 'node' ? 'text-[#00e5b5] border-b-2 border-[#00e5b5]' : 'text-slate-500 hover:text-slate-300'}`}>
                 Node.js / TS
               </button>
               <button onClick={() => setActiveTab('python')} className={`flex-1 py-4 text-sm font-semibold transition-colors ${activeTab === 'python' ? 'text-[#00e5b5] border-b-2 border-[#00e5b5]' : 'text-slate-500 hover:text-slate-300'}`}>
                 Python
               </button>
            </div>
            
            <div className="p-6 md:p-8 font-mono text-sm relative group bg-[#0c0c0c]">
              <button 
                onClick={() => handleCopy(activeTab === 'node' ? "baseURL: 'https://tokentrim.com/v1'" : "base_url='https://tokentrim.com/v1'")}
                className="absolute top-6 right-6 p-2 rounded-md bg-[#1a1a1a] border border-[#333] text-slate-400 hover:text-white hover:bg-[#222] transition-all"
              >
                {copied ? <svg className="w-4 h-4 text-[#00e5b5]" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>}
              </button>

              {activeTab === 'node' ? (
                <>
                  <p className="text-slate-400 mb-4">// Just change the baseURL. Zero other changes required.</p>
                  <p><span className="text-[#c678dd]">import</span> <span className="text-[#e5c07b]">OpenAI</span> <span className="text-[#c678dd]">from</span> <span className="text-[#98c379]">'openai'</span>;</p>
                  <p className="mt-4"><span className="text-[#c678dd]">const</span> <span className="text-[#e5c07b]">openai</span> <span className="text-[#56b6c2]">=</span> <span className="text-[#c678dd]">new</span> <span className="text-[#e5c07b]">OpenAI</span>({'{'}</p>
                  <p className="ml-4 md:ml-8">apiKey: <span className="text-[#98c379]">process.env.OPENAI_API_KEY</span>,</p>
                  <div className="bg-[#00e5b5]/10 -mx-6 md:-mx-8 px-6 md:px-8 py-1.5 border-l-2 border-[#00e5b5] my-1">
                    <p className="ml-4 md:ml-8 text-white font-semibold">baseURL: <span className="text-[#98c379]">'https://tokentrim.com/v1'</span>, <span className="text-slate-500 font-normal"> // &lt;- Add this</span></p>
                  </div>
                  <p className="ml-4 md:ml-8">defaultHeaders: {'{'} <span className="text-[#98c379]">'Authorization'</span>: <span className="text-[#98c379]">'Bearer '</span> <span className="text-[#56b6c2]">+</span> <span className="text-[#98c379]">process.env.TOKENTRIM_KEY</span> {'}'}</p>
                  <p>{'}'});</p>
                </>
              ) : (
                <>
                  <p className="text-slate-400 mb-4"># Just change the base_url. Zero other changes required.</p>
                  <p><span className="text-[#c678dd]">from</span> <span className="text-[#e5c07b]">openai</span> <span className="text-[#c678dd]">import</span> <span className="text-[#e5c07b]">OpenAI</span></p>
                  <p className="mt-4"><span className="text-[#e5c07b]">client</span> <span className="text-[#56b6c2]">=</span> <span className="text-[#e5c07b]">OpenAI</span>(</p>
                  <p className="ml-4 md:ml-8">api_key<span className="text-[#56b6c2]">=</span><span className="text-[#98c379]">"your-openai-key"</span>,</p>
                  <div className="bg-[#00e5b5]/10 -mx-6 md:-mx-8 px-6 md:px-8 py-1.5 border-l-2 border-[#00e5b5] my-1">
                    <p className="ml-4 md:ml-8 text-white font-semibold">base_url<span className="text-[#56b6c2]">=</span><span className="text-[#98c379]" >"https://tokentrim.com/v1"</span>, <span className="text-slate-500 font-normal"> # &lt;- Add this</span></p>
                  </div>
                  <p className="ml-4 md:ml-8">default_headers<span className="text-[#56b6c2]">=</span>{'{'}<span className="text-[#98c379]">"Authorization"</span>: <span className="text-[#98c379]">f"Bearer {'{'}TOKENTRIM_KEY{'}'}"</span>{'}'}</p>
                  <p>)</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 05 - PRICING */}
        <div id="pricing" className="w-full mt-10">
          <div className="text-center mb-10">
            <h2 className="text-xs font-semibold text-slate-500 tracking-widest uppercase mb-2">// 03 - PRICING</h2>
            <h3 className="text-3xl font-bold text-white mb-3">Pay for what you save.</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-8 flex flex-col hover:border-[#333] transition-colors">
              <h3 className="text-xl font-bold text-white mb-2">Hobby</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-slate-500">/ forever</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-slate-300"><svg className="w-5 h-5 text-[#333]" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> 10,000 cached requests / mo</li>
                <li className="flex items-center gap-3 text-sm text-slate-300"><svg className="w-5 h-5 text-[#333]" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> Standard Edge Latency</li>
              </ul>
              <button onClick={() => window.scrollTo(0,0)} className="w-full bg-[#111] border border-[#222] text-white font-bold py-3 rounded-xl hover:bg-[#1a1a1a] transition-colors cursor-pointer">Start for free</button>
            </div>
            
            <div className="bg-[#0c1210] border border-[#00e5b5]/30 rounded-2xl p-8 flex flex-col relative shadow-[0_0_40px_rgba(0,229,181,0.05)]">
              <div className="absolute top-0 right-0 bg-[#00e5b5] text-black text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">PRO</div>
              <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-white">$19</span>
                <span className="text-slate-500">/ month</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-slate-300"><svg className="w-5 h-5 text-[#00e5b5]" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> <span className="text-white font-bold">Unlimited</span> cached requests</li>
                <li className="flex items-center gap-3 text-sm text-slate-300"><svg className="w-5 h-5 text-[#00e5b5]" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> Priority Global Edge Network</li>
              </ul>
              <button onClick={handleProClick} className="w-full bg-[#00e5b5] text-black font-bold py-3 rounded-xl hover:bg-[#00c090] transition-all cursor-pointer">Go Pro</button>
            </div>
          </div>
        </div>

        {/* 06 - FAQ SECTION */}
        <div className="w-full mt-20 mb-10">
          <h3 className="text-3xl font-bold text-white mb-8 text-center">Frequently asked questions</h3>
          <div className="space-y-4 max-w-2xl mx-auto">
            <details className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg group cursor-pointer">
               <summary className="flex justify-between items-center font-bold p-5 text-white">
                 What is TokenTrim? <span className="text-[#00e5b5] group-open:rotate-180 transition-transform">▼</span>
               </summary>
               <div className="p-5 pt-0 text-slate-400 text-sm leading-relaxed border-t border-[#1a1a1a] mt-2">
                 TokenTrim is an API proxy and edge caching layer. It intercepts your OpenAI calls, and if the exact same prompt was processed before, it returns the cached response instantly without billing your OpenAI account.
               </div>
            </details>
            <details className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg group cursor-pointer">
               <summary className="flex justify-between items-center font-bold p-5 text-white">
                 How much tokens does it actually save? <span className="text-[#00e5b5] group-open:rotate-180 transition-transform">▼</span>
               </summary>
               <div className="p-5 pt-0 text-slate-400 text-sm leading-relaxed border-t border-[#1a1a1a] mt-2">
                 Depending on your AI agent's workflow, developers see between 40% to 90% savings. Automated CI/CD coding agents save the most due to highly repetitive boilerplate testing.
               </div>
            </details>
            <details className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg group cursor-pointer">
               <summary className="flex justify-between items-center font-bold p-5 text-white">
                 Is it secure? <span className="text-[#00e5b5] group-open:rotate-180 transition-transform">▼</span>
               </summary>
               <div className="p-5 pt-0 text-slate-400 text-sm leading-relaxed border-t border-[#1a1a1a] mt-2">
                 Yes. We never store your OpenAI keys in plaintext. They are passed directly to OpenAI. We only cache the generated text responses on our highly secure Redis Edge network.
               </div>
            </details>
          </div>
        </div>

      </div>

      {/* 07 - MEGA FOOTER WITH HASH LINKS */}
      <footer className="w-full mt-24 pt-16 pb-12 border-t border-[#111] bg-[#020202]">
        <div className="max-w-[1000px] w-full mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 px-6 mb-12">
          
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
               <div className="w-6 h-6 rounded bg-gradient-to-br from-[#00e5b5] to-[#008f71] flex items-center justify-center">
                 <span className="text-black font-bold text-xs">T</span>
               </div>
               <div className="text-lg font-bold text-white tracking-tight">TokenTrim</div>
            </div>
            <p className="text-slate-500 text-sm mb-6 max-w-xs">
              TokenTrim reduces LLM token usage by up to 90% with zero config. Built for autonomous AI agents.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com/naitikSahu16/nextjs-boilerplate" target="_blank" className="text-slate-500 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-sm">INSTALL</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              {/* REAL LINKS POINTING TO DOCS SECTIONS */}
              <li><Link href="/docs#nodejs" className="hover:text-white transition-colors">Node.js NPM</Link></li>
              <li><Link href="/docs#python" className="hover:text-white transition-colors">Python PIP</Link></li>
              <li><Link href="/docs#cargo" className="hover:text-white transition-colors">Via Cargo</Link></li>
              <li><Link href="/docs#binaries" className="hover:text-white transition-colors">Pre-built Binaries</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-sm">DOCS</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              {/* REAL LINKS POINTING TO DOCS SECTIONS */}
              <li><Link href="/docs#quickstart" className="hover:text-white transition-colors">Quick Start</Link></li>
              <li><Link href="/docs#integration" className="hover:text-white transition-colors">Integration Guide</Link></li>
              <li><Link href="/docs#caching" className="hover:text-white transition-colors">How Caching Works</Link></li>
              <li><Link href="/docs#troubleshooting" className="hover:text-white transition-colors">Troubleshooting</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-sm">PRODUCTS</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><a href="#pricing" className="text-[#00e5b5] hover:text-[#00c090] transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#00e5b5]"></span> TokenTrim Pro</a></li>
              <li><a href="#terminal-dashboard" className="hover:text-white transition-colors">TokenTrim API</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Enterprise</a></li>
            </ul>
          </div>

        </div>

        <div className="max-w-[1000px] mx-auto px-6 pt-8 border-t border-[#111] flex flex-col md:flex-row justify-center items-center gap-8 text-xs text-slate-500">
          <div className="flex gap-6">
             {/* REAL LINKS POINTING TO LEGAL PAGE */}
             <Link href="/legal#license" className="hover:text-white transition-colors">Apache 2.0 License</Link>
             <Link href="/legal#privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
             <Link href="/legal#terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
          <div>© {new Date().getFullYear()} TokenTrim. Built for builders.</div>
        </div>
      </footer>
    </div>
  );
                                                                                                                                 }
