import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Route,
  BarChart3,
  Info,
  Compass,
  X,
  History
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  mobileOpen,
  setMobileOpen,
  historyCount = 0,
  roadmapCount = 0,
  onOpenHistory
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'resume', label: 'Resume Analysis', icon: FileText },
    { id: 'job-matcher', label: 'Job Matcher', icon: Briefcase },
    { id: 'roadmap', label: 'Skill Roadmap', icon: Route, badge: roadmapCount > 0 ? roadmapCount : null },
    { id: 'skills-report', label: 'Skills Report', icon: BarChart3 },
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            zIndex: 35,
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-icon-box">
            <Compass size={22} />
          </div>
          <div className="brand-info" style={{ flex: 1 }}>
            <h1>CareerPilot</h1>
            <div className="brand-tagline-sub">AI Resume & Job Matcher</div>
          </div>
          {setMobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="mobile-menu-btn"
              style={{ display: mobileOpen ? 'block' : 'none' }}
              title="Close Navigation"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--slate-400)', textTransform: 'uppercase', padding: '6px 14px', letterSpacing: '0.5px' }}>
            Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge != null && (
                  <span
                    style={{
                      background: 'var(--danger-bg)',
                      color: 'var(--danger-text)',
                      border: '1px solid var(--danger-border)',
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '1px 7px',
                      borderRadius: '9999px',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div style={{ margin: '16px 0 6px', borderTop: '1px solid var(--slate-100)' }} />

          <button
            onClick={() => {
              if (onOpenHistory) onOpenHistory();
              if (setMobileOpen) setMobileOpen(false);
            }}
            className="nav-link"
          >
            <History size={18} />
            <span style={{ flex: 1 }}>Analysis History</span>
            {historyCount > 0 && (
              <span
                style={{
                  background: 'var(--primary-100)',
                  color: 'var(--primary-800)',
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '2px 7px',
                  borderRadius: '9999px',
                }}
              >
                {historyCount}
              </span>
            )}
          </button>
        </nav>

        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }}></span>
            <strong style={{ color: 'var(--slate-700)' }}>100% In-Memory</strong>
          </div>
          <p style={{ lineHeight: 1.4, color: 'var(--slate-400)' }}>
            Files processed locally in memory. Zero external AI API tracking.
          </p>
        </div>
      </aside>
    </>
  );
}
