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

export const ENABLE_TASKS_SEED_DEMO = true;

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

export const TASKS_SEED = [
  {
    title: "Implement useReducer for complex task filters",
    subject: "React",
    priority: "high",
    dueInDays: 0,
    kanbanStatus: "done",
    completedDaysAgo: 0,
  },
  {
    title: "Review generic utility types (Pick, Omit, Partial)",
    subject: "TypeScript",
    priority: "medium",
    dueInDays: 0,
    kanbanStatus: "done",
    completedDaysAgo: 0,
  },
  {
    title: "Refine dashboard spacing and hierarchy",
    subject: "UI/UX",
    priority: "low",
    dueInDays: -1,
    kanbanStatus: "done",
    completedDaysAgo: 1,
  },
  {
    title: "Write validation regression checklist",
    subject: "Testing",
    priority: "medium",
    dueInDays: -2,
    kanbanStatus: "done",
    completedDaysAgo: 2,
  },
  {
    title: "Solve one two-pointer warmup",
    subject: "Algorithms",
    priority: "low",
    dueInDays: -3,
    kanbanStatus: "done",
    completedDaysAgo: 3,
  },
  {
    title: "Build sidebar keyboard navigation pass",
    subject: "React",
    priority: "medium",
    dueInDays: -5,
    kanbanStatus: "done",
    completedDaysAgo: 5,
  },
  {
    title: "Type-safe assistant response mapping",
    subject: "TypeScript",
    priority: "high",
    dueInDays: -6,
    kanbanStatus: "done",
    completedDaysAgo: 6,
  },
] as const;

export const ASSISTANT_HINTS = [
  "Give me a 3-day React study checklist",
  "Suggest how to break down TypeScript tasks",
  "How can I prepare faster for a frontend exam?",
];
