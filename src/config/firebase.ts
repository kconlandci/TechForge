// ============================================================
// TechForge — Firebase Configuration
// JS SDK with explicit browserLocalPersistence for WebView
// Wiring package (prepared 2026-10-16): structure follows the
// family Phase 1 config (Auth + Firestore with a persistent
// local cache, exported as `db`) — the `db` export is what the
// Batch 1 cloud sync service (src/services/sync.ts) consumes.
// The values below are TechForge's own, from its Firebase
// project "techforge-app-2ad24" (project number 116583005473;
// Firebase generated the id — bare "techforge-app" was
// unavailable). They are project-specific — not ThreatForge's
// or CloudForge's values.
// ============================================================

import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  browserLocalPersistence,
  type Auth,
} from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  type Firestore,
} from "firebase/firestore";

// IMPORTANT: These are client-side Firebase config values.
// They are NOT secrets — they identify the project to Firebase.
// Security is enforced by Firebase Security Rules, not by hiding these.
const firebaseConfig = {
  apiKey: "AIzaSyBD8jL3W9QPApYfuPnpPf6v4IlN-uzioNI",
  authDomain: "techforge-app-2ad24.firebaseapp.com",
  projectId: "techforge-app-2ad24",
  storageBucket: "techforge-app-2ad24.firebasestorage.app",
  messagingSenderId: "116583005473",
  appId: "1:116583005473:web:1b1b2a9914a45e6f9e1260",
};

const app = initializeApp(firebaseConfig);

// Use initializeAuth with explicit persistence instead of getAuth().
// getAuth() uses indexedDB by default, which can fail silently in
// Android WebView. browserLocalPersistence uses localStorage, which
// combined with our @capacitor/preferences UID backup, provides
// resilient auth persistence.
const auth: Auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
});

// Firestore with a persistent local cache: reads stay fast and writes
// queue automatically while offline, syncing when connectivity returns.
// Must be initialized here (before any other Firestore usage).
// Consumed by the Batch 1 sync service: users/{uid} progress doc +
// users/{uid}/events analytics subcollection (family Phase 1 shape).
const db: Firestore = initializeFirestore(app, {
  localCache: persistentLocalCache(),
});

export { app, auth, db };
