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
        gap: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
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
            fontSize: 13,
            fontWeight: 500,
            color: "var(--lh-muted)",
          }}
        >
          day streak
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
            <div
              key={label}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}
            >
              <div
                style={{
                  aspectRatio: "1",
                  width: "100%",
                  borderRadius: 6,
                  background: isDone
                    ? "var(--lh-accent)"
                    : isToday
                    ? "var(--lh-surface-3)"
                    : "var(--lh-surface-3)",
                  border: isDone
                    ? "1px solid var(--lh-accent)"
                    : "1px solid var(--lh-border)",
                  boxShadow: isToday
                    ? "0 0 0 2px var(--lh-bg), 0 0 0 3.5px var(--lh-ink)"
                    : "none",
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  color: "var(--lh-muted-2)",
                  fontWeight: 500,
                }}
              >
                {label[0]}
              </span>
            </div>
          );
        })}
      </div>

      <p
        style={{
          margin: 0,
          fontSize: 12,
          color: "var(--lh-muted)",
        }}
      >
        Keep it up — study every day to grow your streak!
      </p>
    </div>
  );
}
