(function(){
/* global React, ReactDOM, AuthScreen, Sidebar, Topbar, Dashboard, Tasks, Notes, Assistant, ToastHost, useToast, STORAGE, uid, readJSON, writeJSON, NOTES_SEED, TASKS_SEED, ACTIVITY_SEED, getAssistantReply, todayISO */

function AppRoot() {
  const [user, setUser] = useState(() => readJSON(STORAGE.user, null));
  const [section, setSection] = useState(() => localStorage.getItem(STORAGE.section) || "dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [newTaskSignal, setNewTaskSignal] = useState({ count: 0 });

  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [activity, setActivity] = useState([]);
  const [assistantMessages, setAssistantMessages] = useState([
    { id: uid(), role: "assistant", content: "Hi! I'm your mock study assistant — ask about React, TypeScript, focus or exam prep." },
  ]);
  const [hydrating, setHydrating] = useState(false);

  // Persist section
  useEffect(() => { localStorage.setItem(STORAGE.section, section); }, [section]);

  // Hydrate on login
  useEffect(() => {
    if (!user) {
      localStorage.removeItem(STORAGE.user);
      return;
    }
    writeJSON(STORAGE.user, user);
    setHydrating(true);

    const t = readJSON(STORAGE.tasks(user.email), null);
    setTasks(t && Array.isArray(t) ? t : TASKS_SEED);

    const n = readJSON(STORAGE.notes(user.email), null);
    setNotes(n && Array.isArray(n) ? n : NOTES_SEED.map(x => ({ ...x, id: uid(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })));

    const a = readJSON(STORAGE.activity(user.email), null);
    setActivity(a && Array.isArray(a) && a.length === 7 ? a : ACTIVITY_SEED());

    const tmo = setTimeout(() => setHydrating(false), 200);
    return () => clearTimeout(tmo);
  }, [user]);

  // Persist
  useEffect(() => { if (user) writeJSON(STORAGE.tasks(user.email), tasks); }, [user, tasks]);
  useEffect(() => { if (user) writeJSON(STORAGE.notes(user.email), notes); }, [user, notes]);
  useEffect(() => { if (user) writeJSON(STORAGE.activity(user.email), activity); }, [user, activity]);

  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const progress = total ? Math.round((completed / total) * 100) : 0;
    const today = todayISO();
    const dueToday = tasks.filter(t => t.dueDate === today && !t.completed).length;
    return { total, completed, pending, progress, dueToday };
  }, [tasks]);

  const streak = useMemo(() => {
    let s = 0;
    for (let i = activity.length - 1; i >= 0; i--) {
      if (activity[i].completed > 0) s++;
      else break;
    }
    return s;
  }, [activity]);

  const recordActivityToday = () => {
    const today = todayISO();
    setActivity(a => {
      const next = [...a];
      const idx = next.findIndex(x => x.date === today);
      if (idx >= 0) next[idx] = { ...next[idx], completed: next[idx].completed + 1 };
      return next;
    });
  };

  const handleCreate = (payload) => {
    const now = new Date().toISOString();
    const task = {
      id: uid(),
      ...payload,
      completed: payload.status === "done",
      createdAt: now,
      updatedAt: now,
    };
    setTasks(prev => [task, ...prev]);
  };
  const handleUpdate = (id, payload) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...payload, completed: payload.status === "done", updatedAt: new Date().toISOString() } : t));
  };
  const handleDelete = (id) => setTasks(prev => prev.filter(t => t.id !== id));
  const handleToggle = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const completed = !t.completed;
      const status = completed ? "done" : (t.status === "done" ? "pending" : t.status || "pending");
      if (completed) recordActivityToday();
      return { ...t, completed, status, updatedAt: new Date().toISOString() };
    }));
  };
  const handleStatusChange = (id, status) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const completed = status === "done";
      if (completed && !t.completed) recordActivityToday();
      return { ...t, status, completed, updatedAt: new Date().toISOString() };
    }));
  };

  const handleNoteCreate = (payload) => {
    const now = new Date().toISOString();
    setNotes(prev => [{ id: uid(), ...payload, createdAt: now, updatedAt: now }, ...prev]);
  };
  const handleNoteDelete = (id) => setNotes(prev => prev.filter(n => n.id !== id));

  const handleSendAssistant = (prompt) => {
    setAssistantMessages(prev => [
      ...prev,
      { id: uid(), role: "user", content: prompt },
      { id: uid(), role: "assistant", content: getAssistantReply(prompt) },
    ]);
  };

  const handleLogout = () => {
    setUser(null);
    setSection("dashboard");
  };

  if (!user) {
    return (
      <AuthScreen
        onLogin={(u) => setUser({ id: uid(), name: u.name, email: u.email })}
        onSignup={(u) => setUser({ id: uid(), name: u.name, email: u.email })}
      />
    );
  }

  return (
    <div className={`shell ${collapsed ? "shell-collapsed" : ""}`}>
      <Sidebar
        section={section}
        onSection={setSection}
        user={user}
        onLogout={handleLogout}
        taskStats={taskStats}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(c => !c)}
      />
      <div className="main">
        <Topbar
          section={section}
          onNewTask={() => { setSection("tasks"); setNewTaskSignal(s => ({ count: s.count + 1 })); }}
          onToggleSidebar={() => setCollapsed(c => !c)}
          user={user}
          streak={streak}
        />
        {hydrating ? (
          <div className="content" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="skel" style={{ height: 40, width: 300 }} />
            <div className="dash-grid">
              <div className="skel" style={{ height: 220, borderRadius: 14 }} />
              <div className="skel" style={{ height: 220, borderRadius: 14 }} />
            </div>
            <div className="skel" style={{ height: 200, borderRadius: 14 }} />
          </div>
        ) : section === "dashboard" ? (
          <Dashboard user={user} tasks={tasks} taskStats={taskStats} activity={activity} streak={streak}
            onSection={setSection} onNewTask={() => { setSection("tasks"); setNewTaskSignal(s => ({ count: s.count + 1 })); }}
            onToggleTask={handleToggle} />
        ) : section === "tasks" ? (
          <Tasks tasks={tasks} onCreate={handleCreate} onUpdate={handleUpdate} onDelete={handleDelete}
            onToggle={handleToggle} onStatusChange={handleStatusChange} openDialogSignal={newTaskSignal} />
        ) : section === "notes" ? (
          <Notes notes={notes} onCreate={handleNoteCreate} onDelete={handleNoteDelete} />
        ) : (
          <Assistant messages={assistantMessages} onSend={handleSendAssistant} />
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <ToastHost>
      <AppRoot />
    </ToastHost>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

})();