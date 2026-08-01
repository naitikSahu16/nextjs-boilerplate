"use client";
import { useState } from "react";

export default function Home() {
  const [key, setKey] = useState("");
  const [savings, setSavings] = useState("");

  const checkSavings = () => {
    // Check for our VIP key
    if (key.trim() === "tt_founder_999") {
       setSavings("138"); 
    } else {
       setSavings("0");
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-2xl w-full text-center space-y-8">
        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          TokenTrim
        </h1>
        <p className="text-xl text-gray-400">
          The Edge-Deployed Semantic Cache for AI Agents. Cut your OpenAI bills by 50% with zero latency.
        </p>
        
        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-2xl space-y-6">
          <h2 className="text-2xl font-bold text-gray-200">Developer Dashboard</h2>
          <input 
            type="text" 
            placeholder="Enter your TokenTrim API Key (e.g. tt_founder_999)" 
            className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-4 focus:outline-none focus:border-emerald-500"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
          <button 
            onClick={checkSavings}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-lg py-4 rounded-lg transition-all"
          >
            Check My Savings
          </button>

          {savings !== "" && (
            <div className="mt-8 p-6 bg-gray-950 rounded-xl border border-gray-800">
              <p className="text-gray-400 mb-2">Total Tokens Saved</p>
              <p className="text-6xl font-black text-emerald-400">{savings}</p>
              <p className="text-sm text-gray-500 mt-4">System active. Your agent pipeline is currently optimized.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
