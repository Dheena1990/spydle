// ─────────────────────────────────────────────────────────────────────────────
// Firebase configuration for Spydle multiplayer
//
// HOW TO SET UP (one-time, free):
//  1. Go to https://console.firebase.google.com
//  2. Click "Add project" → name it "spydle-game" → Continue
//  3. Disable Google Analytics (optional) → Create project
//  4. Click the </> (Web) icon to add a web app → name it "spydle" → Register
//  5. Copy the firebaseConfig object values below
//  6. In left sidebar → Build → Realtime Database → Create Database
//     → Choose a location → Start in TEST MODE → Enable
//  7. Copy the databaseURL from the Realtime Database dashboard
//     (looks like: https://spydle-game-default-rtdb.firebaseio.com/)
//
// Then replace the placeholder values below with your real values.
// ─────────────────────────────────────────────────────────────────────────────

import { initializeApp } from "firebase/app";
import { getDatabase }   from "firebase/database";

const firebaseConfig = {
  apiKey:            "AIzaSyDyxu4dF9u2JOWR_Rgw5pLrWo53PdsYoec",
  authDomain:        "spydle-game.firebaseapp.com",
  databaseURL:       "https://spydle-game-default-rtdb.firebaseio.com",
  projectId:         "spydle-game",
  storageBucket:     "spydle-game.firebasestorage.app",
  messagingSenderId: "128846250766",
  appId:             "1:128846250766:web:a186ccaab3b6b4d4f50d5f",
};

export const app = initializeApp(firebaseConfig);
export const db  = getDatabase(app);
