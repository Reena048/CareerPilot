/**
 * CareerPilot API Service
 * Handles communication with the FastAPI backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

/**
 * Health check to verify backend availability
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`Backend returned status ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error('Health check failed:', err);
    throw new Error('Backend server is currently unavailable. Ensure the FastAPI server is running at ' + API_BASE_URL);
  }
}

/**
 * Extract text and skills from an uploaded PDF file
 * @param {File} file 
 */
export async function extractResumePdf(file) {
  if (!file) {
    throw new Error('No file provided.');
  }

  // 5 MB client-side pre-validation
  const maxBytes = 5 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error(`File is too large (${(file.size / (1024 * 1024)).toFixed(2)} MB). Maximum allowed size is 5 MB.`);
  }

  if (!file.name.toLowerCase().endsWith('.pdf')) {
    throw new Error('Unsupported file type. Please upload a standard PDF (.pdf) document.');
  }

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/extract-resume`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Upload failed with status code ${response.status}`);
  }

  return await response.json();
}

/**
 * Analyze resume text against job description
 * @param {string} resumeText 
 * @param {string} jobDescription 
 * @param {string} targetRole 
 */
export async function analyzeMatch(resumeText, jobDescription, targetRole = null) {
  if (!resumeText || resumeText.trim().length < 10) {
    throw new Error('Resume text must be at least 10 characters long.');
  }
  if (!jobDescription || jobDescription.trim().length < 10) {
    throw new Error('Job description must be at least 10 characters long.');
  }

  const payload = {
    resume_text: resumeText.trim(),
    job_description: jobDescription.trim(),
    target_role: targetRole || null,
  };

  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Analysis failed with status code ${response.status}`);
  }

  return await response.json();
}

/**
 * Fetch supported target roles
 */
export async function fetchTargetRoles() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/roles`);
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn('Could not fetch roles from backend, using fallback list', err);
  }
  return [
    'Frontend Developer',
    'Backend Developer',
    'Full-Stack Developer',
    'Python Developer',
    'Software Development Intern',
    'Data Analyst'
  ];
}

/**
 * Fetch example job descriptions
 */
export async function fetchExampleJobs() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/example-jobs`);
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn('Could not fetch example jobs, using empty fallback', err);
  }
  return {};
}

/**
 * Fetch industry skills catalog
 */
export async function fetchSkillsCatalog() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/skills-catalog`);
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn('Could not fetch skills catalog', err);
  }
  return {};
}
