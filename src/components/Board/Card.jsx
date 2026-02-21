import { teamColor, teamBorder } from "../../styles/theme";

const colorMap = {
  red:      { bg: "rgba(239,68,68,0.35)",   border: "rgba(239,68,68,0.75)",   text: "#fecaca", glow: "rgba(239,68,68,0.4)" },
  blue:     { bg: "rgba(59,130,246,0.35)",  border: "rgba(59,130,246,0.75)",  text: "#bfdbfe", glow: "rgba(59,130,246,0.4)" },
  neutral:  { bg: "rgba(234,179,8,0.22)",   border: "rgba(234,179,8,0.55)",   text: "#fde68a", glow: "rgba(234,179,8,0.3)" },
  assassin: { bg: "rgba(15,15,15,0.85)",    border: "rgba(239,68,68,0.9)",    text: "#f87171", glow: "rgba(239,68,68,0.5)" },
};

export default function Card({
  card,
  isSpymaster,
  isClickable,
  currentTeam,
  isAnimating,
  onClick,
}) {
  const revealed    = card.revealed;
  const showColors  = revealed || isSpymaster;
  const c           = showColors ? colorMap[card.type] : null;

  // Cards that can still be clicked pulse subtly to invite interaction
  const activeBorder = isClickable && !showColors
    ? `2px solid ${teamBorder(currentTeam)}`
    : showColors
      ? `2px solid ${c.border}`
      : "2px solid rgba(255,255,255,0.12)";

  const base = {
    borderRadius: "14px",
    cursor: isClickable ? "pointer" : "default",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "clamp(5px, 1.5vw, 10px) clamp(2px, 0.8vw, 6px)",
    minHeight: "clamp(52px, 10vw, 68px)",
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
    animation: isAnimating ? "cardReveal 0.5s ease-out" : `slideUp 0.4s ease-out ${card.id * 0.02}s both`,
  };

  const cardStyle = showColors
    ? {
        ...base,
        background: c.bg,
        border: activeBorder,
        color: c.text,
        opacity: revealed ? 0.82 : 1,
        boxShadow: revealed
          ? `0 2px 12px ${c.glow}`
          : card.type === "assassin"
            ? "inset 0 0 24px rgba(0,0,0,0.6)"
            : `0 0 16px ${c.glow}`,
      }
    : {
        ...base,
        background: isClickable
          ? "rgba(255,255,255,0.07)"
          : "rgba(255,255,255,0.04)",
        border: activeBorder,
        color: "#e2e8f0",
        boxShadow: isClickable
          ? `0 2px 10px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)`
          : "0 2px 8px rgba(0,0,0,0.2)",
      };

  function handleMouseEnter(e) {
    if (!isClickable) return;
    e.currentTarget.style.transform = "scale(1.06) translateY(-2px)";
    e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.5), 0 0 14px ${teamBorder(currentTeam)}`;
    e.currentTarget.style.borderColor = teamColor(currentTeam);
  }

  function handleMouseLeave(e) {
    if (revealed || isSpymaster) return;
    e.currentTarget.style.transform = "scale(1) translateY(0)";
    e.currentTarget.style.boxShadow = isClickable
      ? "0 2px 10px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)"
      : "0 2px 8px rgba(0,0,0,0.2)";
    e.currentTarget.style.borderColor = isClickable
      ? teamBorder(currentTeam)
      : "rgba(255,255,255,0.12)";
  }

  return (
    <div
      style={cardStyle}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Assassin skull badge */}
      {showColors && card.type === "assassin" && (
        <div style={{ position: "absolute", top: "4px", right: "6px", fontSize: "13px", opacity: 0.85 }}>
          💀
        </div>
      )}

      {/* Spymaster color tag (small corner dot) */}
      {isSpymaster && !revealed && (
        <div style={{
          position: "absolute", top: "5px", left: "6px",
          width: "8px", height: "8px", borderRadius: "50%",
          background: c.border, boxShadow: `0 0 6px ${c.glow}`,
        }} />
      )}

      <span
        style={{
          fontSize: "clamp(8px, 2.2vw, 14px)",
          fontWeight: 800,
          textAlign: "center",
          lineHeight: 1.15,
          letterSpacing: "0.3px",
          wordBreak: "break-word",
          hyphens: "auto",
          textShadow: showColors ? `0 1px 4px rgba(0,0,0,0.5)` : "none",
        }}
      >
        {card.word}
      </span>
    </div>
  );
}
