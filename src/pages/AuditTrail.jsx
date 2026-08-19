import React, { useState } from 'react';
import { useKgatData } from '../DataContext.jsx';

export default function AuditTrail() {
  const { data, status, errorMsg, refetch } = useKgatData();
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const trail = data?.audit_trail || [];
  const filtered = filter === 'all' ? trail : trail.filter(r => r.status.toLowerCase() === filter);

  return (
    <div className="page">
      <div className="page-title">Live Audit Trail</div>
      <p className="page-sub">Every event KGAT has processed, fetched live from the backend. Click a row for the full record.</p>

      <div className="section">
        <div className="section-label"><span className="red">—</span> Connection</div>
        {status === 'loading' && (
          <div className="upload-row">
            <span>Connecting to KGAT backend… (a cold start can take up to a minute)</span>
            <span className="upload-status">CONNECTING</span>
          </div>
        )}
        {status === 'error' && (
          <div className="upload-row" onClick={refetch} style={{cursor:'pointer'}}>
            <span>Could not reach backend — {errorMsg}. Click to retry.</span>
            <span className="upload-status">ERROR</span>
          </div>
        )}
        {status === 'ready' && (
          <div className="upload-row" onClick={refetch} style={{cursor:'pointer'}}>
            <span>{trail.length} events loaded from live backend</span>
            <span className="upload-status ok">LIVE</span>
          </div>
        )}
      </div>

      {status === 'ready' && (
        <div className="section">
          <div className="filter-row">
            <button className={`filter-btn ${filter==='all'?'active':''}`} onClick={()=>setFilter('all')}>All ({trail.length})</button>
            <button className={`filter-btn ${filter==='verified'?'active':''}`} onClick={()=>setFilter('verified')}>Verified</button>
            <button className={`filter-btn ${filter==='rejected'?'active':''}`} onClick={()=>setFilter('rejected')}>Rejected</button>
          </div>
          {filtered.length === 0 ? <div className="empty">No records.</div> : filtered.map(r => (
            <div className="record" key={r.id} onClick={() => setSelected(r)}>
              <div className="record-top">
                <span className="record-what">{r.what}</span>
                <span className={`record-status ${r.status.toLowerCase()}`}>{r.status}</span>
              </div>
              <div className="record-meta">who: {r.who} ({(r.roles||[]).join(', ')})</div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="overlay" onClick={() => setSelected(null)}>
          <div className="detail-panel" onClick={e => e.stopPropagation()}>
            <span className="detail-close" onClick={() => setSelected(null)}>CLOSE ×</span>
            <div className="detail-row">
              <div className="detail-lab">Event</div>
              <div className="detail-val">{selected.id}</div>
            </div>
            <div className="detail-row">
              <div className="detail-lab">Who</div>
              <div className="detail-val">{selected.who} — {(selected.roles||[]).join(', ')}</div>
            </div>
            <div className="detail-row">
              <div className="detail-lab">What</div>
              <div className="detail-val">{selected.what}</div>
            </div>
            <div className="detail-row">
              <div className="detail-lab">Verification</div>
              <div className="check-list">
                <div className={`check-item ${selected.status === 'VERIFIED' ? 'pass' : 'fail'}`}>
                  {selected.status === 'VERIFIED' ? '✓ All checks passed' : `✕ ${selected.reason || 'Rejected'}`}
                </div>
              </div>
            </div>
            {selected.hash && (
              <div className="detail-row">
                <div className="detail-lab">Cryptographic Binding (SHA-256)</div>
                <div className="hash-box">{selected.hash}</div>
              </div>
            )}
            {selected.prov_o && (
              <div className="detail-row">
                <div className="detail-lab">PROV-O Record</div>
                <div className="prov-box">{JSON.stringify(selected.prov_o, null, 2)}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
