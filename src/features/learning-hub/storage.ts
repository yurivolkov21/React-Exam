import {
  ENABLE_TASKS_SEED_DEMO,
  NOTES_SEED,
  STORAGE_KEYS,
  TASKS_SEED,
} from "./constants";
import { getId } from "./helpers";
import type {
  NotesHydrationResult,
  StudyNote,
  StudyTask,
  UserProfile,
} from "./types";

export const getTaskStorageKey = (userEmail: string) =>
  `${STORAGE_KEYS.tasksPrefix}:${userEmail}`;

export const getNotesStorageKey = (userEmail: string) =>
  `${STORAGE_KEYS.notesPrefix}:${userEmail}`;

export const readStoredUser = (): UserProfile | null => {
  const rawValue = localStorage.getItem(STORAGE_KEYS.user);
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as UserProfile;
  } catch {
    return null;
  }
};

const normalizeTask = (rawTask: unknown): StudyTask | null => {
  if (!rawTask || typeof rawTask !== "object") {
    return null;
  }

  const candidate = rawTask as Partial<StudyTask>;
  if (!candidate.id || !candidate.title || !candidate.subject || !candidate.priority) {
    return null;
  }

  return {
    id: String(candidate.id),
    title: String(candidate.title),
    subject: String(candidate.subject),
    priority:
      candidate.priority === "low" ||
      candidate.priority === "medium" ||
      candidate.priority === "high"
        ? candidate.priority
        : "medium",
    dueDate: typeof candidate.dueDate === "string" ? candidate.dueDate : "",
    completed: Boolean(candidate.completed),
    createdAt:
      typeof candidate.createdAt === "string"
        ? candidate.createdAt
        : new Date().toISOString(),
    updatedAt:
      typeof candidate.updatedAt === "string"
        ? candidate.updatedAt
        : typeof candidate.createdAt === "string"
          ? candidate.createdAt
          : new Date().toISOString(),
  };
};

const buildSeedNotes = (): StudyNote[] =>
  NOTES_SEED.map((note) => ({
    id: getId(),
    title: note.title,
    content: note.content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

const buildDueDate = (dueInDays: number): string => {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + dueInDays);
  return dueDate.toISOString().slice(0, 10);
};

const buildIsoDaysAgo = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

const buildSeedTasks = (): StudyTask[] => {
  const now = new Date().toISOString();

  return TASKS_SEED.map((task) => {
    const completedDaysAgo = task.completedDaysAgo ?? 0;
    const completedAt = buildIsoDaysAgo(completedDaysAgo);
    const createdAt = task.kanbanStatus === "done" ? completedAt : now;
    const updatedAt = task.kanbanStatus === "done" ? completedAt : now;

    return {
      id: getId(),
      title: task.title,
      subject: task.subject,
      priority: task.priority,
      dueDate: buildDueDate(task.dueInDays),
      completed: task.kanbanStatus === "done",
      kanbanStatus: task.kanbanStatus,
      createdAt,
      updatedAt,
    };
  });
};

export const readStoredTasks = (userEmail: string): StudyTask[] => {
  const rawValue = localStorage.getItem(getTaskStorageKey(userEmail));
  if (rawValue === null) {
    return ENABLE_TASKS_SEED_DEMO ? buildSeedTasks() : [];
  }

  try {
    const parsedValue = JSON.parse(rawValue);
    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue
      .map((rawTask) => normalizeTask(rawTask))
      .filter((task): task is StudyTask => task !== null);
  } catch {
    return [];
  }
};

export const readStoredNotes = (userEmail: string): NotesHydrationResult => {
  const rawValue = localStorage.getItem(getNotesStorageKey(userEmail));
  if (!rawValue) {
    return {
      notes: buildSeedNotes(),
      canPersist: true,
      hadCorruption: false,
    };
  }

  try {
    const parsedValue = JSON.parse(rawValue);
    if (!Array.isArray(parsedValue)) {
      return {
        notes: buildSeedNotes(),
        canPersist: false,
        hadCorruption: true,
      };
    }

    const hydratedNotes = parsedValue
      .filter((note) => note && typeof note === "object")
      .map((note) => {
        const candidate = note as Partial<StudyNote>;
        return {
          id: String(candidate.id ?? getId()),
          title: String(candidate.title ?? "Untitled"),
          content: String(candidate.content ?? ""),
          createdAt:
            typeof candidate.createdAt === "string"
              ? candidate.createdAt
              : new Date().toISOString(),
          updatedAt:
            typeof candidate.updatedAt === "string"
              ? candidate.updatedAt
              : new Date().toISOString(),
        };
      });

    return {
      notes: hydratedNotes,
      canPersist: true,
      hadCorruption: false,
    };
  } catch {
    return {
      notes: buildSeedNotes(),
      canPersist: false,
      hadCorruption: true,
    };
  }
};

export const safeSetStorageItem = (
  key: string,
  value: string,
  onError: () => void,
) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    onError();
    return false;
  }
};
