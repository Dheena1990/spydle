import { useState } from "react";
import { generateRoomCode, roomExists } from "../../firebase/roomService";
import WORD_PACKS from "../../constants/wordPacks";

const ROLES = [
  { id: "red_spymaster",  label: "🔴 Red Spymaster",  desc: "Give clues for the Red team" },
  { id: "blue_spymaster", label: "🔵 Blue Spymaster",  desc: "Give clues for the Blue team" },
  { id: "operative",      label: "📺 Operative / TV",  desc: "Guess cards (no hidden colors)" },
];

export default function LobbyScreen({ onEnterGame, onBack, sound, timerEnabled, timerDuration }) {
  const [tab,       setTab]       = useState("create"); // "create" | "join"
  const [wordPack,  setWordPack]  = useState("classic");
  const [role,      setRole]      = useState("red_spymaster");
  const [joinCode,  setJoinCode]  = useState("");
  const [joinRole,  setJoinRole]  = useState("operative");
  const [loading,   setLoading]   = useState(false);
  const [errMsg,    setErrMsg]    = useState("");

  // ── Create Room ───────────────────────────────────────────────────────────
  async function handleCreate() {
    setLoading(true);
    setErrMsg("");
    try {
      const code = generateRoomCode();
      const meta = { wordPack, timerEnabled, timerDuration, hostId: code, createdAt: Date.now() };
      sound("click");
      onEnterGame(code, role, wordPack, meta, true /* isHost */);
    } catch (e) {
      setErrMsg("Could not create room. Check your Firebase config.");
    }
    setLoading(false);
  }

  // ── Join Room ─────────────────────────────────────────────────────────────
  async function handleJoin() {
    const code = joinCode.trim();
    if (code.length !== 4 || isNaN(Number(code))) {
      setErrMsg("Enter a valid 4-digit room code.");
      return;
    }
    setLoading(true);
    setErrMsg("");
    try {
      const exists = await roomExists(code);
      if (!exists) {
        setErrMsg(`Room "${code}" not found. Ask the host for the code.`);
        setLoading(false);
        return;
      }
      sound("click");
      onEnterGame(code, joinRole, null, null, false /* isHost */);
    } catch (e) {
      setErrMsg("Could not join room. Check your internet connection.");
    }
    setLoading(false);
  }

  return (
    <div style={{
      position: "relative", zIndex: 1,
      maxWidth: "520px", margin: "0 auto",
      padding: "40px 20px", minHeight: "100vh",
      display: "flex", flexDirection: "column",
    }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
        <button
          onClick={() => { sound("click"); onBack(); }}
          style={{
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            color: "#94a3b8", padding: "8px 14px", borderRadius: "10px",
            cursor: "pointer", fontSize: "13px", fontFamily: "inherit",
          }}
        >
          ← Back
        </button>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(20px, 5vw, 28px)", fontWeight: 800,
          background: "linear-gradient(135deg, #ef4444, #3b82f6)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          margin: 0,
        }}>
          Multiplayer Room
        </h2>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "28px" }}>
        {[{ id: "create", label: "➕ Create Room" }, { id: "join", label: "🚪 Join Room" }].map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setErrMsg(""); sound("click"); }}
            style={{
              flex: 1, padding: "12px", borderRadius: "12px",
              border: tab === t.id ? "2px solid #a78bfa" : "2px solid rgba(255,255,255,0.08)",
              background: tab === t.id ? "rgba(167,139,250,0.12)" : "rgba(255,255,255,0.03)",
              color: tab === t.id ? "#c4b5fd" : "#64748b",
              cursor: "pointer", fontSize: "14px", fontWeight: 700, fontFamily: "inherit",
              transition: "all 0.2s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── CREATE TAB ────────────────────────────────────────────────────── */}
      {tab === "create" && (
        <>
          {/* Word Pack */}
          <label style={labelStyle}>WORD PACK</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px", marginBottom: "20px" }}>
            {Object.entries(WORD_PACKS)
              .filter(([k]) => k !== "custom")
              .map(([key, pack]) => (
                <button
                  key={key}
                  onClick={() => { setWordPack(key); sound("click"); }}
                  style={{
                    padding: "12px", borderRadius: "12px",
                    border: wordPack === key ? "2px solid #a78bfa" : "2px solid rgba(255,255,255,0.08)",
                    background: wordPack === key ? "rgba(167,139,250,0.12)" : "rgba(255,255,255,0.03)",
                    color: wordPack === key ? "#c4b5fd" : "#94a3b8",
                    cursor: "pointer", fontSize: "14px", fontWeight: 600,
                    display: "flex", alignItems: "center", gap: "8px",
                    transition: "all 0.2s", fontFamily: "inherit",
                  }}
                >
                  <span>{pack.icon}</span>{pack.name}
                </button>
              ))}
          </div>

          {/* Your Role */}
          <label style={labelStyle}>YOUR ROLE</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "28px" }}>
            {ROLES.map((r) => (
              <button
                key={r.id}
                onClick={() => { setRole(r.id); sound("click"); }}
                style={{
                  padding: "12px 16px", borderRadius: "12px",
                  border: role === r.id ? "2px solid #a78bfa" : "2px solid rgba(255,255,255,0.08)",
                  background: role === r.id ? "rgba(167,139,250,0.12)" : "rgba(255,255,255,0.03)",
                  color: role === r.id ? "#c4b5fd" : "#94a3b8",
                  cursor: "pointer", fontSize: "14px", fontWeight: 600,
                  display: "flex", alignItems: "center", gap: "12px",
                  transition: "all 0.2s", fontFamily: "inherit", textAlign: "left",
                }}
              >
                <span style={{ flex: 1 }}>{r.label}</span>
                <span style={{ fontSize: "12px", color: role === r.id ? "#a78bfa" : "#475569" }}>
                  {r.desc}
                </span>
              </button>
            ))}
          </div>

          <ActionButton onClick={handleCreate} loading={loading}>
            🚀 Create Room
          </ActionButton>
        </>
      )}

      {/* ── JOIN TAB ──────────────────────────────────────────────────────── */}
      {tab === "join" && (
        <>
          <label style={labelStyle}>ROOM CODE</label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={4}
            placeholder="e.g. 4729"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.replace(/\D/g, ""))}
            style={{
              width: "100%", padding: "16px", borderRadius: "12px",
              border: "2px solid rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.35)",
              color: "#e2e8f0", fontSize: "28px", fontWeight: 800,
              fontFamily: "'JetBrains Mono', monospace", letterSpacing: "8px",
              textAlign: "center", marginBottom: "24px", boxSizing: "border-box",
              outline: "none",
            }}
          />

          <label style={labelStyle}>YOUR ROLE</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "28px" }}>
            {ROLES.map((r) => (
              <button
                key={r.id}
                onClick={() => { setJoinRole(r.id); sound("click"); }}
                style={{
                  padding: "12px 16px", borderRadius: "12px",
                  border: joinRole === r.id ? "2px solid #a78bfa" : "2px solid rgba(255,255,255,0.08)",
                  background: joinRole === r.id ? "rgba(167,139,250,0.12)" : "rgba(255,255,255,0.03)",
                  color: joinRole === r.id ? "#c4b5fd" : "#94a3b8",
                  cursor: "pointer", fontSize: "14px", fontWeight: 600,
                  display: "flex", alignItems: "center", gap: "12px",
                  transition: "all 0.2s", fontFamily: "inherit", textAlign: "left",
                }}
              >
                <span style={{ flex: 1 }}>{r.label}</span>
                <span style={{ fontSize: "12px", color: joinRole === r.id ? "#a78bfa" : "#475569" }}>
                  {r.desc}
                </span>
              </button>
            ))}
          </div>

          <ActionButton onClick={handleJoin} loading={loading}>
            🚪 Join Room
          </ActionButton>
        </>
      )}

      {/* Error */}
      {errMsg && (
        <div style={{
          marginTop: "16px", padding: "12px 16px", borderRadius: "10px",
          background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)",
          color: "#fca5a5", fontSize: "14px", textAlign: "center",
        }}>
          {errMsg}
        </div>
      )}

      {/* How it works */}
      <div style={{
        marginTop: "32px", padding: "16px", borderRadius: "14px",
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
      }}>
        <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "2px", color: "#64748b", margin: "0 0 10px" }}>
          HOW MULTIPLAYER WORKS
        </p>
        <div style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.6 }}>
          <div>🔴 Red Spymaster — their phone</div>
          <div>🔵 Blue Spymaster — another phone</div>
          <div>📺 Operative / TV — common screen</div>
          <div style={{ marginTop: "8px", color: "#475569" }}>
            All devices share the same room code and see the same 25 words.
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Shared styles ─────────────────────────────────────────────────────────
const labelStyle = {
  fontSize: "12px", fontWeight: 700, letterSpacing: "3px",
  textTransform: "uppercase", color: "#64748b",
  display: "block", marginBottom: "10px",
};

function ActionButton({ onClick, loading, children }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        width: "100%", padding: "18px", borderRadius: "14px",
        border: "none", cursor: loading ? "wait" : "pointer",
        background: loading
          ? "rgba(139,92,246,0.4)"
          : "linear-gradient(135deg, #ef4444, #8b5cf6, #3b82f6)",
        color: "white", fontSize: "18px", fontWeight: 800,
        fontFamily: "inherit", letterSpacing: "1px",
        boxShadow: "0 8px 32px rgba(139,92,246,0.3)",
        transition: "all 0.2s",
        opacity: loading ? 0.7 : 1,
      }}
    >
      {loading ? "⏳ Please wait..." : children}
    </button>
  );
}
