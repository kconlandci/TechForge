// ============================================================
// TechForge — Firebase Configuration
// JS SDK with explicit browserLocalPersistence for WebView
// ============================================================

import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  browserLocalPersistence,
  type Auth,
} from "firebase/auth";

// IMPORTANT: These are client-side Firebase config values.
// They are NOT secrets — they identify the project to Firebase.
// Security is enforced by Firebase Security Rules, not by hiding these.
const firebaseConfig = {
  apiKey: "REPLACE_WITH_YOUR_FIREBASE_API_KEY",
  authDomain: "techforge-app.firebaseapp.com",
  projectId: "techforge-app",
  storageBucket: "techforge-app.firebasestorage.app",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:0000000000000000",
};

const app = initializeApp(firebaseConfig);

const auth: Auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
});

export { app, auth };
