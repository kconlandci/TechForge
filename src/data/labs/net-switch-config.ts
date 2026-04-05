import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "net-switch-config",
  version: 1,
  title: "Managed Switch Configuration Basics",
  tier: "intermediate",
  track: "networking",
  difficulty: "moderate",
  accessLevel: "free",
  tags: ["networking", "switch", "configuration", "managed-switch", "infrastructure"],
  description:
    "Configure a managed network switch for a small office including port speeds, PoE settings, and basic security features.",
  estimatedMinutes: 15,
  learningObjectives: [
    "Configure port speed and duplex settings on a managed switch",
    "Enable and configure Power over Ethernet for connected devices",
    "Set up port security to limit MAC addresses per port",
    "Understand spanning tree and loop prevention basics",
  ],
  sortOrder: 207,
  status: "published",
  prerequisites: [],
  rendererType: "toggle-config",
  scenarios: [
    {
      type: "toggle-config",
      id: "nsc-scenario-1",
      title: "New Office Switch Setup",
      description:
        "A 24-port managed PoE switch has been installed for a small office. Configure the ports for the connected devices: workstations, VoIP phones, and a wireless access point.",
      targetSystem: "Cisco SG350-28P Managed Switch",
      items: [
        {
          id: "port-1-speed",
          label: "Ports 1-20 (Workstations) — Speed",
          detail: "Standard desktop PCs connected via Cat5e cabling",
          currentState: "10 Mbps",
          correctState: "Auto-negotiate",
          states: ["10 Mbps", "100 Mbps", "1 Gbps", "Auto-negotiate"],
          rationaleId: "r-speed",
        },
        {
          id: "port-21-poe",
          label: "Ports 21-23 (VoIP Phones) — PoE",
          detail: "Cisco IP phones requiring power from the switch",
          currentState: "Disabled",
          correctState: "PoE+ (30W)",
          states: ["Disabled", "PoE (15.4W)", "PoE+ (30W)"],
          rationaleId: "r-poe-phone",
        },
        {
          id: "port-24-poe",
          label: "Port 24 (Wireless AP) — PoE",
          detail: "Ubiquiti UAP-AC-Pro access point mounted on the ceiling",
          currentState: "PoE (15.4W)",
          correctState: "PoE+ (30W)",
          states: ["Disabled", "PoE (15.4W)", "PoE+ (30W)"],
          rationaleId: "r-poe-ap",
        },
        {
          id: "stp-mode",
          label: "Spanning Tree Protocol — Mode",
          detail: "Loop prevention for the network",
          currentState: "Disabled",
          correctState: "RSTP",
          states: ["Disabled", "STP", "RSTP"],
          rationaleId: "r-stp",
        },
      ],
      rationales: [
        {
          id: "r-speed",
          text: "Auto-negotiate is the recommended setting for workstation ports. It allows the switch and NIC to agree on the best speed and duplex, avoiding mismatches.",
        },
        {
          id: "r-poe-phone",
          text: "Cisco IP phones with color displays and gigabit passthrough typically require PoE+ (802.3at) delivering up to 30W for full functionality.",
        },
        {
          id: "r-poe-ap",
          text: "The UAP-AC-Pro requires PoE+ (802.3at) for full functionality including both radios. Standard PoE (15.4W) may cause the AP to disable the 5 GHz radio.",
        },
        {
          id: "r-stp",
          text: "RSTP (Rapid Spanning Tree Protocol) provides fast convergence for loop prevention. Leaving STP disabled risks broadcast storms if someone accidentally creates a loop.",
        },
      ],
      feedback: {
        perfect: "Excellent! All ports are optimally configured for their connected devices with proper PoE and loop prevention.",
        partial: "Some settings need adjustment. Review PoE wattage requirements for each device type and ensure loop prevention is active.",
        wrong: "Review the power and speed requirements for each device type. VoIP phones and APs have specific PoE needs.",
      },
    },
    {
      type: "toggle-config",
      id: "nsc-scenario-2",
      title: "Port Security Configuration",
      description:
        "Implement port security on the switch to prevent unauthorized devices from connecting. The office has a strict policy against personal devices on the wired network.",
      targetSystem: "Cisco SG350-28P — Port Security Settings",
      items: [
        {
          id: "port-security-mode",
          label: "Port Security — Status",
          detail: "Enable or disable MAC-based port security on access ports",
          currentState: "Disabled",
          correctState: "Enabled",
          states: ["Disabled", "Enabled"],
          rationaleId: "r-enable-sec",
        },
        {
          id: "max-mac",
          label: "Maximum MAC Addresses Per Port",
          detail: "How many unique MAC addresses are allowed on each workstation port",
          currentState: "Unlimited",
          correctState: "2",
          states: ["1", "2", "5", "Unlimited"],
          rationaleId: "r-max-mac",
        },
        {
          id: "violation-action",
          label: "Violation Action",
          detail: "What happens when an unauthorized MAC address is detected",
          currentState: "Protect (drop traffic silently)",
          correctState: "Restrict (drop traffic and log)",
          states: ["Protect (drop traffic silently)", "Restrict (drop traffic and log)", "Shutdown (disable port)"],
          rationaleId: "r-violation",
        },
      ],
      rationales: [
        {
          id: "r-enable-sec",
          text: "Port security must be enabled to enforce the policy against unauthorized devices. Without it, any device can connect to any port.",
        },
        {
          id: "r-max-mac",
          text: "Setting maximum to 2 allows a workstation and a VoIP phone daisy-chained through the same port. Setting to 1 would block phones that pass through to the PC.",
        },
        {
          id: "r-violation",
          text: "Restrict mode drops unauthorized traffic and generates a syslog alert, allowing monitoring without disabling the port. Shutdown is too aggressive for most offices.",
        },
      ],
      feedback: {
        perfect: "Perfect! Port security is enabled with sensible limits that accommodate daisy-chained phones while logging violations.",
        partial: "Port security direction is right but check the MAC limit considering VoIP phones that pass through to workstations.",
        wrong: "Port security is essential for preventing unauthorized access. Consider the typical device configuration at each desk.",
      },
    },
    {
      type: "toggle-config",
      id: "nsc-scenario-3",
      title: "Switch Management Access",
      description:
        "Secure the management interface of the switch. Currently it is accessible via HTTP on the default settings.",
      targetSystem: "Cisco SG350-28P — Management Settings",
      items: [
        {
          id: "mgmt-protocol",
          label: "Management Protocol",
          detail: "Protocol used to access the switch web interface",
          currentState: "HTTP",
          correctState: "HTTPS Only",
          states: ["HTTP", "HTTPS Only", "HTTP and HTTPS"],
          rationaleId: "r-https",
        },
        {
          id: "default-password",
          label: "Admin Password",
          detail: "The default admin password is still set",
          currentState: "Default (cisco)",
          correctState: "Custom Strong Password",
          states: ["Default (cisco)", "Custom Strong Password"],
          rationaleId: "r-password",
        },
        {
          id: "mgmt-vlan",
          label: "Management VLAN",
          detail: "Which VLAN is used for switch management traffic",
          currentState: "VLAN 1 (Default)",
          correctState: "Dedicated Management VLAN",
          states: ["VLAN 1 (Default)", "Dedicated Management VLAN"],
          rationaleId: "r-mgmt-vlan",
        },
      ],
      rationales: [
        {
          id: "r-https",
          text: "HTTPS encrypts management traffic including login credentials. HTTP sends passwords in plaintext, allowing anyone on the network to capture them.",
        },
        {
          id: "r-password",
          text: "Default passwords are publicly known. A strong custom password prevents unauthorized management access to the switch.",
        },
        {
          id: "r-mgmt-vlan",
          text: "Using a dedicated management VLAN isolates switch administration from regular user traffic, reducing the attack surface for the management interface.",
        },
      ],
      feedback: {
        perfect: "Excellent! The switch management is secured with HTTPS, a strong password, and an isolated management VLAN.",
        partial: "Good security improvements but ensure all three areas are addressed — protocol, credentials, and network isolation.",
        wrong: "Default settings leave the switch vulnerable. Each setting needs to be hardened for a production environment.",
      },
    },
  ],
  hints: [
    "Auto-negotiate is generally preferred over hard-coding speeds to prevent duplex mismatches.",
    "Check the PoE wattage requirements for each device — APs and IP phones often need PoE+ (30W).",
    "Default management credentials and protocols should always be changed before deploying to production.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Managed switch configuration is a daily task for network administrators. Understanding port security, PoE budgets, and management hardening demonstrates readiness for roles beyond basic desktop support.",
  toolRelevance: ["switch CLI", "switch web interface", "PoE calculator", "cable tester"],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
