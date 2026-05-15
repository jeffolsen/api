import { Component, PropsWithChildren, ReactNode } from "react";

type State = { error: Error | null };

type Props = PropsWithChildren<{
  fallback: (error: Error) => ReactNode;
}>;

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return this.props.fallback(this.state.error);
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
