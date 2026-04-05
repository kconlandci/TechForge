import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "os-registry-editing",
  version: 1,
  title: "Registry Edits for Common Windows Fixes",
  tier: "intermediate",
  track: "operating-systems",
  difficulty: "moderate",
  accessLevel: "free",
  tags: ["registry", "regedit", "windows", "configuration", "troubleshooting"],
  description:
    "Configure Windows Registry settings to apply common fixes and system customizations, understanding correct key paths, value types, and the importance of backups before editing.",
  estimatedMinutes: 20,
  learningObjectives: [
    "Navigate the Windows Registry hive structure (HKLM, HKCU, HKCR, HKU, HKCC)",
    "Identify correct value types (DWORD, String, Binary, Multi-String, Expandable String)",
    "Apply registry edits for common Windows fixes and hardening",
    "Back up registry keys before making changes",
  ],
  sortOrder: 607,
  status: "published",
  prerequisites: [],
  rendererType: "toggle-config",
  scenarios: [
    {
      id: "re-scenario-1",
      type: "toggle-config",
      title: "Disable USB Storage Devices",
      description:
        "Company policy requires disabling USB mass storage devices on workstations to prevent data exfiltration while keeping USB keyboards and mice functional. Configure the correct registry settings.",
      targetSystem: "Windows 11 Pro - Registry Editor",
      items: [
        {
          id: "re1-key-path",
          label: "Registry Key Path",
          detail: "Select the correct key for USB storage control",
          currentState: "HKLM\\SYSTEM\\CurrentControlSet\\Services\\USB",
          correctState: "HKLM\\SYSTEM\\CurrentControlSet\\Services\\USBSTOR",
          states: [
            "HKLM\\SYSTEM\\CurrentControlSet\\Services\\USB",
            "HKLM\\SYSTEM\\CurrentControlSet\\Services\\USBSTOR",
            "HKCU\\Software\\Policies\\USB",
            "HKLM\\SOFTWARE\\Microsoft\\Windows\\USB",
          ],
          rationaleId: "re1-r1",
        },
        {
          id: "re1-value-name",
          label: "Value Name",
          detail: "The registry value to modify",
          currentState: "Disabled",
          correctState: "Start",
          states: ["Start", "Disabled", "Enabled", "BlockStorage"],
          rationaleId: "re1-r2",
        },
        {
          id: "re1-value-data",
          label: "Value Data (DWORD)",
          detail: "Set the value to disable USB storage",
          currentState: "0",
          correctState: "4",
          states: ["0", "1", "3", "4"],
          rationaleId: "re1-r3",
        },
      ],
      rationales: [
        {
          id: "re1-r1",
          text: "HKLM\\SYSTEM\\CurrentControlSet\\Services\\USBSTOR controls the USB Mass Storage driver specifically. The USB key controls all USB devices, which would disable keyboards and mice too.",
        },
        {
          id: "re1-r2",
          text: "The 'Start' DWORD value in a Services key controls how the driver loads. This is the standard Microsoft mechanism for controlling device driver startup.",
        },
        {
          id: "re1-r3",
          text: "A Start value of 4 means 'Disabled' (driver will not load). Value 3 means 'Manual' (load on demand, which is the default). Value 0 means 'Boot' and value 1 means 'System' start.",
        },
      ],
      feedback: {
        perfect:
          "Correct. Setting USBSTOR\\Start to 4 disables only USB mass storage while leaving other USB devices (HID, audio) fully functional.",
        partial:
          "Check the key path carefully. Modifying the wrong Services key could disable all USB devices including input devices.",
        wrong: "That registry path or value would either affect the wrong devices or not disable USB storage at all.",
      },
    },
    {
      id: "re-scenario-2",
      type: "toggle-config",
      title: "Enable Verbose Logon Messages",
      description:
        "IT security requests that Windows display detailed status messages during startup, shutdown, logon, and logoff instead of generic messages. Configure the registry to enable verbose status messages.",
      targetSystem: "Windows 11 Pro - Registry Editor",
      items: [
        {
          id: "re2-key-path",
          label: "Registry Key Path",
          detail: "Navigate to the correct key for logon verbosity",
          currentState: "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\System",
          correctState: "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System",
          states: [
            "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System",
            "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\System",
            "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Verbose",
            "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Logon",
          ],
          rationaleId: "re2-r1",
        },
        {
          id: "re2-value-name",
          label: "Value Name",
          detail: "The registry value to create or modify",
          currentState: "EnableVerbose",
          correctState: "VerboseStatus",
          states: [
            "VerboseStatus",
            "EnableVerbose",
            "DetailedLogon",
            "StatusMessages",
          ],
          rationaleId: "re2-r2",
        },
        {
          id: "re2-value-data",
          label: "Value Data (DWORD)",
          detail: "Set the value to enable verbose messages",
          currentState: "0",
          correctState: "1",
          states: ["0", "1", "2"],
          rationaleId: "re2-r3",
        },
      ],
      rationales: [
        {
          id: "re2-r1",
          text: "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System is the machine-wide policy key. Using HKCU would only affect the current user and may not apply during startup/shutdown when no user is logged on.",
        },
        {
          id: "re2-r2",
          text: "VerboseStatus is the exact value name Microsoft uses to control detailed status messages. Other names are not recognized by Windows.",
        },
        {
          id: "re2-r3",
          text: "Setting VerboseStatus to 1 (DWORD) enables detailed status messages. Setting it to 0 or removing the value restores the default generic messages.",
        },
      ],
      feedback: {
        perfect:
          "Correct. VerboseStatus = 1 under the HKLM Policies\\System key enables detailed boot, shutdown, logon, and logoff status messages system-wide.",
        partial:
          "The HKCU hive only applies per-user and does not affect system-level startup and shutdown messages.",
        wrong: "That value name or key path is not recognized by Windows for verbose status configuration.",
      },
    },
    {
      id: "re-scenario-3",
      type: "toggle-config",
      title: "Fix Broken File Associations",
      description:
        "After malware removal, double-clicking .exe files opens Notepad instead of running the program. The .exe file association is corrupted in the registry. Fix the association so executables run normally again.",
      targetSystem: "Windows 11 Pro - Registry Editor",
      items: [
        {
          id: "re3-key-path",
          label: "Registry Key Path",
          detail: "Navigate to the .exe file association key",
          currentState: "HKLM\\SOFTWARE\\Classes\\.exe",
          correctState: "HKCR\\.exe",
          states: [
            "HKCR\\.exe",
            "HKLM\\SOFTWARE\\Classes\\.exe",
            "HKCU\\Software\\Classes\\.exe",
            "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\FileExts\\.exe",
          ],
          rationaleId: "re3-r1",
        },
        {
          id: "re3-value-data",
          label: "Default Value for .exe Key",
          detail: "Set the (Default) string value that points to the handler",
          currentState: "txtfile",
          correctState: "exefile",
          states: ["exefile", "txtfile", "Application", "program"],
          rationaleId: "re3-r2",
        },
        {
          id: "re3-content-type",
          label: "Content Type Value",
          detail: "Set the Content Type string value for .exe",
          currentState: "text/plain",
          correctState: "application/x-msdownload",
          states: [
            "application/x-msdownload",
            "text/plain",
            "application/octet-stream",
            "application/exe",
          ],
          rationaleId: "re3-r3",
        },
      ],
      rationales: [
        {
          id: "re3-r1",
          text: "HKCR (HKEY_CLASSES_ROOT) is the merged view of HKLM and HKCU class registrations and is the standard location for file association fixes. Changes here take effect immediately.",
        },
        {
          id: "re3-r2",
          text: "The Default value of 'exefile' points to the HKCR\\exefile key which defines how executables are opened. The malware changed it to 'txtfile' which routes .exe files to Notepad.",
        },
        {
          id: "re3-r3",
          text: "The correct Content Type for executables is 'application/x-msdownload'. The malware set it to 'text/plain' which causes Windows to treat .exe files as text documents.",
        },
      ],
      feedback: {
        perfect:
          "Correct. Restoring HKCR\\.exe Default to 'exefile' and Content Type to 'application/x-msdownload' fixes the corrupted file association and allows executables to run normally.",
        partial:
          "The key path is related but check the exact hive. HKCR is the standard location for file association repairs.",
        wrong: "That value would not restore the correct .exe file association.",
      },
    },
  ],
  hints: [
    "Service driver start types: 0=Boot, 1=System, 2=Automatic, 3=Manual, 4=Disabled.",
    "HKLM settings apply to all users; HKCU settings apply only to the currently logged-in user.",
    "Always export a registry key backup before making changes using File > Export in regedit.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Registry knowledge separates junior technicians from senior engineers. Many enterprise fixes, Group Policy troubleshooting, and malware remediation tasks require direct registry editing skills.",
  toolRelevance: [
    "Registry Editor (regedit.exe)",
    "reg.exe command-line tool",
    "Group Policy Editor (gpedit.msc)",
    "Sysinternals Autoruns",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
