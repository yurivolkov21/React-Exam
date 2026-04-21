import { useEffect, useRef } from "react";
import type { FormEvent } from "react";

import { ASSISTANT_HINTS } from "../constants";
import type { AssistantMessage } from "../types";

type AssistantSectionProps = {
  assistantMessages: AssistantMessage[];
  assistantInput: string;
  onAssistantInputChange: (value: string) => void;
  onSubmitAssistantPrompt: (event: FormEvent<HTMLFormElement>) => void;
};

export function AssistantSection({
  assistantMessages,
  assistantInput,
  onAssistantInputChange,
  onSubmitAssistantPrompt,
}: AssistantSectionProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [assistantMessages]);

  return (
    <div style={{ padding: "28px 28px 40px", maxWidth: 900, margin: "0 auto" }}>
      {/* ── Section head ── */}
      <div style={{ marginBottom: 20 }}>
        <h1
          style={{
            fontFamily: "var(--lh-font-display)",
            fontSize: 28,
            fontWeight: 500,
            color: "var(--lh-ink)",
            letterSpacing: "-0.03em",
            margin: "0 0 6px",
            lineHeight: 1.15,
          }}
        >
          Study Assistant
        </h1>
        <p style={{ margin: 0, fontSize: 13.5, color: "var(--lh-muted)" }}>
          Frontend-only mock assistant — no AI backend required.
        </p>
      </div>

      {/* ── Chat shell ── */}
      <div
        style={{
          background: "var(--lh-surface)",
          border: "1px solid var(--lh-border)",
          borderRadius: "var(--lh-r-xl)",
          boxShadow: "var(--lh-sh-md)",
          display: "flex",
          flexDirection: "column",
          minHeight: 520,
          overflow: "hidden",
        }}
      >
        {/* Chat head */}
        <div
          style={{
            padding: "14px 20px",
            borderBottom: "1px solid var(--lh-border)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "var(--lh-ink)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--lh-font-display)",
              fontSize: 14,
              fontWeight: 600,
              color: "#fff",
            }}
          >
            L
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: "var(--lh-ink)" }}>
              Study Assistant
            </p>
            <p style={{ margin: 0, fontSize: 11.5, color: "var(--lh-success)" }}>
              ● Online (mock mode)
            </p>
          </div>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            padding: "24px 24px 12px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {assistantMessages.map((message) => {
            const isBot = message.role === "assistant";
            return (
              <div
                key={message.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: isBot ? "flex-start" : "flex-end",
                  gap: 4,
                }}
              >
                {/* Label */}
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: "var(--lh-muted-2)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    paddingLeft: isBot ? 2 : 0,
                    paddingRight: isBot ? 0 : 2,
                  }}
                >
                  {isBot ? "Assistant" : "You"}
                </span>

                {/* Bubble row */}
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-end",
                    flexDirection: isBot ? "row" : "row-reverse",
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: isBot ? "var(--lh-ink)" : "var(--lh-accent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#fff",
                      flexShrink: 0,
                      fontFamily: isBot ? "var(--lh-font-display)" : "var(--lh-font-sans)",
                    }}
                  >
                    {isBot ? "L" : "Y"}
                  </div>

                  {/* Bubble */}
                  <div
                    style={{
                      maxWidth: "72%",
                      background: isBot ? "var(--lh-surface-2)" : "var(--lh-ink)",
                      color: isBot ? "var(--lh-ink)" : "#fbfaf8",
                      border: isBot ? "1px solid var(--lh-border)" : "none",
                      borderRadius: isBot ? "4px 12px 12px 12px" : "12px 4px 12px 12px",
                      padding: "10px 14px",
                      fontSize: 13.5,
                      lineHeight: 1.55,
                    }}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input row */}
        <div
          style={{
            borderTop: "1px solid var(--lh-border)",
            padding: "14px 20px",
          }}
        >
          <form
            onSubmit={onSubmitAssistantPrompt}
            style={{ display: "flex", gap: 10, alignItems: "center" }}
          >
            <input
              value={assistantInput}
              onChange={(e) => onAssistantInputChange(e.target.value)}
              placeholder="Ask anything about your study plan..."
              style={{
                flex: 1,
                height: 40,
                padding: "0 14px",
                background: "var(--lh-surface-2)",
                border: "1px solid var(--lh-border)",
                borderRadius: "var(--lh-r-md)",
                fontSize: 13.5,
                color: "var(--lh-ink)",
                outline: "none",
                fontFamily: "var(--lh-font-sans)",
                transition: "border-color 0.12s, box-shadow 0.12s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--lh-accent)";
                e.target.style.boxShadow = "0 0 0 3px var(--lh-accent-bg)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--lh-border)";
                e.target.style.boxShadow = "none";
              }}
            />
            {/* Circle send button */}
            <button
              type="submit"
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "var(--lh-accent)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "background 0.12s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--lh-accent-ink)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--lh-accent)"; }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M14 8H2M14 8l-5-5M14 8l-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </form>

          {/* Hint pills */}
          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              marginTop: 10,
            }}
          >
            {ASSISTANT_HINTS.map((hint) => (
              <button
                key={hint}
                type="button"
                onClick={() => onAssistantInputChange(hint)}
                style={{
                  height: 26,
                  padding: "0 10px",
                  background: "var(--lh-surface-2)",
                  border: "1px solid var(--lh-border)",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--lh-ink-2)",
                  cursor: "pointer",
                  fontFamily: "var(--lh-font-sans)",
                  transition: "background 0.12s, border-color 0.12s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--lh-surface-3)";
                  e.currentTarget.style.borderColor = "var(--lh-border-strong)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--lh-surface-2)";
                  e.currentTarget.style.borderColor = "var(--lh-border)";
                }}
              >
                {hint}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
