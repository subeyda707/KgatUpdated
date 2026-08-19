import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Overview from './pages/Overview.jsx';
import AuditTrail from './pages/AuditTrail.jsx';
import KnowledgeGraph from './pages/KnowledgeGraph.jsx';
import Verification from './pages/Verification.jsx';
import Documentation from './pages/Documentation.jsx';
import Results from './pages/Results.jsx';
import Methodology from './pages/Methodology.jsx';
import Chat from './pages/Chat.jsx';

const links = [
  ['/', 'Overview'],
  ['/audit-trail', 'Live Audit Trail'],
  ['/knowledge-graph', 'Knowledge Graph'],
  ['/verification', 'Verification'],
  ['/documentation', 'LLM Documentation'],
  ['/results', 'Evaluation'],
  ['/chat', 'Ask KGAT'],
  ['/methodology', 'Methodology'],
];

export default function App() {
  return (
    <>
      <nav className="topnav">
        <div className="topnav-inner">
          <NavLink to="/" className="brand">KGAT<span className="dot">.</span></NavLink>
          <div className="nav-links">
            {links.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/'} className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>{label}</NavLink>
            ))}
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/audit-trail" element={<AuditTrail />} />
        <Route path="/knowledge-graph" element={<KnowledgeGraph />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/documentation" element={<Documentation />} />
        <Route path="/results" element={<Results />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/methodology" element={<Methodology />} />
      </Routes>
    </>
  );
}
