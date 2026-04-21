import type { FormEvent } from "react";

import { LoginForm } from "@/components/login-form";
import { SignupForm } from "@/components/signup-form";
import { Toaster } from "@/components/ui/sonner";
import type { AuthMode } from "./types";

type AuthScreenProps = {
  authMode: AuthMode;
  authError: string;
  onSwitchAuthMode: (mode: AuthMode) => void;
  onLoginSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onSignupSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

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
        minHeight: "100dvh",
      }}
    >
      {/* Left: dark hero panel */}
      <div
        style={{
          background: "var(--lh-ink)",
          position: "relative",
          padding: 44,
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
            top: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(217,119,87,0.28) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Brand mark */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative", zIndex: 1 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
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
              fontSize: "clamp(2rem, 3vw, 3rem)",
              fontWeight: 500,
              color: "#fbfaf8",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              margin: "0 0 16px",
            }}
          >
            Your personal
            <br />
            study companion.
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: "rgba(251,250,248,0.55)", lineHeight: 1.6, maxWidth: 320 }}>
            Track your learning journey, manage tasks, take notes, and get AI-powered study support — all in one place.
          </p>

          {/* Feature pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 28 }}>
            {["Task Kanban", "Streak Tracking", "Smart Notes", "AI Assistant"].map((f) => (
              <span
                key={f}
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "rgba(251,250,248,0.7)",
                  background: "rgba(251,250,248,0.07)",
                  border: "1px solid rgba(251,250,248,0.12)",
                  borderRadius: 999,
                  padding: "4px 12px",
                }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <p
          style={{
            margin: 0,
            fontSize: 11.5,
            color: "rgba(251,250,248,0.3)",
            position: "relative",
            zIndex: 1,
          }}
        >
          "The expert in anything was once a beginner."
        </p>
      </div>

      {/* Right: form panel */}
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
          {authMode === "login" ? (
            <LoginForm onSubmit={onLoginSubmit} onSwitchToSignup={() => onSwitchAuthMode("signup")} />
          ) : (
            <SignupForm onSubmit={onSignupSubmit} onSwitchToLogin={() => onSwitchAuthMode("login")} />
          )}

          {authError ? (
            <p
              style={{
                marginTop: 8,
                fontSize: 12,
                color: "var(--lh-danger)",
                textAlign: "center",
              }}
            >
              {authError}
            </p>
          ) : null}
        </div>
      </div>

      <Toaster richColors />
    </div>
  );
}
