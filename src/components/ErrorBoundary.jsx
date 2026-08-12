import React from 'react';

/**
 * Catches render-time crashes in a panel so one broken component does not blank the
 * entire application. React has no hook equivalent, so this stays a class component.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Left as a console report; wire this to an error reporter when one is available.
    console.error('Panel crashed:', error, info?.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div style={{
        padding: '32px 24px',
        textAlign: 'center',
        color: '#94a3b8',
        border: '1px solid rgba(248, 113, 113, 0.25)',
        borderRadius: '12px',
        background: 'rgba(248, 113, 113, 0.05)',
        margin: '24px auto',
        maxWidth: '520px',
      }}>
        <p style={{ color: '#f87171', fontWeight: 600, marginBottom: '8px' }}>
          This section could not be displayed.
        </p>
        <p style={{ fontSize: '0.85rem', marginBottom: '16px' }}>
          The rest of Dhruv is still working. Try loading this panel again.
        </p>
        <button
          type="button"
          onClick={this.handleRetry}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'rgba(255,255,255,0.04)',
            color: '#e2e8f0',
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </div>
    );
  }
}
