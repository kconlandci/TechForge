import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "net-ip-conflict",
  version: 1,
  title: "Resolving IP Address Conflicts",
  tier: "beginner",
  track: "networking",
  difficulty: "easy",
  accessLevel: "free",
  tags: ["networking", "ip-address", "dhcp", "conflict", "troubleshooting"],
  description:
    "Two devices on the network have been assigned the same IP address, causing intermittent connectivity for both. Investigate and resolve the conflict.",
  estimatedMinutes: 10,
  learningObjectives: [
    "Recognize the symptoms of an IP address conflict",
    "Use arp and ipconfig to identify conflicting devices",
    "Understand the difference between static and DHCP-assigned addresses",
    "Apply the correct resolution based on the conflict source",
  ],
  sortOrder: 203,
  status: "published",
  prerequisites: [],
  rendererType: "investigate-decide",
  scenarios: [
    {
      type: "investigate-decide",
      id: "nic-scenario-1",
      title: "Static IP Overlaps DHCP Range",
      objective:
        "A user sees a 'Windows has detected an IP address conflict' popup. Determine which device has the conflicting address and how to fix it.",
      investigationData: [
        {
          id: "event-log",
          label: "Windows Event Log",
          content:
            "Source: Tcpip\nEvent ID: 4199\nThe system detected an address conflict for IP address 192.168.1.100 with the system having network hardware address AA:BB:CC:11:22:33.",
          isCritical: true,
        },
        {
          id: "ipconfig",
          label: "ipconfig /all on affected PC",
          content:
            "IPv4 Address: 192.168.1.100 (Duplicate)\nPhysical Address: DD:EE:FF:44:55:66\nDHCP Enabled: Yes\nLease Obtained: Today",
        },
        {
          id: "arp-table",
          label: "arp -a (from another PC)",
          content:
            "192.168.1.100    AA-BB-CC-11-22-33    dynamic\n192.168.1.100    DD-EE-FF-44-55-66    dynamic",
        },
        {
          id: "dhcp-scope",
          label: "DHCP Server Scope",
          content:
            "Scope: 192.168.1.50 - 192.168.1.200\nReservations: None\nNetwork printer at 192.168.1.100 — statically configured",
          isCritical: true,
        },
      ],
      actions: [
        { id: "change-printer-ip", label: "Change the printer to a static IP outside the DHCP range", color: "green" },
        { id: "release-renew", label: "Run ipconfig /release and /renew on the PC", color: "yellow" },
        { id: "reboot-both", label: "Reboot both devices", color: "red" },
      ],
      correctActionId: "change-printer-ip",
      rationales: [
        {
          id: "r-printer",
          text: "The printer has a static IP inside the DHCP scope. Moving it outside the DHCP range (or creating a DHCP reservation) permanently prevents future conflicts.",
        },
        {
          id: "r-renew",
          text: "Releasing and renewing may temporarily fix the PC but the DHCP server could reassign the same address again later, recreating the conflict.",
        },
        {
          id: "r-reboot",
          text: "Rebooting does not change IP assignments. The conflict will reoccur because the root cause is the overlapping static address and DHCP range.",
        },
      ],
      correctRationaleId: "r-printer",
      feedback: {
        perfect: "Correct! The printer's static IP falls inside the DHCP range. Moving it outside the range or creating a DHCP reservation prevents future conflicts.",
        partial: "Your fix might work temporarily, but the conflict will return unless the static IP is moved out of the DHCP scope.",
        wrong: "Simply restarting devices does not resolve the underlying configuration overlap between the static IP and DHCP range.",
      },
    },
    {
      type: "investigate-decide",
      id: "nic-scenario-2",
      title: "Rogue DHCP Server",
      objective:
        "Multiple users are getting IP conflicts. Two different DHCP servers appear to be assigning addresses on the same network.",
      investigationData: [
        {
          id: "affected-pcs",
          label: "Affected PC ipconfig /all",
          content:
            "IPv4 Address: 192.168.1.75 (Duplicate)\nDHCP Server: 192.168.1.1\nLease Obtained: 10 minutes ago",
        },
        {
          id: "dhcp-check",
          label: "Network Scan Results",
          content:
            "DHCP Server 1: 192.168.1.1 (authorized corporate server)\nDHCP Server 2: 192.168.1.250 (unknown device)\nBoth servers issuing leases in 192.168.1.50-200 range",
          isCritical: true,
        },
        {
          id: "device-lookup",
          label: "MAC Lookup for 192.168.1.250",
          content:
            "MAC: 00:1A:2B:3C:4D:5E\nVendor: Linksys\nPort: Switch 2, Port 15",
        },
      ],
      actions: [
        { id: "disable-rogue", label: "Disconnect the rogue DHCP server on Switch 2 Port 15", color: "green" },
        { id: "expand-scope", label: "Expand the corporate DHCP scope", color: "red" },
        { id: "static-all", label: "Assign static IPs to all affected PCs", color: "yellow" },
      ],
      correctActionId: "disable-rogue",
      rationales: [
        {
          id: "r-rogue",
          text: "A rogue Linksys router is acting as a second DHCP server. Disconnecting it from the network stops the conflicting leases. Long-term, enable DHCP snooping on switches.",
        },
        {
          id: "r-scope",
          text: "Expanding the scope does not help because two servers are competing to assign addresses in overlapping ranges.",
        },
        {
          id: "r-static",
          text: "Assigning static IPs to all PCs is not scalable and does not address the rogue server, which will continue causing problems for new devices.",
        },
      ],
      correctRationaleId: "r-rogue",
      feedback: {
        perfect: "Correct! The rogue Linksys router must be removed from the network. Consider enabling DHCP snooping to prevent this in the future.",
        partial: "You are addressing the symptoms but not the root cause. Why are there two DHCP servers on the network?",
        wrong: "Multiple users are affected because a second DHCP server is competing with the authorized one. Find and remove it.",
      },
    },
    {
      type: "investigate-decide",
      id: "nic-scenario-3",
      title: "Duplicate Static Assignments",
      objective:
        "Two servers in the same rack are experiencing intermittent connectivity. Both were manually configured by different administrators.",
      investigationData: [
        {
          id: "server1-config",
          label: "Server 1 (Web Server) — ipconfig",
          content:
            "IPv4 Address: 10.0.1.20\nSubnet Mask: 255.255.255.0\nDefault Gateway: 10.0.1.1\nDHCP Enabled: No\nConfigured by: Admin A on Monday",
          isCritical: true,
        },
        {
          id: "server2-config",
          label: "Server 2 (Database Server) — ipconfig",
          content:
            "IPv4 Address: 10.0.1.20\nSubnet Mask: 255.255.255.0\nDefault Gateway: 10.0.1.1\nDHCP Enabled: No\nConfigured by: Admin B on Tuesday",
          isCritical: true,
        },
        {
          id: "ip-doc",
          label: "IP Address Documentation",
          content:
            "10.0.1.20 — assigned to Web Server (per original build sheet)\n10.0.1.21 — unassigned\n10.0.1.22 — assigned to monitoring server",
        },
      ],
      actions: [
        { id: "reassign-db", label: "Change Database Server to 10.0.1.21", color: "green" },
        { id: "reassign-web", label: "Change Web Server to 10.0.1.21", color: "yellow" },
        { id: "enable-dhcp", label: "Enable DHCP on both servers", color: "red" },
      ],
      correctActionId: "reassign-db",
      rationales: [
        {
          id: "r-db-fix",
          text: "The documentation shows 10.0.1.20 was originally assigned to the Web Server. The Database Server was incorrectly given the same address and should be moved to the next available IP.",
        },
        {
          id: "r-web-fix",
          text: "Moving the Web Server would work but contradicts the existing documentation. Other systems may depend on the Web Server being at .20.",
        },
        {
          id: "r-dhcp-fix",
          text: "Servers should use static IPs for consistent addressing. DHCP would make them harder to manage and could assign unpredictable addresses.",
        },
      ],
      correctRationaleId: "r-db-fix",
      feedback: {
        perfect: "Correct! The documentation confirms .20 belongs to the Web Server. Reassigning the Database Server to .21 resolves the conflict and maintains consistency.",
        partial: "Either server could be moved, but always check existing documentation to determine which assignment is authoritative.",
        wrong: "Servers should keep static IPs. Check the documentation to determine which server has the legitimate claim to the address.",
      },
    },
  ],
  hints: [
    "Check whether conflicting IPs are static or DHCP-assigned — the resolution differs for each.",
    "Use the ARP table to identify both MAC addresses claiming the same IP.",
    "Always consult IP documentation or the DHCP server to determine the authoritative assignment.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "IP conflicts are deceptively tricky because they cause intermittent failures that are hard to reproduce. Knowing how to quickly identify both devices using ARP and resolve the root cause is a core help desk skill.",
  toolRelevance: ["ipconfig", "arp", "ping", "DHCP console", "Event Viewer"],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
