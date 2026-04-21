import { ListTodoIcon, Trash2Icon } from "lucide-react";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  return (
    <div className="space-y-6 p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Study Notes</CardTitle>
          <CardDescription>
            Capture quick notes to stay focused while preparing for exams.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!canPersistNotes ? (
            <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3">
              <p className="text-sm text-destructive">
                Notes storage is corrupted. Reset it to continue saving changes.
              </p>
              <Button
                className="mt-2"
                size="sm"
                variant="destructive"
                onClick={onResetCorruptedNotesStorage}
              >
                Reset notes storage
              </Button>
            </div>
          ) : null}

          <form className="grid gap-3" onSubmit={onCreateNote}>
            <Input
              placeholder="Note title"
              value={noteTitleInput}
              onChange={(event) => onNoteTitleInputChange(event.target.value)}
              disabled={!canPersistNotes}
            />
            <Textarea
              placeholder="Write your study note here..."
              value={noteContentInput}
              onChange={(event) => onNoteContentInputChange(event.target.value)}
              disabled={!canPersistNotes}
            />
            <div>
              <Button type="submit" disabled={!canPersistNotes}>
                Add note
              </Button>
            </div>
          </form>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {notes.map((note) => (
              <Card key={note.id} size="sm">
                <CardHeader>
                  <CardTitle>{note.title}</CardTitle>
                  <CardDescription>
                    Updated {new Date(note.updatedAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{note.content}</p>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={!canPersistNotes}
                    onClick={() => onDeleteNote(note.id)}
                  >
                    <Trash2Icon />
                    Delete
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {notes.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ListTodoIcon />
                </EmptyMedia>
                <EmptyTitle>No notes yet</EmptyTitle>
                <EmptyDescription>
                  Add your first note to track key concepts for the exam.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
