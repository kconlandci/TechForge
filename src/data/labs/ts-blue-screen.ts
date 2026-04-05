import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "ts-blue-screen",
  version: 1,
  title: "Diagnose Blue Screen of Death (BSOD) Causes",
  tier: "beginner",
  track: "hardware-network-troubleshooting",
  difficulty: "easy",
  accessLevel: "free",
  tags: ["bsod", "windows", "crash", "memory", "drivers", "troubleshooting"],
  description:
    "Investigate Blue Screen of Death errors using stop codes, Event Viewer, and memory diagnostics to identify root causes ranging from faulty RAM to driver conflicts.",
  estimatedMinutes: 18,
  learningObjectives: [
    "Interpret common BSOD stop codes to narrow the root cause",
    "Use Event Viewer to correlate crash events with system changes",
    "Run Windows Memory Diagnostic to test for faulty RAM",
    "Distinguish between driver, hardware, and software causes of BSODs",
  ],
  sortOrder: 501,
  status: "published",
  prerequisites: [],
  rendererType: "investigate-decide",
  scenarios: [
    {
      id: "bs-scenario-1",
      type: "investigate-decide",
      title: "BSOD After Driver Update",
      objective:
        "A workstation crashes with a BSOD displaying stop code DRIVER_IRQL_NOT_LESS_OR_EQUAL approximately 30 minutes after startup. The user reports this started two days ago. Investigate the available data and determine the most likely cause.",
      investigationData: [
        {
          id: "bs1-event-viewer",
          label: "Event Viewer — System Log",
          content:
            "Critical Event 41 (Kernel-Power) logged at each crash time. Warning Event 219 (DriverFrameworks) 'The driver \\Driver\\WUDFRd failed to load.' Error Event 7034: 'The NVIDIA Display Container service terminated unexpectedly.' The first occurrence of these errors correlates with a Windows Update that installed NVIDIA driver version 546.33 two days ago.",
          isCritical: true,
        },
        {
          id: "bs1-minidump",
          label: "Minidump Analysis (WinDbg preview)",
          content:
            "DRIVER_IRQL_NOT_LESS_OR_EQUAL (d1) — faulting module: nvlddmkm.sys. This driver is the NVIDIA Windows kernel-mode driver. The crash occurs during a paged memory access at an elevated IRQL, indicating the driver is accessing invalid memory.",
          isCritical: true,
        },
        {
          id: "bs1-reliability-monitor",
          label: "Reliability Monitor",
          content:
            "Stability index dropped from 9.2 to 2.1 two days ago. Timeline shows: Windows Update installed 'NVIDIA Graphics Driver 546.33' followed by repeated critical events every day since.",
        },
      ],
      actions: [
        {
          id: "bs1-replace-gpu",
          label: "Replace the graphics card",
          color: "orange",
        },
        {
          id: "bs1-rollback-driver",
          label: "Roll back the NVIDIA driver to the previous stable version using Device Manager",
          color: "green",
        },
        {
          id: "bs1-run-memtest",
          label: "Run Windows Memory Diagnostic",
          color: "blue",
        },
        {
          id: "bs1-reinstall-windows",
          label: "Reinstall Windows from scratch",
          color: "red",
        },
      ],
      correctActionId: "bs1-rollback-driver",
      rationales: [
        {
          id: "bs1-r1",
          text: "The minidump identifies nvlddmkm.sys as the faulting module, Event Viewer shows the crashes began immediately after the NVIDIA driver update, and Reliability Monitor confirms the timeline. Rolling back to the previous driver version directly addresses the root cause.",
        },
        {
          id: "bs1-r2",
          text: "Replacing the GPU is premature since all evidence points to a software driver issue, not a hardware failure. The GPU worked fine before the update.",
        },
        {
          id: "bs1-r3",
          text: "Memory diagnostics test RAM, but the minidump specifically identifies an NVIDIA driver fault, not a general memory failure pattern.",
        },
        {
          id: "bs1-r4",
          text: "Reinstalling Windows is unnecessarily destructive when the cause has been clearly identified as a specific driver update.",
        },
      ],
      correctRationaleId: "bs1-r1",
      feedback: {
        perfect:
          "Correct. The evidence chain is clear: driver update, faulting module in minidump, and crash timeline all point to the NVIDIA driver. Rolling back is the targeted fix.",
        partial:
          "Memory diagnostics are a valid general troubleshooting step, but the minidump already identifies the specific faulting driver. Follow the evidence.",
        wrong: "That action ignores the clear evidence trail pointing to a specific driver update as the cause.",
      },
    },
    {
      id: "bs-scenario-2",
      type: "investigate-decide",
      title: "Random BSOD with Memory Errors",
      objective:
        "A desktop PC experiences random BSODs at unpredictable intervals — sometimes during heavy workloads, sometimes at idle. Stop codes vary between MEMORY_MANAGEMENT, IRQL_NOT_LESS_OR_EQUAL, and PAGE_FAULT_IN_NONPAGED_AREA. Investigate and determine the likely cause.",
      investigationData: [
        {
          id: "bs2-stop-codes",
          label: "BSOD Stop Code History",
          content:
            "Last 5 crashes: MEMORY_MANAGEMENT (0x1A), PAGE_FAULT_IN_NONPAGED_AREA (0x50), IRQL_NOT_LESS_OR_EQUAL (0xA), MEMORY_MANAGEMENT (0x1A), SYSTEM_SERVICE_EXCEPTION (0x3B). No single driver is identified across all dumps. Crashes occur at random intervals from 20 minutes to 6 hours apart.",
          isCritical: true,
        },
        {
          id: "bs2-memdiag",
          label: "Windows Memory Diagnostic Result",
          content:
            "Windows Memory Diagnostic completed with hardware problems detected. 'The system reported errors in physical memory during the extended test pass. Errors found in segment 3.' This was logged in Event Viewer under MemoryDiagnostics-Results Event ID 1201.",
          isCritical: true,
        },
        {
          id: "bs2-hardware-info",
          label: "System Hardware Configuration",
          content:
            "The PC has 2x16GB DDR4 DIMMs installed in slots A2 and B2. The system was upgraded from 16GB to 32GB three weeks ago when the second DIMM was added. The original DIMM is Kingston, the new one is Corsair.",
        },
      ],
      actions: [
        {
          id: "bs2-update-bios",
          label: "Update the BIOS firmware to the latest version",
          color: "blue",
        },
        {
          id: "bs2-remove-new-dimm",
          label: "Remove the newly added Corsair DIMM and test with only the original Kingston stick",
          color: "green",
        },
        {
          id: "bs2-run-sfc",
          label: "Run sfc /scannow to repair Windows system files",
          color: "orange",
        },
        {
          id: "bs2-disable-xmp",
          label: "Disable XMP profile in BIOS to run RAM at stock speeds",
          color: "yellow",
        },
      ],
      correctActionId: "bs2-remove-new-dimm",
      rationales: [
        {
          id: "bs2-r1",
          text: "Multiple varying memory-related stop codes with random timing, combined with Memory Diagnostic confirming physical RAM errors, strongly indicate a faulty or incompatible DIMM. Removing the recently added stick isolates the variable.",
        },
        {
          id: "bs2-r2",
          text: "A BIOS update could help with memory compatibility but does not address a physically defective DIMM, which the Memory Diagnostic has already confirmed.",
        },
        {
          id: "bs2-r3",
          text: "System file repair addresses OS-level corruption, not hardware memory errors confirmed by the diagnostic tool.",
        },
        {
          id: "bs2-r4",
          text: "Disabling XMP is reasonable if the issue were a timing or voltage mismatch, but Memory Diagnostic reported errors in a specific segment, suggesting a defect rather than an overclocking issue.",
        },
      ],
      correctRationaleId: "bs2-r1",
      feedback: {
        perfect:
          "Correct. Varied memory stop codes plus confirmed physical memory errors from the diagnostic tool point to faulty RAM. Isolating the new DIMM is the logical next step.",
        partial:
          "Adjusting XMP is a valid troubleshooting step for memory instability, but the diagnostic already confirmed physical errors in a specific segment, making a defective DIMM more likely.",
        wrong: "Software-level repairs cannot fix confirmed physical memory hardware errors.",
      },
    },
    {
      id: "bs-scenario-3",
      type: "investigate-decide",
      title: "BSOD Under Thermal Stress",
      objective:
        "A gaming PC crashes with WHEA_UNCORRECTABLE_ERROR after 15-20 minutes of heavy gaming but runs stable during normal office work. The user reports the crashes started after they moved the PC to a new desk location. Investigate the data.",
      investigationData: [
        {
          id: "bs3-hwmonitor",
          label: "HWMonitor Temperature Readings Under Load",
          content:
            "CPU package temperature reaches 98°C within 12 minutes of starting a game (thermal throttling threshold is 100°C). At idle the CPU sits at 52°C. GPU temperature reaches 87°C under load (normal for this model). The CPU cooler fan appears to be spinning but RPM reads only 450 RPM (expected: 1200-2000 RPM under load).",
          isCritical: true,
        },
        {
          id: "bs3-event-viewer",
          label: "Event Viewer — WHEA Logger",
          content:
            "Event ID 18: A corrected hardware error has occurred. Component: Processor Core. Error Source: Machine Check Exception. Multiple corrected errors logged in the minutes preceding each BSOD, increasing in frequency as the session progresses.",
          isCritical: true,
        },
        {
          id: "bs3-physical",
          label: "Physical Inspection Notes",
          content:
            "The PC was moved to a desk inside a closed cabinet with minimal ventilation. The rear exhaust fan is pressed directly against the cabinet wall with approximately 1 inch of clearance. Dust buildup is moderate on intake filters.",
        },
      ],
      actions: [
        {
          id: "bs3-replace-cpu",
          label: "Replace the CPU since it is generating machine check exceptions",
          color: "red",
        },
        {
          id: "bs3-reapply-paste",
          label: "Move PC out of the cabinet, clean dust filters, verify CPU cooler fan connection, and reapply thermal paste if the fan issue persists",
          color: "green",
        },
        {
          id: "bs3-undervolt-cpu",
          label: "Undervolt the CPU in BIOS to reduce heat output",
          color: "orange",
        },
        {
          id: "bs3-update-bios",
          label: "Update the BIOS to improve thermal management",
          color: "blue",
        },
      ],
      correctActionId: "bs3-reapply-paste",
      rationales: [
        {
          id: "bs3-r1",
          text: "The CPU reaches 98°C under load, the fan is spinning at abnormally low RPM, the PC is in a poorly ventilated cabinet, and crashes correlate with thermal stress. Addressing airflow, cleaning dust, and checking the fan connection resolves the environmental and mechanical causes.",
        },
        {
          id: "bs3-r2",
          text: "The CPU is not defective. Machine Check Exceptions at these temperatures are expected behavior as the processor reports thermal stress errors. Fix the cooling, and the errors will stop.",
        },
        {
          id: "bs3-r3",
          text: "Undervolting is a workaround that masks the real problem: inadequate cooling due to poor placement and a potentially failing fan.",
        },
        {
          id: "bs3-r4",
          text: "BIOS updates do not fix physical airflow restrictions or fans spinning below spec.",
        },
      ],
      correctRationaleId: "bs3-r1",
      feedback: {
        perfect:
          "Excellent. You identified the root cause chain: restricted airflow from the cabinet, possible fan issue, and dust buildup all contributing to thermal throttling and crashes under load.",
        partial:
          "Undervolting can reduce temperatures, but it does not address the fan running at abnormally low RPM or the restricted cabinet airflow.",
        wrong: "The CPU is not faulty. Machine Check Exceptions at near-throttle temperatures are a symptom of overheating, not a defective processor.",
      },
    },
  ],
  hints: [
    "BSOD stop codes and minidump analysis point directly to the faulting component. Always read the stop code before guessing.",
    "When multiple different memory-related stop codes appear randomly, suspect physical RAM issues and run Windows Memory Diagnostic.",
    "WHEA_UNCORRECTABLE_ERROR combined with high temperatures and load-dependent crashes is a classic thermal issue pattern.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "BSOD diagnosis is a core skill for desktop support technicians. Employers value the ability to read stop codes and minidumps because it dramatically reduces escalation rates and mean time to resolution.",
  toolRelevance: [
    "Event Viewer",
    "Windows Memory Diagnostic",
    "Reliability Monitor",
    "WinDbg Preview",
    "HWMonitor",
    "Device Manager",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
