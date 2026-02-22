import { teamColor, teamBg, teamBorder } from "../../styles/theme";

// Render filled/empty dots to show remaining cards visually
function ProgressDots({ remaining, total, color, glow }) {
  const dots = [];
  for (let i = 0; i < total; i++) {
    dots.push(
      <div
        key={i}
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          background: i < remaining ? color : "rgba(255,255,255,0.1)",
          boxShadow: i < remaining ? `0 0 5px ${glow}` : "none",
          transition: "all 0.3s",
          flexShrink: 0,
        }}
      />
    );
  }
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", maxWidth: "80px" }}>
      {dots}
    </div>
  );
}

export default function ScoreBar({ game }) {
  const { currentTeam, redRemaining, blueRemaining, redTotal, blueTotal, gameOver, winner } = game;

  // Fallback totals if not tracked in game state
  const rTotal = redTotal || 9;
  const bTotal = blueTotal || 8;

  const activeTeam = gameOver ? winner : currentTeam;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "6px",
        padding: "8px 12px",
        borderRadius: "16px",
        background: "rgba(255,255,255,0.04)",
        border: `2px solid ${teamBorder(activeTeam)}`,
        boxShadow: `0 0 20px ${teamBg(activeTeam)}`,
        transition: "border-color 0.4s, box-shadow 0.4s",
      }}
    >
      {/* Red Team */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "6px", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <div
            style={{
              width: "13px", height: "13px", borderRadius: "50%",
              background: "#ef4444",
              boxShadow: currentTeam === "red" && !gameOver ? "0 0 12px rgba(239,68,68,0.8)" : "none",
              animation: currentTeam === "red" && !gameOver ? "pulse 1.5s ease-in-out infinite" : "none",
            }}
          />
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "22px", fontWeight: 800, color: "#fca5a5",
          }}>
            {redRemaining}
          </span>
          <span style={{ fontSize: "11px", fontWeight: 600, color: "#f87171", letterSpacing: "1px", textTransform: "uppercase" }}>
            Red
          </span>
        </div>
        <ProgressDots remaining={redRemaining} total={rTotal} color="#ef4444" glow="rgba(239,68,68,0.6)" />
      </div>

      {/* Center turn badge */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
        <div
          style={{
            padding: "6px 16px",
            borderRadius: "20px",
            background: teamBg(activeTeam),
            border: `2px solid ${teamBorder(activeTeam)}`,
            fontSize: "13px", fontWeight: 800, letterSpacing: "0.5px",
            color: teamColor(activeTeam),
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            boxShadow: `0 2px 12px ${teamBg(activeTeam)}`,
          }}
        >
          {gameOver ? `🏆 ${winner?.toUpperCase()} WINS!` : `${currentTeam === "red" ? "🔴" : "🔵"} ${currentTeam}'s turn`}
        </div>
      </div>

      {/* Blue Team */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <span style={{ fontSize: "11px", fontWeight: 600, color: "#93c5fd", letterSpacing: "1px", textTransform: "uppercase" }}>
            Blue
          </span>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "22px", fontWeight: 800, color: "#93c5fd",
          }}>
            {blueRemaining}
          </span>
          <div
            style={{
              width: "13px", height: "13px", borderRadius: "50%",
              background: "#3b82f6",
              boxShadow: currentTeam === "blue" && !gameOver ? "0 0 12px rgba(59,130,246,0.8)" : "none",
              animation: currentTeam === "blue" && !gameOver ? "pulse 1.5s ease-in-out infinite" : "none",
            }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <ProgressDots remaining={blueRemaining} total={bTotal} color="#3b82f6" glow="rgba(59,130,246,0.6)" />
        </div>
      </div>
    </div>
  );
}
