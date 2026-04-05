import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "net-cable-identification",
  version: 1,
  title: "Network Cable Type Identification",
  tier: "beginner",
  track: "networking",
  difficulty: "easy",
  accessLevel: "free",
  tags: ["networking", "cables", "physical-layer", "infrastructure", "standards"],
  description:
    "Identify the correct Ethernet cable types for various real-world scenarios including crossover, straight-through, and fiber connections.",
  estimatedMinutes: 8,
  learningObjectives: [
    "Distinguish between Cat5e, Cat6, and Cat6a cable specifications",
    "Identify when straight-through vs crossover cables are needed",
    "Select appropriate cable types based on distance and speed requirements",
    "Understand fiber optic cable use cases in network infrastructure",
  ],
  sortOrder: 202,
  status: "published",
  prerequisites: [],
  rendererType: "toggle-config",
  scenarios: [
    {
      type: "toggle-config",
      id: "nci-scenario-1",
      title: "Wiring a New Office Floor",
      description:
        "A small office is being built out. You need to select the correct cable type for each connection run based on distance, speed requirements, and device types.",
      targetSystem: "Office Network Cabling Plan",
      items: [
        {
          id: "desk-to-patch",
          label: "Desktop to Wall Jack (30m run)",
          detail: "Standard workstation requiring Gigabit Ethernet connection to the patch panel",
          currentState: "Cat5",
          correctState: "Cat5e",
          states: ["Cat5", "Cat5e", "Cat6", "Cat6a", "Fiber MMF"],
          rationaleId: "r-desk",
        },
        {
          id: "switch-uplink",
          label: "Switch to Switch Uplink (5m)",
          detail: "10 Gbps uplink between two access switches in the same rack",
          currentState: "Cat5e",
          correctState: "Cat6a",
          states: ["Cat5", "Cat5e", "Cat6", "Cat6a", "Fiber MMF"],
          rationaleId: "r-uplink",
        },
        {
          id: "building-link",
          label: "Building to Building (150m)",
          detail: "Connection between two buildings across a parking lot requiring 10 Gbps",
          currentState: "Cat6a",
          correctState: "Fiber MMF",
          states: ["Cat5", "Cat5e", "Cat6", "Cat6a", "Fiber MMF"],
          rationaleId: "r-building",
        },
      ],
      rationales: [
        {
          id: "r-desk",
          text: "Cat5e supports Gigabit Ethernet up to 100 meters and is the minimum standard for modern office installations. Cat5 only supports 100 Mbps.",
        },
        {
          id: "r-uplink",
          text: "10 Gbps over copper requires Cat6a cabling. Cat6 supports 10 Gbps only up to 55 meters while Cat6a supports it up to 100 meters.",
        },
        {
          id: "r-building",
          text: "At 150 meters, copper cabling exceeds the 100-meter Ethernet limit. Multimode fiber supports 10 Gbps well beyond this distance.",
        },
      ],
      feedback: {
        perfect: "Excellent! You correctly matched cable types to each scenario's distance and speed requirements.",
        partial: "Some selections are close but review the maximum distances and speeds supported by each cable category.",
        wrong: "Review the specifications for each cable type — distance limits and supported speeds are key factors.",
      },
    },
    {
      type: "toggle-config",
      id: "nci-scenario-2",
      title: "Connecting Network Devices",
      description:
        "You are connecting various devices together. Select whether each connection needs a straight-through or crossover cable (or if auto-MDI-X makes it irrelevant).",
      targetSystem: "Device Interconnection Plan",
      items: [
        {
          id: "pc-to-switch",
          label: "PC to Switch Port",
          detail: "Connecting a workstation to a managed switch",
          currentState: "Crossover",
          correctState: "Straight-through",
          states: ["Straight-through", "Crossover", "Rollover"],
          rationaleId: "r-straight",
        },
        {
          id: "switch-to-switch",
          label: "Switch to Switch (older unmanaged switches)",
          detail: "Connecting two older unmanaged switches without auto-MDI-X",
          currentState: "Straight-through",
          correctState: "Crossover",
          states: ["Straight-through", "Crossover", "Rollover"],
          rationaleId: "r-cross",
        },
        {
          id: "pc-to-router-console",
          label: "Laptop to Router Console Port",
          detail: "Connecting a laptop to a Cisco router for initial CLI configuration via the console port",
          currentState: "Straight-through",
          correctState: "Rollover",
          states: ["Straight-through", "Crossover", "Rollover"],
          rationaleId: "r-rollover",
        },
      ],
      rationales: [
        {
          id: "r-straight",
          text: "Different device types (PC to switch) use straight-through cables. The switch port internally crosses the pairs.",
        },
        {
          id: "r-cross",
          text: "Same device types without auto-MDI-X need crossover cables so that transmit on one end connects to receive on the other.",
        },
        {
          id: "r-rollover",
          text: "Console connections use a rollover (console) cable where all pins are reversed. This is specific to out-of-band management ports.",
        },
      ],
      feedback: {
        perfect: "Perfect! You correctly identified when to use straight-through, crossover, and rollover cables.",
        partial: "Remember: different device types use straight-through, same types use crossover (without auto-MDI-X), and console ports use rollover.",
        wrong: "Review the cable type rules: the key is whether you are connecting similar or different device types, or a console port.",
      },
    },
    {
      type: "toggle-config",
      id: "nci-scenario-3",
      title: "Data Center Cable Selection",
      description:
        "A data center is being upgraded. Select the appropriate cable or fiber type for each use case based on performance and distance requirements.",
      targetSystem: "Data Center Cabling Infrastructure",
      items: [
        {
          id: "server-to-tor",
          label: "Server to Top-of-Rack Switch (3m)",
          detail: "10 Gbps connection from server NIC to ToR switch",
          currentState: "Cat5e",
          correctState: "Cat6",
          states: ["Cat5e", "Cat6", "Cat6a", "Fiber MMF", "Fiber SMF"],
          rationaleId: "r-server-tor",
        },
        {
          id: "tor-to-core",
          label: "ToR Switch to Core Switch (50m)",
          detail: "40 Gbps backbone link within the data center",
          currentState: "Cat6",
          correctState: "Fiber MMF",
          states: ["Cat5e", "Cat6", "Cat6a", "Fiber MMF", "Fiber SMF"],
          rationaleId: "r-backbone",
        },
        {
          id: "dc-to-dc",
          label: "Data Center to Remote Data Center (5km)",
          detail: "10 Gbps WAN link between data center sites",
          currentState: "Fiber MMF",
          correctState: "Fiber SMF",
          states: ["Cat5e", "Cat6", "Cat6a", "Fiber MMF", "Fiber SMF"],
          rationaleId: "r-longhaul",
        },
      ],
      rationales: [
        {
          id: "r-server-tor",
          text: "Cat6 supports 10 Gbps at short distances (up to 55m) and is cost-effective for in-rack connections. Cat5e maxes out at 1 Gbps.",
        },
        {
          id: "r-backbone",
          text: "40 Gbps backbone links exceed copper cable capabilities. Multimode fiber is ideal for data center distances under 300 meters.",
        },
        {
          id: "r-longhaul",
          text: "At 5 kilometers, single-mode fiber is required. Multimode fiber typically maxes out around 300-550 meters for high-speed links.",
        },
      ],
      feedback: {
        perfect: "Excellent! You correctly matched cable types to data center requirements considering speed, distance, and cost.",
        partial: "Some choices are close. Remember that 40 Gbps requires fiber, and distances over ~500m need single-mode.",
        wrong: "Consider both the speed requirement and the distance for each link. Higher speeds and longer distances require fiber.",
      },
    },
  ],
  hints: [
    "Cat5e supports up to 1 Gbps, Cat6 up to 10 Gbps at short distances, and Cat6a up to 10 Gbps at 100 meters.",
    "Copper Ethernet cables have a maximum distance of 100 meters regardless of category.",
    "Single-mode fiber is for long distances (kilometers), multimode fiber is for shorter runs (up to ~550m at 10 Gbps).",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Cable selection is a fundamental skill tested on the CompTIA A+ exam and used daily in field work. Choosing the wrong cable type wastes time and money during office buildouts.",
  toolRelevance: ["cable tester", "tone generator", "punch-down tool", "crimper"],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
