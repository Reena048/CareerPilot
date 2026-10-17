import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, RefreshCw, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { extractResumePdf } from '../services/api';

export default function ResumeUploader({
  resumeData,
  setResumeData,
  onNotify
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const processFile = async (file) => {
    if (!file) return;

    setErrorMsg('');

    // Pre-validation
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      const err = 'Please upload a PDF document (.pdf format only).';
      setErrorMsg(err);
      if (onNotify) onNotify(err, 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      const err = `File size is ${(file.size / (1024 * 1024)).toFixed(2)} MB. Maximum allowed upload size is 5 MB.`;
      setErrorMsg(err);
      if (onNotify) onNotify(err, 'error');
      return;
    }

    setIsUploading(true);
    try {
      const result = await extractResumePdf(file);
      setResumeData(result);
      if (onNotify) {
        onNotify(`Successfully extracted text from ${result.filename} (${result.detected_skills.length} skills found).`, 'success');
      }
    } catch (err) {
      const msg = err.message || 'Failed to extract resume text.';
      setErrorMsg(msg);
      if (onNotify) onNotify(msg, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleReplaceResume = () => {
    setResumeData(null);
    setErrorMsg('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title-group">
          <div className="card-title-icon">
            <FileText size={18} />
          </div>
          <div>
            <h2 className="card-title">1. Resume Upload</h2>
            <p className="card-subtitle">Upload your text-based PDF resume (in-memory processing)</p>
          </div>
        </div>

        {resumeData && (
          <button
            onClick={handleReplaceResume}
            className="btn btn-secondary btn-sm"
            title="Replace current resume with another file"
          >
            <RefreshCw size={14} />
            <span>Replace Resume</span>
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="notice-box notice-danger">
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <strong>Extraction Notice:</strong> {errorMsg}
          </div>
        </div>
      )}

      {!resumeData ? (
        <div>
          <div
            className={`upload-dropzone ${isDragging ? 'drag-active' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,application/pdf"
              style={{ display: 'none' }}
            />

            <div className="dropzone-icon-circle">
              {isUploading ? (
                <RefreshCw size={26} className="spin-animation" style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <UploadCloud size={28} />
              )}
            </div>

            <h3 className="dropzone-title">
              {isUploading ? 'Extracting text with PyMuPDF...' : 'Drag & drop your PDF resume here'}
            </h3>
            <p className="dropzone-subtitle">
              or click to browse from your device • PDF only • Max file size 5 MB
            </p>
          </div>

          <div className="notice-box notice-info" style={{ marginTop: '16px', marginBottom: 0 }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong>Privacy Assurance:</strong> Uploaded resumes are parsed purely in-memory and discarded.
              They are never saved to disk, logged, or shared with third parties.
              <span style={{ display: 'block', fontSize: '11px', color: 'var(--slate-500)', marginTop: '4px' }}>
                Note: Scanned image-only PDFs require OCR, which is not included in this version.
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* Extracted file details */}
          <div className="extracted-file-banner">
            <div className="file-info-group">
              <div className="file-icon">
                <CheckCircle2 size={22} style={{ color: 'var(--success-badge)' }} />
              </div>
              <div>
                <div className="file-name">{resumeData.filename}</div>
                <div className="file-meta">
                  {resumeData.word_count.toLocaleString()} words • {resumeData.character_count.toLocaleString()} characters • {resumeData.detected_skills.length} skills detected
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowFullPreview(!showFullPreview)}
              className="btn btn-outline-primary btn-sm"
            >
              {showFullPreview ? <EyeOff size={14} /> : <Eye size={14} />}
              <span>{showFullPreview ? 'Hide Text' : 'View Text'}</span>
            </button>
          </div>

          {/* Text preview drawer */}
          {showFullPreview && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--slate-600)', marginBottom: '6px' }}>
                Extracted Text Preview:
              </div>
              <div
                style={{
                  background: 'var(--slate-50)',
                  border: '1px solid var(--slate-200)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  maxHeight: '220px',
                  overflowY: 'auto',
                  fontSize: '12px',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                  color: 'var(--slate-700)',
                  fontFamily: 'monospace',
                }}
              >
                {resumeData.full_text}
              </div>
            </div>
          )}

          {/* Detected Skills pills */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--slate-700)' }}>
                Detected Skills in Resume ({resumeData.detected_skills.length}):
              </div>
            </div>

            {resumeData.detected_skills.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {resumeData.detected_skills.map((skill, idx) => (
                  <span key={idx} className="skill-badge skill-badge-neutral">
                    {skill.name}
                    <span className="badge-category">({skill.category})</span>
                  </span>
                ))}
              </div>
            ) : (
              <div className="notice-box notice-warning" style={{ marginBottom: 0 }}>
                No technical skills matched our dictionary in this resume. You can still proceed with matching.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
