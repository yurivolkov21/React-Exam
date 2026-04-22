import { useMemo } from "react";
import { MomentumChart } from "../components/momentum-chart";
import { ProgressRing } from "../components/progress-ring";
import { StreakCard } from "../components/streak-card";
import type { StudyTask } from "../types";

type DashboardSectionProps = {
  taskStats: {
    total: number;
    completed: number;
    pending: number;
    progress: number;
    dueToday: number;
  };
  visibleTasks: StudyTask[];
  streak: number;
  onOpenNewTask?: () => void;
  onNavigateToTasks?: () => void;
  onToggleTask?: (taskId: string) => void;
};

const CARD_STYLE: React.CSSProperties = {
  background: "var(--lh-surface)",
  border: "1px solid var(--lh-border)",
  borderRadius: "var(--lh-r-lg)",
  boxShadow: "var(--lh-sh-sm)",
};

const PRIORITY_MARK_COLOR: Record<string, string> = {
  high: "var(--lh-p-high)",
  medium: "var(--lh-p-med)",
  low: "var(--lh-p-low)",
};

const SUBJECT_COLORS: Record<string, string> = {
  React: "var(--lh-subj-react)",
  TypeScript: "var(--lh-subj-ts)",
  "UI/UX": "var(--lh-subj-ui)",
  Testing: "var(--lh-subj-test)",
  Algorithms: "var(--lh-subj-algo)",
};

