interface StreakCardProps {
  streak: number;
  weekDays?: boolean[];
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function StreakCard({ streak, weekDays }: StreakCardProps) {
  const today = new Date().getDay();
  const todayIdx = today === 0 ? 6 : today - 1;

  const days = weekDays ?? DAY_LABELS.map((_, i) => i < todayIdx);

  return (
    <div
      style={{
        background: "linear-gradient(180deg, var(--lh-accent-bg) 0%, var(--lh-bg) 60%)",
        border: "1px solid var(--lh-accent-border)",
        borderRadius: "var(--lh-r-lg)",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "var(--lh-accent-ink)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          🔥 Current streak
        </span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "var(--lh-muted)",
          }}
        >
          Last 7 days
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span
          style={{
            fontFamily: "var(--lh-font-display)",
            fontSize: 56,
            fontWeight: 500,
            lineHeight: 1,
            letterSpacing: "-0.04em",
            color: "var(--lh-ink)",
          }}
        >
          {streak}
        </span>
        <span
          style={{
            fontSize: 15,
            fontWeight: 400,
            color: "var(--lh-muted)",
          }}
        >
          {streak === 1 ? "day" : "days"}
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 6,
        }}
      >
        {DAY_LABELS.map((label, i) => {
          const isDone = days[i] ?? false;
          const isToday = i === todayIdx;
          return (
            <div key={`${label}-${i}`}>
              <div
                style={{
                  aspectRatio: "1",
                  width: "100%",
                  borderRadius: 6,
                  background: isDone
                    ? "var(--lh-accent)"
                    : "var(--lh-surface-2)",
                  border: isDone
                    ? "1px solid var(--lh-accent)"
                    : "1px solid var(--lh-border)",
                  boxShadow: isToday
                    ? "0 0 0 2px var(--lh-bg), 0 0 0 3.5px var(--lh-ink)"
                    : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    color: isDone ? "#fff" : "var(--lh-muted)",
                    fontWeight: 600,
                  }}
                >
                  {label[0]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
