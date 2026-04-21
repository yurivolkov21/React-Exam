export type AuthMode = "login" | "signup";
export type AppSection = "dashboard" | "tasks" | "notes" | "assistant";
export type TaskPriority = "low" | "medium" | "high";
export type TaskFilter = "all" | "pending" | "done";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

export type KanbanStatus = "pending" | "in-progress" | "done";

export type StudyTask = {
  id: string;
  title: string;
  subject: string;
  priority: TaskPriority;
  dueDate: string;
  completed: boolean;
  kanbanStatus?: KanbanStatus;
  createdAt: string;
  updatedAt: string;
};

export type StudyNote = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type NotesHydrationResult = {
  notes: StudyNote[];
  canPersist: boolean;
  hadCorruption: boolean;
};

export type AssistantMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};
