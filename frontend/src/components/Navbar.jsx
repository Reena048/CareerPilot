import React from 'react';
import { Menu, PlusCircle, History, Sparkles } from 'lucide-react';

export default function Navbar({
  onToggleMobileMenu,
  backendOnline,
  onNewAnalysis,
  onOpenHistory,
  historyCount = 0
}) {
  return (
    <header className="top-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          className="mobile-menu-btn"
          onClick={onToggleMobileMenu}
          aria-label="Toggle Navigation"
        >
          <Menu size={22} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className={`status-indicator-pill ${backendOnline ? 'online' : 'offline'}`}>
            <span className="status-dot"></span>
            {backendOnline ? 'Backend Online' : 'Backend Connecting...'}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onOpenHistory}
          className="btn btn-secondary btn-sm"
          title="View Local Analysis History"
        >
          <History size={15} />
          <span>History ({historyCount})</span>
        </button>

        <button
          onClick={onNewAnalysis}
          className="btn btn-primary btn-sm"
          title="Start Fresh Analysis"
        >
          <PlusCircle size={15} />
          <span>New Analysis</span>
        </button>
      </div>
    </header>
  );
}
