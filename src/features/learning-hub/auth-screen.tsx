import type { FormEvent } from "react";

import { LoginForm } from "@/components/login-form";
import { SignupForm } from "@/components/signup-form";
import type { AuthMode } from "./types";

type AuthScreenProps = {
  authMode: AuthMode;
  authError: string;
  onSwitchAuthMode: (mode: AuthMode) => void;
  onLoginSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onSignupSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const STATS = [
  { value: "4", label: "Focus areas" },
  { value: "25m", label: "Session blocks" },
  { value: "∞", label: "Offline first" },
];

export function AuthScreen({
  authMode,
  authError,
  onSwitchAuthMode,
  onLoginSubmit,
  onSignupSubmit,
}: AuthScreenProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        minHeight: "100svh",
      }}
    >
      {/* ── Left: dark hero panel ── */}
      <div
        style={{
          background: "var(--lh-ink)",
          position: "relative",
          padding: "44px 48px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden",
        }}
        className="hidden md:flex"
      >
        {/* Radial accent glow */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(217,119,87,0.22) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(217,119,87,0.10) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Brand mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: "var(--lh-accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--lh-font-display)",
              fontSize: 18,
              fontWeight: 600,
              color: "#fff",
            }}
          >
            L
          </div>
          <span
            style={{
              fontFamily: "var(--lh-font-display)",
              fontSize: 15,
              fontWeight: 500,
              color: "#fbfaf8",
              letterSpacing: "-0.01em",
            }}
          >
            Learning Hub
          </span>
        </div>

        {/* Hero text */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <h1
            style={{
              fontFamily: "var(--lh-font-display)",
              fontSize: "clamp(2.2rem, 3.2vw, 3.2rem)",
              fontWeight: 500,
              color: "#fbfaf8",
              letterSpacing: "-0.03em",
              lineHeight: 1.12,
              margin: "0 0 20px",
            }}
          >
            Show up daily.{" "}
            <br />
            Learn{" "}
            <em
              style={{
                fontStyle: "italic",
                color: "var(--lh-accent)",
              }}
            >
              deliberately.
            </em>
            <br />
            Ship with confidence.
          </h1>

          <p
            style={{
              margin: "0 0 36px",
              fontSize: 14.5,
              color: "rgba(251,250,248,0.6)",
              lineHeight: 1.65,
              maxWidth: 340,
            }}
          >
            A calm, focused space to plan your study, track what matters, and
            build a streak that sticks — all frontend, fully local, always yours.
          </p>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 32 }}>
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p
                  style={{
                    margin: "0 0 2px",
                    fontFamily: "var(--lh-font-display)",
                    fontSize: 28,
                    fontWeight: 500,
                    color: "#fbfaf8",
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 10.5,
                    fontWeight: 600,
                    color: "rgba(251,250,248,0.4)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <p
          style={{
            margin: 0,
            fontSize: 11.5,
            color: "rgba(251,250,248,0.28)",
            position: "relative",
            zIndex: 1,
          }}
        >
          Frontend-only demo · data saved locally to your browser
        </p>
      </div>

      {/* ── Right: form panel ── */}
      <div
        style={{
          background: "var(--lh-bg)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "44px 32px",
        }}
      >
        <div style={{ width: "100%", maxWidth: 380 }}>
          {/* Tab switcher */}
          <div
            style={{
              display: "flex",
              background: "var(--lh-surface-2)",
              border: "1px solid var(--lh-border)",
              borderRadius: "var(--lh-r-md)",
              padding: 3,
              marginBottom: 28,
            }}
          >
            {(["login", "signup"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => onSwitchAuthMode(mode)}
                style={{
                  flex: 1,
                  height: 32,
                  borderRadius: "var(--lh-r-sm)",
                  border: "none",
                  background: authMode === mode ? "var(--lh-surface)" : "transparent",
                  boxShadow: authMode === mode ? "var(--lh-sh-sm)" : "none",
                  fontSize: 13,
                  fontWeight: authMode === mode ? 500 : 400,
                  color: authMode === mode ? "var(--lh-ink)" : "var(--lh-muted)",
                  cursor: "pointer",
                  fontFamily: "var(--lh-font-sans)",
                  transition: "background 0.15s, color 0.15s",
                }}
              >
                {mode === "login" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          {/* Form */}
          {authMode === "login" ? (
            <LoginForm onSubmit={onLoginSubmit} />
          ) : (
            <SignupForm onSubmit={onSignupSubmit} />
          )}

          {authError && (
            <p
              style={{
                marginTop: 10,
                fontSize: 12,
                color: "var(--lh-danger)",
                textAlign: "center",
              }}
            >
              {authError}
            </p>
          )}
        </div>
      </div>

    </div>
  );
}
