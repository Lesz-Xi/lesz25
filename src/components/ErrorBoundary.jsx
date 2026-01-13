import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-[#070707] text-[#DBD5B5] p-8 text-center">
          <h1 className="text-4xl font-display mb-4">Something went wrong.</h1>
          <p className="text-white/60 mb-8 max-w-md">
            We encountered an error loading the 3D experience. Please try refreshing the page.
          </p>
          <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg text-left max-w-2xl overflow-auto text-xs font-mono text-red-200">
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-8 px-6 py-3 border border-[#DBD5B5] hover:bg-[#DBD5B5] hover:text-[#070707] transition-all duration-300 rounded-full uppercase tracking-widest text-xs font-bold"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
