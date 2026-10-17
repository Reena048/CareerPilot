import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { PieChart as PieIcon, BarChart2 } from 'lucide-react';

export default function ChartsSection({ analysis }) {
  if (!analysis) return null;

  // 1. Doughnut Data: Matching vs Missing Job Skills
  const matchingCount = analysis.matching_skills_count || 0;
  const missingCount = analysis.missing_skills_count || 0;
  const totalJob = analysis.total_job_skills || 0;

  const doughnutData = [
    { name: 'Matching Skills', value: matchingCount, color: '#10b981' },
    { name: 'Missing Skills', value: missingCount, color: '#ef4444' },
  ];

  // 2. Bar Chart Data: Category Breakdown
  // From analysis.category_breakdown
  const barData = (analysis.category_breakdown || []).map((cat) => ({
    name: cat.category,
    'Resume Skills': cat.resume_count,
    'Required Job Skills': cat.job_count,
    'Matched Skills': cat.matched_count,
  }));

  const hasPieData = totalJob > 0;
  const hasBarData = barData.length > 0;

  return (
    <div className="grid-2col" style={{ marginTop: '24px' }}>
      {/* Doughnut Chart */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-title-icon" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
              <PieIcon size={18} />
            </div>
            <div>
              <h3 className="card-title">Job Skill Coverage</h3>
              <p className="card-subtitle">Matching vs. Missing Required Skills</p>
            </div>
          </div>
        </div>

        {hasPieData ? (
          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={doughnutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {doughnutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} skill${value === 1 ? '' : 's'}`, name]}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                  }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div
            style={{
              height: '240px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--slate-400)',
              fontSize: '13px',
              fontStyle: 'italic',
            }}
          >
            No required job skills detected to chart.
          </div>
        )}
      </div>

      {/* Bar Chart: Skill Comparison by Category */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-title-icon">
              <BarChart2 size={18} />
            </div>
            <div>
              <h3 className="card-title">Category Distribution</h3>
              <p className="card-subtitle">Resume presence vs. Job requirements</p>
            </div>
          </div>
        </div>

        {hasBarData ? (
          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  angle={-20}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                  }}
                />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="Resume Skills" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Required Job Skills" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Matched Skills" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div
            style={{
              height: '240px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--slate-400)',
              fontSize: '13px',
              fontStyle: 'italic',
            }}
          >
            No category distribution available for this analysis.
          </div>
        )}
      </div>
    </div>
  );
}
