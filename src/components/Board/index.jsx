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
        gap: "clamp(4px, 1.2vw, 8px)",
        marginBottom: "16px",
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
