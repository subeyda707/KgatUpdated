import React from 'react';
import { useKgatData } from '../DataContext.jsx';

export default function Documentation() {
  const { data } = useKgatData();
  const r2 = data?.rq2 || {};

  return (
    <div className="page">
      <div className="page-title">LLM Documentation</div>
      <p className="page-sub">Unconstrained generation versus verification-gated, schema-constrained generation — on the same paired events.</p>

      <div className="section">
        <div className="section-label"><span className="red">—</span> Output Comparison</div>
        <div className="compare-row">
          <div className="compare-col">
            <div className="compare-lab">Unconstrained</div>
            <div className="compare-body">{`"This change was made because it seemed like a reasonable update to the record based on standard practice."

-- free text, no schema, may state
   claims the source record never made`}</div>
          </div>
          <div className="compare-col">
            <div className="compare-lab">KGAT Constrained</div>
            <div className="compare-body">{`{
  "event_id": "evt-014",
  "who": "writer_1",
  "what": "added (Entity12, treats, Value7)",
  "when": "2026-08-19T02:14:00Z",
  "why": "Not recorded"
}`}</div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-label"><span className="red">—</span> Evaluation</div>
        {!data ? <div className="empty">Load an export on the Audit Trail page to see real results.</div> : (
          <div className="ledger-grid">
            <div className="ledger-cell">
              <div className="ledger-num">{r2.baseline ? Math.round(r2.baseline.what_accuracy*100)+'%' : '—'}</div>
              <div className="ledger-lab">WHAT accuracy — baseline</div>
            </div>
            <div className="ledger-cell">
              <div className="ledger-num">{r2.constrained ? Math.round(r2.constrained.what_accuracy*100)+'%' : '—'}</div>
              <div className="ledger-lab">WHAT accuracy — KGAT</div>
            </div>
            <div className="ledger-cell">
              <div className="ledger-num">{r2.baseline?.why_unsupported_rate != null ? Math.round(r2.baseline.why_unsupported_rate*100)+'%' : '—'}</div>
              <div className="ledger-lab">Unsupported WHY — baseline</div>
            </div>
            <div className="ledger-cell">
              <div className="ledger-num">{r2.constrained?.why_unsupported_rate != null ? Math.round(r2.constrained.why_unsupported_rate*100)+'%' : '—'}</div>
              <div className="ledger-lab">Unsupported WHY — KGAT</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
