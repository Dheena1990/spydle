import { teamColor, teamBg, teamBorder } from "../../styles/theme";

export default function GameOverBanner({ game, onPlayAgain }) {
  if (!game.gameOver || !game.winner) return null;

  const { winner, cards } = game;
  const hitAssassin = cards.find((c) => c.type === "assassin" && c.revealed);

  return (
    <div
      style={{
        padding: "24px", borderRadius: "18px", textAlign: "center",
        marginBottom: "16px",
        background: `linear-gradient(135deg, ${teamBg(winner)}, rgba(0,0,0,0.3))`,
        border: `2px solid ${teamBorder(winner)}`,
        animation: "slideUp 0.5s ease-out",
      }}
    >
      <div style={{ fontSize: "48px", marginBottom: "10px" }}>🎉</div>
      <div
        style={{
          fontSize: "28px", fontWeight: 900,
          fontFamily: "'Playfair Display', serif",
          color: teamColor(winner),
          marginBottom: "8px",
        }}
      >
        {winner.toUpperCase()} TEAM WINS!
      </div>
      <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "18px" }}>
        {hitAssassin ? "The other team hit the Assassin!" : "All agents have been found!"}
      </p>
      <button
        onClick={onPlayAgain}
        style={{
          padding: "14px 40px", borderRadius: "12px", border: "none",
          background: "linear-gradient(135deg, #ef4444, #8b5cf6, #3b82f6)",
          color: "white", fontSize: "16px", fontWeight: 800,
          cursor: "pointer", fontFamily: "inherit", letterSpacing: "1px",
        }}
      >
        Play Again 🔄
      </button>
    </div>
  );
}
