import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "net-slow-speeds",
  version: 1,
  title: "Diagnosing Slow Network Speeds",
  tier: "beginner",
  track: "networking",
  difficulty: "easy",
  accessLevel: "free",
  tags: ["networking", "performance", "bandwidth", "troubleshooting", "speed"],
  description:
    "Multiple users report slow file transfers and sluggish web browsing. Identify the bottleneck and recommend the correct fix.",
  estimatedMinutes: 10,
  learningObjectives: [
    "Interpret network adapter link speed and duplex settings",
    "Identify common causes of slow network performance",
    "Use appropriate tools to test network throughput",
    "Distinguish between local and WAN-side bottlenecks",
  ],
  sortOrder: 201,
  status: "published",
  prerequisites: [],
  rendererType: "action-rationale",
  scenarios: [
    {
      type: "action-rationale",
      id: "nss-scenario-1",
      title: "Duplex Mismatch",
      context:
        "A user on a wired connection reports file transfers to the local server are extremely slow. Other users on the same switch are fine. You check the adapter properties and see Link Speed: 100 Mbps, Half Duplex. The switch port is set to Auto-negotiate.",
      actions: [
        { id: "set-full-duplex", label: "Set adapter to Auto-negotiate (Full Duplex)", color: "green" },
        { id: "replace-cable", label: "Replace the Ethernet cable", color: "yellow" },
        { id: "upgrade-switch", label: "Upgrade the switch to 10 Gbps", color: "red" },
        { id: "clear-cache", label: "Clear the browser cache", color: "blue" },
      ],
      correctActionId: "set-full-duplex",
      rationales: [
        {
          id: "r-duplex",
          text: "A half-duplex connection can only send or receive at one time, effectively halving throughput and causing collisions. Setting the adapter to auto-negotiate matches the switch and restores full-duplex communication.",
        },
        {
          id: "r-cable",
          text: "A bad cable could reduce speed but would not specifically cause a half-duplex negotiation. The mismatch is a configuration problem.",
        },
        {
          id: "r-switch",
          text: "Other users on the same switch have normal speeds, so the switch hardware is not the bottleneck.",
        },
      ],
      correctRationaleId: "r-duplex",
      feedback: {
        perfect: "Correct! The half-duplex setting is causing collisions and limiting throughput. Auto-negotiate resolves the duplex mismatch.",
        partial: "You chose a network-related fix, but the root cause is visible in the adapter properties. Check the duplex setting.",
        wrong: "Other users are unaffected, so the switch and internet are fine. Focus on what is different about this one workstation.",
      },
    },
    {
      type: "action-rationale",
      id: "nss-scenario-2",
      title: "Bandwidth Saturation",
      context:
        "The entire office reports slow internet. Internal file transfers between workstations are fast. You check the router and see WAN utilization at 98%. A large cloud backup job was started by the IT manager an hour ago.",
      actions: [
        { id: "throttle-backup", label: "Throttle or pause the cloud backup job", color: "green" },
        { id: "reboot-router", label: "Reboot the router", color: "yellow" },
        { id: "add-ram", label: "Add more RAM to the file server", color: "red" },
      ],
      correctActionId: "throttle-backup",
      rationales: [
        {
          id: "r-backup",
          text: "The cloud backup is consuming nearly all WAN bandwidth. Throttling it to use a limited percentage frees bandwidth for other users without canceling the backup.",
        },
        {
          id: "r-reboot",
          text: "Rebooting the router would briefly cancel all connections and the backup would resume afterward, recreating the same problem.",
        },
        {
          id: "r-ram",
          text: "Internal file transfers are fast, so the server is not the issue. The bottleneck is WAN bandwidth, not server resources.",
        },
      ],
      correctRationaleId: "r-backup",
      feedback: {
        perfect: "Correct! The cloud backup is saturating the WAN link. Throttling or scheduling it for off-hours resolves contention.",
        partial: "You identified a network action but missed the specific bottleneck. Notice that internal transfers are fast — the issue is WAN-side.",
        wrong: "Internal performance is fine. The problem is external bandwidth being consumed by the backup job.",
      },
    },
    {
      type: "action-rationale",
      id: "nss-scenario-3",
      title: "Failing Network Cable",
      context:
        "One user reports intermittent slowness. Their adapter shows 1 Gbps link speed, full duplex. However, the connection drops to 100 Mbps periodically. You run a cable tester and find that pairs 4-5 and 7-8 are marginal, showing intermittent continuity failures.",
      actions: [
        { id: "replace-cable-fix", label: "Replace the Ethernet cable with a new Cat6 cable", color: "green" },
        { id: "update-driver", label: "Update the NIC driver", color: "yellow" },
        { id: "assign-static-ip", label: "Assign a static IP address", color: "red" },
      ],
      correctActionId: "replace-cable-fix",
      rationales: [
        {
          id: "r-cable-fix",
          text: "Intermittent failures on wire pairs cause the NIC to renegotiate at a lower speed. Gigabit Ethernet requires all 4 pairs; when pairs fail, it falls back to 100 Mbps which only needs 2 pairs.",
        },
        {
          id: "r-driver",
          text: "A driver update would not fix physical cable problems. The cable tester clearly shows the faulty pairs.",
        },
        {
          id: "r-static",
          text: "IP addressing has no effect on link speed negotiation. The problem is at the physical layer.",
        },
      ],
      correctRationaleId: "r-cable-fix",
      feedback: {
        perfect: "Correct! The damaged cable cannot maintain all 4 pairs needed for Gigabit. Replacing the cable restores stable 1 Gbps connectivity.",
        partial: "You are troubleshooting the right area but check the cable tester results for the definitive answer.",
        wrong: "The cable tester results are the key evidence here. Physical layer problems require physical layer solutions.",
      },
    },
  ],
  hints: [
    "Compare link speed and duplex settings to what the switch expects.",
    "Determine whether slowness affects local transfers, internet, or both to isolate the bottleneck.",
    "Gigabit Ethernet requires all four cable pairs — what happens when some fail?",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Slow network complaints are extremely common. The ability to quickly distinguish between physical layer issues, configuration problems, and bandwidth contention saves hours of troubleshooting time.",
  toolRelevance: ["ipconfig", "ping", "cable tester", "Task Manager", "Resource Monitor"],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
