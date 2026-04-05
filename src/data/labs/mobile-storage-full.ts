import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "mobile-storage-full",
  version: 1,
  title: "Recover Space on a Full Mobile Device",
  tier: "beginner",
  track: "mobile-devices",
  difficulty: "easy",
  accessLevel: "free",
  tags: ["storage", "disk-space", "data-management", "troubleshooting", "mobile"],
  description:
    "A user's device storage is completely full, preventing new photos, app installs, and even OS updates. Identify the largest consumers and choose the right approach to reclaim space.",
  estimatedMinutes: 12,
  learningObjectives: [
    "Analyze storage usage to identify the largest space consumers",
    "Distinguish between user data, app caches, and system storage",
    "Apply targeted cleanup strategies that preserve important user data",
    "Recommend long-term storage management practices",
  ],
  sortOrder: 104,
  status: "published",
  prerequisites: [],
  rendererType: "action-rationale",
  scenarios: [
    {
      id: "sf-scenario-1",
      type: "action-rationale",
      title: "Analyzing Storage Breakdown",
      context:
        "A user's 64 GB iPhone 12 shows 'Storage Almost Full' and cannot take photos or install updates. Storage breakdown: Apps 22 GB, Photos 18 GB, Messages 11 GB, System Data 8 GB, iOS 5 GB. The user says they cannot delete any photos because they are 'all important.' They do not use iCloud Photos.",
      actions: [
        {
          id: "sf1-delete-apps",
          label: "Delete the largest apps to free space immediately",
          color: "orange",
        },
        {
          id: "sf1-enable-icloud",
          label: "Enable iCloud Photos with 'Optimize iPhone Storage' to offload full-resolution photos to the cloud while keeping thumbnails on device",
          color: "green",
        },
        {
          id: "sf1-delete-messages",
          label: "Delete all messages to free 11 GB",
          color: "blue",
        },
        {
          id: "sf1-factory-reset",
          label: "Factory reset and selectively restore",
          color: "red",
        },
      ],
      correctActionId: "sf1-enable-icloud",
      rationales: [
        {
          id: "sf1-r1",
          text: "iCloud Photos with 'Optimize iPhone Storage' keeps small thumbnails on device while storing full-resolution originals in the cloud. This can reclaim most of the 18 GB photo storage without the user losing access to any photos. It is the least disruptive option for the largest space consumer.",
        },
        {
          id: "sf1-r2",
          text: "Deleting apps removes functionality the user relies on. Photos are the second-largest consumer and can be offloaded without deletion.",
        },
        {
          id: "sf1-r3",
          text: "Deleting all messages loses potentially important conversations. It should be a secondary step, not the first action.",
        },
        {
          id: "sf1-r4",
          text: "A factory reset is nuclear for a storage management issue. Targeted cleanup is always preferred.",
        },
      ],
      correctRationaleId: "sf1-r1",
      feedback: {
        perfect:
          "Correct. iCloud Photos optimization is the ideal solution for a user who cannot delete photos. It offloads the largest consumer while preserving access to everything.",
        partial:
          "Deleting messages helps but ignores the larger 18 GB photo problem that the user wants to keep.",
        wrong: "A less destructive approach exists that addresses the largest storage consumer.",
      },
    },
    {
      id: "sf-scenario-2",
      type: "action-rationale",
      title: "Clearing Hidden Storage Consumers",
      context:
        "After enabling iCloud Photos, you reclaimed 14 GB. But the user asks about the 8 GB 'System Data' category, which seems high. You investigate and find: Safari cache 2.1 GB, Mail attachments and downloaded content 1.8 GB, app caches across 40 apps totaling 3.2 GB, and iOS logs/diagnostics 0.9 GB. The user asks if they should install a 'cleaner' app from the App Store.",
      actions: [
        {
          id: "sf2-install-cleaner",
          label: "Install a third-party cleaner app to automate cache clearing",
          color: "red",
        },
        {
          id: "sf2-clear-safari-offload",
          label: "Clear Safari data, offload unused apps (preserving their data), and set Messages to auto-delete after 1 year",
          color: "green",
        },
        {
          id: "sf2-delete-mail",
          label: "Delete the Mail app to reclaim its cached attachments",
          color: "orange",
        },
        {
          id: "sf2-ignore-system",
          label: "Tell the user System Data is normal and cannot be reduced",
          color: "blue",
        },
      ],
      correctActionId: "sf2-clear-safari-offload",
      rationales: [
        {
          id: "sf2-r1",
          text: "Clearing Safari data reclaims 2.1 GB, offloading unused apps removes their binaries while preserving data for future reinstall, and auto-deleting old messages prevents the 11 GB from growing back. This is a comprehensive, non-destructive cleanup approach.",
        },
        {
          id: "sf2-r2",
          text: "Third-party cleaner apps on iOS have very limited access and often consume more storage than they free. They cannot access the caches that iOS manages internally.",
        },
        {
          id: "sf2-r3",
          text: "Deleting the Mail app removes functionality. Simply clearing its downloaded attachments through Settings would be less disruptive.",
        },
        {
          id: "sf2-r4",
          text: "System Data at 8 GB on a 64 GB device is high. Safari cache, mail attachments, and app caches can all be reduced through built-in iOS settings.",
        },
      ],
      correctRationaleId: "sf2-r1",
      feedback: {
        perfect:
          "Excellent. A combination of clearing Safari data, offloading unused apps, and setting message auto-deletion provides immediate relief and prevents future buildup.",
        partial:
          "Deleting the Mail app is too aggressive. Clearing cached attachments achieves the same storage savings without removing functionality.",
        wrong: "Third-party cleaners on iOS are ineffective and often counterproductive. Use built-in iOS storage management tools.",
      },
    },
    {
      id: "sf-scenario-3",
      type: "action-rationale",
      title: "Long-Term Storage Strategy",
      context:
        "The phone now has 28 GB free. The user wants to make sure this does not happen again. They take about 200 photos per month, receive large email attachments for work, and install games they play briefly then forget about. They ask for your recommendation for ongoing storage management.",
      actions: [
        {
          id: "sf3-monitor-monthly",
          label: "Tell them to manually check storage every month",
          color: "orange",
        },
        {
          id: "sf3-configure-auto",
          label: "Configure automatic storage management: enable 'Offload Unused Apps', keep iCloud Photos optimization on, set Messages to keep for 1 year, and show them the Storage Recommendations in Settings",
          color: "green",
        },
        {
          id: "sf3-upgrade-icloud",
          label: "Tell them to just upgrade to 2 TB iCloud and stop worrying about it",
          color: "blue",
        },
        {
          id: "sf3-buy-new-phone",
          label: "Recommend upgrading to a 256 GB phone",
          color: "red",
        },
      ],
      correctActionId: "sf3-configure-auto",
      rationales: [
        {
          id: "sf3-r1",
          text: "Configuring automatic management features addresses each storage pattern: offloading unused apps handles abandoned games, iCloud Photos handles photo growth, message retention limits handle conversation buildup, and Storage Recommendations provides ongoing Apple-curated suggestions. This is a proactive, hands-off solution.",
        },
        {
          id: "sf3-r2",
          text: "Monthly manual checks rely on the user remembering, which is unreliable. Automated settings prevent the problem from recurring.",
        },
        {
          id: "sf3-r3",
          text: "More iCloud storage does not directly free local device storage unless optimization features are also enabled. The cloud storage alone does not solve the problem.",
        },
        {
          id: "sf3-r4",
          text: "Buying a new phone is an expensive recommendation when the current device can be managed effectively with built-in tools.",
        },
      ],
      correctRationaleId: "sf3-r1",
      feedback: {
        perfect:
          "Perfect. Configuring automatic storage management features creates a self-maintaining system that handles each of the user's storage patterns without requiring manual intervention.",
        partial:
          "Monthly checks are better than nothing but rely on user discipline. Automated management is more reliable.",
        wrong: "Spending money on hardware or cloud storage is unnecessary when iOS has built-in tools that manage storage automatically.",
      },
    },
  ],
  hints: [
    "Look at the storage breakdown to find the largest consumer before taking action.",
    "iCloud Photos with 'Optimize iPhone Storage' can reclaim most photo storage without deleting anything.",
    "iOS has built-in automatic storage management features like 'Offload Unused Apps' that prevent future storage issues.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Storage management is a recurring support topic. Knowing how to use built-in cloud offloading and automatic management features lets you resolve tickets quickly while educating users to prevent repeat calls.",
  toolRelevance: [
    "iOS Storage Settings",
    "iCloud Photo Library",
    "Offload Unused Apps",
    "Storage Recommendations",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
