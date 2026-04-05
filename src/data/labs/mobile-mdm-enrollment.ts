import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "mobile-mdm-enrollment",
  version: 1,
  title: "Configure MDM Enrollment for Corporate Device",
  tier: "advanced",
  track: "mobile-devices",
  difficulty: "challenging",
  accessLevel: "premium",
  tags: ["mdm", "enterprise", "enrollment", "intune", "corporate", "security"],
  description:
    "A new employee needs their personal phone enrolled in the company MDM system for BYOD access to corporate resources. Configure the correct MDM enrollment settings and security policies.",
  estimatedMinutes: 25,
  learningObjectives: [
    "Configure MDM enrollment settings for BYOD and corporate-owned device scenarios",
    "Understand the difference between device-level and work-profile enrollment",
    "Set appropriate compliance policies that balance security and user privacy",
    "Troubleshoot common MDM enrollment failures",
  ],
  sortOrder: 110,
  status: "published",
  prerequisites: [],
  rendererType: "toggle-config",
  scenarios: [
    {
      id: "mdm-scenario-1",
      type: "toggle-config",
      title: "Android BYOD Work Profile Configuration",
      description:
        "A new marketing employee wants to use their personal Samsung Galaxy S24 for work email and Teams. The company uses Microsoft Intune for MDM. Configure the enrollment type and work profile settings that protect corporate data while respecting personal privacy on a BYOD device.",
      targetSystem: "Microsoft Intune - Android BYOD Enrollment",
      items: [
        {
          id: "mdm1-item-enrollment",
          label: "Enrollment Type",
          detail:
            "Android offers multiple enrollment types. The type determines how much control the MDM has over the device. BYOD requires balancing corporate security with personal privacy.",
          currentState: "Fully Managed (Device Owner)",
          correctState: "Work Profile (Profile Owner)",
          states: [
            "Fully Managed (Device Owner)",
            "Work Profile (Profile Owner)",
            "Dedicated Device (Kiosk)",
          ],
          rationaleId: "mdm1-r-enrollment",
        },
        {
          id: "mdm1-item-apps",
          label: "App Management Scope",
          detail:
            "Defines which apps the MDM can manage, install, or remove on the device.",
          currentState: "All apps on device",
          correctState: "Work profile apps only",
          states: [
            "All apps on device",
            "Work profile apps only",
            "No app management",
          ],
          rationaleId: "mdm1-r-apps",
        },
        {
          id: "mdm1-item-wipe",
          label: "Remote Wipe Scope",
          detail:
            "Defines what happens when IT issues a remote wipe command for a departing employee or lost device.",
          currentState: "Full device wipe",
          correctState: "Work profile wipe only",
          states: [
            "Full device wipe",
            "Work profile wipe only",
            "No remote wipe capability",
          ],
          rationaleId: "mdm1-r-wipe",
        },
        {
          id: "mdm1-item-location",
          label: "Location Tracking",
          detail:
            "Controls whether IT can track the device's physical location.",
          currentState: "Always-on location tracking",
          correctState: "Disabled (BYOD privacy)",
          states: [
            "Always-on location tracking",
            "Lost mode only",
            "Disabled (BYOD privacy)",
          ],
          rationaleId: "mdm1-r-location",
        },
      ],
      rationales: [
        {
          id: "mdm1-r-enrollment",
          text: "Work Profile enrollment creates a separate managed container for corporate apps and data while leaving the personal side of the device untouched. Fully Managed mode gives IT complete control over the entire device, which is inappropriate for a personal BYOD device.",
        },
        {
          id: "mdm1-r-apps",
          text: "BYOD Work Profile limits MDM authority to apps inside the work container. IT should not manage personal apps like social media, banking, or messaging on an employee's personal device.",
        },
        {
          id: "mdm1-r-wipe",
          text: "On a BYOD device, a remote wipe should only remove the work profile containing corporate data. A full device wipe would destroy the employee's personal photos, messages, and apps, which creates legal and trust issues.",
        },
        {
          id: "mdm1-r-location",
          text: "Location tracking on a personal BYOD device raises significant privacy concerns and may violate local privacy regulations. Corporate location tracking should be reserved for company-owned devices only.",
        },
      ],
      feedback: {
        perfect:
          "All BYOD enrollment settings correctly balance corporate security with employee privacy. Work Profile isolation protects corporate data without overstepping into personal device management.",
        partial:
          "Some settings correctly protect privacy but others give IT too much control over a personal device, which will cause employee pushback and potential legal issues.",
        wrong: "These settings treat a personal BYOD device like a corporate-owned device, which is inappropriate and may violate privacy regulations.",
      },
    },
    {
      id: "mdm-scenario-2",
      type: "toggle-config",
      title: "iOS BYOD Compliance Policy",
      description:
        "Configure the Intune compliance policy for BYOD iPhones accessing corporate email. The policy must meet security requirements without being so restrictive that employees refuse enrollment. The company handles sensitive financial data subject to industry regulations.",
      targetSystem: "Microsoft Intune - iOS Compliance Policy",
      items: [
        {
          id: "mdm2-item-passcode",
          label: "Device Passcode Requirement",
          detail:
            "The minimum passcode complexity required for the device to access corporate resources.",
          currentState: "No passcode required",
          correctState: "6-digit PIN or biometric minimum",
          states: [
            "No passcode required",
            "4-digit PIN minimum",
            "6-digit PIN or biometric minimum",
            "12-character alphanumeric password",
          ],
          rationaleId: "mdm2-r-passcode",
        },
        {
          id: "mdm2-item-jailbreak",
          label: "Jailbreak Detection",
          detail:
            "Whether the MDM checks for jailbroken/rooted device status before granting access to corporate resources.",
          currentState: "Not checked",
          correctState: "Block jailbroken devices",
          states: [
            "Not checked",
            "Warn but allow",
            "Block jailbroken devices",
          ],
          rationaleId: "mdm2-r-jailbreak",
        },
        {
          id: "mdm2-item-os-version",
          label: "Minimum OS Version",
          detail:
            "The oldest acceptable iOS version for devices accessing corporate data. Older versions may have known security vulnerabilities.",
          currentState: "Any iOS version",
          correctState: "iOS 16.0 or later (current minus 2)",
          states: [
            "Any iOS version",
            "iOS 16.0 or later (current minus 2)",
            "Latest iOS version only",
          ],
          rationaleId: "mdm2-r-os",
        },
        {
          id: "mdm2-item-encryption",
          label: "Device Encryption Requirement",
          detail:
            "Whether device encryption is required for corporate data access.",
          currentState: "Not required",
          correctState: "Required (default on modern iOS)",
          states: [
            "Not required",
            "Required (default on modern iOS)",
          ],
          rationaleId: "mdm2-r-encryption",
        },
      ],
      rationales: [
        {
          id: "mdm2-r-passcode",
          text: "A 6-digit PIN provides meaningful security (1 million combinations vs 10,000 for 4-digit) while remaining usable. Biometric options (Face ID/Touch ID) provide strong security with convenience. A 12-character alphanumeric password is so cumbersome that employees will resist enrollment.",
        },
        {
          id: "mdm2-r-jailbreak",
          text: "Jailbroken devices bypass iOS security controls that protect corporate data (sandboxing, code signing, secure enclave). For financial data compliance, jailbroken devices must be blocked, not just warned.",
        },
        {
          id: "mdm2-r-os",
          text: "Requiring 'current minus 2' major versions (iOS 16+) ensures known critical vulnerabilities are patched while giving users a reasonable window to update. Requiring only the latest version alienates users with slightly older devices.",
        },
        {
          id: "mdm2-r-encryption",
          text: "iOS devices with a passcode are encrypted by default since iOS 8. Requiring encryption ensures that even if a device is physically compromised, corporate data remains protected. This is a compliance requirement for financial data.",
        },
      ],
      feedback: {
        perfect:
          "The compliance policy correctly balances security requirements for financial data with user-friendly settings that encourage adoption rather than resistance.",
        partial:
          "Some settings are appropriate but the overall policy is either too lax for financial data or too restrictive for user adoption.",
        wrong: "This policy either fails to meet security requirements for financial data or is so restrictive it will prevent BYOD adoption.",
      },
    },
    {
      id: "mdm-scenario-3",
      type: "toggle-config",
      title: "Troubleshooting Enrollment Failure",
      description:
        "An employee's iPhone 14 fails Intune enrollment with the error 'Enrollment profile installation failed.' The device was previously enrolled with a different company's MDM that the employee left 3 months ago. Review the device configuration and fix the blocking issues.",
      targetSystem: "iPhone 14 - Pre-Enrollment Device Configuration",
      items: [
        {
          id: "mdm3-item-old-profile",
          label: "Previous MDM Profile",
          detail:
            "MDM enrollment profiles from previous organizations can conflict with new enrollment. A device typically cannot be enrolled in two MDM systems simultaneously.",
          currentState: "Old company MDM profile still installed",
          correctState: "Old MDM profile removed",
          states: [
            "Old company MDM profile still installed",
            "Old MDM profile removed",
            "Both profiles installed simultaneously",
          ],
          rationaleId: "mdm3-r-profile",
        },
        {
          id: "mdm3-item-supervision",
          label: "Device Supervision Status",
          detail:
            "Supervised devices have additional management capabilities but supervision is typically set during initial device setup through Apple Configurator or DEP/ABM.",
          currentState: "Supervised (from previous employer DEP)",
          correctState: "Unsupervised (personal device)",
          states: [
            "Supervised (from previous employer DEP)",
            "Unsupervised (personal device)",
            "Supervised by new company",
          ],
          rationaleId: "mdm3-r-supervision",
        },
        {
          id: "mdm3-item-date-time",
          label: "Date and Time Settings",
          detail:
            "Certificate-based enrollment requires accurate device time for SSL/TLS validation with the MDM server.",
          currentState: "Set Automatically: OFF (date is 2 days behind)",
          correctState: "Set Automatically: ON",
          states: [
            "Set Automatically: OFF (date is 2 days behind)",
            "Set Automatically: ON",
            "Manual with correct time",
          ],
          rationaleId: "mdm3-r-datetime",
        },
      ],
      rationales: [
        {
          id: "mdm3-r-profile",
          text: "The old MDM profile from the previous employer conflicts with the new enrollment. iOS does not support dual MDM enrollment. The old profile must be removed through Settings > General > VPN & Device Management before the new enrollment can proceed.",
        },
        {
          id: "mdm3-r-supervision",
          text: "The previous employer's DEP/ABM enrollment left the device in Supervised mode, which locks it to that organization's management. The device must be factory reset and set up as a personal device (unsupervised) to remove the DEP supervision before enrolling in the new company's BYOD program.",
        },
        {
          id: "mdm3-r-datetime",
          text: "An incorrect device date causes SSL certificate validation failures during MDM enrollment. The enrollment profile is signed with a certificate that has validity dates, and a 2-day time discrepancy can cause the profile installation to fail. Enabling automatic date/time ensures correct certificate validation.",
        },
      ],
      feedback: {
        perfect:
          "All blocking issues are resolved. With the old MDM profile removed, supervision cleared, and accurate time settings, the new Intune enrollment should succeed.",
        partial:
          "Some issues are resolved but remaining configuration problems will still block the enrollment process.",
        wrong: "The current device state still has conflicts that prevent new MDM enrollment.",
      },
    },
  ],
  hints: [
    "BYOD enrollment should use Work Profile (Android) or User Enrollment (iOS) to separate corporate and personal data.",
    "Compliance policies should be strict enough for security but reasonable enough that employees will actually enroll their devices.",
    "If a device was previously enrolled in another MDM, the old profile and any supervision status must be removed before new enrollment.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "MDM configuration is a critical skill for enterprise mobility roles. Understanding the balance between security and usability in BYOD programs is essential for IT administrators and security professionals.",
  toolRelevance: [
    "Microsoft Intune",
    "Apple Business Manager",
    "Android Enterprise",
    "Device Management Profiles",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
