import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary — Capture les erreurs de rendu React et affiche un écran de secours.
 * Empêche un crash isolé de casser l'ensemble de l'application.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary] Erreur capturée :", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className="min-h-screen flex items-center justify-center p-6"
          style={{ background: "var(--blue-muted, #F0F5FF)" }}
        >
          <div
            className="max-w-md w-full text-center p-8 rounded-2xl"
            style={{
              background: "white",
              boxShadow: "0 8px 32px rgba(0, 32, 194, 0.1)",
            }}
          >
            <div
              style={{ fontSize: "48px", marginBottom: "16px" }}
              aria-hidden="true"
            >
              ⚠️
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display, 'Poppins', sans-serif)",
                fontWeight: 700,
                color: "var(--blue-deep, #0A1931)",
                fontSize: "20px",
                marginBottom: "12px",
              }}
            >
              Une erreur est survenue
            </h1>
            <p
              style={{
                color: "var(--gray-600, #64748B)",
                fontSize: "14px",
                lineHeight: "1.6",
                marginBottom: "24px",
              }}
            >
              {this.state.error?.message ||
                "Une erreur inattendue s'est produite. Veuillez réessayer."}
            </p>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-6 py-3 rounded-xl transition-all"
              style={{
                background:
                  "linear-gradient(135deg, var(--blue-primary, #2563EB), var(--blue-accent, #0020C2))",
                color: "white",
                fontWeight: 700,
                fontSize: "14px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Recharger la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
