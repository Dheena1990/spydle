export default function GameLog({ log }) {
  return (
    <div
      style={{
        padding: "16px", borderRadius: "14px",
        background: "rgba(0,0,0,0.3)",
        border: "1px solid rgba(255,255,255,0.06)",
        maxHeight: "260px", overflowY: "auto",
        animation: "slideUp 0.3s ease-out",
      }}
    >
      <div
        style={{
          fontSize: "12px", fontWeight: 700,
          letterSpacing: "2px", color: "#64748b",
          marginBottom: "10px",
        }}
      >
        GAME LOG
      </div>

      {log.length === 0 && (
        <div style={{ fontSize: "13px", color: "#475569", fontStyle: "italic" }}>
          No moves yet...
        </div>
      )}

      {[...log].reverse().map((entry, i) => (
        <div
          key={i}
          style={{
            fontSize: "13px", padding: "6px 0",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
            color:
              entry.type === "error" ? "#f87171" :
              entry.type === "end"   ? "#fbbf24" :
              entry.type === "clue"  ? (entry.team === "red" ? "#fca5a5" : "#93c5fd") :
              "#94a3b8",
          }}
        >
          {entry.type === "guess" && (
            <span style={{ color: entry.team === "red" ? "#fca5a5" : "#93c5fd", fontWeight: 600 }}>
              {entry.team.toUpperCase()}{" "}
            </span>
          )}
          {entry.text}
        </div>
      ))}
    </div>
  );
}
