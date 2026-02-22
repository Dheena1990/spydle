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
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL:       import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const db  = getDatabase(app);
