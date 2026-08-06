import React, { useEffect, useState } from 'react';
import { TrendingUp, Target, Zap, ShieldCheck, Activity, ArrowUpRight } from 'lucide-react';

export default function EriWidget() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/readiness/eri')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => {
        // Fallback demo state
        setData({
          overallEri: 71.2,
          deltaWeekly: 2.4,
          coverage: 68.5,
          mastery: 74.0,
          retention: 62.0,
          examSkill: 70.5,
          consistency: 88.0,
          topLeverageAction: "Solve 20 timed Organic Chemistry PYQs to halt decay in Reaction Mechanisms.",
          statusMessage: "Your consistency is driving ERI growth (+2.4 points). Retention in Organic Chemistry needs revision today."
        });
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: '40px', color: '#9ca3af' }}>Loading Readiness Ledger...</div>;

  const components = [
    { name: 'Coverage', weight: '20%', value: data.coverage, source: 'Practice + declared study', speed: 'Slow', color: '#38bdf8', icon: Target },
    { name: 'Mastery', weight: '30%', value: data.mastery, source: 'Timed in-app questions (IRT)', speed: 'Slow', color: '#818cf8', icon: Zap },
    { name: 'Retention', weight: '20%', value: data.retention, source: 'Spaced retrieval performance', speed: 'Medium', color: '#fb923c', icon: Activity },
    { name: 'Exam Skill', weight: '15%', value: data.examSkill, source: 'Mocks + timed sets', speed: 'Medium', color: '#c084fc', icon: ShieldCheck },
    { name: 'Consistency', weight: '15%', value: data.consistency, source: 'Session events & recovery', speed: 'Fast', color: '#4ade80', icon: TrendingUp },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Hero ERI Header */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', background: 'linear-gradient(135deg, rgba(22, 30, 49, 0.9), rgba(15, 23, 42, 0.9))' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              Exam Readiness Index (ERI)
            </span>
            <span className="badge badge-green">
              <ArrowUpRight size={14} /> +{data.deltaWeekly} this week
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
            <span style={{ fontSize: 'clamp(2.5rem, 8vw, 3.5rem)', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#f3f4f6' }}>
              {data.overallEri}
            </span>
            <span style={{ fontSize: '1.1rem', color: '#6b7280', fontWeight: 600 }}>/ 100</span>
          </div>
          <p style={{ color: '#d1d5db', marginTop: '8px', fontSize: '0.88rem', maxWidth: '600px' }}>
            {data.statusMessage}
          </p>
        </div>

        <div style={{
          background: 'rgba(56, 189, 248, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          padding: '16px',
          borderRadius: '14px',
          maxWidth: '100%',
          flex: '1 1 260px'
        }}>
          <h4 style={{ fontSize: '0.78rem', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', fontWeight: 700 }}>
            Highest Leverage Action
          </h4>
          <p style={{ fontSize: '0.85rem', color: '#e5e7eb', lineHeight: 1.4 }}>
            {data.topLeverageAction}
          </p>
        </div>
      </div>

      {/* 5 Components Grid */}
      <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)', color: '#f3f4f6', fontWeight: 700 }}>
        The Readiness Breakdown
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {components.map((comp) => {
          const Icon = comp.icon;
          return (
            <div key={comp.name} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: comp.color }}>
                  <Icon size={18} />
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f3f4f6' }}>{comp.name}</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
                  {comp.weight}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: 800, color: comp.color, fontFamily: 'var(--font-heading)' }}>
                  {comp.value}%
                </span>
              </div>

              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${comp.value}%`, height: '100%', background: comp.color, borderRadius: '3px' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#9ca3af', marginTop: '4px' }}>
                <span>{comp.source}</span>
                <span style={{ fontWeight: 600 }}>{comp.speed}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
