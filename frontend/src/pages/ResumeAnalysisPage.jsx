import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  Tag,
  Search,
  RefreshCw,
  Compass,
  ArrowRight,
  Layers,
  Code2
} from 'lucide-react';
import ResumeUploader from '../components/ResumeUploader';

export default function ResumeAnalysisPage({
  resumeData,
  setResumeData,
  onNavigateToMatcher,
  onNotify
}) {
  const [skillSearch, setSkillSearch] = useState('');

  // Group detected skills by category
  const skillsByCategory = {};
  if (resumeData?.detected_skills) {
    resumeData.detected_skills.forEach((skill) => {
      if (!skillsByCategory[skill.category]) {
        skillsByCategory[skill.category] = [];
      }
      skillsByCategory[skill.category].push(skill);
    });
  }

  const filteredCategories = Object.keys(skillsByCategory).filter((cat) => {
    if (!skillSearch.trim()) return true;
    const query = skillSearch.toLowerCase();
    return (
      cat.toLowerCase().includes(query) ||
      skillsByCategory[cat].some((s) => s.name.toLowerCase().includes(query))
    );
  });

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-600)', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
          <FileText size={16} />
          <span>Resume Analysis</span>
        </div>
        <h1 className="page-title">Resume Skills & Content Inspection</h1>
        <p className="page-tagline">
          Inspect extracted text, review detected skills by category, and verify your profile before job matching.
        </p>
      </div>

      {!resumeData ? (
        <div>
          <ResumeUploader
            resumeData={resumeData}
            setResumeData={setResumeData}
            onNotify={onNotify}
          />
        </div>
      ) : (
        <div>
          {/* Summary Banner */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div className="file-icon" style={{ width: 48, height: 48 }}>
                  <FileText size={26} />
                </div>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--slate-900)' }}>
                    {resumeData.filename}
                  </h2>
                  <div style={{ fontSize: '13px', color: 'var(--slate-500)', marginTop: 2 }}>
                    {resumeData.word_count.toLocaleString()} words • {resumeData.character_count.toLocaleString()} characters • {resumeData.detected_skills.length} skills recognized
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => setResumeData(null)}
                  className="btn btn-secondary btn-sm"
                >
                  <RefreshCw size={14} />
                  <span>Upload Different Resume</span>
                </button>

                <button
                  onClick={onNavigateToMatcher}
                  className="btn btn-primary btn-sm"
                >
                  <span>Proceed to Job Matcher</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Categorized Skills Section */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <div className="card-header">
              <div className="card-title-group">
                <div className="card-title-icon">
                  <Layers size={18} />
                </div>
                <div>
                  <h3 className="card-title">Categorized Technical Skills ({resumeData.detected_skills.length})</h3>
                  <p className="card-subtitle">Detected via deterministic regex matching with word boundaries</p>
                </div>
              </div>

              {/* Search filter */}
              <div style={{ position: 'relative', width: '220px' }}>
                <Search
                  size={14}
                  style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }}
                />
                <input
                  type="text"
                  placeholder="Filter skills or category..."
                  value={skillSearch}
                  onChange={(e) => setSkillSearch(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '32px', fontSize: '13px', padding: '6px 12px 6px 30px' }}
                />
              </div>
            </div>

            {filteredCategories.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--slate-400)', fontSize: '13px' }}>
                No skills matched your filter query "{skillSearch}".
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredCategories.map((category) => {
                  const skills = skillsByCategory[category] || [];
                  return (
                    <div
                      key={category}
                      style={{
                        background: 'var(--slate-50)',
                        border: '1px solid var(--slate-200)',
                        borderRadius: 'var(--radius-md)',
                        padding: '16px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '13px',
                          fontWeight: 700,
                          color: 'var(--slate-700)',
                          marginBottom: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <Tag size={14} style={{ color: 'var(--primary-600)' }} />
                        <span>{category}</span>
                        <span
                          style={{
                            fontSize: '11px',
                            background: '#ffffff',
                            border: '1px solid var(--slate-200)',
                            padding: '1px 6px',
                            borderRadius: '9999px',
                            color: 'var(--slate-500)',
                          }}
                        >
                          {skills.length}
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {skills.map((s, idx) => (
                          <span
                            key={idx}
                            className="skill-badge skill-badge-matching"
                            title={`Matched on pattern: "${s.matched_term}"`}
                          >
                            <CheckCircle2 size={12} />
                            <span>{s.name}</span>
                            <span style={{ fontSize: '10px', opacity: 0.75 }}>
                              ({s.matched_term})
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Full Extracted Text Viewer */}
          <div className="card">
            <div className="card-header">
              <div className="card-title-group">
                <div className="card-title-icon">
                  <Code2 size={18} />
                </div>
                <div>
                  <h3 className="card-title">Full Extracted Text</h3>
                  <p className="card-subtitle">Raw text parsed from PDF pages in memory by PyMuPDF</p>
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'var(--slate-900)',
                color: '#f8fafc',
                borderRadius: 'var(--radius-md)',
                padding: '18px',
                fontFamily: 'Consolas, Monaco, monospace',
                fontSize: '12px',
                lineHeight: 1.6,
                maxHeight: '400px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
              }}
            >
              {resumeData.full_text}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
