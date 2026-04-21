(function(){
/* global React, Icon, SUBJECT_COLOR, ProgressRing */

function Dashboard({ user, tasks, taskStats, activity, streak, onSection, onNewTask, onToggleTask }) {
  const today = new Date().toISOString().slice(0, 10);
  const todayTasks = useMemo(() =>
    tasks.filter(t => t.dueDate === today).slice(0, 5)
  , [tasks, today]);

  const upNext = useMemo(() =>
    tasks
      .filter(t => !t.completed && t.dueDate && t.dueDate >= today)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 5)
  , [tasks, today]);

  const maxCompleted = Math.max(1, ...activity.map(a => a.completed));
  const weekDayLbl = ["S", "M", "T", "W", "T", "F", "S"];

  // For streak week visualization — last 7 days (oldest left, today right)
  const streakWeek = useMemo(() => {
    return activity.map(a => {
      const d = new Date(a.date);
      return { date: a.date, label: weekDayLbl[d.getDay()], done: a.completed > 0, isToday: a.date === today };
    });
  }, [activity, today]);

  const heroLine = streak > 0
    ? `You're on a ${streak}-day streak — keep the tempo going.`
    : `Knock out one task today and start a new streak.`;

  return (
    <div className="content">
      <div className="section-head">
        <div>
          <h1 className="section-title">Your study, at a glance.</h1>
          <p className="section-desc">{heroLine}</p>
        </div>
        <button className="btn btn-accent btn-sm" onClick={onNewTask}><Icon.plus /> New task</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Row 1: Progress + Streak */}
        <div className="dash-grid">
          <div className="card progress-card">
            <div className="progress-ring">
              <ProgressRing value={taskStats.progress} />
              <div className="progress-ring-pct">
                <div className="progress-ring-num">{taskStats.progress}%</div>
                <div className="progress-ring-label">complete</div>
              </div>
            </div>
            <div className="progress-summary">
              <h3>Learning progress</h3>
              <p>{taskStats.completed} of {taskStats.total} tasks complete. {taskStats.dueToday ? `${taskStats.dueToday} ${taskStats.dueToday === 1 ? "task is" : "tasks are"} due today.` : "No tasks due today — plan ahead."}</p>
              <div className="progress-stats">
                <div className="progress-stat"><div className="num">{taskStats.pending}</div><div className="lbl">Pending</div></div>
                <div className="progress-stat"><div className="num">{taskStats.completed}</div><div className="lbl">Done</div></div>
                <div className="progress-stat"><div className="num">{taskStats.dueToday}</div><div className="lbl">Due today</div></div>
              </div>
            </div>
          </div>

          <div className="card streak-card">
            <div className="streak-head">
              <span className="streak-label"><Icon.flame /> Current streak</span>
              <span style={{ fontSize: 11.5, color: "var(--muted)" }}>Last 7 days</span>
            </div>
            <div className="streak-num">
              {streak}<span className="streak-num-suffix">{streak === 1 ? "day" : "days"}</span>
            </div>
            <div className="streak-week">
              {streakWeek.map((d, i) => (
                <div key={i}
                  className={`streak-day ${d.done ? "is-done" : ""} ${d.isToday ? "is-today" : ""}`}
                  title={d.date}
                >
                  {d.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Momentum + Today */}
        <div className="dash-grid">
          <div className="card momentum-card">
            <div className="momentum-head">
              <div>
                <div className="card-title">Weekly momentum</div>
                <div className="card-desc">Tasks completed per day, last 7 days</div>
              </div>
              <span className="badge">{activity.reduce((s, a) => s + a.completed, 0)} this week</span>
            </div>
            <div className="momentum-chart">
              {activity.map((a, i) => {
                const h = Math.max(6, (a.completed / maxCompleted) * 100);
                const isToday = a.date === today;
                const d = new Date(a.date);
                return (
                  <div key={i} className={`momentum-bar-wrap ${isToday ? "is-today" : ""}`}>
                    <div className={`momentum-bar ${isToday ? "is-today" : ""}`} style={{ height: "100%" }}>
                      <div className="momentum-bar-fill" style={{ height: `${h}%` }} title={`${a.completed} completed`} />
                    </div>
                    <div className="momentum-day-lbl">{weekDayLbl[d.getDay()]}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card today-card">
            <div className="today-head">
              <div>
                <div className="card-title">Today's focus</div>
                <div className="card-desc">{todayTasks.length} {todayTasks.length === 1 ? "task" : "tasks"} due today</div>
              </div>
              <button className="btn btn-ghost btn-xs" onClick={() => onSection("tasks")}>
                View all <Icon.chevRight />
              </button>
            </div>
            {todayTasks.length === 0 ? (
              <div className="empty" style={{ padding: "24px 8px" }}>
                <div className="empty-icon"><Icon.target /></div>
                <div className="empty-title">Nothing scheduled for today</div>
                <div className="empty-desc">Use tomorrow as a buffer or add a quick task.</div>
              </div>
            ) : (
              <div className="today-list">
                {todayTasks.map(t => (
                  <div key={t.id} className="today-item">
                    <div className={`prio-mark is-${t.priority === "high" ? "high" : t.priority === "medium" ? "med" : "low"}`} style={{ height: 32 }} />
                    <button
                      className={`check ${t.completed ? "is-checked" : ""}`}
                      onClick={() => onToggleTask(t.id)}
                      aria-label="Toggle task"
                    >
                      <Icon.check />
                    </button>
                    <div className="today-item-main">
                      <div className={`today-item-title ${t.completed ? "is-done" : ""}`}>{t.title}</div>
                      <div className="today-item-meta">
                        <span className="subj-dot" style={{ background: SUBJECT_COLOR[t.subject] || "var(--muted)" }} />
                        <span>{t.subject}</span>
                        <span>·</span>
                        <span>{t.priority} priority</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Row 3: Up next */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Up next</div>
              <div className="card-desc">Upcoming tasks across your subjects</div>
            </div>
            <button className="btn btn-ghost btn-xs" onClick={() => onSection("tasks")}>Open tasks <Icon.chevRight /></button>
          </div>
          <div className="card-body-tight">
            {upNext.length === 0 ? (
              <div className="empty" style={{ padding: "24px 8px" }}>
                <div className="empty-icon"><Icon.inbox /></div>
                <div className="empty-title">No upcoming tasks</div>
                <div className="empty-desc">Plan ahead by adding tasks with due dates.</div>
              </div>
            ) : (
              <div className="today-list">
                {upNext.map(t => (
                  <div key={t.id} className="today-item">
                    <div className={`prio-mark is-${t.priority === "high" ? "high" : t.priority === "medium" ? "med" : "low"}`} style={{ height: 32 }} />
                    <div className="today-item-main">
                      <div className="today-item-title">{t.title}</div>
                      <div className="today-item-meta">
                        <span className="subj-dot" style={{ background: SUBJECT_COLOR[t.subject] || "var(--muted)" }} />
                        <span>{t.subject}</span>
                        <span>·</span>
                        <span>due {t.dueDate}</span>
                      </div>
                    </div>
                    <span className={`prio-pill is-${t.priority === "high" ? "high" : t.priority === "medium" ? "med" : "low"}`}>{t.priority}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

window.Dashboard = Dashboard;

})();