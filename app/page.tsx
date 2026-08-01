// @ts-nocheck
"use client";
import { useState, useRef } from "react";

export default function Home() {
  const [key, setKey] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false); 
  // NEW: Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const inputRef = useRef(null);
  
  const [data, setData] = useState({
    tokens: 0,
    savings: 0,
    requests: 0,
    hitRate: 0,
  });

  // NEW: Login / Signup Handlers
  const handleAuth = (type) => {
    setIsLoggedIn(true);
    // Demo Magic: Auto-filling the valid key for a seamless experience
    setKey("tt_founder_999"); 
    if(type === 'signup') {
      alert("✨ Welcome to TokenTrim! Your new API key has been generated.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setKey("");
    setIsUnlocked(false);
    setData({ tokens: 0, savings: 0, requests: 0, hitRate: 0 });
  };

  const handleGetStarted = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const checkSavings = async () => {
    if (!key.trim()) {
      alert("Please enter an API Key first.");
      return;
    }
    
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
         alert("❌ Invalid API Key! Access Denied. Please check your key and try again.");
      }
    }
    
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-[#020614] text-white font-sans py-6 px-4 flex flex-col items-center selection:bg-[#00e5b5] selection:text-black overflow-x-hidden">
      <div className="w-full max-w-[800px] flex flex-col gap-6">
        
        {/* UPDATED NAVBAR WITH AUTH */}
        <nav className="flex items-center justify-between w-full pb-4">
          <div className="text-xl font-bold tracking-tight">TokenTrim</div>
          
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0b1120] border border-[#1e293b] text-xs font-medium text-slate-300">
            <span className="text-[#f59e0b]">⚡</span> Edge-Deployed Cache
          </div>

          <div className="flex items-center gap-4">
            {!isLoggedIn ? (
              <>
                <button onClick={() => handleAuth('login')} className="text-sm font-medium text-slate-400 hover:text-white transition-colors hidden sm:block">
                  Sign in
                </button>
                <button onClick={() => handleAuth('signup')} className="bg-[#00e5b5] text-black text-sm font-bold py-1.5 px-4 rounded-lg hover:bg-[#00c090] transition-all shadow-[0_0_15px_rgba(0,229,181,0.15)]">
                  Get API Key
                </button>
              </>
            ) : (
              <div 
                onClick={handleLogout}
                title="Click to Logout"
                className="flex-none w-9 h-9 rounded-full bg-[#1e293b] flex items-center justify-center text-slate-300 text-sm font-bold border border-[#334155] cursor-pointer hover:bg-[#334155] transition-colors"
              >
                TT
              </div>
            )}
          </div>
        </nav>

        {/* HERO */}
        <div className="text-center w-full py-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Cut your OpenAI bills by <span className="text-[#00e5b5]">50%.</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base px-2">
            Zero latency. Maximum savings. Built for AI Agents. Deployed at the edge.
          </p>
        </div>

        {/* 1. API KEY MODULE */}
        <div className="w-full bg-[#0b1221] border border-[#1e293b] rounded-xl p-5 md:p-6">
          <label className="block text-sm font-medium text-slate-300 mb-4">Your TokenTrim API Key</label>
          
          <div className="flex flex-row items-center gap-3 w-full mb-5">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="flex-none w-5 h-5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
              </div>
              <input 
                ref={inputRef}
                type="text" 
                placeholder="Enter API Key (e.g. tt_founder_999)" 
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 md:py-4 border border-[#1e293b] rounded-lg bg-[#040814] text-white placeholder-slate-600 focus:outline-none focus:border-[#00e5b5] transition-all text-sm"
              />
            </div>
            
            {/* EXACT OUTLINE PADLOCK */}
            <div className={`flex-none w-6 h-6 transition-colors duration-500 ${isUnlocked ? 'text-[#00e5b5]' : 'text-slate-400'}`}>
              {isUnlocked ? (
                <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>
              ) : (
                <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              )}
            </div>
          </div>

          <button 
            onClick={checkSavings}
            disabled={isAnalyzing}
            className="w-full bg-[#00e5b5] text-black font-semibold py-3.5 md:py-4 rounded-lg transition-all flex justify-center items-center gap-2 hover:bg-[#00c090] disabled:opacity-50 text-base md:text-lg"
          >
            {isAnalyzing ? "Analyzing Data..." : "Analyze My Savings ↗"}
          </button>
          
          <div className="mt-4 flex flex-row items-center justify-center gap-2 text-xs md:text-sm text-slate-500">
             <svg className="flex-none w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
             <span>Key never stored on servers.</span>
          </div>
        </div>

        {/* 2. GET STARTED BANNER */}
        <div 
          onClick={handleGetStarted}
          className="w-full bg-[#00e5b5] rounded-xl p-4 flex flex-row items-center justify-between cursor-pointer hover:opacity-95 transition-opacity relative overflow-hidden"
        >
           <div className="flex flex-row items-center gap-4 relative z-10">
             <div className="flex-none w-10 h-10 md:w-12 md:h-12 rounded-full bg-black flex items-center justify-center text-white">
               <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
             </div>
             <span className="text-black font-medium text-base md:text-lg">Get Started</span>
           </div>
           
           <div className="absolute top-0 right-0 bottom-0 w-1/2 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 100% 50%, black 1px, transparent 1px)', backgroundSize: '8px 8px' }}></div>
        </div>

        {/* 3. HOW IT WORKS */}
        <div className="w-full bg-[#0b1221] border border-[#1e293b] rounded-xl p-4 flex flex-row items-center justify-between cursor-pointer hover:bg-[#0f172a] transition-colors">
          <div className="flex-none w-8 h-8 md:w-10 md:h-10 rounded-full border border-[#00e5b5] flex items-center justify-center">
             <svg className="w-3 h-3 md:w-4 md:h-4 text-[#00e5b5] ml-1" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </div>
          <span className="text-slate-500 text-sm font-medium">How it works</span>
        </div>

        {/* 4. EXACT 2x2 STATS GRID */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Total Savings", value: `$${data.savings.toFixed(2)}`, icon: "$", color: "text-[#00e5b5]" },
            { label: "Cache Hit Rate", value: `${data.hitRate}%`, icon: "⚡", color: "text-[#f59e0b]" },
            { 
              label: "Tokens Saved", 
              value: data.tokens > 1000 ? `${(data.tokens/1000).toFixed(1)}K` : data.tokens, 
              icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>, 
              color: "text-white" 
            },
            { 
              label: "Total Requests", 
              value: data.requests.toLocaleString(), 
              icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>, 
              color: "text-white" 
            }
          ].map((stat, i) => (
            <div key={i} className="w-full bg-[#0b1221] border border-[#1e293b] rounded-xl p-5 md:p-6 flex flex-row items-start gap-4">
              <div className={`flex-none w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[#040814] flex items-center justify-center font-bold text-lg md:text-xl ${stat.color}`}>
                {typeof stat.icon === 'string' ? stat.icon : stat.icon}
              </div>
              <div className="flex flex-col">
                <div className="text-xs md:text-sm text-slate-100 mb-1 font-medium">{stat.label}</div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">{stat.value}</div>
                <div className="text-xs md:text-sm text-[#00e5b5]">↗ {i===0 ? '50%' : i===1 ? '12.4%' : i===2 ? '842K' : '18.6%'} <span className="text-[#00e5b5] font-normal">vs last month</span></div>
              </div>
            </div>
          ))}
        </div>

        {/* 5. DEVELOPER DASHBOARD BOTTOM */}
        <div className="w-full bg-[#0b1221] border border-[#1e293b] rounded-xl p-5 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Developer Dashboard</h2>
          <p className="text-slate-400 text-sm mb-6">Enter your TokenTrim API Key to analyze your savings.</p>
          
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
             {['Secure & Encrypted', 'Real-time Analytics', 'Edge Deployed'].map((feature, i) => (
               <div key={i} className="w-full border border-[#1e293b] rounded-lg p-3 flex flex-row items-center gap-3 bg-[#040814]">
                 <div className="flex-none w-5 h-5 rounded-full bg-[#00e5b5] flex items-center justify-center">
                   <svg className="flex-none w-3 h-3 text-black" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                 </div>
                 <span className="text-slate-200 text-xs md:text-sm font-medium">{feature}</span>
               </div>
             ))}
          </div>
        </div>

      </div>
    </div>
  );
}
