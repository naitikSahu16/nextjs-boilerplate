"use client";
import { useState } from "react";

export default function Home() {
  const [key, setKey] = useState("");
  const [savings, setSavings] = useState("");

  const checkSavings = () => {
    if (key.trim() === "tt_founder_999") {
       setSavings("138"); 
    } else {
       setSavings("0");
    }
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex flex-col items-center justify-center p-4 font-sans tracking-wide">
      <div className="max-w-md w-full text-center space-y-8">
        
        {/* Header Section */}
        <div className="space-y-4">
            <h1 className="text-4xl font-black text-[#00e5b5] tracking-tight">
              TokenTrim
            </h1>
            <p className="text-[15px] text-slate-400 leading-relaxed px-2">
              The Edge-Deployed Semantic Cache for AI Agents. Cut your OpenAI bills by 50% with zero latency.
            </p>
        </div>

        {/* Dashboard Card */}
        <div className="bg-[#111622] p-8 rounded-[1.25rem] border border-[#1e2536] shadow-2xl space-y-6">
          <h2 className="text-lg font-bold text-white tracking-wide">Developer Dashboard</h2>
          
          <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Enter your TokenTrim API Key (e.g. tt_founder_999)" 
                className="w-full bg-[#1b2234] text-white border border-[#262f45] rounded-lg p-3 text-sm focus:outline-none focus:border-[#00e5b5] placeholder-slate-500 transition-colors"
                value={key}
                onChange={(e) => setKey(e.target.value)}
              />
              <button 
                onClick={checkSavings}
                className="w-full bg-[#00cf7a] hover:bg-[#00b56b] text-black font-bold text-[15px] py-3 rounded-lg transition-all"
              >
                Check My Savings
              </button>
          </div>

          {/* Results Box */}
          {savings !== "" && (
            <div className="mt-8 p-6 bg-[#070b14] rounded-xl border border-[#1e2536] animate-in fade-in zoom-in duration-300">
              <p className="text-slate-400 mb-2 text-sm">Total Tokens Saved</p>
              <p className="text-5xl font-black text-[#00e5b5]">{savings}</p>
              <p className="text-xs text-slate-500 mt-3">System active. Your agent pipeline is currently optimized.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
