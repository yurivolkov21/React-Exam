import type { AppSection } from "./types";

export const APP_SECTIONS: AppSection[] = [
  "dashboard",
  "tasks",
  "notes",
  "assistant",
];

export const MIN_PASSWORD_LENGTH = 8;

export const STORAGE_KEYS = {
  user: "learning-hub-user",
  tasksPrefix: "learning-hub-tasks",
  notesPrefix: "learning-hub-notes",
} as const;

export const SUBJECT_OPTIONS = [
  "React",
  "TypeScript",
  "UI/UX",
  "Testing",
  "Algorithms",
];

export const NOTES_SEED = [
  {
    title: "Exam Focus",
    content:
      "Prioritize the main flow: auth -> create task -> mark complete -> reload with persisted data.",
  },
  {
    title: "TypeScript Tip",
    content:
      "Use union types for status and priority to reduce logic bugs and improve IDE autocomplete.",
  },
  {
    title: "UI Consistency",
    content:
      "Keep the UI compact with cards and consistent spacing; avoid too many variants during the exam.",
  },
];

export const ASSISTANT_HINTS = [
  "Give me a 3-day React study checklist",
  "Suggest how to break down TypeScript tasks",
  "How can I prepare faster for a frontend exam?",
];
