import React, { useState } from 'react';
import { Filter, Layers, AlertCircle } from 'lucide-react';
import { useApiResource } from '../hooks/useApiResource';
import { PanelLoading, PanelError } from './PanelState';

export default function SyllabusHeatmap() {
  const { data, error, isLoading, reload } = useApiResource('/api/v1/readiness/heatmap');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const tiles = data || [];

  if (isLoading) return <PanelLoading label="Loading Syllabus Heatmap…" />;
  if (error) {
    return <PanelError error={error} onRetry={reload} label="Syllabus Heatmap unavailable." />;
  }

  const filteredTiles = selectedSubject === 'ALL'
    ? tiles
    : tiles.filter((t) => t.subject === selectedSubject);

  const getStatusBadge = (mastery) => {
    if (mastery < 50) return <span className="badge badge-red">Weak Spot</span>;
    if (mastery < 70) return <span className="badge badge-orange">Decaying</span>;
    return <span className="badge badge-green">Stable</span>;
  };

  const getTileBorder = (mastery) => {
    if (mastery < 50) return 'rgba(251, 113, 133, 0.35)';
    if (mastery < 70) return 'rgba(251, 191, 36, 0.35)';
    return 'rgba(52, 211, 153, 0.25)';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', color: '#f3f4f6', fontWeight: 700 }}>
            Syllabus Heatmap
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '2px' }}>
            Tile size = exam weightage (10+ yrs PYQ data). Color = decay-adjusted mastery.
          </p>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '10px', flexWrap: 'wrap' }}>
          {['ALL', 'Physics', 'Chemistry', 'Biology'].map((subj) => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: selectedSubject === subj ? '#0284c7' : 'transparent',
                color: selectedSubject === subj ? '#fff' : '#9ca3af',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {subj}
            </button>
          ))}
        </div>
      </div>

      <div className="grid-heatmap">
        {filteredTiles.map((tile) => (
          <div
            key={tile.id}
            className="glass-card"
            style={{
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              gap: '12px',
              borderColor: getTileBorder(tile.decayAdjustedMastery),
              minHeight: '140px'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>
                  {tile.subject} • {tile.weightagePercent}% Weight
                </span>
                {getStatusBadge(tile.decayAdjustedMastery)}
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f3f4f6', lineHeight: 1.3 }}>
                {tile.name}
              </h4>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '6px' }}>
                <span>Decay Mastery</span>
                <span style={{ fontWeight: 700, color: '#f3f4f6' }}>{tile.decayAdjustedMastery}%</span>
              </div>
              <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px' }}>
                <div
                  style={{
                    width: `${tile.decayAdjustedMastery}%`,
                    height: '100%',
                    background: tile.decayAdjustedMastery < 50 ? '#fb7185' : tile.decayAdjustedMastery < 70 ? '#fbbf24' : '#34d399',
                    borderRadius: '3px'
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
