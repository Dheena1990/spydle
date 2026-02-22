import { useState } from "react";
import { useGame }             from "./hooks/useGame";
import { useMultiplayerGame }  from "./hooks/useMultiplayerGame";
import { useSound }            from "./hooks/useSound";
import { appBackground, bgDecor } from "./styles/theme";

import MenuScreen  from "./screens/MenuScreen";
import LobbyScreen from "./screens/LobbyScreen";
import RulesScreen from "./screens/RulesScreen";
import GameScreen  from "./screens/GameScreen";

export default function App() {
  const [screen,        setScreen]        = useState("menu");
  const [wordPack,      setWordPack]      = useState("classic");
  const [customWords,   setCustomWords]   = useState("");
  const [timerEnabled,  setTimerEnabled]  = useState(true);
  const [timerDuration, setTimerDuration] = useState(120);

  // Which mode: "local" | "multiplayer"
  const [gameMode, setGameMode] = useState("local");

  const { soundEnabled, setSoundEnabled, sound } = useSound();

  // ── Local single-device game ──────────────────────────────────────────────
  const {
    game:        localGame,
    currentClue: localClue,
    guessesLeft: localGuesses,
    startGame,
    giveClue:    localGiveClue,
    revealCard:  localRevealCard,
    endTurn:     localEndTurn,
    applyAiClue: localApplyAiClue,
    logError:    localLogError,
  } = useGame();

  // ── Multiplayer Firebase game ─────────────────────────────────────────────
  const {
    game:             mpGame,
    currentClue:      mpClue,
    guessesLeft:      mpGuesses,
    role:             mpRole,
    connected:        mpConnected,
    error:            mpError,
    createAndJoin,
    joinExistingRoom,
    giveClue:         mpGiveClue,
    revealCard:       mpRevealCard,
    endTurn:          mpEndTurn,
    applyAiClue:      mpApplyAiClue,
    logError:         mpLogError,
    restartGame:      mpRestartGame,
  } = useMultiplayerGame();

  // ── Active game state ─────────────────────────────────────────────────────
  const isMultiplayer = gameMode === "multiplayer";
  const game        = isMultiplayer ? mpGame    : localGame;
  const currentClue = isMultiplayer ? mpClue    : localClue;
  const guessesLeft = isMultiplayer ? mpGuesses : localGuesses;
  const activeRole  = isMultiplayer ? mpRole    : "local";

  // ── Handlers: local ───────────────────────────────────────────────────────
  function handleStart(pack, cWords) {
    const ok = startGame(pack, cWords);
    if (ok) {
      setGameMode("local");
      setScreen("game");
      sound("click");
    }
  }

  function handlePlayAgain() {
    if (isMultiplayer) {
      mpRestartGame(wordPack, { wordPack, timerEnabled, timerDuration });
    } else {
      handleStart(wordPack, customWords);
    }
  }

  // ── Handlers: multiplayer ─────────────────────────────────────────────────
  async function handleEnterGame(roomCode, role, pack, meta, isHost) {
    setGameMode("multiplayer");
    if (isHost) {
      await createAndJoin(roomCode, pack, { ...meta, role });
    } else {
      joinExistingRoom(roomCode, role);
    }
    setScreen("game");
  }

  return (
    <div style={appBackground}>
      <div style={bgDecor} />

      {screen === "menu" && (
        <MenuScreen
          wordPack={wordPack}
          setWordPack={setWordPack}
          timerEnabled={timerEnabled}
          setTimerEnabled={setTimerEnabled}
          timerDuration={timerDuration}
          setTimerDuration={setTimerDuration}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          customWords={customWords}
          setCustomWords={setCustomWords}
          onStart={handleStart}
          onMultiplayer={() => setScreen("lobby")}
          onRules={() => setScreen("rules")}
          sound={sound}
        />
      )}

      {screen === "lobby" && (
        <LobbyScreen
          timerEnabled={timerEnabled}
          timerDuration={timerDuration}
          onEnterGame={handleEnterGame}
          onBack={() => setScreen("menu")}
          sound={sound}
        />
      )}

      {screen === "rules" && (
        <RulesScreen onBack={() => setScreen("menu")} />
      )}

      {screen === "game" && (
        <GameScreen
          game={game}
          currentClue={currentClue}
          guessesLeft={guessesLeft}
          timerEnabled={timerEnabled}
          timerDuration={timerDuration}
          role={activeRole}
          isMultiplayer={isMultiplayer}
          mpConnected={mpConnected}
          mpError={mpError}
          onGiveClue={isMultiplayer ? mpGiveClue      : localGiveClue}
          onRevealCard={isMultiplayer ? mpRevealCard   : localRevealCard}
          onEndTurn={isMultiplayer ? mpEndTurn         : localEndTurn}
          onApplyAiClue={isMultiplayer ? mpApplyAiClue : localApplyAiClue}
          onLogError={isMultiplayer ? mpLogError       : localLogError}
          onPlayAgain={handlePlayAgain}
          onMenu={() => setScreen("menu")}
          sound={sound}
        />
      )}
    </div>
  );
}
