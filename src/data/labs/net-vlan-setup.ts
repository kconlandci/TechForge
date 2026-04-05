import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "net-vlan-setup",
  version: 1,
  title: "VLAN Configuration for Department Separation",
  tier: "intermediate",
  track: "networking",
  difficulty: "moderate",
  accessLevel: "free",
  tags: ["networking", "vlan", "segmentation", "switch", "security"],
  description:
    "Configure VLANs on a managed switch to separate traffic between departments: Sales, Engineering, and Management for improved security and performance.",
  estimatedMinutes: 15,
  learningObjectives: [
    "Create and assign VLANs to switch ports for traffic segmentation",
    "Configure trunk ports to carry multiple VLANs between switches",
    "Understand the difference between access and trunk port modes",
    "Plan VLAN assignments based on organizational requirements",
  ],
  sortOrder: 208,
  status: "published",
  prerequisites: [],
  rendererType: "toggle-config",
  scenarios: [
    {
      type: "toggle-config",
      id: "nvs-scenario-1",
      title: "VLAN Port Assignments",
      description:
        "Assign switch ports to the correct VLANs based on department locations. VLAN 10 = Sales (Ports 1-8), VLAN 20 = Engineering (Ports 9-16), VLAN 30 = Management (Ports 17-20), VLAN 99 = Trunk uplinks (Ports 23-24).",
      targetSystem: "Floor 1 Access Switch — VLAN Assignments",
      items: [
        {
          id: "sales-ports",
          label: "Ports 1-8 — VLAN Assignment",
          detail: "Sales department workstations",
          currentState: "VLAN 1 (Default)",
          correctState: "VLAN 10 (Sales)",
          states: ["VLAN 1 (Default)", "VLAN 10 (Sales)", "VLAN 20 (Engineering)", "VLAN 30 (Management)"],
          rationaleId: "r-sales",
        },
        {
          id: "eng-ports",
          label: "Ports 9-16 — VLAN Assignment",
          detail: "Engineering department workstations and development servers",
          currentState: "VLAN 1 (Default)",
          correctState: "VLAN 20 (Engineering)",
          states: ["VLAN 1 (Default)", "VLAN 10 (Sales)", "VLAN 20 (Engineering)", "VLAN 30 (Management)"],
          rationaleId: "r-eng",
        },
        {
          id: "mgmt-ports",
          label: "Ports 17-20 — VLAN Assignment",
          detail: "Management offices with access to financial systems",
          currentState: "VLAN 1 (Default)",
          correctState: "VLAN 30 (Management)",
          states: ["VLAN 1 (Default)", "VLAN 10 (Sales)", "VLAN 20 (Engineering)", "VLAN 30 (Management)"],
          rationaleId: "r-mgmt",
        },
        {
          id: "uplink-mode",
          label: "Ports 23-24 — Port Mode",
          detail: "Uplink ports connecting to the core switch",
          currentState: "Access",
          correctState: "Trunk (All VLANs)",
          states: ["Access", "Trunk (All VLANs)", "Trunk (VLAN 10 only)"],
          rationaleId: "r-trunk",
        },
      ],
      rationales: [
        {
          id: "r-sales",
          text: "Sales ports must be assigned to VLAN 10 to isolate sales traffic from engineering and management networks.",
        },
        {
          id: "r-eng",
          text: "Engineering ports on VLAN 20 keep development traffic separate, preventing accidental access to financial or sales systems.",
        },
        {
          id: "r-mgmt",
          text: "Management VLAN 30 isolates sensitive financial system traffic from the rest of the network.",
        },
        {
          id: "r-trunk",
          text: "Trunk ports must carry all VLANs to the core switch so that inter-VLAN routing and shared resources (printers, servers) remain accessible through the router.",
        },
      ],
      feedback: {
        perfect: "Excellent! All departments are properly segmented with trunk ports carrying all VLANs to the core switch for inter-VLAN routing.",
        partial: "Department assignments are partially correct. Ensure each department maps to its designated VLAN and uplinks are configured as trunks.",
        wrong: "Leaving all ports on VLAN 1 provides no segmentation. Each department group needs its own VLAN assignment.",
      },
    },
    {
      type: "toggle-config",
      id: "nvs-scenario-2",
      title: "Trunk Port Security",
      description:
        "The trunk ports between the access switch and core switch need to be hardened. Configure trunk settings to allow only the VLANs in use.",
      targetSystem: "Core Switch — Trunk Port Configuration",
      items: [
        {
          id: "allowed-vlans",
          label: "Trunk Allowed VLANs",
          detail: "Which VLANs are permitted across the trunk link",
          currentState: "All (1-4094)",
          correctState: "10, 20, 30, 99",
          states: ["All (1-4094)", "10, 20, 30, 99", "1, 10, 20, 30", "10, 20, 30"],
          rationaleId: "r-allowed",
        },
        {
          id: "native-vlan",
          label: "Native VLAN",
          detail: "Untagged VLAN on the trunk port",
          currentState: "VLAN 1",
          correctState: "VLAN 99 (Unused)",
          states: ["VLAN 1", "VLAN 10", "VLAN 99 (Unused)"],
          rationaleId: "r-native",
        },
        {
          id: "dtp-mode",
          label: "DTP (Dynamic Trunking Protocol)",
          detail: "Automatic trunk negotiation protocol",
          currentState: "Desirable",
          correctState: "Disabled (Nonegotiate)",
          states: ["Desirable", "Auto", "Disabled (Nonegotiate)"],
          rationaleId: "r-dtp",
        },
      ],
      rationales: [
        {
          id: "r-allowed",
          text: "Restricting trunk VLANs to only those in use (10, 20, 30, and 99 for management) prevents unauthorized VLAN traffic and reduces the attack surface.",
        },
        {
          id: "r-native",
          text: "Changing the native VLAN from the default (VLAN 1) to an unused VLAN prevents VLAN hopping attacks that exploit the default native VLAN.",
        },
        {
          id: "r-dtp",
          text: "DTP can be exploited to create unauthorized trunk connections. Disabling it ensures only manually configured trunks are allowed.",
        },
      ],
      feedback: {
        perfect: "Perfect! The trunk is hardened with restricted VLANs, a non-default native VLAN, and DTP disabled.",
        partial: "Some hardening steps are correct but all three settings should be tightened for proper trunk security.",
        wrong: "Default trunk settings are insecure. Restrict allowed VLANs, change the native VLAN, and disable DTP.",
      },
    },
    {
      type: "toggle-config",
      id: "nvs-scenario-3",
      title: "Voice VLAN for IP Phones",
      description:
        "VoIP phones are being deployed and need their own VLAN. Configure ports where phones daisy-chain to workstations so both voice and data traffic are properly separated.",
      targetSystem: "Access Switch — Voice VLAN Settings",
      items: [
        {
          id: "voice-vlan",
          label: "Voice VLAN — Assignment",
          detail: "Dedicated VLAN for VoIP phone traffic on ports 1-16",
          currentState: "None",
          correctState: "VLAN 50 (Voice)",
          states: ["None", "VLAN 10 (Sales)", "VLAN 50 (Voice)", "VLAN 1 (Default)"],
          rationaleId: "r-voice-vlan",
        },
        {
          id: "voice-qos",
          label: "QoS Priority — Voice VLAN",
          detail: "Quality of Service marking for voice traffic",
          currentState: "Best Effort (Default)",
          correctState: "Priority (CoS 5 / DSCP EF)",
          states: ["Best Effort (Default)", "Priority (CoS 5 / DSCP EF)", "Background (Low)"],
          rationaleId: "r-qos",
        },
        {
          id: "data-vlan-mode",
          label: "Data VLAN — Port Mode",
          detail: "How the data (PC) traffic is handled on the same port",
          currentState: "Trunk",
          correctState: "Access",
          states: ["Access", "Trunk", "Dynamic"],
          rationaleId: "r-data-mode",
        },
      ],
      rationales: [
        {
          id: "r-voice-vlan",
          text: "A dedicated voice VLAN separates phone traffic from data traffic, allowing QoS policies to prioritize calls and preventing data congestion from affecting call quality.",
        },
        {
          id: "r-qos",
          text: "Voice traffic requires low latency and jitter. Marking voice packets with CoS 5 / DSCP EF ensures switches and routers prioritize them over bulk data transfers.",
        },
        {
          id: "r-data-mode",
          text: "The data port should remain in access mode for its assigned VLAN. The switch handles voice VLAN tagging separately — the port does not need to be a full trunk.",
        },
      ],
      feedback: {
        perfect: "Excellent! Voice and data are properly separated with QoS prioritization ensuring call quality.",
        partial: "The VLAN separation is partially correct. Ensure voice traffic gets both its own VLAN and QoS priority.",
        wrong: "VoIP phones need a dedicated VLAN with QoS priority to ensure call quality. Data ports remain in access mode.",
      },
    },
  ],
  hints: [
    "Each department should have its own VLAN to segment broadcast domains and improve security.",
    "Trunk ports carry tagged traffic from multiple VLANs between switches — they should be restricted to only necessary VLANs.",
    "Voice VLANs allow a single switch port to serve both a daisy-chained phone and PC on separate VLANs.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "VLAN configuration is foundational knowledge for network technicians. Properly segmented networks are a requirement for PCI-DSS, HIPAA, and other compliance frameworks that many employers must follow.",
  toolRelevance: ["switch CLI", "switch web interface", "VLAN configuration", "network diagram"],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
