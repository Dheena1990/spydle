import WORD_PACKS from "../constants/wordPacks";

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateBoard(wordPack) {
  const words = shuffle(WORD_PACKS[wordPack].words).slice(0, 25);
  const firstTeam = Math.random() < 0.5 ? "red" : "blue";
  const secondTeam = firstTeam === "red" ? "blue" : "red";

  let types = [
    ...Array(9).fill(firstTeam),
    ...Array(8).fill(secondTeam),
    ...Array(7).fill("neutral"),
    "assassin",
  ];
  types = shuffle(types);

  return {
    cards: words.map((word, i) => ({
      word,
      type: types[i],
      revealed: false,
      id: i,
    })),
    firstTeam,
    currentTeam: firstTeam,
    redRemaining: types.filter((t) => t === "red").length,
    blueRemaining: types.filter((t) => t === "blue").length,
    gameOver: false,
    winner: null,
    log: [],
    clueHistory: [],
  };
}
