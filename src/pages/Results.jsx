import React from 'react';
import { useKgatData } from '../DataContext.jsx';

export default function Results() {
  const { data } = useKgatData();
  const r1 = data?.rq1 || {};
  const r2 = data?.rq2 || {};

  return (
    <div className="page">
      <div className="page-title">Evaluation</div>
      <p className="page-sub">RQ1 evaluates the deterministic verification components independently. RQ2 evaluates the complete verification-gated generation pipeline against an unconstrained baseline.</p>

      <div className="section">
        <div className="section-label"><span className="red">—</span> Metrics</div>
        {!data ? <div className="empty">Load an export on the Audit Trail page to see real results.</div> : (
          <div className="ledger-grid four">
            <div className="ledger-cell"><div className="ledger-num">{r1.structural ? r1.structural.f1.toFixed(2) : '—'}</div><div className="ledger-lab">Structural F1</div></div>
            <div className="ledger-cell"><div className="ledger-num">{r1.authorization ? r1.authorization.f1.toFixed(2) : '—'}</div><div className="ledger-lab">Authorization F1</div></div>
            <div className="ledger-cell"><div className="ledger-num">{r1.conflict ? r1.conflict.f1.toFixed(2) : '—'}</div><div className="ledger-lab">Conflict F1</div></div>
            <div className="ledger-cell"><div className="ledger-num">{r2.constrained ? Math.round(r2.constrained.what_accuracy*100)+'%' : '—'}</div><div className="ledger-lab">Documentation accuracy</div></div>
          </div>
        )}
      </div>

      <div className="section">
        <div className="section-label"><span className="red">—</span> Experimental Design</div>
        <div className="dataset-tree">
          <div className="tree-top">100 synthetic events</div>
          <div style={{fontSize: 11, color: 'var(--text-dim)', margin: '4px 0'}}>↓</div>
          <div className="tree-cats">
            <div className="tree-cat"><div className="n">25</div>GA<br/><span style={{color:'var(--text-dim)',fontSize:10}}>Genuine + Authorized</span></div>
            <div className="tree-cat"><div className="n">25</div>GU<br/><span style={{color:'var(--text-dim)',fontSize:10}}>Genuine + Unauthorized</span></div>
            <div className="tree-cat"><div className="n">25</div>FA<br/><span style={{color:'var(--text-dim)',fontSize:10}}>False + Authorized</span></div>
            <div className="tree-cat"><div className="n">25</div>FU<br/><span style={{color:'var(--text-dim)',fontSize:10}}>False + Unauthorized</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
