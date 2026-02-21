import Timer from "../Timer";
import { teamColor, teamBg, teamBorder } from "../../styles/theme";

export default function ClueDisplay({
  currentClue,
  guessesLeft,
  timerEnabled,
  timerKey,
  timerActive,
  onTimeUp,
  timerDuration,
}) {
  if (!currentClue) return null;

  const isInfinite = guessesLeft >= 99;

  return (
    <div
      style={{
        marginBottom: "14px",
        padding: "14px 20px",
        borderRadius: "16px",
        background: teamBg(currentClue.team),
        border: `2px solid ${teamBorder(currentClue.team)}`,
        boxShadow: `0 4px 20px ${teamBg(currentClue.team)}`,
        animation: "slideUp 0.3s ease-out",
      }}
    >
      {/* Top row: label + timer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
        <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: teamColor(currentClue.team), opacity: 0.7 }}>
          💡 Clue Word
        </span>
        {timerEnabled && (
          <Timer
            key={timerKey}
            isActive={timerActive}
            onTimeUp={onTimeUp}
            duration={timerDuration}
          />
        )}
      </div>

      {/* Main clue word — BIG and bold */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "clamp(26px, 6vw, 36px)",
            fontWeight: 900,
            color: teamColor(currentClue.team),
            letterSpacing: "3px",
            textShadow: `0 2px 12px ${teamBg(currentClue.team)}`,
          }}
        >
          {currentClue.word}
        </span>

        {/* Guess count badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px",
            borderRadius: "20px",
            background: "rgba(0,0,0,0.25)",
            border: `1px solid ${teamBorder(currentClue.team)}`,
          }}
        >
          <span style={{ fontSize: "18px", fontWeight: 900, color: "white", fontFamily: "'JetBrains Mono', monospace" }}>
            {currentClue.number}
          </span>
          <span style={{ fontSize: "13px", color: "#cbd5e1", fontWeight: 600 }}>
            {currentClue.number === 1 ? "card" : "cards"}
          </span>
        </div>

        {/* Remaining guesses */}
        {!isInfinite && guessesLeft > 0 && (
          <span
            style={{
              fontSize: "13px", color: "#94a3b8",
              padding: "4px 12px", borderRadius: "20px",
              background: "rgba(255,255,255,0.07)",
              fontWeight: 600,
            }}
          >
            {guessesLeft} guess{guessesLeft !== 1 ? "es" : ""} left
          </span>
        )}
      </div>
    </div>
  );
}
