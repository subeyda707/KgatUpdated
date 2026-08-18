import React from 'react';

export default function Methodology() {
  return (
    <div className="page">
      <div className="page-title">Methodology</div>
      <p className="page-sub">Dataset construction, experimental design, and stated limitations.</p>

      <div className="section">
        <div className="section-label"><span className="red">01</span> Dataset</div>
        <p style={{fontSize: 12.5, lineHeight: 1.8, color: 'var(--text-dim)', maxWidth: 640}}>
          100 synthetic events, balanced across four categories (genuine/false × authorized/unauthorized),
          25 events per category. Ground truth is defined independently, before any verification check runs,
          against a real computed diff between two Knowledge Graph states.
        </p>
      </div>

      <div className="section">
        <div className="section-label"><span className="red">02</span> Experimental Design</div>
        <p style={{fontSize: 12.5, lineHeight: 1.8, color: 'var(--text-dim)', maxWidth: 640}}>
          RQ1 evaluates structural grounding, authorization, and conflict detection independently, each
          against its own confusion matrix. RQ2 samples up to 20 fully-verified events at random (fixed
          seed) and runs both an unconstrained and a schema-constrained LLM on the identical paired set,
          comparing WHAT-field accuracy and the rate of unsupported WHY claims.
        </p>
      </div>

      <div className="section">
        <div className="section-label"><span className="red">03</span> Limitations</div>
        <ul style={{fontSize: 12.5, lineHeight: 2, color: 'var(--text-dim)', maxWidth: 640, paddingLeft: 18}}>
          <li>Conflict detection identifies syntactic disagreement (same subject+predicate, different object), not semantic contradiction.</li>
          <li>Structural and authorization metrics near 1.00 reflect correctness by construction against deterministic rules, not general real-world difficulty.</li>
          <li>RQ2 sample sizes are small; results should be read as directional, not statistically definitive.</li>
          <li>The authorization test (RQ1) measures role-permission classification specifically, not signature forgery detection, which was evaluated as a separate experiment.</li>
        </ul>
      </div>
    </div>
  );
}
