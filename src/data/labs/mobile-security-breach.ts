import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "mobile-security-breach",
  version: 1,
  title: "Respond to a Lost or Stolen Corporate Device",
  tier: "advanced",
  track: "mobile-devices",
  difficulty: "challenging",
  accessLevel: "premium",
  tags: ["security", "lost-device", "stolen", "incident-response", "mdm", "remote-wipe"],
  description:
    "An employee reports their company-issued phone was stolen from a restaurant. Triage the security risk, classify the threat level, and execute the correct incident response procedure to protect corporate data.",
  estimatedMinutes: 22,
  learningObjectives: [
    "Execute a lost/stolen device incident response procedure",
    "Classify the security risk based on device contents and protection status",
    "Apply appropriate remote actions through MDM based on threat classification",
    "Document the incident and implement preventive measures",
  ],
  sortOrder: 112,
  status: "published",
  prerequisites: [],
  rendererType: "triage-remediate",
  scenarios: [
    {
      id: "sb-scenario-1",
      type: "triage-remediate",
      title: "Initial Threat Assessment",
      description:
        "A VP of Sales calls the help desk at 9 PM on Friday reporting that their iPhone 15 Pro was stolen from a restaurant table 30 minutes ago. The phone is company-issued and enrolled in Intune MDM. The VP handles sensitive client contracts and has access to the CRM with customer financial data.",
      evidence: [
        {
          type: "diagnostic",
          content:
            "MDM Status: Device last checked in 25 minutes ago (before theft). Device encryption: Enabled (AES-256). Screen lock: 6-digit PIN with Face ID. Auto-lock: After 1 minute. Find My iPhone: Enabled (device shows as Online at the restaurant location). Failed unlock attempts policy: Wipe after 10 attempts.",
        },
        {
          type: "log",
          content:
            "Intune compliance: Compliant. Apps installed: Outlook (corporate email), Salesforce (CRM with 2,300 client records), Teams, OneDrive (synced corporate files including Q4 contracts), Authenticator (MFA for 6 corporate services). VPN profile: Configured for corporate network access. Last email received: 22 minutes ago (still syncing).",
        },
      ],
      classifications: [
        {
          id: "sb1-class-high",
          label: "HIGH risk - Sensitive data actively accessible on encrypted but stolen device",
          description:
            "The device contains CRM access to 2,300 client financial records, synced corporate contracts, and MFA tokens for 6 services. While encrypted and PIN-protected, the device is online and may still have an active session if Face ID unlocked it recently within the auto-lock window.",
        },
        {
          id: "sb1-class-medium",
          label: "MEDIUM risk - Device is encrypted and PIN protected",
          description:
            "The encryption and PIN protection provide adequate security without immediate action needed.",
        },
        {
          id: "sb1-class-low",
          label: "LOW risk - Find My iPhone can locate and recover the device",
          description:
            "The device can be tracked and recovered, so there is minimal risk.",
        },
      ],
      correctClassificationId: "sb1-class-high",
      remediations: [
        {
          id: "sb1-rem-immediate",
          label: "Immediately: Enable Lost Mode via Find My to lock the screen, revoke the Authenticator MFA tokens, disable the Salesforce and Outlook sessions server-side, and initiate a remote wipe through Intune while documenting all actions with timestamps",
          description: "A multi-layered immediate response closes every active access vector: screen lock, session termination, MFA revocation, and data destruction, while documentation satisfies compliance audit requirements.",
        },
        {
          id: "sb1-rem-wait",
          label: "Wait until Monday for the security team to handle it since the phone is encrypted",
          description: "Delaying response by 60+ hours leaves active sessions and MFA tokens exposed on a stolen device, risking breach of 2,300 client financial records.",
        },
        {
          id: "sb1-rem-track-only",
          label: "Enable Lost Mode with a message asking the finder to return it and wait 24 hours before escalating",
          description: "A passive recovery approach is appropriate for lost personal devices but fails to protect corporate data on a confirmed stolen device with sensitive access.",
        },
      ],
      correctRemediationId: "sb1-rem-immediate",
      rationales: [
        {
          id: "sb1-r1",
          text: "With active access to 2,300 client records and corporate contracts, delay is unacceptable. Lost Mode immediately locks the device. Revoking MFA tokens prevents the Authenticator from being used even if the device is accessed. Server-side session termination for Salesforce and Outlook removes active access. A remote wipe through Intune ensures data destruction if the device is not recovered. Timestamped documentation satisfies compliance audit requirements.",
        },
        {
          id: "sb1-r2",
          text: "Waiting until Monday gives a thief 60+ hours to potentially access corporate data. If the auto-lock has not engaged or a session is active, client financial records could be compromised, triggering breach notification obligations.",
        },
        {
          id: "sb1-r3",
          text: "Lost Mode with a return message is appropriate for a lost personal device, not a stolen corporate device with sensitive financial data access.",
        },
      ],
      correctRationaleId: "sb1-r1",
      feedback: {
        perfect:
          "Correct. Immediate multi-layered response: Lost Mode locks the device, MFA revocation blocks authentication, session termination removes active access, and remote wipe ensures data destruction. Documentation covers compliance requirements.",
        partial:
          "Lost Mode alone is insufficient. Active sessions and MFA tokens must also be revoked to prevent data access through authenticated sessions.",
        wrong: "Delay with sensitive data at stake is a serious security failure. Immediate action is required for stolen devices with corporate data access.",
      },
    },
    {
      id: "sb-scenario-2",
      type: "triage-remediate",
      title: "Compromised MFA Token Response",
      description:
        "Fifteen minutes after the remote wipe was initiated, the Intune dashboard shows the device has gone offline. The wipe command is queued but not confirmed. The security team reviews the Authenticator tokens that were on the device and discovers the VP used the same phone for MFA on: corporate email, Salesforce CRM, AWS console (admin), corporate VPN, banking portal for expense reports, and the HR system with employee SSN access.",
      evidence: [
        {
          type: "diagnostic",
          content:
            "Remote wipe status: Pending (device offline). Authenticator had 6 TOTP tokens configured. The Salesforce session was successfully terminated. Outlook ActiveSync was disabled. However, the AWS console and HR system do not have session management integrated with Intune. The VP's AWS account has admin privileges.",
        },
        {
          type: "log",
          content:
            "AWS CloudTrail shows the last login from the VP's account was 4 hours ago from a known office IP. No suspicious login attempts detected so far. The HR system audit log shows the VP accessed employee records at 2 PM today from her laptop. No phone-based access detected.",
        },
      ],
      classifications: [
        {
          id: "sb2-class-credential",
          label: "Credential exposure risk requiring password resets for all services with MFA on the stolen device",
          description:
            "Even though the device may be wiped, the TOTP seeds could have been extracted if the device was accessed before going offline. All services using MFA from this device need credential rotation.",
        },
        {
          id: "sb2-class-contained",
          label: "Threat contained since the wipe was issued and sessions were terminated",
          description:
            "The remote wipe and session termination have addressed the immediate threat.",
        },
        {
          id: "sb2-class-monitoring",
          label: "Monitoring only since no suspicious activity has been detected",
          description:
            "CloudTrail and audit logs show no unauthorized access, so monitoring is sufficient.",
        },
      ],
      correctClassificationId: "sb2-class-credential",
      remediations: [
        {
          id: "sb2-rem-rotate-all",
          label: "Reset the VP's passwords for all 6 services, regenerate MFA tokens on a new device, revoke all active API keys and sessions for AWS, and enable enhanced monitoring on the AWS and HR accounts for 30 days",
          description: "Full credential rotation invalidates any extracted passwords or TOTP seeds, while enhanced monitoring catches delayed unauthorized access attempts over the following month.",
        },
        {
          id: "sb2-rem-wait-wipe",
          label: "Wait for the remote wipe to confirm before taking further action",
          description: "Waiting for an unconfirmed wipe leaves a window where extracted credentials could be used, and the device may never come back online to complete the wipe.",
        },
        {
          id: "sb2-rem-monitor",
          label: "Just monitor the accounts for suspicious activity since no unauthorized access has been detected",
          description: "Passive monitoring assumes that absence of detected activity means no compromise, but sophisticated attackers may delay credential use to avoid detection.",
        },
      ],
      correctRemediationId: "sb2-rem-rotate-all",
      rationales: [
        {
          id: "sb2-r1",
          text: "The wipe is pending and unconfirmed. TOTP seeds could have been extracted from the device before it went offline. Resetting all passwords invalidates stolen credentials. Regenerating MFA on a new device invalidates the old TOTP seeds. Revoking AWS API keys and sessions prevents programmatic access. Enhanced monitoring catches any delayed unauthorized access attempts.",
        },
        {
          id: "sb2-r2",
          text: "Waiting for wipe confirmation leaves a window where extracted credentials could be used. The wipe may never complete if the device stays offline. Proactive credential rotation is the security-first approach.",
        },
        {
          id: "sb2-r3",
          text: "Absence of evidence is not evidence of absence. Sophisticated attackers may wait before using stolen credentials. Proactive rotation eliminates the risk entirely.",
        },
      ],
      correctRationaleId: "sb2-r1",
      feedback: {
        perfect:
          "Correct. With an unconfirmed wipe, assume credentials are compromised. Full password rotation, MFA regeneration, session revocation, and enhanced monitoring cover all attack vectors.",
        partial:
          "Waiting for wipe confirmation is risky. The device may never come online again, and credentials could have been extracted before it went offline.",
        wrong: "No suspicious activity does not mean no threat. Proactive credential rotation is always required for stolen devices with authentication tokens.",
      },
    },
    {
      id: "sb-scenario-3",
      type: "triage-remediate",
      title: "Post-Incident Remediation and Prevention",
      description:
        "The VP has a new iPhone provisioned and all credentials rotated. The stolen device's remote wipe confirmed 6 hours later when it briefly came online. Leadership asks the IT security team to prevent this from happening again.",
      evidence: [
        {
          type: "diagnostic",
          content:
            "Incident review reveals: The device was stolen while physically accessible on a restaurant table. The VP had 6 MFA tokens on a single device with no backup MFA method. The corporate data on the device (Salesforce, email, OneDrive) had no conditional access policies limiting which devices could access them. The response took 15 minutes from report to initial lockdown.",
        },
        {
          type: "observation",
          content:
            "Other executives have similar device configurations: single device for all MFA, no conditional access, full CRM data cached locally. The company has 340 employees with corporate devices but no formal stolen device response procedure document.",
        },
      ],
      classifications: [
        {
          id: "sb3-class-policy",
          label: "Systemic policy gaps in device security, MFA resilience, and incident response procedures",
          description:
            "The incident exposed multiple organizational security gaps: single-device MFA, no conditional access, excessive local data caching, and no documented response procedure.",
        },
        {
          id: "sb3-class-user",
          label: "User negligence by the VP who left the phone on the table",
          description:
            "The VP should have been more careful with the corporate device.",
        },
        {
          id: "sb3-class-technical",
          label: "Technical failure of the MDM system to wipe the device immediately",
          description:
            "The MDM should have wiped the device faster.",
        },
      ],
      correctClassificationId: "sb3-class-policy",
      remediations: [
        {
          id: "sb3-rem-comprehensive",
          label: "Implement: (1) Conditional access policies requiring compliant devices for sensitive apps, (2) Mandatory backup MFA method for all accounts, (3) Formal stolen device response procedure with SLA timelines, (4) Reduce locally cached data through app protection policies, (5) Security awareness training on physical device security",
          description: "A defense-in-depth approach addresses every systemic gap exposed by the incident, protecting all 340 corporate devices against future theft scenarios.",
        },
        {
          id: "sb3-rem-blame-user",
          label: "Discipline the VP for carelessness and send a company-wide reminder about device security",
          description: "Punitive action targets one individual while ignoring the organizational security gaps that allowed a single device theft to threaten thousands of records.",
        },
        {
          id: "sb3-rem-restrict-access",
          label: "Remove Salesforce and CRM access from all mobile devices",
          description: "Eliminating mobile CRM access removes legitimate business functionality instead of implementing proper security controls that allow safe mobile use.",
        },
      ],
      correctRemediationId: "sb3-rem-comprehensive",
      rationales: [
        {
          id: "sb3-r1",
          text: "A comprehensive security improvement addresses all gaps: Conditional access limits data exposure if a device is compromised. Backup MFA methods ensure credential rotation does not lock users out. A documented response procedure ensures consistent, fast incident handling. App protection policies reduce local data caching. Training addresses the human factor without blame, reducing future incidents across all 340 employees.",
        },
        {
          id: "sb3-r2",
          text: "Blaming the user ignores systemic issues. Devices can be stolen from anyone. The organization's security posture should withstand device loss without catastrophic data exposure.",
        },
        {
          id: "sb3-r3",
          text: "Removing mobile access to CRM eliminates legitimate business functionality. The solution is controlled access with proper security policies, not removing access entirely.",
        },
      ],
      correctRationaleId: "sb3-r1",
      feedback: {
        perfect:
          "Excellent. A comprehensive policy improvement addressing conditional access, MFA resilience, incident procedures, data caching, and training creates defense in depth against future device theft incidents.",
        partial:
          "Blaming the user or restricting access does not address the systemic security gaps. Any employee's device could be stolen.",
        wrong: "Punitive measures and access removal are reactive approaches that do not improve the organization's security posture.",
      },
    },
  ],
  hints: [
    "A stolen device with active sessions is a HIGH risk regardless of encryption. Sessions may still be authenticated within the auto-lock window.",
    "When a device with MFA tokens is stolen, assume all TOTP seeds are compromised and rotate credentials for every service.",
    "Post-incident remediation should address systemic gaps, not blame individual users. Focus on policy improvements that protect all 340 devices.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Incident response for lost/stolen devices is a critical IT security skill. Organizations assess candidates on their ability to act decisively under pressure, cover all attack vectors, and recommend systemic improvements after incidents.",
  toolRelevance: [
    "Microsoft Intune Remote Actions",
    "Find My iPhone / Find My Device",
    "Azure AD Conditional Access",
    "AWS CloudTrail",
    "Incident Response Documentation",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
