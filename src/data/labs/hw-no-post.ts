import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "hw-no-post",
  version: 1,
  title: "PC Won't POST - Diagnose Beep Codes and Symptoms",
  tier: "beginner",
  track: "hardware",
  difficulty: "easy",
  accessLevel: "free",
  tags: ["POST", "beep-codes", "boot-failure", "troubleshooting", "hardware-diagnostics"],
  description:
    "A desktop PC fails to complete POST. Analyze beep codes, LED indicators, and physical symptoms to identify the root cause and recommend the correct fix.",
  estimatedMinutes: 15,
  learningObjectives: [
    "Interpret common AMI and Award BIOS beep code patterns",
    "Correlate POST failure symptoms with specific hardware faults",
    "Determine the correct troubleshooting sequence for no-POST conditions",
  ],
  sortOrder: 300,
  status: "published",
  prerequisites: [],
  rendererType: "investigate-decide",
  scenarios: [
    {
      type: "investigate-decide",
      id: "no-post-1",
      title: "One Long, Two Short Beeps on Startup",
      objective:
        "A user reports their desktop emits one long beep followed by two short beeps and the monitor stays black. Investigate and determine the cause.",
      investigationData: [
        {
          id: "beep-pattern",
          label: "Beep Code Pattern",
          content:
            "The system produces one long beep followed by two short beeps every time the power button is pressed. This pattern repeats once then the system sits idle with no display output.",
          isCritical: true,
        },
        {
          id: "visual-inspection",
          label: "Visual Inspection",
          content:
            "The CPU fan spins, case fans spin, and the power LED on the front panel is solid green. The monitor shows 'No Signal' and the monitor works when connected to a laptop.",
        },
        {
          id: "recent-changes",
          label: "Recent Changes",
          content:
            "The user recently moved the PC to a new desk. No new hardware was installed. The system was working fine before the move.",
        },
      ],
      actions: [
        { id: "reseat-ram", label: "Reseat or replace RAM modules", color: "green" },
        { id: "replace-psu", label: "Replace the power supply unit", color: "yellow" },
        { id: "replace-cpu", label: "Replace the CPU", color: "red" },
        { id: "reseat-gpu", label: "Reseat or replace the video card", color: "blue" },
      ],
      correctActionId: "reseat-gpu",
      rationales: [
        {
          id: "rat-gpu",
          text: "One long beep followed by two short beeps is the AMI BIOS code for a video adapter failure. Since the PC was recently moved, the GPU likely became unseated during transport.",
        },
        {
          id: "rat-ram",
          text: "Continuous short beeps or three beeps typically indicate RAM issues in AMI BIOS, not one long and two short.",
        },
        {
          id: "rat-psu",
          text: "PSU failure would prevent fans from spinning and the power LED from illuminating. The system is clearly receiving power.",
        },
        {
          id: "rat-cpu",
          text: "CPU failure usually results in no beeps at all or a completely dead system, not a specific beep pattern.",
        },
      ],
      correctRationaleId: "rat-gpu",
      feedback: {
        perfect: "Correct! One long and two short beeps is the classic AMI BIOS code for a video/display adapter failure. Reseating the GPU after a move is the right first step.",
        partial: "You identified a hardware issue but missed the specific beep code meaning. One long + two short beeps points directly to the video adapter in AMI BIOS.",
        wrong: "That's not right. The beep pattern one long + two short is a well-known AMI BIOS code specifically indicating a video card or display adapter problem.",
      },
    },
    {
      type: "investigate-decide",
      id: "no-post-2",
      title: "Continuous Short Beeps at Power On",
      objective:
        "A workstation emits a series of continuous short beeps when powered on. The display remains blank. Determine what component has failed.",
      investigationData: [
        {
          id: "beep-pattern",
          label: "Beep Code Pattern",
          content:
            "The system emits continuous short beeps in rapid succession that do not stop until the power button is held to force shutdown.",
          isCritical: true,
        },
        {
          id: "hardware-state",
          label: "Hardware State",
          content:
            "All fans spin. The motherboard power LED is on. A burning smell was noticed near the RAM area last week but the user continued using the PC until today.",
        },
        {
          id: "memory-config",
          label: "Memory Configuration",
          content:
            "The system has two 8 GB DDR4 DIMMs installed. One DIMM has visible scorch marks on the gold contacts.",
        },
      ],
      actions: [
        { id: "replace-mobo", label: "Replace the motherboard", color: "red" },
        { id: "replace-ram", label: "Remove damaged DIMM and test with remaining stick", color: "green" },
        { id: "clear-cmos", label: "Clear CMOS and retry boot", color: "yellow" },
        { id: "replace-psu", label: "Replace the PSU", color: "orange" },
      ],
      correctActionId: "replace-ram",
      rationales: [
        {
          id: "rat-ram",
          text: "Continuous short beeps in AMI BIOS indicate a memory (RAM) failure. The scorch marks on the DIMM confirm physical damage. Removing the bad stick and testing with the good one is the correct diagnostic step.",
        },
        {
          id: "rat-mobo",
          text: "While the motherboard could be damaged from the faulty DIMM, the first troubleshooting step is to isolate the known-bad component before replacing expensive parts.",
        },
        {
          id: "rat-cmos",
          text: "Clearing CMOS resets BIOS settings but cannot fix physically damaged RAM. This would waste time when the cause is already visually apparent.",
        },
      ],
      correctRationaleId: "rat-ram",
      feedback: {
        perfect: "Exactly right! Continuous short beeps indicate RAM failure in AMI BIOS. The scorched DIMM is the obvious culprit. Remove it and test with the remaining good stick.",
        partial: "You're on the right track but missed the most efficient approach. When you can see physical damage on a DIMM and hear the RAM failure beep code, start by isolating that DIMM.",
        wrong: "Incorrect. Continuous short beeps specifically indicate memory failure, and the visually damaged DIMM confirms the diagnosis. Always isolate the known-bad component first.",
      },
    },
    {
      type: "investigate-decide",
      id: "no-post-3",
      title: "Five Short Beeps with No Display",
      objective:
        "A system emits exactly five short beeps during POST and halts. The display stays black. Identify the failed component.",
      investigationData: [
        {
          id: "beep-pattern",
          label: "Beep Code Pattern",
          content:
            "System produces exactly five short beeps during startup, pauses, then the system remains idle. No video output at any point.",
          isCritical: true,
        },
        {
          id: "system-info",
          label: "System Information",
          content:
            "This is a workstation with an Intel Core i7 processor, 32 GB RAM, and integrated graphics on the motherboard. The BIOS is AMI UEFI. CPU cooler fan spins normally.",
        },
        {
          id: "thermal-data",
          label: "Thermal Observation",
          content:
            "The CPU heatsink feels cool to the touch even after several boot attempts. Thermal paste was replaced two months ago during a cleaning.",
        },
      ],
      actions: [
        { id: "reseat-cpu", label: "Reseat the CPU in its socket", color: "blue" },
        { id: "replace-ram", label: "Replace the RAM modules", color: "yellow" },
        { id: "flash-bios", label: "Flash the BIOS firmware", color: "orange" },
        { id: "replace-gpu", label: "Install a discrete GPU", color: "red" },
      ],
      correctActionId: "reseat-cpu",
      rationales: [
        {
          id: "rat-cpu",
          text: "Five short beeps in AMI BIOS indicate a CPU or processor error. The cool heatsink suggests the CPU is not receiving power or making proper contact, despite the fan spinning. Reseating the CPU is the correct first step.",
        },
        {
          id: "rat-ram",
          text: "RAM failures produce continuous short beeps or three beeps in AMI BIOS, not exactly five. This beep count specifically points to the processor.",
        },
        {
          id: "rat-bios",
          text: "BIOS corruption typically produces different symptoms, often no beeps at all. Five short beeps have a specific hardware meaning in AMI BIOS.",
        },
      ],
      correctRationaleId: "rat-cpu",
      feedback: {
        perfect: "Correct! Five short beeps in AMI BIOS indicate a processor error. The cool heatsink is a strong clue that the CPU may not be properly seated. Reseating is the right first action.",
        partial: "Close, but five short beeps in AMI BIOS specifically indicate a CPU/processor issue, not the component you selected.",
        wrong: "That's incorrect. Five short beeps in AMI BIOS is the code for a processor error. The cool heatsink further confirms the CPU is likely unseated or malfunctioning.",
      },
    },
  ],
  hints: [
    "Look up AMI BIOS beep code charts - each pattern maps to a specific hardware failure.",
    "Count the beeps carefully: the number and length (long vs. short) each have distinct meanings.",
    "Always check for physical damage or loose connections before replacing components.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Help desk and desktop support technicians diagnose POST failures daily. Memorizing common beep codes for AMI, Award, and Phoenix BIOS is expected knowledge for CompTIA A+ certified professionals.",
  toolRelevance: [
    "POST card diagnostic tool",
    "Multimeter for power rail testing",
    "BIOS beep code reference charts",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
