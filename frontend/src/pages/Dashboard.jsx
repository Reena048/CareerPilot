import React from 'react';
import {
  Compass,
  FileCheck,
  Briefcase,
  Sparkles,
  ArrowRight,
  RefreshCw,
  History,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import ResumeUploader from '../components/ResumeUploader';
import JobInput from '../components/JobInput';
import ResultsView from '../components/ResultsView';

export default function Dashboard({
  resumeData,
  setResumeData,
  jobDescription,
  setJobDescription,
  targetRole,
  setTargetRole,
  analysisResult,
  isAnalyzing,
  onAnalyze,
  onResetAnalysis,
  onOpenHistory,
  recentHistory,
  onRestoreFromHistory,
  onNavigateToRoadmap,
  onNotify
}) {
  const canAnalyze = resumeData?.full_text && jobDescription.trim().length >= 10;

  return (
    <div>
      {/* Welcome Heading and Tagline */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-600)', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
          <Compass size={16} />
          <span>AI Resume & Job Matcher</span>
        </div>
        <h1 className="page-title">Welcome to CareerPilot</h1>
        <p className="page-tagline">
          Understand your strengths. Discover your skill gaps. Prepare smarter for your next opportunity.
        </p>
      </div>

      {/* Instructions / Analysis Workflow Summary */}
      <div className="steps-grid">
        <div className="step-card">
          <div className="step-number-badge">1</div>
          <div className="step-title">Upload Resume</div>
          <p className="step-desc">
            Provide a text-based PDF resume. PyMuPDF extracts text and detects key technical skills in-memory.
          </p>
        </div>

        <div className="step-card">
          <div className="step-number-badge">2</div>
          <div className="step-title">Paste Target Job</div>
          <p className="step-desc">
            Paste any job or internship posting, or load our role-specific templates to identify technical prerequisites.
          </p>
        </div>

        <div className="step-card">
          <div className="step-number-badge">3</div>
          <div className="step-title">Analyze & Improve</div>
          <p className="step-desc">
            Get an instant keyword match score, gap analysis breakdown, visualizations, and concrete action tasks.
          </p>
        </div>
      </div>

      {/* Two-Column Cards: Resume Upload & Job Description */}
      <div className="grid-2col">
        <ResumeUploader
          resumeData={resumeData}
          setResumeData={setResumeData}
          onNotify={onNotify}
        />

        <JobInput
          jobDescription={jobDescription}
          setJobDescription={setJobDescription}
          targetRole={targetRole}
          setTargetRole={setTargetRole}
          onNotify={onNotify}
        />
      </div>

      {/* Action Bar */}
      <div
        className="card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          background: 'linear-gradient(135deg, #ffffff 0%, var(--primary-50) 100%)',
          borderColor: 'var(--primary-200)',
          marginTop: '12px',
        }}
      >
        <div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--slate-900)' }}>
            Ready for Analysis?
          </div>
          <div style={{ fontSize: '13px', color: 'var(--slate-600)' }}>
            {!resumeData
              ? 'Please upload a PDF resume to proceed.'
              : jobDescription.trim().length < 10
              ? 'Please paste a target job description or click "Load Example Job".'
              : 'Both resume and job description are ready for deterministic skill matching.'}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {analysisResult && (
            <button
              onClick={onResetAnalysis}
              className="btn btn-secondary"
            >
              <RefreshCw size={15} />
              <span>Reset</span>
            </button>
          )}

          <button
            onClick={onAnalyze}
            disabled={!canAnalyze || isAnalyzing}
            className="btn btn-primary btn-lg"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Analyzing Skills...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Analyze Resume</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Latest Analysis Results Section */}
      {analysisResult && (
        <div id="results-anchor">
          <ResultsView
            analysis={analysisResult}
            onReset={onResetAnalysis}
            targetRole={targetRole}
            resumeName={resumeData?.filename}
            jobTitle={targetRole ? `${targetRole} Posting` : 'Target Opportunity'}
            onNavigateToRoadmap={onNavigateToRoadmap}
            onNotify={onNotify}
          />
        </div>
      )}

      {/* Recent Analysis History Strip */}
      {recentHistory && recentHistory.length > 0 && !analysisResult && (
        <div className="card" style={{ marginTop: '28px' }}>
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-title-icon">
                <History size={18} />
              </div>
              <div>
                <h3 className="card-title">Recent Local Analyses</h3>
                <p className="card-subtitle">Previous results stored in browser LocalStorage</p>
              </div>
            </div>

            <button
              onClick={onOpenHistory}
              className="btn btn-secondary btn-sm"
            >
              <span>View All ({recentHistory.length})</span>
            </button>
          </div>

          <div>
            {recentHistory.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="history-item-row"
                style={{ cursor: 'pointer' }}
                onClick={() => onRestoreFromHistory(item)}
              >
                <div>
                  <div className="history-item-title">{item.targetRole}</div>
                  <div className="history-item-meta">
                    <span>{item.formattedDate}</span>
                    <span>•</span>
                    <span style={{ color: 'var(--success-text)', fontWeight: 600 }}>
                      {item.matchingSkillsCount} matching
                    </span>
                    <span>•</span>
                    <span style={{ color: 'var(--danger-text)', fontWeight: 600 }}>
                      {item.missingSkillsCount} missing
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span
                    style={{
                      fontSize: '15px',
                      fontWeight: 800,
                      color: 'var(--primary-700)',
                      backgroundColor: 'var(--primary-50)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--primary-200)',
                    }}
                  >
                    {item.matchScore}%
                  </span>
                  <button className="btn btn-outline-primary btn-sm">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
