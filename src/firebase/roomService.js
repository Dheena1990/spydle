import { db } from "./config";
import {
  ref,
  set,
  update,
  push,
  onValue,
  get,
  remove,
} from "firebase/database";

// ── Generate a random 4-digit room code ───────────────────────────────────
export function generateRoomCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

// ── Check if a room exists ─────────────────────────────────────────────────
export async function roomExists(roomCode) {
  const snap = await get(ref(db, `rooms/${roomCode}/meta`));
  return snap.exists();
}

// ── Create a new room with initial game state ──────────────────────────────
export async function createRoom(roomCode, gameState, meta) {
  const logArray = gameState.log || [];

  await set(ref(db, `rooms/${roomCode}`), {
    meta,
    game: {
      cards:         gameState.cards,
      currentTeam:   gameState.currentTeam,
      firstTeam:     gameState.firstTeam,
      redRemaining:  gameState.redRemaining,
      blueRemaining: gameState.blueRemaining,
      gameOver:      gameState.gameOver,
      winner:        gameState.winner ?? null,
      clueHistory:   [],
    },
    clue:       null,
    guessesLeft: 0,
    log:        logArray,
  });
}

// ── Subscribe to an entire room ─────────────────────────────────────────────
// Returns an unsubscribe function.
export function joinRoom(roomCode, callback) {
  const roomRef = ref(db, `rooms/${roomCode}`);
  const unsub = onValue(roomRef, (snap) => {
    if (snap.exists()) {
      callback(snap.val());
    } else {
      callback(null);
    }
  });
  return unsub;
}

// ── Patch game object ───────────────────────────────────────────────────────
export async function updateGame(roomCode, patch) {
  const updates = {};
  for (const [k, v] of Object.entries(patch)) {
    updates[`rooms/${roomCode}/game/${k}`] = v;
  }
  await update(ref(db), updates);
}

// ── Set current clue (null to clear) ───────────────────────────────────────
export async function setClue(roomCode, clue) {
  await set(ref(db, `rooms/${roomCode}/clue`), clue);
}

// ── Set guesses left ────────────────────────────────────────────────────────
export async function setGuessesLeft(roomCode, n) {
  await set(ref(db, `rooms/${roomCode}/guessesLeft`), n);
}

// ── Append a log entry ──────────────────────────────────────────────────────
export async function appendLog(roomCode, entry) {
  await push(ref(db, `rooms/${roomCode}/log`), entry);
}

// ── Replace full log (for restart) ─────────────────────────────────────────
export async function resetLog(roomCode) {
  await remove(ref(db, `rooms/${roomCode}/log`));
}
