import { useState, useCallback } from "react";
import { useAiSpymaster } from "../../hooks/useAiSpymaster";
import Board            from "../../components/Board";
import ScoreBar         from "../../components/ScoreBar";
import ClueDisplay      from "../../components/ClueDisplay";
import ClueInput        from "../../components/ClueInput";
import GameLog          from "../../components/GameLog";
import GameOverBanner   from "../../components/GameOverBanner";
import Confetti         from "../../components/Confetti";

export default function GameScreen({
  game,
  currentClue,
  guessesLeft,
  timerEnabled,
  timerDuration,
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

  const { aiLoading, generateClue } = useAiSpymaster();

  // ── Start timer on clue ──────────────────────────────────────────
  function startTimer() {
    if (timerEnabled) {
      setTimerActive(true);
      setTimerKey((k) => k + 1);
    }
  }

  function stopTimer() {
    setTimerActive(false);
  }

  // ── Manual clue submission ───────────────────────────────────────
  const handleGiveClue = useCallback(() => {
    const ok = onGiveClue(clueWord, clueNumber);
    if (ok) {
      setClueWord("");
      setClueNumber("");
      startTimer();
      sound("click");
    }
  }, [clueWord, clueNumber, onGiveClue, sound, timerEnabled]);

  // ── Card click ───────────────────────────────────────────────────
  const handleCardClick = useCallback(
    (cardId) => {
      setRevealAnimation(cardId);
      setTimeout(() => setRevealAnimation(null), 600);

      const result = onRevealCard(cardId);
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

  // ── End turn ─────────────────────────────────────────────────────
  const handleEndTurn = useCallback(() => {
    sound("click");
    stopTimer();
    onEndTurn();
  }, [onEndTurn, sound]);

  // ── Timer expired ────────────────────────────────────────────────
  const handleTimerUp = useCallback(() => {
    if (game && !game.gameOver) handleEndTurn();
  }, [game, handleEndTurn]);

  // ── AI clue ──────────────────────────────────────────────────────
  const handleAiClue = useCallback(() => {
    generateClue(
      game,
      (clue) => {
        onApplyAiClue(clue);
        startTimer();
        sound("click");
      },
      (err) => onLogError(err)
    );
  }, [game, generateClue, onApplyAiClue, onLogError, sound, timerEnabled]);

  if (!game) return null;

  return (
    <div style={{ position: "relative", zIndex: 1, maxWidth: "780px", margin: "0 auto", padding: "16px 12px 120px" }}>

      {game.gameOver && game.winner && <Confetti color={game.winner} />}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
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

        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "22px", fontWeight: 800,
            background: "linear-gradient(135deg, #ef4444, #3b82f6)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}
        >
          SPYDLE
        </h1>

        <div style={{ display: "flex", gap: "6px" }}>
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
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
        <button
          onClick={() => { setIsSpymaster(!isSpymaster); sound("click"); }}
          style={{
            flex: 1, minWidth: "120px", padding: "10px", borderRadius: "12px",
            border: isSpymaster ? "2px solid #f59e0b" : "2px solid rgba(255,255,255,0.08)",
            background: isSpymaster
              ? "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(217,119,6,0.1))"
              : "rgba(255,255,255,0.03)",
            color: isSpymaster ? "#fbbf24" : "#64748b",
            cursor: "pointer", fontSize: "14px", fontWeight: 700, fontFamily: "inherit",
            transition: "all 0.2s",
          }}
        >
          {isSpymaster ? "🗝️ SPYMASTER ON" : "🕵️‍♂️ Spymaster View"}
        </button>

        {!currentClue && !game.gameOver && (
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

      {/* Manual clue input */}
      {!currentClue && !game.gameOver && (
        <ClueInput
          currentTeam={game.currentTeam}
          clueWord={clueWord}
          clueNumber={clueNumber}
          onClueWordChange={setClueWord}
          onClueNumberChange={setClueNumber}
          onGiveClue={handleGiveClue}
        />
      )}

      {/* Board */}
      <Board
        cards={game.cards}
        isSpymaster={isSpymaster}
        currentClue={currentClue}
        currentTeam={game.currentTeam}
        gameOver={game.gameOver}
        revealAnimation={revealAnimation}
        onCardClick={handleCardClick}
      />

      {/* Game over */}
      <GameOverBanner game={game} onPlayAgain={() => { onPlayAgain(); stopTimer(); }} />

      {/* Log */}
      {showLog && <GameLog log={game.log} />}
    </div>
  );
}
