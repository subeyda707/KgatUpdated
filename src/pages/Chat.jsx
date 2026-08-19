import React, { useState } from 'react';
import { useKgatData } from '../DataContext.jsx';
import { API_BASE_URL } from '../config.js';

export default function Chat() {
  const { status } = useKgatData();
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'Ask me anything about the live audit trail.' }]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!question.trim()) return;
    const q = question;
    setMessages(m => [...m, { role: 'user', text: q }]);
    setQuestion('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });
      const json = await res.json();
      setMessages(m => [...m, { role: 'assistant', text: json.answer || json.error || 'No response.' }]);
    } catch (err) {
      setMessages(m => [...m, { role: 'assistant', text: `Request failed: ${err.message}` }]);
    }
    setLoading(false);
  };

  return (
    <div className="page">
      <div className="page-title">Ask KGAT</div>
      <p className="page-sub">Grounded only in the live audit trail. Answers come from the backend, never the browser directly.</p>

      <div className="section">
        <div className="chat-messages">
          {messages.map((m, i) => <div key={i} className={`msg ${m.role}`}>{m.text}</div>)}
          {loading && <div className="msg assistant">Thinking…</div>}
        </div>
        <div className="chat-row">
          <input className="ledger-input" placeholder="Ask a question…" value={question}
                 onChange={e => setQuestion(e.target.value)} onKeyDown={e => e.key==='Enter' && send()} />
          <button className="ledger-btn" onClick={send} disabled={status !== 'ready'}>Send</button>
        </div>
      </div>
    </div>
  );
}
