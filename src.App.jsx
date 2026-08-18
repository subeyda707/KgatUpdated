import React, { useState, useRef } from 'react';

export default function App() {
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState('all');
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'Load an export file, then ask about the audit trail.' }]);
  const [question, setQuestion] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInput = useRef(null);

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try { setData(JSON.parse(e.target.result)); }
      catch (err) { alert('Could not parse this file as JSON.'); }
    };
    reader.readAsText(file);
  };

  const trail = data?.audit_trail || [];
  const filtered = filter === 'all' ? trail : trail.filter(r => r.status.toLowerCase() === filter);

  const buildContext = () => {
    const lines = ["You are answering questions about a Knowledge Graph audit trail.",
                   "ONLY reference the records below. If asked about something not listed, say so plainly.", ""];
    trail.forEach(r => lines.push(`- ${r.who}: ${r.what} -- status=${r.status}${r.reason ? ' ('+r.reason+')' : ''}`));
    return lines.join("\n");
  };

  const send = async () => {
    if (!question.trim()) return;
    if (!apiKey) { alert('Paste your Gemini API key first.'); return; }
    if (!data) { alert('Load an export file first.'); return; }
    const q = question;
    setMessages(m => [...m, { role: 'user', text: q }]);
    setQuestion('');
    setLoading(true);
    try {
      const prompt = `${buildContext()}\n\nQuestion: ${q}`;
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });
      const json = await res.json();
      const answer = json.error ? `Error: ${json.error.message}` : json.candidates[0].content.parts[0].text;
      setMessages(m => [...m, { role: 'assistant', text: answer }]);
    } catch (err) {
      setMessages(m => [...m, { role: 'assistant', text: `Request failed: ${err.message}` }]);
    }
    setLoading(false);
  };

  const r1 = data?.rq1 || {};
  const r2 = data?.rq2 || {};
  const verifiedCount = trail.filter(r => r.status === 'VERIFIED').length;
  const rejectedCount = trail.filter(r => r.status === 'REJECTED').length;

  return (
    <div className="page">
      <div className="masthead">
        <div className="masthead-top">
          <div className="brand">KGAT<span className="dot">.</span></div>
          <div className="masthead-meta">KNOWLEDGE GRAPH<br/>AUDIT LEDGER</div>
        </div>
        <div className="title">Verification-Gated Knowledge Graph Event Documentation</div>
        <div className="subtitle">Local record — no server, no deployment.</div>
      </div>

      <div className="section">
        <div className="section-label"><span className="red">01</span> — Source File</div>
        <div className="upload-row" onClick={() => fileInput.current.click()}>
          <span>{data ? 'kgat_export.json loaded' : 'Click to load kgat_export.json'}</span>
          <span className={`upload-status ${data ? 'ok' : ''}`}>{data ? 'LOADED' : 'AWAITING FILE'}</span>
        </div>
        <input ref={fileInput} type="file" accept=".json" style={{display:'none'}}
               onChange={e => e.target.files[0] && handleFile(e.target.files[0])} />
      </div>

      {data && (
        <>
          <div className="section">
            <div className="section-label"><span className="red">02</span> — Verification (RQ1)</div>
            <div className="ledger-grid">
              <div className="ledger-cell"><div className="ledger-num">{r1.structural ? r1.structural.f1.toFixed(2) : '—'}</div><div className="ledger-lab">Structural F1</div></div>
              <div className="ledger-cell"><div className="ledger-num">{r1.authorization ? r1.authorization.f1.toFixed(2) : '—'}</div><div className="ledger-lab">Authorization F1</div></div>
              <div className="ledger-cell"><div className="ledger-num">{verifiedCount}</div><div className="ledger-lab">Verified events</div></div>
              <div className="ledger-cell"><div className="ledger-num">{rejectedCount}</div><div className="ledger-lab">Rejected events</div></div>
            </div>
          </div>

          <div className="section">
            <div className="section-label"><span className="red">03</span> — Documentation (RQ2)</div>
            <div className="ledger-grid">
              <div className="ledger-cell"><div className="ledger-num">{r2.baseline ? Math.round(r2.baseline.what_accuracy*100)+'%' : '—'}</div><div className="ledger-lab">Baseline WHAT accuracy</div></div>
              <div className="ledger-cell"><div className="ledger-num">{r2.constrained ? Math.round(r2.constrained.what_accuracy*100)+'%' : '—'}</div><div className="ledger-lab">Constrained WHAT accuracy</div></div>
            </div>
          </div>

          <div className="section">
            <div className="section-label"><span className="red">04</span> — Audit Trail</div>
            <div className="filter-row">
              <button className={`filter-btn ${filter==='all'?'active':''}`} onClick={()=>setFilter('all')}>All</button>
              <button className={`filter-btn ${filter==='verified'?'active':''}`} onClick={()=>setFilter('verified')}>Verified</button>
              <button className={`filter-btn ${filter==='rejected'?'active':''}`} onClick={()=>setFilter('rejected')}>Rejected</button>
            </div>
            {filtered.length === 0 ? <div className="empty">No records.</div> : filtered.map(r => (
              <div className="record" key={r.id}>
                <div className="record-top">
                  <span className="record-what">{r.what}</span>
                  <span className={`record-status ${r.status.toLowerCase()}`}>{r.status}</span>
                </div>
                <div className="record-meta">who: {r.who} ({(r.roles||[]).join(', ')})</div>
                {r.reason && <div className="record-reason">{r.reason}</div>}
              </div>
            ))}
          </div>

          <div className="section">
            <div className="section-label"><span className="red">05</span> — Ask KGAT</div>
            <input type="password" className="ledger-input key-input" placeholder="Gemini API key (this tab only)"
                   value={apiKey} onChange={e => setApiKey(e.target.value)} />
            <div className="chat-messages">
              {messages.map((m, i) => <div key={i} className={`msg ${m.role}`}>{m.text}</div>)}
              {loading && <div className="msg assistant">Thinking…</div>}
            </div>
            <div className="chat-row">
              <input className="ledger-input" placeholder="Ask a question…" value={question}
                     onChange={e => setQuestion(e.target.value)} onKeyDown={e => e.key==='Enter' && send()} />
              <button className="ledger-btn" onClick={send}>Send</button>
            </div>
          </div>
        </>
      )}

      <div className="footer-note">RUNS LOCALLY — NO SERVER — NO DEPLOYMENT</div>
    </div>
  );
}