export function DashboardSection({
  taskStats,
  visibleTasks,
  streak,
  onOpenNewTask,
  onNavigateToTasks,
  onToggleTask,
}: DashboardSectionProps) {
  const todayTasks = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return visibleTasks
      .filter((task) => task.dueDate === today)
      .slice(0, 5);
  }, [visibleTasks]);

  const upNextTasks = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);

    return visibleTasks
      .filter((task) => !task.completed && task.dueDate && task.dueDate >= today)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 5);
  }, [visibleTasks]);

  const weekData = useMemo(() => {
    const today = new Date();
    const days: { label: string; count: number; isToday: boolean }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dayStr = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString("en", { weekday: "short" }).slice(0, 1);
      const count = visibleTasks.filter(
        (t) => t.completed && t.updatedAt?.slice(0, 10) === dayStr,
      ).length;
      days.push({ label, count, isToday: i === 0 });
    }
    return days;
  }, [visibleTasks]);

  const streakDays = useMemo(() => {
    const today = new Date();
    const todayIdx = today.getDay() === 0 ? 6 : today.getDay() - 1;
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      const diff = i - todayIdx;
      d.setDate(today.getDate() + diff);
      const dayStr = d.toISOString().slice(0, 10);
      return visibleTasks.some(
        (t) => t.completed && t.updatedAt?.slice(0, 10) === dayStr,
      );
    });
  }, [visibleTasks]);

  const weekTotal = weekData.reduce((sum, d) => sum + d.count, 0);

  return (
    <div style={{ padding: "24px 28px 40px", maxWidth: 1360, margin: "0 auto" }}>
      {/* ── Section head ── */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 28,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--lh-font-display)",
              fontSize: 28,
              fontWeight: 500,
              color: "var(--lh-ink)",
              letterSpacing: "-0.03em",
              margin: "0 0 6px",
              lineHeight: 1.15,
            }}
          >
            Your study, at a glance.
          </h1>
          <p style={{ margin: 0, fontSize: 13.5, color: "var(--lh-muted)" }}>
            {streak > 0
              ? `You're on a ${streak}-day streak — keep the tempo going.`
              : "Start a task today to begin your streak."}
          </p>
        </div>

        <button
          onClick={onOpenNewTask}
          style={{
            height: 36,
            padding: "0 16px",
            background: "var(--lh-accent)",
            color: "#fff",
            border: "none",
            borderRadius: "var(--lh-r-sm)",
            fontSize: 13.5,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "var(--lh-font-sans)",
            transition: "background 0.12s",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--lh-accent-ink)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "var(--lh-accent)"; }}
        >
          + New task
        </button>
      </div>

      {/* ── 2-column grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.35fr 1fr",
          gap: 16,
        }}
        className="lh-dash-grid"
      >
        {/* ── Left column ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Progress card */}
          <div style={{ ...CARD_STYLE, padding: 18 }}>
            <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
              <ProgressRing percent={taskStats.progress} size={180} label="Complete" />

              <div style={{ flex: 1 }}>
                <h2
                  style={{
                    margin: "0 0 6px",
                    fontFamily: "var(--lh-font-display)",
                    fontSize: 22,
                    fontWeight: 500,
                    color: "var(--lh-ink)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                  }}
                >
                  Learning progress
                </h2>
                <p style={{ margin: "0 0 16px", fontSize: 13, color: "var(--lh-muted)", lineHeight: 1.55 }}>
                  {taskStats.completed} of {taskStats.total} tasks complete. {taskStats.dueToday > 0
                    ? `${taskStats.dueToday} task${taskStats.dueToday !== 1 ? "s" : ""} ${taskStats.dueToday === 1 ? "is" : "are"} due today.`
                    : "No tasks due today - plan ahead."}
                </p>

                <div style={{ height: 1, background: "var(--lh-border)", marginBottom: 12 }} />

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    gap: 8,
                  }}
                >
                  {[
                    { label: "Pending", value: taskStats.pending },
                    { label: "Done", value: taskStats.completed },
                    { label: "Due today", value: taskStats.dueToday },
                  ].map(({ label, value }, index, arr) => (
                    <div
                      key={label}
                      style={{
                        padding: "0 12px",
                        borderRight: index === arr.length - 1 ? "none" : "1px solid var(--lh-border)",
                      }}
                    >
                      <p
                        style={{
                          margin: "0 0 4px",
                          fontFamily: "var(--lh-font-display)",
                          fontSize: 22,
                          fontWeight: 500,
                          color: "var(--lh-ink)",
                          lineHeight: 1,
                          letterSpacing: "-0.03em",
                        }}
                      >
                        {value}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 12,
                          fontWeight: 600,
                          color: "var(--lh-muted-2)",
                          letterSpacing: "0.07em",
                          textTransform: "uppercase",
                        }}
                      >
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Momentum chart */}
          <div style={{ ...CARD_STYLE, padding: 18 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: 28, fontWeight: 500, color: "var(--lh-ink)", fontFamily: "var(--lh-font-display)", lineHeight: 1 }}>
                  Weekly momentum
                </h2>
                <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "var(--lh-muted)" }}>
                  Tasks completed per day, last 7 days
                </p>
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--lh-accent-ink)",
                  background: "var(--lh-accent-bg)",
                  border: "1px solid var(--lh-accent-border)",
                  borderRadius: 999,
                  padding: "3px 10px",
                }}
              >
                {weekTotal} this week
              </span>
            </div>
            <MomentumChart data={weekData} />
          </div>
        </div>

        {/* ── Right column ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <StreakCard streak={streak} weekDays={streakDays} />

          {/* Today's focus */}
          <div style={{ ...CARD_STYLE, overflow: "hidden" }}>
            <div
              style={{
                padding: "14px 16px 10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "var(--lh-ink)" }}>
                  Today's focus
                </h2>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--lh-muted)" }}>
                  {todayTasks.length} task{todayTasks.length !== 1 ? "s" : ""} due today
                </p>
              </div>
              <button
                onClick={onNavigateToTasks}
                style={{
                  height: 24,
                  padding: "0 6px",
                  background: "transparent",
                  border: "none",
                  borderRadius: "var(--lh-r-xs)",
                  fontSize: 12.5,
                  fontWeight: 500,
                  color: "var(--lh-ink-2)",
                  cursor: "pointer",
                  fontFamily: "var(--lh-font-sans)",
                  transition: "background 0.12s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--lh-surface-2)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                View all →
              </button>
            </div>

            <div style={{ padding: "2px 16px 12px" }}>
              {todayTasks.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "24px 0",
                    color: "var(--lh-muted-2)",
                  }}
                >
                  <p style={{ margin: 0, fontSize: 13 }}>Nothing scheduled for today</p>
                  <p style={{ margin: "4px 0 0", fontSize: 11.5 }}>
                    Use tomorrow as a buffer or add a quick task.
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 2 }}>
                  {todayTasks.map((task) => (
                    <div
                      key={task.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 8px",
                        borderRadius: "var(--lh-r-sm)",
                      }}
                    >
                      <div
                        style={{
                          width: 3,
                          height: 32,
                          alignSelf: "stretch",
                          borderRadius: 2,
                          background: PRIORITY_MARK_COLOR[task.priority] ?? "var(--lh-border-strong)",
                          flexShrink: 0,
                        }}
                      />

                      <button
                        type="button"
                        onClick={() => onToggleTask?.(task.id)}
                        aria-label={task.completed ? "Mark pending" : "Mark done"}
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 5,
                          border: task.completed
                            ? "1px solid var(--lh-accent)"
                            : "1px solid var(--lh-border-strong)",
                          background: task.completed ? "var(--lh-accent)" : "transparent",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                          padding: 0,
                        }}
                      >
                        {task.completed ? "✓" : ""}
                      </button>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 13,
                            fontWeight: 500,
                            color: task.completed ? "var(--lh-muted)" : "var(--lh-ink)",
                            textDecoration: task.completed ? "line-through" : "none",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {task.title}
                        </p>
                        <p style={{ margin: "2px 0 0", fontSize: 11.5, color: "var(--lh-muted-2)" }}>
                          <span
                            style={{
                              display: "inline-block",
                              width: 6,
                              height: 6,
                              borderRadius: 999,
                              background: SUBJECT_COLORS[task.subject] ?? "var(--lh-muted)",
                              marginRight: 8,
                              verticalAlign: "middle",
                            }}
                          />
                          {task.subject} · {task.priority} priority
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ ...CARD_STYLE, marginTop: 16, minHeight: 150, overflow: "hidden" }}>
        <div
          style={{
            padding: "14px 16px 10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 500, color: "var(--lh-ink)", fontFamily: "var(--lh-font-display)", lineHeight: 1 }}>
              Up next
            </h2>
            <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "var(--lh-muted)" }}>
              Upcoming tasks across your subjects
            </p>
          </div>
          <button
            onClick={onNavigateToTasks}
            style={{
              height: 24,
              padding: "0 6px",
              background: "transparent",
              border: "none",
              fontSize: 12.5,
              fontWeight: 500,
              color: "var(--lh-ink-2)",
              cursor: "pointer",
              fontFamily: "var(--lh-font-sans)",
            }}
          >
            Open tasks →
          </button>
        </div>

        <div style={{ padding: "0 16px 14px" }}>
          {upNextTasks.length === 0 ? (
            <div
              style={{
                minHeight: 108,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--lh-muted-2)",
                fontSize: 13,
                fontWeight: 600,
                gap: 6,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  border: "1px solid var(--lh-border)",
                  background: "var(--lh-surface-2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--lh-muted)",
                  fontSize: 15,
                }}
              >
                ☐
              </div>
              No upcoming tasks
              <p style={{ margin: 0, fontSize: 11.5, fontWeight: 400 }}>
                Plan ahead by adding tasks with due dates.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {upNextTasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 8px",
                    borderRadius: "var(--lh-r-sm)",
                  }}
                >
                  <div
                    style={{
                      width: 3,
                      height: 32,
                      alignSelf: "stretch",
                      borderRadius: 2,
                      background: PRIORITY_MARK_COLOR[task.priority] ?? "var(--lh-border-strong)",
                      flexShrink: 0,
                    }}
                  />
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13.5,
                      color: "var(--lh-ink)",
                      fontWeight: 500,
                      flex: 1,
                    }}
                  >
                    {task.title}
                  </p>
                  <span
                    style={{
                      fontSize: 11.5,
                      fontWeight: 600,
                      color: "var(--lh-muted)",
                      textTransform: "capitalize",
                    }}
                  >
                    {task.priority}
                  </span>
                  <p style={{ margin: 0, fontSize: 11.5, color: "var(--lh-muted-2)", minWidth: 110, textAlign: "right" }}>
                    due {task.dueDate}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
