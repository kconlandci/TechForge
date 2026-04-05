import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "net-wireless-security",
  version: 1,
  title: "Wireless Network Security Settings",
  tier: "intermediate",
  track: "networking",
  difficulty: "moderate",
  accessLevel: "free",
  tags: ["networking", "wireless", "security", "encryption", "wi-fi"],
  description:
    "Select and configure the appropriate wireless security settings for different environments: a corporate office, guest network, and IoT device network.",
  estimatedMinutes: 12,
  learningObjectives: [
    "Compare WPA2 and WPA3 security protocols and their use cases",
    "Choose between Personal (PSK) and Enterprise (802.1X) authentication",
    "Configure appropriate settings for guest and IoT networks",
    "Identify deprecated wireless security standards and their risks",
  ],
  sortOrder: 210,
  status: "published",
  prerequisites: [],
  rendererType: "action-rationale",
  scenarios: [
    {
      type: "action-rationale",
      id: "nws-scenario-1",
      title: "Corporate Office Wi-Fi Security",
      context:
        "A 50-person company is setting up their main office Wi-Fi. They have a RADIUS server and Active Directory. The network will carry sensitive business data including financial records. All company laptops support WPA3.",
      actions: [
        { id: "wpa3-enterprise", label: "WPA3-Enterprise with 802.1X (RADIUS)", color: "green" },
        { id: "wpa2-psk", label: "WPA2-Personal with a strong shared password", color: "yellow" },
        { id: "wpa3-personal", label: "WPA3-Personal (SAE)", color: "blue" },
        { id: "open-captive", label: "Open network with a captive portal", color: "red" },
      ],
      correctActionId: "wpa3-enterprise",
      rationales: [
        {
          id: "r-enterprise",
          text: "WPA3-Enterprise with RADIUS provides individual user authentication, automatic key rotation, and centralized access control. Each user has unique credentials tied to Active Directory, and access can be revoked per-user.",
        },
        {
          id: "r-psk",
          text: "A shared password (PSK) means all 50 employees know the same key. When someone leaves, the password must be changed on every device. This does not scale for corporate environments.",
        },
        {
          id: "r-personal",
          text: "WPA3-Personal improves key exchange but still uses a shared password. It lacks per-user authentication and audit trails required for sensitive business data.",
        },
      ],
      correctRationaleId: "r-enterprise",
      feedback: {
        perfect: "Correct! WPA3-Enterprise with RADIUS provides individual authentication, audit logging, and centralized credential management for a corporate environment.",
        partial: "You chose a secure encryption standard but consider how 50 employees would share and rotate a single password.",
        wrong: "A corporate network handling financial data needs per-user authentication and centralized management, not shared passwords or open access.",
      },
    },
    {
      type: "action-rationale",
      id: "nws-scenario-2",
      title: "Guest Wi-Fi Network",
      context:
        "The office needs a guest Wi-Fi network for visitors in the lobby. It should provide internet access but no access to internal resources. The password will be posted on a sign at reception. Some visitor devices are older and may not support WPA3.",
      actions: [
        { id: "wpa2-psk-guest", label: "WPA2-Personal (AES) with client isolation enabled", color: "green" },
        { id: "open-network", label: "Open network with no password", color: "red" },
        { id: "wep-simple", label: "WEP with a simple password for convenience", color: "red" },
        { id: "wpa3-only", label: "WPA3-Personal only", color: "yellow" },
      ],
      correctActionId: "wpa2-psk-guest",
      rationales: [
        {
          id: "r-wpa2-guest",
          text: "WPA2-Personal with AES provides reasonable encryption for a guest network. Client isolation prevents guests from seeing each other's traffic. WPA2 ensures compatibility with older devices.",
        },
        {
          id: "r-open",
          text: "An open network transmits all guest traffic unencrypted, exposing email, browsing, and credentials to anyone nearby with a packet sniffer.",
        },
        {
          id: "r-wep",
          text: "WEP is completely broken and can be cracked in minutes. It provides no real security and should never be used.",
        },
        {
          id: "r-wpa3-compat",
          text: "WPA3-only would exclude older visitor devices that do not support it. Guest networks should prioritize broad compatibility.",
        },
      ],
      correctRationaleId: "r-wpa2-guest",
      feedback: {
        perfect: "Correct! WPA2-Personal with client isolation balances security and compatibility for a guest network.",
        partial: "You are thinking about security, but consider device compatibility for visitors with older devices.",
        wrong: "Open and WEP networks expose guest traffic. WPA2-Personal provides encryption while remaining widely compatible.",
      },
    },
    {
      type: "action-rationale",
      id: "nws-scenario-3",
      title: "IoT Device Network",
      context:
        "The office has smart thermostats, security cameras, and smart displays. These devices need Wi-Fi but most only support WPA2. They should be isolated from the corporate network. A technician maintains them quarterly and needs the network password.",
      actions: [
        { id: "separate-wpa2", label: "Separate SSID on dedicated VLAN with WPA2-Personal and firewall rules", color: "green" },
        { id: "corporate-net", label: "Connect IoT devices to the corporate WPA3-Enterprise network", color: "red" },
        { id: "open-iot", label: "Create an open network with MAC filtering for IoT devices", color: "red" },
      ],
      correctActionId: "separate-wpa2",
      rationales: [
        {
          id: "r-separate",
          text: "A dedicated IoT SSID on its own VLAN segments these often-vulnerable devices from the corporate network. WPA2-Personal works with all IoT devices and firewall rules control what IoT traffic can reach.",
        },
        {
          id: "r-corp-net",
          text: "IoT devices rarely support 802.1X. Connecting them to the corporate network creates a security risk since many IoT devices have known vulnerabilities and weak update mechanisms.",
        },
        {
          id: "r-open-mac",
          text: "MAC filtering is easily bypassed by spoofing. An open network with MAC filtering provides false security and no encryption for camera feeds and sensor data.",
        },
      ],
      correctRationaleId: "r-separate",
      feedback: {
        perfect: "Correct! A dedicated VLAN with WPA2 isolates IoT devices from corporate resources while providing compatible encryption.",
        partial: "Separating IoT devices is the right idea. Make sure the solution includes both network isolation and encryption.",
        wrong: "IoT devices are high-risk and should never share a network with corporate resources. Isolation and encryption are both required.",
      },
    },
  ],
  hints: [
    "Enterprise environments with RADIUS should use 802.1X for per-user authentication rather than shared passwords.",
    "Guest networks must balance security with compatibility — not all visitor devices support the latest standards.",
    "IoT devices are often vulnerable and should be isolated on their own VLAN with restricted firewall rules.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Wireless security configuration is a frequent interview topic for IT support and network admin positions. Understanding when to use Enterprise vs Personal mode demonstrates real-world judgment.",
  toolRelevance: ["Wi-Fi analyzer", "wireless AP admin interface", "RADIUS server", "Group Policy"],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
