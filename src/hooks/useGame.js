import { useState, useCallback } from "react";
import { generateBoard } from "../utils/gameLogic";
import WORD_PACKS from "../constants/wordPacks";

export function useGame() {
  const [game, setGame] = useState(null);
  const [currentClue, setCurrentClue] = useState(null);
  const [guessesLeft, setGuessesLeft] = useState(0);

  // ── Start a new game ─────────────────────────────────────────────
  const startGame = useCallback((wordPack, customWords) => {
    let pack = wordPack;

    if (wordPack === "custom") {
      const words = customWords
        .split(/[,\n]+/)
        .map((w) => w.trim().toUpperCase())
        .filter((w) => w.length > 0);

      if (words.length < 25) {
        alert("Need at least 25 words for custom pack!");
        return false;
      }
      WORD_PACKS.custom = { name: "Custom", icon: "✏️", words };
      pack = "custom";
    }

    const board = generateBoard(pack);
    setGame(board);
    setCurrentClue(null);
    setGuessesLeft(0);
    return true;
  }, []);

  // ── Spymaster gives a manual clue ─────────────────────────────────
  const giveClue = useCallback(
    (word, number) => {
      if (!word.trim() || !number || !game) return false;
      const num = parseInt(number);
      if (isNaN(num) || num < 0) return false;
      const clue = { word: word.trim().toUpperCase(), number: num, team: game.currentTeam };

      setCurrentClue(clue);
      setGuessesLeft(num === 0 ? 99 : num + 1);
      setGame((g) => ({
        ...g,
        clueHistory: [...g.clueHistory, clue],
        log: [
          ...g.log,
          { type: "clue", team: g.currentTeam, text: `${word.toUpperCase()} : ${num}` },
        ],
      }));
      return true;
    },
    [game]
  );

  // ── Operative reveals a card ──────────────────────────────────────
  // Returns { endType, turnEnded, gameOver } or null if click was invalid.
  const revealCard = useCallback(
    (cardId) => {
      if (!game || game.gameOver || !currentClue) return null;
      const card = game.cards[cardId];
      if (card.revealed) return null;

      const newCards = game.cards.map((c) =>
        c.id === cardId ? { ...c, revealed: true } : c
      );
      const newRed  = newCards.filter((c) => c.type === "red"  && !c.revealed).length;
      const newBlue = newCards.filter((c) => c.type === "blue" && !c.revealed).length;

      let newGame = { ...game, cards: newCards, redRemaining: newRed, blueRemaining: newBlue };
      let newGuesses = guessesLeft - 1;
      let turnEnded  = false;
      let endType    = null;

      const guessText =
        card.type === game.currentTeam  ? "✓ Correct!"         :
        card.type === "assassin"        ? "💀 ASSASSIN!"        :
        card.type === "neutral"         ? "😐 Bystander"        :
                                         "✗ Opponent's agent";

      newGame.log = [
        ...newGame.log,
        { type: "guess", team: game.currentTeam, text: `guessed "${card.word}" → ${guessText}` },
      ];

      if (card.type === "assassin") {
        endType = "assassin";
        newGame.gameOver = true;
        newGame.winner   = game.currentTeam === "red" ? "blue" : "red";
        newGame.log.push({
          type: "end",
          text: `💀 ${game.currentTeam.toUpperCase()} hit the Assassin! ${newGame.winner.toUpperCase()} wins!`,
        });

      } else if (card.type === game.currentTeam) {
        const teamWon =
          (game.currentTeam === "red"  && newRed  === 0) ||
          (game.currentTeam === "blue" && newBlue === 0);

        if (teamWon) {
          endType = "win";
          newGame.gameOver = true;
          newGame.winner   = game.currentTeam;
          newGame.log.push({
            type: "end",
            text: `🎉 ${game.currentTeam.toUpperCase()} found all agents! They win!`,
          });
        } else if (newGuesses <= 0) {
          turnEnded = true;
          newGame.currentTeam = game.currentTeam === "red" ? "blue" : "red";
          newGame.log.push({ type: "turn", text: `Turn passes to ${newGame.currentTeam.toUpperCase()}` });
        }

      } else {
        turnEnded = true;
        newGuesses = 0;
        newGame.currentTeam = game.currentTeam === "red" ? "blue" : "red";
        newGame.log.push({ type: "turn", text: `Turn passes to ${newGame.currentTeam.toUpperCase()}` });
      }

      if (turnEnded || endType) {
        setCurrentClue(null);
        setGuessesLeft(0);
      } else {
        setGuessesLeft(newGuesses);
      }

      setGame(newGame);
      return { endType, turnEnded, gameOver: newGame.gameOver };
    },
    [game, currentClue, guessesLeft]
  );

  // ── End turn voluntarily ──────────────────────────────────────────
  const endTurn = useCallback(() => {
    if (!game || game.gameOver) return;
    setCurrentClue(null);
    setGuessesLeft(0);
    setGame((g) => {
      const next = g.currentTeam === "red" ? "blue" : "red";
      return {
        ...g,
        currentTeam: next,
        log: [
          ...g.log,
          { type: "turn", text: `${g.currentTeam.toUpperCase()} ends turn. Now ${next.toUpperCase()}'s turn.` },
        ],
      };
    });
  }, [game]);

  // ── Apply an AI-generated clue ────────────────────────────────────
  const applyAiClue = useCallback((clue) => {
    setCurrentClue({ word: clue.word, number: clue.number, team: clue.team });
    setGuessesLeft(clue.number === 0 ? 99 : clue.number + 1);
    setGame((g) => ({
      ...g,
      clueHistory: [...g.clueHistory, { word: clue.word, number: clue.number, team: clue.team }],
      log: [
        ...g.log,
        { type: "clue", team: g.currentTeam, text: `🤖 AI: ${clue.word} : ${clue.number}` },
        { type: "info", text: `💡 Targets: ${clue.matched.join(", ")}` },
      ],
    }));
  }, []);

  // ── Append an error to the log ────────────────────────────────────
  const logError = useCallback((text) => {
    setGame((g) => ({ ...g, log: [...g.log, { type: "error", text }] }));
  }, []);

  return {
    game,
    currentClue,
    guessesLeft,
    startGame,
    giveClue,
    revealCard,
    endTurn,
    applyAiClue,
    logError,
  };
}
