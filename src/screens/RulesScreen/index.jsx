const RULES = [
  { emoji: "👥", title: "Teams",         desc: "Split into two teams (Red & Blue). Each team picks a Spymaster. Everyone else is an Operative." },
  { emoji: "🎯", title: "The Board",     desc: "25 word cards in a 5×5 grid. Each card is secretly assigned to Red team, Blue team, neutral bystanders, or the deadly Assassin." },
  { emoji: "🗣️", title: "Giving Clues",  desc: "Spymasters give a ONE-WORD clue + a number (how many cards relate to it). Example: 'Ocean: 3' might hint at WAVE, FISH, and SHIP." },
  { emoji: "🤔", title: "Guessing",      desc: "Operatives tap cards to guess. Correct = keep guessing (up to number + 1). Wrong team's card or bystander = turn ends." },
  { emoji: "💀", title: "The Assassin",  desc: "Hit the Assassin card? Your team INSTANTLY LOSES. Spymasters must be careful!" },
  { emoji: "🏆", title: "Winning",       desc: "First team to uncover ALL their agents wins! The starting team has 9 words, the other has 8." },
  { emoji: "🤖", title: "AI Spymaster",  desc: "Don't have enough players? Let AI be your Spymaster! It'll analyze the board and give clever clues." },
  { emoji: "🗝️", title: "Spymaster View",desc: "Toggle Spymaster mode to see the key card (all card colors revealed). Share one screen or use separate devices!" },
];

export default function RulesScreen({ onBack }) {
  return (
    <div
      style={{
        position: "relative", zIndex: 1,
        maxWidth: "680px", margin: "0 auto",
        padding: "40px 20px",
      }}
    >
      <button
        onClick={onBack}
        style={{
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
          color: "#94a3b8", padding: "10px 20px", borderRadius: "10px",
          cursor: "pointer", fontSize: "14px", fontFamily: "inherit", marginBottom: "30px",
        }}
      >
        ← Back
      </button>

      <h2
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "36px", fontWeight: 800, marginBottom: "30px",
          background: "linear-gradient(135deg, #ef4444, #3b82f6)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}
      >
        How to Play
      </h2>

      {RULES.map((rule, i) => (
        <div
          key={i}
          style={{
            display: "flex", gap: "16px", marginBottom: "20px",
            padding: "18px", borderRadius: "14px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <span style={{ fontSize: "28px", flexShrink: 0 }}>{rule.emoji}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: "16px", color: "#e2e8f0", marginBottom: "4px" }}>
              {rule.title}
            </div>
            <div style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.6 }}>
              {rule.desc}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
