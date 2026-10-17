import React, { useState, useEffect } from 'react';
import { Briefcase, Trash2, FileCheck, HelpCircle, Sparkles } from 'lucide-react';
import { fetchTargetRoles, fetchExampleJobs } from '../services/api';

export default function JobInput({
  jobDescription,
  setJobDescription,
  targetRole,
  setTargetRole,
  onNotify
}) {
  const [roles, setRoles] = useState([
    'Frontend Developer',
    'Backend Developer',
    'Full-Stack Developer',
    'Python Developer',
    'Software Development Intern',
    'Data Analyst'
  ]);
  const [exampleJobs, setExampleJobs] = useState({});

  useEffect(() => {
    async function loadMetadata() {
      try {
        const [loadedRoles, loadedExamples] = await Promise.all([
          fetchTargetRoles(),
          fetchExampleJobs()
        ]);
        if (loadedRoles && loadedRoles.length > 0) {
          setRoles(loadedRoles);
        }
        if (loadedExamples && Object.keys(loadedExamples).length > 0) {
          setExampleJobs(loadedExamples);
        }
      } catch (err) {
        console.warn('Metadata loading issue:', err);
      }
    }
    loadMetadata();
  }, []);

  const handleLoadExample = () => {
    const selected = targetRole || 'Frontend Developer';
    const example = exampleJobs[selected];
    if (example && example.description) {
      setJobDescription(example.description);
      if (onNotify) {
        onNotify(`Loaded example job description for "${selected}".`, 'info');
      }
    } else {
      // Fallback sample
      const fallback = `We are seeking a skilled ${selected} with experience in Python, SQL, Git, and Docker. Familiarity with Data Structures and Algorithms is required. Experience with REST APIs and Linux environments is preferred.`;
      setJobDescription(fallback);
      if (onNotify) {
        onNotify(`Loaded sample template for "${selected}".`, 'info');
      }
    }
  };

  const handleClear = () => {
    setJobDescription('');
    if (onNotify) {
      onNotify('Job description cleared.', 'info');
    }
  };

  const charCount = (jobDescription || '').length;
  const wordCount = (jobDescription || '').trim() ? jobDescription.trim().split(/\s+/).length : 0;

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title-group">
          <div className="card-title-icon">
            <Briefcase size={18} />
          </div>
          <div>
            <h2 className="card-title">2. Target Job Description</h2>
            <p className="card-subtitle">Paste a target job or internship posting to evaluate matching requirements</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={handleLoadExample}
            className="btn btn-outline-primary btn-sm"
            title="Load curated job description based on role"
          >
            <Sparkles size={14} />
            <span>Load Example Job</span>
          </button>

          {charCount > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="btn btn-secondary btn-sm"
              title="Clear text area"
            >
              <Trash2 size={14} />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Target Role Selector */}
      <div className="form-group">
        <label className="form-label" htmlFor="target-role-select">
          Target Role (Optional supplementary focus)
        </label>
        <select
          id="target-role-select"
          className="form-select"
          value={targetRole || ''}
          onChange={(e) => setTargetRole(e.target.value)}
        >
          <option value="">-- Select a target role for tailored recommendations --</option>
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <span style={{ fontSize: '11px', color: 'var(--slate-400)' }}>
          Selected role provides tailored improvement recommendations and never fabricates missing job requirements.
        </span>
      </div>

      {/* Large Text Area */}
      <div className="form-group" style={{ marginBottom: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <label className="form-label" htmlFor="job-description-textarea">
            Job or Internship Description
          </label>
          <span style={{ fontSize: '12px', color: 'var(--slate-500)', fontWeight: 500 }}>
            {wordCount} words • {charCount} characters
          </span>
        </div>

        <textarea
          id="job-description-textarea"
          className="form-textarea"
          rows={7}
          placeholder="Paste requirements, responsibilities, technical qualifications, or full job listing text here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </div>
    </div>
  );
}
