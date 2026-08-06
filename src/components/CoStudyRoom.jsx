import React, { useState, useEffect } from 'react';
import { Users, Play, Pause, VolumeX, ShieldCheck, Clock } from 'lucide-react';

export default function CoStudyRoom() {
  const [activeCount, setActiveCount] = useState(142);
  const [secondsRemaining, setSecondsRemaining] = useState(2400); // 40 minutes left
  const [isRunning, setIsRunning] = useState(true);
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    // Try connecting to WebSocket backend
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/costudy`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setWsConnected(true);
      ws.send('PING');
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.activeCount) {
          setActiveCount(payload.activeCount);
        }
      } catch (err) {}
    };

    ws.onclose = () => setWsConnected(false);

    // Fallback interval for local timer ticking
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 3000));
    }, 1000);

    return () => {
      ws.close();
      clearInterval(interval);
    };
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '720px', margin: '0 auto' }}>
      <div className="glass-card" style={{ padding: '24px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <span className="badge badge-green">
            <VolumeX size={14} /> Silent By Design (No Audio/Video)
          </span>
          <span style={{ fontSize: '0.8rem', color: wsConnected ? '#4ade80' : '#fb923c', fontWeight: 600 }}>
            {wsConnected ? '• Live WS Synced' : '• Standalone Session'}
          </span>
        </div>

        <div>
          <h2 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-heading)', color: '#f3f4f6', fontWeight: 700 }}>
            NEET Repeater Focus Room #4
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '4px' }}>
            Shared 50-minute focus block with silent peer presence.
          </p>
        </div>

        {/* Big Timer Display */}
        <div style={{
          fontSize: 'clamp(2.5rem, 12vw, 4.5rem)',
          fontWeight: 800,
          fontFamily: 'var(--font-heading)',
          color: '#38bdf8',
          letterSpacing: '0.04em',
          textShadow: '0 0 30px rgba(56, 189, 248, 0.3)',
          background: 'rgba(255,255,255,0.02)',
          padding: '12px 24px',
          borderRadius: '20px',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          maxWidth: '100%'
        }}>
          {formatTime(secondsRemaining)}
        </div>

        {/* Live Presence Count */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '8px', color: '#e5e7eb', fontSize: '0.92rem', fontWeight: 600 }}>
          <Users size={18} color="#38bdf8" />
          <span><strong style={{ color: '#38bdf8' }}>{activeCount}</strong> NEET Aspirants Studying Right Now</span>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="btn-primary" onClick={() => setIsRunning(!isRunning)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isRunning ? <Pause size={16} /> : <Play size={16} />}
            {isRunning ? 'Pause Session' : 'Resume Session'}
          </button>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <ShieldCheck size={22} color="#4ade80" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.82rem', color: '#d1d5db', lineHeight: 1.4, flex: 1 }}>
          <strong>Zero Distraction Protocol:</strong> No chat, no audio streams, no video camera feeds. Social facilitation stems purely from shared presence and synchronized time bounds.
        </div>
      </div>
    </div>
  );
}
