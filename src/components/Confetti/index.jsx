import { useMemo } from "react";

export default function Confetti({ color }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 2,
        size: 6 + Math.random() * 8,
        color: [
          color === "red" ? "#ef4444" : "#3b82f6",
          "#fbbf24",
          "#f472b6",
          "#34d399",
          "#a78bfa",
          color === "red" ? "#dc2626" : "#2563eb",
        ][i % 6],
        rotation: Math.random() * 360,
      })),
    [color]
  );

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999 }}>
      {pieces.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: "-10px",
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
            borderRadius: "2px",
            transform: `rotate(${p.rotation}deg)`,
            animation: `confettiFall ${p.duration}s ease-in ${p.delay}s both`,
          }}
        />
      ))}
    </div>
  );
}
