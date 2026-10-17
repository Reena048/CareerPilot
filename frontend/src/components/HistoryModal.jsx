import React, { useState } from 'react';
import { History, Trash2, X, RotateCcw, ExternalLink, AlertTriangle } from 'lucide-react';
import { deleteHistoryItem, clearAllHistory } from '../services/storage';

export default function HistoryModal({
  isOpen,
  onClose,
  history,
  setHistory,
  onRestoreAnalysis,
  onNotify
}) {
  const [confirmClear, setConfirmClear] = useState(false);

  if (!isOpen) return null;

  const handleDelete = (id, e) => {
    e.stopPropagation();
    const updated = deleteHistoryItem(id);
    setHistory(updated);
    if (onNotify) {
      onNotify('History item removed.', 'info');
    }
  };

  const handleClearAll = () => {
    clearAllHistory();
    setHistory([]);
    setConfirmClear(false);
    if (onNotify) {
      onNotify('All analysis history cleared.', 'info');
    }
  };

  const handleSelectRecord = (record) => {
    if (onRestoreAnalysis) {
      onRestoreAnalysis(record);
      onClose();
      if (onNotify) {
        onNotify(`Restored analysis for ${record.targetRole} (${record.matchScore}%).`, 'success');
      }
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backdropFilter: 'blur(3px)',
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--slate-200)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--slate-50)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="card-title-icon">
              <History size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--slate-900)' }}>
                Analysis History
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--slate-500)' }}>
                Saved locally in browser storage • Click an item to restore results
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--slate-400)',
              padding: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {history.length === 0 ? (
            <div
              style={{
                padding: '48px 20px',
                textAlign: 'center',
                color: 'var(--slate-400)',
                fontSize: '14px',
              }}
            >
              <History size={36} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
              <p style={{ fontWeight: 600, color: 'var(--slate-600)' }}>No previous analyses recorded</p>
              <p style={{ fontSize: '12px', marginTop: 4 }}>
                Perform your first resume and job analysis to track records here.
              </p>
            </div>
          ) : (
            <div>
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectRecord(item)}
                  style={{
                    border: '1px solid var(--slate-200)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px 18px',
                    marginBottom: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '14px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary-300)';
                    e.currentTarget.style.backgroundColor = 'var(--primary-50)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--slate-200)';
                    e.currentTarget.style.backgroundColor = '#ffffff';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: '#ffffff',
                        border: '3px solid var(--primary-600)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '13px',
                        color: 'var(--primary-700)',
                        flexShrink: 0,
                      }}
                    >
                      {item.matchScore}%
                    </div>

                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--slate-900)' }}>
                        {item.targetRole}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--slate-500)', marginTop: 2 }}>
                        {item.formattedDate} • {item.matchingSkillsCount} matching, {item.missingSkillsCount} missing
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectRecord(item);
                      }}
                      className="btn btn-secondary btn-sm"
                      title="Restore this analysis"
                    >
                      <RotateCcw size={13} />
                      <span>Restore</span>
                    </button>

                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="btn btn-danger btn-sm"
                      title="Delete this record"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {history.length > 0 && (
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid var(--slate-200)',
              background: 'var(--slate-50)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {!confirmClear ? (
              <button
                onClick={() => setConfirmClear(true)}
                className="btn btn-danger btn-sm"
              >
                <Trash2 size={14} />
                <span>Clear All History</span>
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--danger-text)', fontWeight: 600 }}>
                  Confirm clear all?
                </span>
                <button
                  onClick={handleClearAll}
                  className="btn btn-danger btn-sm"
                >
                  Yes, Clear
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
              </div>
            )}

            <button onClick={onClose} className="btn btn-secondary btn-sm">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
