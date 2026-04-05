import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "os-macos-troubleshoot",
  version: 1,
  title: "macOS-Specific Troubleshooting",
  tier: "advanced",
  track: "operating-systems",
  difficulty: "challenging",
  accessLevel: "premium",
  tags: ["macos", "apple", "troubleshooting", "terminal", "recovery"],
  description:
    "Troubleshoot macOS-specific issues including kernel panics, Time Machine failures, permission repairs, and startup problems using macOS diagnostic tools and recovery options.",
  estimatedMinutes: 25,
  learningObjectives: [
    "Use macOS Recovery Mode and its built-in diagnostic tools",
    "Troubleshoot kernel panics using console logs and diagnostic reports",
    "Resolve Time Machine backup and restore failures",
    "Reset NVRAM/PRAM and SMC to resolve hardware-related macOS issues",
    "Use Disk Utility First Aid and Terminal commands for macOS repair",
  ],
  sortOrder: 610,
  status: "published",
  prerequisites: [],
  rendererType: "investigate-decide",
  scenarios: [
    {
      id: "mt-scenario-1",
      type: "investigate-decide",
      title: "Recurring Kernel Panic",
      objective:
        "A MacBook Pro (Apple Silicon) experiences random kernel panics (restarts) 2-3 times per day. The user reports it happens during video calls and when using an external USB-C dock. Investigate the diagnostic data and decide on the fix.",
      investigationData: [
        {
          id: "mt1-panic-report",
          label: "Console.app - Panic Reports (/Library/Logs/DiagnosticReports/)",
          content:
            "panic(cpu 0 caller): 'USB host controller error: endpoint not responding'\nKernel Extensions in backtrace:\n  com.CalDigit.USBCDriver (v3.1.2) - THIRD PARTY\n  com.apple.iokit.IOUSBHostFamily (v1.2)\nLast loaded kext: com.CalDigit.USBCDriver\nMachine: MacBookPro18,1 (M1 Pro)\nOS Version: macOS 14.3\nPanics always occur when the CalDigit dock is connected.",
          isCritical: true,
        },
        {
          id: "mt1-usb-tree",
          label: "System Information - USB Device Tree",
          content:
            "CalDigit TS4 Thunderbolt Dock - Firmware v1.08 (latest available: v1.12)\nConnected devices via dock: 2x USB-A peripherals, 1x HDMI display, Ethernet\nDock driver: com.CalDigit.USBCDriver v3.1.2 (installed 6 months ago)\nApple Silicon native: No (running under Rosetta translation layer)\nNote: Panics never occur when the dock is disconnected.",
        },
      ],
      actions: [
        {
          id: "mt1-reinstall-macos",
          label: "Reinstall macOS from Recovery Mode",
          color: "red",
        },
        {
          id: "mt1-update-dock",
          label: "Update the CalDigit dock firmware to v1.12, uninstall the old driver, and install the latest Apple Silicon native driver from CalDigit",
          color: "green",
        },
        {
          id: "mt1-reset-smc",
          label: "Reset the SMC (System Management Controller)",
          color: "orange",
        },
        {
          id: "mt1-replace-dock",
          label: "Replace the CalDigit dock with a new unit",
          color: "blue",
        },
      ],
      correctActionId: "mt1-update-dock",
      rationales: [
        {
          id: "mt1-r1",
          text: "Reinstalling macOS does not address third-party kernel extension issues. The panic backtrace clearly identifies the CalDigit driver as the cause.",
        },
        {
          id: "mt1-r2",
          text: "The panic backtrace identifies the CalDigit USB-C driver running under Rosetta with outdated firmware. Updating the dock firmware to v1.12 and installing the native Apple Silicon driver eliminates the Rosetta translation layer and resolves the USB host controller errors.",
        },
        {
          id: "mt1-r3",
          text: "Apple Silicon Macs do not have a traditional SMC. The T2 chip and Apple Silicon handle power management differently, and an SMC reset would not fix a third-party driver issue.",
        },
        {
          id: "mt1-r4",
          text: "The dock hardware is likely fine since the issue is a software driver running under Rosetta translation. Replacing hardware without updating the driver would reproduce the same panics.",
        },
      ],
      correctRationaleId: "mt1-r2",
      feedback: {
        perfect:
          "Correct. The kernel panic backtrace directly identifies the CalDigit driver. Updating firmware and installing the native Apple Silicon driver resolves the Rosetta compatibility issue causing USB host controller errors.",
        partial:
          "SMC reset does not apply to Apple Silicon Macs in the same way and would not fix a third-party driver issue.",
        wrong: "The panic is caused by a specific third-party driver, not macOS itself or the dock hardware.",
      },
    },
    {
      id: "mt-scenario-2",
      type: "investigate-decide",
      title: "Time Machine Backup Failure",
      objective:
        "Time Machine backups have been failing for 2 weeks with the error 'The backup disk could not be found.' The backup drive is a 2 TB USB external connected directly to an iMac. The drive appears in Finder and files can be read from it.",
      investigationData: [
        {
          id: "mt2-time-machine",
          label: "System Settings > Time Machine",
          content:
            "Backup disk: 'TimeMachine-2TB' - Not Available\nLast successful backup: 14 days ago\nError: 'The backup disk could not be found.'\nDisk is visible in Finder and Disk Utility as 'TimeMachine-2TB'\nDisk Utility shows the volume as APFS format\nThe disk was previously formatted as HFS+ (Mac OS Extended, Journaled)",
          isCritical: true,
        },
        {
          id: "mt2-diskutil",
          label: "Terminal - diskutil info /Volumes/TimeMachine-2TB",
          content:
            "File System: APFS\nType: APFS Volume\nDevice: disk3s1\nMounted: Yes\nNote: Time Machine on macOS Monterey and earlier requires HFS+ (Mac OS Extended, Journaled). APFS backup disks are only supported on macOS Ventura and later.\nCurrent macOS: Monterey 12.7",
        },
      ],
      actions: [
        {
          id: "mt2-reformat",
          label: "Back up existing data, reformat the drive as HFS+ (Mac OS Extended, Journaled), then reconfigure Time Machine",
          color: "green",
        },
        {
          id: "mt2-update-macos",
          label: "Update macOS to Ventura or later to support APFS Time Machine",
          color: "blue",
        },
        {
          id: "mt2-repair-disk",
          label: "Run Disk Utility First Aid on the backup drive",
          color: "orange",
        },
        {
          id: "mt2-new-drive",
          label: "Replace the backup drive with a new one",
          color: "red",
        },
      ],
      correctActionId: "mt2-reformat",
      rationales: [
        {
          id: "mt2-r1",
          text: "The drive was somehow reformatted from HFS+ to APFS, which Time Machine on macOS Monterey does not support. Reformatting back to HFS+ (Mac OS Extended, Journaled) restores compatibility with Time Machine on the current macOS version.",
        },
        {
          id: "mt2-r2",
          text: "While upgrading macOS would add APFS Time Machine support, this may not be feasible if the user has software compatibility requirements keeping them on Monterey. The drive format is the simpler fix.",
        },
        {
          id: "mt2-r3",
          text: "Disk Utility First Aid repairs file system errors but cannot change the file system type. The drive is healthy; it is the wrong format for Time Machine on Monterey.",
        },
        {
          id: "mt2-r4",
          text: "The drive hardware is working correctly. Replacing it would be wasteful when the issue is simply the file system format.",
        },
      ],
      correctRationaleId: "mt2-r1",
      feedback: {
        perfect:
          "Correct. Time Machine on macOS Monterey requires HFS+ (Mac OS Extended, Journaled). Reformatting from APFS back to HFS+ restores Time Machine compatibility.",
        partial:
          "Updating macOS is an alternative but may not be feasible. The most direct fix is reformatting the drive to the correct file system.",
        wrong: "The drive is working fine. The issue is file system format incompatibility with Time Machine on Monterey.",
      },
    },
    {
      id: "mt-scenario-3",
      type: "investigate-decide",
      title: "Mac Stuck on Apple Logo During Boot",
      objective:
        "An M2 MacBook Air is stuck on the Apple logo with a progress bar during startup. The progress bar reaches approximately 75% and then the machine reboots, creating an infinite boot loop. The user recently installed a macOS update.",
      investigationData: [
        {
          id: "mt3-recovery",
          label: "Recovery Mode Observations (Power button held for 10 seconds)",
          content:
            "Successfully boots into macOS Recovery (recoveryOS).\nDisk Utility shows: Macintosh HD - APFS Volume - 245 GB capacity, 180 GB used\nDisk Utility First Aid on the APFS container: No errors found\nThe system volume appears intact.\nNote: The failed update was macOS 14.3 to 14.4.",
        },
        {
          id: "mt3-terminal",
          label: "Recovery Mode Terminal Investigation",
          content:
            "Running 'log show --predicate \"eventMessage contains[c] \\\"error\\\"\" --last boot' from Terminal shows:\nMultiple entries: 'Sealed System Volume verification failed'\n'Snapshot seal is broken - system volume has been modified'\nThis indicates the update partially applied and left the system volume in an inconsistent sealed state.",
          isCritical: true,
        },
      ],
      actions: [
        {
          id: "mt3-erase-reinstall",
          label: "Erase the Mac and reinstall macOS from scratch",
          color: "red",
        },
        {
          id: "mt3-reinstall-over",
          label: "Reinstall macOS from Recovery Mode (over the existing installation) to repair the sealed system volume",
          color: "green",
        },
        {
          id: "mt3-first-aid",
          label: "Run Disk Utility First Aid again more thoroughly",
          color: "orange",
        },
        {
          id: "mt3-downgrade",
          label: "Restore the previous macOS version from a Time Machine backup",
          color: "blue",
        },
      ],
      correctActionId: "mt3-reinstall-over",
      rationales: [
        {
          id: "mt3-r1",
          text: "Erasing and reinstalling destroys all user data. The disk is healthy and user data is intact; only the system volume seal is broken from the interrupted update.",
        },
        {
          id: "mt3-r2",
          text: "Reinstalling macOS from Recovery Mode over the existing installation replaces the system volume files and re-seals the Signed System Volume (SSV) without affecting user data on the Data volume. This is the correct fix for a broken system volume seal.",
        },
        {
          id: "mt3-r3",
          text: "Disk Utility First Aid checks file system integrity but cannot repair a broken Signed System Volume seal. The APFS container has no file system errors; the issue is the system volume's cryptographic seal.",
        },
        {
          id: "mt3-r4",
          text: "Restoring from Time Machine would revert user data to an older state and may not fix the system volume seal. macOS reinstall is the targeted fix.",
        },
      ],
      correctRationaleId: "mt3-r2",
      feedback: {
        perfect:
          "Correct. Reinstalling macOS from Recovery preserves user data while rebuilding the Signed System Volume. This is the standard Apple-recommended fix for broken SSV seals after interrupted updates.",
        partial:
          "Time Machine restore is an option but may lose recent data. macOS reinstall from Recovery is less disruptive.",
        wrong: "The disk and user data are fine. The issue is specifically the system volume seal from an interrupted update.",
      },
    },
  ],
  hints: [
    "Kernel panic backtrace identifies the exact kernel extension causing the crash. Look for third-party drivers first.",
    "Time Machine on macOS Monterey and earlier requires HFS+ (Mac OS Extended, Journaled), not APFS.",
    "Reinstalling macOS from Recovery Mode preserves user data while repairing the system volume.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Many enterprise environments are mixed Windows/macOS. Technicians who can troubleshoot both platforms are significantly more valuable. Apple-specific diagnostic skills are increasingly in demand at help desks and MSPs.",
  toolRelevance: [
    "macOS Recovery Mode",
    "Console.app (Panic Reports)",
    "Disk Utility",
    "Terminal (diskutil, log show)",
    "System Information",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
