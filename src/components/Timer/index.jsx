import { useState, useEffect, useRef } from "react";

export default function Timer({ isActive, onTimeUp, duration = 120 }) {
  const [seconds, setSeconds] = useState(duration);
  const intervalRef = useRef(null);
  // Always holds the latest callback — avoids stale closure inside setInterval
  const onTimeUpRef = useRef(onTimeUp);
  onTimeUpRef.current = onTimeUp;

  // Reset only when the duration setting changes
  useEffect(() => {
    setSeconds(duration);
  }, [duration]);

  useEffect(() => {
    if (!isActive || seconds <= 0) return;
    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current);
          onTimeUpRef.current?.();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isActive]); // seconds intentionally omitted — we use functional updater

  const mins  = Math.floor(seconds / 60);
  const secs  = seconds % 60;
  const pct   = (seconds / duration) * 100;
  const isLow = seconds <= 15;

  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: "10px",
        padding: "8px 16px", borderRadius: "12px",
        background: isLow ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.08)",
        border: isLow ? "1px solid rgba(239,68,68,0.4)" : "1px solid rgba(255,255,255,0.1)",
        transition: "all 0.3s",
      }}
    >
      <div style={{ position: "relative", width: 32, height: 32 }}>
        <svg width="32" height="32" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="14" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
          <circle
            cx="16" cy="16" r="14" fill="none"
            stroke={isLow ? "#ef4444" : "#60a5fa"}
            strokeWidth="3" strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 14}`}
            strokeDashoffset={`${2 * Math.PI * 14 * (1 - pct / 100)}`}
            transform="rotate(-90 16 16)"
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
      </div>
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "18px", fontWeight: 700,
          color: isLow ? "#ef4444" : "#e2e8f0",
          animation: isLow ? "pulse 1s infinite" : "none",
          minWidth: "50px",
        }}
      >
        {mins}:{secs.toString().padStart(2, "0")}
      </span>
    </div>
  );
}
