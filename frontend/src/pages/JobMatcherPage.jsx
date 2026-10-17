import React from 'react';
import {
  Briefcase,
  FileText,
  Sparkles,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import JobInput from '../components/JobInput';
import ResultsView from '../components/ResultsView';

export default function JobMatcherPage({
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
  onNavigateToResume,
  onNavigateToRoadmap,
  onNotify
}) {
  const canAnalyze = resumeData?.full_text && jobDescription.trim().length >= 10;

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-600)', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
          <Briefcase size={16} />
          <span>Job Matcher Engine</span>
        </div>
        <h1 className="page-title">Direct Job & Internship Matcher</h1>
        <p className="page-tagline">
          Evaluate your resume against specific target postings to identify matching qualifications and clear skill gaps.
        </p>
      </div>

      {/* Split Workstation */}
      <div className="grid-2col">
        {/* Left Column: Active Resume Status */}
        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-title-icon">
                <FileText size={18} />
              </div>
              <div>
                <h3 className="card-title">Active Resume</h3>
                <p className="card-subtitle">Resume loaded for this matching session</p>
              </div>
            </div>

            <button
              onClick={onNavigateToResume}
              className="btn btn-outline-primary btn-sm"
            >
              <span>{resumeData ? 'Change Resume' : 'Upload Resume'}</span>
            </button>
          </div>

          {resumeData ? (
            <div>
              <div className="extracted-file-banner" style={{ marginBottom: '16px' }}>
                <div className="file-info-group">
                  <div className="file-icon">
                    <CheckCircle2 size={22} style={{ color: 'var(--success-badge)' }} />
                  </div>
                  <div>
                    <div className="file-name">{resumeData.filename}</div>
                    <div className="file-meta">
                      {resumeData.detected_skills.length} skills recognized
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--slate-600)', marginBottom: '8px' }}>
                  Extracted Skills ({resumeData.detected_skills.length}):
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxHeight: '180px', overflowY: 'auto' }}>
                  {resumeData.detected_skills.map((s, idx) => (
                    <span key={idx} className="skill-badge skill-badge-neutral">
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                padding: '36px 16px',
                textAlign: 'center',
                backgroundColor: 'var(--slate-50)',
                borderRadius: 'var(--radius-md)',
                border: '1px dashed var(--slate-300)',
              }}
            >
              <FileText size={32} style={{ color: 'var(--slate-400)', margin: '0 auto 8px' }} />
              <p style={{ fontWeight: 600, color: 'var(--slate-700)' }}>No resume uploaded yet</p>
              <p style={{ fontSize: '12px', color: 'var(--slate-500)', marginTop: 4, marginBottom: 16 }}>
                Upload your resume first to compare against job descriptions.
              </p>
              <button
                onClick={onNavigateToResume}
                className="btn btn-primary btn-sm"
              >
                Upload Resume Now
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Job Input */}
        <JobInput
          jobDescription={jobDescription}
          setJobDescription={setJobDescription}
          targetRole={targetRole}
          setTargetRole={setTargetRole}
          onNotify={onNotify}
        />
      </div>

      {/* Action CTA */}
      <div
        className="card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          background: 'var(--primary-50)',
          borderColor: 'var(--primary-200)',
          marginTop: '16px',
        }}
      >
        <div>
          <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--primary-900)' }}>
            Compare & Calculate Match Score
          </div>
          <div style={{ fontSize: '12px', color: 'var(--primary-700)' }}>
            Runs deterministic keyword extraction and computes skill coverage percentage.
          </div>
        </div>

        <button
          onClick={onAnalyze}
          disabled={!canAnalyze || isAnalyzing}
          className="btn btn-primary btn-lg"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} />
              <span>Analyzing Match...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>Run Job Matcher</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>

      {/* Results View */}
      {analysisResult && (
        <div style={{ marginTop: '24px' }}>
          <ResultsView
            analysis={analysisResult}
            onReset={onResetAnalysis}
            targetRole={targetRole}
            resumeName={resumeData?.filename}
            jobTitle={targetRole ? `${targetRole} Opportunity` : 'Target Job'}
            onNavigateToRoadmap={onNavigateToRoadmap}
            onNotify={onNotify}
          />
        </div>
      )}
    </div>
  );
}
