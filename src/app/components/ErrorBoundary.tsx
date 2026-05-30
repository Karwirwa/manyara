import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    console.error('ErrorBoundary caught an error:', error);
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="fixed inset-0 bg-gradient-to-br from-[#2D1B2E] via-[#1a1625] to-[#2D1B2E] z-50 flex items-center justify-center">
          <div className="glass-card p-8 rounded-2xl text-center max-w-md">
            <h2 className="text-xl mb-4" style={{ color: 'var(--manyara-ivory)' }}>
              Something went wrong
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--manyara-beige)' }}>
              We encountered an unexpected error. Please refresh the page or contact support if the problem persists.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-[#800020] to-[#556B2F] hover:from-[#a00028] hover:to-[#6b7a3a] text-white px-6 py-3 rounded-lg"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
