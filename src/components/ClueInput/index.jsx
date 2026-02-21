import { teamColor } from "../../styles/theme";

export default function ClueInput({ currentTeam, clueWord, clueNumber, onClueWordChange, onClueNumberChange, onGiveClue }) {
  const isReady = clueWord.trim() && clueNumber;

  return (
    <div
      style={{
        display: "flex", gap: "8px", marginBottom: "12px",
        padding: "12px", borderRadius: "14px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
        animation: "slideUp 0.3s ease-out",
        flexWrap: "wrap",
      }}
    >
      <span
        style={{
          fontSize: "12px", color: "#64748b", fontWeight: 600,
          width: "100%", marginBottom: "4px", letterSpacing: "1px",
        }}
      >
        SPYMASTER — GIVE A CLUE:
      </span>

      <input
        type="text"
        value={clueWord}
        onChange={(e) => onClueWordChange(e.target.value)}
        placeholder="One word clue..."
        onKeyDown={(e) => e.key === "Enter" && onGiveClue()}
        style={{
          flex: 3, minWidth: "120px", padding: "12px 14px", borderRadius: "10px",
          border: "2px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.3)",
          color: "#e2e8f0", fontSize: "15px", fontFamily: "inherit", fontWeight: 600,
        }}
      />

      <input
        type="number"
        value={clueNumber}
        onChange={(e) => onClueNumberChange(e.target.value)}
        placeholder="#"
        min="0"
        max="9"
        onKeyDown={(e) => e.key === "Enter" && onGiveClue()}
        style={{
          flex: 1, minWidth: "60px", maxWidth: "80px",
          padding: "12px 14px", borderRadius: "10px",
          border: "2px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.3)",
          color: "#e2e8f0", fontSize: "15px",
          fontFamily: "'JetBrains Mono', monospace",
          textAlign: "center", fontWeight: 700,
        }}
      />

      <button
        onClick={onGiveClue}
        disabled={!isReady}
        style={{
          padding: "12px 20px", borderRadius: "10px", border: "none",
          background: isReady
            ? `linear-gradient(135deg, ${teamColor(currentTeam)}, ${currentTeam === "red" ? "#dc2626" : "#2563eb"})`
            : "rgba(255,255,255,0.05)",
          color: isReady ? "white" : "#475569",
          cursor: isReady ? "pointer" : "not-allowed",
          fontSize: "14px", fontWeight: 800, fontFamily: "inherit",
          letterSpacing: "1px",
        }}
      >
        GIVE
      </button>
    </div>
  );
}
