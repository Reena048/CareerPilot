import React from 'react';
import {
  Compass,
  ShieldCheck,
  Cpu,
  Layers,
  Calculator,
  AlertTriangle,
  Code2,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-600)', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
          <Compass size={16} />
          <span>About CareerPilot</span>
        </div>
        <h1 className="page-title">CareerPilot — AI Resume & Job Matcher</h1>
        <p className="page-tagline">
          Understand your strengths. Discover your skill gaps. Prepare smarter for your next opportunity.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Core Mission Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-title-icon">
                <Compass size={18} />
              </div>
              <div>
                <h2 className="card-title">Mission & Philosophy</h2>
                <p className="card-subtitle">Transparent, deterministic skill analytics for career preparation</p>
              </div>
            </div>
          </div>

          <p style={{ color: 'var(--slate-700)', lineHeight: 1.6, marginBottom: '16px' }}>
            CareerPilot empowers developers, students, and engineers to evaluate how their resumes align with technical job postings.
            Unlike black-box AI tools that invent qualifications or offer unpredictable match percentages, CareerPilot uses
            <strong> deterministic, transparent keyword matching</strong>. You can see the exact terms that matched, precisely which required skills are missing, and obtain structured practice tasks to bridge gaps.
          </p>

          <div className="steps-grid" style={{ marginBottom: 0 }}>
            <div className="step-card" style={{ background: 'var(--slate-50)' }}>
              <strong style={{ color: 'var(--slate-900)', display: 'block', marginBottom: '4px' }}>
                100% Deterministic
              </strong>
              <p style={{ fontSize: '12px', color: 'var(--slate-600)' }}>
                Predictable, reproducible matching based on regular expressions and curated phrase dictionaries.
              </p>
            </div>

            <div className="step-card" style={{ background: 'var(--slate-50)' }}>
              <strong style={{ color: 'var(--slate-900)', display: 'block', marginBottom: '4px' }}>
                Zero External AI APIs
              </strong>
              <p style={{ fontSize: '12px', color: 'var(--slate-600)' }}>
                No paid subscriptions, third-party LLM costs, or external tracking of your confidential documents.
              </p>
            </div>

            <div className="step-card" style={{ background: 'var(--slate-50)' }}>
              <strong style={{ color: 'var(--slate-900)', display: 'block', marginBottom: '4px' }}>
                In-Memory Privacy
              </strong>
              <p style={{ fontSize: '12px', color: 'var(--slate-600)' }}>
                Uploaded PDF resumes are extracted directly in RAM and immediately released. No disk storage.
              </p>
            </div>
          </div>
        </div>

        {/* Transparent Score Calculation */}
        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-title-icon" style={{ backgroundColor: 'var(--primary-50)', color: 'var(--primary-700)' }}>
                <Calculator size={18} />
              </div>
              <div>
                <h2 className="card-title">Transparent Match Score Formula</h2>
                <p className="card-subtitle">How your match percentage is calculated</p>
              </div>
            </div>
          </div>

          <div
            style={{
              background: 'var(--primary-50)',
              border: '1px solid var(--primary-200)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              textAlign: 'center',
              marginBottom: '16px',
            }}
          >
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary-900)', fontFamily: 'monospace' }}>
              Match Score = (Required Job Skills in Resume ÷ Total Required Job Skills) × 100%
            </div>
            <p style={{ fontSize: '12px', color: 'var(--primary-700)', marginTop: '8px' }}>
              If zero technical skills are detected in the job description, division by zero is safely avoided and a helpful guidance message is displayed.
            </p>
          </div>

          <div className="notice-box notice-warning" style={{ marginBottom: 0 }}>
            <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong>Important Disclaimer:</strong> CareerPilot's match score is a keyword-based technical overlap measurement. It is designed to help you prepare smarter and is <em>not</em> an interview guarantee, hiring prediction, or assessment of soft skills or years of experience.
            </div>
          </div>
        </div>

        {/* Technology Stack & Architecture */}
        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-title-icon">
                <Code2 size={18} />
              </div>
              <div>
                <h2 className="card-title">Technology Stack</h2>
                <p className="card-subtitle">Modern full-stack architecture built for local reliability</p>
              </div>
            </div>
          </div>

          <div className="grid-2col">
            <div style={{ background: 'var(--slate-50)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '8px' }}>
                Frontend
              </h3>
              <ul style={{ fontSize: '13px', color: 'var(--slate-700)', paddingLeft: '18px', lineHeight: 1.8 }}>
                <li><strong>React 19:</strong> Fast component state and modular UI.</li>
                <li><strong>Vite:</strong> Rapid ES module bundling and hot reloading.</li>
                <li><strong>Recharts:</strong> Interactive Doughnut and Bar chart visualizations.</li>
                <li><strong>Lucide React:</strong> Consistent, clean iconography.</li>
                <li><strong>Custom CSS System:</strong> Responsive SaaS styling and tokens.</li>
              </ul>
            </div>

            <div style={{ background: 'var(--slate-50)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '8px' }}>
                Backend
              </h3>
              <ul style={{ fontSize: '13px', color: 'var(--slate-700)', paddingLeft: '18px', lineHeight: 1.8 }}>
                <li><strong>Python 3 & FastAPI:</strong> Asynchronous high-performance REST endpoints.</li>
                <li><strong>PyMuPDF (fitz):</strong> High-fidelity in-memory PDF text extraction.</li>
                <li><strong>Pydantic v2:</strong> Strict request/response payload validation.</li>
                <li><strong>Uvicorn:</strong> Production-ready ASGI web server.</li>
                <li><strong>Swagger UI:</strong> Interactive API documentation at <code>/docs</code>.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Limitations & OCR Note */}
        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-title-icon" style={{ backgroundColor: 'var(--warning-bg)', color: 'var(--warning-text)' }}>
                <AlertTriangle size={18} />
              </div>
              <div>
                <h2 className="card-title">Limitations & Supported Formats</h2>
                <p className="card-subtitle">What you should know about file processing</p>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '13px', color: 'var(--slate-700)', lineHeight: 1.6 }}>
            <p style={{ marginBottom: '10px' }}>
              • <strong>Text-Based PDFs:</strong> Resumes generated from Microsoft Word, Google Docs, Canva, LaTeX, or code editors export standard text layers and are supported with 100% fidelity.
            </p>
            <p style={{ marginBottom: '10px' }}>
              • <strong>Scanned Image-Only PDFs:</strong> Resumes that are scanned images or rasterized photos require Optical Character Recognition (OCR). OCR processing is not included in this lightweight local version to avoid heavy binary model dependencies. If you have an image-based resume, please copy and paste the text directly.
            </p>
            <p>
              • <strong>File Size Limit:</strong> Resumes are restricted to 5 MB to ensure fast, low-latency in-memory parsing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
