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
};

const CARD_STYLE: React.CSSProperties = {
  background: "var(--lh-surface)",
  border: "1px solid var(--lh-border)",
  borderRadius: "var(--lh-r-lg)",
  boxShadow: "var(--lh-sh-sm)",
};

const PRIORITY_COLOR: Record<string, string> = {
  high: "var(--lh-p-high)",
  medium: "var(--lh-p-med)",
  low: "var(--lh-p-low)",
};

export function DashboardSection({
  taskStats,
  visibleTasks,
  streak,
  onOpenNewTask,
  onNavigateToTasks,
}: DashboardSectionProps) {
  const todayTasks = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return visibleTasks
      .filter((t) => !t.completed || t.dueDate === today)
      .slice(0, 6);
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
    <div style={{ padding: "28px 28px 40px", maxWidth: 1360, margin: "0 auto" }}>
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
          gap: 20,
        }}
        className="lh-dash-grid"
      >
        {/* ── Left column ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Progress card */}
          <div style={{ ...CARD_STYLE, padding: 24 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--lh-ink)",
                  }}
                >
                  Learning progress
                </h2>
                <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "var(--lh-muted)" }}>
                  {taskStats.completed} of {taskStats.total} tasks complete.{" "}
                  {taskStats.dueToday > 0
                    ? `${taskStats.dueToday} task${taskStats.dueToday !== 1 ? "s" : ""} are due today.`
                    : "None due today."}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
              <ProgressRing percent={taskStats.progress} size={160} label="Complete" />

              {/* 3 stat boxes */}
              <div style={{ display: "flex", gap: 12, flex: 1 }}>
                {[
                  { label: "Pending", value: taskStats.pending, color: "var(--lh-accent)" },
                  { label: "Done", value: taskStats.completed, color: "var(--lh-success)" },
                  { label: "Due today", value: taskStats.dueToday, color: "var(--lh-p-high)" },
                ].map(({ label, value, color }) => (
                  <div
                    key={label}
                    style={{
                      flex: 1,
                      background: "var(--lh-surface-2)",
                      border: "1px solid var(--lh-border)",
                      borderRadius: "var(--lh-r-md)",
                      padding: "14px 12px",
                      textAlign: "center",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 4px",
                        fontFamily: "var(--lh-font-display)",
                        fontSize: 32,
                        fontWeight: 500,
                        color,
                        lineHeight: 1,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {value}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 10.5,
                        fontWeight: 600,
                        color: "var(--lh-muted-2)",
                        letterSpacing: "0.06em",
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

          {/* Momentum chart */}
          <div style={{ ...CARD_STYLE, padding: 22 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "var(--lh-ink)" }}>
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
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <StreakCard streak={streak} weekDays={streakDays} />

          {/* Today's focus */}
          <div style={{ ...CARD_STYLE, overflow: "hidden" }}>
            <div
              style={{
                padding: "16px 20px 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid var(--lh-border)",
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "var(--lh-ink)" }}>
                  Today's focus
                </h2>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--lh-muted)" }}>
                  {taskStats.dueToday > 0
                    ? `${taskStats.dueToday} task${taskStats.dueToday !== 1 ? "s" : ""} due today`
                    : "Upcoming tasks"}
                </p>
              </div>
              <button
                onClick={onNavigateToTasks}
                style={{
                  height: 26,
                  padding: "0 10px",
                  background: "transparent",
                  border: "1px solid var(--lh-border-strong)",
                  borderRadius: "var(--lh-r-xs)",
                  fontSize: 12,
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

            <div style={{ padding: "8px 20px 16px" }}>
              {todayTasks.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "24px 0",
                    color: "var(--lh-muted-2)",
                  }}
                >
                  <p style={{ margin: 0, fontSize: 13 }}>No pending tasks.</p>
                  <p style={{ margin: "4px 0 0", fontSize: 11.5 }}>
                    Add tasks to see them here.
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 8 }}>
                  {todayTasks.map((task) => (
                    <div
                      key={task.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "9px 0",
                        borderBottom: "1px solid var(--lh-border)",
                      }}
                    >
                      {/* Priority bar */}
                      <div
                        style={{
                          width: 3,
                          height: 28,
                          borderRadius: 99,
                          background: PRIORITY_COLOR[task.priority] ?? "var(--lh-border-strong)",
                          flexShrink: 0,
                        }}
                      />

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
                        <p style={{ margin: 0, fontSize: 11.5, color: "var(--lh-muted-2)" }}>
                          {task.subject}
                          {task.dueDate ? ` · due ${task.dueDate}` : ""}
                        </p>
                      </div>

                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 600,
                          color: PRIORITY_COLOR[task.priority] ?? "var(--lh-muted)",
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                          flexShrink: 0,
                        }}
                      >
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
