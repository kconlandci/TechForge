import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "os-driver-issues",
  version: 1,
  title: "Diagnose and Fix Driver Problems",
  tier: "intermediate",
  track: "operating-systems",
  difficulty: "moderate",
  accessLevel: "free",
  tags: ["drivers", "device-manager", "hardware", "windows", "troubleshooting"],
  description:
    "Investigate driver-related issues using Device Manager, Event Viewer, and driver verification tools to identify and resolve hardware compatibility and driver failure problems.",
  estimatedMinutes: 18,
  learningObjectives: [
    "Interpret Device Manager error codes and status indicators",
    "Use driver rollback, update, and reinstallation to resolve issues",
    "Identify driver signing and compatibility problems",
    "Distinguish between driver and hardware failures using diagnostic data",
  ],
  sortOrder: 606,
  status: "published",
  prerequisites: [],
  rendererType: "investigate-decide",
  scenarios: [
    {
      id: "di-scenario-1",
      type: "investigate-decide",
      title: "Yellow Triangle in Device Manager",
      objective:
        "After a Windows update, a user's USB webcam stopped working. Device Manager shows a yellow triangle with an exclamation mark on the webcam device. Investigate and decide on the fix.",
      investigationData: [
        {
          id: "di1-device-manager",
          label: "Device Manager - Webcam Properties",
          content:
            "Device: Logitech C920 HD Pro Webcam\nStatus: This device cannot start. (Code 10)\nDriver version: 2.6.0.34 (dated 2024-01-15)\nDriver provider: Microsoft\nLast update: Installed automatically via Windows Update yesterday\nPrevious driver: Logitech driver v2.5.18 (working before update)",
          isCritical: true,
        },
        {
          id: "di1-event-viewer",
          label: "Event Viewer - System Log",
          content:
            "Event ID 219: The driver \\Driver\\WudfRd failed to load for the device USB\\VID_046D&PID_082D\nEvent ID 7000: The Windows Camera Frame Server service failed to start. Error: The specified module could not be found.\nTimestamp: Matches the time of yesterday's Windows Update installation.",
        },
      ],
      actions: [
        {
          id: "di1-uninstall-device",
          label: "Uninstall the device and scan for hardware changes to reinstall",
          color: "blue",
        },
        {
          id: "di1-rollback",
          label: "Roll back the driver to the previous working Logitech version (v2.5.18)",
          color: "green",
        },
        {
          id: "di1-update-latest",
          label: "Check Windows Update for a newer driver version",
          color: "orange",
        },
        {
          id: "di1-replace-webcam",
          label: "Replace the webcam hardware since it shows Code 10",
          color: "red",
        },
      ],
      correctActionId: "di1-rollback",
      rationales: [
        {
          id: "di1-r1",
          text: "Uninstalling and rescanning may reinstall the same problematic Microsoft driver from Windows Update, reproducing the issue.",
        },
        {
          id: "di1-r2",
          text: "The webcam worked with the Logitech driver v2.5.18 before Windows Update replaced it with the Microsoft driver v2.6.0.34. Rolling back restores the proven working driver and resolves the Code 10 error.",
        },
        {
          id: "di1-r3",
          text: "Windows Update already installed what it considers the latest driver, which is the one causing the problem. Checking again will offer the same broken driver.",
        },
        {
          id: "di1-r4",
          text: "Code 10 (device cannot start) is a driver/software error, not a hardware failure. The device worked before the driver change, confirming the hardware is fine.",
        },
      ],
      correctRationaleId: "di1-r2",
      feedback: {
        perfect:
          "Correct. The timeline clearly shows the Microsoft driver from Windows Update caused the failure. Rolling back to the working Logitech driver is the targeted fix.",
        partial:
          "Reinstalling may bring back the same broken driver. Use the rollback feature to return to the known working version.",
        wrong: "The hardware is not defective. The issue is clearly driver-related based on the timeline.",
      },
    },
    {
      id: "di-scenario-2",
      type: "investigate-decide",
      title: "Blue Screen After GPU Driver Update",
      objective:
        "A user manually installed a new NVIDIA GPU driver and now gets a BSOD (DRIVER_IRQL_NOT_LESS_OR_EQUAL) during Windows startup. The system cannot boot to the desktop.",
      investigationData: [
        {
          id: "di2-bsod",
          label: "BSOD Details (from automatic repair screen)",
          content:
            "Stop code: DRIVER_IRQL_NOT_LESS_OR_EQUAL\nWhat failed: nvlddmkm.sys\nThis error started immediately after the NVIDIA driver update.\nThe system enters a boot loop and cannot reach the desktop.\nAutomatic Repair has launched after 3 failed boots.",
          isCritical: true,
        },
        {
          id: "di2-safe-mode",
          label: "Safe Mode Boot Attempt",
          content:
            "Windows boots successfully in Safe Mode.\nDevice Manager in Safe Mode shows the NVIDIA GPU with driver version 560.94 (newly installed).\nPrevious working driver was 551.76.\nSafe Mode uses the Microsoft Basic Display Adapter driver, bypassing nvlddmkm.sys.",
        },
      ],
      actions: [
        {
          id: "di2-system-restore",
          label: "Run System Restore from the recovery environment to a point before the driver update",
          color: "blue",
        },
        {
          id: "di2-safe-mode-rollback",
          label: "Boot into Safe Mode, open Device Manager, and roll back the NVIDIA driver to version 551.76",
          color: "green",
        },
        {
          id: "di2-reinstall-windows",
          label: "Reinstall Windows since the system cannot boot",
          color: "red",
        },
        {
          id: "di2-disable-gpu",
          label: "Disable the GPU in BIOS and use integrated graphics permanently",
          color: "orange",
        },
      ],
      correctActionId: "di2-safe-mode-rollback",
      rationales: [
        {
          id: "di2-r1",
          text: "System Restore works but is broader than needed. It may revert other system changes made since the restore point, potentially causing additional issues.",
        },
        {
          id: "di2-r2",
          text: "Safe Mode bypasses the problematic NVIDIA driver and loads the basic display adapter instead. From Safe Mode, Device Manager can roll back to the specific previous working driver version (551.76), precisely targeting the issue.",
        },
        {
          id: "di2-r3",
          text: "Reinstalling Windows is completely unnecessary. The system boots fine in Safe Mode, confirming the OS is intact. Only the GPU driver needs to be reverted.",
        },
        {
          id: "di2-r4",
          text: "Permanently disabling the dedicated GPU degrades performance and does not fix the driver issue. The GPU hardware is fine; only the driver version is problematic.",
        },
      ],
      correctRationaleId: "di2-r2",
      feedback: {
        perfect:
          "Correct. Safe Mode provides a working environment to roll back the specific problematic driver. This is the most precise fix with minimal impact on other system settings.",
        partial:
          "System Restore would work but may revert other unrelated changes. Safe Mode driver rollback is more targeted.",
        wrong: "The OS and GPU hardware are both fine. Only the driver version needs to change.",
      },
    },
    {
      id: "di-scenario-3",
      type: "investigate-decide",
      title: "Network Adapter Not Detected",
      objective:
        "After replacing a motherboard, the Ethernet adapter is not detected in Windows. There is no network adapter listed in Device Manager, not even with an error. The user needs network connectivity to download drivers.",
      investigationData: [
        {
          id: "di3-device-manager",
          label: "Device Manager Observations",
          content:
            "Network adapters section: Only 'WAN Miniport' entries visible (no physical adapter)\nOther devices section: One entry with yellow question mark: 'Ethernet Controller' (no driver installed)\nThe new motherboard uses an Intel I226-V 2.5GbE NIC.\nWindows does not include an inbox driver for this specific chipset.",
          isCritical: true,
        },
        {
          id: "di3-system-info",
          label: "System Information",
          content:
            "OS: Windows 10 22H2\nMotherboard: ASUS TUF GAMING B760M-PLUS (new replacement)\nPrevious board: ASUS PRIME B660M-A (used Intel I219-V, driver was included in Windows)\nUSB ports and other devices are all functional.\nThe user has a USB flash drive and access to another computer.",
        },
      ],
      actions: [
        {
          id: "di3-windows-update",
          label: "Run Windows Update to find the driver automatically",
          color: "red",
        },
        {
          id: "di3-download-usb",
          label: "Download the Intel I226-V driver from Intel or ASUS on another computer, transfer via USB, and install manually",
          color: "green",
        },
        {
          id: "di3-restore-backup",
          label: "Restore a system backup from before the motherboard swap",
          color: "orange",
        },
        {
          id: "di3-usb-wifi",
          label: "Buy a USB WiFi adapter as a permanent replacement",
          color: "blue",
        },
      ],
      correctActionId: "di3-download-usb",
      rationales: [
        {
          id: "di3-r1",
          text: "Windows Update requires network connectivity, which is the exact thing that is broken. This creates a chicken-and-egg problem.",
        },
        {
          id: "di3-r2",
          text: "Using another computer to download the correct Intel I226-V driver from the manufacturer, transferring it via USB flash drive, and installing manually is the standard sneakernet approach when network drivers are missing.",
        },
        {
          id: "di3-r3",
          text: "Restoring a backup from the old motherboard would install drivers for the old I219-V chipset, not the new I226-V. It would also revert all other system changes.",
        },
        {
          id: "di3-r4",
          text: "Buying additional hardware is unnecessary when the built-in NIC works perfectly with the correct driver. The I226-V is a high-quality 2.5GbE adapter.",
        },
      ],
      correctRationaleId: "di3-r2",
      feedback: {
        perfect:
          "Correct. When network drivers are missing, the sneakernet approach (download on another computer, transfer via USB) is the standard professional solution.",
        partial:
          "A USB WiFi adapter would provide connectivity but wastes money when the built-in NIC just needs its driver.",
        wrong: "That approach either requires the non-functional network or installs wrong drivers.",
      },
    },
  ],
  hints: [
    "Device Manager Code 10 means the device cannot start, which is almost always a driver issue, not hardware.",
    "Safe Mode loads only basic drivers, making it the ideal environment for rolling back problematic drivers.",
    "When network drivers are missing, use another computer and USB to transfer the correct driver package.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Driver troubleshooting is a core competency for desktop support. Understanding Device Manager error codes, driver rollback, and Safe Mode diagnostics are skills used daily in enterprise IT support.",
  toolRelevance: [
    "Device Manager",
    "Event Viewer",
    "Safe Mode",
    "Driver Rollback",
    "sigverif (Signature Verification)",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
