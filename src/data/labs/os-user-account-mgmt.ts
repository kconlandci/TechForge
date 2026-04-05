import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "os-user-account-mgmt",
  version: 1,
  title: "Configure User Accounts and Groups",
  tier: "intermediate",
  track: "operating-systems",
  difficulty: "moderate",
  accessLevel: "free",
  tags: ["user-accounts", "groups", "security", "windows", "administration"],
  description:
    "Configure user accounts, local groups, and password policies to meet security requirements while maintaining appropriate access levels in a Windows environment.",
  estimatedMinutes: 18,
  learningObjectives: [
    "Create and configure local user accounts with appropriate security settings",
    "Assign users to correct local groups based on the principle of least privilege",
    "Configure account lockout and password policies using Local Security Policy",
    "Manage User Account Control (UAC) settings appropriately",
  ],
  sortOrder: 609,
  status: "published",
  prerequisites: [],
  rendererType: "toggle-config",
  scenarios: [
    {
      id: "ua-scenario-1",
      type: "toggle-config",
      title: "New Employee Account Setup",
      description:
        "A new help desk technician needs a local account on a shared workstation. They need to install approved software and access Device Manager but should not be able to create other user accounts or change system-wide security settings.",
      targetSystem: "Windows 11 Pro - Local Users and Groups",
      items: [
        {
          id: "ua1-group",
          label: "Group Membership",
          detail: "Assign the user to the appropriate local group",
          currentState: "Administrators",
          correctState: "Power Users",
          states: [
            "Administrators",
            "Power Users",
            "Users",
            "Remote Desktop Users",
          ],
          rationaleId: "ua1-r1",
        },
        {
          id: "ua1-password-change",
          label: "User must change password at next logon",
          detail: "Force an initial password change",
          currentState: "Disabled",
          correctState: "Enabled",
          states: ["Enabled", "Disabled"],
          rationaleId: "ua1-r2",
        },
        {
          id: "ua1-password-expire",
          label: "Password never expires",
          detail: "Configure password expiration setting",
          currentState: "Enabled (never expires)",
          correctState: "Disabled (password will expire per policy)",
          states: [
            "Enabled (never expires)",
            "Disabled (password will expire per policy)",
          ],
          rationaleId: "ua1-r3",
        },
      ],
      rationales: [
        {
          id: "ua1-r1",
          text: "Power Users can install software and manage devices but cannot create user accounts or modify system security settings. Administrators has too many privileges; Users is too restrictive for software installation.",
        },
        {
          id: "ua1-r2",
          text: "Requiring a password change at first logon ensures the IT administrator who created the account does not know the user's permanent password. This is a standard security practice.",
        },
        {
          id: "ua1-r3",
          text: "Passwords should expire per the organization's password policy. Non-expiring passwords violate most security compliance frameworks and increase risk if credentials are compromised.",
        },
      ],
      feedback: {
        perfect:
          "Correct. Power Users provides the right balance of capability, forced password change ensures credential security, and password expiration follows security best practices.",
        partial:
          "Review the group membership. The user needs more than Users but less than Administrators.",
        wrong: "Administrator access violates least privilege. Non-expiring passwords violate security policy.",
      },
    },
    {
      id: "ua-scenario-2",
      type: "toggle-config",
      title: "Account Lockout Policy Configuration",
      description:
        "After a series of brute-force login attempts on shared workstations, IT security requires you to configure account lockout policies. The policy must lock accounts after failed attempts but not cause excessive help desk calls from typos.",
      targetSystem: "Windows 11 Pro - Local Security Policy",
      items: [
        {
          id: "ua2-threshold",
          label: "Account lockout threshold",
          detail: "Number of failed logon attempts before lockout",
          currentState: "0 (disabled)",
          correctState: "5 invalid logon attempts",
          states: [
            "0 (disabled)",
            "3 invalid logon attempts",
            "5 invalid logon attempts",
            "10 invalid logon attempts",
          ],
          rationaleId: "ua2-r1",
        },
        {
          id: "ua2-duration",
          label: "Account lockout duration",
          detail: "How long the account stays locked",
          currentState: "0 (until admin unlocks)",
          correctState: "30 minutes",
          states: [
            "0 (until admin unlocks)",
            "15 minutes",
            "30 minutes",
            "60 minutes",
          ],
          rationaleId: "ua2-r2",
        },
        {
          id: "ua2-reset",
          label: "Reset account lockout counter after",
          detail: "Time before failed attempt counter resets",
          currentState: "99999 minutes",
          correctState: "30 minutes",
          states: ["5 minutes", "15 minutes", "30 minutes", "99999 minutes"],
          rationaleId: "ua2-r3",
        },
      ],
      rationales: [
        {
          id: "ua2-r1",
          text: "Five failed attempts provides a reasonable threshold that catches brute-force attacks while accommodating occasional typos. Three is too aggressive for shared workstations; ten is too permissive against attacks.",
        },
        {
          id: "ua2-r2",
          text: "A 30-minute auto-unlock balances security and usability. Zero requires admin intervention for every lockout, generating excessive help desk tickets. Very short durations do not deter attackers.",
        },
        {
          id: "ua2-r3",
          text: "Resetting the counter after 30 minutes means a user who types their password wrong once in the morning and once in the afternoon is not cumulating toward lockout. This matches the lockout duration for consistency.",
        },
      ],
      feedback: {
        perfect:
          "Excellent. A threshold of 5, with 30-minute lockout and counter reset, provides strong brute-force protection without generating excessive support tickets.",
        partial:
          "The threshold is set but check whether the lockout duration and reset counter are balanced for usability.",
        wrong: "A disabled lockout policy or permanent lockouts create either security vulnerabilities or excessive support burden.",
      },
    },
    {
      id: "ua-scenario-3",
      type: "toggle-config",
      title: "UAC Configuration for Kiosk Machine",
      description:
        "A kiosk workstation in the lobby runs a single application. Standard users interact with it, but occasional admin maintenance requires elevation. Configure UAC to be secure but not disruptive during normal kiosk operation.",
      targetSystem: "Windows 11 Pro - UAC Settings",
      items: [
        {
          id: "ua3-uac-level",
          label: "UAC Notification Level",
          detail: "Configure when UAC prompts appear",
          currentState: "Never notify (UAC disabled)",
          correctState: "Notify me only when apps try to make changes (do not dim desktop)",
          states: [
            "Always notify",
            "Notify me only when apps try to make changes (dim desktop)",
            "Notify me only when apps try to make changes (do not dim desktop)",
            "Never notify (UAC disabled)",
          ],
          rationaleId: "ua3-r1",
        },
        {
          id: "ua3-admin-approval",
          label: "Admin Approval Mode for Built-in Administrator",
          detail: "Require elevation even for the built-in Administrator account",
          currentState: "Disabled",
          correctState: "Enabled",
          states: ["Enabled", "Disabled"],
          rationaleId: "ua3-r2",
        },
        {
          id: "ua3-standard-prompt",
          label: "Behavior for standard users requesting elevation",
          detail: "What happens when a standard user triggers a UAC prompt",
          currentState: "Automatically deny elevation requests",
          correctState: "Prompt for credentials",
          states: [
            "Automatically deny elevation requests",
            "Prompt for credentials",
            "Automatically elevate",
          ],
          rationaleId: "ua3-r3",
        },
      ],
      rationales: [
        {
          id: "ua3-r1",
          text: "Notifying without dimming keeps the kiosk responsive during normal use while still prompting for elevation when needed. Full dimming can confuse kiosk users; disabling UAC entirely removes a critical security layer.",
        },
        {
          id: "ua3-r2",
          text: "Enabling Admin Approval Mode for the built-in Administrator ensures that even administrative maintenance requires explicit consent for elevation, preventing accidental system changes on a public kiosk.",
        },
        {
          id: "ua3-r3",
          text: "Prompting for credentials allows IT staff to elevate using their admin credentials during maintenance without needing to log out the kiosk user. Auto-deny blocks all maintenance; auto-elevate is a security risk.",
        },
      ],
      feedback: {
        perfect:
          "Correct. These UAC settings maintain security on a public kiosk while allowing credential-based admin access for maintenance without disrupting normal kiosk operation.",
        partial:
          "Check whether standard users can still perform maintenance tasks and whether UAC provides adequate protection on a public machine.",
        wrong: "Disabling UAC on a public kiosk or auto-elevating standard users creates severe security risks.",
      },
    },
  ],
  hints: [
    "Power Users can install software and manage devices but cannot create accounts or change security policies.",
    "Account lockout threshold of 5 with 30-minute duration balances security against brute-force while limiting help desk tickets.",
    "UAC should never be fully disabled, especially on public or shared machines.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "User account management and security policy configuration are fundamental responsibilities in enterprise IT. Misconfigured accounts are a leading cause of security incidents, making this a critical skill set.",
  toolRelevance: [
    "Local Users and Groups (lusrmgr.msc)",
    "Local Security Policy (secpol.msc)",
    "net user / net localgroup commands",
    "User Account Control Settings",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
