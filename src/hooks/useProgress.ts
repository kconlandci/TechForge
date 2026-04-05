// ============================================================
// TechForge — Progress Persistence Hook
// ============================================================

import { useState, useCallback, useEffect } from "react";
import { App as CapApp } from "@capacitor/app";

interface ScenarioResult {
  scenarioIndex: number;
  grade: "perfect" | "partial" | "wrong";
}

interface LabProgress {
  labId: string;
  completed: boolean;
  bestScore: number;
  attempts: number;
  lastAttemptDate: string;
  completedAt: number;
  scenarioResults: ScenarioResult[];
}

interface TechForgeProgress {
  schemaVersion: number;
  userId: string | null;
  labs: Record<string, LabProgress>;
  xp: number;
  xpHistory: Array<{ date: string; amount: number; labId: string }>;
  streakDays: number;
  longestStreak: number;
  lastLabDate: string | null;
  judgmentTags: string[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "techforge_progress";
const CURRENT_SCHEMA_VERSION = 2;

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function createDefaultProgress(): TechForgeProgress {
  const now = new Date().toISOString();
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    userId: null,
    labs: {},
    xp: 0,
    xpHistory: [],
    streakDays: 0,
    longestStreak: 0,
    lastLabDate: null,
    judgmentTags: [],
    createdAt: now,
    updatedAt: now,
  };
}

function migrateProgress(data: Record<string, unknown>): TechForgeProgress {
  const version = (data.schemaVersion as number) || 0;
  if (version < 1) {
    const labs = (data.labs || {}) as Record<string, Record<string, unknown>>;
    for (const labId of Object.keys(labs)) {
      if (labs[labId] && typeof labs[labId].completedAt !== "number") {
        labs[labId].completedAt = 0;
      }
    }
    data.schemaVersion = 1;
  }
  if (version < 2) {
    if (!data.userId) {
      data.userId = null;
    }
    data.schemaVersion = 2;
  }
  return data as unknown as TechForgeProgress;
}

function isValidProgress(data: unknown): data is TechForgeProgress {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;
  if (typeof d.labs !== "object" || d.labs === null) return false;
  if (typeof d.xp !== "number" || d.xp < 0) return false;
  if (typeof d.streakDays !== "number" || d.streakDays < 0) return false;
  if (!Array.isArray(d.xpHistory)) return false;
  return true;
}

function loadProgress(): TechForgeProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!isValidProgress(parsed)) {
        console.warn("[TechForge] Stored progress data is invalid — resetting.");
        return createDefaultProgress();
      }
      const record = parsed as unknown as Record<string, unknown>;
      const originalVersion = (record.schemaVersion as number) || 0;
      const migrated = migrateProgress(record);
      if (originalVersion < CURRENT_SCHEMA_VERSION) {
        saveProgress(migrated);
      }
      return migrated;
    }
  } catch {
    // corrupted data — reset
  }
  return createDefaultProgress();
}

function saveProgress(progress: TechForgeProgress) {
  progress.updatedAt = new Date().toISOString();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error("[TechForge] Failed to save progress:", error);
    try {
      const minimal = { ...progress, xpHistory: progress.xpHistory.slice(-50) };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(minimal));
    } catch {
      console.error("[TechForge] Even minimal save failed. Progress may be lost.");
    }
  }
}

export function useProgress(userId?: string | null) {
  const [progress, setProgress] = useState<TechForgeProgress>(loadProgress);

  useEffect(() => {
    const listener = CapApp.addListener("pause", () => {
      const current = loadProgress();
      saveProgress(current);
    });
    return () => { listener.then((l) => l.remove()); };
  }, []);

  const recordLabCompletion = useCallback(
    (labId: string, score: number, scenarioResults: ScenarioResult[]) => {
      setProgress((prev) => {
        const next = { ...prev, labs: { ...prev.labs } };
        const today = getToday();
        if (userId && !next.userId) { next.userId = userId; }
        const existing = next.labs[labId];
        next.labs[labId] = {
          labId,
          completed: true,
          bestScore: existing ? Math.max(existing.bestScore, score) : score,
          attempts: existing ? existing.attempts + 1 : 1,
          lastAttemptDate: today,
          completedAt: Date.now(),
          scenarioResults,
        };
        const xpGain = 100 + Math.min(Math.round(score / 2), 50);
        next.xp = (next.xp || 0) + xpGain;
        next.xpHistory = [...(next.xpHistory || []), { date: today, amount: xpGain, labId }];
        if (next.lastLabDate === today) {
          // Already counted today
        } else if (next.lastLabDate === getYesterday()) {
          next.streakDays = (next.streakDays || 0) + 1;
        } else {
          next.streakDays = 1;
        }
        next.lastLabDate = today;
        next.longestStreak = Math.max(next.longestStreak || 0, next.streakDays || 0);
        saveProgress(next);
        return next;
      });
    },
    [userId]
  );

  const getLabProgress = useCallback((labId: string): LabProgress | undefined => {
    return progress.labs[labId];
  }, [progress]);

  const isLabCompleted = useCallback((labId: string): boolean => {
    return progress.labs[labId]?.completed ?? false;
  }, [progress]);

  const getTotalCompleted = useCallback((): number => {
    return Object.values(progress.labs).filter((l) => l.completed).length;
  }, [progress]);

  const resetProgress = useCallback(() => {
    const fresh = createDefaultProgress();
    saveProgress(fresh);
    setProgress(fresh);
  }, []);

  return { progress, recordLabCompletion, getLabProgress, isLabCompleted, getTotalCompleted, resetProgress };
}

export type { TechForgeProgress, LabProgress, ScenarioResult };
