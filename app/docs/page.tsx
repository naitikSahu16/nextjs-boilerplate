import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-[#00e5b5] selection:text-black">
      
      {/* DOCS NAVBAR */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a] bg-[#050505] sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link href="/" className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00e5b5] to-[#008f71] flex items-center justify-center cursor-pointer">
            <span className="text-black font-bold text-lg">T</span>
          </Link>
          <span className="text-xl font-bold text-white border-l border-[#333] pl-3 ml-1">Documentation</span>
        </div>
        <Link href="/" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
           ← Back to Home
        </Link>
      </nav>

      <div className="max-w-[800px] mx-auto py-12 px-6">
         <h1 className="text-4xl font-extrabold text-white mb-4">TokenTrim Quickstart</h1>
         <p className="text-lg text-slate-400 mb-12">Learn how to intercept LLM calls and save tokens instantly.</p>

         <div className="space-y-12">
            
            {/* SECTION 1 */}
            <section>
               <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-[#1a1a1a]">1. How it works 🔗</h2>
               <p className="text-slate-400 mb-4 leading-relaxed">
                 TokenTrim acts as a proxy between your AI application and the LLM provider (like OpenAI). 
                 When you make a request, TokenTrim checks its globally distributed Edge Cache. If the exact prompt was asked before, 
                 it returns the cached response in milliseconds. If not, it passes it to OpenAI, saves the answer, and returns it to you.
               </p>
               <div className="bg-[#0a0a0a] border border-[#222] rounded-xl p-6 font-mono text-sm text-slate-400">
                 Raw output: <span className="text-white">1000 tokens</span> <br/>
                 Cached output: <span className="text-[#00e5b5]">0 tokens billed to OpenAI</span>
               </div>
            </section>

            {/* SECTION 2 */}
            <section>
               <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-[#1a1a1a]">2. Node.js Installation</h2>
               <p className="text-slate-400 mb-4">You do not need to learn a new SDK. Keep using the official OpenAI package.</p>
               
               <div className="bg-[#0c0c0c] border border-[#222] rounded-xl overflow-hidden font-mono text-sm">
                  <div className="bg-[#111] px-4 py-2 border-b border-[#222] text-slate-500">app.js</div>
                  <div className="p-6">
                     <p><span className="text-[#c678dd]">import</span> <span className="text-[#e5c07b]">OpenAI</span> <span className="text-[#c678dd]">from</span> <span className="text-[#98c379]">'openai'</span>;</p>
                     <br/>
                     <p><span className="text-[#c678dd]">const</span> <span className="text-[#e5c07b]">openai</span> <span className="text-[#56b6c2]">=</span> <span className="text-[#c678dd]">new</span> <span className="text-[#e5c07b]">OpenAI</span>({'{'}</p>
                     <p className="ml-4">apiKey: <span className="text-[#98c379]">process.env.OPENAI_API_KEY</span>,</p>
                     <p className="ml-4 text-white font-bold bg-[#00e5b5]/10 px-2 py-1 border-l-2 border-[#00e5b5]">baseURL: <span className="text-[#98c379]">'https://tokentrim.com/v1'</span>,</p>
                     <p className="ml-4">defaultHeaders: {'{'} <span className="text-[#98c379]">'Authorization'</span>: <span className="text-[#98c379]">'Bearer '</span> <span className="text-[#56b6c2]">+</span> <span className="text-[#98c379]">process.env.TOKENTRIM_KEY</span> {'}'}</p>
                     <p>{'}'});</p>
                  </div>
               </div>
            </section>

         </div>
      </div>
    </div>
  );
}
