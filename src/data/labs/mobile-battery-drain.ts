import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "mobile-battery-drain",
  version: 1,
  title: "Diagnose Rapid Battery Drain on Android Phone",
  tier: "beginner",
  track: "mobile-devices",
  difficulty: "easy",
  accessLevel: "free",
  tags: ["android", "battery", "power-management", "troubleshooting", "mobile"],
  description:
    "A user reports their Android phone battery drains from 100% to 0% in under 4 hours. Walk through real diagnostic steps to identify the cause and apply the correct fix.",
  estimatedMinutes: 15,
  learningObjectives: [
    "Identify common causes of excessive battery drain on mobile devices",
    "Use Android battery usage statistics to pinpoint rogue processes",
    "Apply appropriate power management fixes without data loss",
    "Distinguish between software and hardware battery issues",
  ],
  sortOrder: 100,
  status: "published",
  prerequisites: [],
  rendererType: "action-rationale",
  scenarios: [
    {
      id: "bd-scenario-1",
      type: "action-rationale",
      title: "Initial Battery Assessment",
      context:
        "A user brings in their Samsung Galaxy S23 complaining the battery dies within 3-4 hours of normal use. The phone is 8 months old. You open Settings > Battery and see: Screen 12%, Android System 8%, Facebook 34%, Google Play Services 28%, Other 18%. The phone feels warm to the touch even when idle.",
      actions: [
        {
          id: "bd1-force-stop-facebook",
          label: "Force stop Facebook and Google Play Services",
          color: "blue",
        },
        {
          id: "bd1-factory-reset",
          label: "Perform a factory reset immediately",
          color: "red",
        },
        {
          id: "bd1-check-app-details",
          label: "Tap on Facebook and Google Play Services to check background activity and wake locks",
          color: "green",
        },
        {
          id: "bd1-replace-battery",
          label: "Recommend battery replacement",
          color: "orange",
        },
      ],
      correctActionId: "bd1-check-app-details",
      rationales: [
        {
          id: "bd1-r1",
          text: "Force stopping system services like Google Play Services can cause instability and notification failures. You need more information before taking action.",
        },
        {
          id: "bd1-r2",
          text: "Investigating background activity and wake locks for the top consumers reveals whether the apps are behaving abnormally or have a configuration issue, which guides the correct fix.",
        },
        {
          id: "bd1-r3",
          text: "A factory reset is a last resort that destroys user data. The battery stats already point to a software issue with specific apps.",
        },
        {
          id: "bd1-r4",
          text: "The phone is only 8 months old and the battery stats show heavy app usage, not a hardware degradation pattern. Replacing the battery would not fix a software drain.",
        },
      ],
      correctRationaleId: "bd1-r2",
      feedback: {
        perfect:
          "Correct. Checking background activity details reveals wake locks and background data usage, letting you pinpoint whether the app has a stuck sync loop or excessive background process.",
        partial:
          "Force stopping may provide temporary relief, but without understanding the root cause the problem will return after the next reboot.",
        wrong: "That action is too aggressive for this stage of diagnosis. Always gather more data before making irreversible changes.",
      },
    },
    {
      id: "bd-scenario-2",
      type: "action-rationale",
      title: "Identifying the Root Cause",
      context:
        "After checking app details, you find Facebook has been running a background video pre-fetch service consuming 2.1 GB of data in the last 24 hours. The 'Allow background data usage' toggle is ON, and 'Unrestricted battery usage' is enabled for Facebook. Google Play Services shows 847 wake locks in the last hour from a stuck account sync for a removed Google account.",
      actions: [
        {
          id: "bd2-disable-background-data",
          label: "Restrict Facebook background data and set battery optimization to 'Optimized', then remove the orphaned Google account sync",
          color: "green",
        },
        {
          id: "bd2-uninstall-facebook",
          label: "Uninstall Facebook entirely",
          color: "blue",
        },
        {
          id: "bd2-clear-all-data",
          label: "Clear data for all apps to reset everything",
          color: "red",
        },
        {
          id: "bd2-airplane-mode",
          label: "Tell the user to keep the phone in airplane mode when not in use",
          color: "orange",
        },
      ],
      correctActionId: "bd2-disable-background-data",
      rationales: [
        {
          id: "bd2-r1",
          text: "Restricting Facebook background data stops the video pre-fetch drain, and removing the orphaned account sync eliminates the Google Play Services wake locks. Both fixes are targeted and preserve user experience.",
        },
        {
          id: "bd2-r2",
          text: "Uninstalling Facebook removes the problem but is heavy-handed when a simple settings change fixes the issue while keeping the app functional.",
        },
        {
          id: "bd2-r3",
          text: "Clearing all app data destroys user configurations across every app and is completely disproportionate to the problem.",
        },
        {
          id: "bd2-r4",
          text: "Airplane mode is a workaround that disables core phone functionality rather than actually fixing the underlying issues.",
        },
      ],
      correctRationaleId: "bd2-r1",
      feedback: {
        perfect:
          "Excellent. You addressed both drain sources with targeted, non-destructive fixes. Restricting background data for Facebook and cleaning up the orphaned sync are the correct professional approach.",
        partial:
          "Uninstalling Facebook works but is unnecessary when the background data setting resolves the drain. Always prefer the least disruptive fix.",
        wrong: "That approach either destroys user data or works around the problem without fixing it.",
      },
    },
    {
      id: "bd-scenario-3",
      type: "action-rationale",
      title: "Verifying the Fix and Educating the User",
      context:
        "You applied the fixes and want to verify they worked. The user asks what they should monitor going forward. You check the battery stats 30 minutes later and see Facebook is now at 3% usage and Google Play Services dropped to 2%. The phone is no longer warm. The user mentions they install a lot of free apps from ads they see online.",
      actions: [
        {
          id: "bd3-install-battery-app",
          label: "Install a third-party battery optimizer app from the Play Store",
          color: "orange",
        },
        {
          id: "bd3-educate-monitoring",
          label: "Show the user how to check battery stats themselves, explain background data settings, and warn about free apps with aggressive background services",
          color: "green",
        },
        {
          id: "bd3-enable-power-saver",
          label: "Enable permanent power saver mode",
          color: "blue",
        },
        {
          id: "bd3-close-ticket",
          label: "Close the ticket since the numbers look good now",
          color: "red",
        },
      ],
      correctActionId: "bd3-educate-monitoring",
      rationales: [
        {
          id: "bd3-r1",
          text: "Third-party battery optimizer apps often make the problem worse by adding their own background services and wake locks. They are not recommended by professionals.",
        },
        {
          id: "bd3-r2",
          text: "Educating the user empowers them to identify future drain issues themselves, understand background data permissions, and be cautious about installing apps from ads that often include aggressive background services.",
        },
        {
          id: "bd3-r3",
          text: "Permanent power saver mode degrades the user experience by limiting performance and features. It is a band-aid, not a solution.",
        },
        {
          id: "bd3-r4",
          text: "Closing without education means the user will likely repeat the same behavior and create another ticket soon.",
        },
      ],
      correctRationaleId: "bd3-r2",
      feedback: {
        perfect:
          "Perfect. User education is a critical part of the fix. Teaching them to monitor battery stats and be cautious about free apps prevents future occurrences.",
        partial:
          "Power saver mode helps but penalizes the user permanently rather than addressing root causes.",
        wrong: "Third-party battery apps are well-known to cause more problems than they solve. Always use built-in Android tools.",
      },
    },
  ],
  hints: [
    "Check which apps are consuming the most battery in Settings > Battery before taking any action.",
    "Look for background data usage and wake lock counts to identify stuck processes or runaway syncs.",
    "Prefer targeted fixes like restricting background data over destructive actions like factory resets.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Battery drain is one of the most common mobile support tickets in help desk environments. Mastering battery diagnostics using built-in tools shows employers you can resolve issues efficiently without escalation.",
  toolRelevance: [
    "Android Battery Settings",
    "App Info / Background Restrictions",
    "Google Account Sync Manager",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
