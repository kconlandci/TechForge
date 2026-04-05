import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "hw-gpu-troubleshoot",
  version: 1,
  title: "Display Artifacts and GPU Crashes",
  tier: "advanced",
  track: "hardware",
  difficulty: "challenging",
  accessLevel: "premium",
  tags: ["GPU", "display-artifacts", "VRAM", "driver-crash", "overheating", "PCIe"],
  description:
    "Investigate display artifacts, driver crashes, and graphical glitches. Determine whether the root cause is a failing GPU, driver issue, overheating, or power delivery problem.",
  estimatedMinutes: 20,
  learningObjectives: [
    "Distinguish between hardware and software causes of display artifacts",
    "Interpret GPU stress test results and VRAM error patterns",
    "Apply systematic GPU troubleshooting methodology to isolate the root cause",
  ],
  sortOrder: 313,
  status: "published",
  prerequisites: [],
  rendererType: "investigate-decide",
  scenarios: [
    {
      type: "investigate-decide",
      id: "gpu-1",
      title: "Colored Pixel Artifacts in 3D Applications",
      objective:
        "A CAD workstation displays random colored pixels (sparkles) in 3D viewport that worsen under load. The artifacts do not appear on the desktop or in 2D applications. The GPU is an NVIDIA Quadro RTX 4000 that is 2 years old.",
      investigationData: [
        {
          id: "artifact-pattern",
          label: "Artifact Behavior",
          content:
            "Random green and pink pixels appear in the 3D viewport of SolidWorks and Blender. Artifacts increase as model complexity grows. Desktop, web browsing, and 2D applications show no artifacts whatsoever.",
          isCritical: true,
        },
        {
          id: "vram-test",
          label: "VRAM Stress Test (OCCT)",
          content:
            "OCCT VRAM test reports 347 errors after 10 minutes. GPU temperature during test: 81C (thermal limit: 90C). Memory clock and core clock are at stock speeds. No overclocking applied.",
          isCritical: true,
        },
        {
          id: "driver-check",
          label: "Driver and Software State",
          content:
            "GPU driver is the latest Studio driver from NVIDIA (version 550.90). Clean driver reinstall using DDU was performed last week with no improvement. The issue occurs across multiple 3D applications.",
        },
      ],
      actions: [
        { id: "rma-gpu", label: "RMA the GPU - VRAM is failing", color: "green" },
        { id: "reinstall-driver", label: "Try a different driver version", color: "yellow" },
        { id: "add-cooling", label: "Improve GPU cooling to reduce temperature", color: "orange" },
        { id: "replace-cable", label: "Replace the display cable", color: "red" },
      ],
      correctActionId: "rma-gpu",
      rationales: [
        {
          id: "rat-vram",
          text: "347 VRAM errors in the stress test is conclusive evidence of failing video memory. VRAM errors cause artifacts in 3D applications because 3D rendering stores textures and frame buffers in VRAM. 2D applications use minimal VRAM, explaining why they're unaffected. The GPU needs warranty replacement.",
        },
        {
          id: "rat-driver",
          text: "A clean DDU reinstall with the latest driver was already performed with no change. Driver issues also would not cause VRAM stress test errors. This is a hardware failure.",
        },
        {
          id: "rat-cooling",
          text: "The GPU temperature of 81C is within safe operating range (limit is 90C). While warm, it is not the cause of VRAM errors at stock clocks. VRAM failures are typically manufacturing defects, not thermal damage.",
        },
      ],
      correctRationaleId: "rat-vram",
      feedback: {
        perfect: "Correct! VRAM errors in a stress test combined with 3D-only artifacts are definitive signs of failing VRAM. This GPU needs warranty replacement - no amount of driver or cooling changes will fix bad memory chips.",
        partial: "You identified a potential issue but the VRAM stress test results are the decisive evidence here. Hardware memory errors cannot be fixed with software.",
        wrong: "The VRAM stress test showing 347 errors is conclusive. This is a hardware failure that requires GPU replacement, not a software or cable issue.",
      },
    },
    {
      type: "investigate-decide",
      id: "gpu-2",
      title: "Screen Goes Black During Games Then Recovers",
      objective:
        "A gaming PC experiences brief black screen flashes (1-2 seconds) followed by a 'Display driver has recovered from a timeout' notification. This happens in multiple games but never during desktop use. The GPU is an AMD Radeon RX 6800 XT.",
      investigationData: [
        {
          id: "event-log",
          label: "Windows Event Viewer",
          content:
            "Repeated TDR (Timeout Detection and Recovery) events: 'Display driver amdkmdap stopped responding and has successfully recovered.' Events correlate with GPU clock speed spikes above 2.4 GHz.",
          isCritical: true,
        },
        {
          id: "monitoring",
          label: "GPU Monitoring (HWiNFO64)",
          content:
            "Core clock: stock base 1825 MHz, boost up to 2450 MHz during gaming. GPU temperature: peaks at 75C (well within limits). GPU power draw peaks at 285W. The 12V rail from PSU drops to 11.5V during these power spikes. PSU is a 650W unit.",
        },
        {
          id: "stress-test",
          label: "FurMark Stress Test",
          content:
            "FurMark runs for 30 minutes without artifacts or TDR. However, FurMark locks the GPU at a steady load. The TDR only occurs during games where the GPU rapidly transitions between low and high load states (like loading new areas in open-world games).",
        },
      ],
      actions: [
        { id: "upgrade-psu", label: "Upgrade to an 850W+ PSU for stable power delivery", color: "green" },
        { id: "rma-gpu", label: "RMA the GPU as defective", color: "yellow" },
        { id: "rollback-driver", label: "Roll back to an older AMD driver version", color: "orange" },
        { id: "underclock", label: "Underclock the GPU core by 100 MHz", color: "blue" },
      ],
      correctActionId: "upgrade-psu",
      rationales: [
        {
          id: "rat-psu",
          text: "The RX 6800 XT can spike to 300W+ during transient loads. The 12V rail dropping to 11.5V during power spikes indicates the 650W PSU cannot handle the GPU's transient power demands. TDR occurs when the GPU loses stable power during rapid clock transitions. An 850W+ PSU provides the headroom needed for power transients. AMD recommends a 750W minimum for this card.",
        },
        {
          id: "rat-gpu-ok",
          text: "FurMark runs for 30 minutes at steady load without issues, and VRAM appears healthy. The problem only occurs during transient power spikes, pointing to the power delivery rather than a GPU defect.",
        },
        {
          id: "rat-underclock",
          text: "Underclocking would reduce power spikes and might mask the symptom, but it reduces performance and does not fix the root cause. The PSU is the limiting factor.",
        },
      ],
      correctRationaleId: "rat-psu",
      feedback: {
        perfect: "Excellent analysis! The 12V droop during transient power spikes is the smoking gun. Modern GPUs can spike well above their rated TDP during rapid load transitions. The PSU must handle these transients cleanly.",
        partial: "That could help as a workaround, but the root cause is the 12V rail instability during load transitions. Address the power delivery problem directly.",
        wrong: "The GPU passes stress tests and the symptoms correlate with power delivery issues. Look at the voltage monitoring data during the events.",
      },
    },
    {
      type: "investigate-decide",
      id: "gpu-3",
      title: "Horizontal Lines Across All Applications",
      objective:
        "A workstation displays persistent horizontal lines across the entire screen in all applications, including the BIOS boot screen. The lines are visible before Windows loads. The GPU is an NVIDIA GeForce RTX 3060.",
      investigationData: [
        {
          id: "visual",
          label: "Visual Symptoms",
          content:
            "Thin horizontal lines span the entire screen width. They appear during BIOS POST, in Windows, and in all applications equally. The lines are static (don't move or change) and appear at consistent vertical positions.",
          isCritical: true,
        },
        {
          id: "cable-test",
          label: "Cable and Monitor Testing",
          content:
            "Swapping to a new DisplayPort cable: lines persist. Connecting the GPU to a different monitor: lines persist. Connecting the monitor to a laptop: no lines (monitor is fine). Using the motherboard's HDMI output (integrated graphics): no lines appear.",
          isCritical: true,
        },
        {
          id: "gpu-test",
          label: "GPU Diagnostic",
          content:
            "Moving the GPU to a different PCIe slot: lines persist. OCCT VRAM test: 0 errors. GPU temperature at idle: 42C. No unusual power readings.",
        },
      ],
      actions: [
        { id: "rma-gpu", label: "RMA the GPU - display output circuitry failure", color: "green" },
        { id: "replace-cable", label: "Try a different cable type (HDMI instead of DP)", color: "yellow" },
        { id: "update-driver", label: "Update or reinstall the GPU driver", color: "orange" },
        { id: "replace-monitor", label: "Replace the monitor", color: "red" },
      ],
      correctActionId: "rma-gpu",
      rationales: [
        {
          id: "rat-gpu-output",
          text: "The lines appear in BIOS (before any driver loads), persist across multiple monitors and cables, persist in a different PCIe slot, but do not appear using integrated graphics. This isolates the fault to the GPU's display output circuitry. VRAM is fine (0 errors), but the display output stage of the GPU is damaged. RMA is the correct action.",
        },
        {
          id: "rat-not-cable",
          text: "Multiple cables and monitors were tested. The lines follow the GPU, not the cable or monitor. Cable and monitor testing was thorough and eliminates those components.",
        },
        {
          id: "rat-not-driver",
          text: "The lines appear in BIOS before any operating system or driver loads. This eliminates all software causes. The defect is in the GPU hardware.",
        },
      ],
      correctRationaleId: "rat-gpu-output",
      feedback: {
        perfect: "Correct! Lines visible in BIOS eliminate all software causes. Testing with different cables, monitors, and PCIe slots isolates the fault to the GPU itself. The systematic elimination process you followed is textbook.",
        partial: "The testing already eliminated that component. Review the isolation test results: cables, monitors, slots, and integrated graphics were all tested.",
        wrong: "The diagnostic steps already ruled that out. Lines appearing in BIOS (pre-driver) and persisting across all cables/monitors/slots proves the GPU hardware is at fault.",
      },
    },
  ],
  hints: [
    "If artifacts appear in BIOS before the OS loads, the cause is hardware - not a driver or software issue.",
    "VRAM stress test errors are conclusive evidence of failing video memory, regardless of temperature readings.",
    "Isolation testing (swap GPU to another system, try different cables/monitors) is the definitive way to identify the faulty component.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "GPU troubleshooting requires systematic elimination. In enterprise environments, correctly identifying whether an issue is hardware, driver, or power-related saves thousands in unnecessary replacements and downtime.",
  toolRelevance: [
    "OCCT for GPU and VRAM stress testing",
    "HWiNFO64 for GPU monitoring",
    "DDU (Display Driver Uninstaller) for clean driver removal",
    "FurMark for thermal stress testing",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
