import React, { useEffect, useState } from 'react';
import { Filter, Layers, AlertCircle } from 'lucide-react';
import { getApiUrl } from '../api';

export default function SyllabusHeatmap() {
  const [tiles, setTiles] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('ALL');

  useEffect(() => {
    fetch(getApiUrl('/api/v1/readiness/heatmap'))
      .then((res) => res.json())
      .then((data) => setTiles(data))
      .catch(() => {
        // Fallback demo data
        setTiles([
          { id: 'P01', subject: 'Physics', name: 'Thermodynamics & Heat', weightagePercent: 5.2, decayAdjustedMastery: 45.0, status: 'WEAK', questionsAvailable: 140 },
          { id: 'P02', subject: 'Physics', name: 'Rotational Motion', weightagePercent: 4.8, decayAdjustedMastery: 52.0, status: 'DECAYING', questionsAvailable: 110 },
          { id: 'P03', subject: 'Physics', name: 'Current Electricity', weightagePercent: 6.0, decayAdjustedMastery: 84.0, status: 'STABLE', questionsAvailable: 210 },
          { id: 'P04', subject: 'Physics', name: 'Optics & Ray Optics', weightagePercent: 7.1, decayAdjustedMastery: 78.0, status: 'STABLE', questionsAvailable: 250 },
          { id: 'P05', subject: 'Physics', name: 'Modern Physics', weightagePercent: 6.5, decayAdjustedMastery: 91.0, status: 'STABLE', questionsAvailable: 180 },
          { id: 'C01', subject: 'Chemistry', name: 'Organic Reaction Mechanisms', weightagePercent: 8.0, decayAdjustedMastery: 38.0, status: 'WEAK', questionsAvailable: 320 },
          { id: 'C02', subject: 'Chemistry', name: 'Chemical Equilibrium', weightagePercent: 4.5, decayAdjustedMastery: 62.0, status: 'DECAYING', questionsAvailable: 130 },
          { id: 'C03', subject: 'Chemistry', name: 'Coordination Compounds', weightagePercent: 5.8, decayAdjustedMastery: 88.0, status: 'STABLE', questionsAvailable: 190 },
          { id: 'C04', subject: 'Chemistry', name: 'Electrochemistry', weightagePercent: 4.2, decayAdjustedMastery: 75.0, status: 'STABLE', questionsAvailable: 150 },
          { id: 'C05', subject: 'Chemistry', name: 'Biomolecules & Polymers', weightagePercent: 3.0, decayAdjustedMastery: 95.0, status: 'STABLE', questionsAvailable: 90 },
          { id: 'B01', subject: 'Biology', name: 'Genetics & Inheritance', weightagePercent: 11.5, decayAdjustedMastery: 82.0, status: 'STABLE', questionsAvailable: 450 },
          { id: 'B02', subject: 'Biology', name: 'Human Physiology', weightagePercent: 12.0, decayAdjustedMastery: 79.0, status: 'STABLE', questionsAvailable: 510 },
          { id: 'B03', subject: 'Biology', name: 'Plant Physiology', weightagePercent: 7.5, decayAdjustedMastery: 58.0, status: 'DECAYING', questionsAvailable: 280 },
          { id: 'B04', subject: 'Biology', name: 'Ecology & Environment', weightagePercent: 6.0, decayAdjustedMastery: 90.0, status: 'STABLE', questionsAvailable: 220 }
        ]);
      });
  }, []);

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
