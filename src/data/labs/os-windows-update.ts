import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "os-windows-update",
  version: 1,
  title: "Troubleshoot Windows Update Failures",
  tier: "beginner",
  track: "operating-systems",
  difficulty: "easy",
  accessLevel: "free",
  tags: ["windows-update", "troubleshooting", "patches", "maintenance", "windows"],
  description:
    "Diagnose and remediate Windows Update failures by interpreting error codes, analyzing update logs, and applying the correct fix for stuck or failed updates.",
  estimatedMinutes: 15,
  learningObjectives: [
    "Interpret common Windows Update error codes and their meanings",
    "Use the Windows Update troubleshooter and manual remediation steps",
    "Reset Windows Update components when standard fixes fail",
    "Identify when disk space, driver conflicts, or corruption cause update failures",
  ],
  sortOrder: 604,
  status: "published",
  prerequisites: [],
  rendererType: "triage-remediate",
  scenarios: [
    {
      id: "wu-scenario-1",
      type: "triage-remediate",
      title: "Update Stuck at Download",
      description:
        "Windows Update has been stuck at 'Downloading updates... 0%' for 3 hours. The network connection tests fine for browsing. The user tried rebooting but the issue persists.",
      evidence: [
        { type: "diagnostic", content: "Windows Update shows 'Downloading updates... 0%' for 3+ hours" },
        { type: "diagnostic", content: "Internet browsing works normally" },
        { type: "log", content: "Event Viewer shows: 'BITS Transfer Error: 0x80072EE7 - The server name or address could not be resolved'" },
        { type: "diagnostic", content: "C:\\Windows\\SoftwareDistribution folder is 8.4 GB" },
      ],
      classifications: [
        {
          id: "wu1-c1",
          label: "Network connectivity issue",
          description: "The system has a general network problem preventing communication with Microsoft update servers.",
        },
        {
          id: "wu1-c2",
          label: "Corrupted Windows Update cache",
          description: "The local SoftwareDistribution folder has become corrupted, preventing new downloads.",
        },
        {
          id: "wu1-c3",
          label: "Insufficient disk space",
          description: "The system drive does not have enough free space to download and install updates.",
        },
      ],
      correctClassificationId: "wu1-c2",
      remediations: [
        {
          id: "wu1-rem1",
          label: "Reset network adapter and flush DNS",
          description: "Run netsh winsock reset and ipconfig /flushdns to clear network state.",
        },
        {
          id: "wu1-rem2",
          label: "Stop the Windows Update and BITS services, rename the SoftwareDistribution folder, restart services",
          description: "Run net stop wuauserv && net stop bits, rename C:\\Windows\\SoftwareDistribution to .old, then restart services.",
        },
        {
          id: "wu1-rem3",
          label: "Run Disk Cleanup to free space",
          description: "Use cleanmgr /d C: to remove temporary files and free disk space.",
        },
      ],
      correctRemediationId: "wu1-rem2",
      rationales: [
        {
          id: "wu1-r1",
          text: "While the BITS error mentions name resolution, browsing works fine. The bloated 8.4 GB SoftwareDistribution folder and the BITS error together indicate a corrupted update cache, not a network issue.",
        },
        {
          id: "wu1-r2",
          text: "Stopping the Windows Update (wuauserv) and BITS services, renaming C:\\Windows\\SoftwareDistribution to .old, and restarting the services forces Windows Update to rebuild a fresh cache, resolving the corrupted download state.",
        },
      ],
      correctRationaleId: "wu1-r2",
      feedback: {
        perfect:
          "Correct. The bloated SoftwareDistribution folder with BITS errors despite working internet confirms cache corruption. Resetting the folder is the standard fix.",
        partial:
          "The classification is close but focus on why browsing works while BITS fails. The cache is the differentiator.",
        wrong: "Internet browsing works, so general network fixes won't address the Windows Update-specific failure.",
      },
    },
    {
      id: "wu-scenario-2",
      type: "triage-remediate",
      title: "Feature Update Installation Failure",
      description:
        "A Windows 10 to Windows 11 feature update fails repeatedly at 61% with error code 0xC1900101 - 0x20017. The machine reverts to the previous version each time.",
      evidence: [
        { type: "log", content: "Error: 0xC1900101 - 0x20017 (SAFE_OS phase, BOOT operation)" },
        { type: "log", content: "C:\\$WINDOWS.~BT\\Sources\\Panther\\setuperr.log shows: 'Driver conflict detected during OOBE boot phase'" },
        { type: "diagnostic", content: "Device Manager shows a third-party USB 3.0 controller with driver from 2018" },
        { type: "diagnostic", content: "System has an older BIOS version (v1.2, current available is v2.1)" },
      ],
      classifications: [
        {
          id: "wu2-c1",
          label: "Incompatible or outdated driver blocking the upgrade",
          description: "A third-party driver is causing a conflict during the Windows feature update OOBE boot phase.",
        },
        {
          id: "wu2-c2",
          label: "Insufficient hardware requirements for Windows 11",
          description: "The machine does not meet the minimum hardware specifications for Windows 11.",
        },
        {
          id: "wu2-c3",
          label: "Corrupted Windows Update components",
          description: "The Windows Update service or component store files are damaged.",
        },
      ],
      correctClassificationId: "wu2-c1",
      remediations: [
        {
          id: "wu2-rem1",
          label: "Uninstall the third-party USB 3.0 controller driver, update BIOS to latest version, then retry the feature update",
          description: "Remove the incompatible 2018 driver from Device Manager and flash the BIOS from v1.2 to v2.1 before retrying.",
        },
        {
          id: "wu2-rem2",
          label: "Run sfc /scannow and DISM /RestoreHealth before retrying",
          description: "Scan for and repair corrupted Windows system files and the component store.",
        },
        {
          id: "wu2-rem3",
          label: "Perform a clean install of Windows 11 instead of upgrading",
          description: "Wipe the drive and perform a fresh Windows 11 installation, losing all existing data and applications.",
        },
      ],
      correctRemediationId: "wu2-rem1",
      rationales: [
        {
          id: "wu2-r1",
          text: "Error 0xC1900101 specifically indicates a driver issue during the upgrade. The setup log confirms a driver conflict, and the outdated USB 3.0 driver from 2018 combined with the old BIOS are the most likely causes.",
        },
        {
          id: "wu2-r2",
          text: "Removing the incompatible USB driver removes the conflict during OOBE boot, and updating the BIOS resolves low-level firmware compatibility issues that can block feature updates during the SAFE_OS phase.",
        },
      ],
      correctRationaleId: "wu2-r2",
      feedback: {
        perfect:
          "Excellent. The 0xC1900101 error family always points to driver issues. Removing the conflicting driver and updating BIOS addresses both hardware compatibility factors.",
        partial:
          "SFC/DISM addresses system file corruption but the error code and logs specifically point to a driver conflict, not corruption.",
        wrong: "A clean install is excessive when the specific driver causing the conflict has been identified.",
      },
    },
    {
      id: "wu-scenario-3",
      type: "triage-remediate",
      title: "Cumulative Update Fails to Install",
      description:
        "A monthly cumulative update (KB5034441) repeatedly fails with error 0x80070643. The update downloads successfully but fails during the installation phase.",
      evidence: [
        { type: "log", content: "Error: 0x80070643 - ERROR_INSTALL_FAILURE" },
        { type: "diagnostic", content: "Update: KB5034441 (Windows Recovery Environment Update)" },
        { type: "diagnostic", content: "Recovery partition size: 250 MB (requires minimum 750 MB for WinRE updates)" },
        { type: "log", content: "C:\\Windows\\Logs\\CBS\\CBS.log shows: 'Not enough space on recovery partition to apply the update'" },
      ],
      classifications: [
        {
          id: "wu3-c1",
          label: "Windows Update service corruption",
          description: "The Windows Update service or its dependencies have become corrupted.",
        },
        {
          id: "wu3-c2",
          label: "Recovery partition too small for the WinRE update",
          description: "The recovery partition lacks sufficient space to apply the Windows Recovery Environment update.",
        },
        {
          id: "wu3-c3",
          label: "Antivirus blocking the update installation",
          description: "Security software is interfering with the update installation process.",
        },
      ],
      correctClassificationId: "wu3-c2",
      remediations: [
        {
          id: "wu3-rem1",
          label: "Run the Windows Update troubleshooter",
          description: "Use the built-in troubleshooter to automatically detect and fix Windows Update issues.",
        },
        {
          id: "wu3-rem2",
          label: "Use diskpart to resize the recovery partition to at least 750 MB, then retry the update",
          description: "Shrink the adjacent partition and extend the recovery partition using diskpart commands.",
        },
        {
          id: "wu3-rem3",
          label: "Temporarily disable antivirus and retry",
          description: "Turn off real-time protection in Windows Defender or third-party AV and reattempt the update.",
        },
      ],
      correctRemediationId: "wu3-rem2",
      rationales: [
        {
          id: "wu3-r1",
          text: "The CBS log explicitly states insufficient space on the recovery partition. KB5034441 updates the Windows Recovery Environment which requires at least 750 MB, but the partition is only 250 MB.",
        },
        {
          id: "wu3-r2",
          text: "Using diskpart to shrink the adjacent partition and extend the recovery partition to 750 MB+ provides the space needed for WinRE updates. This is the documented Microsoft fix for this specific error.",
        },
      ],
      correctRationaleId: "wu3-r2",
      feedback: {
        perfect:
          "Correct. This is a well-known issue where older Windows installations have undersized recovery partitions. Resizing to 750 MB+ is the documented Microsoft solution.",
        partial:
          "The troubleshooter cannot fix partition size issues. The CBS log clearly identifies insufficient recovery partition space.",
        wrong: "Antivirus and service corruption are not indicated by the evidence. The logs point directly to partition space.",
      },
    },
  ],
  hints: [
    "Error 0xC1900101 codes always indicate driver compatibility issues during Windows upgrades.",
    "A bloated SoftwareDistribution folder combined with download failures usually means corrupted update cache.",
    "Check CBS.log and setuperr.log for detailed failure reasons that the Windows Update UI does not display.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Windows Update failures are among the most frequent support tickets in enterprise environments. Knowing how to read update logs, interpret error codes, and apply targeted fixes demonstrates the diagnostic skills employers seek.",
  toolRelevance: [
    "Windows Update Settings",
    "Event Viewer",
    "CBS.log / setuperr.log",
    "net stop wuauserv / net start wuauserv",
    "diskpart",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
