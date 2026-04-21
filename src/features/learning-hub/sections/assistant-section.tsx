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
    <div style={{ padding: "24px 28px 40px", maxWidth: 900, margin: "0 auto" }}>
      {/* Section head */}
      <div style={{ marginBottom: 20 }}>
        <h1
          style={{
            fontFamily: "var(--lh-font-display)",
            fontSize: 22,
            fontWeight: 500,
            color: "var(--lh-ink)",
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          Study Assistant
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--lh-muted)" }}>
          Frontend-only mock assistant — no AI backend required.
        </p>
      </div>

      {/* Chat shell */}
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
            padding: "14px 18px",
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
            S
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
            padding: "20px 22px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {assistantMessages.map((message) => {
            const isBot = message.role === "assistant";
            return (
              <div
                key={message.id}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
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
                  {isBot ? "S" : "Y"}
                </div>

                {/* Bubble */}
                <div
                  style={{
                    maxWidth: "72%",
                    background: isBot ? "var(--lh-surface-2)" : "var(--lh-ink)",
                    color: isBot ? "var(--lh-ink)" : "#fbfaf8",
                    border: isBot ? "1px solid var(--lh-border)" : "none",
                    borderRadius: isBot
                      ? "4px 12px 12px 12px"
                      : "12px 4px 12px 12px",
                    padding: "10px 14px",
                    fontSize: 13.5,
                    lineHeight: 1.55,
                  }}
                >
                  {message.content}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Hint pills */}
        <div
          style={{
            padding: "0 22px 12px",
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
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

        {/* Input row */}
        <div
          style={{
            borderTop: "1px solid var(--lh-border)",
            padding: "12px 18px",
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          <form
            onSubmit={onSubmitAssistantPrompt}
            style={{ display: "flex", flex: 1, gap: 10, alignItems: "center" }}
          >
            <input
              value={assistantInput}
              onChange={(e) => onAssistantInputChange(e.target.value)}
              placeholder="Ask the study assistant..."
              style={{
                flex: 1,
                height: 38,
                padding: "0 14px",
                background: "var(--lh-surface-2)",
                border: "1px solid var(--lh-border)",
                borderRadius: "var(--lh-r-sm)",
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
            <button
              type="submit"
              style={{
                height: 38,
                padding: "0 16px",
                background: "var(--lh-ink)",
                color: "#fff",
                border: "none",
                borderRadius: "var(--lh-r-sm)",
                fontSize: 13.5,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "var(--lh-font-sans)",
                transition: "background 0.12s",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--lh-ink-2)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--lh-ink)"; }}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
