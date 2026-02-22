export const teamColor = (t) => (t === "red" ? "#ef4444" : "#3b82f6");
export const teamBg    = (t) => (t === "red" ? "rgba(239,68,68,0.12)" : "rgba(59,130,246,0.12)");
export const teamBorder= (t) => (t === "red" ? "rgba(239,68,68,0.3)"  : "rgba(59,130,246,0.3)");

export const appBackground = {
  minHeight: "100dvh",
  background: "linear-gradient(135deg, #0f0f23 0%, #1a1a3e 30%, #0d1b2a 60%, #1b0f1f 100%)",
  color: "#e2e8f0",
  fontFamily: "'Outfit', 'Segoe UI', sans-serif",
  position: "relative",
  overflowX: "hidden",
};

export const bgDecor = {
  position: "fixed",
  inset: 0,
  pointerEvents: "none",
  zIndex: 0,
  background: `
    radial-gradient(circle at 15% 20%, rgba(239,68,68,0.06) 0%, transparent 50%),
    radial-gradient(circle at 85% 80%, rgba(59,130,246,0.06) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(168,85,247,0.04) 0%, transparent 60%)
  `,
};
