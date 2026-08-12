import React from 'react';
import { MessageSquare, HeartHandshake, Eye, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApiResource } from '../hooks/useApiResource';
import { PanelLoading, PanelError } from './PanelState';

export default function ParentReport() {
  const { data: report, error, isLoading, reload } = useApiResource('/api/v1/readiness/parent-report');

  if (isLoading) return <PanelLoading label="Loading Parent Report…" />;
  if (error || !report) {
    return <PanelError error={error} onRetry={reload} label="Parent Report unavailable." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '750px', margin: '0 auto' }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', color: '#f3f4f6', fontWeight: 700 }}>
          Sunday Parent Report Preview
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '2px' }}>
          Principle: The student is the client, the parent is the stakeholder. You review and approve this before it reaches your parents.
        </p>
      </div>

      {/* WhatsApp Card Preview */}
      <div className="glass-card" style={{ padding: '24px', background: 'rgba(18, 28, 23, 0.85)', border: '1px solid rgba(74, 222, 128, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', pb: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MessageSquare size={20} color="#4ade80" />
            <span style={{ fontWeight: 700, color: '#f3f4f6', fontSize: '0.95rem' }}>WhatsApp Utility Message</span>
          </div>
          <span className="badge badge-green">Scheduled Sunday 7:00 PM</span>
        </div>

        <div style={{ background: '#0b141a', padding: '16px', borderRadius: '12px', color: '#e9edef', fontFamily: 'sans-serif', fontSize: '0.9rem', lineHeight: 1.5 }}>
          <p style={{ marginBottom: '8px' }}>
            <strong>📲 Dhruv Weekly Report for {report.studentName}</strong>
          </p>
          <p style={{ marginBottom: '8px' }}>
            <strong>Verified Study Time:</strong> {Math.floor(report.verifiedStudyMinutes / 60)} hours ({report.verifiedStudyMinutes} mins)
          </p>
          <p style={{ marginBottom: '8px' }}>
            <strong>Weekly Progress:</strong> {report.weeklyWin}
          </p>
          <hr style={{ borderColor: '#222d34', margin: '12px 0' }} />
          <p style={{ color: '#00a884', fontWeight: 'bold', marginBottom: '4px' }}>
            💡 Parent Coaching Script:
          </p>
          <p style={{ fontStyle: 'italic', marginBottom: '8px', color: '#8696a0' }}>
            "{report.scriptWhatToSay}"
          </p>
          <p style={{ fontStyle: 'italic', color: '#e57373' }}>
            🛑 Avoid: "{report.scriptWhatNotToSay}"
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button className="btn-primary" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} /> Approve & Authorize WhatsApp Delivery
          </button>
        </div>
      </div>
    </div>
  );
}
