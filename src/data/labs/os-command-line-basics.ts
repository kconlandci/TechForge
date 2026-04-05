import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "os-command-line-basics",
  version: 1,
  title: "Choose Correct CLI Commands for System Tasks",
  tier: "beginner",
  track: "operating-systems",
  difficulty: "easy",
  accessLevel: "free",
  tags: ["command-line", "cmd", "powershell", "windows", "cli"],
  description:
    "Select the correct Windows command-line commands to accomplish common system administration tasks including file management, network diagnostics, and system information.",
  estimatedMinutes: 12,
  learningObjectives: [
    "Identify the correct CLI command for common system administration tasks",
    "Distinguish between CMD and PowerShell command equivalents",
    "Use command-line switches and parameters correctly",
    "Understand when elevated (admin) command prompts are required",
  ],
  sortOrder: 602,
  status: "published",
  prerequisites: [],
  rendererType: "action-rationale",
  scenarios: [
    {
      id: "cl-scenario-1",
      type: "action-rationale",
      title: "Repair System Files",
      context:
        "A user reports that Windows is displaying random error messages and some Settings app pages crash immediately. You suspect system file corruption. You have an elevated Command Prompt open. Which command should you run first?",
      actions: [
        {
          id: "cl1-sfc",
          label: "sfc /scannow",
          color: "green",
        },
        {
          id: "cl1-chkdsk",
          label: "chkdsk C: /f /r",
          color: "blue",
        },
        {
          id: "cl1-format",
          label: "format C: /fs:ntfs",
          color: "red",
        },
        {
          id: "cl1-dism",
          label: "DISM /Online /Cleanup-Image /RestoreHealth",
          color: "orange",
        },
      ],
      correctActionId: "cl1-sfc",
      rationales: [
        {
          id: "cl1-r1",
          text: "sfc /scannow (System File Checker) scans all protected system files and replaces corrupted files with cached copies from the Windows component store. It is the correct first step for suspected system file corruption.",
        },
        {
          id: "cl1-r2",
          text: "chkdsk checks disk integrity and file system errors, not Windows system file corruption. It would be appropriate if you suspected bad sectors or file system damage.",
        },
        {
          id: "cl1-r3",
          text: "Formatting the C: drive would destroy the entire Windows installation and all user data. This is never appropriate for troubleshooting.",
        },
        {
          id: "cl1-r4",
          text: "DISM /RestoreHealth repairs the Windows component store itself. It should be run if sfc /scannow reports it cannot fix files, not as the first step.",
        },
      ],
      correctRationaleId: "cl1-r1",
      feedback: {
        perfect:
          "Correct. sfc /scannow is the standard first step for system file corruption. Run DISM only if SFC reports it cannot repair files.",
        partial:
          "DISM is related but should come after SFC. The correct sequence is SFC first, then DISM if SFC fails.",
        wrong: "That command either addresses a different problem or is destructive. System file corruption requires sfc /scannow.",
      },
    },
    {
      id: "cl-scenario-2",
      type: "action-rationale",
      title: "Network Connectivity Troubleshooting",
      context:
        "A workstation can ping its default gateway (192.168.1.1) but cannot access any websites. DNS is configured as 8.8.8.8. You need to verify whether DNS resolution is working. Which command helps diagnose this?",
      actions: [
        {
          id: "cl2-nslookup",
          label: "nslookup google.com",
          color: "green",
        },
        {
          id: "cl2-ping",
          label: "ping google.com",
          color: "blue",
        },
        {
          id: "cl2-ipconfig",
          label: "ipconfig /all",
          color: "orange",
        },
        {
          id: "cl2-netstat",
          label: "netstat -an",
          color: "red",
        },
      ],
      correctActionId: "cl2-nslookup",
      rationales: [
        {
          id: "cl2-r1",
          text: "nslookup directly queries the DNS server to resolve a hostname. If it fails, DNS resolution is confirmed as the problem. If it succeeds, the issue is elsewhere (firewall, proxy, etc.).",
        },
        {
          id: "cl2-r2",
          text: "ping google.com also uses DNS but if it fails you cannot tell whether DNS or ICMP is blocked. nslookup isolates DNS specifically.",
        },
        {
          id: "cl2-r3",
          text: "ipconfig /all shows the configured DNS server address but does not test whether DNS resolution actually works.",
        },
        {
          id: "cl2-r4",
          text: "netstat shows active connections and listening ports. It does not help diagnose DNS resolution failures.",
        },
      ],
      correctRationaleId: "cl2-r1",
      feedback: {
        perfect:
          "Correct. nslookup isolates DNS resolution by directly querying the configured DNS server, confirming whether name resolution is the root cause.",
        partial:
          "That command provides related information but does not directly test DNS resolution in isolation.",
        wrong: "That command does not help diagnose DNS resolution issues specifically.",
      },
    },
    {
      id: "cl-scenario-3",
      type: "action-rationale",
      title: "Disk Space Investigation",
      context:
        "A user's C: drive shows only 2 GB free on a 256 GB SSD. They say they haven't installed anything new. You need to find what is consuming the disk space. You are in an elevated Command Prompt. Which approach is most effective?",
      actions: [
        {
          id: "cl3-dir",
          label: "Run: dir C:\\ /s /a | sort to find large directories",
          color: "blue",
        },
        {
          id: "cl3-cleanmgr",
          label: "Run: cleanmgr /d C: to clean up immediately",
          color: "orange",
        },
        {
          id: "cl3-winsxs",
          label: "Delete the C:\\Windows\\WinSxS folder manually",
          color: "red",
        },
        {
          id: "cl3-tree",
          label: "Run: PowerShell Get-ChildItem C:\\ -Recurse | Sort-Object Length -Descending | Select-Object -First 20 FullName,Length",
          color: "green",
        },
      ],
      correctActionId: "cl3-tree",
      rationales: [
        {
          id: "cl3-r1",
          text: "This PowerShell command recursively scans the drive, sorts files by size, and displays the 20 largest files with their paths. This quickly identifies the space consumers before taking any action.",
        },
        {
          id: "cl3-r2",
          text: "dir /s provides size information but the output is difficult to parse for identifying the largest consumers. The PowerShell approach is more targeted and actionable.",
        },
        {
          id: "cl3-r3",
          text: "Running cleanmgr immediately cleans temp files but does not identify what consumed the space. If the issue is a large log file or database, cleanmgr will not find it.",
        },
        {
          id: "cl3-r4",
          text: "The WinSxS folder is a critical Windows component store. Manually deleting it will break Windows Update and system file repair. Never delete it directly.",
        },
      ],
      correctRationaleId: "cl3-r1",
      feedback: {
        perfect:
          "Excellent. Identifying the largest files first gives you actionable data before performing any cleanup. This prevents blindly deleting temp files when the real consumer could be something else entirely.",
        partial:
          "Cleanup tools help but you should identify the space consumers first to ensure you are addressing the actual problem.",
        wrong: "Deleting system folders or running cleanup without diagnosis can cause serious system damage.",
      },
    },
  ],
  hints: [
    "sfc /scannow repairs corrupted Windows system files; DISM repairs the component store that SFC relies on.",
    "nslookup directly queries DNS servers, isolating DNS issues from other network problems.",
    "Always identify what is consuming resources before running cleanup tools.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Command-line proficiency separates help desk technicians from system administrators. Employers value candidates who can quickly diagnose and resolve issues from the CLI without relying on GUI tools.",
  toolRelevance: [
    "Command Prompt (cmd.exe)",
    "PowerShell",
    "sfc /scannow",
    "nslookup",
    "DISM",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
