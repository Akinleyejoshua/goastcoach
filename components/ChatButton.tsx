'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
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
        className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-primary-foreground font-medium rounded-lg transition-all shadow-sm hover:shadow"
      >
        <MessageCircle size={20} />
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
  const user = useAuthStore((s) => s.user);
  const token = document.cookie.split('; ').find((row) => row.startsWith('auth-token='))?.split('=')[1];

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-card-border rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-card-border flex items-center justify-between">
          <h3 className="font-semibold text-lg text-foreground">Coach Chat</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors text-xl">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              Ask anything about your technique or the feedback.
            </p>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3.5 rounded-lg ${
                m.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground'
              }`}>
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-secondary p-3 rounded-lg text-muted-foreground">...</div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-card-border">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask a question about your technique..."
              className="flex-1 px-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground transition-all"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-primary-foreground font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
