import { useState } from "react";
import WORD_PACKS from "../../constants/wordPacks";

export default function MenuScreen({
  wordPack,
  setWordPack,
  customWords,
  setCustomWords,
  timerEnabled,
  setTimerEnabled,
  timerDuration,
  setTimerDuration,
  soundEnabled,
  setSoundEnabled,
  onStart,
  onMultiplayer,
  onRules,
  sound,
}) {
  const [showCustom, setShowCustom] = useState(false);

  function handleStart() {
    onStart(wordPack, customWords);
  }

  function handleCustomToggle() {
    const next = !showCustom;
    setShowCustom(next);
    setWordPack(next ? "custom" : "classic");
    sound("click");
  }

  return (
    <div
      style={{
        position: "relative", zIndex: 1,
        maxWidth: "680px", margin: "0 auto",
        padding: "40px 20px", minHeight: "100vh",
        display: "flex", flexDirection: "column", justifyContent: "center",
      }}
    >
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: "48px", animation: "slideUp 0.8s ease-out" }}>
        <div style={{ fontSize: "14px", fontWeight: 600, letterSpacing: "6px", textTransform: "uppercase", color: "#a78bfa", marginBottom: "12px" }}>
          🕵️ SPY WORD GAME 🕵️
        </div>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(48px, 10vw, 72px)",
            fontWeight: 900,
            background: "linear-gradient(135deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: 1.1,
            animation: "glow 3s ease-in-out infinite",
          }}
        >
          SPYDLE
        </h1>
        <p style={{ fontSize: "16px", color: "#94a3b8", marginTop: "12px", fontWeight: 300, letterSpacing: "1px" }}>
          The spy word guessing game — powered by AI 🕵️
        </p>
      </div>

      {/* Word Pack Selection */}
      <div style={{ animation: "slideUp 0.8s ease-out 0.1s both" }}>
        <label style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "#64748b", display: "block", marginBottom: "12px" }}>
          WORD PACK
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", marginBottom: "24px" }}>
          {Object.entries(WORD_PACKS)
            .filter(([k]) => k !== "custom")
            .map(([key, pack]) => (
              <button
                key={key}
                onClick={() => { setWordPack(key); setShowCustom(false); sound("click"); }}
                style={{
                  padding: "16px", borderRadius: "14px",
                  border: wordPack === key && !showCustom ? "2px solid #a78bfa" : "2px solid rgba(255,255,255,0.08)",
                  background: wordPack === key && !showCustom ? "rgba(167,139,250,0.12)" : "rgba(255,255,255,0.03)",
                  color: wordPack === key && !showCustom ? "#c4b5fd" : "#94a3b8",
                  cursor: "pointer", fontSize: "15px", fontWeight: 600,
                  display: "flex", alignItems: "center", gap: "10px",
                  transition: "all 0.2s", fontFamily: "inherit",
                }}
              >
                <span style={{ fontSize: "22px" }}>{pack.icon}</span>
                {pack.name}
              </button>
            ))}
        </div>

        {/* Custom Words */}
        <button
          onClick={handleCustomToggle}
          style={{
            width: "100%", padding: "12px", borderRadius: "12px",
            border: showCustom ? "2px solid #a78bfa" : "2px dashed rgba(255,255,255,0.15)",
            background: showCustom ? "rgba(167,139,250,0.1)" : "transparent",
            color: "#94a3b8", cursor: "pointer", fontSize: "14px", fontWeight: 500,
            fontFamily: "inherit", marginBottom: showCustom ? "12px" : "24px",
            transition: "all 0.2s",
          }}
        >
          ✏️ Use Custom Words
        </button>

        {showCustom && (
          <textarea
            value={customWords}
            onChange={(e) => setCustomWords(e.target.value)}
            placeholder="Enter at least 25 words separated by commas or new lines..."
            style={{
              width: "100%", height: "100px", padding: "14px", borderRadius: "12px",
              border: "2px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)",
              color: "#e2e8f0", fontSize: "14px", fontFamily: "'JetBrains Mono', monospace",
              resize: "vertical", marginBottom: "24px",
            }}
          />
        )}
      </div>

      {/* Settings */}
      <div style={{ animation: "slideUp 0.8s ease-out 0.2s both", marginBottom: "24px" }}>
        <label style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "#64748b", display: "block", marginBottom: "12px" }}>
          SETTINGS
        </label>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={() => { setTimerEnabled(!timerEnabled); sound("click"); }}
            style={{
              flex: 1, minWidth: "140px", padding: "14px", borderRadius: "12px",
              border: timerEnabled ? "2px solid #60a5fa" : "2px solid rgba(255,255,255,0.08)",
              background: timerEnabled ? "rgba(96,165,250,0.1)" : "rgba(255,255,255,0.03)",
              color: timerEnabled ? "#93c5fd" : "#64748b",
              cursor: "pointer", fontSize: "14px", fontWeight: 600, fontFamily: "inherit",
              transition: "all 0.2s",
            }}
          >
            ⏱️ Timer {timerEnabled ? "ON" : "OFF"}
          </button>

          {timerEnabled && (
            <select
              value={timerDuration}
              onChange={(e) => setTimerDuration(Number(e.target.value))}
              style={{
                flex: 1, minWidth: "140px", padding: "14px", borderRadius: "12px",
                border: "2px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.4)",
                color: "#e2e8f0", fontSize: "14px", fontFamily: "inherit", cursor: "pointer",
              }}
            >
              <option value={60}>1 min</option>
              <option value={90}>1.5 min</option>
              <option value={120}>2 min</option>
              <option value={180}>3 min</option>
              <option value={300}>5 min</option>
            </select>
          )}

          <button
            onClick={() => { setSoundEnabled(!soundEnabled); sound("click"); }}
            style={{
              flex: 1, minWidth: "140px", padding: "14px", borderRadius: "12px",
              border: soundEnabled ? "2px solid #34d399" : "2px solid rgba(255,255,255,0.08)",
              background: soundEnabled ? "rgba(52,211,153,0.1)" : "rgba(255,255,255,0.03)",
              color: soundEnabled ? "#6ee7b7" : "#64748b",
              cursor: "pointer", fontSize: "14px", fontWeight: 600, fontFamily: "inherit",
              transition: "all 0.2s",
            }}
          >
            {soundEnabled ? "🔊" : "🔇"} Sound {soundEnabled ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      {/* Start */}
      <div style={{ animation: "slideUp 0.8s ease-out 0.3s both", display: "flex", flexDirection: "column", gap: "10px" }}>
        <button
          onClick={() => { sound("click"); onMultiplayer(); }}
          style={{
            width: "100%", padding: "20px", borderRadius: "16px",
            border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, #ef4444, #8b5cf6, #3b82f6)",
            color: "white", fontSize: "20px", fontWeight: 800,
            fontFamily: "inherit", letterSpacing: "2px", textTransform: "uppercase",
            boxShadow: "0 8px 32px rgba(139,92,246,0.3)",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "translateY(-2px)")}
          onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
        >
          🌐 Multiplayer 🚀
        </button>

        <button
          onClick={handleStart}
          style={{
            width: "100%", padding: "16px", borderRadius: "14px",
            border: "2px solid rgba(167,139,250,0.35)", cursor: "pointer",
            background: "rgba(167,139,250,0.08)",
            color: "#c4b5fd", fontSize: "16px", fontWeight: 700,
            fontFamily: "inherit", letterSpacing: "1px",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(167,139,250,0.15)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(167,139,250,0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          Classic — Solo Device
        </button>
      </div>

      <button
        onClick={onRules}
        style={{
          margin: "20px auto 0", display: "block",
          background: "none", border: "none", color: "#64748b",
          cursor: "pointer", fontSize: "14px", fontFamily: "inherit",
          textDecoration: "underline", textDecorationStyle: "dotted",
          textUnderlineOffset: "4px",
        }}
      >
        How to play?
      </button>
    </div>
  );
}
