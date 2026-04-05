import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "ts-boot-failure",
  version: 1,
  title: "Troubleshoot PC Boot Failures Beyond BIOS",
  tier: "beginner",
  track: "hardware-network-troubleshooting",
  difficulty: "easy",
  accessLevel: "free",
  tags: [
    "boot",
    "bios",
    "uefi",
    "post",
    "hardware",
    "startup",
    "troubleshooting",
  ],
  description:
    "Diagnose a PC that powers on but fails to boot into Windows. Use POST codes, BIOS settings, and boot device diagnostics to pinpoint the failure point.",
  estimatedMinutes: 15,
  learningObjectives: [
    "Interpret POST beep codes and on-screen error messages during boot",
    "Verify BIOS/UEFI boot order and Secure Boot configuration",
    "Distinguish between hardware POST failures and OS boot loader issues",
    "Apply systematic boot troubleshooting from power-on to OS load",
  ],
  sortOrder: 502,
  status: "published",
  prerequisites: [],
  rendererType: "investigate-decide",
  scenarios: [
    {
      id: "bf-scenario-1",
      type: "investigate-decide",
      title: "No Boot Device Found",
      objective:
        "A user reports their desktop PC shows 'No Boot Device Found' after powering on. The PC was working fine yesterday. No hardware changes were made. Investigate the available data to determine the cause.",
      investigationData: [
        {
          id: "bf1-bios-screen",
          label: "BIOS/UEFI Boot Settings",
          content:
            "Boot mode: UEFI. Secure Boot: Enabled. Boot order: 1) USB Drive, 2) Windows Boot Manager (SAMSUNG SSD 970 EVO 500GB), 3) Network Boot. The SAMSUNG SSD appears in the boot priority list but 'Windows Boot Manager' entry shows '(Not Found)'. SATA/NVMe devices section shows the SSD is detected with correct model and capacity.",
          isCritical: true,
        },
        {
          id: "bf1-event-history",
          label: "User Report and Recent History",
          content:
            "The user states the PC shut down normally last night after a Windows Update. This morning it will not boot. No power outages occurred overnight. The user did not enter BIOS or change any settings. Windows Update history shows KB5034441 (WinRE update) was installed during the last shutdown.",
        },
        {
          id: "bf1-post",
          label: "POST Behavior",
          content:
            "The PC completes POST successfully — no beep codes, all fans spin, display shows the manufacturer logo, then transitions to 'No Boot Device Found' error. The SSD activity LED flickers briefly during POST.",
        },
      ],
      actions: [
        {
          id: "bf1-replace-ssd",
          label: "Replace the SSD because it has failed",
          color: "red",
        },
        {
          id: "bf1-repair-bootloader",
          label: "Boot from Windows installation media and run Startup Repair to rebuild the boot loader",
          color: "green",
        },
        {
          id: "bf1-reset-bios",
          label: "Clear CMOS to reset all BIOS settings to default",
          color: "orange",
        },
        {
          id: "bf1-disable-secure-boot",
          label: "Disable Secure Boot in BIOS",
          color: "blue",
        },
      ],
      correctActionId: "bf1-repair-bootloader",
      rationales: [
        {
          id: "bf1-r1",
          text: "The SSD is detected in BIOS with correct model and capacity, ruling out hardware failure. The Windows Boot Manager entry shows 'Not Found,' indicating the EFI boot loader was corrupted, likely during the Windows Update. Startup Repair rebuilds the boot configuration.",
        },
        {
          id: "bf1-r2",
          text: "The SSD is physically detected and functioning. Replacing working hardware wastes money and does not fix a corrupted boot loader.",
        },
        {
          id: "bf1-r3",
          text: "Resetting BIOS to defaults might change the boot mode from UEFI to Legacy or alter other settings, potentially making the situation worse.",
        },
        {
          id: "bf1-r4",
          text: "Disabling Secure Boot does not repair a missing or corrupted Windows Boot Manager entry.",
        },
      ],
      correctRationaleId: "bf1-r1",
      feedback: {
        perfect:
          "Correct. The SSD is detected but the boot loader is missing, which is a classic post-update boot failure. Windows Startup Repair or bootrec commands will rebuild the BCD store.",
        partial:
          "Clearing CMOS resets BIOS settings but does not repair a corrupted Windows boot loader on the SSD.",
        wrong: "The SSD is physically functional. The issue is the EFI boot loader, not the hardware.",
      },
    },
    {
      id: "bf-scenario-2",
      type: "investigate-decide",
      title: "Continuous Reboot Loop",
      objective:
        "A workstation enters an endless reboot cycle: it shows the Windows logo briefly, then restarts. It never reaches the login screen. Safe Mode also fails to load. Investigate the data to determine the appropriate action.",
      investigationData: [
        {
          id: "bf2-safe-mode",
          label: "Boot Attempt Observations",
          content:
            "Normal boot: Windows logo appears for 3 seconds, screen goes black, PC restarts. Safe Mode (F8 > Advanced Options): Same behavior, logo appears briefly then restarts. Last Known Good Configuration: Same reboot loop. Automatic Repair launches but reports 'Automatic Repair couldn't repair your PC. Log file: C:\\Windows\\System32\\LogFiles\\SrtTrail.txt.'",
          isCritical: true,
        },
        {
          id: "bf2-recent-changes",
          label: "Recent System Changes",
          content:
            "The IT department pushed a new antivirus agent to all workstations yesterday. Two other workstations in the same department are experiencing identical symptoms. Workstations in other departments with the same antivirus update are booting normally. The affected machines all have an older BIOS version (1.2.3) compared to working machines (1.4.1).",
          isCritical: true,
        },
        {
          id: "bf2-hardware-check",
          label: "Hardware Diagnostics",
          content:
            "Built-in Dell diagnostics (launched from BIOS) report all hardware tests passed: memory OK, SSD SMART status healthy, CPU test passed, display adapter test passed.",
        },
      ],
      actions: [
        {
          id: "bf2-system-restore",
          label: "Boot to WinRE and use System Restore to roll back to a point before the antivirus deployment",
          color: "green",
        },
        {
          id: "bf2-reinstall-os",
          label: "Reinstall Windows on all three affected machines",
          color: "red",
        },
        {
          id: "bf2-replace-ssd",
          label: "Replace the SSDs in all three machines",
          color: "red",
        },
        {
          id: "bf2-update-bios",
          label: "Update BIOS on the affected machines to version 1.4.1",
          color: "blue",
        },
      ],
      correctActionId: "bf2-system-restore",
      rationales: [
        {
          id: "bf2-r1",
          text: "Three machines with the same older BIOS entered reboot loops after the same antivirus deployment while machines with newer BIOS are fine. The immediate fix is to roll back the software change via System Restore, then investigate the BIOS version incompatibility before redeploying.",
        },
        {
          id: "bf2-r2",
          text: "Reinstalling Windows on three machines is extremely disruptive and unnecessary when System Restore can reverse the software change that caused the loop.",
        },
        {
          id: "bf2-r3",
          text: "All hardware diagnostics passed. The SSDs are healthy. This is a software compatibility issue, not a hardware failure.",
        },
        {
          id: "bf2-r4",
          text: "Updating BIOS while the machines cannot boot requires additional steps and does not immediately resolve the boot loop. System Restore is the fastest path to recovery.",
        },
      ],
      correctRationaleId: "bf2-r1",
      feedback: {
        perfect:
          "Correct. Rolling back the antivirus deployment via System Restore is the fastest, least disruptive fix. The correlation between BIOS version and the failure should be reported to the antivirus vendor.",
        partial:
          "BIOS updates may be needed eventually, but System Restore gets the machines operational immediately.",
        wrong: "Hardware is healthy and identical software caused failures on multiple machines. This is a software issue.",
      },
    },
    {
      id: "bf-scenario-3",
      type: "investigate-decide",
      title: "POST Failure with Beep Codes",
      objective:
        "A PC will not POST at all. The power LED illuminates, fans spin, but the display remains blank. The system emits a pattern of one long beep followed by three short beeps. Investigate the available information.",
      investigationData: [
        {
          id: "bf3-beep-codes",
          label: "Beep Code Reference (AMI BIOS)",
          content:
            "One long beep + three short beeps in AMI BIOS indicates a video adapter failure. This means the BIOS cannot initialize the graphics card during POST. Possible causes: unseated GPU, failed GPU, insufficient power to GPU, or failed PCIe slot.",
          isCritical: true,
        },
        {
          id: "bf3-physical",
          label: "Physical Inspection",
          content:
            "The PC was moved from one office to another yesterday. The side panel was removed during the move for easier carrying. The GPU is a full-size dual-slot card. Visual inspection shows the GPU appears to be seated in the PCIe x16 slot, but the retention clip at the end of the slot is not engaged. The 8-pin PCIe power cable is connected. No visible damage to the card or slot.",
          isCritical: true,
        },
        {
          id: "bf3-power",
          label: "Power Supply Status",
          content:
            "PSU fan is spinning. Motherboard standby LED is lit. CPU fan is spinning. Case fans are spinning. The 24-pin ATX and 8-pin CPU power connectors appear fully seated.",
        },
      ],
      actions: [
        {
          id: "bf3-reseat-gpu",
          label: "Power off, reseat the GPU firmly until the retention clip clicks, and attempt to boot again",
          color: "green",
        },
        {
          id: "bf3-replace-psu",
          label: "Replace the power supply unit",
          color: "orange",
        },
        {
          id: "bf3-replace-motherboard",
          label: "Replace the motherboard due to a failed PCIe slot",
          color: "red",
        },
        {
          id: "bf3-connect-to-integrated",
          label: "Connect the monitor to the motherboard integrated graphics output",
          color: "blue",
        },
      ],
      correctActionId: "bf3-reseat-gpu",
      rationales: [
        {
          id: "bf3-r1",
          text: "The beep code specifically indicates video adapter failure. Physical inspection reveals the GPU retention clip is not engaged after the PC was moved, meaning the card was likely jostled loose. Reseating the GPU is the simplest and most likely fix.",
        },
        {
          id: "bf3-r2",
          text: "All other power indicators are normal (fans spinning, LEDs lit, cables seated). The PSU is not the issue.",
        },
        {
          id: "bf3-r3",
          text: "Replacing the motherboard before attempting to reseat the GPU is premature. The retention clip not being engaged is the most likely explanation after a move.",
        },
        {
          id: "bf3-r4",
          text: "Using integrated graphics bypasses the problem rather than fixing it, and many desktop CPUs or motherboard configurations do not have integrated video output.",
        },
      ],
      correctRationaleId: "bf3-r1",
      feedback: {
        perfect:
          "Correct. The beep code identifies the video subsystem, and the physical evidence shows the GPU was likely dislodged during the move. Reseating is the right first step.",
        partial:
          "Integrated graphics might work as a diagnostic step, but the goal is to fix the discrete GPU that was likely dislodged during transport.",
        wrong: "The evidence points to a loose GPU after a physical move, not a failed PSU or motherboard.",
      },
    },
  ],
  hints: [
    "POST beep codes are your first diagnostic tool when the display is blank. Always look up the beep pattern for the specific BIOS vendor.",
    "When BIOS detects the drive but 'Windows Boot Manager' shows Not Found, the boot loader is corrupted, not the drive itself.",
    "If multiple machines fail after the same software deployment, the software is the common factor, not the hardware.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Boot failures account for a large percentage of desktop support escalations. Technicians who can quickly distinguish between POST failures, boot loader corruption, and hardware issues save significant time and reduce downtime for end users.",
  toolRelevance: [
    "BIOS/UEFI Setup Utility",
    "Windows Recovery Environment (WinRE)",
    "bootrec.exe",
    "Dell/HP/Lenovo Built-in Diagnostics",
    "Startup Repair",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
