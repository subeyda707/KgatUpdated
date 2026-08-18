import React from 'react';
import { useKgatData } from '../DataContext.jsx';

export default function Verification() {
  const { data } = useKgatData();
  const trail = data?.audit_trail || [];
  const example = trail.find(r => r.status === 'REJECTED') || trail[0];

  return (
    <div className="page">
      <div className="page-title">Verification Engine</div>
      <p className="page-sub">Three independent, deterministic checks. All three must pass before an event reaches the LLM.</p>

      <div className="section">
        <div className="vcard-row">
          <div className="vcard">
            <div className="vcard-num">01</div>
            <div className="vcard-title">Structural Grounding</div>
            <div className="vcard-desc">Does the claimed KG change actually occur in the KG diff?</div>
          </div>
          <div className="vcard">
            <div className="vcard-num">02</div>
            <div className="vcard-title">Authorization</div>
            <div className="vcard-desc">Is the agent permitted to perform this action? Signature, expiry, scope, event binding, and role are all checked.</div>
          </div>
          <div className="vcard">
            <div className="vcard-num">03</div>
            <div className="vcard-title">Conflict Detection</div>
            <div className="vcard-desc">Does another agent make a conflicting claim about the same fact?</div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-label"><span className="red">—</span> Example Event, Live From Your Data</div>
        {!example ? <div className="empty">Load an export on the Audit Trail page to see a real example.</div> : (
          <div className="flow">
            <div className="flow-box">{example.what}</div>
            <div className="flow-arrow-v">↓</div>
            <div className={`flow-box ${example.status === 'REJECTED' && example.reason?.toLowerCase().includes('diff') ? 'fail' : 'pass'}`}>
              Structural — {example.status === 'REJECTED' && example.reason?.toLowerCase().includes('diff') ? 'FAIL' : 'PASS'}
            </div>
            <div className="flow-arrow-v">↓</div>
            <div className={`flow-box ${example.status === 'REJECTED' && example.reason?.toLowerCase().includes('author') ? 'fail' : 'pass'}`}>
              Authorization — {example.status === 'REJECTED' && example.reason?.toLowerCase().includes('author') ? 'FAIL' : 'PASS'}
            </div>
            <div className="flow-arrow-v">↓</div>
            <div className={`flow-box ${example.status === 'REJECTED' && example.reason?.toLowerCase().includes('conflict') ? 'fail' : 'pass'}`}>
              Conflict — {example.status === 'REJECTED' && example.reason?.toLowerCase().includes('conflict') ? 'FAIL' : 'PASS'}
            </div>
            <div className="flow-arrow-v">↓</div>
            <div className={`flow-box ${example.status === 'REJECTED' ? 'fail' : 'pass'}`} style={{fontWeight: 700}}>
              {example.status}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
