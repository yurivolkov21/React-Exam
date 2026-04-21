(function(){
/* global React, Icon, SUBJECT_OPTIONS, SUBJECT_COLOR, useToast, uid, todayISO */

const STATUSES = [
  { key: "pending", label: "Pending", desc: "To do" },
  { key: "in-progress", label: "In progress", desc: "Active" },
  { key: "done", label: "Done", desc: "Complete" },
];

function TaskDialog({ open, editing, initial, onClose, onSubmit }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [subject, setSubject] = useState(initial?.subject || SUBJECT_OPTIONS[0]);
  const [priority, setPriority] = useState(initial?.priority || "medium");
  const [dueDate, setDueDate] = useState(initial?.dueDate || todayISO());
  const [status, setStatus] = useState(initial?.status || "pending");
  const [err, setErr] = useState("");
  const ref = useRef(null);

  React.useEffect(() => {
    if (open) {
      setTitle(initial?.title || "");
      setSubject(initial?.subject || SUBJECT_OPTIONS[0]);
      setPriority(initial?.priority || "medium");
      setDueDate(initial?.dueDate || todayISO());
      setStatus(initial?.status || "pending");
      setErr("");
      setTimeout(() => ref.current?.focus(), 60);
    }
  }, [open, initial]);

  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) { setErr("Title cannot be empty."); return; }
    onSubmit({ title: title.trim(), subject, priority, dueDate, status });
  };

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className="dialog" role="dialog" aria-modal="true">
        <form onSubmit={submit}>
          <div className="dialog-head">
            <div>
              <div className="dialog-title">{editing ? "Edit task" : "New task"}</div>
              <div className="dialog-desc">{editing ? "Update the details below." : "Add a study task. Keep the title tight and actionable."}</div>
            </div>
            <button type="button" className="dialog-close" onClick={onClose}><Icon.x /></button>
          </div>
          <div className="dialog-body">
            <div className="field">
              <label className="label">Title</label>
              <input ref={ref} className={`input ${err ? "has-error" : ""}`} value={title} onChange={(e) => { setTitle(e.target.value); setErr(""); }} placeholder="e.g. Review useEffect cleanup patterns" />
              {err ? <div className="error"><Icon.alert />{err}</div> : null}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="field">
                <label className="label">Subject</label>
                <select className="select" value={subject} onChange={(e) => setSubject(e.target.value)}>
                  {SUBJECT_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="label">Priority</label>
                <select className="select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="field">
                <label className="label">Due date</label>
                <input type="date" className="input" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>
              <div className="field">
                <label className="label">Status</label>
                <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>
          </div>
          <div className="dialog-foot">
            <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-accent btn-sm">{editing ? "Save changes" : "Add task"}</button>
          </div>
        </form>
      </div>
    </>
  );
}

function KanbanCard({ task, onEdit, onDelete, onToggle, onStatusChange, isDragging, onDragStart, onDragEnd }) {
  const isOverdue = !task.completed && task.dueDate && task.dueDate < todayISO();
  const isToday = task.dueDate === todayISO();
  const dueLabel = task.dueDate
    ? (isToday ? "Due today" : isOverdue ? `Overdue · ${task.dueDate}` : `Due ${task.dueDate}`)
    : "No due date";
  return (
    <div
      className={`kcard ${task.completed ? "is-done" : ""} ${isDragging ? "is-dragging" : ""}`}
      draggable
      onDragStart={(e) => { e.dataTransfer.setData("text/plain", task.id); onDragStart(task.id); }}
      onDragEnd={onDragEnd}
    >
      <div className="kcard-top">
        <div className="kcard-subject">
          <span className="subj-dot" style={{ background: SUBJECT_COLOR[task.subject] || "var(--muted)" }} />
          {task.subject}
        </div>
        <span className={`prio-pill is-${task.priority === "high" ? "high" : task.priority === "medium" ? "med" : "low"}`}>{task.priority}</span>
      </div>
      <div className="kcard-title">{task.title}</div>
      <div className="kcard-bottom">
        <div className={`kcard-due ${isOverdue ? "is-overdue" : ""} ${isToday ? "is-today" : ""}`}>
          <Icon.calendar /> {dueLabel}
        </div>
        <div className="kcard-actions">
          <button onClick={() => onToggle(task.id)} title={task.completed ? "Mark pending" : "Mark done"}>
            <Icon.check />
          </button>
          <button onClick={() => onEdit(task)} title="Edit"><Icon.edit /></button>
          <button onClick={() => onDelete(task.id)} title="Delete"><Icon.trash /></button>
        </div>
      </div>
    </div>
  );
}

