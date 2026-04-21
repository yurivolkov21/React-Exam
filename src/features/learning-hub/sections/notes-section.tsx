import type { FormEvent } from "react";
import type { StudyNote } from "../types";

type NotesSectionProps = {
  notes: StudyNote[];
  canPersistNotes: boolean;
  noteTitleInput: string;
  noteContentInput: string;
  onNoteTitleInputChange: (value: string) => void;
  onNoteContentInputChange: (value: string) => void;
  onCreateNote: (event: FormEvent<HTMLFormElement>) => void;
  onDeleteNote: (noteId: string) => void;
  onResetCorruptedNotesStorage: () => void;
};

export function NotesSection({
  notes,
  canPersistNotes,
  noteTitleInput,
  noteContentInput,
  onNoteTitleInputChange,
  onNoteContentInputChange,
  onCreateNote,
  onDeleteNote,
  onResetCorruptedNotesStorage,
}: NotesSectionProps) {
  const charCount = noteContentInput.length;

  return (
    <div style={{ padding: "28px 28px 40px", maxWidth: 1360, margin: "0 auto" }}>
      {/* ── Section head ── */}
      <div style={{ marginBottom: 24 }}>
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
          Notes
        </h1>
        <p style={{ margin: 0, fontSize: 13.5, color: "var(--lh-muted)" }}>
          Quick thoughts, patterns, and reminders — persisted locally.
        </p>
      </div>

      {/* ── Corrupted storage warning ── */}
      {!canPersistNotes && (
        <div
          style={{
            background: "var(--lh-danger-bg)",
            border: "1px solid #ecc9bd",
            borderRadius: "var(--lh-r-md)",
            padding: "12px 16px",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <p style={{ margin: 0, fontSize: 13, color: "var(--lh-danger)" }}>
            Notes storage is corrupted. Reset to continue saving.
          </p>
          <button
            onClick={onResetCorruptedNotesStorage}
            style={{
              height: 30,
              padding: "0 12px",
              background: "var(--lh-danger)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--lh-r-xs)",
              fontSize: 12.5,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "var(--lh-font-sans)",
              whiteSpace: "nowrap",
            }}
          >
            Reset storage
          </button>
        </div>
      )}

      {/* ── Composer ── */}
      <div
        style={{
          background: "var(--lh-surface)",
          border: "1px solid var(--lh-border)",
          borderRadius: "var(--lh-r-lg)",
          padding: "18px 20px",
          marginBottom: 28,
          boxShadow: "var(--lh-sh-sm)",
        }}
      >
        <form onSubmit={onCreateNote} style={{ display: "flex", flexDirection: "column" }}>
          <input
            placeholder="Note title"
            value={noteTitleInput}
            onChange={(e) => onNoteTitleInputChange(e.target.value)}
            disabled={!canPersistNotes}
            style={{
              background: "transparent",
              border: "none",
              borderBottom: "1px solid var(--lh-border)",
              outline: "none",
              padding: "0 0 12px",
              marginBottom: 12,
              fontSize: 15,
              fontWeight: 600,
              color: "var(--lh-ink)",
              fontFamily: "var(--lh-font-sans)",
              transition: "border-color 0.12s",
              boxSizing: "border-box",
              width: "100%",
            }}
            onFocus={(e) => { e.target.style.borderColor = "var(--lh-accent)"; }}
            onBlur={(e) => { e.target.style.borderColor = "var(--lh-border)"; }}
          />
          <textarea
            placeholder="Write your note... support for multiline."
            value={noteContentInput}
            onChange={(e) => onNoteContentInputChange(e.target.value)}
            disabled={!canPersistNotes}
            rows={4}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              resize: "vertical",
              fontSize: 13.5,
              color: "var(--lh-ink)",
              fontFamily: "var(--lh-font-sans)",
              lineHeight: 1.65,
              marginBottom: 12,
              padding: 0,
              width: "100%",
              boxSizing: "border-box",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              paddingTop: 12,
              borderTop: "1px solid var(--lh-border)",
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: "var(--lh-muted-2)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {charCount} chars
            </span>
            <button
              type="submit"
              disabled={!canPersistNotes}
              style={{
                height: 34,
                padding: "0 14px",
                background: canPersistNotes ? "var(--lh-accent)" : "var(--lh-surface-3)",
                color: canPersistNotes ? "#fff" : "var(--lh-muted-2)",
                border: "none",
                borderRadius: "var(--lh-r-sm)",
                fontSize: 13,
                fontWeight: 500,
                cursor: canPersistNotes ? "pointer" : "not-allowed",
                fontFamily: "var(--lh-font-sans)",
                transition: "background 0.12s",
              }}
              onMouseEnter={(e) => {
                if (canPersistNotes) e.currentTarget.style.background = "var(--lh-accent-ink)";
              }}
              onMouseLeave={(e) => {
                if (canPersistNotes) e.currentTarget.style.background = "var(--lh-accent)";
              }}
            >
              + Add note
            </button>
          </div>
        </form>
      </div>

      {/* ── Notes grid ── */}
      {notes.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "56px 24px",
            color: "var(--lh-muted-2)",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              background: "var(--lh-surface-2)",
              border: "1px solid var(--lh-border)",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              fontSize: 22,
            }}
          >
            📝
          </div>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "var(--lh-ink)" }}>
            No notes yet
          </p>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 12.5,
              maxWidth: 280,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Use the composer above to capture your first study note.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 14,
          }}
        >
          {notes.map((note) => (
            <div
              key={note.id}
              style={{
                background: "var(--lh-surface)",
                border: "1px solid var(--lh-border)",
                borderRadius: "var(--lh-r-lg)",
                boxShadow: "var(--lh-sh-sm)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                transition: "box-shadow 0.12s, border-color 0.12s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "var(--lh-sh-md)";
                (e.currentTarget as HTMLElement).style.borderColor = "var(--lh-border-strong)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "var(--lh-sh-sm)";
                (e.currentTarget as HTMLElement).style.borderColor = "var(--lh-border)";
              }}
            >
              {/* Card header */}
              <div style={{ padding: "14px 16px 10px" }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--lh-ink)",
                    lineHeight: 1.3,
                  }}
                >
                  {note.title}
                </h3>
              </div>

              {/* Card body */}
              <div style={{ padding: "4px 16px 14px", flex: 1 }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: "var(--lh-muted)",
                    lineHeight: 1.6,
                    display: "-webkit-box",
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: "vertical" as const,
                    overflow: "hidden",
                  }}
                >
                  {note.content}
                </p>
              </div>

              {/* Card footer */}
              <div
                style={{
                  padding: "10px 16px",
                  borderTop: "1px solid var(--lh-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: 11, color: "var(--lh-muted-2)" }}>
                  Updated{" "}
                  {new Date(note.updatedAt).toLocaleDateString("en", {
                    month: "numeric",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <button
                  disabled={!canPersistNotes}
                  onClick={() => onDeleteNote(note.id)}
                  style={{
                    height: 24,
                    padding: "0 9px",
                    background: "transparent",
                    border: "1px solid var(--lh-border)",
                    borderRadius: "var(--lh-r-xs)",
                    fontSize: 11.5,
                    fontWeight: 500,
                    color: "var(--lh-danger)",
                    cursor: canPersistNotes ? "pointer" : "not-allowed",
                    fontFamily: "var(--lh-font-sans)",
                    transition: "background 0.12s, border-color 0.12s",
                  }}
                  onMouseEnter={(e) => {
                    if (canPersistNotes) {
                      e.currentTarget.style.background = "var(--lh-danger-bg)";
                      e.currentTarget.style.borderColor = "#ecc9bd";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = "var(--lh-border)";
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
