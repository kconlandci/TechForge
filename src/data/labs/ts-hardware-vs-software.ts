import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "ts-hardware-vs-software",
  version: 1,
  title: "Determine If an Issue Is Hardware or Software",
  tier: "intermediate",
  track: "hardware-network-troubleshooting",
  difficulty: "moderate",
  accessLevel: "free",
  tags: [
    "hardware",
    "software",
    "diagnosis",
    "isolation",
    "safe-mode",
    "troubleshooting",
  ],
  description:
    "When symptoms are ambiguous, systematically isolate whether the root cause is hardware or software. Use Safe Mode, hardware diagnostics, and component swapping to make the determination.",
  estimatedMinutes: 20,
  learningObjectives: [
    "Apply isolation techniques to differentiate hardware from software causes",
    "Use Safe Mode to determine if a problem is driver or OS related",
    "Interpret hardware diagnostic test results from built-in PC tools",
    "Apply the swap method to conclusively identify a faulty hardware component",
    "Recognize symptoms that are unique to hardware versus software failures",
  ],
  sortOrder: 508,
  status: "published",
  prerequisites: [],
  rendererType: "investigate-decide",
  scenarios: [
    {
      id: "hs-scenario-1",
      type: "investigate-decide",
      title: "Display Artifacts — GPU or Driver?",
      objective:
        "A user reports random colored lines and pixel blocks appearing on their monitor during normal use. The artifacts sometimes disappear after minimizing and restoring windows. The PC is 2 years old and has a dedicated GPU. Determine whether this is a hardware or software issue.",
      investigationData: [
        {
          id: "hs1-safe-mode",
          label: "Safe Mode Test",
          content:
            "In Safe Mode (which uses the basic Microsoft display driver instead of the NVIDIA driver), the system ran for 2 hours with no artifacts whatsoever. The display was clean and stable throughout normal Safe Mode usage including file browsing and text editing.",
          isCritical: true,
        },
        {
          id: "hs1-stress-test",
          label: "GPU Stress Test (FurMark) in Normal Mode",
          content:
            "Running FurMark in normal Windows mode produces severe artifacts within 3 minutes: green blocks, horizontal line tearing, and eventually a driver crash with 'Display driver nvlddmkm stopped responding and has successfully recovered.' GPU temperature reached 78°C (within normal range for this model under stress).",
          isCritical: true,
        },
        {
          id: "hs1-driver-history",
          label: "Driver and Monitor Test",
          content:
            "The NVIDIA driver is version 545.92 (latest stable). A clean driver reinstall using DDU (Display Driver Uninstaller) followed by fresh driver installation did not resolve the artifacts. Connecting a different monitor to the same GPU produces the same artifacts. Connecting the monitor to a different PC produces no artifacts (monitor is fine).",
        },
      ],
      actions: [
        {
          id: "hs1-reinstall-windows",
          label: "Reinstall Windows to eliminate all software causes",
          color: "orange",
        },
        {
          id: "hs1-replace-gpu",
          label: "Replace the GPU — the card is failing despite normal temperatures",
          color: "green",
        },
        {
          id: "hs1-replace-monitor",
          label: "Replace the monitor cable since it might be intermittent",
          color: "blue",
        },
        {
          id: "hs1-try-older-driver",
          label: "Try installing an older NVIDIA driver version",
          color: "yellow",
        },
      ],
      correctActionId: "hs1-replace-gpu",
      rationales: [
        {
          id: "hs1-r1",
          text: "Safe Mode (basic driver) shows no artifacts, but FurMark with the GPU actively rendering causes severe artifacts and driver crashes. A clean driver reinstall did not help, and the problem follows the GPU (not the monitor). The GPU VRAM or processing unit is failing, producing artifacts when under real rendering load.",
        },
        {
          id: "hs1-r2",
          text: "Reinstalling Windows is unnecessary because a clean driver install was already attempted and the problem persists. The artifacts occur during GPU-accelerated rendering, not in basic mode.",
        },
        {
          id: "hs1-r3",
          text: "The monitor was tested on another PC and works fine. A different monitor on this GPU shows the same artifacts. The monitor and cable are eliminated as causes.",
        },
        {
          id: "hs1-r4",
          text: "An older driver is unlikely to fix the issue since a clean install of the current driver did not help and the artifacts correlate with GPU rendering load, not specific driver behavior.",
        },
      ],
      correctRationaleId: "hs1-r1",
      feedback: {
        perfect:
          "Correct. The isolation tests are conclusive: no artifacts in Safe Mode (basic driver), artifacts with GPU rendering, clean driver install did not help, problem follows the GPU. The GPU hardware is failing.",
        partial:
          "Trying older drivers is a reasonable step, but the clean DDU reinstall and the fact that artifacts correlate with rendering load (not driver version) point to hardware.",
        wrong: "The systematic isolation already eliminated the monitor, cable, and driver as causes. The GPU is the remaining variable.",
      },
    },
    {
      id: "hs-scenario-2",
      type: "investigate-decide",
      title: "Random Reboots — Power or OS?",
      objective:
        "A PC randomly reboots without warning or BSOD. There is no blue screen — the system simply powers off and restarts. The reboots are unpredictable and occur under various conditions. Determine whether the cause is hardware or software.",
      investigationData: [
        {
          id: "hs2-event-viewer",
          label: "Event Viewer Analysis",
          content:
            "Event Viewer shows Event ID 41 (Kernel-Power) 'The system has rebooted without cleanly shutting down first' at each reboot time. No BSOD dump files exist because the system lost power before it could write one. The absence of a BSOD suggests an instant power loss rather than an OS crash.",
          isCritical: true,
        },
        {
          id: "hs2-power-test",
          label: "PSU and Power Testing",
          content:
            "A multimeter test on the PSU shows the 12V rail reading 11.4V under load (spec: 12V +/- 5%, so minimum acceptable is 11.4V — borderline). The PSU is a no-name 450W unit that is 4 years old. The system draws approximately 380W under peak gaming load. A different known-good 650W PSU was temporarily connected, and the system ran a 4-hour stress test without a single reboot.",
          isCritical: true,
        },
        {
          id: "hs2-software-check",
          label: "Software and OS Status",
          content:
            "Windows is fully updated. sfc /scannow reports no integrity violations. DISM /Online /Cleanup-Image /RestoreHealth completes successfully. All drivers are up to date. The system runs stable indefinitely in Safe Mode (which reduces power draw due to no GPU acceleration or background services).",
        },
      ],
      actions: [
        {
          id: "hs2-replace-psu",
          label: "Replace the PSU with a quality 650W unit",
          color: "green",
        },
        {
          id: "hs2-reinstall-windows",
          label: "Reinstall Windows to fix OS instability",
          color: "red",
        },
        {
          id: "hs2-disable-fast-startup",
          label: "Disable Windows Fast Startup",
          color: "orange",
        },
        {
          id: "hs2-replace-motherboard",
          label: "Replace the motherboard",
          color: "red",
        },
      ],
      correctActionId: "hs2-replace-psu",
      rationales: [
        {
          id: "hs2-r1",
          text: "Instant reboots without BSOD indicate power loss, not an OS crash. The borderline 12V reading under load and the fact that a different PSU eliminated the problem conclusively identify the failing PSU as the cause.",
        },
        {
          id: "hs2-r2",
          text: "Windows integrity checks passed, and the system is stable with a different PSU. The OS is not the issue.",
        },
        {
          id: "hs2-r3",
          text: "Fast Startup issues cause problems during boot transitions, not random reboots under load during normal operation.",
        },
        {
          id: "hs2-r4",
          text: "The system ran a 4-hour stress test on a different PSU without issues, which rules out the motherboard and other components.",
        },
      ],
      correctRationaleId: "hs2-r1",
      feedback: {
        perfect:
          "Correct. No BSOD plus instant power loss plus borderline voltage plus successful testing with a replacement PSU equals a failing power supply. The swap test is the definitive proof.",
        partial:
          "Disabling Fast Startup addresses a different problem. Instant reboots under load without BSOD are a power delivery issue.",
        wrong: "The swap test with a known-good PSU already proved the original PSU is the cause. No other component needs replacement.",
      },
    },
    {
      id: "hs-scenario-3",
      type: "investigate-decide",
      title: "Intermittent Freezes — Software Lock or Hardware Hang?",
      objective:
        "A workstation freezes completely for 10-30 seconds at random intervals. The mouse cursor freezes, audio stutters, and then everything resumes normally. No crash or reboot occurs. Determine whether this is hardware or software.",
      investigationData: [
        {
          id: "hs3-resource-monitor",
          label: "Resource Monitor During Freeze",
          content:
            "Capturing Resource Monitor data around freeze events shows: During freeze, Disk 0 (SSD) active time spikes to 100% with response times exceeding 5,000ms. CPU, memory, and network remain normal. The SSD is a 3-year-old SATA SSD with heavy daily use (office workstation).",
          isCritical: true,
        },
        {
          id: "hs3-smart",
          label: "CrystalDiskInfo SMART Data",
          content:
            "SMART status: Caution. Reallocated Sector Count: 248 (threshold: 100, warning level). Wear Leveling Count: 12% remaining. Current Pending Sector: 34. The SSD is approaching end of life based on wear indicators. SMART predicted failure: Yes.",
          isCritical: true,
        },
        {
          id: "hs3-safe-mode",
          label: "Safe Mode and Clean Boot Test",
          content:
            "The freezes occur in Safe Mode as well. A clean boot (disabling all non-Microsoft services and startup items) does not prevent the freezes. The freezes correlate with disk write operations regardless of which application is running.",
        },
      ],
      actions: [
        {
          id: "hs3-replace-ssd",
          label: "Back up data immediately and replace the failing SSD",
          color: "green",
        },
        {
          id: "hs3-defrag",
          label: "Optimize the SSD using the Windows defrag tool",
          color: "red",
        },
        {
          id: "hs3-disable-services",
          label: "Disable background services that write to disk",
          color: "orange",
        },
        {
          id: "hs3-reinstall-os",
          label: "Reinstall Windows on the same SSD",
          color: "red",
        },
      ],
      correctActionId: "hs3-replace-ssd",
      rationales: [
        {
          id: "hs3-r1",
          text: "SMART data shows the SSD is approaching failure with high reallocated sectors and 12% wear remaining. Freezes during disk operations in any mode (normal, safe, clean boot) confirm hardware-level disk issues. Immediate backup and replacement prevents data loss.",
        },
        {
          id: "hs3-r2",
          text: "Defragmenting an SSD is harmful and does not address sector failures. SSDs use TRIM, not defragmentation, and even TRIM cannot fix reallocated sectors.",
        },
        {
          id: "hs3-r3",
          text: "Disabling services reduces disk writes but does not fix a physically failing drive. The user still needs to write data to do their work.",
        },
        {
          id: "hs3-r4",
          text: "Reinstalling the OS on a failing SSD puts fresh data on a dying drive. The hardware is the problem, not the software.",
        },
      ],
      correctRationaleId: "hs3-r1",
      feedback: {
        perfect:
          "Correct. SMART warnings, high reallocated sectors, low wear remaining, and freezes that persist in Safe Mode all confirm SSD hardware failure. Back up immediately and replace.",
        partial:
          "Reducing disk writes might reduce freeze frequency but does not address the failing hardware. The SSD needs replacement.",
        wrong: "The SMART data and behavior in Safe Mode both confirm this is a hardware issue. Software fixes cannot repair failing flash memory cells.",
      },
    },
  ],
  hints: [
    "Safe Mode uses basic drivers and minimal services. If a problem disappears in Safe Mode, it is likely driver or software related. If it persists, suspect hardware.",
    "Instant reboots without BSOD typically indicate power loss (PSU failure), while BSODs indicate software crashes or RAM issues.",
    "SMART data from CrystalDiskInfo provides early warning of drive failure. High reallocated sector counts and pending sectors indicate imminent hardware failure.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "The ability to quickly determine whether a problem is hardware or software prevents unnecessary parts orders and OS reinstalls. This skill directly impacts resolution time, department budget, and customer satisfaction scores.",
  toolRelevance: [
    "Safe Mode",
    "CrystalDiskInfo",
    "Built-in Hardware Diagnostics",
    "Multimeter (PSU testing)",
    "Resource Monitor",
    "Event Viewer",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
