import { useState, useEffect, useCallback, useRef } from "react";
import { generateBoard } from "../utils/gameLogic";
import {
  createRoom,
  joinRoom,
  updateGame,
  setClue,
  setGuessesLeft,
  appendLog,
  resetLog,
} from "../firebase/roomService";

// ── Convert Firebase log object {0:{…},1:{…}} → array ─────────────────────
function logObjToArray(obj) {
  if (!obj) return [];
  if (Array.isArray(obj)) return obj;
  return Object.values(obj);
}

// ── Convert Firebase cards object → array (Firebase strips array indices) ──
function cardsObjToArray(obj) {
  if (!obj) return [];
  if (Array.isArray(obj)) return obj;
  return Object.values(obj);
}

// ──────────────────────────────────────────────────────────────────────────────
export function useMultiplayerGame() {
  const [game,        setGame]        = useState(null);
  const [currentClue, setCurrentClue] = useState(null);
  const [guessesLeft, setGuessesLeft_] = useState(0);
  const [roomCode,    setRoomCode]    = useState(null);
  const [role,        setRole]        = useState(null);
  const [connected,   setConnected]   = useState(false);
  const [error,       setError]       = useState(null);

  // Keep refs so callbacks always have fresh values
  const gameRef       = useRef(null);
  const clueRef       = useRef(null);
  const guessesRef    = useRef(0);
  const roomCodeRef   = useRef(null);
  const unsubRef      = useRef(null);

  useEffect(() => { gameRef.current    = game;        }, [game]);
  useEffect(() => { clueRef.current    = currentClue; }, [currentClue]);
  useEffect(() => { guessesRef.current = guessesLeft; }, [guessesLeft]);
  useEffect(() => { roomCodeRef.current = roomCode;   }, [roomCode]);

  // ── Subscribe to room ────────────────────────────────────────────────────
  const subscribeToRoom = useCallback((code) => {
    // Unsubscribe previous listener if any
    if (unsubRef.current) unsubRef.current();

    const unsub = joinRoom(code, (data) => {
      if (!data) {
        setError("Room not found.");
        setConnected(false);
        return;
      }

      const rawCards = cardsObjToArray(data.game?.cards ?? []);
      const rawLog   = logObjToArray(data.log);

      setGame({
        cards:         rawCards,
        currentTeam:   data.game?.currentTeam   ?? "red",
        firstTeam:     data.game?.firstTeam      ?? "red",
        redRemaining:  data.game?.redRemaining   ?? 0,
        blueRemaining: data.game?.blueRemaining  ?? 0,
        gameOver:      data.game?.gameOver       ?? false,
        winner:        data.game?.winner         ?? null,
        clueHistory:   data.game?.clueHistory    ?? [],
        log:           rawLog,
      });

      setCurrentClue(data.clue ?? null);
      setGuessesLeft_(data.guessesLeft ?? 0);
      setConnected(true);
      setError(null);
    });

    unsubRef.current = unsub;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => { if (unsubRef.current) unsubRef.current(); };
  }, []);

  // ── Create a new room (host) ─────────────────────────────────────────────
  const createAndJoin = useCallback(async (code, wordPack, meta) => {
    try {
      setError(null);
      const board = generateBoard(wordPack);
      await createRoom(code, board, meta);
      setRoomCode(code);
      setRole(meta.role);
      subscribeToRoom(code);
    } catch (e) {
      setError("Failed to create room: " + e.message);
    }
  }, [subscribeToRoom]);

  // ── Join an existing room (guest) ────────────────────────────────────────
  const joinExistingRoom = useCallback((code, playerRole) => {
    setRoomCode(code);
    setRole(playerRole);
    subscribeToRoom(code);
  }, [subscribeToRoom]);

  // ── Give clue ────────────────────────────────────────────────────────────
  const giveClue = useCallback(async (word, number) => {
    const g = gameRef.current;
    const rc = roomCodeRef.current;
    if (!word.trim() || !number || !g || !rc) return false;
    const num = parseInt(number);
    if (isNaN(num) || num < 0) return false;

    const clue = { word: word.trim().toUpperCase(), number: num, team: g.currentTeam };
    const guesses = num === 0 ? 99 : num + 1;

    await setClue(rc, clue);
    await setGuessesLeft(rc, guesses);
    await appendLog(rc, { type: "clue", team: g.currentTeam, text: `${clue.word} : ${num}` });

    // Also update clueHistory in game node
    const updatedHistory = [...(g.clueHistory ?? []), clue];
    await updateGame(rc, { clueHistory: updatedHistory });

    return true;
  }, []);

  // ── Reveal a card ────────────────────────────────────────────────────────
  const revealCard = useCallback(async (cardId) => {
    const g  = gameRef.current;
    const cl = clueRef.current;
    const gl = guessesRef.current;
    const rc = roomCodeRef.current;
    if (!g || g.gameOver || !cl || !rc) return null;

    const card = g.cards[cardId];
    if (!card || card.revealed) return null;

    const newCards = g.cards.map((c) =>
      c.id === cardId ? { ...c, revealed: true } : c
    );
    const newRed  = newCards.filter((c) => c.type === "red"  && !c.revealed).length;
    const newBlue = newCards.filter((c) => c.type === "blue" && !c.revealed).length;

    let newGuesses  = gl - 1;
    let turnEnded   = false;
    let endType     = null;
    let newTeam     = g.currentTeam;
    let gameOver    = false;
    let winner      = null;

    const guessText =
      card.type === g.currentTeam ? "✓ Correct!"         :
      card.type === "assassin"    ? "💀 ASSASSIN!"        :
      card.type === "neutral"     ? "😐 Bystander"        :
                                    "✗ Opponent's agent";

    await appendLog(rc, {
      type: "guess",
      team: g.currentTeam,
      text: `guessed "${card.word}" → ${guessText}`,
    });

    if (card.type === "assassin") {
      endType  = "assassin";
      gameOver = true;
      winner   = g.currentTeam === "red" ? "blue" : "red";
      await appendLog(rc, {
        type: "end",
        text: `💀 ${g.currentTeam.toUpperCase()} hit the Assassin! ${winner.toUpperCase()} wins!`,
      });

    } else if (card.type === g.currentTeam) {
      const teamWon =
        (g.currentTeam === "red"  && newRed  === 0) ||
        (g.currentTeam === "blue" && newBlue === 0);

      if (teamWon) {
        endType  = "win";
        gameOver = true;
        winner   = g.currentTeam;
        await appendLog(rc, {
          type: "end",
          text: `🎉 ${g.currentTeam.toUpperCase()} found all agents! They win!`,
        });
      } else if (newGuesses <= 0) {
        turnEnded = true;
        newTeam   = g.currentTeam === "red" ? "blue" : "red";
        await appendLog(rc, { type: "turn", text: `Turn passes to ${newTeam.toUpperCase()}` });
      }

    } else {
      turnEnded = true;
      newGuesses = 0;
      newTeam    = g.currentTeam === "red" ? "blue" : "red";
      await appendLog(rc, { type: "turn", text: `Turn passes to ${newTeam.toUpperCase()}` });
    }

    const gamePatch = {
      cards:         newCards,
      currentTeam:   newTeam,
      redRemaining:  newRed,
      blueRemaining: newBlue,
      gameOver,
      winner:        winner ?? null,
    };
    await updateGame(rc, gamePatch);

    if (turnEnded || endType) {
      await setClue(rc, null);
      await setGuessesLeft(rc, 0);
    } else {
      await setGuessesLeft(rc, newGuesses);
    }

    return { endType, turnEnded, gameOver };
  }, []);

  // ── End turn voluntarily ─────────────────────────────────────────────────
  const endTurn = useCallback(async () => {
    const g  = gameRef.current;
    const rc = roomCodeRef.current;
    if (!g || g.gameOver || !rc) return;

    const next = g.currentTeam === "red" ? "blue" : "red";
    await updateGame(rc, { currentTeam: next });
    await setClue(rc, null);
    await setGuessesLeft(rc, 0);
    await appendLog(rc, {
      type: "turn",
      text: `${g.currentTeam.toUpperCase()} ends turn. Now ${next.toUpperCase()}'s turn.`,
    });
  }, []);

  // ── Apply AI clue ────────────────────────────────────────────────────────
  const applyAiClue = useCallback(async (clue) => {
    const g  = gameRef.current;
    const rc = roomCodeRef.current;
    if (!g || !rc) return;

    const firebaseClue = { word: clue.word, number: clue.number, team: clue.team };
    const guesses = clue.number === 0 ? 99 : clue.number + 1;

    await setClue(rc, firebaseClue);
    await setGuessesLeft(rc, guesses);
    await appendLog(rc, { type: "clue",  team: g.currentTeam, text: `🤖 AI: ${clue.word} : ${clue.number}` });
    await appendLog(rc, { type: "info",  text: `💡 Targets: ${clue.matched.join(", ")}` });

    const updatedHistory = [...(g.clueHistory ?? []), firebaseClue];
    await updateGame(rc, { clueHistory: updatedHistory });
  }, []);

  // ── Log error ────────────────────────────────────────────────────────────
  const logError = useCallback(async (text) => {
    const rc = roomCodeRef.current;
    if (!rc) return;
    await appendLog(rc, { type: "error", text });
  }, []);

  // ── Restart game (host only) ─────────────────────────────────────────────
  const restartGame = useCallback(async (wordPack, meta) => {
    const rc = roomCodeRef.current;
    if (!rc) return;
    const board = generateBoard(wordPack);
    await resetLog(rc);
    await createRoom(rc, board, meta);
  }, []);

  return {
    game,
    currentClue,
    guessesLeft,
    roomCode,
    role,
    connected,
    error,
    createAndJoin,
    joinExistingRoom,
    giveClue,
    revealCard,
    endTurn,
    applyAiClue,
    logError,
    restartGame,
  };
}
