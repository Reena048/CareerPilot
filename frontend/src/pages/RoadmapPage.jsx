import React, { useState } from 'react';
import {
  Route,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  Filter,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Flame,
  CheckCircle,
  Circle,
  AlertCircle,
  PlayCircle,
  FolderGit2
} from 'lucide-react';

export default function RoadmapPage({
  roadmapItems,
  onUpdateSkillStatus,
  onResetProgress,
  onNavigateToDashboard,
  hasAnalysis,
  targetRole,
  onNotify
}) {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  // Statistics calculation
  const totalSkills = roadmapItems.length;
  const notStartedCount = roadmapItems.filter(item => item.status === 'Not Started').length;
  const learningCount = roadmapItems.filter(item => item.status === 'Learning').length;
  const completedCount = roadmapItems.filter(item => item.status === 'Completed').length;
  const completionPercentage = totalSkills > 0 ? Math.round((completedCount / totalSkills) * 100) : 0;

  // Filtered skills
  const filteredItems = roadmapItems.filter(item => {
    // Status filter
    if (statusFilter !== 'ALL' && item.status !== statusFilter) {
      return false;
    }
    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = item.skill.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      const matchProject = item.project.toLowerCase().includes(q);
      if (!matchName && !matchCat && !matchProject) return false;
    }
    return true;
  });

  const handleStatusChange = (skillName, newStatus) => {
    onUpdateSkillStatus(skillName, newStatus);
    if (onNotify) {
      if (newStatus === 'Completed') {
        onNotify(`Congratulations! Marked ${skillName} as Completed 🎉`, 'success');
      } else if (newStatus === 'Learning') {
        onNotify(`Marked ${skillName} as Learning in progress. Keep it up!`, 'info');
      } else {
        onNotify(`Status for ${skillName} updated to Not Started.`, 'info');
      }
    }
  };

  const handleReset = () => {
    onResetProgress();
    setShowConfirmReset(false);
    if (onNotify) {
      onNotify('Roadmap progress has been reset.', 'info');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-600)', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
          <Route size={16} />
          <span>Personalized Roadmap</span>
        </div>
        <h1 className="page-title">Personalized Skill Roadmap</h1>
        <p className="page-tagline">
          Tailored learning trajectories generated from your missing skills. Track your preparation progress step-by-step.
        </p>
      </div>

      {/* Case 1: No analysis performed yet */}
      {!hasAnalysis ? (
        <div className="card" style={{ padding: '48px 24px', textAlign: 'center' }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              backgroundColor: 'var(--primary-50)',
              color: 'var(--primary-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <Route size={32} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '8px' }}>
            No Missing Skills Identified Yet
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--slate-600)', maxWidth: '540px', margin: '0 auto 24px', lineHeight: 1.6 }}>
            Your personalized learning roadmap is dynamically generated from the skill gaps detected when comparing your resume against a target job description.
          </p>
          <button
            onClick={onNavigateToDashboard}
            className="btn btn-primary btn-lg"
          >
            <span>Go to Dashboard & Analyze Resume</span>
            <ArrowRight size={16} />
          </button>
        </div>
      ) : totalSkills === 0 ? (
        /* Case 2: Analysis performed, 0 missing skills */
        <div
          className="card"
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #ffffff 0%, var(--success-bg) 100%)',
            borderColor: 'var(--success-border)',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              backgroundColor: 'var(--success-bg)',
              color: 'var(--success-badge)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <CheckCircle2 size={36} />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--success-text)', marginBottom: '8px' }}>
            Zero Skill Gaps Detected!
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--slate-700)', maxWidth: '540px', margin: '0 auto 20px', lineHeight: 1.6 }}>
            Your resume covers every technical skill required by the target job description. You are ready to apply with confidence!
          </p>
          <button
            onClick={onNavigateToDashboard}
            className="btn btn-secondary"
          >
            Try Another Job Posting
          </button>
        </div>
      ) : (
        /* Case 3: Missing skills detected -> Full Roadmap Dashboard */
        <div>
          {/* Progress Overview Card */}
          <div
            className="card"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, var(--primary-50) 100%)',
              borderColor: 'var(--primary-200)',
              marginBottom: '24px',
              padding: '28px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
              <div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: 'var(--primary-700)',
                    letterSpacing: '0.5px',
                  }}
                >
                  Opportunity Focus: {targetRole || 'Target Opportunity'}
                </span>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--slate-900)', marginTop: '4px' }}>
                  Roadmap Completion: {completionPercentage}%
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--slate-600)', marginTop: '4px' }}>
                  {completedCount} of {totalSkills} skills completed • {learningCount} currently in progress
                </p>
              </div>

              {/* Reset Progress Button */}
              <div>
                {!showConfirmReset ? (
                  <button
                    onClick={() => setShowConfirmReset(true)}
                    className="btn btn-secondary btn-sm"
                    title="Reset all skills in roadmap to Not Started"
                  >
                    <RotateCcw size={14} />
                    <span>Reset Progress</span>
                  </button>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', padding: '6px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--danger-border)' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--danger-text)' }}>
                      Reset all?
                    </span>
                    <button
                      onClick={handleReset}
                      className="btn btn-danger btn-sm"
                    >
                      Yes, Reset
                    </button>
                    <button
                      onClick={() => setShowConfirmReset(false)}
                      className="btn btn-secondary btn-sm"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div style={{ width: '100%', height: '12px', backgroundColor: 'var(--slate-200)', borderRadius: '9999px', overflow: 'hidden', position: 'relative' }}>
              <div
                style={{
                  width: `${completionPercentage}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--primary-600) 0%, var(--success-badge) 100%)',
                  borderRadius: '9999px',
                  transition: 'width 0.4s ease-in-out',
                }}
              />
            </div>
          </div>

          {/* 4 Metric Summary Cards */}
          <div className="stats-grid" style={{ marginBottom: '24px' }}>
            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--primary-50)', color: 'var(--primary-600)' }}>
                <Route size={22} />
              </div>
              <div>
                <div className="stat-number">{totalSkills}</div>
                <div className="stat-title">Roadmap Skills</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--slate-100)', color: 'var(--slate-600)' }}>
                <Circle size={22} />
              </div>
              <div>
                <div className="stat-number" style={{ color: 'var(--slate-700)' }}>{notStartedCount}</div>
                <div className="stat-title">Not Started</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{ backgroundColor: '#fffbeb', color: '#b45309' }}>
                <PlayCircle size={22} />
              </div>
              <div>
                <div className="stat-number" style={{ color: '#b45309' }}>{learningCount}</div>
                <div className="stat-title">Learning</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success-badge)' }}>
                <CheckCircle2 size={22} />
              </div>
              <div>
                <div className="stat-number" style={{ color: 'var(--success-text)' }}>{completedCount}</div>
                <div className="stat-title">Completed</div>
              </div>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div
            className="card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              padding: '16px 20px',
              marginBottom: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', marginRight: '4px' }}>
                <Filter size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                Status:
              </span>
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`btn btn-sm ${statusFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
              >
                All ({totalSkills})
              </button>
              <button
                onClick={() => setStatusFilter('Not Started')}
                className={`btn btn-sm ${statusFilter === 'Not Started' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Not Started ({notStartedCount})
              </button>
              <button
                onClick={() => setStatusFilter('Learning')}
                className={`btn btn-sm ${statusFilter === 'Learning' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Learning ({learningCount})
              </button>
              <button
                onClick={() => setStatusFilter('Completed')}
                className={`btn btn-sm ${statusFilter === 'Completed' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Completed ({completedCount})
              </button>
            </div>

            <div style={{ position: 'relative', width: '220px' }}>
              <Search
                size={14}
                style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }}
              />
              <input
                type="text"
                placeholder="Search roadmap skill..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '32px', fontSize: '13px', padding: '6px 12px 6px 30px' }}
              />
            </div>
          </div>

          {/* Individual Roadmap Skill Cards */}
          {filteredItems.length === 0 ? (
            <div className="card" style={{ padding: '36px', textAlign: 'center', color: 'var(--slate-500)' }}>
              No skills in the roadmap matched your filter criteria.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {filteredItems.map((item, idx) => {
                const isCompleted = item.status === 'Completed';
                const isLearning = item.status === 'Learning';

                return (
                  <div
                    key={item.skill}
                    className="card"
                    style={{
                      borderLeft: isCompleted
                        ? '5px solid var(--success-badge)'
                        : isLearning
                        ? '5px solid var(--warning-badge)'
                        : '5px solid var(--primary-600)',
                      transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
                    }}
                  >
                    {/* Top Row: Skill Name, Category, Estimated Time, Status Toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span
                          style={{
                            background: isCompleted
                              ? 'var(--success-badge)'
                              : isLearning
                              ? 'var(--warning-badge)'
                              : 'var(--primary-600)',
                            color: '#ffffff',
                            fontWeight: 800,
                            fontSize: '12px',
                            padding: '3px 8px',
                            borderRadius: '4px',
                          }}
                        >
                          #{idx + 1}
                        </span>

                        <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--slate-900)' }}>
                          {item.skill}
                        </h3>

                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            color: 'var(--slate-600)',
                            background: 'var(--slate-100)',
                            border: '1px solid var(--slate-200)',
                            padding: '2px 8px',
                            borderRadius: '9999px',
                          }}
                        >
                          {item.category}
                        </span>

                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            color: 'var(--primary-700)',
                            background: 'var(--primary-50)',
                            border: '1px solid var(--primary-200)',
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            fontWeight: 600,
                          }}
                          title="Suggested learning duration"
                        >
                          <Clock size={12} />
                          <span>{item.estimatedTime}</span>
                        </span>
                      </div>

                      {/* Status Selector Pills */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(item.skill, 'Not Started')}
                          className={`btn btn-sm ${item.status === 'Not Started' ? 'btn-secondary' : ''}`}
                          style={{
                            fontWeight: 600,
                            fontSize: '12px',
                            padding: '4px 10px',
                            backgroundColor: item.status === 'Not Started' ? 'var(--slate-200)' : 'transparent',
                            color: item.status === 'Not Started' ? 'var(--slate-900)' : 'var(--slate-400)',
                            borderColor: item.status === 'Not Started' ? 'var(--slate-300)' : 'var(--slate-200)',
                          }}
                        >
                          Not Started
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(item.skill, 'Learning')}
                          className="btn btn-sm"
                          style={{
                            fontWeight: 600,
                            fontSize: '12px',
                            padding: '4px 10px',
                            backgroundColor: isLearning ? 'var(--warning-bg)' : 'transparent',
                            color: isLearning ? 'var(--warning-text)' : 'var(--slate-400)',
                            border: `1px solid ${isLearning ? 'var(--warning-border)' : 'var(--slate-200)'}`,
                          }}
                        >
                          Learning
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(item.skill, 'Completed')}
                          className="btn btn-sm"
                          style={{
                            fontWeight: 600,
                            fontSize: '12px',
                            padding: '4px 10px',
                            backgroundColor: isCompleted ? 'var(--success-bg)' : 'transparent',
                            color: isCompleted ? 'var(--success-text)' : 'var(--slate-400)',
                            border: `1px solid ${isCompleted ? 'var(--success-border)' : 'var(--slate-200)'}`,
                          }}
                        >
                          Completed
                        </button>
                      </div>
                    </div>

                    {/* Why this skill is relevant */}
                    <div style={{ fontSize: '13px', color: 'var(--slate-700)', marginBottom: '14px', lineHeight: 1.5 }}>
                      <strong style={{ color: 'var(--slate-900)' }}>Relevance to Role:</strong> {item.relevance}
                    </div>

                    {/* Ordered Topics to Learn */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--slate-600)', textTransform: 'uppercase', marginBottom: '8px' }}>
                        Topics to Learn (Recommended Order):
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {item.topics.map((topic, tIdx) => (
                          <div
                            key={tIdx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              background: 'var(--slate-50)',
                              border: '1px solid var(--slate-200)',
                              borderRadius: 'var(--radius-sm)',
                              padding: '8px 12px',
                              fontSize: '13px',
                              color: 'var(--slate-800)',
                            }}
                          >
                            <span
                              style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                background: 'var(--primary-100)',
                                color: 'var(--primary-700)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '11px',
                                fontWeight: 800,
                                flexShrink: 0,
                              }}
                            >
                              {tIdx + 1}
                            </span>
                            <span>{topic}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Practice Project Box */}
                    <div
                      style={{
                        background: '#ffffff',
                        border: '1px solid var(--slate-200)',
                        borderRadius: 'var(--radius-md)',
                        padding: '14px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        boxShadow: 'var(--shadow-sm)',
                      }}
                    >
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--primary-50)',
                          color: 'var(--primary-600)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <FolderGit2 size={18} />
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--slate-900)', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                          Hands-on Practice Project
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--slate-700)', marginTop: '2px', lineHeight: 1.5 }}>
                          {item.project}
                        </div>
                      </div>
                    </div>

                    {/* Duration suggestion disclaimer note */}
                    <div style={{ fontSize: '11px', color: 'var(--slate-400)', fontStyle: 'italic', marginTop: '10px' }}>
                      Estimated learning time: {item.estimatedTime}. (Note: Estimates are suggestions, not guarantees.)
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
