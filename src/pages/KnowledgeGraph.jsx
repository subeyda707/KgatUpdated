import React, { useMemo } from 'react';
import { useKgatData } from '../DataContext.jsx';

export default function KnowledgeGraph() {
  const { data } = useKgatData();
  const trail = data?.audit_trail || [];

  const { nodes, edges } = useMemo(() => {
    const nodeMap = new Map();
    const edgeList = [];
    trail.forEach(r => {
      const m = r.what.match(/\(([^,]+),\s*([^,]+),\s*([^)]+)\)/);
      if (!m) return;
      const [, subj, pred, obj] = m;
      [subj, obj].forEach(n => { if (!nodeMap.has(n)) nodeMap.set(n, nodeMap.size); });
      edgeList.push({ subj, pred, obj, status: r.status, who: r.who });
    });
    return { nodes: [...nodeMap.keys()], edges: edgeList };
  }, [trail]);

  const positions = useMemo(() => {
    const n = nodes.length || 1;
    return nodes.map((name, i) => {
      const angle = (i / n) * 2 * Math.PI;
      return { name, x: 300 + 220 * Math.cos(angle), y: 200 + 150 * Math.sin(angle) };
    });
  }, [nodes]);

  const posOf = (name) => positions.find(p => p.name === name);

  return (
    <div className="page">
      <div className="page-title">Knowledge Graph</div>
      <p className="page-sub">Entities and relationships derived from the loaded audit trail.</p>

      <div className="section">
        <div className="section-label"><span className="red">—</span> Graph</div>
        {!data ? <div className="empty">Load an export on the Audit Trail page first.</div> : (
          <svg className="graph-canvas" viewBox="0 0 600 400" height="400">
            {edges.map((e, i) => {
              const a = posOf(e.subj), b = posOf(e.obj);
              if (!a || !b) return null;
              const color = e.status === 'VERIFIED' ? '#6b9e78' : '#6a6a65';
              return (
                <g key={i}>
                  <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={color} strokeWidth="1.2" />
                  <text x={(a.x+b.x)/2} y={(a.y+b.y)/2 - 4} fill={color} fontSize="9" textAnchor="middle" fontFamily="IBM Plex Mono">{e.pred}</text>
                </g>
              );
            })}
            {positions.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="26" fill="#1a1a1a" stroke="#f5f5f0" strokeWidth="1" />
                <text x={p.x} y={p.y+3} fill="#f5f5f0" fontSize="9" textAnchor="middle" fontFamily="IBM Plex Mono">{p.name.slice(0,8)}</text>
              </g>
            ))}
          </svg>
        )}
      </div>

      <div className="section">
        <div className="section-label"><span className="red">—</span> KGAT Vocabulary → PROV-O</div>
        <div className="ledger-grid">
          <div className="ledger-cell"><div className="detail-val">KGAT Event</div><div className="ledger-lab">↓ maps to</div><div className="detail-val" style={{marginTop:6}}>prov:Activity</div></div>
          <div className="ledger-cell"><div className="detail-val">KG Assertion</div><div className="ledger-lab">↓ maps to</div><div className="detail-val" style={{marginTop:6}}>prov:Entity</div></div>
          <div className="ledger-cell"><div className="detail-val">KGAT Agent</div><div className="ledger-lab">↓ maps to</div><div className="detail-val" style={{marginTop:6}}>prov:Agent</div></div>
          <div className="ledger-cell"><div className="detail-val">Subject / Predicate / Object</div><div className="ledger-lab">↓ maps to</div><div className="detail-val" style={{marginTop:6}}>kgat:subject / kgat:predicate / kgat:object</div></div>
        </div>
      </div>
    </div>
  );
}
