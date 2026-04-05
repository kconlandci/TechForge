import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "net-dhcp-failure",
  version: 1,
  title: "DHCP Failure and APIPA Addresses",
  tier: "beginner",
  track: "networking",
  difficulty: "easy",
  accessLevel: "free",
  tags: ["networking", "dhcp", "apipa", "ip-addressing", "troubleshooting"],
  description:
    "Workstations are receiving 169.254.x.x APIPA addresses instead of valid IPs from the DHCP server. Diagnose and restore proper addressing.",
  estimatedMinutes: 10,
  learningObjectives: [
    "Recognize APIPA addresses as indicators of DHCP failure",
    "Troubleshoot common DHCP server and client issues",
    "Use ipconfig /release and /renew to request new DHCP leases",
    "Identify network infrastructure problems that prevent DHCP communication",
  ],
  sortOrder: 204,
  status: "published",
  prerequisites: [],
  rendererType: "action-rationale",
  scenarios: [
    {
      type: "action-rationale",
      id: "ndf-scenario-1",
      title: "Exhausted DHCP Scope",
      context:
        "Several new employees joined and their PCs all show 169.254.x.x addresses. Existing employees are fine. You check the DHCP server and see: Scope 192.168.1.100-192.168.1.150 — 50 leases available, 50 active leases, 0 available.",
      actions: [
        { id: "expand-scope", label: "Expand the DHCP scope range to include more addresses", color: "green" },
        { id: "reboot-server", label: "Reboot the DHCP server", color: "yellow" },
        { id: "static-ips", label: "Assign static IPs to all new PCs", color: "red" },
        { id: "replace-switch", label: "Replace the network switch", color: "red" },
      ],
      correctActionId: "expand-scope",
      rationales: [
        {
          id: "r-scope",
          text: "The DHCP pool is fully exhausted with zero available addresses. Expanding the scope (e.g., 192.168.1.100-192.168.1.200) provides addresses for new devices.",
        },
        {
          id: "r-reboot",
          text: "Rebooting the server does not free active leases. The pool is legitimately full, not malfunctioning.",
        },
        {
          id: "r-static",
          text: "Static IPs work as a temporary fix but defeat the purpose of DHCP and create management overhead. Expanding the scope is the proper solution.",
        },
      ],
      correctRationaleId: "r-scope",
      feedback: {
        perfect: "Correct! The DHCP scope is exhausted. Expanding the range or reducing lease duration to free addresses faster resolves the issue.",
        partial: "You chose a workaround, but the real fix is ensuring the DHCP server has enough addresses to assign.",
        wrong: "Existing users have valid leases, so the server and network are functional. The pool simply ran out of addresses.",
      },
    },
    {
      type: "action-rationale",
      id: "ndf-scenario-2",
      title: "DHCP Service Stopped",
      context:
        "After a server update last night, all workstations that restarted this morning have 169.254.x.x addresses. PCs that were left on overnight still have valid 192.168.1.x addresses. The DHCP server is powered on and reachable via ping at 192.168.1.10.",
      actions: [
        { id: "restart-service", label: "Start the DHCP Server service on the server", color: "green" },
        { id: "renew-all", label: "Run ipconfig /renew on each affected PC", color: "yellow" },
        { id: "check-cables", label: "Check all network cables in the server room", color: "red" },
      ],
      correctActionId: "restart-service",
      rationales: [
        {
          id: "r-service",
          text: "The server is reachable but DHCP is not responding. The update likely stopped the DHCP service. Starting the service immediately allows affected clients to obtain addresses.",
        },
        {
          id: "r-renew",
          text: "Renewing leases on each PC will not help if the DHCP service is not running — there is nothing to respond to the DHCP Discover packets.",
        },
        {
          id: "r-cables",
          text: "The server responds to ping, so physical connectivity is fine. The issue is the DHCP service, not the network infrastructure.",
        },
      ],
      correctRationaleId: "r-service",
      feedback: {
        perfect: "Correct! The DHCP service stopped after the update. Restarting it allows clients to obtain leases when they next renew.",
        partial: "Client-side actions will not help if the server-side service is not running. Check the service status first.",
        wrong: "Network connectivity is confirmed by ping. The problem is the DHCP service itself, not the physical network.",
      },
    },
    {
      type: "action-rationale",
      id: "ndf-scenario-3",
      title: "VLAN Misconfiguration Blocking DHCP",
      context:
        "A new conference room was wired up and connected to the network switch. All conference room PCs get 169.254.x.x addresses. PCs on other floors work fine. The switch port is in VLAN 20, but the DHCP server is in VLAN 10. There is no DHCP relay configured for VLAN 20.",
      actions: [
        { id: "add-relay", label: "Configure a DHCP relay (ip helper-address) for VLAN 20", color: "green" },
        { id: "move-vlan", label: "Move conference room ports to VLAN 10", color: "yellow" },
        { id: "new-dhcp", label: "Install a second DHCP server in VLAN 20", color: "red" },
      ],
      correctActionId: "add-relay",
      rationales: [
        {
          id: "r-relay",
          text: "DHCP broadcasts do not cross VLAN boundaries. Configuring a DHCP relay agent (ip helper-address) on the VLAN 20 interface forwards DHCP requests to the server in VLAN 10.",
        },
        {
          id: "r-move",
          text: "Moving to VLAN 10 would work but defeats the purpose of network segmentation. VLANs are configured for a reason.",
        },
        {
          id: "r-second",
          text: "A second DHCP server is unnecessary overhead. DHCP relay is the standard solution for serving DHCP across VLANs.",
        },
      ],
      correctRationaleId: "r-relay",
      feedback: {
        perfect: "Correct! DHCP relay (ip helper-address) forwards broadcast DHCP requests across VLAN boundaries to the centralized DHCP server.",
        partial: "Your approach would restore DHCP, but consider the network design implications. DHCP relay preserves segmentation.",
        wrong: "DHCP broadcasts cannot cross VLANs. The standard solution is a relay agent, not restructuring the network.",
      },
    },
  ],
  hints: [
    "169.254.x.x (APIPA) means the device tried to get a DHCP address and failed — start at the DHCP server.",
    "Check whether the DHCP service is running and whether the address pool has available leases.",
    "DHCP broadcasts do not cross VLAN or subnet boundaries without a relay agent.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "APIPA addresses are one of the clearest indicators of DHCP problems. Recognizing 169.254.x.x immediately tells experienced technicians to check the DHCP server, saving valuable troubleshooting time.",
  toolRelevance: ["ipconfig", "ping", "DHCP console", "Event Viewer", "services.msc"],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
