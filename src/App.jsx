import { useState } from "react";
import { useGame }  from "./hooks/useGame";
import { useSound } from "./hooks/useSound";
import { appBackground, bgDecor } from "./styles/theme";

import MenuScreen  from "./screens/MenuScreen";
import RulesScreen from "./screens/RulesScreen";
import GameScreen  from "./screens/GameScreen";

export default function App() {
  const [screen,        setScreen]        = useState("menu");
  const [wordPack,      setWordPack]      = useState("classic");
  const [customWords,   setCustomWords]   = useState("");
  const [timerEnabled,  setTimerEnabled]  = useState(true);
  const [timerDuration, setTimerDuration] = useState(120);

  const { soundEnabled, setSoundEnabled, sound } = useSound();
  const {
    game, currentClue, guessesLeft,
    startGame, giveClue, revealCard, endTurn, applyAiClue, logError,
  } = useGame();

  function handleStart(pack, customWords) {
    const ok = startGame(pack, customWords);
    if (ok) {
      setScreen("game");
      sound("click");
    }
  }

  function handlePlayAgain() {
    handleStart(wordPack, customWords);
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
          onRules={() => setScreen("rules")}
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
          onGiveClue={giveClue}
          onRevealCard={revealCard}
          onEndTurn={endTurn}
          onApplyAiClue={applyAiClue}
          onLogError={logError}
          onPlayAgain={handlePlayAgain}
          onMenu={() => setScreen("menu")}
          sound={sound}
        />
      )}
    </div>
  );
}
