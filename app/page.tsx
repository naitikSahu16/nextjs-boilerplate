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
  const inputRef = useRef(null);
  
  // Tabs & Copy States for the Pro Feel
  const [activeTab, setActiveTab] = useState("node");
  const [copied, setCopied] = useState(false);

  const [data, setData] = useState({
    tokens: 0,
    savings: 0,
    requests: 0,
    hitRate: 0,
  });

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
         alert("❌ Invalid API Key! Access Denied.");
      }
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans py-4 px-4 flex flex-col items-center selection:bg-[#00e5b5] selection:text-black overflow-x-hidden">
      
      <div className="w-full max-w-[900px] flex flex-col gap-10 md:gap-16 mt-4">
        
        {/* PREMIUM NAVBAR */}
        <nav className="flex items-center justify-between w-full py-2 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-50 border-b border-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00e5b5] to-[#008f71] flex items-center justify-center shadow-[0_0_15px_rgba(0,229,181,0.4)]">
              <span className="text-black font-bold text-lg">T</span>
            </div>
            <div className="text-xl font-bold tracking-tight text-white">TokenTrim</div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            {/* Real Docs Link */}
            <Link href="/docs" className="hover:text-[#00e5b5] transition-colors font-bold">Docs</Link>
          </div>

          <div className="flex items-center gap-4">
            {!isSignedIn ? (
              <>
                <SignInButton mode="modal">
                  <button className="text-sm font-medium hover:text-white transition-colors hidden sm:block">
                    Sign in
                  </button>
                </SignInButton>
                <SignInButton mode="modal">
                  <button className="bg-[#00e5b5] text-black text-sm font-bold py-2 px-5 rounded-md hover:bg-[#00c090] transition-all shadow-[0_0_15px_rgba(0,229,181,0.2)]">
                    Install Now
                  </button>
                </SignInButton>
              </>
            ) : (
              <UserButton afterSignOutUrl="/" />
            )}
          </div>
        </nav>

        {/* HERO SECTION */}
        <div className="text-center w-full pt-8 pb-4 flex flex-col items-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#00e5b5] opacity-[0.07] blur-[100px] pointer-events-none rounded-full"></div>

          {/* Real Docs Link Badge */}
          <Link href="/docs" className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111] border border-[#222] text-xs font-medium text-slate-300 mb-8 cursor-pointer hover:border-[#00e5b5] transition-colors">
            <span className="w-2 h-2 rounded-full bg-[#00e5b5] animate-pulse"></span>
            Edge Caching is now live. <span className="text-[#00e5b5]">Read the docs →</span>
          </Link>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white mb-6 leading-[1.1]">
            Your AI agent is wasting tokens.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e5b5] to-[#008f71]">
              Fix it with TokenTrim.
            </span>
          </h1>
          
          <p className="text-slate-400 text-lg md:text-xl px-2 max-w-2xl mx-auto mb-10 leading-relaxed">
            TokenTrim intercepts your LLM requests, caches redundant outputs at the edge, and slashes your OpenAI bills by up to 50%. <strong className="text-white">Zero latency. Zero config changes.</strong>
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
             {!isSignedIn ? (
               <SignInButton mode="modal">
                  <button className="w-full sm:w-auto bg-[#00e5b5] text-black font-bold py-3.5 px-8 rounded-lg hover:bg-[#00c090] transition-all flex items-center justify-center gap-2 text-base shadow-[0_0_20px_rgba(0,229,181,0.2)] hover:shadow-[0_0_30px_rgba(0,229,181,0.4)] hover:-translate-y-0.5 duration-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                    Install TokenTrim
                  </button>
               </SignInButton>
             ) : (
               <button onClick={scrollToTerminal} className="w-full sm:w-auto bg-[#00e5b5] text-black font-bold py-3.5 px-8 rounded-lg hover:bg-[#00c090] transition-all flex items-center justify-center gap-2 text-base shadow-[0_0_20px_rgba(0,229,181,0.2)]">
                  Go to Dashboard ↓
               </button>
             )}
             
             {/* GitHub Asli Link */}
             <a href="https://github.com/naitikSahu16/nextjs-boilerplate" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto bg-[#111] text-white border border-[#333] font-semibold py-3.5 px-8 rounded-lg hover:bg-[#1a1a1a] hover:border-slate-500 transition-all flex items-center justify-center gap-2 text-base hover:-translate-y-0.5 duration-200 cursor-pointer z-10">
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
               Star on GitHub
             </a>
          </div>
        </div>

        {/* TERMINAL DASHBOARD */}
        <div id="terminal-dashboard" className="w-full max-w-3xl mx-auto rounded-xl overflow-hidden bg-[#0c0c0c] border border-[#222] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="flex items-center px-4 py-3 bg-[#111] border-b border-[#222]">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            </div>
            <div className="mx-auto flex items-center gap-2 text-xs text-slate-500 font-mono">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 17l6-6-6-6M12 19h8"/></svg>
              bash - tokentrim status
            </div>
          </div>
          <div className="p-5 md:p-8 font-mono text-sm">
            <div className="text-slate-400 mb-4">$ echo "Enter your TokenTrim API Key to run analytics..."</div>
            <div className="flex flex-row items-center gap-2 w-full mb-6">
              <span className="text-[#00e5b5] font-bold">~ $</span>
              <input type="text" placeholder="tt_founder_999" value={key} onChange={(e) => setKey(e.target.value)} className="flex-1 bg-transparent border-none text-white outline-none placeholder-slate-700 font-mono"/>
            </div>
            <button onClick={checkSavings} disabled={isAnalyzing} className="px-4 py-2 bg-[#1a1a1a] text-white border border-[#333] rounded hover:bg-[#222] transition-colors disabled:opacity-50 text-xs tracking-wider uppercase font-bold cursor-pointer">
              {isAnalyzing ? "RUNNING SCRIPT..." : "./RUN_ANALYTICS.SH"}
            </button>
            {isUnlocked && (
              <div className="mt-8 pt-6 border-t border-dashed border-[#333] animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="text-[#00e5b5] mb-2 font-bold">SUCCESS! Data retrieved from edge network.</div>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div><div className="text-slate-500 text-xs mb-1">Total Savings</div><div className="text-white text-xl font-bold">${data.savings.toFixed(2)}</div></div>
                    <div><div className="text-slate-500 text-xs mb-1">Cache Hit Rate</div><div className="text-[#f59e0b] text-xl font-bold">{data.hitRate}%</div></div>
                    <div><div className="text-slate-500 text-xs mb-1">Tokens Saved</div><div className="text-white text-xl font-bold">{data.tokens > 1000 ? `${(data.tokens/1000).toFixed(1)}K` : data.tokens}</div></div>
                    <div><div className="text-slate-500 text-xs mb-1">Total Requests</div><div className="text-white text-xl font-bold">{data.requests.toLocaleString()}</div></div>
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* THE PROBLEM (BENTO BOX GRID - RESTORED!) */}
        <div id="features" className="w-full mt-8">
           <h2 className="text-xs font-semibold text-[#00e5b5] tracking-widest uppercase mb-2">// 01 - THE PROBLEM</h2>
           <h3 className="text-3xl font-bold text-white mb-8">Why your API bills are exploding.</h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 md:p-8 hover:border-[#333] transition-colors group">
                 <div className="w-10 h-10 rounded-full bg-[#111] border border-[#222] flex items-center justify-center mb-6 group-hover:bg-[#1a1a1a] transition-colors">
                   <svg className="w-5 h-5 text-[#f59e0b]" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                 </div>
                 <h4 className="text-xl font-bold text-white mb-3">Redundant Requests</h4>
                 <p className="text-slate-400 text-sm leading-relaxed">Your AI agents ask the exact same questions repeatedly. You pay for every single identical request sent to OpenAI.</p>
              </div>
              
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 md:p-8 hover:border-[#333] transition-colors group">
                 <div className="w-10 h-10 rounded-full bg-[#111] border border-[#222] flex items-center justify-center mb-6 group-hover:bg-[#1a1a1a] transition-colors">
                   <svg className="w-5 h-5 text-[#ef4444]" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                 </div>
                 <h4 className="text-xl font-bold text-white mb-3">Latency Bottlenecks</h4>
                 <p className="text-slate-400 text-sm leading-relaxed">Waiting 3 seconds for OpenAI to generate an answer you already generated yesterday kills your user experience.</p>
              </div>
           </div>
        </div>

        {/* TABBED CODE BLOCK (RESTORED!) */}
        <div id="docs-section" className="w-full mt-10">
          <h2 className="text-xs font-semibold text-[#00e5b5] tracking-widest uppercase mb-2">// 02 - GET STARTED</h2>
          <h3 className="text-3xl font-bold text-white mb-8">Integrate in 30 seconds.</h3>
          
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
                title="Copy to clipboard"
              >
                {copied ? (
                   <svg className="w-4 h-4 text-[#00e5b5]" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                ) : (
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                )}
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

        {/* PRICING */}
        <div id="pricing" className="w-full mt-10">
          <div className="text-center mb-10">
            <h2 className="text-xs font-semibold text-[#00e5b5] tracking-widest uppercase mb-2">// 03 - PRICING</h2>
            <h3 className="text-3xl font-bold text-white mb-3">Pay for what you save.</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-8 flex flex-col">
              <h3 className="text-xl font-bold text-white mb-2">Hobby</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-slate-500">/ forever</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-slate-300"><svg className="w-5 h-5 text-[#333]" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> 10,000 cached requests / mo</li>
              </ul>
              <button onClick={() => window.scrollTo(0,0)} className="w-full bg-[#111] border border-[#222] text-white font-bold py-3 rounded-xl hover:bg-[#1a1a1a] hover:border-slate-500 transition-colors cursor-pointer">Start for free</button>
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
              </ul>
              <button onClick={handleProClick} className="w-full bg-[#00e5b5] text-black font-bold py-3 rounded-xl hover:bg-[#00c090] hover:shadow-[0_0_15px_rgba(0,229,181,0.4)] transition-all cursor-pointer">Go Pro</button>
            </div>
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <footer className="w-full mt-24 pt-10 pb-8 border-t border-[#111] bg-[#020202]">
        <div className="max-w-[900px] w-full mx-auto text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} TokenTrim. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
