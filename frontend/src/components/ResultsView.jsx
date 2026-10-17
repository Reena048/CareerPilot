import React from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  PlusCircle,
  FileText,
  Briefcase,
  Download,
  RotateCcw,
  BookOpen,
  Target,
  Sparkles,
  Info,
  Route
} from 'lucide-react';
import ChartsSection from './ChartsSection';
import { downloadHtmlReport } from '../services/report';

export default function ResultsView({
  analysis,
  onReset,
  targetRole,
  resumeName = 'Uploaded Resume',
  jobTitle = 'Target Opportunity',
  onNavigateToRoadmap,
  onNotify
}) {
  if (!analysis) return null;

  const handleDownload = () => {
    downloadHtmlReport(analysis, {
      targetRole: targetRole || analysis.target_role,
      resumeName,
      jobTitle,
      formattedDate: new Date().toLocaleString(),
    });
    if (onNotify) {
      onNotify('Analysis report downloaded successfully.', 'success');
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Excellent':
        return { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' };
      case 'Strong':
        return { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' };
      case 'Moderate':
        return { bg: '#fffbeb', text: '#92400e', border: '#fde68a' };
      default:
        return { bg: '#fef2f2', text: '#991b1b', border: '#fecaca' };
    }
  };

  const statusStyle = getStatusBadgeStyle(analysis.score_status);

  return (
    <div style={{ marginTop: '28px' }}>
      {/* Top Banner with Score */}
      <div className="score-overview-card">
        <div className="score-main-display">
          <div className="score-ring-circle">
            <span className="score-number-text">{analysis.match_score}%</span>
            <span className="score-label-text">Match</span>
          </div>

          <div className="score-explanation-group">
            <h3>
              <span>Skill Match Score: {analysis.match_score}%</span>
              <span
                className="score-status-pill"
                style={{
                  backgroundColor: statusStyle.bg,
                  color: statusStyle.text,
                  border: `1px solid ${statusStyle.border}`,
                }}
              >
                {analysis.score_status}
              </span>
            </h3>
            <p className="score-explanation-text">
              {analysis.calculation_explanation}
            </p>
            <p className="score-disclaimer-text">
              <Info size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
              {analysis.disclaimer}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '160px' }}>
          {analysis.missing_skills_count > 0 && onNavigateToRoadmap && (
            <button
              onClick={onNavigateToRoadmap}
              className="btn btn-primary"
              style={{ background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%)' }}
              title="Open Personalized Skill Roadmap"
            >
              <Route size={16} />
              <span>Skill Roadmap</span>
            </button>
          )}

          <button
            onClick={handleDownload}
            className="btn btn-secondary"
            title="Download Standalone HTML Report"
          >
            <Download size={16} />
            <span>Download Report</span>
          </button>

          <button
            onClick={onReset}
            className="btn btn-secondary"
            title="Start a new analysis"
          >
            <RotateCcw size={16} />
            <span>New Analysis</span>
          </button>
        </div>
      </div>

      {/* 4-Stat Metric Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--primary-50)', color: 'var(--primary-600)' }}>
            <FileText size={22} />
          </div>
          <div>
            <div className="stat-number">{analysis.total_resume_skills}</div>
            <div className="stat-title">Resume Skills</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>
            <Briefcase size={22} />
          </div>
          <div>
            <div className="stat-number">{analysis.total_job_skills}</div>
            <div className="stat-title">Job Skills</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success-badge)' }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="stat-number" style={{ color: 'var(--success-text)' }}>
              {analysis.matching_skills_count}
            </div>
            <div className="stat-title">Matching Skills</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--danger-bg)', color: 'var(--danger-badge)' }}>
            <XCircle size={22} />
          </div>
          <div>
            <div className="stat-number" style={{ color: 'var(--danger-text)' }}>
              {analysis.missing_skills_count}
            </div>
            <div className="stat-title">Missing Skills</div>
          </div>
        </div>
      </div>

      {/* Skills Badges Grid: Matching, Missing, Additional */}
      <div className="grid-2col">
        {/* Matching Skills */}
        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-title-icon" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success-badge)' }}>
                <CheckCircle2 size={18} />
              </div>
              <div>
                <h3 className="card-title">Matching Skills ({analysis.matching_skills_count})</h3>
                <p className="card-subtitle">Detected in both your resume and the job listing</p>
              </div>
            </div>
          </div>

          {analysis.matching_skills && analysis.matching_skills.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {analysis.matching_skills.map((skill, idx) => (
                <span key={idx} className="skill-badge skill-badge-matching" title={`Matched on keyword: "${skill.matched_term}"`}>
                  <CheckCircle2 size={12} />
                  {skill.name}
                  <span className="badge-category">({skill.category})</span>
                </span>
              ))}
            </div>
          ) : (
            <div className="notice-box notice-warning" style={{ marginBottom: 0 }}>
              No overlapping technical skills were found between your resume and the job requirements.
            </div>
          )}
        </div>

        {/* Missing Skills */}
        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-title-icon" style={{ backgroundColor: 'var(--danger-bg)', color: 'var(--danger-badge)' }}>
                <XCircle size={18} />
              </div>
              <div>
                <h3 className="card-title">Missing Skills ({analysis.missing_skills_count})</h3>
                <p className="card-subtitle">Required by the job but not detected in your resume</p>
              </div>
            </div>
          </div>

          {analysis.missing_skills && analysis.missing_skills.length > 0 ? (
            <div>
              <p style={{ fontSize: '12px', color: 'var(--slate-500)', marginBottom: '10px' }}>
                These skills were identified in the job posting but were not detected in the uploaded resume.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {analysis.missing_skills.map((skill, idx) => (
                  <span key={idx} className="skill-badge skill-badge-missing">
                    <XCircle size={12} />
                    {skill.name}
                    <span className="badge-category">({skill.category})</span>
                  </span>
                ))}
              </div>

              {onNavigateToRoadmap && (
                <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--slate-100)' }}>
                  <button
                    onClick={onNavigateToRoadmap}
                    className="btn btn-outline-primary btn-sm"
                  >
                    <Route size={14} />
                    <span>View in Personalized Roadmap ({analysis.missing_skills.length}) →</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="notice-box notice-info" style={{ marginBottom: 0 }}>
              <CheckCircle2 size={16} style={{ color: 'var(--success-badge)', flexShrink: 0 }} />
              <div>
                <strong>Zero skill gaps!</strong> Your resume covers all required skills identified in this job posting.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Resume Skills Card */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-title-icon">
              <PlusCircle size={18} />
            </div>
            <div>
              <h3 className="card-title">Additional Resume Skills ({analysis.additional_skills_count})</h3>
              <p className="card-subtitle">Relevant competencies detected in your resume beyond the job requirements</p>
            </div>
          </div>
        </div>

        {analysis.additional_skills && analysis.additional_skills.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {analysis.additional_skills.map((skill, idx) => (
              <span key={idx} className="skill-badge skill-badge-additional">
                {skill.name}
                <span className="badge-category">({skill.category})</span>
              </span>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: '13px', color: 'var(--slate-400)', fontStyle: 'italic' }}>
            No extra skills beyond the required job skills were detected.
          </div>
        )}
      </div>

      {/* Recharts Visualizations */}
      <ChartsSection analysis={analysis} />

      {/* Personalized Improvement Plan */}
      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-title-icon" style={{ backgroundColor: 'var(--primary-50)', color: 'var(--primary-700)' }}>
              <Target size={18} />
            </div>
            <div>
              <h3 className="card-title">Personalized Improvement Plan</h3>
              <p className="card-subtitle">
                Deterministic, rule-based practice recommendations based on detected skill gaps
              </p>
            </div>
          </div>

          {onNavigateToRoadmap && analysis.missing_skills_count > 0 && (
            <button
              onClick={onNavigateToRoadmap}
              className="btn btn-outline-primary btn-sm"
              title="Track progress on these skills in the Skill Roadmap"
            >
              <Route size={14} />
              <span>Open Skill Roadmap</span>
            </button>
          )}
        </div>

        {analysis.recommendations && analysis.recommendations.length > 0 ? (
          <div>
            <div style={{ fontSize: '12px', color: 'var(--slate-500)', marginBottom: '14px' }}>
              Prioritized action tasks for up to five key areas to strengthen your candidacy:
            </div>

            {analysis.recommendations.map((rec, idx) => (
              <div key={idx} className="rec-item">
                <div className="rec-item-header">
                  <div className="rec-skill-name">
                    <span
                      style={{
                        background: 'var(--primary-600)',
                        color: '#fff',
                        fontSize: '11px',
                        padding: '2px 7px',
                        borderRadius: '4px',
                        fontWeight: '800',
                      }}
                    >
                      #{idx + 1}
                    </span>
                    <span>{rec.skill}</span>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        color: 'var(--slate-500)',
                        background: 'var(--slate-100)',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                      }}
                    >
                      {rec.category}
                    </span>
                    {rec.is_role_suggestion && (
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: '700',
                          color: '#92400e',
                          background: '#fef3c7',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                        }}
                      >
                        Target Role Focus
                      </span>
                    )}
                  </div>
                </div>

                <div className="rec-topic">
                  <strong>Learning Focus:</strong> {rec.topic}
                </div>

                <div className="rec-task">
                  <strong>Recommended Practice Task:</strong> {rec.task}
                </div>

                <div className="rec-rationale">
                  <em>{rec.rationale}</em>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="notice-box notice-info" style={{ marginBottom: 0 }}>
            <CheckCircle2 size={16} style={{ color: 'var(--success-badge)', flexShrink: 0 }} />
            <div>
              <strong>No gaps detected!</strong> Your profile aligns with all detected skill keywords for this position.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
