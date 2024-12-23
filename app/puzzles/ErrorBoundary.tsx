"use client";

import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error:", error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="text-center py-12">
          <h2 className="text-red-500">Something went wrong!</h2>
          <button onClick={() => this.setState({ error: null })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
