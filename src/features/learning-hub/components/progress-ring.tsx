import { useEffect, useRef } from "react";

interface ProgressRingProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export function ProgressRing({
  percent,
  size = 180,
  strokeWidth = 12,
  label = "Complete",
}: ProgressRingProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  useEffect(() => {
    const el = circleRef.current;
    if (!el) return;
    el.style.transition = "none";
    el.style.strokeDashoffset = String(circumference);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = "stroke-dashoffset 0.6s cubic-bezier(0.2, 0, 0, 1)";
        el.style.strokeDashoffset = String(offset);
      });
    });
  }, [circumference, offset]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--lh-surface-3)"
            strokeWidth={strokeWidth}
          />
          <circle
            ref={circleRef}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--lh-accent)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <span
            style={{
              fontFamily: "var(--lh-font-display)",
              fontSize: 44,
              fontWeight: 500,
              lineHeight: 1,
              color: "var(--lh-ink)",
              letterSpacing: "-0.04em",
            }}
          >
            {percent}
          </span>
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 500,
              color: "var(--lh-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            %
          </span>
        </div>
      </div>
      <span
        style={{
          fontSize: 12.5,
          color: "var(--lh-muted)",
          fontWeight: 500,
        }}
      >
        {label}
      </span>
    </div>
  );
}
