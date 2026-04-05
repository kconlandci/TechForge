import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "os-group-policy",
  version: 1,
  title: "Configure Group Policy Settings",
  tier: "advanced",
  track: "operating-systems",
  difficulty: "challenging",
  accessLevel: "premium",
  tags: ["group-policy", "gpo", "windows", "security", "enterprise"],
  description:
    "Configure Group Policy Object settings for enterprise security requirements including software restriction, password policies, drive mapping, and Windows Firewall rules.",
  estimatedMinutes: 25,
  learningObjectives: [
    "Navigate Group Policy Editor and identify correct policy paths",
    "Configure security policies for password, audit, and user rights",
    "Apply software restriction and AppLocker policies to control application execution",
    "Understand the difference between Computer Configuration and User Configuration",
    "Use gpresult and gpupdate to verify and apply policy changes",
  ],
  sortOrder: 611,
  status: "published",
  prerequisites: [],
  rendererType: "toggle-config",
  scenarios: [
    {
      id: "gp-scenario-1",
      type: "toggle-config",
      title: "Password Policy Hardening",
      description:
        "A security audit found that the organization's password policy is too weak. Configure the Local Security Policy to meet the new requirements: minimum 12 characters, complexity enabled, 90-day maximum age, and 24 password history.",
      targetSystem: "Windows Server 2022 - Local Security Policy",
      items: [
        {
          id: "gp1-min-length",
          label: "Minimum password length",
          detail: "Computer Configuration > Windows Settings > Security Settings > Account Policies > Password Policy",
          currentState: "6 characters",
          correctState: "12 characters",
          states: [
            "6 characters",
            "8 characters",
            "10 characters",
            "12 characters",
            "14 characters",
          ],
          rationaleId: "gp1-r1",
        },
        {
          id: "gp1-complexity",
          label: "Password must meet complexity requirements",
          detail: "Require uppercase, lowercase, digits, and special characters",
          currentState: "Disabled",
          correctState: "Enabled",
          states: ["Enabled", "Disabled"],
          rationaleId: "gp1-r2",
        },
        {
          id: "gp1-max-age",
          label: "Maximum password age",
          detail: "Days before password must be changed",
          currentState: "0 (never expires)",
          correctState: "90 days",
          states: ["0 (never expires)", "30 days", "60 days", "90 days", "180 days"],
          rationaleId: "gp1-r3",
        },
        {
          id: "gp1-history",
          label: "Enforce password history",
          detail: "Number of unique passwords before reuse is allowed",
          currentState: "0 passwords remembered",
          correctState: "24 passwords remembered",
          states: [
            "0 passwords remembered",
            "5 passwords remembered",
            "12 passwords remembered",
            "24 passwords remembered",
          ],
          rationaleId: "gp1-r4",
        },
      ],
      rationales: [
        {
          id: "gp1-r1",
          text: "A minimum of 12 characters significantly increases brute-force resistance. NIST SP 800-63B recommends at least 8 characters, but 12+ is the current enterprise best practice.",
        },
        {
          id: "gp1-r2",
          text: "Complexity requirements ensure passwords contain a mix of character types (uppercase, lowercase, numbers, symbols), making dictionary and pattern-based attacks less effective.",
        },
        {
          id: "gp1-r3",
          text: "A 90-day maximum age forces regular password rotation. While some frameworks debate rotation frequency, 90 days remains the standard for many compliance requirements (PCI DSS, HIPAA).",
        },
        {
          id: "gp1-r4",
          text: "Remembering 24 passwords prevents users from cycling through a short list of passwords to get back to their favorite. At 90-day rotation, this covers 6 years of password history.",
        },
      ],
      feedback: {
        perfect:
          "Excellent. 12-character minimum, complexity enabled, 90-day rotation, and 24-password history meets or exceeds most compliance frameworks.",
        partial:
          "Some values are correct but review the specific requirements. Each setting must match the audit findings.",
        wrong: "The current settings leave the organization vulnerable. Review the minimum requirements from the security audit.",
      },
    },
    {
      id: "gp-scenario-2",
      type: "toggle-config",
      title: "Restrict Removable Media and Control Panel Access",
      description:
        "Standard users in the call center should not be able to access the Control Panel, use removable storage, or modify desktop settings. Configure the appropriate Group Policy settings.",
      targetSystem: "Windows 11 Pro - Group Policy Editor",
      items: [
        {
          id: "gp2-control-panel",
          label: "Prohibit access to Control Panel and PC Settings",
          detail: "User Configuration > Administrative Templates > Control Panel",
          currentState: "Not Configured",
          correctState: "Enabled",
          states: ["Not Configured", "Enabled", "Disabled"],
          rationaleId: "gp2-r1",
        },
        {
          id: "gp2-removable-read",
          label: "Removable Disks: Deny read access",
          detail: "User Configuration > Administrative Templates > System > Removable Storage Access",
          currentState: "Not Configured",
          correctState: "Enabled",
          states: ["Not Configured", "Enabled", "Disabled"],
          rationaleId: "gp2-r2",
        },
        {
          id: "gp2-removable-write",
          label: "Removable Disks: Deny write access",
          detail: "User Configuration > Administrative Templates > System > Removable Storage Access",
          currentState: "Not Configured",
          correctState: "Enabled",
          states: ["Not Configured", "Enabled", "Disabled"],
          rationaleId: "gp2-r3",
        },
        {
          id: "gp2-desktop",
          label: "Prevent changing desktop background",
          detail: "User Configuration > Administrative Templates > Desktop > Desktop",
          currentState: "Not Configured",
          correctState: "Enabled",
          states: ["Not Configured", "Enabled", "Disabled"],
          rationaleId: "gp2-r4",
        },
      ],
      rationales: [
        {
          id: "gp2-r1",
          text: "Enabling the Control Panel prohibition prevents call center users from modifying system settings, network configurations, or installed software that could disrupt their workstation.",
        },
        {
          id: "gp2-r2",
          text: "Denying read access to removable disks prevents users from introducing unauthorized software or malware via USB drives, which is a common attack vector in call center environments.",
        },
        {
          id: "gp2-r3",
          text: "Denying write access to removable disks prevents data exfiltration. Both read and write must be denied separately as they are independent policy settings.",
        },
        {
          id: "gp2-r4",
          text: "Preventing desktop background changes maintains a standardized and professional appearance across all call center workstations and reduces support requests for cosmetic issues.",
        },
      ],
      feedback: {
        perfect:
          "Correct. All four policies properly lock down the call center workstations. Users under these policies are placed under User Configuration, so they apply regardless of which machine they log into.",
        partial:
          "Remember that removable storage read and write access are separate policies. Both must be enabled to fully block USB drives.",
        wrong: "Not Configured means the policy is not enforced. Review which settings need to be actively Enabled.",
      },
    },
    {
      id: "gp-scenario-3",
      type: "toggle-config",
      title: "Audit Policy Configuration",
      description:
        "After a security incident, management requires comprehensive audit logging on all workstations. Configure audit policies to track logon events, privilege use, and object access for both success and failure.",
      targetSystem: "Windows Server 2022 - Advanced Audit Policy Configuration",
      items: [
        {
          id: "gp3-logon",
          label: "Audit Logon Events",
          detail: "Computer Configuration > Windows Settings > Security Settings > Advanced Audit Policy Configuration > Logon/Logoff > Audit Logon",
          currentState: "No Auditing",
          correctState: "Success and Failure",
          states: ["No Auditing", "Success", "Failure", "Success and Failure"],
          rationaleId: "gp3-r1",
        },
        {
          id: "gp3-privilege",
          label: "Audit Sensitive Privilege Use",
          detail: "Computer Configuration > Windows Settings > Security Settings > Advanced Audit Policy Configuration > Privilege Use > Audit Sensitive Privilege Use",
          currentState: "No Auditing",
          correctState: "Success and Failure",
          states: ["No Auditing", "Success", "Failure", "Success and Failure"],
          rationaleId: "gp3-r2",
        },
        {
          id: "gp3-object",
          label: "Audit File System",
          detail: "Computer Configuration > Windows Settings > Security Settings > Advanced Audit Policy Configuration > Object Access > Audit File System",
          currentState: "No Auditing",
          correctState: "Success and Failure",
          states: ["No Auditing", "Success", "Failure", "Success and Failure"],
          rationaleId: "gp3-r3",
        },
      ],
      rationales: [
        {
          id: "gp3-r1",
          text: "Auditing both successful and failed logon events captures legitimate user activity and brute-force attack attempts. Success-only misses attacks; Failure-only misses unauthorized access that succeeded.",
        },
        {
          id: "gp3-r2",
          text: "Sensitive privilege use auditing tracks when elevated privileges are exercised (e.g., taking ownership, acting as part of the OS). Both success and failure events are needed for complete incident forensics.",
        },
        {
          id: "gp3-r3",
          text: "File system auditing tracks access to files and folders configured with audit SACLs. Both success and failure capture who accessed sensitive files and who was denied access, which is critical for post-incident investigation.",
        },
      ],
      feedback: {
        perfect:
          "Correct. Auditing both success and failure for all three categories provides comprehensive logging for security monitoring and incident investigation.",
        partial:
          "Auditing only success or only failure provides incomplete data. Both are needed for effective security monitoring.",
        wrong: "No Auditing leaves the organization blind to security events. All specified categories must be audited.",
      },
    },
  ],
  hints: [
    "Password policy settings are under Computer Configuration, not User Configuration, because they apply at the machine level.",
    "Removable storage read and write access are separate policy settings. Both must be configured independently.",
    "Always audit both Success and Failure events for comprehensive security monitoring.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Group Policy is the backbone of Windows enterprise security management. Proficiency with GPO configuration is essential for system administrator and security analyst roles, and is heavily tested on the CompTIA A+ exam.",
  toolRelevance: [
    "Group Policy Editor (gpedit.msc)",
    "Group Policy Management Console (gpmc.msc)",
    "gpresult /r",
    "gpupdate /force",
    "Local Security Policy (secpol.msc)",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
