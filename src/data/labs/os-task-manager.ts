import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "os-task-manager",
  version: 1,
  title: "Use Task Manager to Diagnose System Issues",
  tier: "beginner",
  track: "operating-systems",
  difficulty: "easy",
  accessLevel: "free",
  tags: ["task-manager", "performance", "diagnostics", "windows", "processes"],
  description:
    "Use Windows Task Manager to investigate high CPU usage, memory leaks, and unresponsive applications by interpreting process data and taking the correct remediation action.",
  estimatedMinutes: 12,
  learningObjectives: [
    "Interpret Task Manager process and performance data correctly",
    "Identify processes causing high CPU, memory, or disk usage",
    "Distinguish between safe-to-kill and critical system processes",
    "Use Task Manager to set process priority and affinity",
  ],
  sortOrder: 603,
  status: "published",
  prerequisites: [],
  rendererType: "investigate-decide",
  scenarios: [
    {
      id: "tm-scenario-1",
      type: "investigate-decide",
      title: "High CPU Usage Investigation",
      objective:
        "A user reports their computer is extremely slow. Task Manager shows 98% CPU usage. Investigate the data and decide on the correct action.",
      investigationData: [
        {
          id: "tm1-processes",
          label: "Task Manager - Processes Tab",
          content:
            "Processes sorted by CPU:\n1. svchost.exe (Windows Update) - 89% CPU - PID 4812\n2. System Idle Process - 3% CPU\n3. explorer.exe - 2% CPU\n4. dwm.exe - 1% CPU\nTotal processes: 142\nUptime: 47 days",
          isCritical: true,
        },
        {
          id: "tm1-performance",
          label: "Task Manager - Performance Tab",
          content:
            "CPU: Intel Core i5-12400 @ 4.0 GHz\nUtilization: 98%\nProcesses: 142 | Threads: 2,104\nUp time: 47:03:22:15\nMemory: 6.2 / 16 GB (39%)\nDisk: 12% active\nNote: Windows Update has not completed since last reboot 47 days ago.",
        },
      ],
      actions: [
        {
          id: "tm1-end-svchost",
          label: "End the svchost.exe process immediately",
          color: "red",
        },
        {
          id: "tm1-restart-wu",
          label: "Restart the Windows Update service and allow pending updates to install, then reboot",
          color: "green",
        },
        {
          id: "tm1-priority",
          label: "Set the svchost.exe process priority to Low",
          color: "blue",
        },
        {
          id: "tm1-disable-wu",
          label: "Disable Windows Update service permanently",
          color: "orange",
        },
      ],
      correctActionId: "tm1-restart-wu",
      rationales: [
        {
          id: "tm1-r1",
          text: "Killing svchost.exe hosting Windows Update can cause system instability and will not fix the underlying problem. The stuck update will retry and consume CPU again.",
        },
        {
          id: "tm1-r2",
          text: "The system has been running 47 days without a reboot, and Windows Update is stuck consuming 89% CPU. Restarting the Windows Update service clears the stuck state, and rebooting completes pending updates.",
        },
        {
          id: "tm1-r3",
          text: "Lowering the priority is a temporary workaround that does not fix the stuck update. The process will still consume resources in the background indefinitely.",
        },
        {
          id: "tm1-r4",
          text: "Disabling Windows Update permanently leaves the system vulnerable to unpatched security exploits and is never recommended in a production environment.",
        },
      ],
      correctRationaleId: "tm1-r2",
      feedback: {
        perfect:
          "Correct. A stuck Windows Update after 47 days without reboot is a common cause of high CPU. Restarting the service and rebooting resolves the stuck state.",
        partial:
          "Lowering priority reduces the symptom but does not address the root cause of the stuck update.",
        wrong: "That action either causes system instability or creates a security vulnerability.",
      },
    },
    {
      id: "tm-scenario-2",
      type: "investigate-decide",
      title: "Memory Leak Detection",
      objective:
        "A workstation becomes progressively slower throughout the day and only improves after a reboot. Investigate the Task Manager data to find the cause.",
      investigationData: [
        {
          id: "tm2-processes",
          label: "Task Manager - Processes Tab (sorted by Memory)",
          content:
            "1. chrome.exe (32 tabs) - 4.8 GB\n2. java.exe (Company CRM App) - 3.9 GB\n3. MsMpEng.exe (Antimalware Service) - 420 MB\n4. explorer.exe - 180 MB\nTotal committed: 12.4 / 16 GB\nNote: The CRM app memory increases by ~200 MB per hour and never decreases.",
          isCritical: true,
        },
        {
          id: "tm2-performance",
          label: "Task Manager - Performance Tab (Memory)",
          content:
            "In use: 12.4 GB\nAvailable: 3.6 GB\nCommitted: 14.1 / 19.8 GB\nCached: 2.1 GB\nPaged pool: 890 MB\nNon-paged pool: 412 MB\nNote: At 9 AM the CRM app was using 1.2 GB. It is now 4 PM.",
        },
      ],
      actions: [
        {
          id: "tm2-add-ram",
          label: "Recommend adding more RAM to the workstation",
          color: "orange",
        },
        {
          id: "tm2-close-chrome",
          label: "Close Chrome tabs to free memory",
          color: "blue",
        },
        {
          id: "tm2-report-crm",
          label: "Report the CRM app memory leak to the vendor and schedule periodic restarts of the application as a workaround",
          color: "green",
        },
        {
          id: "tm2-increase-pagefile",
          label: "Increase the page file size to compensate",
          color: "red",
        },
      ],
      correctActionId: "tm2-report-crm",
      rationales: [
        {
          id: "tm2-r1",
          text: "Adding RAM does not fix a memory leak. The application will eventually consume whatever memory is available. The root cause is the CRM app, not insufficient hardware.",
        },
        {
          id: "tm2-r2",
          text: "Chrome is using significant memory with 32 tabs but its usage is stable. The CRM app grew from 1.2 GB to 3.9 GB in 7 hours, clearly indicating a memory leak.",
        },
        {
          id: "tm2-r3",
          text: "The CRM app shows classic memory leak behavior: continuous growth (~200 MB/hour) that never decreases. Reporting to the vendor addresses the root cause while periodic restarts provide an immediate workaround.",
        },
        {
          id: "tm2-r4",
          text: "Increasing the page file lets the system page more to disk but makes the workstation even slower due to disk I/O. It masks the leak rather than fixing it.",
        },
      ],
      correctRationaleId: "tm2-r3",
      feedback: {
        perfect:
          "Excellent. You correctly identified the memory leak pattern (continuous growth without release) and chose the right approach: report the bug and implement a restart workaround.",
        partial:
          "Chrome uses a lot of memory but its usage is stable. Focus on the process that keeps growing without releasing memory.",
        wrong: "That approach either masks the memory leak or addresses the wrong process.",
      },
    },
    {
      id: "tm-scenario-3",
      type: "investigate-decide",
      title: "Suspicious Process Investigation",
      objective:
        "Antivirus alerts triggered on a workstation. The user says they downloaded a free PDF converter. Investigate Task Manager to identify the suspicious process.",
      investigationData: [
        {
          id: "tm3-processes",
          label: "Task Manager - Processes Tab",
          content:
            "Suspicious entries:\n1. svch0st.exe - 24% CPU, 890 MB RAM - No description - Location: C:\\Users\\jsmith\\AppData\\Local\\Temp\\\n2. svchost.exe - 1% CPU, 45 MB RAM - Host Process for Windows Services - Location: C:\\Windows\\System32\\\n3. PDFConverter.exe - 0% CPU, 120 MB RAM - Free PDF Tools Inc.\nNote: svch0st.exe (with a zero instead of letter 'o') is NOT a legitimate Windows process.",
          isCritical: true,
        },
        {
          id: "tm3-details",
          label: "Task Manager - Details Tab",
          content:
            "svch0st.exe:\n  PID: 7744\n  Status: Running\n  User name: jsmith\n  CPU: 24%\n  Description: (empty)\n  No digital signature\n  Started: 10 minutes after PDFConverter.exe was first launched",
        },
      ],
      actions: [
        {
          id: "tm3-end-svchost",
          label: "End the legitimate svchost.exe process",
          color: "red",
        },
        {
          id: "tm3-end-suspicious",
          label: "End svch0st.exe, uninstall PDFConverter, run full antivirus scan, and check startup entries",
          color: "green",
        },
        {
          id: "tm3-ignore",
          label: "Ignore since antivirus will handle it",
          color: "orange",
        },
        {
          id: "tm3-end-pdf",
          label: "End only PDFConverter.exe and leave svch0st.exe running",
          color: "blue",
        },
      ],
      correctActionId: "tm3-end-suspicious",
      rationales: [
        {
          id: "tm3-r1",
          text: "The legitimate svchost.exe in System32 is a critical Windows service host. Ending it would crash the system. The malicious one is svch0st.exe (with a zero) in the Temp folder.",
        },
        {
          id: "tm3-r2",
          text: "svch0st.exe is malware disguised with a name similar to svchost.exe. It runs from the user Temp folder, has no digital signature, and was spawned by PDFConverter. Ending it, removing the source, scanning, and checking startup entries is the complete remediation.",
        },
        {
          id: "tm3-r3",
          text: "Relying solely on antivirus is risky because the malware is actively running and may be exfiltrating data. Immediate manual intervention stops the active threat.",
        },
        {
          id: "tm3-r4",
          text: "Ending only PDFConverter leaves the spawned malware process running. svch0st.exe is the actual threat and must be terminated along with removing its source.",
        },
      ],
      correctRationaleId: "tm3-r2",
      feedback: {
        perfect:
          "Correct. You identified the impostor process (svch0st.exe with a zero) and chose comprehensive remediation: kill the malware, remove the source, scan, and check persistence.",
        partial:
          "You need to address both the malware process and its source application for complete remediation.",
        wrong: "That action either targets the wrong process or leaves the active malware running.",
      },
    },
  ],
  hints: [
    "Look at process names carefully. Malware often disguises itself with names similar to legitimate Windows processes.",
    "Memory leaks show a pattern of continuous growth without returning memory when idle.",
    "Check process locations: legitimate Windows processes run from System32, not user Temp folders.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Task Manager is the first tool most IT professionals reach for during troubleshooting. Being able to quickly identify resource hogs, memory leaks, and suspicious processes is a fundamental skill expected at every IT support level.",
  toolRelevance: [
    "Windows Task Manager",
    "Resource Monitor",
    "Process Explorer (Sysinternals)",
    "Performance Monitor",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
