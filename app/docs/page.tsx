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
         <h1 className="text-4xl font-extrabold text-white mb-4">TokenTrim Documentation</h1>
         <p className="text-lg text-slate-400 mb-12">Learn how to install, integrate, and save tokens instantly.</p>

         <div className="space-y-16">
            
            {/* DOCS: QUICK START */}
            <section id="quickstart" className="scroll-mt-24">
               <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-[#1a1a1a]">Quick Start</h2>
               <p className="text-slate-400 mb-4">Get up and running with TokenTrim in less than 30 seconds. All you need is your existing OpenAI script.</p>
            </section>

            {/* DOCS: HOW CACHING WORKS */}
            <section id="caching" className="scroll-mt-24">
               <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-[#1a1a1a]">How Caching Works</h2>
               <p className="text-slate-400 mb-4 leading-relaxed">
                 TokenTrim acts as a proxy between your AI application and the LLM provider. 
                 When you make a request, TokenTrim checks its globally distributed Edge Cache. If the exact prompt was asked before, 
                 it returns the cached response in milliseconds.
               </p>
               <div className="bg-[#0a0a0a] border border-[#222] rounded-xl p-6 font-mono text-sm text-slate-400">
                 Raw output: <span className="text-white">1000 tokens</span> <br/>
                 Cached output: <span className="text-[#00e5b5]">0 tokens billed to OpenAI</span>
               </div>
            </section>

            {/* DOCS: INTEGRATION GUIDE */}
            <section id="integration" className="scroll-mt-24">
               <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-[#1a1a1a]">Integration Guide</h2>
               <p className="text-slate-400 mb-4">You do not need to learn a new SDK. Keep using the official OpenAI package.</p>
            </section>

            {/* INSTALL: NODE.JS */}
            <section id="nodejs" className="scroll-mt-24">
               <h3 className="text-xl font-bold text-white mb-4">Install via Node.js (NPM)</h3>
               <div className="bg-[#0c0c0c] border border-[#222] rounded-xl p-4 font-mono text-sm text-[#00e5b5]">
                 npm install tokentrim-sdk
               </div>
            </section>

            {/* INSTALL: PYTHON */}
            <section id="python" className="scroll-mt-24">
               <h3 className="text-xl font-bold text-white mb-4">Install via Python (PIP)</h3>
               <div className="bg-[#0c0c0c] border border-[#222] rounded-xl p-4 font-mono text-sm text-[#00e5b5]">
                 pip install tokentrim
               </div>
            </section>

            {/* INSTALL: CARGO */}
            <section id="cargo" className="scroll-mt-24">
               <h3 className="text-xl font-bold text-white mb-4">Install via Cargo (Rust)</h3>
               <div className="bg-[#0c0c0c] border border-[#222] rounded-xl p-4 font-mono text-sm text-[#00e5b5]">
                 cargo add tokentrim
               </div>
            </section>

            {/* INSTALL: BINARIES */}
            <section id="binaries" className="scroll-mt-24">
               <h3 className="text-xl font-bold text-white mb-4">Pre-built Binaries</h3>
               <p className="text-slate-400 mb-4">Download the latest binaries for macOS, Linux, and Windows from our GitHub releases page.</p>
            </section>

            {/* DOCS: TROUBLESHOOTING */}
            <section id="troubleshooting" className="scroll-mt-24">
               <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-[#1a1a1a]">Troubleshooting</h2>
               <p className="text-slate-400 mb-4">Having issues? Make sure your API key is correctly set in your environment variables as <code>TOKENTRIM_KEY</code>.</p>
            </section>

         </div>
      </div>
    </div>
  );
}
