import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "mobile-data-migration",
  version: 1,
  title: "Migrate Data Between iOS and Android Devices",
  tier: "advanced",
  track: "mobile-devices",
  difficulty: "challenging",
  accessLevel: "premium",
  tags: ["migration", "data-transfer", "ios", "android", "cross-platform"],
  description:
    "A user is switching from an iPhone to a Samsung Galaxy. Plan and execute a cross-platform data migration that preserves contacts, photos, messages, and app data with minimal loss.",
  estimatedMinutes: 25,
  learningObjectives: [
    "Plan a cross-platform mobile data migration strategy",
    "Identify which data types can and cannot be transferred between iOS and Android",
    "Use manufacturer migration tools and cloud services for data transfer",
    "Handle common migration failures and data format incompatibilities",
  ],
  sortOrder: 111,
  status: "published",
  prerequisites: [],
  rendererType: "action-rationale",
  scenarios: [
    {
      id: "dm-scenario-1",
      type: "action-rationale",
      title: "Pre-Migration Assessment",
      context:
        "A user is switching from an iPhone 13 (256 GB, 187 GB used) to a Samsung Galaxy S24 (256 GB). They want everything transferred: 42,000 photos/videos in iCloud Photos (138 GB), 15,000 contacts synced with iCloud, 3 years of iMessages, WhatsApp chat history (12 GB), 47 paid iOS apps, Apple Health data, and their Apple Watch (Series 8). They expect the migration to be seamless.",
      actions: [
        {
          id: "dm1-smart-switch",
          label: "Use Samsung Smart Switch to transfer everything in one step",
          color: "blue",
        },
        {
          id: "dm1-set-expectations",
          label: "Explain what can and cannot transfer, then create a migration plan: iCloud Photos to Google Photos, contacts via Google account sync, WhatsApp built-in transfer, and document what will be lost (iMessages history, iOS-only apps, Apple Watch pairing, Apple Health data)",
          color: "green",
        },
        {
          id: "dm1-manual-backup",
          label: "Create a full iTunes backup and restore it to the Samsung",
          color: "red",
        },
        {
          id: "dm1-cloud-only",
          label: "Tell the user to just log into their Google account on the new phone and everything will sync",
          color: "red",
        },
      ],
      correctActionId: "dm1-set-expectations",
      rationales: [
        {
          id: "dm1-r1",
          text: "Cross-platform migration has fundamental limitations. Setting expectations and creating a structured plan prevents user frustration. iMessages cannot transfer to Android. iOS app purchases do not transfer. Apple Watch only works with iPhones. Apple Health data requires Google Health Connect which has limited import. A clear plan addresses each data type with the best available method.",
        },
        {
          id: "dm1-r2",
          text: "Smart Switch transfers many data types but cannot handle iCloud Photos at 138 GB efficiently over cable, cannot transfer WhatsApp directly, and cannot migrate iOS app purchases. It is a useful tool but not a complete solution.",
        },
        {
          id: "dm1-r3",
          text: "iTunes backups are iOS-specific format and cannot be restored to Android devices. The backup contains iOS system data and app containers that are incompatible with Android.",
        },
        {
          id: "dm1-r4",
          text: "The user's data is in iCloud, not Google. Logging into Google on the new phone would give them an empty account. Data must be explicitly migrated from Apple services to Google services.",
        },
      ],
      correctRationaleId: "dm1-r1",
      feedback: {
        perfect:
          "Correct. A proper migration plan that sets honest expectations about limitations is essential. Documenting what transfers and what is lost prevents frustration and builds trust.",
        partial:
          "Smart Switch is a useful tool in the migration process but alone it does not address all data types or set proper expectations about limitations.",
        wrong: "iOS backups and cloud accounts are not cross-platform compatible. A structured migration plan is required.",
      },
    },
    {
      id: "dm-scenario-2",
      type: "action-rationale",
      title: "Photo and Contact Migration",
      context:
        "You are executing the migration plan. The user has 42,000 photos/videos (138 GB) in iCloud Photos and 15,000 contacts synced to iCloud. You need to get both datasets onto the Samsung Galaxy S24. The user has a fast home Wi-Fi connection. You have both phones and the user's iCloud credentials.",
      actions: [
        {
          id: "dm2-google-takeout",
          label: "Use Apple's 'Transfer a copy of your data' tool at privacy.apple.com to request a transfer of iCloud Photos directly to Google Photos, and sync contacts by adding the Google account to the iPhone first",
          color: "green",
        },
        {
          id: "dm2-download-upload",
          label: "Download all 138 GB of photos to a computer and manually upload to Google Photos",
          color: "orange",
        },
        {
          id: "dm2-smart-switch-cable",
          label: "Use Smart Switch with a USB-C to Lightning cable to transfer photos directly",
          color: "blue",
        },
        {
          id: "dm2-email-contacts",
          label: "Email the contacts as a vCard file",
          color: "orange",
        },
      ],
      correctActionId: "dm2-google-takeout",
      rationales: [
        {
          id: "dm2-r1",
          text: "Apple's official data transfer service at privacy.apple.com performs a server-to-server transfer of iCloud Photos to Google Photos without requiring local download. For 138 GB, this is dramatically faster and more reliable than downloading and re-uploading. For contacts, adding the Google account to the iPhone and enabling contact sync copies all 15,000 contacts to Google, which then appear on the Samsung automatically.",
        },
        {
          id: "dm2-r2",
          text: "Downloading 138 GB and re-uploading is time-consuming and error-prone. The Apple-to-Google server transfer is purpose-built for this migration.",
        },
        {
          id: "dm2-r3",
          text: "Smart Switch over cable works but is slower than server-to-server transfer for large photo libraries and may time out or disconnect during the multi-hour transfer of 138 GB.",
        },
        {
          id: "dm2-r4",
          text: "Emailing 15,000 contacts as a vCard is unreliable due to email attachment size limits and potential encoding issues. Account-level sync is the proper method.",
        },
      ],
      correctRationaleId: "dm2-r1",
      feedback: {
        perfect:
          "Excellent. Using Apple's server-to-server transfer for photos and Google account sync for contacts is the most efficient and reliable migration path for large datasets.",
        partial:
          "Smart Switch works but is slower and less reliable than server-to-server transfer for 138 GB of photos.",
        wrong: "Manual download/upload of 138 GB and emailing vCards are unreliable at this scale. Use purpose-built migration tools.",
      },
    },
    {
      id: "dm-scenario-3",
      type: "action-rationale",
      title: "WhatsApp and Post-Migration Verification",
      context:
        "Photos and contacts have transferred successfully. The user's WhatsApp contains 12 GB of chat history with media spanning 3 years. They also ask about their paid iOS apps (47 apps totaling about $180 in purchases). After the WhatsApp transfer, you need to verify the overall migration was successful.",
      actions: [
        {
          id: "dm3-whatsapp-builtin",
          label: "Use WhatsApp's built-in 'Move chats to Android' feature via cable connection, explain that iOS app purchases cannot transfer to Google Play, and run a comprehensive verification checklist",
          color: "green",
        },
        {
          id: "dm3-whatsapp-backup",
          label: "Backup WhatsApp to iCloud and restore on Android from iCloud",
          color: "red",
        },
        {
          id: "dm3-skip-whatsapp",
          label: "Tell the user WhatsApp cannot be transferred between platforms",
          color: "red",
        },
        {
          id: "dm3-third-party-tool",
          label: "Use a third-party tool to transfer WhatsApp and convert iOS apps to Android APKs",
          color: "red",
        },
      ],
      correctActionId: "dm3-whatsapp-builtin",
      rationales: [
        {
          id: "dm3-r1",
          text: "WhatsApp has an official 'Move chats to Android' feature that transfers chat history, media, and settings via a direct USB cable connection. This is the supported method. iOS app purchases are tied to the Apple ID and cannot transfer to Google Play; the user would need to repurchase apps on Android. A post-migration checklist verifying contacts, photos, WhatsApp, email accounts, and two-factor authentication apps ensures nothing was missed.",
        },
        {
          id: "dm3-r2",
          text: "WhatsApp iCloud backups use an iOS-specific format that cannot be restored on Android. The built-in Move to Android feature handles the format conversion.",
        },
        {
          id: "dm3-r3",
          text: "WhatsApp officially supports cross-platform migration now. Telling the user it is impossible is outdated information.",
        },
        {
          id: "dm3-r4",
          text: "Third-party WhatsApp transfer tools often violate WhatsApp ToS and may compromise message encryption. Converting iOS apps to APKs is piracy and does not work with DRM-protected apps.",
        },
      ],
      correctRationaleId: "dm3-r1",
      feedback: {
        perfect:
          "Correct. WhatsApp's built-in migration, honest communication about app purchase limitations, and a verification checklist ensure a thorough and professional migration experience.",
        partial:
          "Third-party tools are risky and unnecessary when WhatsApp provides an official transfer feature. App conversion is not legitimate.",
        wrong: "WhatsApp officially supports cross-platform chat migration. Always use official tools for data transfer.",
      },
    },
  ],
  hints: [
    "Not all data can transfer between iOS and Android. Set expectations early about iMessages, app purchases, and Apple Watch compatibility.",
    "Apple provides a server-to-server data transfer tool at privacy.apple.com for migrating iCloud Photos to Google Photos.",
    "WhatsApp has a built-in 'Move chats to Android' feature for cross-platform chat history migration.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Cross-platform data migration is a high-value skill in mobile support. Customers switching ecosystems have high anxiety about data loss, and a technician who can manage expectations while executing a thorough migration builds strong client trust.",
  toolRelevance: [
    "Samsung Smart Switch",
    "Apple Data Transfer (privacy.apple.com)",
    "WhatsApp Move to Android",
    "Google Account Sync",
    "Migration Verification Checklist",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
