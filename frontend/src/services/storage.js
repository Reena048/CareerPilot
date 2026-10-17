/**
 * CareerPilot LocalStorage Service
 * Manages analysis history securely in the browser.
 * Privacy rule: Never stores complete resume text or raw PDF files.
 */

const STORAGE_KEY = 'careerpilot_history_v1';
const MAX_HISTORY_ITEMS = 25;

/**
 * Retrieve saved analysis history
 * @returns {Array} List of past analysis records
 */
export function getAnalysisHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('Failed to parse history from localStorage:', err);
    return [];
  }
}

/**
 * Save an analysis result to history (sanitized, excluding full text)
 * @param {Object} analysisResult 
 * @param {string} role 
 * @param {string} jobTitle 
 * @param {string} resumeName 
 */
export function saveAnalysisToHistory(analysisResult, role = '', jobTitle = '', resumeName = '') {
  try {
    if (!analysisResult) return null;

    const history = getAnalysisHistory();

    const record = {
      id: 'cp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toISOString(),
      formattedDate: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      targetRole: role || analysisResult.target_role || 'General Role',
      jobTitle: jobTitle || 'Custom Job Description',
      resumeName: resumeName || 'Uploaded Resume',
      matchScore: analysisResult.match_score,
      scoreStatus: analysisResult.score_status,
      totalResumeSkills: analysisResult.total_resume_skills,
      totalJobSkills: analysisResult.total_job_skills,
      matchingSkillsCount: analysisResult.matching_skills_count,
      missingSkillsCount: analysisResult.missing_skills_count,
      matchingSkills: analysisResult.matching_skills || [],
      missingSkills: analysisResult.missing_skills || [],
      additionalSkills: analysisResult.additional_skills || [],
      recommendations: (analysisResult.recommendations || []).slice(0, 5),
      categoryBreakdown: analysisResult.category_breakdown || [],
      calculationExplanation: analysisResult.calculation_explanation || '',
    };

    // Prepend to start of history list
    const updated = [record, ...history.filter(h => h.id !== record.id)].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return record;
  } catch (err) {
    console.error('Failed to save analysis to history:', err);
    return null;
  }
}

/**
 * Delete a single history record by ID
 * @param {string} id 
 */
export function deleteHistoryItem(id) {
  try {
    const history = getAnalysisHistory();
    const updated = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete history item:', err);
    return [];
  }
}

/**
 * Clear all history records
 */
export function clearAllHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (err) {
    console.error('Failed to clear history:', err);
    return false;
  }
}
