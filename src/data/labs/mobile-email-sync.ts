import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "mobile-email-sync",
  version: 1,
  title: "Fix Corporate Email Sync Failures on Mobile",
  tier: "intermediate",
  track: "mobile-devices",
  difficulty: "moderate",
  accessLevel: "free",
  tags: ["email", "exchange", "activesync", "corporate", "troubleshooting"],
  description:
    "A user's corporate email stopped syncing on their phone. Investigate the configuration, server responses, and certificate status to identify the root cause and resolve the sync failure.",
  estimatedMinutes: 20,
  learningObjectives: [
    "Diagnose Exchange ActiveSync configuration issues on mobile devices",
    "Interpret email sync error codes and certificate warnings",
    "Identify the difference between authentication, certificate, and policy-based sync failures",
    "Apply correct remediation for corporate email sync issues",
  ],
  sortOrder: 105,
  status: "published",
  prerequisites: [],
  rendererType: "investigate-decide",
  scenarios: [
    {
      id: "es-scenario-1",
      type: "investigate-decide",
      title: "Exchange ActiveSync Authentication Failure",
      objective:
        "A sales manager's iPhone stopped receiving corporate email 3 days ago. She can access email on her laptop through Outlook and via the web portal. Only the phone is affected.",
      investigationData: [
        {
          id: "es1-mail-settings",
          label: "Mail Account Settings",
          content:
            "Account type: Exchange. Server: mail.contoso.com. Domain: CONTOSO. Username: jsmith. SSL: Enabled. Last successful sync: 3 days ago. Current error: 'Cannot Verify Server Identity'. The account was configured 18 months ago.",
          isCritical: true,
        },
        {
          id: "es1-certificate-info",
          label: "Server Certificate Details",
          content:
            "When browsing to https://mail.contoso.com on Safari, a certificate warning appears. The certificate was issued by 'DigiCert Global G2' and is valid. However, the certificate's Common Name is 'mail.contoso.com' but the Subject Alternative Name includes only 'autodiscover.contoso.com' and 'owa.contoso.com'. The IT department renewed the SSL certificate 4 days ago.",
          isCritical: true,
        },
        {
          id: "es1-other-phones",
          label: "Other Employee Devices",
          content:
            "Three other employees in the same department report identical email sync failures starting the same day. All are using iPhones. Two Android users report no issues.",
          isCritical: false,
        },
      ],
      actions: [
        {
          id: "es1-reconfigure-account",
          label: "Delete and re-add the Exchange account on the phone",
          color: "blue",
        },
        {
          id: "es1-report-cert",
          label: "Report to IT that the renewed SSL certificate is missing the ActiveSync SAN entry, causing iOS devices to reject the connection",
          color: "green",
        },
        {
          id: "es1-accept-cert",
          label: "Tell the user to tap 'Accept' on the certificate warning to bypass it",
          color: "orange",
        },
        {
          id: "es1-install-profile",
          label: "Install a configuration profile to trust the certificate",
          color: "blue",
        },
      ],
      correctActionId: "es1-report-cert",
      rationales: [
        {
          id: "es1-r1",
          text: "The renewed certificate is missing 'mail.contoso.com' from the Subject Alternative Names. iOS strictly validates SAN entries and will reject connections when the hostname does not match. Android is more lenient with CN matching. Reporting this to IT to fix the certificate is the correct root cause resolution.",
        },
        {
          id: "es1-r2",
          text: "Deleting and re-adding the account will not fix a server-side certificate issue. The same error will occur after reconfiguration.",
        },
        {
          id: "es1-r3",
          text: "Accepting the certificate warning on iOS is a security risk and the bypass may not persist through subsequent sync attempts. The certificate should be properly configured.",
        },
      ],
      correctRationaleId: "es1-r1",
      feedback: {
        perfect:
          "Correct. The certificate renewal dropped the mail server hostname from the SAN list. iOS enforces strict SAN validation, which explains why only iPhones are affected. The fix is a corrected certificate from IT.",
        partial:
          "Bypassing certificate warnings is a security risk and does not fix the root cause. The certificate itself needs to be corrected.",
        wrong: "The issue is server-side. Client-side changes will not resolve a malformed SSL certificate.",
      },
    },
    {
      id: "es-scenario-2",
      type: "investigate-decide",
      title: "MDM Policy Blocking Email Sync",
      objective:
        "An employee's Android phone was syncing email fine until yesterday. Now the Mail app shows 'Your device does not meet security requirements' and refuses to sync. No changes were made to the phone.",
      investigationData: [
        {
          id: "es2-security-status",
          label: "Device Security Status",
          content:
            "Android version: 14. Security patch: November 2025. Screen lock: 6-digit PIN. Encryption: Enabled. Developer options: Disabled. USB debugging: Off. Device rooted: No. Unknown sources: Disabled.",
          isCritical: false,
        },
        {
          id: "es2-mdm-policy",
          label: "MDM Compliance Check",
          content:
            "The company MDM portal shows device status: 'Non-compliant'. Reason: 'Minimum OS security patch level not met. Required: December 2025 or later. Current: November 2025.' Policy change log shows the IT security team updated the minimum patch requirement yesterday from 'October 2025' to 'December 2025'.",
          isCritical: true,
        },
        {
          id: "es2-update-check",
          label: "System Update Status",
          content:
            "Settings > System > System update shows: 'Your device is up to date. Last check: Today.' The manufacturer (Samsung) has released the December 2025 patch for this model, but the carrier (Verizon) has not yet approved it for deployment. Estimated carrier release: 2 weeks.",
          isCritical: true,
        },
      ],
      actions: [
        {
          id: "es2-sideload-patch",
          label: "Sideload the December security patch from Samsung's firmware site",
          color: "red",
        },
        {
          id: "es2-request-exception",
          label: "Contact IT to request a temporary compliance exception while the carrier patch is pending, and document the situation",
          color: "green",
        },
        {
          id: "es2-factory-reset",
          label: "Factory reset the phone to trigger a fresh compliance check",
          color: "red",
        },
        {
          id: "es2-use-web",
          label: "Tell the user to use the web portal for email until the patch arrives",
          color: "orange",
        },
      ],
      correctActionId: "es2-request-exception",
      rationales: [
        {
          id: "es2-r1",
          text: "The device is fully compliant except for a patch that is released but not yet available through the carrier. The IT team can grant a temporary MDM compliance exception or adjust the policy enforcement date. This is the standard process when policy changes outpace carrier patch distribution.",
        },
        {
          id: "es2-r2",
          text: "Sideloading firmware bypasses carrier testing and may void warranty or break carrier-specific features. It also introduces risk if the sideloaded firmware is not authentic.",
        },
        {
          id: "es2-r3",
          text: "A factory reset will not change the security patch level. The device will still be on November 2025 after the reset.",
        },
        {
          id: "es2-r4",
          text: "Using the web portal is a workaround but does not restore push notifications, calendar sync, or contacts sync that the user depends on.",
        },
      ],
      correctRationaleId: "es2-r1",
      feedback: {
        perfect:
          "Correct. When MDM policy changes outpace carrier patch distribution, the proper procedure is requesting a temporary compliance exception from IT. This maintains security oversight while acknowledging the carrier delay.",
        partial:
          "Web portal access is a reasonable workaround but does not restore full email functionality. A compliance exception is the correct procedure.",
        wrong: "That action will not change the device's security patch level or resolve the MDM compliance failure.",
      },
    },
    {
      id: "es-scenario-3",
      type: "investigate-decide",
      title: "Selective Sync Failure",
      objective:
        "A user's phone receives new emails fine, but calendar events and contacts stopped syncing a week ago. Email push notifications work. The user just changed their password as part of a routine company password rotation.",
      investigationData: [
        {
          id: "es3-sync-status",
          label: "Account Sync Settings",
          content:
            "Mail: Syncing (last sync 2 minutes ago). Calendar: Error 'Sync failed'. Contacts: Error 'Sync failed'. The account is configured as Exchange ActiveSync. After the password change, the user updated the password in the mail app and email immediately resumed working.",
          isCritical: true,
        },
        {
          id: "es3-activesync-log",
          label: "ActiveSync Server Log (from IT)",
          content:
            "The ActiveSync partnership shows: Mail folder sync: Authorized. Calendar folder sync: HTTP 401 Unauthorized. Contacts folder sync: HTTP 401 Unauthorized. The server logs indicate the calendar and contacts folder permissions are using a stale authentication token from before the password change.",
          isCritical: true,
        },
        {
          id: "es3-account-config",
          label: "Exchange Account Configuration",
          content:
            "The phone has the account configured with 'Mail Days to Sync: 1 Month', 'Sync Calendar: ON', 'Sync Contacts: ON'. There is no separate accounts for calendar or contacts. All three services use the same Exchange account.",
          isCritical: false,
        },
      ],
      actions: [
        {
          id: "es3-toggle-sync",
          label: "Toggle calendar and contacts sync off and back on to force a fresh authentication handshake for those folders",
          color: "green",
        },
        {
          id: "es3-reenter-password",
          label: "Re-enter the password in the account settings again",
          color: "blue",
        },
        {
          id: "es3-delete-account",
          label: "Delete and reconfigure the entire Exchange account",
          color: "orange",
        },
        {
          id: "es3-contact-exchange-admin",
          label: "Escalate to the Exchange admin to reset ActiveSync partnerships",
          color: "blue",
        },
      ],
      correctActionId: "es3-toggle-sync",
      rationales: [
        {
          id: "es3-r1",
          text: "The server logs show mail authentication works but calendar and contacts have stale tokens. Toggling those specific sync options off and on forces the device to renegotiate the ActiveSync partnership for those folders, obtaining fresh tokens. This is targeted and non-destructive.",
        },
        {
          id: "es3-r2",
          text: "The password was already updated and mail works. Re-entering the password will not affect the stale folder-level tokens that calendar and contacts are using.",
        },
        {
          id: "es3-r3",
          text: "Deleting and reconfiguring the entire account works but is unnecessarily disruptive. It removes all cached email, calendar data, and contacts from the device.",
        },
        {
          id: "es3-r4",
          text: "Server-side partnership reset is heavy-handed when the client-side toggle resolves the stale token issue.",
        },
      ],
      correctRationaleId: "es3-r1",
      feedback: {
        perfect:
          "Correct. Toggling the calendar and contacts sync forces a fresh ActiveSync handshake for those specific folders, replacing the stale authentication tokens without disrupting email.",
        partial:
          "Deleting the account works but removes all cached data unnecessarily. The toggle approach is less disruptive.",
        wrong: "The password is correct for mail sync. The issue is stale folder-level tokens for calendar and contacts specifically.",
      },
    },
  ],
  hints: [
    "When email works on a desktop but not a phone, the issue is usually specific to the mobile connection protocol (ActiveSync) or device configuration.",
    "Certificate errors that affect only certain device types often indicate a SAN (Subject Alternative Name) configuration issue.",
    "When only some sync categories fail after a password change, stale per-folder authentication tokens may be the cause.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Corporate email sync troubleshooting is a core skill for any help desk or mobile device support role. Understanding ActiveSync, MDM compliance, and certificate validation issues will handle the majority of email-related tickets.",
  toolRelevance: [
    "Exchange ActiveSync Settings",
    "MDM Compliance Portal",
    "SSL Certificate Viewer",
    "Device Security Settings",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
