import Card from "./Card";

export default function Board({
  cards,
  isSpymaster,
  currentClue,
  currentTeam,
  gameOver,
  revealAnimation,
  onCardClick,
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: "clamp(3px, 0.8vw, 8px)",
        marginBottom: "0",
      }}
    >
      {cards.map((card) => {
        const isClickable =
          !card.revealed && !isSpymaster && !gameOver && !!currentClue;

        return (
          <Card
            key={card.id}
            card={card}
            isSpymaster={isSpymaster}
            isClickable={isClickable}
            currentTeam={currentTeam}
            isAnimating={revealAnimation === card.id}
            onClick={() => isClickable && onCardClick(card.id)}
          />
        );
      })}
    </div>
  );
}
