import { teamColor, teamBg, teamBorder } from "../../styles/theme";

export default function ScoreBar({ game }) {
  const { currentTeam, redRemaining, blueRemaining, gameOver, winner } = game;

  const activeTeam = gameOver ? winner : currentTeam;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "6px",
        padding: "6px 12px",
        borderRadius: "14px",
        background: "rgba(255,255,255,0.04)",
        border: `2px solid ${teamBorder(activeTeam)}`,
        boxShadow: `0 0 20px ${teamBg(activeTeam)}`,
        transition: "border-color 0.4s, box-shadow 0.4s",
      }}
    >
      {/* Red Team */}
      <div style={{ display: "flex", alignItems: "center", gap: "7px", flex: 1 }}>
        <div
          style={{
            width: "12px", height: "12px", borderRadius: "50%",
            background: "#ef4444",
            boxShadow: currentTeam === "red" && !gameOver ? "0 0 12px rgba(239,68,68,0.8)" : "none",
            animation: currentTeam === "red" && !gameOver ? "pulse 1.5s ease-in-out infinite" : "none",
          }}
        />
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "20px", fontWeight: 800, color: "#fca5a5",
        }}>
          {redRemaining}
        </span>
        <span style={{ fontSize: "11px", fontWeight: 600, color: "#f87171", letterSpacing: "1px", textTransform: "uppercase" }}>
          Red
        </span>
      </div>

      {/* Center turn badge */}
      <div
        style={{
          padding: "4px 14px",
          borderRadius: "20px",
          background: teamBg(activeTeam),
          border: `2px solid ${teamBorder(activeTeam)}`,
          fontSize: "12px", fontWeight: 800, letterSpacing: "0.5px",
          color: teamColor(activeTeam),
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        {gameOver ? `🏆 ${winner?.toUpperCase()} WINS!` : `${currentTeam === "red" ? "🔴" : "🔵"} ${currentTeam}'s turn`}
      </div>

      {/* Blue Team */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "7px", flex: 1 }}>
        <span style={{ fontSize: "11px", fontWeight: 600, color: "#93c5fd", letterSpacing: "1px", textTransform: "uppercase" }}>
          Blue
        </span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "20px", fontWeight: 800, color: "#93c5fd",
        }}>
          {blueRemaining}
        </span>
        <div
          style={{
            width: "12px", height: "12px", borderRadius: "50%",
            background: "#3b82f6",
            boxShadow: currentTeam === "blue" && !gameOver ? "0 0 12px rgba(59,130,246,0.8)" : "none",
            animation: currentTeam === "blue" && !gameOver ? "pulse 1.5s ease-in-out infinite" : "none",
          }}
        />
      </div>
    </div>
  );
}
