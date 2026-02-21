import { useState, useCallback } from "react";
import { playSound } from "../utils/audio";

export function useSound(initialEnabled = true) {
  const [soundEnabled, setSoundEnabled] = useState(initialEnabled);

  const sound = useCallback(
    (type) => {
      if (soundEnabled) playSound(type);
    },
    [soundEnabled]
  );

  return { soundEnabled, setSoundEnabled, sound };
}
