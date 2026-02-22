import { useState, useCallback, useEffect, useRef } from "react";
import { useAiSpymaster } from "../../hooks/useAiSpymaster";
import Board            from "../../components/Board";
import ScoreBar         from "../../components/ScoreBar";
import ClueDisplay      from "../../components/ClueDisplay";
import ClueInput        from "../../components/ClueInput";
import GameLog          from "../../components/GameLog";
import GameOverBanner   from "../../components/GameOverBanner";
import Confetti         from "../../components/Confetti";

// ── Role helpers ─────────────────────────────────────────────────────────────
function roleBadge(role) {
  if (role === "red_spymaster")  return { label: "🔴 Red Spymaster",  color: "#f87171" };
  if (role === "blue_spymaster") return { label: "🔵 Blue Spymaster", color: "#60a5fa" };
  if (role === "operative")      return { label: "📺 Operative",       color: "#a78bfa" };
  return null;
}

export default function GameScreen({
  game,
  currentClue,
  guessesLeft,
  timerEnabled,
  timerDuration,
  role = "local",
  isMultiplayer = false,
  roomCode = null,
  mpConnected = false,
  mpError = null,
  onGiveClue,
  onRevealCard,
  onEndTurn,
  onApplyAiClue,
  onLogError,
  onPlayAgain,
  onMenu,
  sound,
}) {
  const [isSpymaster,    setIsSpymaster]    = useState(false);
  const [showLog,        setShowLog]        = useState(false);
  const [timerActive,    setTimerActive]    = useState(false);
  const [timerKey,       setTimerKey]       = useState(0);
  const [revealAnimation,setRevealAnimation]= useState(null);
  const [clueWord,       setClueWord]       = useState("");
  const [clueNumber,     setClueNumber]     = useState("");
  const [codeCopied,     setCodeCopied]     = useState(false);

  const { aiLoading, generateClue } = useAiSpymaster();

  // ── Role logic ────────────────────────────────────────────────────────────
  // Spymasters can always toggle the spymaster view; operatives cannot.
  const canToggleSpymaster = role !== "operative";

  // Can give a clue this turn?
  const myTeam =
    role === "red_spymaster"  ? "red"  :
    role === "blue_spymaster" ? "blue" :
    role === "local"          ? game?.currentTeam :  // local: always allowed
    null; // operative: never

  const isMyTurnToClue =
    !isMultiplayer ||                          // local play: always shown
    (myTeam && game?.currentTeam === myTeam);  // multiplayer: only your team's turn

  // Effective spymaster view: local toggle OR forced on for spymaster roles
  const showSpymasterColors =
    isSpymaster ||
    role === "red_spymaster" ||
    role === "blue_spymaster";

  const badge = roleBadge(role);

  // ── Timer helpers ─────────────────────────────────────────────────────────
  function startTimer() {
    if (timerEnabled) {
      setTimerActive(true);
      setTimerKey((k) => k + 1);
    }
  }

  function stopTimer() {
    setTimerActive(false);
  }

  // ── Sync timer for all players when a new clue arrives (multiplayer) ─────
  const prevClueRef = useRef(null);
  useEffect(() => {
    if (isMultiplayer && currentClue && currentClue !== prevClueRef.current) {
      startTimer();
    }
    if (!currentClue) {
      stopTimer();
    }
    prevClueRef.current = currentClue;
  }, [currentClue]);

  // ── Manual clue submission ────────────────────────────────────────────────
  const handleGiveClue = useCallback(() => {
    const ok = onGiveClue(clueWord, clueNumber);
    if (ok) {
      setClueWord("");
      setClueNumber("");
      if (!isMultiplayer) startTimer(); // multiplayer timer syncs via useEffect
      sound("click");
    }
  }, [clueWord, clueNumber, onGiveClue, sound, timerEnabled, isMultiplayer]);

  // ── Card click ────────────────────────────────────────────────────────────
  const handleCardClick = useCallback(
    async (cardId) => {
      setRevealAnimation(cardId);
      setTimeout(() => setRevealAnimation(null), 600);

      const result = await onRevealCard(cardId);
      if (!result) return;

      if (result.endType === "assassin") {
        sound("assassin");
      } else if (result.endType === "win") {
        sound("win");
      } else if (result.turnEnded) {
        sound("wrong");
        stopTimer();
      } else {
        sound("correct");
      }

      if (result.turnEnded || result.gameOver) stopTimer();
    },
    [onRevealCard, sound]
  );

  // ── End turn ──────────────────────────────────────────────────────────────
  const handleEndTurn = useCallback(async () => {
    sound("click");
    stopTimer();
    await onEndTurn();
  }, [onEndTurn, sound]);

  // ── Timer expired ─────────────────────────────────────────────────────────
  const handleTimerUp = useCallback(() => {
    if (game && !game.gameOver) handleEndTurn();
  }, [game, handleEndTurn]);

  // ── AI clue ───────────────────────────────────────────────────────────────
  const handleAiClue = useCallback(() => {
    generateClue(
      game,
      (clue) => {
        onApplyAiClue(clue);
        if (!isMultiplayer) startTimer(); // multiplayer timer syncs via useEffect
        sound("click");
      },
      (err) => onLogError(err)
    );
  }, [game, generateClue, onApplyAiClue, onLogError, sound, timerEnabled]);

  if (!game) {
    // Waiting for Firebase room data
    if (isMultiplayer && !mpConnected) {
      return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", flexDirection: "column", gap: "16px" }}>
          <div style={{ fontSize: "32px" }}>⏳</div>
          <div style={{ color: "#94a3b8", fontSize: "16px" }}>
            {mpError || "Connecting to room…"}
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div style={{ position: "relative", zIndex: 1, maxWidth: "780px", margin: "0 auto", padding: "8px 8px 8px", minHeight: "100dvh", display: "flex", flexDirection: "column" }}>

      {game.gameOver && game.winner && <Confetti color={game.winner} />}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px", flexWrap: "wrap", gap: "6px" }}>
        <button
          onClick={onMenu}
          style={{
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            color: "#94a3b8", padding: "8px 14px", borderRadius: "10px",
            cursor: "pointer", fontSize: "13px", fontFamily: "inherit",
          }}
        >
          ← Menu
        </button>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "22px", fontWeight: 800,
              background: "linear-gradient(270deg, #ef4444, #f97316, #eab308, #3b82f6, #8b5cf6, #ef4444)",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              margin: 0,
              letterSpacing: "3px",
              animation: "gradientShift 4s ease infinite",
              filter: "drop-shadow(0 0 8px rgba(139,92,246,0.2))",
            }}
          >
            SPYDLE
          </h1>
          {/* Role badge for multiplayer */}
          {badge && (
            <span style={{
              fontSize: "11px", fontWeight: 700, letterSpacing: "1px",
              color: badge.color, background: "rgba(255,255,255,0.06)",
              padding: "2px 8px", borderRadius: "6px",
              border: `1px solid ${badge.color}40`,
            }}>
              {badge.label}
            </span>
          )}
          {/* Room code chip — tap to copy */}
          {roomCode && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(roomCode).catch(() => {});
                setCodeCopied(true);
                setTimeout(() => setCodeCopied(false), 2000);
              }}
              style={{
                fontSize: "11px", fontWeight: 800, letterSpacing: "2px",
                color: codeCopied ? "#86efac" : "#a78bfa",
                background: codeCopied ? "rgba(34,197,94,0.1)" : "rgba(167,139,250,0.1)",
                padding: "2px 8px", borderRadius: "6px",
                border: `1px solid ${codeCopied ? "rgba(34,197,94,0.3)" : "rgba(167,139,250,0.3)"}`,
                cursor: "pointer", fontFamily: "monospace",
              }}
            >
              {codeCopied ? "✅ Copied" : `🔑 ${roomCode}`}
            </button>
          )}
        </div>

        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          {/* Connection indicator (multiplayer only) */}
          {isMultiplayer && (
            <div style={{
              width: "8px", height: "8px", borderRadius: "50%",
              background: mpConnected ? "#22c55e" : "#ef4444",
              boxShadow: mpConnected ? "0 0 6px #22c55e" : "0 0 6px #ef4444",
              title: mpConnected ? "Connected" : "Disconnected",
            }} />
          )}
          {role !== "operative" && (
          <button
            onClick={() => { setShowLog(!showLog); sound("click"); }}
            style={{
              background: showLog ? "rgba(168,85,247,0.15)" : "rgba(255,255,255,0.06)",
              border: showLog ? "1px solid rgba(168,85,247,0.3)" : "1px solid rgba(255,255,255,0.1)",
              color: showLog ? "#c4b5fd" : "#94a3b8",
              padding: "8px 12px", borderRadius: "10px",
              cursor: "pointer", fontSize: "13px", fontFamily: "inherit",
            }}
          >
            📋
          </button>
          )}
          <button
            onClick={() => { onPlayAgain(); stopTimer(); }}
            style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              color: "#94a3b8", padding: "8px 12px", borderRadius: "10px",
              cursor: "pointer", fontSize: "13px", fontFamily: "inherit",
            }}
          >
            🔄
          </button>
        </div>
      </div>

      {/* Score */}
      <ScoreBar game={game} />

      {/* Active clue */}
      <ClueDisplay
        currentClue={currentClue}
        guessesLeft={guessesLeft}
        timerEnabled={timerEnabled}
        timerKey={timerKey}
        timerActive={timerActive}
        onTimeUp={handleTimerUp}
        timerDuration={timerDuration}
      />

      {/* Spymaster toggle + AI + End Turn row */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>

        {/* Spymaster toggle — hidden for operative role */}
        {canToggleSpymaster && (
          <button
            onClick={() => { setIsSpymaster(!isSpymaster); sound("click"); }}
            style={{
              flex: 1, minWidth: "120px", padding: "10px", borderRadius: "12px",
              border: showSpymasterColors ? "2px solid #f59e0b" : "2px solid rgba(255,255,255,0.08)",
              background: showSpymasterColors
                ? "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(217,119,6,0.1))"
                : "rgba(255,255,255,0.03)",
              color: showSpymasterColors ? "#fbbf24" : "#64748b",
              cursor: "pointer", fontSize: "14px", fontWeight: 700, fontFamily: "inherit",
              transition: "all 0.2s",
            }}
          >
            {showSpymasterColors ? "🗝️ SPYMASTER ON" : "🕵️‍♂️ Spymaster View"}
          </button>
        )}

        {/* AI Spymaster — only on your turn, no active clue */}
        {!currentClue && !game.gameOver && isMyTurnToClue && (
          <button
            onClick={handleAiClue}
            disabled={aiLoading}
            style={{
              flex: 1, minWidth: "120px", padding: "10px", borderRadius: "12px",
              border: "2px solid rgba(168,85,247,0.3)",
              background: aiLoading
                ? "linear-gradient(90deg, rgba(168,85,247,0.1), rgba(139,92,246,0.2), rgba(168,85,247,0.1))"
                : "rgba(168,85,247,0.08)",
              backgroundSize: aiLoading ? "200% 100%" : "auto",
              animation: aiLoading ? "shimmer 1.5s infinite" : "none",
              color: "#c4b5fd",
              cursor: aiLoading ? "wait" : "pointer",
              fontSize: "14px", fontWeight: 700, fontFamily: "inherit",
              opacity: aiLoading ? 0.7 : 1,
              transition: "all 0.2s",
            }}
          >
            {aiLoading ? "🤖 Thinking..." : "🤖 AI Spymaster"}
          </button>
        )}

        {/* End Turn — only when active clue, not game over */}
        {currentClue && !game.gameOver && (
          <button
            onClick={handleEndTurn}
            style={{
              flex: 1, minWidth: "120px", padding: "10px 16px", borderRadius: "12px",
              border: `2px solid rgba(255,255,255,0.35)`,
              background: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))",
              color: "#f1f5f9",
              cursor: "pointer", fontSize: "14px", fontWeight: 800, fontFamily: "inherit",
              boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
              letterSpacing: "0.5px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            ⏭️ End Turn
          </button>
        )}
      </div>

      {/* Manual clue input — only on your turn, no active clue */}
      {!currentClue && !game.gameOver && isMyTurnToClue && (
        <ClueInput
          currentTeam={game.currentTeam}
          clueWord={clueWord}
          clueNumber={clueNumber}
          onClueWordChange={setClueWord}
          onClueNumberChange={setClueNumber}
          onGiveClue={handleGiveClue}
        />
      )}

      {/* Waiting message for multiplayer when it's not your turn to clue */}
      {isMultiplayer && !currentClue && !game.gameOver && !isMyTurnToClue && role !== "operative" && (
        <div style={{
          textAlign: "center", padding: "8px", borderRadius: "10px",
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
          color: "#64748b", fontSize: "14px", marginBottom: "6px",
        }}>
          ⏳ Waiting for {game.currentTeam === "red" ? "🔴 Red" : "🔵 Blue"} Spymaster to give a clue…
        </div>
      )}

      {/* Board */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", minHeight: 0 }}>
        <Board
          cards={game.cards}
          isSpymaster={showSpymasterColors}
          currentClue={currentClue}
          currentTeam={game.currentTeam}
          gameOver={game.gameOver}
          revealAnimation={revealAnimation}
          onCardClick={handleCardClick}
        />
      </div>

      {/* Game over */}
      <GameOverBanner game={game} onPlayAgain={() => { onPlayAgain(); stopTimer(); }} />

      {/* Log (hidden from operatives) */}
      {showLog && role !== "operative" && <GameLog log={game.log} />}
    </div>
  );
}
