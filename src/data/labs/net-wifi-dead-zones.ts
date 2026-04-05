import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "net-wifi-dead-zones",
  version: 1,
  title: "Investigating Wi-Fi Dead Zones",
  tier: "intermediate",
  track: "networking",
  difficulty: "moderate",
  accessLevel: "free",
  tags: ["networking", "wireless", "wi-fi", "coverage", "troubleshooting"],
  description:
    "Employees report Wi-Fi coverage gaps in specific areas of the office. Investigate signal data and determine the best solution for eliminating dead zones.",
  estimatedMinutes: 15,
  learningObjectives: [
    "Interpret wireless signal strength measurements in dBm",
    "Identify environmental factors that cause Wi-Fi dead zones",
    "Recommend appropriate solutions such as access point placement or repeaters",
    "Understand channel overlap and interference sources",
  ],
  sortOrder: 205,
  status: "published",
  prerequisites: [],
  rendererType: "investigate-decide",
  scenarios: [
    {
      type: "investigate-decide",
      id: "nwdz-scenario-1",
      title: "Conference Room Signal Drop",
      objective:
        "The large conference room consistently has poor Wi-Fi. Determine the cause and recommend a fix.",
      investigationData: [
        {
          id: "signal-map",
          label: "Wi-Fi Heat Map Data",
          content:
            "Hallway outside conference room: -45 dBm (Excellent)\nConference room entrance: -65 dBm (Fair)\nCenter of conference room: -82 dBm (Poor)\nFar wall of conference room: -88 dBm (Very Poor)\nConference room has floor-to-ceiling glass walls with metallic film coating.",
          isCritical: true,
        },
        {
          id: "ap-location",
          label: "Access Point Location",
          content:
            "Nearest AP: Hallway ceiling, 15 meters from conference room center\nAP Model: Ubiquiti UAP-AC-Pro\nChannel: 36 (5 GHz)\nClients connected: 12",
        },
        {
          id: "interference",
          label: "Spectrum Analysis",
          content:
            "No significant interference detected on channel 36.\nConference room microwave and Bluetooth devices were off during testing.",
        },
      ],
      actions: [
        { id: "add-ap-inside", label: "Install a dedicated access point inside the conference room", color: "green" },
        { id: "boost-power", label: "Increase transmit power on the hallway AP", color: "yellow" },
        { id: "switch-2ghz", label: "Switch the hallway AP to 2.4 GHz only", color: "orange" },
        { id: "add-repeater", label: "Place a wireless repeater outside the conference room", color: "yellow" },
      ],
      correctActionId: "add-ap-inside",
      rationales: [
        {
          id: "r-ap-inside",
          text: "The metallic film on the glass walls is attenuating the signal by over 35 dB. No amount of power increase from outside will overcome this. A dedicated AP inside the room provides direct coverage.",
        },
        {
          id: "r-power",
          text: "Increasing power may marginally improve signal but metallic coated glass causes severe attenuation. The signal would still be inadequate at the far wall.",
        },
        {
          id: "r-2ghz",
          text: "2.4 GHz penetrates slightly better but the metallic film blocks both bands significantly. Performance at 2.4 GHz would also be lower due to reduced bandwidth.",
        },
        {
          id: "r-repeater",
          text: "A repeater outside the room still must transmit through the metallic glass. It would suffer the same attenuation problem as the hallway AP.",
        },
      ],
      correctRationaleId: "r-ap-inside",
      feedback: {
        perfect: "Correct! Metallic-coated glass severely attenuates wireless signals. A dedicated AP inside the conference room bypasses the obstruction entirely.",
        partial: "You are trying to improve signal, but consider the physics of the metallic coating on the glass walls. External solutions cannot overcome this barrier.",
        wrong: "The key clue is the metallic film coating on the glass walls. This is a physical barrier that requires placing the signal source on the same side as the clients.",
      },
    },
    {
      type: "investigate-decide",
      id: "nwdz-scenario-2",
      title: "Warehouse Coverage Gap",
      objective:
        "The warehouse area has no Wi-Fi coverage but workers need to use wireless handheld scanners. Evaluate the options.",
      investigationData: [
        {
          id: "warehouse-layout",
          label: "Warehouse Details",
          content:
            "Dimensions: 50m x 30m, 10m ceiling height\nConstruction: Metal roof, concrete block walls\nMetal shelving racks throughout (3m high)\nEnvironment: Forklift traffic, overhead doors\nCurrent AP coverage ends at the office/warehouse boundary wall.",
          isCritical: true,
        },
        {
          id: "requirements",
          label: "Requirements",
          content:
            "30 wireless barcode scanners need connectivity\nScanners support 802.11n (2.4 GHz only)\nReliable connection needed while moving between aisles",
        },
        {
          id: "budget",
          label: "Budget Constraints",
          content:
            "Budget approved for up to 4 enterprise-grade access points\nPower-over-Ethernet switch available with 8 free ports\nCat6 cable runs to warehouse ceiling are feasible",
        },
      ],
      actions: [
        { id: "multiple-aps", label: "Install 3-4 ceiling-mounted APs distributed across the warehouse at 2.4 GHz", color: "green" },
        { id: "one-powerful", label: "Install one high-power directional AP at the warehouse entrance", color: "yellow" },
        { id: "mesh-system", label: "Set up a consumer mesh Wi-Fi system on the shelving", color: "red" },
      ],
      correctActionId: "multiple-aps",
      rationales: [
        {
          id: "r-multiple",
          text: "Metal shelving creates shadows and reflections. Multiple ceiling-mounted APs above the racks provide coverage from above into each aisle. 2.4 GHz at this density handles 30 scanners well.",
        },
        {
          id: "r-one-ap",
          text: "A single directional AP cannot cover a 50x30m warehouse with metal shelving. Signal would be blocked by the first few rows of racks.",
        },
        {
          id: "r-mesh",
          text: "Consumer mesh systems are not designed for industrial environments. They lack centralized management, are not rated for warehouse conditions, and would be damaged by forklift traffic.",
        },
      ],
      correctRationaleId: "r-multiple",
      feedback: {
        perfect: "Correct! Distributed ceiling-mounted APs above the metal shelving provide consistent aisle-by-aisle coverage for the handheld scanners.",
        partial: "You have the right idea about improving coverage, but consider how metal shelving blocks signal and plan AP placement accordingly.",
        wrong: "A warehouse with metal shelving and concrete walls needs multiple access points to ensure coverage between the aisles.",
      },
    },
    {
      type: "investigate-decide",
      id: "nwdz-scenario-3",
      title: "Second Floor Dead Spot",
      objective:
        "Users on the second floor near the elevator bank report intermittent disconnections. All other areas of the floor have strong signal.",
      investigationData: [
        {
          id: "signal-data",
          label: "Signal Survey Near Elevators",
          content:
            "5 meters from elevator: -55 dBm on channel 6 (Good)\nAdjacent to elevator shaft: -72 dBm on channel 6 (Fair)\nElevator lobby: -60 dBm on channel 6 but frequent disconnections\nWireshark: high retransmission rate near elevators",
          isCritical: true,
        },
        {
          id: "spectrum",
          label: "Spectrum Analysis at Elevator Lobby",
          content:
            "Channel 6: Heavy intermittent interference detected\nInterference source: pulsed, occurs every 30-60 seconds\nCorrelation: interference spikes align with elevator motor activation\nNoise floor spikes from -90 dBm to -65 dBm during interference",
          isCritical: true,
        },
        {
          id: "ap-info",
          label: "Nearby AP Configuration",
          content:
            "AP: Floor2-East, Channel 6 (2.4 GHz), 20 MHz width\nAP is mounted 8 meters from elevator shaft\nNo 5 GHz radio enabled on this AP",
        },
      ],
      actions: [
        { id: "enable-5ghz", label: "Enable 5 GHz radio and migrate elevator lobby clients to 5 GHz band", color: "green" },
        { id: "change-channel", label: "Change the AP to channel 11", color: "yellow" },
        { id: "shield-elevator", label: "Install RF shielding around the elevator shaft", color: "red" },
      ],
      correctActionId: "enable-5ghz",
      rationales: [
        {
          id: "r-5ghz",
          text: "The elevator motors generate electromagnetic interference on 2.4 GHz. The 5 GHz band is less susceptible to this type of industrial interference. Enabling dual-band and steering clients to 5 GHz avoids the problem.",
        },
        {
          id: "r-channel",
          text: "Changing channels may reduce some interference but elevator motor noise tends to be broadband and affects all 2.4 GHz channels. 5 GHz is the better solution.",
        },
        {
          id: "r-shield",
          text: "RF shielding is expensive and may violate building codes around elevator shafts. The simpler solution is to use a less affected frequency band.",
        },
      ],
      correctRationaleId: "r-5ghz",
      feedback: {
        perfect: "Correct! Elevator motors generate broadband 2.4 GHz interference. Enabling 5 GHz provides a clean channel for nearby clients.",
        partial: "You are addressing the interference but the most effective solution involves moving to a frequency band less affected by motor noise.",
        wrong: "The spectrum analysis clearly shows elevator motor interference on 2.4 GHz. The solution is to avoid that frequency band.",
      },
    },
  ],
  hints: [
    "Signal strength below -70 dBm is generally considered poor for reliable connectivity.",
    "Building materials like metal, concrete, and coated glass significantly attenuate wireless signals.",
    "When 2.4 GHz interference is present, consider whether 5 GHz would be less affected.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Wireless site surveys and dead zone remediation are high-value skills. Many IT departments outsource this work to consultants at premium rates. Understanding RF fundamentals sets you apart from other A+ candidates.",
  toolRelevance: ["Wi-Fi analyzer", "spectrum analyzer", "heat map software", "ping"],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
