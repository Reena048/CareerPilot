import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  CheckCircle2,
  XCircle,
  Search,
  BookOpen,
  Award,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { fetchSkillsCatalog } from '../services/api';

const CATALOG_DETAILS = {
  // Programming
  'Python': { topic: 'Python Core & Advanced Concepts', task: 'Build an asynchronous CLI utility or web scraper.' },
  'Java': { topic: 'Modern Java & Spring Boot Fundamentals', task: 'Develop a multi-tiered REST service demonstrating OOP and Streams API.' },
  'C': { topic: 'Low-Level Programming & Memory Management in C', task: 'Implement custom data structures with dynamic memory allocation.' },
  'C++': { topic: 'Modern C++ (C++17/20) & RAII', task: 'Implement a high-performance cache using smart pointers and STL.' },
  'JavaScript': { topic: 'Modern JavaScript (ES6+) & Async Event Loop', task: 'Build an interactive web app with DOM events, Promises, and Fetch API.' },
  'TypeScript': { topic: 'TypeScript Type System & Static Typing', task: 'Convert an existing JavaScript module using generics and strict mode.' },
  'SQL': { topic: 'Relational Querying & Optimization', task: 'Practice complex multi-table JOINs, subqueries, and indexing.' },

  // Frontend
  'HTML': { topic: 'Semantic HTML5 & Accessibility (WCAG)', task: 'Construct a fully accessible landing page with semantic tags and ARIA.' },
  'CSS': { topic: 'Modern CSS (Flexbox, Grid, Custom Properties)', task: 'Build a responsive multi-column layout without UI frameworks.' },
  'React': { topic: 'Component Architecture & State Management in React', task: 'Build a reusable component-based interface with custom hooks and Context API.' },
  'Angular': { topic: 'Angular Architecture (TypeScript, Services, RxJS)', task: 'Build a multi-page dashboard with reactive forms and observables.' },
  'Vue': { topic: 'Vue 3 Composition API & State Management', task: 'Create a single-page app with Pinia store and reactive properties.' },
  'Bootstrap': { topic: 'Bootstrap Grid System & UI Utilities', task: 'Assemble a responsive administration dashboard layout.' },
  'Tailwind CSS': { topic: 'Utility-First CSS with Tailwind', task: 'Recreate a modern SaaS landing page using utility classes and responsive variants.' },

  // Backend
  'Node.js': { topic: 'Node.js Runtime & Non-blocking I/O', task: 'Create an event-driven HTTP server processing file streams.' },
  'Express.js': { topic: 'Express Middleware & REST API Architecture', task: 'Build a REST API with routing modularity and JWT authentication.' },
  'FastAPI': { topic: 'Asynchronous Web APIs with FastAPI & Pydantic', task: 'Develop an API with automated OpenAPI docs and Pydantic validation.' },
  'Django': { topic: 'Django MVT Architecture & ORM Security', task: 'Build a web portal with Django ORM migrations and admin customization.' },
  'Flask': { topic: 'Lightweight Microservices with Flask', task: 'Design a service utilizing Blueprints and application factory pattern.' },
  'REST API': { topic: 'RESTful API Design & HTTP Protocols', task: 'Design and document a complete CRUD API adhering to idempotent verbs.' },

  // Databases
  'MySQL': { topic: 'Relational Data Modeling in MySQL', task: 'Set up a relational schema with foreign keys, indexes, and transactions.' },
  'PostgreSQL': { topic: 'Advanced PostgreSQL & Query Optimization', task: 'Execute queries with JSONB indexing, CTEs, and analyze EXPLAIN plans.' },
  'MongoDB': { topic: 'NoSQL Document Modeling with MongoDB', task: 'Design a document schema with aggregation pipelines and compound indexes.' },
  'SQLite': { topic: 'Embedded Database Storage with SQLite', task: 'Integrate an embedded SQLite database with schema migrations in a local app.' },

  // Tools
  'Git': { topic: 'Distributed Version Control with Git', task: 'Practice branching, rebasing, merge conflict resolution, and cherry-picking.' },
  'GitHub': { topic: 'Collaborative Development & GitHub Actions', task: 'Configure pull request templates, branch protection, and automated workflows.' },
  'Docker': { topic: 'Containerization Fundamentals with Docker', task: 'Write a multi-stage Dockerfile and run a multi-service Docker Compose stack.' },
  'Linux': { topic: 'Linux Command Line & Shell Scripting', task: 'Manage permissions, monitor processes, and write a Bash backup script.' },
  'VS Code': { topic: 'Developer Productivity in Visual Studio Code', task: 'Configure launch.json for interactive step-debugging and linting.' },

  // Computer Science
  'Data Structures': { topic: 'Fundamental & Advanced Data Structures', task: 'Implement stacks, queues, hash tables, and binary search trees.' },
  'Algorithms': { topic: 'Algorithm Analysis & Problem Solving', task: 'Solve algorithmic challenges focusing on Big-O, recursion, and dynamic programming.' },
  'OOP': { topic: 'Object-Oriented Programming & SOLID', task: 'Refactor code applying Encapsulation, Inheritance, Polymorphism, and SOLID.' },
  'DBMS': { topic: 'Database Management Systems Architecture', task: 'Study database normalization, B-trees, concurrency, and transaction isolation.' },
  'Operating Systems': { topic: 'Operating Systems Principles', task: 'Study process scheduling, multithreading, memory paging, and deadlock handling.' },
  'Computer Networks': { topic: 'Computer Networking & Web Protocols', task: 'Inspect HTTP/HTTPS headers, TCP three-way handshakes, and DNS resolution.' },
  'Software Engineering': { topic: 'Software Engineering Methodologies', task: 'Apply Agile practices, write test suites, and draft architecture diagrams.' },

  // Data & AI
  'NumPy': { topic: 'Vectorized Computing with NumPy', task: 'Perform array slicing, matrix multiplications, and high-dimensional ops.' },
  'Pandas': { topic: 'Data Wrangling & Analysis with Pandas', task: 'Clean a real-world dataset, handle missing values, and export pivot summaries.' },
  'Matplotlib': { topic: 'Data Visualization with Matplotlib & Seaborn', task: 'Create publication-quality charts with custom legends and themes.' },
  'Machine Learning': { topic: 'Applied Machine Learning Workflows', task: 'Build, evaluate, and tune a predictive model with cross-validation.' },
  'Deep Learning': { topic: 'Neural Network Fundamentals & Architectures', task: 'Train a multi-layer perceptron or CNN using PyTorch or TensorFlow.' },
  'Natural Language Processing': { topic: 'Natural Language Processing Pipelines', task: 'Build a text classification pipeline with tokenization and embeddings.' },
};

