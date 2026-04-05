import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "mobile-app-crashes",
  version: 1,
  title: "Resolve Persistent App Crashes on Older Device",
  tier: "beginner",
  track: "mobile-devices",
  difficulty: "easy",
  accessLevel: "free",
  tags: ["app-crashes", "troubleshooting", "android", "ios", "memory-management"],
  description:
    "Apps keep force-closing on an older tablet. Triage the evidence, classify the root cause, and apply the correct remediation to restore stable operation.",
  estimatedMinutes: 15,
  learningObjectives: [
    "Analyze crash patterns to classify root causes for app instability",
    "Distinguish between memory pressure, storage exhaustion, and app compatibility issues",
    "Apply appropriate remediation steps for each type of crash cause",
    "Prioritize least-disruptive fixes for older devices with limited resources",
  ],
  sortOrder: 103,
  status: "published",
  prerequisites: [],
  rendererType: "triage-remediate",
  scenarios: [
    {
      id: "ac-scenario-1",
      type: "triage-remediate",
      title: "System-Wide App Crashes",
      description:
        "An iPad Air 2 (2014) running iPadOS 15.8 crashes almost every app within 2-3 minutes of opening. Safari, Mail, and even Settings crash intermittently. The user has had the tablet for years and never experienced this before last week.",
      evidence: [
        {
          type: "diagnostic",
          content:
            "Storage: 61.2 GB used of 64 GB (95.6% full). Largest consumers: Photos 28 GB, Messages 14 GB, Safari cache 8 GB, System 6 GB, Other 5.2 GB. Available RAM at idle: 87 MB of 2 GB. Last reboot: 47 days ago.",
        },
        {
          type: "log",
          content:
            "Crash logs show 'Jetsam' events terminating apps due to memory pressure. The kernel memory compressor is running at 98% utilization. Safari has 23 open tabs in the background.",
        },
      ],
      classifications: [
        {
          id: "ac1-class-memory",
          label: "Memory pressure from long uptime and background processes",
          description:
            "The device has not been rebooted in 47 days, causing memory fragmentation and leaked resources. Combined with Safari's 23 background tabs and low available RAM, apps are being terminated by the Jetsam memory manager.",
        },
        {
          id: "ac1-class-storage",
          label: "Storage exhaustion preventing swap and temp files",
          description:
            "With only 4.5% storage free, the system cannot create temporary files or use storage-backed virtual memory, amplifying the RAM shortage.",
        },
        {
          id: "ac1-class-hardware",
          label: "Hardware failure due to device age",
          description:
            "The device is old and the memory chips may be failing.",
        },
      ],
      correctClassificationId: "ac1-class-memory",
      remediations: [
        {
          id: "ac1-rem-reboot-clear",
          label: "Reboot the device, close Safari background tabs, and clear Safari cache to free both RAM and storage",
          description: "Rebooting clears accumulated memory fragmentation from 47 days of uptime, while closing tabs and clearing cache directly addresses the two largest consumers of constrained resources.",
        },
        {
          id: "ac1-rem-factory-reset",
          label: "Factory reset the device to start fresh",
          description: "A full factory reset erases all data and settings to return the device to its original state, which is a disproportionate response when simpler steps can resolve the issue.",
        },
        {
          id: "ac1-rem-buy-new",
          label: "Recommend purchasing a new iPad since this one is too old",
          description: "Replacing the hardware assumes the device itself is the problem, ignoring the software-level memory management issues indicated by the crash logs.",
        },
      ],
      correctRemediationId: "ac1-rem-reboot-clear",
      rationales: [
        {
          id: "ac1-r1",
          text: "The Jetsam crash logs directly indicate memory pressure. A 47-day uptime allows memory fragmentation and leaked resources to accumulate. Rebooting clears RAM state, closing Safari tabs frees held memory, and clearing the 8 GB cache improves storage pressure as well.",
        },
        {
          id: "ac1-r2",
          text: "A factory reset would fix the problem but destroys all user data and is disproportionate when a reboot and cache clear will resolve the immediate issue.",
        },
        {
          id: "ac1-r3",
          text: "The device age is not the primary factor here. The crash logs point to software-level memory management, not hardware failure.",
        },
      ],
      correctRationaleId: "ac1-r1",
      feedback: {
        perfect:
          "Correct. The Jetsam logs, 47-day uptime, and 23 background Safari tabs all point to memory pressure. A reboot combined with clearing background tabs and cache resolves both RAM and storage pressure.",
        partial:
          "You identified a contributing factor but the primary issue is memory pressure from long uptime, which is addressed first by rebooting.",
        wrong: "The crash logs clearly show software-level memory management issues, not hardware failure.",
      },
    },
    {
      id: "ac-scenario-2",
      type: "triage-remediate",
      title: "Single App Crash Pattern",
      description:
        "A Samsung Galaxy Tab A7 (Android 13) user reports that only the Microsoft Teams app crashes immediately on launch. All other apps including Chrome, Gmail, YouTube, and the Phone app work fine. Teams was working yesterday.",
      evidence: [
        {
          type: "diagnostic",
          content:
            "Storage: 22 GB used of 32 GB (68% full). RAM: 1.8 GB free of 3 GB. Teams app version: 1449/1.0.0.2023185002. Last Teams update: installed overnight via auto-update. Android System WebView: version 119.0.6045.134 (last updated 2 months ago).",
        },
        {
          type: "log",
          content:
            "Logcat shows Teams crashing with: 'java.lang.NoClassDefFoundError: Failed resolution of: Landroidx/webkit/WebViewClient'. Error occurs within 200ms of launch. No other app generates similar errors.",
        },
      ],
      classifications: [
        {
          id: "ac2-class-webview",
          label: "Outdated Android System WebView incompatible with new Teams version",
          description:
            "The overnight Teams update requires a newer WebView API than what is currently installed. The crash trace shows a missing WebView class definition.",
        },
        {
          id: "ac2-class-corrupt",
          label: "Corrupted Teams installation from failed auto-update",
          description:
            "The auto-update may have been interrupted or corrupted during installation.",
        },
        {
          id: "ac2-class-permissions",
          label: "Teams lost its runtime permissions after the update",
          description:
            "Android sometimes revokes permissions during app updates, preventing the app from launching.",
        },
      ],
      correctClassificationId: "ac2-class-webview",
      remediations: [
        {
          id: "ac2-rem-update-webview",
          label: "Update Android System WebView and Google Chrome from the Play Store, then relaunch Teams",
          description: "Updating the system WebView component provides the missing API classes that the new Teams version depends on, resolving the NoClassDefFoundError without any data loss.",
        },
        {
          id: "ac2-rem-reinstall-teams",
          label: "Uninstall and reinstall Teams",
          description: "Reinstalling Teams re-downloads the same version that still requires the newer WebView APIs, so the crash would persist after reinstallation.",
        },
        {
          id: "ac2-rem-rollback-teams",
          label: "Roll back Teams to the previous version using an APK",
          description: "Sideloading an older APK bypasses Play Store security checks and only temporarily avoids the problem until the next forced update.",
        },
      ],
      correctRemediationId: "ac2-rem-update-webview",
      rationales: [
        {
          id: "ac2-r1",
          text: "The crash trace explicitly shows a missing WebView class (NoClassDefFoundError for WebViewClient). The WebView is 2 months out of date while Teams was just updated. Updating WebView provides the required APIs without any data loss or manual APK management.",
        },
        {
          id: "ac2-r2",
          text: "Reinstalling Teams would not fix the issue because the new version still requires the newer WebView APIs. The same crash would occur after reinstallation.",
        },
        {
          id: "ac2-r3",
          text: "Rolling back Teams via APK introduces security risks and is only a temporary workaround. The correct fix is updating the system component that the new version depends on.",
        },
      ],
      correctRationaleId: "ac2-r1",
      feedback: {
        perfect:
          "Excellent. The crash trace directly identifies the missing WebView class. Updating Android System WebView provides the required dependency for the new Teams version.",
        partial:
          "Reinstalling Teams wouldn't help because the underlying dependency (WebView) is still outdated. The crash would recur.",
        wrong: "The crash log provides a specific technical cause. Read the error message carefully to identify the missing component.",
      },
    },
    {
      id: "ac-scenario-3",
      type: "triage-remediate",
      title: "Crashes After OS Update",
      description:
        "A user updated their Pixel 6a from Android 13 to Android 14 yesterday. Now multiple third-party apps (banking app, fitness tracker, and a note-taking app) crash on launch. System apps and Google apps all work fine.",
      evidence: [
        {
          type: "diagnostic",
          content:
            "All crashing apps were last updated 2-4 months ago. The banking app requires Android 10+, the fitness tracker requires Android 11+, and the note-taking app requires Android 12+. Storage and RAM are both healthy. The device partition cache was not cleared during the update.",
        },
        {
          type: "log",
          content:
            "Crash logs show different errors for each app: banking app has a deprecated API call, fitness tracker fails on a changed permission model, note-taking app crashes on file path access. All three apps have pending updates available in the Play Store.",
        },
      ],
      classifications: [
        {
          id: "ac3-class-stale-cache",
          label: "Stale Dalvik/ART cache from the OS upgrade combined with outdated app versions",
          description:
            "The OS upgrade changed runtime APIs and permissions, but the app bytecode cache and the apps themselves have not been updated to match Android 14 requirements.",
        },
        {
          id: "ac3-class-os-bug",
          label: "Android 14 bug causing app incompatibility",
          description:
            "The new OS version has bugs that break existing apps.",
        },
        {
          id: "ac3-class-downgrade",
          label: "The OS update corrupted the app data",
          description:
            "The upgrade process damaged the installed applications.",
        },
      ],
      correctClassificationId: "ac3-class-stale-cache",
      remediations: [
        {
          id: "ac3-rem-clear-update",
          label: "Clear the device partition cache via recovery mode, then update all apps from the Play Store",
          description: "Clearing the partition cache forces recompilation of app bytecode against Android 14 APIs, while updating apps pulls in compatibility patches released by developers.",
        },
        {
          id: "ac3-rem-downgrade-os",
          label: "Downgrade back to Android 13",
          description: "Reverting the OS avoids the compatibility issue rather than solving it, and the process risks data loss and removes security patches.",
        },
        {
          id: "ac3-rem-uninstall-all",
          label: "Uninstall all crashing apps and reinstall from scratch",
          description: "Removing and reinstalling apps destroys local app data unnecessarily when a cache clear and update would achieve the same compatibility fix.",
        },
      ],
      correctRemediationId: "ac3-rem-clear-update",
      rationales: [
        {
          id: "ac3-r1",
          text: "After a major OS update, the compiled app cache (ART profiles) can be stale. Clearing the partition cache forces recompilation against the new Android 14 APIs. Updating the apps ensures they include Android 14 compatibility patches. This two-step approach addresses both the cache and the app-level compatibility.",
        },
        {
          id: "ac3-r2",
          text: "Downgrading the OS is complex, risks data loss, and avoids rather than solves the compatibility issue. The apps have updates available that address Android 14.",
        },
        {
          id: "ac3-r3",
          text: "Uninstalling and reinstalling loses app data. Clearing the cache and updating achieves the same result without data loss.",
        },
      ],
      correctRationaleId: "ac3-r1",
      feedback: {
        perfect:
          "Correct. Clearing the partition cache after a major OS update forces app recompilation, and updating apps provides Android 14 compatibility patches. Both steps together resolve the crashes.",
        partial:
          "Reinstalling works but destroys app data unnecessarily when a cache clear plus update achieves the same result.",
        wrong: "The apps have updates available for Android 14 compatibility. The issue is solvable without drastic measures.",
      },
    },
  ],
  hints: [
    "Check the crash logs for specific error messages. They often tell you exactly which component or API is failing.",
    "When only specific apps crash, look at what changed recently: app updates, OS updates, or system component versions.",
    "After an OS update, stale compiled code caches and outdated app versions are the most common cause of crashes.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "App crash troubleshooting requires reading error logs and understanding the relationship between OS versions, app versions, and system components like WebView. This diagnostic skill is highly valued in mobile support roles.",
  toolRelevance: [
    "Android Logcat",
    "iOS Analytics / Crash Logs",
    "App Info / Storage / Cache",
    "Play Store / App Store Update Manager",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
