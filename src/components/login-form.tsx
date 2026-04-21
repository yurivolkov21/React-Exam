import type { FormEvent } from "react";

type LoginFormProps = {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onSwitchToSignup?: () => void;
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  background: "var(--lh-surface)",
  border: "1px solid var(--lh-border-strong)",
  borderRadius: "var(--lh-r-sm)",
  fontSize: 13.5,
  color: "var(--lh-ink)",
  outline: "none",
  transition: "border-color 0.12s, box-shadow 0.12s",
  boxSizing: "border-box",
  fontFamily: "var(--lh-font-sans)",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12.5,
  fontWeight: 500,
  color: "var(--lh-ink-2)",
  marginBottom: 6,
};

const btnPrimaryStyle: React.CSSProperties = {
  width: "100%",
  height: 36,
  background: "var(--lh-ink)",
  color: "#fff",
  border: "none",
  borderRadius: "var(--lh-r-sm)",
  fontSize: 13.5,
  fontWeight: 500,
  cursor: "pointer",
  fontFamily: "var(--lh-font-sans)",
  transition: "background 0.12s",
};

export function LoginForm({ onSubmit, onSwitchToSignup }: LoginFormProps) {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h2
          style={{
            fontFamily: "var(--lh-font-display)",
            fontSize: 26,
            fontWeight: 500,
            color: "var(--lh-ink)",
            letterSpacing: "-0.02em",
            margin: "0 0 6px",
          }}
        >
          Welcome back
        </h2>
        <p style={{ margin: 0, fontSize: 13.5, color: "var(--lh-muted)" }}>
          Sign in to continue your learning journey.
        </p>
      </div>

      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label htmlFor="email" style={labelStyle}>Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--lh-accent)";
              e.target.style.boxShadow = "0 0 0 3px var(--lh-accent-bg)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--lh-border-strong)";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <label htmlFor="password" style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
            <button
              type="button"
              style={{
                background: "none",
                border: "none",
                fontSize: 12,
                color: "var(--lh-accent-ink)",
                cursor: "pointer",
                padding: 0,
                fontFamily: "var(--lh-font-sans)",
              }}
            >
              Forgot password?
            </button>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--lh-accent)";
              e.target.style.boxShadow = "0 0 0 3px var(--lh-accent-bg)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--lh-border-strong)";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        <button
          type="submit"
          style={btnPrimaryStyle}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--lh-ink-2)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "var(--lh-ink)"; }}
        >
          Sign in
        </button>

        {/* OR divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "var(--lh-muted-2)",
            fontSize: 11,
            textTransform: "uppercase",
          }}
        >
          <span style={{ flex: 1, height: 1, background: "var(--lh-border)" }} />
          or
          <span style={{ flex: 1, height: 1, background: "var(--lh-border)" }} />
        </div>

        <p style={{ margin: 0, fontSize: 12.5, color: "var(--lh-muted)", textAlign: "center" }}>
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToSignup}
            style={{
              background: "none",
              border: "none",
              fontSize: 12.5,
              color: "var(--lh-accent-ink)",
              fontWeight: 500,
              cursor: "pointer",
              padding: 0,
              textDecoration: "underline",
              textDecorationColor: "var(--lh-accent-border)",
              textUnderlineOffset: 3,
              fontFamily: "var(--lh-font-sans)",
            }}
          >
            Create account
          </button>
        </p>
      </form>
    </div>
  );
}
