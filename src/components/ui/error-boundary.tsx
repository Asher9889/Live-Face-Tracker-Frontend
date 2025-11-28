import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="w-full h-full flex flex-col items-center justify-center bg-muted/10 text-muted-foreground p-4 rounded-lg border border-dashed">
                    <AlertTriangle className="h-8 w-8 mb-2 text-yellow-500" />
                    <p className="text-sm font-medium">Video Player Error</p>
                    <button
                        className="mt-2 text-xs underline hover:text-primary"
                        onClick={() => this.setState({ hasError: false })}
                    >
                        Retry
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