function Tasks({ tasks, onCreate, onUpdate, onDelete, onToggle, onStatusChange, openDialogSignal }) {
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [dragId, setDragId] = useState(null);
  const [dropCol, setDropCol] = useState(null);
  const toast = useToast();

  React.useEffect(() => {
    if (openDialogSignal && openDialogSignal.count > 0) {
      setEditing(null);
      setDialogOpen(true);
    }
  }, [openDialogSignal]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tasks.filter(t => {
      const sq = !q || t.title.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q);
      const ss = subjectFilter === "all" || t.subject === subjectFilter;
      return sq && ss;
    });
  }, [tasks, search, subjectFilter]);

  const grouped = useMemo(() => {
    const g = { pending: [], "in-progress": [], done: [] };
    filtered.forEach(t => {
      const st = t.status || (t.completed ? "done" : "pending");
      (g[st] || g.pending).push(t);
    });
    return g;
  }, [filtered]);

  const openNew = () => { setEditing(null); setDialogOpen(true); };
  const openEdit = (t) => { setEditing(t); setDialogOpen(true); };

  const submit = (payload) => {
    if (editing) {
      onUpdate(editing.id, payload);
      toast.success("Task updated.");
    } else {
      onCreate(payload);
      toast.success("Task added.");
    }
    setDialogOpen(false);
  };

  const handleDrop = (e, colKey) => {
    e.preventDefault();
    const id = dragId || e.dataTransfer.getData("text/plain");
    if (!id) return;
    const t = tasks.find(x => x.id === id);
    if (!t) return;
    if ((t.status || (t.completed ? "done" : "pending")) === colKey) { setDropCol(null); setDragId(null); return; }
    onStatusChange(id, colKey);
    setDropCol(null);
    setDragId(null);
    toast.info(`Moved to ${STATUSES.find(s => s.key === colKey).label}.`);
  };

  return (
    <div className="content">
      <div className="section-head">
        <div>
          <h1 className="section-title">Tasks</h1>
          <p className="section-desc">Drag cards between columns to update status. {tasks.length} total · {tasks.filter(t => !t.completed).length} open.</p>
        </div>
        <button className="btn btn-accent btn-sm" onClick={openNew}><Icon.plus /> New task</button>
      </div>

      <div className="tasks-toolbar">
        <div className="input-group tasks-search">
          <span className="input-icon"><Icon.search /></span>
          <input className="input" placeholder="Search by title or subject" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <button className={`chip ${subjectFilter === "all" ? "is-active" : ""}`} onClick={() => setSubjectFilter("all")}>All subjects</button>
          {SUBJECT_OPTIONS.map(s => (
            <button key={s} className={`chip ${subjectFilter === s ? "is-active" : ""}`} onClick={() => setSubjectFilter(s)}>
              <span className="subj-dot" style={{ background: SUBJECT_COLOR[s] }} />
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="kanban">
        {STATUSES.map(col => (
          <div
            key={col.key}
            className={`kcol ${dropCol === col.key ? "is-drop-zone" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDropCol(col.key); }}
            onDragLeave={(e) => { if (e.currentTarget === e.target) setDropCol(null); }}
            onDrop={(e) => handleDrop(e, col.key)}
          >
            <div className="kcol-head">
              <div className="kcol-title">
                <span className="subj-dot" style={{ background: col.key === "pending" ? "var(--muted-2)" : col.key === "in-progress" ? "var(--accent)" : "var(--success)" }} />
                {col.label}
              </div>
              <span className="kcol-count">{grouped[col.key].length}</span>
              <button className="kcol-add" onClick={openNew} title="Add task"><Icon.plus /></button>
            </div>
            <div className="kcards">
              {grouped[col.key].length === 0 ? (
                <div className="kcard-empty">Drop tasks here</div>
              ) : grouped[col.key].map(t => (
                <KanbanCard
                  key={t.id}
                  task={t}
                  isDragging={dragId === t.id}
                  onDragStart={setDragId}
                  onDragEnd={() => { setDragId(null); setDropCol(null); }}
                  onEdit={openEdit}
                  onDelete={(id) => { onDelete(id); toast.info("Task deleted."); }}
                  onToggle={onToggle}
                  onStatusChange={onStatusChange}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <TaskDialog open={dialogOpen} editing={!!editing} initial={editing} onClose={() => setDialogOpen(false)} onSubmit={submit} />
    </div>
  );
}

function Notes({ notes, onCreate, onDelete }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const toast = useToast();
  const submit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) { toast.error("A note needs a title and content."); return; }
    onCreate({ title: title.trim(), content: content.trim() });
    setTitle(""); setContent("");
    toast.success("Note added.");
  };
  return (
    <div className="content content-narrow">
      <div className="section-head">
        <div>
          <h1 className="section-title">Notes</h1>
          <p className="section-desc">Quick thoughts, patterns, and reminders — persisted locally.</p>
        </div>
      </div>

      <div className="notes-layout">
        <form className="notes-composer" onSubmit={submit}>
          <input className="input" placeholder="Note title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea className="textarea" placeholder="Write your note… support for multiline." value={content} onChange={(e) => setContent(e.target.value)} />
          <div className="notes-composer-actions">
            <span style={{ fontSize: 11.5, color: "var(--muted)" }}>{content.length} chars</span>
            <button type="submit" className="btn btn-accent btn-sm"><Icon.plus /> Add note</button>
          </div>
        </form>

        {notes.length === 0 ? (
          <div className="card empty" style={{ padding: "48px 20px" }}>
            <div className="empty-icon"><Icon.book /></div>
            <div className="empty-title">No notes yet</div>
            <div className="empty-desc">Capture key concepts, mistakes to avoid, and tiny wins as you go.</div>
          </div>
        ) : (
          <div className="notes-grid">
            {notes.map(n => (
              <div key={n.id} className="note">
                <div className="note-title">{n.title}</div>
                <div className="note-body">{n.content}</div>
                <div className="note-foot">
                  <span>Updated {new Date(n.updatedAt).toLocaleDateString()}</span>
                  <button className="btn btn-ghost btn-xs note-del" onClick={() => { onDelete(n.id); toast.info("Note deleted."); }} title="Delete">
                    <Icon.trash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Assistant({ messages, onSend }) {
  const [input, setInput] = useState("");
  const endRef = useRef(null);
  const hints = [
    "Give me a 3-day React study checklist",
    "How should I break down TypeScript tasks?",
    "How do I prep fast for a frontend exam?",
    "What should I focus on today?",
  ];

  React.useEffect(() => {
    endRef.current?.parentElement?.scrollTo({ top: 99999, behavior: "smooth" });
  }, [messages.length]);

  const submit = (e) => {
    e.preventDefault();
    const v = input.trim();
    if (!v) return;
    onSend(v);
    setInput("");
  };

  return (
    <div className="content content-narrow">
      <div className="section-head">
        <div>
          <h1 className="section-title">Study assistant</h1>
          <p className="section-desc">A frontend-only mock assistant. Responses are pattern-matched locally — no backend.</p>
        </div>
      </div>

      <div className="assistant-layout">
        <div className="assistant-shell">
          <div className="assistant-head">
            <span className="avatar avatar-sm" style={{ background: "var(--ink)", borderRadius: 6 }}>
              <span style={{ color: "#fff", fontFamily: "var(--font-display)", fontSize: 11 }}>L</span>
            </span>
            <div>
              <div className="assistant-head-title">Learning Hub assistant</div>
              <div className="assistant-head-sub">Mock mode · runs locally</div>
            </div>
            <span className="badge" style={{ marginLeft: "auto" }}><span className="subj-dot" style={{ background: "var(--success)" }} /> Online</span>
          </div>
          <div className="assistant-messages">
            {messages.map(m => (
              <div key={m.id} className="msg">
                <div className={`msg-avatar ${m.role === "assistant" ? "is-bot" : "is-user"}`}>
                  {m.role === "assistant" ? "L" : "Y"}
                </div>
                <div className="msg-body">
                  <div className="msg-role">{m.role === "assistant" ? "Assistant" : "You"}</div>
                  <div className="msg-content">{m.content}</div>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="assistant-input-wrap">
            <form onSubmit={submit} className="assistant-input-row">
              <input className="assistant-input" placeholder="Ask anything about your study plan…" value={input} onChange={(e) => setInput(e.target.value)} />
              <button type="submit" className="btn btn-accent btn-sm btn-icon" title="Send"><Icon.send /></button>
            </form>
            <div className="assistant-hints">
              {hints.map(h => (
                <button key={h} className="assistant-hint" onClick={() => { onSend(h); }}>
                  <Icon.sparkle /> {h}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Tasks, Notes, Assistant, TaskDialog });

})();