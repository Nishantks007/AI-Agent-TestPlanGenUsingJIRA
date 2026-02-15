import { useState } from 'react'
import { useJira } from './hooks/useJira'
import { useLLM } from './hooks/useLLM'

import { useTemplates } from './hooks/useTemplates'
import { Loader2, Send, FileText, CheckCircle, AlertCircle, Upload } from 'lucide-react'

function App() {
  const [ticketId, setTicketId] = useState('')
  const [provider, setProvider] = useState<'groq' | 'ollama'>('groq')
  const { ticket, loading: loadingTicket, error: ticketError, getTicket } = useJira()
  const { plan, loading: loadingPlan, error: planError, generate } = useLLM()
  const { templateContent, filename, loading: loadingUpload, error: uploadError, upload } = useTemplates()


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



  return (
    <div className="flex h-screen bg-background text-foreground font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/20 p-6 flex flex-col gap-6">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" />
          Nexus Test
        </h1>

        <div className="space-y-4">
          <label className="block text-sm font-medium">JIRA Ticket ID</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              placeholder="SCRUM-8"
              className="flex-1 px-3 py-2 bg-background border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleFetch}
              disabled={loadingTicket || !ticketId}
              className="p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {loadingTicket ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
          {ticketError && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {ticketError}</p>}
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium">Template (PDF)</label>
          <div className={`border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors ${filename ? 'border-green-500 bg-green-50/10' : 'border-muted'}`}>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="template-upload"
            />
            <label htmlFor="template-upload" className="cursor-pointer w-full h-full flex flex-col items-center">
              {loadingUpload ? (
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <Upload className={`w-6 h-6 mb-2 ${filename ? 'text-green-500' : 'text-muted-foreground'}`} />
                  <span className="text-xs text-muted-foreground break-all">
                    {filename || "Click to upload PDF"}
                  </span>
                </>
              )}
            </label>
          </div>
          {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
        </div>



        <div className="space-y-4">
          <label className="block text-sm font-medium">LLM Provider</label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value as 'groq' | 'ollama')}
            className="w-full px-3 py-2 bg-background border rounded-md text-sm"
          >
            <option value="groq">Groq (Cloud)</option>
            <option value="ollama">Ollama (Local)</option>
          </select>
        </div>

        <div className="mt-auto">
          <div className="text-xs text-muted-foreground">
            <p>Status: {provider === 'ollama' ? 'Local' : 'Cloud'}</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 border-b flex items-center px-6 justify-between bg-card">
          <h2 className="font-semibold">Test Plan Generator</h2>
          {ticket && <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">{ticket.key}</span>}
        </header>

        <div className="flex-1 overflow-auto p-6 grid grid-cols-2 gap-6">
          {/* Left: Ticket Details */}
          <div className="space-y-6">
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" /> Ticket Context
              </h3>

              {!ticket && !loadingTicket && (
                <div className="text-muted-foreground text-center py-10">
                  Enter a JIRA Ticket ID to fetch details.
                </div>
              )}

              {loadingTicket && (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              )}

              {ticket && (
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase">Summary</span>
                    <p className="text-sm font-medium">{ticket.summary}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs font-bold text-muted-foreground uppercase">Priority</span>
                      <p className="text-sm">{ticket.priority}</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-muted-foreground uppercase">Status</span>
                      <p className="text-sm">{ticket.status}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase">Description</span>
                    <div className="text-sm text-muted-foreground mt-1 max-h-40 overflow-y-auto whitespace-pre-wrap border p-2 rounded bg-muted/10">
                      {ticket.description || "No description provided."}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {ticket && (
              <button
                onClick={handleGenerate}
                disabled={loadingPlan}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg transition-all"
              >
                {loadingPlan ? <Loader2 className="w-5 h-5 animate-spin" /> : "Generate Test Plan"}
              </button>
            )}

            {planError && <p className="text-sm text-destructive mt-2 text-center">{planError}</p>}
          </div>

          {/* Right: Generated Plan */}
          <div className="bg-card border rounded-lg p-6 shadow-sm flex flex-col h-full overflow-hidden">
            <h3 className="text-lg font-medium mb-4 flex justify-between items-center">
              Generated Plan
              {templateContent && <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Custom Template Active</span>}
            </h3>

            {!plan && !loadingPlan && (
              <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm border-2 border-dashed rounded-lg">
                Result will appear here...
              </div>
            )}

            {loadingPlan && (
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground animate-pulse">Analyzing ticket & generating scenarios...</p>
              </div>
            )}

            {plan && (
              <div className="flex-1 overflow-y-auto pr-2 prose max-w-none dark:prose-invert">
                <pre className="whitespace-pre-wrap font-mono text-sm">{plan.content}</pre>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
