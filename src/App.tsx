import { type FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { AuthScreen } from "@/features/learning-hub/auth-screen";
import {
  MIN_PASSWORD_LENGTH,
  NOTES_SEED,
  STORAGE_KEYS,
  SUBJECT_OPTIONS,
} from "@/features/learning-hub/constants";
import { getAssistantReply, getId, isAppSection, isValidEmail } from "@/features/learning-hub/helpers";
import { HydrationShell } from "@/features/learning-hub/hydration-shell";
import { NewTaskModal } from "@/features/learning-hub/components/new-task-modal";
import { AssistantSection } from "@/features/learning-hub/sections/assistant-section";
import { DashboardSection } from "@/features/learning-hub/sections/dashboard-section";
import { NotesSection } from "@/features/learning-hub/sections/notes-section";
import { TasksSection } from "@/features/learning-hub/sections/tasks-section";
import {
  getNotesStorageKey,
  getTaskStorageKey,
  readStoredNotes,
  readStoredTasks,
  readStoredUser,
  safeSetStorageItem,
} from "@/features/learning-hub/storage";
import type {
  AppSection,
  AssistantMessage,
  AuthMode,
  KanbanStatus,
  StudyNote,
  StudyTask,
  TaskFilter,
  TaskPriority,
  UserProfile,
} from "@/features/learning-hub/types";

const SECTION_LABELS: Record<AppSection, string> = {
  dashboard: "Dashboard",
  tasks: "Tasks",
  notes: "Notes",
  assistant: "Assistant",
};

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function App() {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [authError, setAuthError] = useState<string>("");
  const [activeSection, setActiveSection] = useState<AppSection>("dashboard");
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => readStoredUser());

  const [tasks, setTasks] = useState<StudyTask[]>(() => {
    const storedUser = readStoredUser();
    if (!storedUser) return [];
    return readStoredTasks(storedUser.email);
  });

  const [notes, setNotes] = useState<StudyNote[]>(() => {
    const storedUser = readStoredUser();
    if (!storedUser) return [];
    return readStoredNotes(storedUser.email).notes;
  });

  const [canPersistNotes, setCanPersistNotes] = useState(() => {
    const storedUser = readStoredUser();
    if (!storedUser) return true;
    return readStoredNotes(storedUser.email).canPersist;
  });

  const [isHydrating, setIsHydrating] = useState(true);

  // Task form state (shared between modal and editing)
  const [titleInput, setTitleInput] = useState("");
  const [subjectInput, setSubjectInput] = useState(SUBJECT_OPTIONS[0]);
  const [priorityInput, setPriorityInput] = useState<TaskPriority>("medium");
  const [dueDateInput, setDueDateInput] = useState("");
  const [kanbanStatusInput, setKanbanStatusInput] = useState<KanbanStatus>("pending");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  const [assistantInput, setAssistantInput] = useState("");
  const [taskFilter, setTaskFilter] = useState<TaskFilter>("all");
  const [taskSearch, setTaskSearch] = useState("");
  const [noteTitleInput, setNoteTitleInput] = useState("");
  const [noteContentInput, setNoteContentInput] = useState("");

  const [assistantMessages, setAssistantMessages] = useState<AssistantMessage[]>([
    {
      id: getId(),
      role: "assistant",
      content: "Hello! I am a mock Study Assistant running without an AI backend.",
    },
  ]);

  useEffect(() => {
    if (!currentUser) {
      localStorage.removeItem(STORAGE_KEYS.user);
      setTasks([]);
      setNotes([]);
      setCanPersistNotes(true);
      setTaskFilter("all");
      setTaskSearch("");
      setIsHydrating(false);
      return;
    }

    setIsHydrating(true);
    safeSetStorageItem(STORAGE_KEYS.user, JSON.stringify(currentUser), () => {
      toast.error("Unable to save user to localStorage.");
    });

    setTasks(readStoredTasks(currentUser.email));
    const notesHydration = readStoredNotes(currentUser.email);
    setNotes(notesHydration.notes);
    setCanPersistNotes(notesHydration.canPersist);

    if (notesHydration.hadCorruption) {
      toast.warning(
        "Notes localStorage is corrupted. Default notes were loaded and writes are paused to prevent data loss.",
      );
    }

    setTaskFilter("all");
    setTaskSearch("");

    const hydrateTimer = window.setTimeout(() => setIsHydrating(false), 220);
    return () => window.clearTimeout(hydrateTimer);
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    safeSetStorageItem(
      getTaskStorageKey(currentUser.email),
      JSON.stringify(tasks),
      () => toast.error("Unable to save tasks to localStorage."),
    );
  }, [currentUser, tasks]);

  useEffect(() => {
    if (!currentUser || !canPersistNotes) return;
    safeSetStorageItem(
      getNotesStorageKey(currentUser.email),
      JSON.stringify(notes),
      () => toast.error("Unable to save notes to localStorage."),
    );
  }, [canPersistNotes, currentUser, notes]);

  // ── Derived stats ──
  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const progress = total ? Math.round((completed / total) * 100) : 0;
    const today = new Date().toISOString().slice(0, 10);
    const dueToday = tasks.filter((t) => t.dueDate === today).length;
    return { total, completed, pending, progress, dueToday };
  }, [tasks]);

  const visibleTasks = useMemo(
    () => [...tasks].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [tasks],
  );

  const filteredTasks = useMemo(() => {
    const q = taskSearch.trim().toLowerCase();
    return visibleTasks.filter((task) => {
      const matchesFilter =
        taskFilter === "all" || (taskFilter === "done" ? task.completed : !task.completed);
      const matchesSearch =
        !q || task.title.toLowerCase().includes(q) || task.subject.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [taskFilter, taskSearch, visibleTasks]);

  const streak = useMemo(() => {
    const today = new Date();
    let count = 0;
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dayStr = d.toISOString().slice(0, 10);
      const hadActivity = visibleTasks.some(
        (t) => t.completed && t.updatedAt?.slice(0, 10) === dayStr,
      );
      if (hadActivity) {
        count++;
      } else if (i > 0) {
        break;
      }
    }
    return count;
  }, [visibleTasks]);

  // ── Handlers ──
  const resetTaskForm = () => {
    setTitleInput("");
    setSubjectInput(SUBJECT_OPTIONS[0]);
    setPriorityInput("medium");
    setDueDateInput("");
    setKanbanStatusInput("pending");
    setEditingTaskId(null);
  };

  const openNewTaskModal = () => {
    resetTaskForm();
    setShowNewTaskModal(true);
  };

  const closeTaskModal = () => {
    setShowNewTaskModal(false);
    resetTaskForm();
  };

  const handleLoginSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError("");
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");
    if (!isValidEmail(email)) { setAuthError("Invalid email address."); return; }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setAuthError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    setCurrentUser({ id: getId(), name: email.split("@")[0] || "Learner", email, avatar: "" });
    setActiveSection("dashboard");
    toast.success("Signed in successfully.");
  };

  const handleSignupSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError("");
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");
    if (!name) { setAuthError("Please enter your full name."); return; }
    if (!isValidEmail(email)) { setAuthError("Invalid email address."); return; }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setAuthError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirmPassword) { setAuthError("Password confirmation does not match."); return; }
    setCurrentUser({ id: getId(), name, email, avatar: "" });
    setActiveSection("dashboard");
    toast.success("Account created successfully.");
  };

  const handleLogout = () => {
    setTasks([]);
    setNotes([]);
    setCanPersistNotes(true);
    setTaskFilter("all");
    setTaskSearch("");
    setNoteTitleInput("");
    setNoteContentInput("");
    setCurrentUser(null);
    setAuthMode("login");
    setAuthError("");
    setActiveSection("dashboard");
    setShowNewTaskModal(false);
    toast.info("Signed out.");
  };

  const handleTaskSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedTitle = titleInput.trim();
    if (!normalizedTitle) { toast.error("Task title cannot be empty."); return; }
    const now = new Date().toISOString();
    if (editingTaskId) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTaskId
            ? {
                ...task,
                title: normalizedTitle,
                subject: subjectInput,
                priority: priorityInput,
                dueDate: dueDateInput,
                kanbanStatus: kanbanStatusInput,
                completed: kanbanStatusInput === "done",
                updatedAt: now,
              }
            : task,
        ),
      );
      toast.success("Task updated successfully.");
    } else {
      const nextTask: StudyTask = {
        id: getId(),
        title: normalizedTitle,
        subject: subjectInput,
        priority: priorityInput,
        dueDate: dueDateInput,
        kanbanStatus: kanbanStatusInput,
        completed: kanbanStatusInput === "done",
        createdAt: now,
        updatedAt: now,
      };
      setTasks((prev) => [nextTask, ...prev]);
      toast.success("Task added.");
    }
    closeTaskModal();
  };

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              kanbanStatus: task.completed ? "pending" : "done",
              updatedAt: new Date().toISOString(),
            }
          : task,
      ),
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (editingTaskId === taskId) resetTaskForm();
    toast.info("Task deleted.");
  };

  const startEditingTask = (task: StudyTask) => {
    setEditingTaskId(task.id);
    setTitleInput(task.title);
    setSubjectInput(task.subject);
    setPriorityInput(task.priority);
    setDueDateInput(task.dueDate);
    setKanbanStatusInput(task.kanbanStatus ?? (task.completed ? "done" : "pending"));
    setShowNewTaskModal(true);
  };

  const moveTask = (taskId: string, status: KanbanStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, kanbanStatus: status, completed: status === "done", updatedAt: new Date().toISOString() }
          : task,
      ),
    );
  };

  const submitAssistantPrompt = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = assistantInput.trim();
    if (!trimmed) return;
    const userMessage: AssistantMessage = { id: getId(), role: "user", content: trimmed };
    const botMessage: AssistantMessage = { id: getId(), role: "assistant", content: getAssistantReply(trimmed) };
    setAssistantMessages((prev) => [...prev, userMessage, botMessage]);
    setAssistantInput("");
  };

  const createNote = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = noteTitleInput.trim();
    const content = noteContentInput.trim();
    if (!title || !content) { toast.error("A note must have both title and content."); return; }
    const now = new Date().toISOString();
    const newNote: StudyNote = { id: getId(), title, content, createdAt: now, updatedAt: now };
    setNotes((prev) => [newNote, ...prev]);
    setNoteTitleInput("");
    setNoteContentInput("");
    toast.success("Note added.");
  };

  const deleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    toast.info("Note deleted.");
  };

  const resetCorruptedNotesStorage = () => {
    if (!currentUser) return;
    const seededNotes = NOTES_SEED.map((note) => ({
      id: getId(),
      title: note.title,
      content: note.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    setNotes(seededNotes);
    setCanPersistNotes(true);
    toast.success("Notes were reset and localStorage writes are enabled again.");
  };

  const switchAuthMode = (mode: AuthMode) => {
    setAuthMode(mode);
    setAuthError("");
  };

  // ── Auth ──
  if (!currentUser) {
    return (
      <AuthScreen
        authMode={authMode}
        authError={authError}
        onSwitchAuthMode={switchAuthMode}
        onLoginSubmit={handleLoginSubmit}
        onSignupSubmit={handleSignupSubmit}
      />
    );
  }

  if (isHydrating) {
    return (
      <HydrationShell
        activeSection={activeSection}
        currentUser={currentUser}
        onNavigate={(item) => { if (isAppSection(item)) setActiveSection(item); }}
        onLogout={handleLogout}
      />
    );
  }

  // ── Section content ──
  let sectionContent = null;
  if (activeSection === "dashboard") {
    sectionContent = (
      <DashboardSection
        taskStats={taskStats}
        visibleTasks={visibleTasks}
        streak={streak}
        onOpenNewTask={openNewTaskModal}
        onNavigateToTasks={() => setActiveSection("tasks")}
      />
    );
  } else if (activeSection === "tasks") {
    sectionContent = (
      <TasksSection
        taskSearch={taskSearch}
        taskFilter={taskFilter}
        visibleTasks={visibleTasks}
        filteredTasks={filteredTasks}
        onTaskSearchChange={setTaskSearch}
        onTaskFilterChange={setTaskFilter}
        onStartEditTask={startEditingTask}
        onToggleTask={toggleTask}
        onDeleteTask={deleteTask}
        onMoveTask={moveTask}
        onOpenNewTask={openNewTaskModal}
      />
    );
  } else if (activeSection === "notes") {
    sectionContent = (
      <NotesSection
        notes={notes}
        canPersistNotes={canPersistNotes}
        noteTitleInput={noteTitleInput}
        noteContentInput={noteContentInput}
        onNoteTitleInputChange={setNoteTitleInput}
        onNoteContentInputChange={setNoteContentInput}
        onCreateNote={createNote}
        onDeleteNote={deleteNote}
        onResetCorruptedNotesStorage={resetCorruptedNotesStorage}
      />
    );
  } else {
    sectionContent = (
      <AssistantSection
        assistantMessages={assistantMessages}
        assistantInput={assistantInput}
        onAssistantInputChange={setAssistantInput}
        onSubmitAssistantPrompt={submitAssistantPrompt}
      />
    );
  }

  const greeting = getGreeting();

  return (
    <SidebarProvider>
      <AppSidebar
        activeItem={activeSection}
        onNavigate={(item) => { if (isAppSection(item)) setActiveSection(item); }}
        onLogout={handleLogout}
        pendingCount={taskStats.pending}
        user={currentUser}
      />
      <SidebarInset>
        {/* ── Topbar ── */}
        <header
          style={{
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid var(--lh-border)",
            background: "var(--lh-surface)",
            padding: "0 20px 0 16px",
            position: "sticky",
            top: 0,
            zIndex: 10,
            gap: 12,
          }}
        >
          {/* Left: trigger + breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
            <SidebarTrigger />
            <span style={{ width: 1, height: 18, background: "var(--lh-border)", flexShrink: 0 }} />
            <nav style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13 }}>
              <span style={{ color: "var(--lh-muted)", whiteSpace: "nowrap" }}>Learning Hub</span>
              <span style={{ color: "var(--lh-muted-2)" }}>/</span>
              <span style={{ color: "var(--lh-ink)", fontWeight: 600, whiteSpace: "nowrap" }}>
                {SECTION_LABELS[activeSection]}
              </span>
            </nav>
          </div>

          {/* Right: streak + greeting + new task */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            {streak > 0 && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 12.5,
                  fontWeight: 500,
                  color: "var(--lh-accent-ink)",
                  background: "var(--lh-accent-bg)",
                  border: "1px solid var(--lh-accent-border)",
                  borderRadius: 999,
                  padding: "4px 11px",
                  whiteSpace: "nowrap",
                }}
              >
                🔥 {streak}-day streak
              </span>
            )}
            <span
              style={{
                fontSize: 13,
                color: "var(--lh-muted)",
                whiteSpace: "nowrap",
              }}
            >
              {greeting}, {currentUser.name}
            </span>
            <button
              onClick={openNewTaskModal}
              style={{
                height: 34,
                padding: "0 14px",
                background: "var(--lh-accent)",
                color: "#fff",
                border: "none",
                borderRadius: "var(--lh-r-sm)",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "var(--lh-font-sans)",
                transition: "background 0.12s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--lh-accent-ink)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--lh-accent)"; }}
            >
              + New task
            </button>
          </div>
        </header>

        <main>{sectionContent}</main>
      </SidebarInset>

      {/* ── New task modal ── */}
      {showNewTaskModal && (
        <NewTaskModal
          editingTaskId={editingTaskId}
          titleInput={titleInput}
          subjectInput={subjectInput}
          priorityInput={priorityInput}
          dueDateInput={dueDateInput}
          kanbanStatusInput={kanbanStatusInput}
          onTitleInputChange={setTitleInput}
          onSubjectInputChange={setSubjectInput}
          onPriorityInputChange={setPriorityInput}
          onDueDateInputChange={setDueDateInput}
          onKanbanStatusInputChange={setKanbanStatusInput}
          onSubmit={handleTaskSubmit}
          onClose={closeTaskModal}
        />
      )}

      <Toaster richColors />
    </SidebarProvider>
  );
}

export default App;
