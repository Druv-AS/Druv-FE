import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/** Consistent loading placeholder for a data panel. */
export function PanelLoading({ label = 'Loading…' }) {
  return (
    <div style={{ padding: '40px', color: '#9ca3af', textAlign: 'center' }} role="status">
      {label}
    </div>
  );
}

/**
 * Consistent failure state. Shows the server's message and offers a retry, instead of
 * substituting placeholder data that the user would read as real.
 */
export function PanelError({ error, onRetry, label = 'This section could not be loaded.' }) {
  const message = error?.message || label;

  return (
    <div
      role="alert"
      style={{
        padding: '28px 24px',
        margin: '24px auto',
        maxWidth: '520px',
        textAlign: 'center',
        borderRadius: '12px',
        border: '1px solid rgba(248, 113, 113, 0.25)',
        background: 'rgba(248, 113, 113, 0.05)',
        color: '#94a3b8',
      }}
    >
      <AlertTriangle size={20} color="#f87171" style={{ marginBottom: '8px' }} />
      <p style={{ color: '#f87171', fontWeight: 600, marginBottom: '6px' }}>{label}</p>
      <p style={{ fontSize: '0.85rem', marginBottom: onRetry ? '16px' : 0 }}>{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 18px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'rgba(255,255,255,0.04)',
            color: '#e2e8f0',
            cursor: 'pointer',
            fontSize: '0.85rem',
          }}
        >
          <RefreshCw size={14} /> Retry
        </button>
      )}
    </div>
  );
}
