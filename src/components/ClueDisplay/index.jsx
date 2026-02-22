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
        marginBottom: "6px",
        padding: "6px 12px",
        borderRadius: "12px",
        background: teamBg(currentClue.team),
        border: `2px solid ${teamBorder(currentClue.team)}`,
        display: "flex",
        alignItems: "center",
        gap: "10px",
        flexWrap: "wrap",
      }}
    >
      {/* Clue word */}
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "clamp(18px, 4vw, 26px)",
          fontWeight: 900,
          color: teamColor(currentClue.team),
          letterSpacing: "2px",
        }}
      >
        {currentClue.word}
      </span>

      {/* Guess count badge */}
      <span
        style={{
          fontSize: "clamp(14px, 3vw, 18px)",
          fontWeight: 900,
          color: "white",
          fontFamily: "'JetBrains Mono', monospace",
          padding: "2px 10px",
          borderRadius: "14px",
          background: "rgba(0,0,0,0.25)",
          border: `1px solid ${teamBorder(currentClue.team)}`,
        }}
      >
        {currentClue.number}
      </span>

      {/* Remaining guesses */}
      {!isInfinite && guessesLeft > 0 && (
        <span
          style={{
            fontSize: "12px", color: "#94a3b8",
            padding: "2px 8px", borderRadius: "14px",
            background: "rgba(255,255,255,0.07)",
            fontWeight: 600,
          }}
        >
          {guessesLeft} left
        </span>
      )}

      {/* Timer pushed to right */}
      {timerEnabled && (
        <div style={{ marginLeft: "auto" }}>
          <Timer
            key={timerKey}
            isActive={timerActive}
            onTimeUp={onTimeUp}
            duration={timerDuration}
          />
        </div>
      )}
    </div>
  );
}
