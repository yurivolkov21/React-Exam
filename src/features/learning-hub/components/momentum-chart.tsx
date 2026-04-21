interface DayData {
  label: string;
  count: number;
  isToday?: boolean;
}

interface MomentumChartProps {
  data: DayData[];
}

export function MomentumChart({ data }: MomentumChartProps) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${data.length}, 1fr)`,
          gap: 8,
          height: 120,
          alignItems: "flex-end",
        }}
      >
        {data.map((day, index) => {
          const heightPct = (day.count / max) * 100;
          return (
            <div
              key={`${day.label}-${index}`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0,
                height: "100%",
                justifyContent: "flex-end",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: 32,
                  height: "100%",
                  display: "flex",
                  alignItems: "flex-end",
                }}
              >
                {/* background bar */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "100%",
                    background: "var(--lh-surface-3)",
                    borderRadius: "4px 4px 0 0",
                  }}
                />
                {/* fill bar */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: `${Math.max(heightPct, day.count > 0 ? 4 : 0)}%`,
                    background: day.isToday ? "var(--lh-accent)" : "var(--lh-ink)",
                    borderRadius: "4px 4px 0 0",
                    transition: "height 0.2s ease",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Labels */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${data.length}, 1fr)`,
          gap: 8,
        }}
      >
        {data.map((day, index) => (
          <span
            key={`${day.label}-${index}-label`}
            style={{
              fontSize: 10.5,
              color: day.isToday ? "var(--lh-accent-ink)" : "var(--lh-muted-2)",
              fontWeight: day.isToday ? 600 : 400,
              textAlign: "center",
              display: "block",
            }}
          >
            {day.label}
          </span>
        ))}
      </div>
    </div>
  );
}
