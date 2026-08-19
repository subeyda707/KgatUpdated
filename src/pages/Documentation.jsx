import React, { useState } from 'react';
import { API_BASE_URL } from '../config.js';

export default function Documentation() {
  const [subject, setSubject] = useState('Entity12');
  const [predicate, setPredicate] = useState('treats');
  const [object, setObject] = useState('Value7');
  const [fabricated, setFabricated] = useState(false);
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);

  const run = async () => {
    setRunning(true);
    setResult(null);
    try {
      const r = await fetch(`${API_BASE_URL}/api/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, predicate, object, is_fabricated: fabricated }),
      });
      setResult(await r.json());
    } catch (err) {
      setResult({ error: err.message });
    }
    setRunning(false);
  };

  const loadFabricated = () => { setSubject('Entity99'); setPredicate('treats'); setObject('FakeValue'); setFabricated(true); setResult(null); };
  const loadGenuine = () => { setSubject('Entity12'); setPredicate('treats'); setObject('Value7'); setFabricated(false); setResult(null); };

  return (
    <div className="page">
      <div className="page-title">Without KGAT / With KGAT</div>
      <p className="page-sub">Run the same event through both conditions live. No verification gate versus KGAT's real verification gate.</p>

      <div className="section">
        <div className="section-label"><span className="red">—</span> Event</div>
        <div className="event-card">
          <div className="event-triple">
            {subject} <span className="arrow">──{predicate}──▶</span> {object}
          </div>
        </div>
        <div className="sim-actions">
          <button className="btn primary" onClick={run} disabled={running}>{running ? 'Running both conditions…' : 'Run Comparison'}</button>
          <button className="btn secondary" onClick={loadFabricated}>Load a Fabricated Event</button>
          <button className="btn secondary" onClick={loadGenuine}>Load a Genuine Event</button>
        </div>
      </div>

      {result && !result.error && (
        <div className="section">
          <div className="section-label"><span className="red">—</span> Output Comparison</div>
          <div className="compare-row">
            <div className="compare-col">
              <div className="compare-lab">Without KGAT (unconstrained)</div>
              <div className="compare-body">
                {result.baseline?.error ? result.baseline.error : result.baseline?.text}
              </div>
            </div>
            <div className="compare-col">
              <div className="compare-lab">With KGAT (verification-gated)</div>
              {result.constrained?.documented ? (
                <div className="compare-body">{JSON.stringify(result.constrained.json, null, 2)}</div>
              ) : (
                <div className="compare-body" style={{color:'var(--red)'}}>
                  BLOCKED — {result.constrained?.reason || result.constrained?.error}
                </div>
              )}
            </div>
          </div>
          <p style={{fontSize: 11.5, color: 'var(--text-dim)', marginTop: 16}}>
            Structural check: {result.structural_pass ? <span style={{color:'var(--green)'}}>PASSED</span> : <span style={{color:'var(--red)'}}>FAILED — {result.structural_detail}</span>}
          </p>
        </div>
      )}
      {result?.error && <div className="section"><div className="empty">Could not reach backend — {result.error}</div></div>}
    </div>
  );
}