export default function SkillsReportPage({ resumeData }) {
  const [catalog, setCatalog] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSkillModal, setActiveSkillModal] = useState(null);

  useEffect(() => {
    async function loadCatalog() {
      const data = await fetchSkillsCatalog();
      if (data && Object.keys(data).length > 0) {
        setCatalog(data);
      } else {
        // Fallback default dictionary
        setCatalog({
          'Programming': ['Python', 'Java', 'C', 'C++', 'JavaScript', 'TypeScript', 'SQL'],
          'Frontend': ['HTML', 'CSS', 'React', 'Angular', 'Vue', 'Bootstrap', 'Tailwind CSS'],
          'Backend': ['Node.js', 'Express.js', 'FastAPI', 'Django', 'Flask', 'REST API'],
          'Databases': ['MySQL', 'PostgreSQL', 'MongoDB', 'SQLite'],
          'Tools': ['Git', 'GitHub', 'Docker', 'Linux', 'VS Code'],
          'Computer Science': ['Data Structures', 'Algorithms', 'OOP', 'DBMS', 'Operating Systems', 'Computer Networks', 'Software Engineering'],
          'Data and AI': ['NumPy', 'Pandas', 'Matplotlib', 'Machine Learning', 'Deep Learning', 'Natural Language Processing']
        });
      }
    }
    loadCatalog();
  }, []);

  const resumeSkillNames = new Set((resumeData?.detected_skills || []).map((s) => s.name));
  const categories = Object.keys(catalog);

  // Calculate overall catalog coverage if resume uploaded
  const allCatalogSkills = Object.values(catalog).flat();
  const coveredCount = allCatalogSkills.filter((s) => resumeSkillNames.has(s)).length;
  const coveragePercent = allCatalogSkills.length > 0 ? Math.round((coveredCount / allCatalogSkills.length) * 100) : 0;

  const filteredCategories = categories.filter((cat) => {
    if (selectedCategory !== 'ALL' && selectedCategory !== cat) return false;
    return true;
  });

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-600)', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
          <BarChart3 size={16} />
          <span>Skills Report</span>
        </div>
        <h1 className="page-title">Industry Skills Catalog & Benchmark</h1>
        <p className="page-tagline">
          Explore the standardized local skill dictionary, track which competencies appear on your resume, and discover targeted practice tasks.
        </p>
      </div>

      {/* Coverage Banner if resume is loaded */}
      {resumeData ? (
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, var(--primary-50) 100%)',
            borderColor: 'var(--primary-200)',
            marginBottom: '24px',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary-700)', textTransform: 'uppercase' }}>
                Active Resume: {resumeData.filename}
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--slate-900)', marginTop: 2 }}>
                Catalog Coverage: {coveragePercent}% ({coveredCount} of {allCatalogSkills.length} skills)
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--slate-600)', marginTop: 4 }}>
                Green badges indicate skills detected in your uploaded resume. Click any skill for practice exercises.
              </p>
            </div>

            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: '#ffffff',
                border: '4px solid var(--primary-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 900,
                color: 'var(--primary-700)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              {coveragePercent}%
            </div>
          </div>
        </div>
      ) : (
        <div className="notice-box notice-info" style={{ marginBottom: '24px' }}>
          <Info size={18} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <strong>Tip:</strong> Upload a resume on the Dashboard to see real-time indicators highlighting which skills from the catalog are present in your profile!
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`btn btn-sm ${selectedCategory === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '220px' }}>
          <Search
            size={14}
            style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }}
          />
          <input
            type="text"
            placeholder="Search catalog skill..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '32px', fontSize: '13px', padding: '6px 12px 6px 30px' }}
          />
        </div>
      </div>

      {/* Catalog Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filteredCategories.map((cat) => {
          const allSkills = catalog[cat] || [];
          const matchedSkills = allSkills.filter((s) => {
            if (!searchTerm.trim()) return true;
            return s.toLowerCase().includes(searchTerm.toLowerCase());
          });

          if (matchedSkills.length === 0) return null;

          return (
            <div key={cat} className="card">
              <div className="card-header" style={{ marginBottom: '14px' }}>
                <div className="card-title-group">
                  <div className="card-title-icon">
                    <Layers size={18} />
                  </div>
                  <div>
                    <h3 className="card-title">{cat}</h3>
                    <p className="card-subtitle">{matchedSkills.length} standardized competencies</p>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
                {matchedSkills.map((skillName) => {
                  const isPresent = resumeSkillNames.has(skillName);
                  const detail = CATALOG_DETAILS[skillName];

                  return (
                    <div
                      key={skillName}
                      onClick={() => setActiveSkillModal({ name: skillName, category: cat, ...detail })}
                      style={{
                        border: '1px solid var(--slate-200)',
                        borderRadius: 'var(--radius-md)',
                        padding: '14px',
                        backgroundColor: isPresent ? '#f0fdf4' : '#ffffff',
                        borderColor: isPresent ? '#bbf7d0' : 'var(--slate-200)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--primary-400)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = isPresent ? '#bbf7d0' : 'var(--slate-200)';
                        e.currentTarget.style.transform = 'none';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--slate-900)' }}>
                          {skillName}
                        </span>

                        {resumeData && (
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              color: isPresent ? 'var(--success-text)' : 'var(--slate-400)',
                            }}
                          >
                            {isPresent ? (
                              <>
                                <CheckCircle2 size={13} style={{ color: 'var(--success-badge)' }} />
                                In Resume
                              </>
                            ) : (
                              <>Not detected</>
                            )}
                          </span>
                        )}
                      </div>

                      {detail && (
                        <div>
                          <div style={{ fontSize: '12px', color: 'var(--slate-600)', lineHeight: 1.4 }}>
                            {detail.topic}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--primary-600)', marginTop: '6px', fontWeight: 600 }}>
                            Click to view practice task →
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Skill Detail Modal */}
      {activeSkillModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            zIndex: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(3px)',
          }}
          onClick={() => setActiveSkillModal(null)}
        >
          <div
            className="card"
            style={{ width: '100%', maxWidth: '520px', padding: '24px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    background: 'var(--primary-50)',
                    color: 'var(--primary-700)',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  {activeSkillModal.category}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--slate-900)' }}>
                  {activeSkillModal.name}
                </h3>
              </div>

              <button
                onClick={() => setActiveSkillModal(null)}
                className="btn btn-secondary btn-sm"
              >
                Close
              </button>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
                Curriculum Focus
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--slate-800)', marginTop: 2 }}>
                {activeSkillModal.topic || 'General technical proficiency'}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
                Recommended Action Task
              </div>
              <div
                style={{
                  background: 'var(--slate-50)',
                  border: '1px solid var(--slate-200)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px',
                  fontSize: '13px',
                  color: 'var(--slate-800)',
                  marginTop: 4,
                  lineHeight: 1.5,
                }}
              >
                {activeSkillModal.task || 'Build a small proof-of-concept project demonstrating proficiency.'}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setActiveSkillModal(null)}
                className="btn btn-primary btn-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
