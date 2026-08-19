import React, { useState } from 'react';
import { API_BASE_URL } from '../config.js';

const PRESETS = {
  genuine: { subject: 'Entity12', predicate: 'treats', object: 'Value7', role: 'data_writer', fabricated: false },
  broken: { subject: 'Entity99', predicate: 'treats', object: 'FakeValue', role: 'reader', fabricated: true },
};

export default function Overview() {
  const [event, setEvent] = useState(PRESETS.genuine);
  const [stage, setStage] = useState('idle');
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);

  const run = async () => {
    setRunning(true);
    setResult(null);
    setStage('structural');

    let res;
    try {
      const r = await fetch(`${API_BASE_URL}/api/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: event.subject, predicate: event.predicate, object: event.object,
          agent_role: event.role, is_fabricated: event.fabricated,
        }),
      });
      res = await r.json();
    } catch (err) {
      setResult({ error: err.message });
      setRunning(false);
      return;
    }

    await new Promise(r => setTimeout(r, 500));
    setStage('authorization');
    await new Promise(r => setTimeout(r, 500));
    setStage('conflict');
    await new Promise(r => setTimeout(r, 500));
    setStage('done');
    setResult(res);
    setRunning(false);
  };

  const loadPreset = (p) => { setEvent(PRESETS[p]); setStage('idle'); setResult(null); };

  const dotClass = (stepStage, key) => {
    if (stage === 'idle') return 'step-dot';
    const order = ['structural', 'authorization', 'conflict', 'done'];
    if (order.indexOf(stage) < order.indexOf(stepStage)) return 'step-dot';
    if (stage === stepStage && !result) return 'step-dot pending';
    if (!result) return 'step-dot';
    return result[key]?.pass ? 'step-dot pass' : 'step-dot fail';
  };

  return (
    <div className="page">
      <div className="sim-hero">
        <div className="sim-question">Can this event be trusted?</div>
        <p className="sim-sub">Run a real Knowledge Graph event through KGAT's live verification pipeline. Tamper with it and watch the outcome genuinely change.</p>

        <div className="event-card">
          <div className="event-triple">
            {event.subject} <span className="arrow">──{event.predicate}──▶</span> {event.object}
          </div>
          <div className="event-row">
            <span className="event-field-lab">Agent role</span>
            <select className="event-select" value={event.role} onChange={e => setEvent({...event, role: e.target.value})}>
              <option value="data_writer">data_writer</option>
              <option value="admin">admin</option>
              <option value="reader">reader</option>
            </select>
          </div>
        </div>

        <div className="sim-actions">
          <button className="btn primary" onClick={run} disabled={running}>{running ? 'Running…' : 'Run KGAT Verification'}</button>
          <button className="btn secondary" onClick={() => loadPreset('broken')}>Try to Break KGAT</button>
          <button className="btn secondary" onClick={() => loadPreset('genuine')}>Reset to Genuine Event</button>
        </div>
      </div>

      {stage !== 'idle' && (
        <div className="section">
          <div className="step-row">
            <div className="step">
              <div className="step-num">① STRUCTURAL</div>
              <div className="step-dot-wrap"><div className={dotClass('structural', 'structural')}></div></div>
              <div className="step-title" style={{marginTop:10}}>Grounding</div>
              {result && <div className="step-detail">{result.structural?.detail}</div>}
            </div>
            <div className="step">
              <div className="step-num">② AUTHORIZATION</div>
              <div className="step-dot-wrap"><div className={dotClass('authorization', 'authorization')}></div></div>
              <div className="step-title" style={{marginTop:10}}>Permission</div>
              {result && <div className="step-detail">{result.authorization?.detail}</div>}
            </div>
            <div className="step">
              <div className="step-num">③ CONFLICT</div>
              <div className="step-dot-wrap"><div className={dotClass('conflict', 'conflict')}></div></div>
              <div className="step-title" style={{marginTop:10}}>Detection</div>
              {result && <div className="step-detail">{result.conflict?.detail}</div>}
            </div>
          </div>

          {result && !result.error && (
            <div className={`gate-result ${result.verified ? 'verified' : 'rejected'}`}>
              <div className={`gate-title ${result.verified ? 'verified' : 'rejected'}`}>
                {result.verified ? 'VERIFIED — LLM AUTHORIZED' : 'REJECTED — LLM NEVER REACHED'}
              </div>
              <div className="gate-desc">
                {result.verified
                  ? 'All three checks passed. KGAT has authorized the LLM to document this event.'
                  : 'At least one check failed. The event was never passed to the documentation model.'}
              </div>
              {result.verified && result.documentation && (
                <div className="doc-output">{JSON.stringify(result.documentation, null, 2)}</div>
              )}
            </div>
          )}
          {result?.error && <div className="empty">Could not reach backend — {result.error}</div>}
        </div>
      )}
    </div>
  );
}
