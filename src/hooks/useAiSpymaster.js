import { useState, useCallback } from "react";
import WORD_LINKS from "../constants/wordLinks";

// Simple everyday words kids age 6-10 know well — preferred as clues
const KID_FRIENDLY_CLUES = new Set([
  "ANIMAL","PET","ZOO","OCEAN","WING","NEST","BARK","CLAW","FRUIT","SWEET",
  "YELLOW","KITCHEN","BAKE","TREE","BEE","MUSIC","BAND","LOUD","RING",
  "SWIM","BOAT","DIVE","SAIL","NIGHT","SKY","SUN","CASTLE","FAIRY",
  "BASEBALL","TENNIS","GOLF","BOXING","BOWLING","SOCCER","FOREST","GARDEN",
  "ROCK","PIRATE","TREASURE","SHINY","SPEED","CLOTHES","SHOES","SHARP",
  "LOCK","FLAME","GLOW","BRIGHT","WINTER","MAGICAL","FANTASY","HALLOWEEN",
  "DOCTOR","SCARY","PLAYGROUND","TRAVEL","THROW","CATCH","WATER","GAME",
  "FOOTBALL","MORNING","BABY","DRINK","SHAPE","SICK","POWER","FISH","BEACH",
  "CIRCUS","STRONG","HIDE","TINY","BUBBLE","SPACE","PLAY","FAIR","STAR",
  // new simple words added for kids
  "HIGH","BIG","COLD","HOT","WET","RUN","JUMP","HOME","SLEEP","EAT","FUN",
  "DEEP","HARD","DARK","LONG","OLD","QUIET","SMALL","CLEAN","HAPPY","COLOR",
  "FRIEND","HELPER","SOFT","WAVE","SNOW","ICE","FIRE","MOON","WIND",
  // more kid-friendly nature and everyday words
  "MOUNTAIN","TALL","FLYING","GROUND","OUTDOOR","NATURE","BODY","SWIM",
  "FLYING","DESERT","ISLAND","JUNGLE","CAMP","MAGIC","KNIGHT","DRAGON",
  "SAILOR","CLOUD","RIVER","LAKE","FIELD","GRASS","FLOWER","BIRD","KING",
  "QUEEN","PRINCE","MAP","GOLD","SILVER","FAST","SLOW","UP","DOWN","UNDER",
  "INSECT","CHIRP","SPORT","BALL",
  "ORCHESTRA","BATON","SYMPHONY",
]);

export function useAiSpymaster() {
  const [aiLoading, setAiLoading] = useState(false);

  const generateClue = useCallback((game, onClueGiven, onError) => {
    if (!game || game.gameOver) return;
    setAiLoading(true);

    setTimeout(() => {
      const team        = game.currentTeam;
      const teamWords   = game.cards.filter((c) => c.type === team && !c.revealed).map((c) => c.word);
      const oppWords    = game.cards.filter((c) => c.type !== team && c.type !== "neutral" && c.type !== "assassin" && !c.revealed).map((c) => c.word);
      const neutralWords= game.cards.filter((c) => c.type === "neutral" && !c.revealed).map((c) => c.word);
      const assassinWord= game.cards.find((c) => c.type === "assassin" && !c.revealed)?.word;
      const boardWords  = new Set(game.cards.filter((c) => !c.revealed).map((c) => c.word.toUpperCase()));

      let best = null;
      let bestScore = -Infinity;

      for (const [clueWord, linkedWords] of Object.entries(WORD_LINKS)) {
        if (boardWords.has(clueWord.toUpperCase())) continue;

        // Skip if the clue and any board word are substrings of each other
        const clueUpper = clueWord.toUpperCase();
        let skip = false;
        for (const bw of boardWords) {
          if (clueUpper.includes(bw) || bw.includes(clueUpper)) { skip = true; break; }
        }
        if (skip) continue;

        const linkedSet  = new Set(linkedWords.map((w) => w.toUpperCase()));
        const matched    = teamWords.filter((w) => linkedSet.has(w.toUpperCase()));
        if (matched.length === 0) continue;

        // Never risk the assassin
        if (assassinWord && linkedSet.has(assassinWord.toUpperCase())) continue;

        const oppHits     = oppWords.filter((w)     => linkedSet.has(w.toUpperCase())).length;
        const neutralHits = neutralWords.filter((w) => linkedSet.has(w.toUpperCase())).length;
        const totalDanger = oppHits + neutralHits;

        // For single-word clues with any other board word also linking → confusing, skip
        if (matched.length === 1 && totalDanger > 0) continue;

        let score = matched.length === 1 ? 8 : matched.length === 2 ? 25 : 45;
        score -= oppHits * 15;
        score -= neutralHits * 8;
        if (totalDanger === 0) score += 5;
        // Prefer simple words kids know — strongly boost kid-friendly clues
        if (KID_FRIENDLY_CLUES.has(clueUpper)) score += 15;

        if (score > bestScore) {
          bestScore = score;
          const safeCount = Math.min(matched.length, 3);
          best = {
            word: clueWord,
            number: safeCount,
            matched: matched.slice(0, safeCount),
            team,
          };
        }
      }

      // Fallback clue so the game never stalls
      if (!best && teamWords.length > 0) {
        best = { word: "THINK", number: 1, matched: [teamWords[0]], team };
      }

      if (best) {
        onClueGiven(best);
      } else {
        onError("AI couldn't find a clue. Use manual.");
      }

      setAiLoading(false);
    }, 600 + Math.random() * 800);
  }, []);

  return { aiLoading, generateClue };
}
