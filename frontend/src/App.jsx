import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ResumeAnalysisPage from './pages/ResumeAnalysisPage';
import JobMatcherPage from './pages/JobMatcherPage';
import SkillsReportPage from './pages/SkillsReportPage';
import AboutPage from './pages/AboutPage';
import RoadmapPage from './pages/RoadmapPage';
import HistoryModal from './components/HistoryModal';
import { checkBackendHealth, analyzeMatch } from './services/api';
import { getAnalysisHistory, saveAnalysisToHistory } from './services/storage';
import {
  getSavedRoadmapProgress,
  saveRoadmapProgress,
  clearRoadmapProgress,
  buildRoadmapItems
} from './services/roadmap';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);

  // Resume state
  const [resumeData, setResumeData] = useState(null);

  // Job description state
  const [jobDescription, setJobDescription] = useState('');
  const [targetRole, setTargetRole] = useState('');

  // Analysis result state
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Roadmap state (persisted progress & dynamic items)
  const [roadmapProgress, setRoadmapProgress] = useState(getSavedRoadmapProgress());
  const [roadmapItems, setRoadmapItems] = useState([]);

  // History state
  const [history, setHistory] = useState([]);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);

  // Notification / Toast state
  const [toasts, setToasts] = useState([]);

  // Check backend health & load history on mount
  useEffect(() => {
    async function init() {
      // 1. Health check
      try {
        await checkBackendHealth();
        setBackendOnline(true);
      } catch (err) {
        console.warn('Backend unavailable during initial load:', err.message);
        setBackendOnline(false);
      }

      // 2. Load history
      const savedHistory = getAnalysisHistory();
      setHistory(savedHistory);
    }
    init();

    // Periodic health heartbeat every 15 seconds
    const interval = setInterval(async () => {
      try {
        await checkBackendHealth();
        setBackendOnline(true);
      } catch {
        setBackendOnline(false);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Synchronize roadmap items from missing skills while preserving existing progress
  useEffect(() => {
    if (analysisResult?.missing_skills) {
      const items = buildRoadmapItems(
        analysisResult.missing_skills,
        targetRole || analysisResult.target_role,
        roadmapProgress
      );
      setRoadmapItems(items);
    } else {
      setRoadmapItems([]);
    }
  }, [analysisResult, targetRole, roadmapProgress]);

  const handleUpdateSkillStatus = (skillName, newStatus) => {
    const updated = { ...roadmapProgress, [skillName]: newStatus };
    setRoadmapProgress(updated);
    saveRoadmapProgress(updated);
  };

  const handleResetRoadmapProgress = () => {
    clearRoadmapProgress();
    setRoadmapProgress({});
  };

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleAnalyze = async () => {
    if (!resumeData?.full_text) {
      addToast('Please upload a PDF resume before analyzing.', 'error');
      return;
    }
    if (!jobDescription || jobDescription.trim().length < 10) {
      addToast('Please provide a job description of at least 10 characters.', 'error');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeMatch(
        resumeData.full_text,
        jobDescription,
        targetRole || null
      );
      setAnalysisResult(result);

      // Save to local history
      const savedRecord = saveAnalysisToHistory(
        result,
        targetRole,
        targetRole ? `${targetRole} Posting` : 'Custom Opportunity',
        resumeData.filename
      );

      if (savedRecord) {
        setHistory((prev) => [savedRecord, ...prev.filter((p) => p.id !== savedRecord.id)]);
      }

      addToast(`Analysis complete! Match Score: ${result.match_score}%.`, 'success');

      // Scroll to results if on dashboard
      setTimeout(() => {
        const anchor = document.getElementById('results-anchor');
        if (anchor) {
          anchor.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err) {
      console.error('Analysis failed:', err);
      addToast(err.message || 'Failed to complete job match analysis.', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleResetAnalysis = () => {
    setAnalysisResult(null);
    addToast('Analysis cleared.', 'info');
  };

  const handleNewAnalysis = () => {
    setResumeData(null);
    setJobDescription('');
    setTargetRole('');
    setAnalysisResult(null);
    setActiveTab('dashboard');
    addToast('Ready for a new analysis session.', 'info');
  };

  const handleRestoreFromHistory = (record) => {
    // Map history record to analysis result format
    const restored = {
      match_score: record.matchScore,
      score_status: record.scoreStatus || 'Analyzed',
      calculation_explanation: record.calculationExplanation || `Restored from history record (${record.matchScore}%).`,
      disclaimer: 'This score is a transparent, deterministic keyword-based skill match calculation.',
      total_resume_skills: record.totalResumeSkills,
      total_job_skills: record.totalJobSkills,
      matching_skills_count: record.matchingSkillsCount,
      missing_skills_count: record.missingSkillsCount,
      additional_skills_count: (record.additionalSkills || []).length,
      matching_skills: record.matchingSkills || [],
      missing_skills: record.missingSkills || [],
      additional_skills: record.additionalSkills || [],
      category_breakdown: record.categoryBreakdown || [],
      recommendations: record.recommendations || [],
      target_role: record.targetRole,
    };

    setAnalysisResult(restored);
    if (record.targetRole && record.targetRole !== 'General Role') {
      setTargetRole(record.targetRole);
    }
    setActiveTab('dashboard');

    setTimeout(() => {
      const anchor = document.getElementById('results-anchor');
      if (anchor) {
        anchor.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        historyCount={history.length}
        roadmapCount={roadmapItems.length}
        onOpenHistory={() => setHistoryModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="main-content">
        <Navbar
          onToggleMobileMenu={() => setMobileOpen(!mobileOpen)}
          backendOnline={backendOnline}
          onNewAnalysis={handleNewAnalysis}
          onOpenHistory={() => setHistoryModalOpen(true)}
          historyCount={history.length}
        />

        <main className="content-body">
          {activeTab === 'dashboard' && (
            <Dashboard
              resumeData={resumeData}
              setResumeData={setResumeData}
              jobDescription={jobDescription}
              setJobDescription={setJobDescription}
              targetRole={targetRole}
              setTargetRole={setTargetRole}
              analysisResult={analysisResult}
              isAnalyzing={isAnalyzing}
              onAnalyze={handleAnalyze}
              onResetAnalysis={handleResetAnalysis}
              onOpenHistory={() => setHistoryModalOpen(true)}
              recentHistory={history}
              onRestoreFromHistory={handleRestoreFromHistory}
              onNavigateToRoadmap={() => setActiveTab('roadmap')}
              onNotify={addToast}
            />
          )}

          {activeTab === 'resume' && (
            <ResumeAnalysisPage
              resumeData={resumeData}
              setResumeData={setResumeData}
              onNavigateToMatcher={() => setActiveTab('job-matcher')}
              onNotify={addToast}
            />
          )}

          {activeTab === 'job-matcher' && (
            <JobMatcherPage
              resumeData={resumeData}
              setResumeData={setResumeData}
              jobDescription={jobDescription}
              setJobDescription={setJobDescription}
              targetRole={targetRole}
              setTargetRole={setTargetRole}
              analysisResult={analysisResult}
              isAnalyzing={isAnalyzing}
              onAnalyze={handleAnalyze}
              onResetAnalysis={handleResetAnalysis}
              onNavigateToResume={() => setActiveTab('resume')}
              onNavigateToRoadmap={() => setActiveTab('roadmap')}
              onNotify={addToast}
            />
          )}

          {activeTab === 'roadmap' && (
            <RoadmapPage
              roadmapItems={roadmapItems}
              onUpdateSkillStatus={handleUpdateSkillStatus}
              onResetProgress={handleResetRoadmapProgress}
              onNavigateToDashboard={() => setActiveTab('dashboard')}
              hasAnalysis={Boolean(analysisResult)}
              targetRole={targetRole || analysisResult?.target_role}
              onNotify={addToast}
            />
          )}

          {activeTab === 'skills-report' && (
            <SkillsReportPage
              resumeData={resumeData}
            />
          )}

          {activeTab === 'about' && (
            <AboutPage />
          )}
        </main>
      </div>

      {/* LocalStorage History Modal */}
      <HistoryModal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        history={history}
        setHistory={setHistory}
        onRestoreAnalysis={handleRestoreFromHistory}
        onNotify={addToast}
      />

      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
