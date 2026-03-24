import Chat from './components/Chat';
import { Activity, ShieldCheck, HeartPulse } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex items-center justify-center p-4 selection:bg-cyan-500/30">

      {/* Background blobs for premium feel */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none flex justify-center items-center">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" style={{ animationDelay: "2s" }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" style={{ animationDelay: "4s" }}></div>
      </div>

      <main className="relative z-10 w-full max-w-6xl h-[90vh] bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex overflow-hidden">

        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-80 bg-white/50 dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800 p-6 z-20">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Activity className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">MediCheck AI</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase">Clinical Assistant</p>
            </div>
          </div>

          <div className="flex-1 space-y-8">
            <div className="space-y-3">
              <h2 className="text-xs font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-2 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" /> Active Session
              </h2>
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 shadow-sm">
                <p className="text-sm font-semibold mb-1">Patient: Anonymous_08</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  Secure Triaging
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-xs font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-2 uppercase tracking-wider">
                <HeartPulse className="w-4 h-4" /> System Status
              </h2>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex justify-between items-center bg-slate-100/50 dark:bg-slate-800/30 p-2.5 rounded-lg border border-transparent dark:hover:border-slate-700 transition">
                  FDA Database <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-bold bg-emerald-500/10 px-2 py-0.5 rounded-sm">ONLINE</span>
                </li>
                <li className="flex justify-between items-center bg-slate-100/50 dark:bg-slate-800/30 p-2.5 rounded-lg border border-transparent dark:hover:border-slate-700 transition">
                  Pattern Analyzer <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-bold bg-emerald-500/10 px-2 py-0.5 rounded-sm">ACTIVE</span>
                </li>
                <li className="flex justify-between items-center bg-slate-100/50 dark:bg-slate-800/30 p-2.5 rounded-lg border border-transparent dark:hover:border-slate-700 transition">
                  Gemini Engine <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-bold bg-emerald-500/10 px-2 py-0.5 rounded-sm">READY</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800 text-[10px] text-center text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3 h-3" /> End-to-end Encrypted
          </div>
        </aside>

        {/* Chat Area */}
        <section className="flex-1 flex flex-col relative bg-white dark:bg-[#0b1120] z-10 w-full rounded-r-3xl md:rounded-l-none rounded-l-3xl shadow-[-10px_0_20px_rgba(0,0,0,0.05)] dark:shadow-[-20px_0_30px_rgba(0,0,0,0.3)] border-l border-slate-200/50 dark:border-slate-800/50">
          <Chat />
        </section>

      </main>
    </div>
  );
}

export default App;
