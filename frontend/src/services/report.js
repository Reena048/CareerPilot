/**
 * CareerPilot Downloadable Report Generator
 * Creates an attractive, standalone HTML document report for the user to download.
 */

export function downloadHtmlReport(analysis, meta = {}) {
  if (!analysis) return;

  const dateStr = meta.formattedDate || new Date().toLocaleString();
  const roleStr = meta.targetRole || analysis.target_role || 'Not Specified';
  const resumeName = meta.resumeName || 'Resume Document';
  const jobTitle = meta.jobTitle || 'Target Opportunity';

  const matchingPills = (analysis.matching_skills || [])
    .map(s => `<span class="badge badge-success">${escapeHtml(s.name)}</span>`)
    .join(' ') || '<span class="text-muted">None detected</span>';

  const missingPills = (analysis.missing_skills || [])
    .map(s => `<span class="badge badge-danger">${escapeHtml(s.name)}</span>`)
    .join(' ') || '<span class="text-muted">None detected</span>';

  const additionalPills = (analysis.additional_skills || [])
    .map(s => `<span class="badge badge-info">${escapeHtml(s.name)}</span>`)
    .join(' ') || '<span class="text-muted">None detected</span>';

  const recommendationsHtml = (analysis.recommendations || []).map((rec, i) => `
    <div class="rec-card">
      <div class="rec-header">
        <span class="rec-num">#${i + 1}</span>
        <strong>${escapeHtml(rec.skill)}</strong>
        <span class="rec-badge">${escapeHtml(rec.category)}</span>
        ${rec.is_role_suggestion ? '<span class="rec-badge role-tag">Role Recommendation</span>' : ''}
      </div>
      <p><strong>Learning Topic:</strong> ${escapeHtml(rec.topic)}</p>
      <p><strong>Action Task:</strong> ${escapeHtml(rec.task)}</p>
      <p class="rec-rationale"><em>${escapeHtml(rec.rationale)}</em></p>
    </div>
  `).join('');

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CareerPilot Report - ${escapeHtml(roleStr)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #f8fafc;
      color: #0f172a;
      line-height: 1.6;
      padding: 40px 20px;
    }
    .report-container {
      max-width: 900px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      padding: 40px;
    }
    .report-header {
      border-bottom: 2px solid #2563eb;
      padding-bottom: 24px;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .brand-title {
      color: #2563eb;
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }
    .brand-tagline {
      color: #64748b;
      font-size: 13px;
      margin-top: 4px;
    }
    .meta-box {
      text-align: right;
      font-size: 13px;
      color: #475569;
    }
    .score-card {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 10px;
      padding: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 30px;
    }
    .score-number {
      font-size: 48px;
      font-weight: 800;
      color: #1d4ed8;
      line-height: 1;
    }
    .score-details h3 {
      font-size: 18px;
      color: #1e3a8a;
      margin-bottom: 4px;
    }
    .score-details p {
      font-size: 13px;
      color: #3b82f6;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 30px;
    }
    .stat-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px;
      text-align: center;
    }
    .stat-val {
      font-size: 24px;
      font-weight: 700;
      color: #0f172a;
    }
    .stat-lbl {
      font-size: 12px;
      color: #64748b;
      text-transform: uppercase;
      font-weight: 600;
      margin-top: 4px;
    }
    .section-title {
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 14px;
      border-left: 4px solid #2563eb;
      padding-left: 10px;
    }
    .skills-block {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 18px;
      margin-bottom: 24px;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      margin: 3px;
    }
    .badge-success { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
    .badge-danger { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
    .badge-info { background: #e0f2fe; color: #075985; border: 1px solid #bae6fd; }
    .rec-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    }
    .rec-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }
    .rec-num {
      background: #2563eb;
      color: white;
      font-size: 11px;
      font-weight: bold;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .rec-badge {
      background: #f1f5f9;
      color: #475569;
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 9999px;
    }
    .role-tag { background: #fef3c7; color: #92400e; }
    .rec-rationale { font-size: 12px; color: #64748b; margin-top: 6px; }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      font-size: 12px;
      color: #94a3b8;
      text-align: center;
    }
    @media print {
      body { background: white; padding: 0; }
      .report-container { box-shadow: none; border: none; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="report-container">
    <div class="report-header">
      <div>
        <div class="brand-title">CAREERPILOT</div>
        <div class="brand-tagline">AI Resume & Job Matcher Report</div>
      </div>
      <div class="meta-box">
        <div><strong>Date:</strong> ${escapeHtml(dateStr)}</div>
        <div><strong>Target Role:</strong> ${escapeHtml(roleStr)}</div>
        <div><strong>Resume:</strong> ${escapeHtml(resumeName)}</div>
      </div>
    </div>

    <div class="score-card">
      <div class="score-details">
        <h3>Match Score: ${analysis.match_score}% (${escapeHtml(analysis.score_status || 'Analyzed')})</h3>
        <p>${escapeHtml(analysis.calculation_explanation || '')}</p>
      </div>
      <div class="score-number">${analysis.match_score}%</div>
    </div>

    <div class="grid">
      <div class="stat-box">
        <div class="stat-val">${analysis.total_resume_skills}</div>
        <div class="stat-lbl">Resume Skills</div>
      </div>
      <div class="stat-box">
        <div class="stat-val">${analysis.total_job_skills}</div>
        <div class="stat-lbl">Job Skills</div>
      </div>
      <div class="stat-box">
        <div class="stat-val" style="color: #166534;">${analysis.matching_skills_count}</div>
        <div class="stat-lbl">Matching</div>
      </div>
      <div class="stat-box">
        <div class="stat-val" style="color: #991b1b;">${analysis.missing_skills_count}</div>
        <div class="stat-lbl">Missing</div>
      </div>
    </div>

    <div class="section-title">Matching Skills (${analysis.matching_skills_count})</div>
    <div class="skills-block">
      ${matchingPills}
    </div>

    <div class="section-title">Missing Skills (${analysis.missing_skills_count})</div>
    <div class="skills-block">
      ${missingPills}
    </div>

    <div class="section-title">Additional Resume Skills (${analysis.additional_skills_count})</div>
    <div class="skills-block">
      ${additionalPills}
    </div>

    <div class="section-title">Personalized Improvement Plan</div>
    <div style="margin-bottom: 24px;">
      ${recommendationsHtml || '<p class="text-muted">No specific gaps identified. Excellent match!</p>'}
    </div>

    <div class="footer">
      <p>Report generated by CareerPilot • Deterministic Keyword Skill Matching Engine • No external AI APIs</p>
      <p><em>Disclaimer: This score reflects keyword-based skill detection and is not a hiring guarantee or interview prediction.</em></p>
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const safeRole = roleStr.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  a.download = `CareerPilot_Report_${safeRole}_${Date.now()}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
