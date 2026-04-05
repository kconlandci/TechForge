import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "net-wireless-survey",
  version: 1,
  title: "Wireless Site Survey and Deployment Planning",
  tier: "advanced",
  track: "networking",
  difficulty: "challenging",
  accessLevel: "premium",
  tags: ["networking", "wireless", "site-survey", "planning", "deployment"],
  description:
    "Analyze wireless site survey data from a new office space and make deployment decisions about access point placement, channel selection, and power levels.",
  estimatedMinutes: 20,
  learningObjectives: [
    "Interpret wireless site survey heat maps and signal data",
    "Select optimal access point placement based on building layout",
    "Plan non-overlapping channel assignments to minimize co-channel interference",
    "Calculate the number of access points needed based on client density and coverage",
    "Account for building materials and their impact on wireless signal propagation",
  ],
  sortOrder: 217,
  status: "published",
  prerequisites: [],
  rendererType: "investigate-decide",
  scenarios: [
    {
      type: "investigate-decide",
      id: "nwss-scenario-1",
      title: "Open Office AP Placement",
      objective:
        "A new 2,000 sq ft open-plan office needs Wi-Fi coverage for 80 users with laptops and phones. Determine the optimal AP placement strategy.",
      investigationData: [
        {
          id: "floor-plan",
          label: "Floor Plan Details",
          content:
            "Open floor plan, no interior walls\nDrywall perimeter walls, drop ceiling at 9 feet\nDimensions: 50ft x 40ft\n80 desks in 4 rows of 20\nSmall kitchen area in the northeast corner\nServer room in southeast corner (concrete walls)",
        },
        {
          id: "density-calc",
          label: "Client Density Analysis",
          content:
            "80 laptops + 80 phones = 160 total clients\nExpected concurrent wireless: ~120 devices\nBandwidth per user: 10 Mbps minimum\nRecommended max clients per AP: 30-40 for good performance\nMinimum APs needed: 120/35 = ~4 APs",
          isCritical: true,
        },
        {
          id: "interference",
          label: "RF Environment Scan",
          content:
            "2.4 GHz: Neighboring offices visible on channels 1, 6, and 11 at -65 to -70 dBm\n5 GHz: Much cleaner, only 2 weak neighboring networks detected at -80 dBm\nMicrowave oven in kitchen area generates 2.4 GHz interference when in use",
          isCritical: true,
        },
      ],
      actions: [
        { id: "four-aps-grid", label: "Install 4 APs in a grid pattern on 5 GHz with 2.4 GHz backup, ceiling-mounted evenly across the space", color: "green" },
        { id: "two-aps", label: "Install 2 high-power APs at opposite ends of the room", color: "yellow" },
        { id: "one-central", label: "Install 1 enterprise AP in the center of the ceiling", color: "red" },
        { id: "six-aps-walls", label: "Install 6 APs mounted on the perimeter walls", color: "yellow" },
      ],
      correctActionId: "four-aps-grid",
      rationales: [
        {
          id: "r-four-grid",
          text: "Four ceiling-mounted APs in a grid provides even coverage and distributes the 120 clients across 30 per AP. 5 GHz primary avoids the crowded 2.4 GHz environment from neighboring offices.",
        },
        {
          id: "r-two",
          text: "Two APs would each serve 60 clients, exceeding the recommended 30-40 per AP. High power creates interference with neighboring offices and does not improve capacity.",
        },
        {
          id: "r-one",
          text: "One AP cannot handle 120 concurrent clients regardless of its specifications. AP capacity, not coverage, is the limiting factor in this dense environment.",
        },
        {
          id: "r-six-walls",
          text: "Wall-mounted APs create uneven coverage with strong signal near walls and weaker signal in the center. Ceiling-mounted in a grid provides more uniform coverage.",
        },
      ],
      correctRationaleId: "r-four-grid",
      feedback: {
        perfect: "Correct! Four ceiling-mounted APs in a grid distributes clients evenly and provides consistent coverage. 5 GHz primary avoids neighboring interference.",
        partial: "Your AP count might be close, but consider both coverage pattern and client distribution when choosing placement.",
        wrong: "With 120 concurrent clients, you need enough APs for capacity (30-40 clients each), not just coverage area.",
      },
    },
    {
      type: "investigate-decide",
      id: "nwss-scenario-2",
      title: "Channel Planning for Multi-AP Deployment",
      objective:
        "Four APs have been installed in a 2x2 grid pattern. Plan the channel assignments to minimize co-channel interference.",
      investigationData: [
        {
          id: "ap-layout",
          label: "AP Grid Layout (Top View)",
          content:
            "AP1 (NW corner) --- AP2 (NE corner)\n       |                      |\nAP3 (SW corner) --- AP4 (SE corner)\n\nEach AP is about 25 feet from its neighbors.\nAll APs are dual-band (2.4 GHz + 5 GHz).",
        },
        {
          id: "channel-info",
          label: "Available Channels",
          content:
            "2.4 GHz non-overlapping: 1, 6, 11 (only 3 available)\n5 GHz available: 36, 40, 44, 48, 149, 153, 157, 161 (8+ available)\nNeighboring offices use 2.4 GHz channels 1 and 6 heavily",
          isCritical: true,
        },
        {
          id: "interference-data",
          label: "Current Interference Map",
          content:
            "AP1 can hear AP2 and AP3 (adjacent)\nAP2 can hear AP1 and AP4 (adjacent)\nAP3 can hear AP1 and AP4 (adjacent)\nAP4 can hear AP2 and AP3 (adjacent)\nDiagonal APs (AP1-AP4, AP2-AP3) have minimal overlap",
        },
      ],
      actions: [
        { id: "checkerboard", label: "Assign 5 GHz: AP1=36, AP2=44, AP3=44, AP4=36; 2.4 GHz: AP1=1, AP2=11, AP3=11, AP4=1", color: "green" },
        { id: "all-same", label: "Set all APs to channel 36 (5 GHz) and channel 1 (2.4 GHz)", color: "red" },
        { id: "sequential", label: "Assign AP1=36, AP2=40, AP3=44, AP4=48 for 5 GHz", color: "yellow" },
      ],
      correctActionId: "checkerboard",
      rationales: [
        {
          id: "r-checker",
          text: "A checkerboard pattern ensures adjacent APs use different channels while diagonal APs (minimal overlap) can reuse channels. This maximizes channel separation between neighbors on both bands.",
        },
        {
          id: "r-same",
          text: "All APs on the same channel creates maximum co-channel interference. Every AP competes with its neighbors for airtime, drastically reducing throughput.",
        },
        {
          id: "r-sequential",
          text: "Sequential 5 GHz channels work but channels 36 and 40 are adjacent and partially overlap at 20 MHz width. Using wider-spaced channels (36, 44) provides cleaner separation.",
        },
      ],
      correctRationaleId: "r-checker",
      feedback: {
        perfect: "Correct! The checkerboard pattern ensures adjacent APs never share channels while efficiently reusing channels on non-adjacent APs.",
        partial: "Your channel plan avoids some interference but a checkerboard pattern optimizes channel reuse for a 2x2 grid.",
        wrong: "Using the same channel on all APs creates severe co-channel interference. Each adjacent AP pair must use different channels.",
      },
    },
    {
      type: "investigate-decide",
      id: "nwss-scenario-3",
      title: "Multi-Floor Coverage Challenge",
      objective:
        "The company is expanding to the floor above. Signal leakage between floors is measured. Determine the right approach for the second floor.",
      investigationData: [
        {
          id: "floor-leakage",
          label: "Signal Leakage Between Floors",
          content:
            "First floor AP signal measured on second floor: -72 to -78 dBm\nThis is enough to cause co-channel interference but not enough for reliable client connections.\nFloor construction: concrete slab with metal deck, approximately 20 dB attenuation.",
          isCritical: true,
        },
        {
          id: "second-floor",
          label: "Second Floor Details",
          content:
            "Same footprint as first floor (50ft x 40ft)\n40 employees (half the first floor density)\n40 laptops + 40 phones = 80 clients expected\nConcurrent wireless: ~60 devices\nNo interior walls, open plan",
        },
        {
          id: "existing-channels",
          label: "First Floor Channel Assignments",
          content:
            "First floor 5 GHz: AP1=36, AP2=44, AP3=44, AP4=36\nFirst floor 2.4 GHz: AP1=1, AP2=11, AP3=11, AP4=1\nThese channels are locked in and cannot change.",
        },
      ],
      actions: [
        { id: "offset-channels", label: "Install 2 APs on second floor using different 5 GHz channels (149, 157) and 2.4 GHz channel 6", color: "green" },
        { id: "same-channels", label: "Install 2 APs using the same channels as the first floor APs below them", color: "red" },
        { id: "extend-first", label: "Increase first floor AP power to cover the second floor without new APs", color: "red" },
      ],
      correctActionId: "offset-channels",
      rationales: [
        {
          id: "r-offset",
          text: "Using different 5 GHz channels (149/157 vs 36/44) eliminates co-channel interference between floors. Channel 6 on 2.4 GHz avoids channels 1 and 11 used below. Two APs handle 60 clients at 30 each.",
        },
        {
          id: "r-same-ch",
          text: "Using the same channels directly above first-floor APs creates severe co-channel interference. The -72 to -78 dBm leakage is strong enough to degrade performance on both floors.",
        },
        {
          id: "r-extend",
          text: "The 20 dB floor attenuation means first-floor signals are too weak for reliable second-floor connections. Increasing power would create interference with neighboring offices without reliably covering the second floor.",
        },
      ],
      correctRationaleId: "r-offset",
      feedback: {
        perfect: "Correct! Using completely different channel sets between floors eliminates inter-floor interference while providing dedicated capacity for second-floor users.",
        partial: "Separate APs for the second floor is correct, but channel selection must account for the signal leakage between floors.",
        wrong: "The concrete floor attenuates signal by 20 dB — too much for reliable coverage from below, but enough to cause co-channel interference. The second floor needs its own APs on different channels.",
      },
    },
  ],
  hints: [
    "In dense environments, AP capacity (clients per AP) is usually the limiting factor, not coverage area.",
    "Adjacent APs should use non-overlapping channels. A checkerboard pattern maximizes channel reuse efficiency.",
    "When deploying multi-floor wireless, use completely different channel sets per floor to avoid inter-floor interference.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Wireless site surveys are a specialized skill that commands premium consulting rates. Companies pay $2,000-10,000 for professional wireless assessments, making this a lucrative area of expertise.",
  toolRelevance: ["Wi-Fi analyzer", "Ekahau", "heat map software", "spectrum analyzer", "floor plan tool"],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
