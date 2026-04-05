import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "hw-psu-failure",
  version: 1,
  title: "Random Shutdowns - Diagnose a Failing PSU",
  tier: "beginner",
  track: "hardware",
  difficulty: "easy",
  accessLevel: "free",
  tags: ["PSU", "power-supply", "shutdowns", "voltage", "troubleshooting"],
  description:
    "A desktop PC experiences random shutdowns under load. Triage the symptoms, classify the problem, and select the correct remediation to resolve the power supply issue.",
  estimatedMinutes: 15,
  learningObjectives: [
    "Identify symptoms of a failing or underpowered PSU",
    "Use a multimeter to test PSU voltage rails within ATX tolerances",
    "Distinguish PSU failure from other causes of random shutdowns",
  ],
  sortOrder: 303,
  status: "published",
  prerequisites: [],
  rendererType: "triage-remediate",
  scenarios: [
    {
      type: "triage-remediate",
      id: "psu-1",
      title: "Gaming PC Shutdowns Under Load",
      description:
        "A user reports their gaming PC shuts off abruptly during graphically intensive games. The system never shuts down during light use. There is no blue screen - the power simply cuts off instantly. The PC has a 450W PSU powering an Intel i7-12700K and an NVIDIA RTX 3070.",
      evidence: [
        {
          type: "symptom",
          content: "PC shuts off instantly (no BSOD, no shutdown sequence) only during gaming or benchmarks.",
        },
        {
          type: "measurement",
          content: "Multimeter on 12V rail reads 11.2V under load (ATX spec requires 12V +/- 5%, so minimum is 11.4V).",
        },
        {
          type: "observation",
          content: "Total estimated system draw is 520W. The PSU is rated at 450W and is three years old.",
        },
      ],
      classifications: [
        { id: "class-psu", label: "Underpowered / Failing PSU", description: "The PSU cannot deliver sufficient wattage and voltage is sagging below ATX tolerances under load." },
        { id: "class-thermal", label: "CPU Thermal Throttling", description: "The CPU is overheating and triggering an emergency shutdown." },
        { id: "class-gpu", label: "Defective GPU", description: "The graphics card has a hardware defect causing system crashes." },
      ],
      correctClassificationId: "class-psu",
      remediations: [
        { id: "rem-upgrade-psu", label: "Replace PSU with 750W 80+ Gold unit", description: "Install a higher-wattage PSU that exceeds the system's total power draw with headroom." },
        { id: "rem-repaste-cpu", label: "Reapply thermal paste on CPU", description: "Clean and reapply thermal compound on the CPU heatsink." },
        { id: "rem-replace-gpu", label: "RMA the graphics card", description: "Submit a warranty claim for a replacement GPU." },
      ],
      correctRemediationId: "rem-upgrade-psu",
      rationales: [
        {
          id: "rat-psu",
          text: "The 12V rail drops to 11.2V under load, which is below the ATX specification minimum of 11.4V. Combined with the 450W PSU trying to deliver 520W+ of power, this is a textbook PSU overload causing instant power cuts.",
        },
        {
          id: "rat-thermal",
          text: "Thermal shutdowns are preceded by throttling and typically show high temperatures in monitoring software. An instant power cut with no warning indicates a power delivery failure, not thermal protection.",
        },
      ],
      correctRationaleId: "rat-psu",
      feedback: {
        perfect: "Excellent diagnosis! The 12V rail dropping below ATX spec under load, combined with a PSU rated below the system's actual draw, is a clear-cut case for a PSU upgrade.",
        partial: "You're in the right area, but look more carefully at the voltage readings and the wattage math. The evidence points to a specific component.",
        wrong: "The evidence doesn't support that diagnosis. Focus on the voltage measurements and the relationship between PSU wattage rating and total system power draw.",
      },
    },
    {
      type: "triage-remediate",
      id: "psu-2",
      title: "Office PC Won't Stay On",
      description:
        "An office desktop powers on for 2-3 seconds, fans spin briefly, then shuts off. It repeats this cycle endlessly. No display output ever appears. This started suddenly - the PC was working fine yesterday.",
      evidence: [
        {
          type: "symptom",
          content: "Power-on cycle: fans spin for 2-3 seconds, system dies, pauses, then tries again automatically. This repeats in a loop.",
        },
        {
          type: "observation",
          content: "A faint burning smell is detected near the PSU. The PSU fan does not spin during the brief power-on moments.",
        },
        {
          type: "environmental",
          content: "The PC is plugged into a power strip with six other devices. The outlet is confirmed working with a lamp test.",
        },
      ],
      classifications: [
        { id: "class-dead-psu", label: "Failed PSU (short circuit protection)", description: "The PSU's internal protection circuit is triggering due to a component failure, causing the power cycle loop." },
        { id: "class-mobo-short", label: "Motherboard short circuit", description: "A short on the motherboard is causing the system to cycle." },
        { id: "class-power-strip", label: "Overloaded power strip", description: "Too many devices on the power strip are causing insufficient power delivery." },
      ],
      correctClassificationId: "class-dead-psu",
      remediations: [
        { id: "rem-replace-psu", label: "Replace the PSU", description: "Install a new power supply of equal or greater wattage." },
        { id: "rem-replace-mobo", label: "Replace the motherboard", description: "Install a new motherboard." },
        { id: "rem-new-strip", label: "Connect directly to wall outlet", description: "Bypass the power strip and plug directly into the wall." },
      ],
      correctRemediationId: "rem-replace-psu",
      rationales: [
        {
          id: "rat-dead-psu",
          text: "The burning smell near the PSU, the non-spinning PSU fan, and the short power cycling are classic indicators of a PSU with a blown internal component. The PSU's over-current protection (OCP) is cutting power repeatedly.",
        },
        {
          id: "rat-mobo",
          text: "While a motherboard short can cause similar cycling, the burning smell is localized to the PSU and the PSU fan itself is not spinning, pointing to the PSU as the failed component.",
        },
      ],
      correctRationaleId: "rat-dead-psu",
      feedback: {
        perfect: "Correct! The burning smell at the PSU, dead PSU fan, and power cycling loop are hallmarks of a failed PSU triggering its own protection circuit. Replace it immediately.",
        partial: "The cycling behavior could point to a few causes, but the physical evidence (smell, dead fan) localizes the failure. Look at all the clues together.",
        wrong: "That doesn't match the evidence. A burning smell near the PSU combined with its fan not spinning is a strong indicator of PSU failure.",
      },
    },
    {
      type: "triage-remediate",
      id: "psu-3",
      title: "Workstation Instability After GPU Upgrade",
      description:
        "A user upgraded their workstation GPU from a GTX 1650 (75W TDP) to an RTX 4070 (200W TDP). Since the upgrade, the system randomly reboots during renders. The existing PSU is a 500W generic unit that came with the case.",
      evidence: [
        {
          type: "symptom",
          content: "Random reboots during 3D rendering. System never rebooted with the old GPU. Windows Event Viewer shows Kernel-Power Event ID 41 (unexpected shutdown).",
        },
        {
          type: "measurement",
          content: "HWMonitor shows 12V rail fluctuating between 11.6V and 12.3V during renders. The 500W PSU has only a single 6+2 pin PCIe power connector; the RTX 4070 requires one 8-pin connector (being met with an adapter).",
        },
        {
          type: "observation",
          content: "The PSU has no 80+ efficiency certification. The system total draw with the new GPU is estimated at 430W peak.",
        },
      ],
      classifications: [
        { id: "class-psu-inadequate", label: "Inadequate PSU for new GPU", description: "The PSU lacks sufficient stable power on the 12V rail and proper connectors for the upgraded GPU." },
        { id: "class-driver", label: "GPU driver conflict", description: "The new GPU has incompatible or corrupted drivers." },
        { id: "class-gpu-defect", label: "Defective new GPU", description: "The replacement GPU has a manufacturing defect." },
      ],
      correctClassificationId: "class-psu-inadequate",
      remediations: [
        { id: "rem-psu-upgrade", label: "Replace with a 650W+ 80+ Bronze PSU with native PCIe connectors", description: "Install a quality PSU with proper wattage and connectors for the new GPU." },
        { id: "rem-reinstall-drivers", label: "DDU and reinstall GPU drivers", description: "Use Display Driver Uninstaller and install fresh drivers." },
        { id: "rem-rma-gpu", label: "Return the GPU as defective", description: "RMA the new graphics card for a replacement." },
      ],
      correctRemediationId: "rem-psu-upgrade",
      rationales: [
        {
          id: "rat-psu",
          text: "The unstable 12V rail, use of an adapter instead of native PCIe power connectors, and a no-certification generic PSU combine to create an unreliable power delivery system. NVIDIA recommends a 650W PSU minimum for the RTX 4070.",
        },
        {
          id: "rat-driver",
          text: "Driver issues cause blue screens or display artifacts, not abrupt power-loss reboots. Kernel-Power Event 41 specifically indicates an unexpected power loss, not a software crash.",
        },
      ],
      correctRationaleId: "rat-psu",
      feedback: {
        perfect: "Spot on! The unstable 12V rail, adapter usage, and generic PSU are all red flags. A quality 650W+ PSU with native PCIe connectors is the correct fix after a major GPU upgrade.",
        partial: "You're close, but look at the Kernel-Power event and voltage readings. The crash type tells you whether it's a software or hardware issue.",
        wrong: "Kernel-Power Event 41 indicates an unexpected power loss, not a software or GPU defect issue. The PSU evidence makes the diagnosis clear.",
      },
    },
  ],
  hints: [
    "ATX specification allows 12V rail to vary only +/- 5% (11.4V to 12.6V). Anything outside this range indicates a problem.",
    "Instant power-off with no blue screen points to power delivery, not software or thermal issues.",
    "Always ensure the PSU has at least 20% headroom above the system's total power draw for stable operation.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "PSU failures are among the most misdiagnosed hardware issues because symptoms can mimic other problems. Owning a multimeter and knowing ATX voltage tolerances will set you apart from technicians who guess.",
  toolRelevance: [
    "Multimeter for voltage testing",
    "PSU tester (24-pin ATX tester)",
    "HWMonitor or HWiNFO for software voltage monitoring",
    "Kill-A-Watt meter for measuring actual power draw from the wall",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
