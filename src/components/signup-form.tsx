import type { FormEvent } from "react";

type SignupFormProps = {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onSwitchToLogin?: () => void;
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

export function SignupForm({ onSubmit, onSwitchToLogin }: SignupFormProps) {
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "var(--lh-accent)";
    e.target.style.boxShadow = "0 0 0 3px var(--lh-accent-bg)";
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "var(--lh-border-strong)";
    e.target.style.boxShadow = "none";
  };

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
          Create your account
        </h2>
        <p style={{ margin: 0, fontSize: 13.5, color: "var(--lh-muted)" }}>
          Start your learning journey today.
        </p>
      </div>

      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label htmlFor="name" style={labelStyle}>Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            required
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>

        <div>
          <label htmlFor="email" style={labelStyle}>Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>

        <div>
          <label htmlFor="password" style={labelStyle}>Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <p style={{ margin: "5px 0 0", fontSize: 11.5, color: "var(--lh-muted-2)" }}>
            Must be at least 8 characters.
          </p>
        </div>

        <div>
          <label htmlFor="confirm-password" style={labelStyle}>Confirm Password</label>
          <input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            required
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>

        <button
          type="submit"
          style={btnPrimaryStyle}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--lh-ink-2)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "var(--lh-ink)"; }}
        >
          Create Account
        </button>

        <p style={{ margin: 0, fontSize: 12.5, color: "var(--lh-muted)", textAlign: "center" }}>
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
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
            Sign in
          </button>
        </p>
      </form>
    </div>
  );
}
