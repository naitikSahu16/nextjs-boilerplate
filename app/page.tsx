"use client";
import { useState } from "react";

export default function Home() {
  const [key, setKey] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [realTokens, setRealTokens] = useState("0");
  const [errorMsg, setErrorMsg] = useState("");

  const checkSavings = async () => {
    if (!key.trim()) return;
    
    setIsAnalyzing(true);
    setSuccess(false);
    setErrorMsg("");

    try {
      // Direct connection to your live Upstash Database (Read-Only)
      const res = await fetch(`https://clean-sunbird-149824.upstash.io/get/user:${key.trim()}`, {
        headers: {
          Authorization: "Bearer gQAAAAAAAk1AAAIgcDFmOWYxNzUzNjkyMWQ0YzRiOTI1NGFkNmU1NmE0NjA4Nw"
        }
      });
      
      const data = await res.json();

      if (data.result) {
        // User found in DB
        const userData = JSON.parse(data.result);
        setRealTokens(userData.saved_tokens.toString());
        setSuccess(true);
      } else {
        // User not found
        setErrorMsg("Invalid API Key. Not found in database.");
      }
    } catch (err) {
      setErrorMsg("Error connecting to database.");
    }

    setIsAnalyzing(false);
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
          </div>
        </div>

        {/* INTERACTIVE DASHBOARD SECTION */}
        <div className="bg-[#0b1121] border border-[#1e293b] rounded-2xl p-8 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Left Side */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Developer Dashboard</h2>
                <p className="text-slate-400 text-sm">Enter your TokenTrim API Key to pull live data from the edge cache.</p>
              </div>
            </div>

            {/* Right Side (Input & Live Data) */}
            <div className="bg-[#030712] rounded-xl border border-[#1e293b] p-6">
              <label className="block text-sm font-medium text-slate-400 mb-3">Your TokenTrim API Key</label>
              <div className="relative mb-4">
                <input 
                  type="text" 
                  placeholder="e.g. tt_founder_999" 
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="block w-full px-4 py-3 border border-[#1e293b] rounded-lg bg-[#0b1121] text-white placeholder-slate-600 focus:outline-none focus:border-[#00e5b5] transition-all"
                />
              </div>
              
              <button 
                onClick={checkSavings}
                disabled={isAnalyzing}
                className="w-full bg-gradient-to-r from-[#00e5b5] to-[#00b56b] hover:opacity-90 text-black font-bold py-3 rounded-lg transition-all flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {isAnalyzing ? "Fetching Live Data..." : "Analyze My Savings"}
              </button>

              {/* Dynamic Database Response */}
              {success && (
                <div className="mt-6 p-5 bg-[#10172a] rounded-xl border border-[#00e5b5]/30">
                  <p className="text-slate-400 text-sm mb-1">Live Database Ping Successful</p>
                  <p className="text-slate-200">Total Tokens Saved: <span className="text-3xl font-black text-[#00e5b5] ml-2">{realTokens}</span></p>
                </div>
              )}
              
              {/* Error Message */}
              {errorMsg && (
                <div className="mt-6 p-4 bg-red-950/30 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  {errorMsg}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
