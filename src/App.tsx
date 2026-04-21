import { type FormEvent, useEffect, useMemo, useState } from "react";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";

import { AppSidebar } from "@/components/app-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
  StudyNote,
  StudyTask,
  TaskFilter,
  TaskPriority,
  UserProfile,
} from "@/features/learning-hub/types";

function App() {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [authError, setAuthError] = useState<string>("");
  const [activeSection, setActiveSection] = useState<AppSection>("dashboard");
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() =>
    readStoredUser(),
  );

  const [tasks, setTasks] = useState<StudyTask[]>(() => {
    const storedUser = readStoredUser();
    if (!storedUser) {
      return [];
    }

    return readStoredTasks(storedUser.email);
  });

  const [notes, setNotes] = useState<StudyNote[]>(() => {
    const storedUser = readStoredUser();
    if (!storedUser) {
      return [];
    }

    return readStoredNotes(storedUser.email).notes;
  });

  const [canPersistNotes, setCanPersistNotes] = useState(() => {
    const storedUser = readStoredUser();
    if (!storedUser) {
      return true;
    }

    return readStoredNotes(storedUser.email).canPersist;
  });

  const [isHydrating, setIsHydrating] = useState(true);

  const [titleInput, setTitleInput] = useState("");
  const [subjectInput, setSubjectInput] = useState(SUBJECT_OPTIONS[0]);
  const [priorityInput, setPriorityInput] = useState<TaskPriority>("medium");
  const [dueDateInput, setDueDateInput] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

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

    const hydrateTimer = window.setTimeout(() => {
      setIsHydrating(false);
    }, 220);

    return () => {
      window.clearTimeout(hydrateTimer);
    };
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    safeSetStorageItem(
      getTaskStorageKey(currentUser.email),
      JSON.stringify(tasks),
      () => {
        toast.error("Unable to save tasks to localStorage.");
      },
    );
  }, [currentUser, tasks]);

  useEffect(() => {
    if (!currentUser || !canPersistNotes) {
      return;
    }

    safeSetStorageItem(
      getNotesStorageKey(currentUser.email),
      JSON.stringify(notes),
      () => {
        toast.error("Unable to save notes to localStorage.");
      },
    );
  }, [canPersistNotes, currentUser, notes]);

  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const pending = total - completed;
    const progress = total ? Math.round((completed / total) * 100) : 0;
    const today = new Date().toISOString().slice(0, 10);
    const dueToday = tasks.filter((task) => task.dueDate === today).length;

    return {
      total,
      completed,
      pending,
      progress,
      dueToday,
    };
  }, [tasks]);

  const visibleTasks = useMemo(
    () => [...tasks].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [tasks],
  );

  const filteredTasks = useMemo(() => {
    const normalizedQuery = taskSearch.trim().toLowerCase();

    return visibleTasks.filter((task) => {
      const matchesFilter =
        taskFilter === "all" ||
        (taskFilter === "done" ? task.completed : !task.completed);
      const matchesSearch =
        !normalizedQuery ||
        task.title.toLowerCase().includes(normalizedQuery) ||
        task.subject.toLowerCase().includes(normalizedQuery);

      return matchesFilter && matchesSearch;
    });
  }, [taskFilter, taskSearch, visibleTasks]);

  const resetTaskForm = () => {
    setTitleInput("");
    setSubjectInput(SUBJECT_OPTIONS[0]);
    setPriorityInput("medium");
    setDueDateInput("");
    setEditingTaskId(null);
  };

  const handleLoginSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");

    if (!isValidEmail(email)) {
      setAuthError("Invalid email address.");
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setAuthError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }

    setCurrentUser({
      id: getId(),
      name: email.split("@")[0] || "Learner",
      email,
      avatar: "",
    });
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

    if (!name) {
      setAuthError("Please enter your full name.");
      return;
    }

    if (!isValidEmail(email)) {
      setAuthError("Invalid email address.");
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setAuthError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }

    if (password !== confirmPassword) {
      setAuthError("Password confirmation does not match.");
      return;
    }

    setCurrentUser({
      id: getId(),
      name,
      email,
      avatar: "",
    });
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
    toast.info("Signed out.");
  };

  const handleTaskSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedTitle = titleInput.trim();
    if (!normalizedTitle) {
      toast.error("Task title cannot be empty.");
      return;
    }

    const now = new Date().toISOString();

    if (editingTaskId) {
      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task.id === editingTaskId
            ? {
                ...task,
                title: normalizedTitle,
                subject: subjectInput,
                priority: priorityInput,
                dueDate: dueDateInput,
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
        completed: false,
        createdAt: now,
        updatedAt: now,
      };
      setTasks((previousTasks) => [nextTask, ...previousTasks]);
      toast.success("Task added.");
    }

    resetTaskForm();
  };

  const toggleTask = (taskId: string) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              updatedAt: new Date().toISOString(),
            }
          : task,
      ),
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((previousTasks) => previousTasks.filter((task) => task.id !== taskId));
    if (editingTaskId === taskId) {
      resetTaskForm();
    }
    toast.info("Task deleted.");
  };

  const startEditingTask = (task: StudyTask) => {
    setEditingTaskId(task.id);
    setTitleInput(task.title);
    setSubjectInput(task.subject);
    setPriorityInput(task.priority);
    setDueDateInput(task.dueDate);
  };

  const submitAssistantPrompt = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedPrompt = assistantInput.trim();
    if (!trimmedPrompt) {
      return;
    }

    const userMessage: AssistantMessage = {
      id: getId(),
      role: "user",
      content: trimmedPrompt,
    };
    const assistantMessage: AssistantMessage = {
      id: getId(),
      role: "assistant",
      content: getAssistantReply(trimmedPrompt),
    };

    setAssistantMessages((previousMessages) => [
      ...previousMessages,
      userMessage,
      assistantMessage,
    ]);
    setAssistantInput("");
  };

  const createNote = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedTitle = noteTitleInput.trim();
    const normalizedContent = noteContentInput.trim();
    if (!normalizedTitle || !normalizedContent) {
      toast.error("A note must have both title and content.");
      return;
    }

    const now = new Date().toISOString();
    const newNote: StudyNote = {
      id: getId(),
      title: normalizedTitle,
      content: normalizedContent,
      createdAt: now,
      updatedAt: now,
    };

    setNotes((previousNotes) => [newNote, ...previousNotes]);
    setNoteTitleInput("");
    setNoteContentInput("");
    toast.success("Note added.");
  };

  const deleteNote = (noteId: string) => {
    setNotes((previousNotes) => previousNotes.filter((note) => note.id !== noteId));
    toast.info("Note deleted.");
  };

  const resetCorruptedNotesStorage = () => {
    if (!currentUser) {
      return;
    }

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
        onNavigate={(item) => {
          if (isAppSection(item)) {
            setActiveSection(item);
          }
        }}
        onLogout={handleLogout}
      />
    );
  }

  let sectionContent = null;
  if (activeSection === "dashboard") {
    sectionContent = <DashboardSection taskStats={taskStats} visibleTasks={visibleTasks} />;
  } else if (activeSection === "tasks") {
    sectionContent = (
      <TasksSection
        editingTaskId={editingTaskId}
        titleInput={titleInput}
        subjectInput={subjectInput}
        priorityInput={priorityInput}
        dueDateInput={dueDateInput}
        taskSearch={taskSearch}
        taskFilter={taskFilter}
        visibleTasks={visibleTasks}
        filteredTasks={filteredTasks}
        onTitleInputChange={setTitleInput}
        onSubjectInputChange={setSubjectInput}
        onPriorityInputChange={setPriorityInput}
        onDueDateInputChange={setDueDateInput}
        onTaskSearchChange={setTaskSearch}
        onTaskFilterChange={setTaskFilter}
        onSubmitTask={handleTaskSubmit}
        onCancelEdit={resetTaskForm}
        onStartEditTask={startEditingTask}
        onToggleTask={toggleTask}
        onDeleteTask={deleteTask}
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

  return (
    <SidebarProvider>
      <AppSidebar
        activeItem={activeSection}
        onNavigate={(item) => {
          if (isAppSection(item)) {
            setActiveSection(item);
          }
        }}
        onLogout={handleLogout}
        user={currentUser}
      />
      <SidebarInset>
        <header className="flex h-14 items-center justify-between border-b bg-background px-4 md:px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-5" />
            <div>
              <p className="text-sm font-medium">Learning Hub Mini</p>
              <p className="text-xs text-muted-foreground">Hello, {currentUser.name}</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <Badge variant="outline">{taskStats.pending} pending</Badge>
            <Button size="sm" onClick={() => setActiveSection("tasks")}>
              <PlusIcon />
              New task
            </Button>
          </div>
        </header>

        <main>{sectionContent}</main>
      </SidebarInset>
      <Toaster richColors />
    </SidebarProvider>
  );
}

export default App;
