import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('App crashed:', error, info);
  }

  handleReload = () => {
    this.setState({ error: null });
    window.location.reload();
  };

  handleClearSession = () => {
    try {
      window.localStorage.clear();
    } catch {}
    window.location.assign('/login');
  };

  render() {
    if (!this.state.error) return this.props.children;

    const message = this.state.error?.message || String(this.state.error);
    const stack = this.state.error?.stack || '';

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
        <div className="w-full max-w-xl rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
          <h1 className="text-lg font-semibold text-red-700">Something went wrong</h1>
          <p className="mt-1 text-sm text-slate-600">
            The app hit an unexpected error. Details below — share them with support if the issue persists.
          </p>
          <pre className="mt-4 max-h-48 overflow-auto rounded-lg bg-slate-900 px-3 py-2 text-xs leading-relaxed text-slate-100">
            {message}
            {stack ? `\n\n${stack}` : ''}
          </pre>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex items-center rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
            >
              Reload
            </button>
            <button
              type="button"
              onClick={this.handleClearSession}
              className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Clear session & sign in again
            </button>
          </div>
        </div>
      </div>
    );
  }
}
