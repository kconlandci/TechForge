// ============================================================
// TechForge — Auth Context
// Firebase Anonymous Auth with UID persistence via Capacitor Preferences
// ============================================================

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { Preferences } from "@capacitor/preferences";
import { auth } from "../config/firebase";

interface AuthContextType {
  uid: string | null;
  isAuthReady: boolean;
}

const AuthContext = createContext<AuthContextType>({
  uid: null,
  isAuthReady: false,
});

const UID_STORAGE_KEY = "techforge_firebase_uid";

async function getStoredUid(): Promise<string | null> {
  const { value } = await Preferences.get({ key: UID_STORAGE_KEY });
  return value;
}

async function storeUid(uid: string): Promise<void> {
  await Preferences.set({ key: UID_STORAGE_KEY, value: uid });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [uid, setUid] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const currentUid = user.uid;
          setUid(currentUid);

          try {
            const storedUid = await getStoredUid();
            if (storedUid && storedUid !== currentUid) {
              console.warn(
                `[TechForge] UID changed: stored=${storedUid}, current=${currentUid}. ` +
                  `User may have lost progress. Previous purchases may need restoration.`
              );
            }
            await storeUid(currentUid);
          } catch (storageErr) {
            console.warn("[TechForge] UID storage failed:", storageErr);
          }
        } else {
          try {
            await signInAnonymously(auth);
            return;
          } catch (error) {
            console.error("[TechForge] Anonymous sign-in failed:", error);
            setUid(null);
          }
        }
      } finally {
        clearTimeout(timeoutId);
        setIsAuthReady(true);
      }
    });

    // Safety timeout: if auth never resolves, unblock the app after 10 seconds
    timeoutId = setTimeout(() => {
      setIsAuthReady((ready) => {
        if (!ready) {
          console.warn("[TechForge] Auth initialization timed out — proceeding without auth.");
        }
        return true;
      });
    }, 10_000);

    return () => {
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ uid, isAuthReady }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}
