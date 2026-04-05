import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "hw-ups-sizing",
  version: 1,
  title: "Size a UPS for a Server Room",
  tier: "advanced",
  track: "hardware",
  difficulty: "challenging",
  accessLevel: "premium",
  tags: ["UPS", "power-protection", "VA", "watts", "battery-backup", "server-room"],
  description:
    "Calculate UPS requirements for a small server room. Determine the correct VA/watt rating, runtime needs, and UPS topology to protect critical equipment from power failures.",
  estimatedMinutes: 20,
  learningObjectives: [
    "Calculate total power load in watts and VA for a server room",
    "Determine required UPS capacity with appropriate safety margin",
    "Select the correct UPS topology (standby, line-interactive, online) for the application",
  ],
  sortOrder: 314,
  status: "published",
  prerequisites: [],
  rendererType: "action-rationale",
  scenarios: [
    {
      type: "action-rationale",
      id: "ups-1",
      title: "Server Rack UPS Sizing",
      context:
        "A small server room has: two Dell PowerEdge R640 servers (750W each), one network switch (150W), one NAS (250W), and a monitor/KVM (100W). Total load: 2,000W. The company needs 15 minutes of runtime during power outages to allow graceful shutdown. Power factor is 0.9.",
      actions: [
        { id: "3000va", label: "3,000 VA / 2,700W Online Double-Conversion UPS", color: "green" },
        { id: "2000va", label: "2,000 VA / 1,800W Line-Interactive UPS", color: "yellow" },
        { id: "5000va", label: "5,000 VA / 4,500W Online Double-Conversion UPS", color: "orange" },
        { id: "1500va", label: "1,500 VA / 1,350W Standby UPS", color: "red" },
      ],
      correctActionId: "3000va",
      rationales: [
        {
          id: "rat-3000",
          text: "The total load is 2,000W. At a 0.9 power factor, that is approximately 2,222 VA. Best practice is to size the UPS at 70-80% load maximum, so 2,222 VA / 0.75 = approximately 2,963 VA. A 3,000 VA Online Double-Conversion UPS provides clean power, handles the load at ~74% capacity, and supports 15-minute runtime with the included battery packs. Online topology is required for servers to prevent any transfer time.",
        },
        {
          id: "rat-2000",
          text: "2,000 VA only provides 1,800W at the rated power factor. The 2,000W load would run the UPS at 100%+ capacity, causing overload shutdowns and zero runtime margin.",
        },
        {
          id: "rat-standby",
          text: "Standby UPS has a 5-12ms transfer time when switching to battery. Servers may crash during the transfer gap. Online double-conversion provides zero transfer time, which is essential for server protection.",
        },
      ],
      correctRationaleId: "rat-3000",
      feedback: {
        perfect: "Excellent! You correctly calculated the VA requirement with safety margin and selected online double-conversion topology. Running a UPS at 70-80% capacity ensures runtime and longevity.",
        partial: "Your calculation is close but check the load percentage. UPS units should never run at more than 80% capacity for adequate runtime and battery longevity.",
        wrong: "Review the power calculation: total watts divided by power factor gives VA, then add 25-30% safety margin. Also consider the UPS topology required for servers.",
      },
    },
    {
      type: "action-rationale",
      id: "ups-2",
      title: "Desktop Workstation Protection",
      context:
        "A graphic designer's workstation draws 450W under full load (300W typical). They need battery backup to save their work during a power outage (5 minutes is sufficient). The designer's work is valuable but the budget is limited to $200. The workstation plugs into a standard 120V/15A outlet.",
      actions: [
        { id: "line-interactive", label: "850 VA / 510W Line-Interactive UPS", color: "green" },
        { id: "online", label: "1,500 VA / 1,350W Online Double-Conversion UPS", color: "yellow" },
        { id: "standby", label: "450 VA / 260W Standby UPS", color: "red" },
        { id: "surge-only", label: "Surge protector power strip (no battery)", color: "red" },
      ],
      correctActionId: "line-interactive",
      rationales: [
        {
          id: "rat-850",
          text: "850 VA at 0.6 power factor provides 510W - enough for the 450W peak load with headroom. Line-interactive UPS provides voltage regulation (corrects brownouts without using battery) and 4-8ms transfer time, which desktop PCs handle fine. At around $150-180, it fits the $200 budget.",
        },
        {
          id: "rat-online",
          text: "An online UPS is overkill for a single workstation and far exceeds the $200 budget (typically $400+). The zero transfer time is unnecessary for desktop PCs which have power supply capacitors that bridge short gaps.",
        },
        {
          id: "rat-standby",
          text: "450 VA only provides approximately 260W. The 450W workstation would overload this UPS immediately, potentially damaging the UPS or causing it to shut down.",
        },
      ],
      correctRationaleId: "rat-850",
      feedback: {
        perfect: "Correct! Line-interactive is the sweet spot for workstation protection: better than standby (voltage regulation), affordable unlike online, and properly sized for the load.",
        partial: "Consider both the load capacity and the budget. The right UPS topology for a single workstation balances protection with cost.",
        wrong: "That option either cannot handle the power draw or far exceeds the budget. Size the UPS for the actual load with some headroom.",
      },
    },
    {
      type: "action-rationale",
      id: "ups-3",
      title: "Network Closet Power Protection",
      context:
        "A network closet contains: a 48-port PoE switch (740W with full PoE load), a firewall appliance (80W), a patch panel (passive, 0W), and a wireless controller (60W). Total: 880W. The closet has no ventilation and ambient temperature reaches 30C. The company needs the network to stay up for 30 minutes during outages.",
      actions: [
        { id: "1500va-li", label: "1,500 VA Line-Interactive UPS with external battery pack", color: "green" },
        { id: "1000va-li", label: "1,000 VA Line-Interactive UPS (internal battery only)", color: "yellow" },
        { id: "2000va-online", label: "2,000 VA Online Double-Conversion UPS", color: "orange" },
        { id: "750va-standby", label: "750 VA Standby UPS", color: "red" },
      ],
      correctActionId: "1500va-li",
      rationales: [
        {
          id: "rat-1500",
          text: "880W at 0.6 PF equals approximately 1,467 VA. A 1,500 VA unit handles this at 98% which is tight, but the key differentiator is the external battery pack for 30-minute runtime. Internal batteries alone on a 1,500 VA unit provide only 5-8 minutes at this load. The external battery pack extends runtime to the required 30 minutes. Line-interactive provides voltage regulation for the unventilated closet where power quality may fluctuate.",
        },
        {
          id: "rat-1000",
          text: "1,000 VA cannot handle 880W (approximately 1,467 VA). The UPS would be overloaded and shut down or fail to protect the equipment.",
        },
        {
          id: "rat-online-heat",
          text: "Online double-conversion UPS generates more heat than line-interactive due to the constant power conversion. In an unventilated 30C closet, the additional heat could push temperatures into dangerous territory for both the UPS batteries and the network equipment.",
        },
      ],
      correctRationaleId: "rat-1500",
      feedback: {
        perfect: "Great work! You accounted for the load calculation, extended runtime requirement (external battery), and the heat consideration in the unventilated closet. Real-world factors like ambient temperature matter.",
        partial: "Consider all the requirements: load capacity, 30-minute runtime, and the thermal constraints of the unventilated closet.",
        wrong: "That UPS cannot meet the requirements. Calculate the VA requirement from the watt load, verify runtime capability, and consider the thermal environment.",
      },
    },
  ],
  hints: [
    "UPS capacity is rated in VA (Volt-Amps). To convert watts to VA: VA = Watts / Power Factor. Typical power factor is 0.6-0.9.",
    "Best practice: size the UPS so your load is 70-80% of the rated capacity. Running at 100% reduces runtime and battery life.",
    "Online double-conversion provides zero transfer time but generates more heat. Line-interactive has 4-8ms transfer, which is acceptable for most equipment.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "UPS sizing is a critical skill for system administrators and IT managers. An undersized UPS provides false confidence, while an oversized one wastes budget. Correctly sizing power protection prevents data loss and equipment damage.",
  toolRelevance: [
    "Kill-A-Watt meter for measuring actual power draw",
    "APC UPS Selector tool for sizing calculations",
    "UPS management software (PowerChute, NUT)",
    "Multimeter for verifying outlet voltage",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
