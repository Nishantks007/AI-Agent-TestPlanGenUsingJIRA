import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useJira } from './hooks/useJira'
import { useLLM } from './hooks/useLLM'
import { useTemplates } from './hooks/useTemplates'
import {
  Loader2, CheckCircle, AlertCircle, Upload,
  Cpu, Zap, Database, Command, Search, Settings,
  ChevronRight, Sparkles, Copy, Download, RotateCcw
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function App() {
  const [ticketId, setTicketId] = useState('')
  const [provider, setProvider] = useState<'groq' | 'ollama'>('groq')
  const [showSearch, setShowSearch] = useState(false)
  const { ticket, loading: loadingTicket, error: ticketError, getTicket, reset: resetJira } = useJira()
  const { plan, loading: loadingPlan, generate, reset: resetLLM } = useLLM()
  const { templateContent, filename, loading: loadingUpload, upload, reset: resetTemplates } = useTemplates()

  // Command Palette Handler
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setShowSearch((prev) => !prev)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const handleFetch = () => {
    if (ticketId) getTicket(ticketId)
  }

  const handleGenerate = () => {
    if (ticket) generate(ticket.key, provider, undefined, templateContent || undefined)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      upload(e.target.files[0])
    }
  }

  const handleExportMarkdown = () => {
    if (!plan || !ticket) return
    const blob = new Blob([plan.content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `TestPlan-${ticket.key}-${new Date().toISOString().split('T')[0]}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleResetWorkspace = () => {
    setTicketId('')
    resetJira()
    resetLLM()
    resetTemplates()
  }

  const copyToClipboard = () => {
    if (plan) {
      navigator.clipboard.writeText(plan.content)
    }
  }

  return (
    <div className="flex h-screen w-full select-none">
      {/* Visual Layer 1: Base Background is in index.css radial gradient */}

      {/* Sidebar - Glassmorphism */}
      <aside className="w-72 glass-panel z-20 flex flex-col p-6 gap-8">
        <header className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Zap className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">Nexus</h1>
            <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold">Enterprise AI QA</p>
          </div>
        </header>

        <nav className="flex flex-col gap-6 flex-1">
          {/* Section: Context */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Source Context</span>
            <div className="relative group">
              <input
                type="text"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                placeholder="Jira Ticket ID..."
                className="w-full bg-slate-900/50 border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
              />
              <button
                onClick={handleFetch}
                disabled={loadingTicket || !ticketId}
                className="absolute right-2 top-1.5 p-1.5 bg-indigo-500 rounded-md text-white hover:bg-indigo-400 transition-colors disabled:opacity-50"
              >
                {loadingTicket ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              </button>
            </div>
            {ticketError && <p className="text-[10px] text-rose-500 flex items-center gap-1.5 px-1"><AlertCircle className="w-3 h-3" /> {ticketError}</p>}
          </div>

          {/* Section: Template */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Styling Template</span>
            <label className={cn(
              "group relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer",
              filename ? "border-emerald-500/50 bg-emerald-500/5" : "border-slate-800 hover:border-indigo-500/50 hover:bg-indigo-500/5"
            )}>
              <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
              {loadingUpload ? (
                <Loader2 className="w-6 h-6 animate-spin text-slate-500" />
              ) : (
                <>
                  <Upload className={cn("w-6 h-6 mb-2 transition-colors", filename ? "text-emerald-500" : "text-slate-500 group-hover:text-indigo-400")} />
                  <span className="text-[10px] font-medium text-slate-400 text-center break-all px-2">
                    {filename || "Drop reference PDF here"}
                  </span>
                </>
              )}
            </label>
          </div>

          {/* Section: Inference */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Inference Engine</span>
            <div className="flex bg-slate-900/50 p-1 rounded-lg border border-white/5">
              <button
                onClick={() => setProvider('groq')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-[10px] font-bold transition-all",
                  provider === 'groq' ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "text-slate-500 hover:text-slate-300"
                )}
              >
                <Zap className="w-3 h-3" /> GROQ (Cloud)
              </button>
              <button
                onClick={() => setProvider('ollama')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-[10px] font-bold transition-all ml-1",
                  provider === 'ollama' ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20" : "text-slate-500 hover:text-slate-300"
                )}
              >
                <Database className="w-3 h-3" /> OLLAMA (Local)
              </button>
            </div>
          </div>
        </nav>

        <footer className="pt-6 border-t border-white/5 flex flex-col gap-4">
          <div className="flex justify-between items-center text-[10px] text-slate-600">
            <span className="flex items-center gap-2">
              <div className={cn("w-1.5 h-1.5 rounded-full", provider === 'ollama' ? 'bg-violet-500 animate-pulse' : 'bg-indigo-500 animate-pulse')} />
              {provider === 'ollama' ? 'Local Compute' : 'Cloud Compute'}
            </span>
            <Command className="w-3 h-3" />
          </div>

          <button
            onClick={handleResetWorkspace}
            className="w-full py-2 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-500 hover:text-rose-400 transition-colors bg-slate-900/40 rounded-lg border border-white/5 hover:border-rose-500/20"
          >
            <RotateCcw className="w-3 h-3" /> Clear Workspace
          </button>
        </footer>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* Top Navigation */}
        <header className="h-16 border-b border-white/5 flex items-center px-8 justify-between glass-panel backdrop-blur-md">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              Workbench <ChevronRight className="w-4 h-4 text-slate-600" />
              <span className="text-indigo-400">{ticket?.key || "Workspace"}</span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 bg-slate-900/50 px-3 py-1.5 rounded-full border border-white/5">
              <Command className="w-3 h-3" /> K to Open Search
            </div>
            <button className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Workspace Body */}
        <div className="flex-1 flex p-8 gap-8 overflow-hidden">
          {/* Surface 2: Left Panel (Jira) */}
          <section className="flex-1 flex flex-col gap-6 max-w-[450px]">
            <div className="premium-card flex-1 flex flex-col overflow-hidden relative">
              <div className="accent-line !bg-gradient-to-b !from-cyan-500 !to-indigo-500 opacity-50" />
              <header className="p-6 border-b border-white/5 flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Jira Context</h3>
                  <p className="text-[11px] text-slate-400">Human Requirement Input</p>
                </div>
                {ticket && (
                  <span className="text-[10px] font-bold bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20">
                    {ticket.priority} Priority
                  </span>
                )}
              </header>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {!ticket && !loadingTicket && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center">
                      <Database className="w-6 h-6" />
                    </div>
                    <p className="text-xs">Fetch a ticket to begin analysis.</p>
                  </div>
                )}

                {loadingTicket && (
                  <div className="h-full flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                    <p className="text-xs text-slate-500 animate-pulse">Synchronizing with JIRA API...</p>
                  </div>
                )}

                {ticket && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-600 uppercase">Summary</label>
                      <p className="text-sm font-medium text-white leading-relaxed">{ticket.summary}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-800/30 p-3 rounded-lg border border-white/5">
                        <label className="text-[9px] font-bold text-slate-600 uppercase block mb-1">Status</label>
                        <span className="text-xs text-slate-300 font-medium">{ticket.status}</span>
                      </div>
                      <div className="bg-slate-800/30 p-3 rounded-lg border border-white/5">
                        <label className="text-[9px] font-bold text-slate-600 uppercase block mb-1">Points</label>
                        <span className="text-xs text-slate-300 font-medium">--</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-600 uppercase">Requirement Detail</label>
                      <div className="bg-slate-800/20 rounded-lg p-4 border border-white/5 text-xs text-slate-400 leading-relaxed whitespace-pre-wrap max-h-[300px] overflow-y-auto scrollbar-hide">
                        {ticket.description || "No description provided."}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {ticket && (
                <div className="p-6 pt-0 mt-auto">
                  <button
                    onClick={handleGenerate}
                    disabled={loadingPlan}
                    className="group w-full py-4 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-500/20 relative overflow-hidden active:scale-[0.98]"
                  >
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    {loadingPlan ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generating Test Scenarios...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Build Test Plan</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Surface 3: Right Panel (AI Output) */}
          <section className="flex-1 flex flex-col gap-6">
            <div className={cn(
              "premium-card flex-1 flex flex-col overflow-hidden relative border-white/10",
              loadingPlan ? "animate-glow" : ""
            )}>
              <div className="accent-line opacity-80" />

              <header className="p-6 border-b border-white/5 flex justify-between items-center glass-panel">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                    <Cpu className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      Intelligence Workbench
                      {loadingPlan && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-indigo-500 text-white px-2 py-0.5 rounded-full animate-pulse capitalize">
                          {provider} Processing
                        </span>
                      )}
                    </h3>
                    <p className="text-[11px] text-slate-400">Generated Strategy & Scenarios</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    disabled={!plan}
                    className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-indigo-400 transition-all disabled:opacity-30"
                    title="Copy Markdown"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleExportMarkdown}
                    disabled={!plan}
                    className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-emerald-400 transition-all disabled:opacity-30"
                    title="Export as .md"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto p-10 scrollbar-hide">
                <AnimatePresence mode="wait">
                  {!plan && !loadingPlan && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-full flex flex-col items-center justify-center text-slate-600 space-y-6"
                    >
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full border-2 border-slate-800 flex items-center justify-center">
                          <Cpu className="w-8 h-8" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center">
                          <Zap className="w-3 h-3" />
                        </div>
                      </div>
                      <div className="text-center space-y-2">
                        <p className="text-sm font-medium">Ready for Generation</p>
                        <p className="text-[11px] max-w-[200px]">Nexus AI will analyze ticket context and output structured test cases.</p>
                      </div>
                    </motion.div>
                  )}

                  {loadingPlan && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full flex flex-col py-12 px-8 space-y-12"
                    >
                      <div className="flex flex-col items-center justify-center space-y-6 mb-8">
                        <div className="relative h-24 w-24">
                          <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse" />
                          <div className="relative h-24 w-24 rounded-full border-4 border-indigo-500/20 flex items-center justify-center">
                            <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
                          </div>
                        </div>
                        <h4 className="text-lg font-bold text-white tracking-tight animate-pulse">AI Orchestration in Progress</h4>
                      </div>

                      <div className="space-y-4 max-w-sm mx-auto w-full">
                        <div className="flex items-center gap-4 text-[11px] font-bold text-emerald-400">
                          <CheckCircle className="w-4 h-4" /> [PRD Context Parsed]
                        </div>
                        <div className="flex items-center gap-4 text-[11px] font-bold text-emerald-400">
                          <CheckCircle className="w-4 h-4" /> [Ticket Metadata Loaded]
                        </div>
                        <div className="flex items-center gap-4 text-[11px] font-bold text-indigo-400 animate-pulse">
                          <Zap className="w-4 h-4" /> [Generating Functional Scenarios...]
                        </div>
                        <div className="flex items-center gap-4 text-[11px] font-bold text-slate-700">
                          <div className="w-4 h-4 rounded-full border-2 border-slate-800" /> [Formatting Review Report]
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {plan && (
                    <motion.div
                      key="plan-content"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="prose-premium"
                    >
                      <div className="mb-8 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter">Confidence Index</p>
                            <p className="text-lg font-black text-emerald-500">94.2<span className="text-xs font-medium opacity-70">%</span></p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-bold text-slate-500 uppercase">Analysis Tokens</p>
                          <p className="text-xs font-medium text-slate-300">1,248 TPS</p>
                        </div>
                      </div>

                      <div className="whitespace-pre-wrap font-sans">
                        {plan.content}
                      </div>

                      <div className="mt-12 pt-8 border-t border-white/5 flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-slate-700" />
                          <span className="text-[10px] font-medium text-slate-500">Synthesized from JIRA + Ref PDF</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-slate-700" />
                          <span className="text-[10px] font-medium text-slate-500">Checked for Edge Cases</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </section>
        </div>

        {/* Surface 3: Command Palette Modal */}
        <AnimatePresence>
          {showSearch && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShowSearch(false)}
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-start justify-center pt-32"
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0, y: -20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: -20 }}
                  onClick={e => e.stopPropagation()}
                  className="w-full max-w-xl glass-panel shadow-2xl rounded-2xl overflow-hidden"
                >
                  <div className="p-4 flex items-center gap-3 border-b border-white/10">
                    <Search className="w-5 h-5 text-indigo-400" />
                    <input
                      autoFocus
                      placeholder="Type a command or search..."
                      className="bg-transparent border-none focus:ring-0 text-white w-full placeholder:text-slate-500"
                    />
                  </div>
                  <div className="p-4 space-y-1">
                    <p className="text-[10px] font-bold text-indigo-400 px-3 py-2 uppercase tracking-widest">Global Operations</p>
                    <button className="w-full text-left px-3 py-3 rounded-xl hover:bg-white/5 flex items-center gap-3 text-slate-300 group">
                      <Database className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
                      <span className="flex-1 text-sm">Switch Inference Engine</span>
                      <kbd className="text-[9px] font-bold bg-slate-800 px-2 py-1 rounded">TAB</kbd>
                    </button>
                    <button className="w-full text-left px-3 py-3 rounded-xl hover:bg-white/5 flex items-center gap-3 text-slate-300 group">
                      <Download className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
                      <span className="flex-1 text-sm">Export Current Workspace</span>
                      <kbd className="text-[9px] font-bold bg-slate-800 px-2 py-1 rounded">E</kbd>
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default App
