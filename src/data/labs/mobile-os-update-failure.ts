import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "mobile-os-update-failure",
  version: 1,
  title: "Resolve Failed Mobile OS Updates",
  tier: "intermediate",
  track: "mobile-devices",
  difficulty: "moderate",
  accessLevel: "free",
  tags: ["os-update", "firmware", "android", "ios", "troubleshooting"],
  description:
    "A phone's OS update keeps failing during download or installation. Configure the correct device settings and conditions to allow the update to complete successfully.",
  estimatedMinutes: 18,
  learningObjectives: [
    "Identify prerequisites for successful mobile OS updates (storage, battery, network)",
    "Configure device settings that enable reliable OTA update installation",
    "Troubleshoot update failures caused by insufficient resources or conflicting settings",
    "Understand the difference between OTA, tethered, and recovery mode update methods",
  ],
  sortOrder: 109,
  status: "published",
  prerequisites: [],
  rendererType: "toggle-config",
  scenarios: [
    {
      id: "ou-scenario-1",
      type: "toggle-config",
      title: "Android OTA Update Prerequisites",
      description:
        "A Samsung Galaxy S23 Ultra fails to install the Android 15 update with the error 'Installation failed. Please try again.' The download completes but installation fails at 23% and rolls back. Review and correct the device configuration to allow the update to succeed.",
      targetSystem: "Samsung Galaxy S23 Ultra - System Update Settings",
      items: [
        {
          id: "ou1-item-storage",
          label: "Available Storage Space",
          detail:
            "The update requires 8.2 GB of free space for download and installation staging. Current available space determines if the update can be extracted and applied.",
          currentState: "4.1 GB free",
          correctState: "12+ GB free",
          states: ["4.1 GB free", "8 GB free", "12+ GB free"],
          rationaleId: "ou1-r-storage",
        },
        {
          id: "ou1-item-battery",
          label: "Battery Level During Installation",
          detail:
            "OS installations require sustained power. If the battery dies during installation, the device can be bricked. Most devices require minimum 50% battery or connection to power.",
          currentState: "32% (not charging)",
          correctState: "50%+ or connected to charger",
          states: [
            "32% (not charging)",
            "50%+ or connected to charger",
            "100% only",
          ],
          rationaleId: "ou1-r-battery",
        },
        {
          id: "ou1-item-encryption",
          label: "Device Encryption Status",
          detail:
            "Encrypted devices must decrypt the system partition before applying updates. If the encryption state is inconsistent, the update installer cannot modify system files.",
          currentState: "Encryption in progress (interrupted)",
          correctState: "Fully encrypted",
          states: [
            "Encryption in progress (interrupted)",
            "Fully encrypted",
            "Not encrypted",
          ],
          rationaleId: "ou1-r-encryption",
        },
      ],
      rationales: [
        {
          id: "ou1-r-storage",
          text: "Android major updates need roughly 1.5x the download size for extraction, staging, and rollback partition. With only 4.1 GB free and an 8.2 GB requirement, the installer fails when it cannot stage the extracted files. Freeing space to 12+ GB provides comfortable headroom.",
        },
        {
          id: "ou1-r-battery",
          text: "The installer aborts at low battery to prevent bricking. At 32% without charging, the update will fail or refuse to start. Connecting to a charger or reaching 50%+ satisfies the safety requirement.",
        },
        {
          id: "ou1-r-encryption",
          text: "An interrupted encryption leaves the filesystem in an inconsistent state where the update installer cannot safely modify system partitions. Completing the encryption process is required before any system update can be applied.",
        },
      ],
      feedback: {
        perfect:
          "All prerequisites are now correctly configured. The update should install successfully with sufficient storage, adequate power, and a consistent encryption state.",
        partial:
          "Some settings are correct but the remaining misconfiguration will still block the update. Review all three prerequisites.",
        wrong: "The current configuration still does not meet the requirements for a successful OS update installation.",
      },
    },
    {
      id: "ou-scenario-2",
      type: "toggle-config",
      title: "iOS Update Network and Download Settings",
      description:
        "An iPhone 13 Pro fails to download the iOS 18.3 update. The progress bar stalls at 0% every time and eventually shows 'Unable to Check for Update.' The user is on cellular data during their commute and gets frustrated that the update never starts.",
      targetSystem: "iPhone 13 Pro - Update Download Configuration",
      items: [
        {
          id: "ou2-item-network",
          label: "Network Connection Type",
          detail:
            "iOS major updates require a Wi-Fi connection for the initial download. Cellular data is not used for large OTA updates by default to prevent excessive data charges.",
          currentState: "Cellular Only (no Wi-Fi available)",
          correctState: "Connected to Wi-Fi",
          states: [
            "Cellular Only (no Wi-Fi available)",
            "Connected to Wi-Fi",
            "VPN over Cellular",
          ],
          rationaleId: "ou2-r-network",
        },
        {
          id: "ou2-item-vpn",
          label: "VPN Configuration",
          detail:
            "Active VPN connections can interfere with Apple's update servers. Some VPN configurations route traffic through servers that block or throttle Apple CDN connections.",
          currentState: "Corporate VPN Always-On",
          correctState: "VPN Disabled for Update",
          states: [
            "Corporate VPN Always-On",
            "VPN Disabled for Update",
            "VPN with Split Tunneling",
          ],
          rationaleId: "ou2-r-vpn",
        },
        {
          id: "ou2-item-dns",
          label: "DNS Configuration",
          detail:
            "Custom DNS servers or content-filtering DNS can block access to Apple's update servers (mesu.apple.com and updates.cdn-apple.com).",
          currentState: "Custom DNS: NextDNS with strict filtering",
          correctState: "Automatic DNS (ISP default)",
          states: [
            "Custom DNS: NextDNS with strict filtering",
            "Automatic DNS (ISP default)",
            "Custom DNS: 8.8.8.8",
          ],
          rationaleId: "ou2-r-dns",
        },
      ],
      rationales: [
        {
          id: "ou2-r-network",
          text: "iOS requires Wi-Fi for major OTA update downloads. The cellular-only connection during the commute is the primary blocker. The user needs to connect to Wi-Fi before attempting the download.",
        },
        {
          id: "ou2-r-vpn",
          text: "Corporate VPN Always-On routes all traffic through the company network, which may block or throttle Apple CDN connections. Temporarily disabling the VPN allows direct communication with Apple's update servers.",
        },
        {
          id: "ou2-r-dns",
          text: "NextDNS with strict filtering may block Apple's update domains (mesu.apple.com). Switching to automatic DNS during the update ensures the phone can reach Apple's update servers without content filtering interference.",
        },
      ],
      feedback: {
        perfect:
          "All network conditions are now correct. With Wi-Fi connected, VPN disabled, and standard DNS, the iOS update should download successfully.",
        partial:
          "Some network settings are correct but remaining issues will still prevent the update download from completing.",
        wrong: "The current network configuration still blocks access to Apple's update servers.",
      },
    },
    {
      id: "ou-scenario-3",
      type: "toggle-config",
      title: "Recovery Mode Update as Fallback",
      description:
        "After multiple failed OTA attempts on an iPhone SE (3rd gen), you decide to update via a computer. The user's Windows laptop has iTunes installed. Configure the correct settings and procedure for a tethered update that preserves user data.",
      targetSystem: "Tethered Update via iTunes - Configuration",
      items: [
        {
          id: "ou3-item-itunes",
          label: "iTunes Version",
          detail:
            "iTunes must be up to date to recognize the device and download the correct firmware. Outdated iTunes may not support the latest iOS versions or device models.",
          currentState: "iTunes 12.10.2 (2 years old)",
          correctState: "iTunes latest version (updated today)",
          states: [
            "iTunes 12.10.2 (2 years old)",
            "iTunes latest version (updated today)",
            "iTunes not needed (use browser)",
          ],
          rationaleId: "ou3-r-itunes",
        },
        {
          id: "ou3-item-mode",
          label: "Update Mode Selection",
          detail:
            "iTunes offers 'Update' and 'Restore' options. The mode determines whether user data is preserved or erased during the firmware installation.",
          currentState: "Restore (erase and install)",
          correctState: "Update (preserve data)",
          states: [
            "Restore (erase and install)",
            "Update (preserve data)",
            "Recovery Mode restore",
          ],
          rationaleId: "ou3-r-mode",
        },
        {
          id: "ou3-item-backup",
          label: "Pre-Update Backup",
          detail:
            "Before any firmware update via computer, a backup ensures data can be recovered if the update process encounters an error.",
          currentState: "No backup (proceeding directly)",
          correctState: "Encrypted backup completed",
          states: [
            "No backup (proceeding directly)",
            "Unencrypted backup completed",
            "Encrypted backup completed",
          ],
          rationaleId: "ou3-r-backup",
        },
      ],
      rationales: [
        {
          id: "ou3-r-itunes",
          text: "A 2-year-old iTunes version may not have the firmware catalog for the latest iOS version or device profiles. Updating iTunes ensures it can download and apply the correct firmware for the iPhone SE 3rd generation.",
        },
        {
          id: "ou3-r-mode",
          text: "The 'Update' option installs the new iOS version while preserving all user data, apps, and settings. The 'Restore' option erases the device completely. Since the goal is to update without data loss, 'Update' is the correct selection.",
        },
        {
          id: "ou3-r-backup",
          text: "An encrypted backup preserves everything including health data, saved passwords, and Wi-Fi credentials. An unencrypted backup omits sensitive data. Completing an encrypted backup before the update provides a complete safety net in case the update fails.",
        },
      ],
      feedback: {
        perfect:
          "All settings are correctly configured for a safe tethered update. Updated iTunes, Update mode (not Restore), and an encrypted backup ensure a successful update with full data protection.",
        partial:
          "Some settings are correct but the remaining misconfiguration risks data loss or update failure.",
        wrong: "The current configuration risks data loss or will not complete the update successfully.",
      },
    },
  ],
  hints: [
    "OS updates typically need 1.5x the download size in free storage for extraction and staging.",
    "iOS major updates require Wi-Fi. Check for VPN and DNS configurations that may block Apple's update servers.",
    "When doing a tethered update via computer, always use 'Update' instead of 'Restore' to preserve user data, and make an encrypted backup first.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Failed OS updates generate many support tickets. Knowing the prerequisite checklist (storage, battery, network, encryption) and fallback update methods (tethered via computer) lets you resolve these efficiently.",
  toolRelevance: [
    "Device Storage Manager",
    "iTunes / Finder (Mac)",
    "Wi-Fi and Network Settings",
    "Battery and Power Settings",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
