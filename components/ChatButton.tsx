'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { type Session } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';

interface Props {
  session: Session;
}

export default function ChatButton({ session }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 shadow-md shadow-primary/10 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
      >
        <MessageCircle size={18} className={`transition-transform duration-300 ${open ? 'rotate-90' : ''}`} />
        {open ? 'Close Chat' : 'Ask Follow-up Question'}
      </button>

      {open && <ChatPanel session={session} onClose={() => setOpen(false)} />}
    </div>
  );
}

function ChatPanel({ session, onClose }: Props & { onClose: () => void }) {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const user = useAuthStore((s) => s.user);
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('auth-token='))
    ?.split('=')[1];

  // Auto-scrolling on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading || !token) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sessionId: session._id,
          message: input,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
    } catch (err: any) {
      setMessages((prev) => [...prev, { role: 'assistant', content: `Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-card text-foreground rounded-2xl w-full max-w-xl h-[85vh] max-h-[700px] flex flex-col border border-card-border shadow-2xl overflow-hidden">
        
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-card-border bg-secondary/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Bot size={18} />
            </div>
            <div>
              <h3 className="font-bold tracking-tight text-sm sm:text-base">AI Technique Coach</h3>
              <p className="text-xs text-muted-foreground">Interactive Assistance</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Chat History Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-transparent to-secondary/10">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center h-full max-w-xs mx-auto space-y-3">
              <div className="p-4 rounded-2xl bg-secondary text-muted-foreground">
                <MessageCircle size={28} />
              </div>
              <p className="text-sm font-medium">Have layout or execution queries?</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Ask specific questions regarding structural gaps, drill steps, or targeted improvements.
              </p>
            </div>
          )}

          {messages.map((m, i) => {
            const isUser = m.role === 'user';
            return (
              <div key={i} className={`flex gap-3 items-end ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && (
                  <div className="w-7 h-7 rounded-full bg-secondary border border-card-border flex items-center justify-center text-primary text-xs shrink-0 mb-1">
                    <Bot size={14} />
                  </div>
                )}
                <div className={`max-w-[78%] px-4 py-2.5 shadow-sm text-sm ${
                  isUser
                    ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-none'
                    : 'bg-secondary text-secondary-foreground border border-card-border rounded-2xl rounded-bl-none leading-relaxed'
                }`}>
                  {m.content}
                </div>
                {isUser && (
                  <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-xs shrink-0 mb-1 font-semibold">
                    <User size={14} />
                  </div>
                )}
              </div>
            );
          })}

          {/* Premium Skeleton Loading Wave */}
          {loading && (
            <div className="flex gap-3 items-end justify-start">
              <div className="w-7 h-7 rounded-full bg-secondary border border-card-border flex items-center justify-center text-primary text-xs shrink-0 mb-1">
                <Bot size={14} />
              </div>
              <div className="bg-secondary border border-card-border px-5 py-3 rounded-2xl rounded-bl-none flex gap-1.5 items-center">
                <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Box Actions */}
        <div className="p-4 border-t border-card-border bg-card">
          <div className="flex gap-2 items-center relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask a question about your technique..."
              className="flex-1 pl-4 pr-12 py-3 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground text-sm placeholder:text-muted-foreground/70 transition-all"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="absolute right-2 p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-30 transition-all"
            >
              <Send size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}