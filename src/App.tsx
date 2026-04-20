import { type FormEvent, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2Icon,
  ListTodoIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

import { AppSidebar } from "@/components/app-sidebar";
import { LoginForm } from "@/components/login-form";
import { SignupForm } from "@/components/signup-form";
import { Badge } from "@/components/ui/badge";
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
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

type AuthMode = "login" | "signup";
type AppSection = "dashboard" | "tasks" | "notes" | "assistant";
type TaskPriority = "low" | "medium" | "high";

type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

type StudyTask = {
  id: string;
  title: string;
  subject: string;
  priority: TaskPriority;
  dueDate: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

type AssistantMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const APP_SECTIONS: AppSection[] = ["dashboard", "tasks", "notes", "assistant"];
const MIN_PASSWORD_LENGTH = 8;

const STORAGE_KEYS = {
  user: "learning-hub-user",
  tasksPrefix: "learning-hub-tasks",
} as const;

const SUBJECT_OPTIONS = [
  "React",
  "TypeScript",
  "UI/UX",
  "Testing",
  "Algorithms",
];
const NOTES = [
  {
    title: "Exam Focus",
    content:
      "Uu tien luong chinh: auth -> tao task -> danh dau hoan thanh -> reload van giu data.",
  },
  {
    title: "TypeScript Tip",
    content:
      "Dung union types cho status/priority de tranh bug logic va de tu dong goi y trong IDE.",
  },
  {
    title: "UI Consistency",
    content:
      "Giup giao dien gon gon bang card + spacing nhat quan, tranh dung qua nhieu variant trong bai thi.",
  },
];

const ASSISTANT_HINTS = [
  "Cho minh checklist hoc React trong 3 ngay",
  "Goi y cach chia nho task TypeScript",
  "Cach on bai frontend de thi nhanh hon",
];

const getId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const getTaskStorageKey = (userEmail: string) =>
  `${STORAGE_KEYS.tasksPrefix}:${userEmail}`;

const isAppSection = (value: string): value is AppSection =>
  APP_SECTIONS.includes(value as AppSection);

const readStoredUser = (): UserProfile | null => {
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

const readStoredTasks = (userEmail: string): StudyTask[] => {
  const rawValue = localStorage.getItem(getTaskStorageKey(userEmail));
  if (!rawValue) {
    return [];
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

const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

const getAssistantReply = (prompt: string) => {
  const normalizedPrompt = prompt.toLowerCase();

  if (normalizedPrompt.includes("react")) {
    return "Goi y React: hoc lai useState/useEffect, render list co key, va chia component nho theo feature.";
  }

  if (normalizedPrompt.includes("typescript")) {
    return "Goi y TypeScript: dinh nghia type cho data truoc, sau do moi viet UI. Tranh any trong reducer/form state.";
  }

  if (normalizedPrompt.includes("thi") || normalizedPrompt.includes("exam")) {
    return "Cho bai thi frontend: chot MVP som, uu tien flow chay on dinh va co empty/error/success states.";
  }

  return "Tip hoc nhanh: tach task lon thanh task 25-40 phut, lam theo thu tu Do kho de dung tien do.";
};

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
  const [titleInput, setTitleInput] = useState("");
  const [subjectInput, setSubjectInput] = useState(SUBJECT_OPTIONS[0]);
  const [priorityInput, setPriorityInput] = useState<TaskPriority>("medium");
  const [dueDateInput, setDueDateInput] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [assistantInput, setAssistantInput] = useState("");
  const [assistantMessages, setAssistantMessages] = useState<
    AssistantMessage[]
  >([
    {
      id: getId(),
      role: "assistant",
      content:
        "Xin chao! Minh la Study Assistant mock mode, khong can backend AI.",
    },
  ]);

  useEffect(() => {
    if (!currentUser) {
      localStorage.removeItem(STORAGE_KEYS.user);
      setTasks([]);
      return;
    }

    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(currentUser));
    setTasks(readStoredTasks(currentUser.email));
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    localStorage.setItem(getTaskStorageKey(currentUser.email), JSON.stringify(tasks));
  }, [currentUser, tasks]);

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

  const visibleTasks = useMemo(() => {
    return [...tasks].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [tasks]);

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
    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();
    const password = String(formData.get("password") ?? "");

    if (!isValidEmail(email)) {
      setAuthError("Email khong hop le.");
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setAuthError(`Password can it nhat ${MIN_PASSWORD_LENGTH} ky tu.`);
      return;
    }

    const fallbackName = email.split("@")[0] || "Learner";
    setCurrentUser({
      id: getId(),
      name: fallbackName,
      email,
      avatar: "",
    });
    setActiveSection("dashboard");
    toast.success("Dang nhap thanh cong");
  };

  const handleSignupSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError("");

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (!name) {
      setAuthError("Vui long nhap ho ten.");
      return;
    }

    if (!isValidEmail(email)) {
      setAuthError("Email khong hop le.");
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setAuthError(`Password can it nhat ${MIN_PASSWORD_LENGTH} ky tu.`);
      return;
    }

    if (password !== confirmPassword) {
      setAuthError("Xac nhan password chua trung khop.");
      return;
    }

    setCurrentUser({
      id: getId(),
      name,
      email,
      avatar: "",
    });
    setActiveSection("dashboard");
    toast.success("Tao tai khoan thanh cong");
  };

  const handleLogout = () => {
    setTasks([]);
    setCurrentUser(null);
    setAuthMode("login");
    setAuthError("");
    setActiveSection("dashboard");
    toast.info("Da dang xuat");
  };

  const handleTaskSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedTitle = titleInput.trim();
    if (!normalizedTitle) {
      toast.error("Task title khong duoc de trong");
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
      toast.success("Cap nhat task thanh cong");
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
      toast.success("Da them task moi");
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
    setTasks((previousTasks) =>
      previousTasks.filter((task) => task.id !== taskId),
    );
    if (editingTaskId === taskId) {
      resetTaskForm();
    }
    toast.info("Task da duoc xoa");
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

  const renderSection = () => {
    if (activeSection === "dashboard") {
      return (
        <div className="space-y-6 p-4 md:p-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card size="sm">
              <CardHeader>
                <CardDescription>Total Tasks</CardDescription>
                <CardTitle>{taskStats.total}</CardTitle>
              </CardHeader>
            </Card>
            <Card size="sm">
              <CardHeader>
                <CardDescription>Completed</CardDescription>
                <CardTitle>{taskStats.completed}</CardTitle>
              </CardHeader>
            </Card>
            <Card size="sm">
              <CardHeader>
                <CardDescription>Pending</CardDescription>
                <CardTitle>{taskStats.pending}</CardTitle>
              </CardHeader>
            </Card>
            <Card size="sm">
              <CardHeader>
                <CardDescription>Due Today</CardDescription>
                <CardTitle>{taskStats.dueToday}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>
                {taskStats.completed}/{taskStats.total} tasks completed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Progress value={taskStats.progress} />
              <p className="text-sm text-muted-foreground">
                {taskStats.progress}% complete
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Tasks</CardTitle>
              <CardDescription>
                5 task cap nhat gan nhat de ban theo doi tien do hoc tap.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {visibleTasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between gap-3 rounded-md border p-3"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {task.subject}
                    </p>
                  </div>
                  <Badge variant={task.completed ? "secondary" : "outline"}>
                    {task.completed ? "Done" : "Pending"}
                  </Badge>
                </div>
              ))}
              {visibleTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Chua co task nao. Qua tab Tasks de tao moi.
                </p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      );
    }

    if (activeSection === "tasks") {
      return (
        <div className="space-y-6 p-4 md:p-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {editingTaskId ? "Edit Task" : "Create New Task"}
              </CardTitle>
              <CardDescription>
                Tao task hoc tap ngan gon, uu tien task co han de theo doi de
                hon.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="grid gap-3 md:grid-cols-2"
                onSubmit={handleTaskSubmit}
              >
                <Input
                  placeholder="Task title"
                  value={titleInput}
                  onChange={(event) => setTitleInput(event.target.value)}
                />
                <NativeSelect
                  value={subjectInput}
                  onChange={(event) => setSubjectInput(event.target.value)}
                >
                  {SUBJECT_OPTIONS.map((subjectOption) => (
                    <NativeSelectOption
                      key={subjectOption}
                      value={subjectOption}
                    >
                      {subjectOption}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
                <NativeSelect
                  value={priorityInput}
                  onChange={(event) =>
                    setPriorityInput(event.target.value as TaskPriority)
                  }
                >
                  <NativeSelectOption value="low">
                    Low priority
                  </NativeSelectOption>
                  <NativeSelectOption value="medium">
                    Medium priority
                  </NativeSelectOption>
                  <NativeSelectOption value="high">
                    High priority
                  </NativeSelectOption>
                </NativeSelect>
                <Input
                  type="date"
                  value={dueDateInput}
                  onChange={(event) => setDueDateInput(event.target.value)}
                />
                <div className="md:col-span-2 flex flex-wrap gap-2">
                  <Button type="submit">
                    <PlusIcon />
                    {editingTaskId ? "Update Task" : "Add Task"}
                  </Button>
                  {editingTaskId ? (
                    <Button
                      variant="outline"
                      type="button"
                      onClick={resetTaskForm}
                    >
                      Cancel edit
                    </Button>
                  ) : null}
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Task List</CardTitle>
              <CardDescription>
                Danh sach task hoc tap da luu localStorage.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {visibleTasks.map((task) => (
                <div key={task.id} className="rounded-md border p-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {task.subject}{" "}
                        {task.dueDate ? `• due ${task.dueDate}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{task.priority}</Badge>
                      <Badge variant={task.completed ? "secondary" : "outline"}>
                        {task.completed ? "Done" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEditingTask(task)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleTask(task.id)}
                    >
                      <CheckCircle2Icon />
                      {task.completed ? "Mark pending" : "Mark done"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteTask(task.id)}
                    >
                      <Trash2Icon />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}

              {visibleTasks.length === 0 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <ListTodoIcon />
                    </EmptyMedia>
                    <EmptyTitle>No tasks yet</EmptyTitle>
                    <EmptyDescription>
                      Them task dau tien de bat dau Learning Hub mini.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : null}
            </CardContent>
          </Card>
        </div>
      );
    }

    if (activeSection === "notes") {
      return (
        <div className="space-y-6 p-4 md:p-6">
          <Card>
            <CardHeader>
              <CardTitle>Study Notes</CardTitle>
              <CardDescription>
                Ghi chu nhanh de giu nhip on bai va tranh lan man trong luc thi.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {NOTES.map((note) => (
                <Card key={note.title} size="sm">
                  <CardHeader>
                    <CardTitle>{note.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {note.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="space-y-6 p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Assistant (Mock Mode)</CardTitle>
            <CardDescription>
              UI chatbot frontend-only, khong can backend AI.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 rounded-md border p-3">
              {assistantMessages.map((message) => (
                <div key={message.id} className="space-y-1">
                  <Badge
                    variant={
                      message.role === "assistant" ? "secondary" : "outline"
                    }
                  >
                    {message.role === "assistant" ? "Assistant" : "You"}
                  </Badge>
                  <p className="text-sm">{message.content}</p>
                </div>
              ))}
            </div>

            <form
              onSubmit={submitAssistantPrompt}
              className="flex flex-col gap-2 sm:flex-row"
            >
              <Input
                value={assistantInput}
                onChange={(event) => setAssistantInput(event.target.value)}
                placeholder="Hoi study assistant..."
              />
              <Button type="submit">Send</Button>
            </form>

            <div className="flex flex-wrap gap-2">
              {ASSISTANT_HINTS.map((hint) => (
                <Button
                  key={hint}
                  size="sm"
                  variant="outline"
                  onClick={() => setAssistantInput(hint)}
                >
                  {hint}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (!currentUser) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-muted/40 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl">Learning Hub Mini</CardTitle>
            <CardDescription>
              Frontend-only exam build: auth mock + todo learning workflow.
            </CardDescription>
            <div className="flex gap-2 pt-2">
              <Button
                variant={authMode === "login" ? "default" : "outline"}
                onClick={() => {
                  setAuthMode("login");
                  setAuthError("");
                }}
              >
                Login
              </Button>
              <Button
                variant={authMode === "signup" ? "default" : "outline"}
                onClick={() => {
                  setAuthMode("signup");
                  setAuthError("");
                }}
              >
                Signup
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {authMode === "login" ? (
              <LoginForm
                onSubmit={handleLoginSubmit}
                onSwitchToSignup={() => {
                  setAuthMode("signup");
                  setAuthError("");
                }}
              />
            ) : (
              <SignupForm
                onSubmit={handleSignupSubmit}
                onSwitchToLogin={() => {
                  setAuthMode("login");
                  setAuthError("");
                }}
              />
            )}
            {authError ? (
              <p className="mt-3 text-sm text-destructive">{authError}</p>
            ) : null}
          </CardContent>
        </Card>
        <Toaster richColors />
      </div>
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
              <p className="text-xs text-muted-foreground">
                Xin chao, {currentUser.name}
              </p>
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

        <main>{renderSection()}</main>
      </SidebarInset>
      <Toaster richColors />
    </SidebarProvider>
  );
}

export default App;
