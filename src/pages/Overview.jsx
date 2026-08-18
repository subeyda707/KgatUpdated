import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Overview() {
  const nav = useNavigate();
  return (
    <div className="page">
      <div className="hero">
        <div className="hero-title">KGAT<span className="dot">.</span></div>
        <div className="hero-sub2">KNOWLEDGE GRAPH AUDIT &amp; TRACEABILITY</div>
        <p className="hero-line">Verifying Knowledge Graph events before Large Language Models document them.</p>

        <div className="pipeline-row">
          <div className="pipeline-node accent">EVENT</div>
          <span className="pipeline-arrow">→</span>
          <div className="pipeline-node">VERIFY</div>
          <span className="pipeline-arrow">→</span>
          <div className="pipeline-node">DOCUMENT</div>
          <span className="pipeline-arrow">→</span>
          <div className="pipeline-node">PROVENANCE</div>
        </div>
        <div className="gates-row">
          <span>Structural Grounding</span><span>Authorization</span><span>Conflict Detection</span>
        </div>

        <div className="hero-btns" style={{marginTop: 30}}>
          <button className="btn primary" onClick={() => nav('/audit-trail')}>Explore the Live Demo →</button>
          <button className="btn secondary" onClick={() => nav('/methodology')}>Read the Research</button>
        </div>
      </div>

      <div className="section">
        <div className="section-label"><span className="red">—</span> The Pipeline</div>
        <div className="flow">
          <div className="flow-box">Knowledge Graph Event</div>
          <div className="flow-arrow-v">↓</div>
          <div className="flow-box">Structural Grounding</div>
          <div className="flow-arrow-v">↓</div>
          <div className="flow-box">Authorization</div>
          <div className="flow-arrow-v">↓</div>
          <div className="flow-box">Conflict Detection</div>
          <div className="flow-arrow-v">↓</div>
          <div className="flow-box" style={{fontWeight: 700}}>VERIFIED?</div>
          <div className="flow-split">
            <div className="flow-split-col">
              <div style={{fontSize: 11, color: 'var(--green)', marginBottom: 4}}>YES</div>
              <div className="flow-arrow-v">↓</div>
              <div className="flow-box pass">Gemini</div>
              <div className="flow-arrow-v">↓</div>
              <div className="flow-box pass">Structured Documentation</div>
              <div className="flow-arrow-v">↓</div>
              <div className="flow-box pass">PROV-O Record</div>
            </div>
            <div className="flow-split-col">
              <div style={{fontSize: 11, color: 'var(--red)', marginBottom: 4}}>NO</div>
              <div className="flow-arrow-v">↓</div>
              <div className="flow-box fail">REJECT</div>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-label"><span className="red">—</span> In One Sentence</div>
        <p style={{fontSize: 14, lineHeight: 1.7, maxWidth: 640}}>
          KGAT prevents an LLM from documenting an event until that event has been grounded in the
          Knowledge Graph, authorized, and checked for conflicting claims from other agents.
        </p>
      </div>
    </div>
  );
}
