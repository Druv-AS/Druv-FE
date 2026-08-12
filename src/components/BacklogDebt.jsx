import React from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { useApiResource } from '../hooks/useApiResource';
import { PanelLoading, PanelError } from './PanelState';

export default function BacklogDebt() {
  const { data: debt, error, isLoading, reload } = useApiResource('/api/v1/readiness/backlog-debt');

  if (isLoading) return <PanelLoading label="Loading Debt Ledger…" />;
  if (error || !debt) {
    return <PanelError error={error} onRetry={reload} label="Backlog Debt Ledger unavailable." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', color: '#f3f4f6', fontWeight: 700 }}>
          Backlog Debt Ledger
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '2px' }}>
          Falling behind is treated as a manageable balance sheet item, never a source of shame.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-card" style={{ padding: '20px', borderColor: 'rgba(248, 113, 113, 0.3)' }}>
          <div style={{ fontSize: '0.8rem', color: '#f87171', fontWeight: 600, textTransform: 'uppercase' }}>Current Debt</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f87171', fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
            {debt.debtHours} Hours
          </div>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '4px' }}>
            Accrued across {debt.missedTopicsCount} missed topics
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', borderColor: 'rgba(251, 146, 60, 0.3)' }}>
          <div style={{ fontSize: '0.8rem', color: '#fb923c', fontWeight: 600, textTransform: 'uppercase' }}>Decay Interest</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fb923c', fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
            +{debt.interestAccruedHours} Hours
          </div>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '4px' }}>
            Added because unrevised topics decay
          </div>
        </div>
      </div>

      {/* AI Debt Forgiveness Proposal */}
      <div className="glass-card" style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <ShieldAlert size={20} color="#38bdf8" />
          <h3 style={{ fontSize: '1rem', color: '#f3f4f6', fontWeight: 700 }}>
            System Recommended Debt Forgiveness
          </h3>
        </div>

        <p style={{ fontSize: '0.88rem', color: '#d1d5db', lineHeight: 1.5, marginBottom: '16px' }}>
          {debt.repaymentPlanSummary}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          {debt.proposedForgivenessTopics.map((topic, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', color: '#e5e7eb' }}>
              <CheckCircle2 size={16} color="#4ade80" style={{ flexShrink: 0 }} />
              <span>{topic}</span>
            </div>
          ))}
        </div>

        <button className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', maxWidth: '380px' }}>
          Approve Debt Forgiveness & Update Plan <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
