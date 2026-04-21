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
  const inputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = "var(--lh-accent)";
    e.target.style.boxShadow = "0 0 0 3px var(--lh-accent-bg)";
  };
  const inputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = "transparent";
    e.target.style.boxShadow = "none";
  };

  return (
    <div style={{ padding: "24px 28px 40px", maxWidth: 1360, margin: "0 auto" }}>
      {/* Section head */}
      <div style={{ marginBottom: 24 }}>
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
          Study Notes
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--lh-muted)" }}>
          {notes.length} note{notes.length !== 1 ? "s" : ""} saved
        </p>
      </div>

      {/* Corrupted storage warning */}
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

      {/* Composer */}
      <div
        style={{
          background: "var(--lh-surface)",
          border: "1px solid var(--lh-border)",
          borderRadius: "var(--lh-r-lg)",
          padding: 16,
          marginBottom: 24,
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
              padding: "0 0 10px",
              marginBottom: 10,
              fontSize: 15,
              fontWeight: 600,
              color: "var(--lh-ink)",
              fontFamily: "var(--lh-font-sans)",
              transition: "border-color 0.12s, box-shadow 0.12s",
              boxSizing: "border-box",
            }}
            onFocus={(e) => { e.target.style.borderColor = "var(--lh-accent)"; }}
            onBlur={(e) => { e.target.style.borderColor = "var(--lh-border)"; }}
          />
          <textarea
            placeholder="Write your study note here..."
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
              lineHeight: 1.6,
              marginBottom: 12,
              padding: 0,
              transition: "border-color 0.12s, box-shadow 0.12s",
            }}
            onFocus={inputFocus}
            onBlur={inputBlur}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 8,
              paddingTop: 12,
              borderTop: "1px solid var(--lh-border)",
            }}
          >
            <button
              type="submit"
              disabled={!canPersistNotes}
              style={{
                height: 34,
                padding: "0 14px",
                background: canPersistNotes ? "var(--lh-ink)" : "var(--lh-surface-3)",
                color: canPersistNotes ? "#fff" : "var(--lh-muted-2)",
                border: "none",
                borderRadius: "var(--lh-r-sm)",
                fontSize: 13,
                fontWeight: 500,
                cursor: canPersistNotes ? "pointer" : "not-allowed",
                fontFamily: "var(--lh-font-sans)",
              }}
            >
              Save note
            </button>
          </div>
        </form>
      </div>

      {/* Notes grid */}
      {notes.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px 24px",
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
          <p style={{ margin: "6px 0 0", fontSize: 12.5, maxWidth: 280, marginLeft: "auto", marginRight: "auto" }}>
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
              <div
                style={{
                  padding: "14px 16px 10px",
                  borderBottom: "1px solid var(--lh-border)",
                }}
              >
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
                <p
                  style={{
                    margin: "3px 0 0",
                    fontSize: 11,
                    color: "var(--lh-muted-2)",
                  }}
                >
                  {new Date(note.updatedAt).toLocaleDateString("en", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>

              {/* Card body */}
              <div style={{ padding: "10px 16px", flex: 1 }}>
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
                  padding: "8px 16px",
                  borderTop: "1px solid var(--lh-border)",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  disabled={!canPersistNotes}
                  onClick={() => onDeleteNote(note.id)}
                  style={{
                    height: 26,
                    padding: "0 10px",
                    background: "transparent",
                    border: "1px solid var(--lh-border)",
                    borderRadius: "var(--lh-r-xs)",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "var(--lh-danger)",
                    cursor: "pointer",
                    fontFamily: "var(--lh-font-sans)",
                    transition: "background 0.12s, border-color 0.12s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--lh-danger-bg)";
                    e.currentTarget.style.borderColor = "#ecc9bd";
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
