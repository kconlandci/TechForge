import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "ts-slow-computer",
  version: 1,
  title: "Systematically Diagnose a Slow PC",
  tier: "beginner",
  track: "hardware-network-troubleshooting",
  difficulty: "easy",
  accessLevel: "free",
  tags: [
    "performance",
    "task-manager",
    "resource-monitor",
    "disk",
    "memory",
    "troubleshooting",
  ],
  description:
    "A user reports their PC is extremely slow. Use Task Manager, Resource Monitor, and disk health tools to identify the bottleneck and apply the correct fix.",
  estimatedMinutes: 15,
  learningObjectives: [
    "Use Task Manager to identify CPU, memory, disk, and network bottlenecks",
    "Interpret Resource Monitor data to find specific processes causing slowness",
    "Distinguish between RAM exhaustion, disk thrashing, and CPU saturation",
    "Apply targeted performance fixes without unnecessary hardware upgrades",
  ],
  sortOrder: 504,
  status: "published",
  prerequisites: [],
  rendererType: "investigate-decide",
  scenarios: [
    {
      id: "sc-scenario-1",
      type: "investigate-decide",
      title: "Severe Disk Thrashing",
      objective:
        "A user complains their 3-year-old workstation takes 5 minutes to open Outlook and the entire system feels sluggish. Task Manager shows CPU at 12%, Memory at 78%, and Disk at 100% constantly. Investigate to determine the root cause.",
      investigationData: [
        {
          id: "sc1-task-manager",
          label: "Task Manager — Performance Tab",
          content:
            "CPU: 12% utilization. Memory: 6.2 GB / 8 GB (78%). Disk 0 (HGST 1TB HDD): 100% active time, read speed 0.8 MB/s, write speed 0.2 MB/s, average response time 1,850 ms. The disk is a traditional spinning hard drive (5400 RPM). Queue depth shows 14 pending operations.",
          isCritical: true,
        },
        {
          id: "sc1-resource-monitor",
          label: "Resource Monitor — Disk Activity",
          content:
            "Top disk processes: SearchIndexer.exe (Windows Search) writing 45 MB/min to index files, SysMain (Superfetch) prefetching application data, MsMpEng.exe (Windows Defender) performing a full system scan. Combined, these three background processes account for 90% of disk I/O. The user's applications (Outlook, Excel) are queued waiting for disk access.",
          isCritical: true,
        },
        {
          id: "sc1-disk-health",
          label: "CrystalDiskInfo — SMART Status",
          content:
            "SMART status: Good. Reallocated Sector Count: 0. Power-On Hours: 22,418. Current Pending Sector: 0. The drive is mechanically healthy but is a slow 5400 RPM HDD.",
        },
      ],
      actions: [
        {
          id: "sc1-add-ram",
          label: "Add more RAM since memory is at 78%",
          color: "blue",
        },
        {
          id: "sc1-replace-hdd",
          label: "Replace the HDD with an SSD and reschedule background tasks to off-peak hours",
          color: "green",
        },
        {
          id: "sc1-disable-defender",
          label: "Disable Windows Defender permanently",
          color: "red",
        },
        {
          id: "sc1-defrag",
          label: "Defragment the hard drive",
          color: "orange",
        },
      ],
      correctActionId: "sc1-replace-hdd",
      rationales: [
        {
          id: "sc1-r1",
          text: "The disk is at 100% with an average response time of 1,850ms while background services saturate the slow 5400 RPM HDD. Replacing with an SSD eliminates the I/O bottleneck, and rescheduling scans to off-peak hours prevents future contention.",
        },
        {
          id: "sc1-r2",
          text: "Memory at 78% is within normal operating range and is not the bottleneck. The disk is the constraint, as shown by the 100% active time and long queue depth.",
        },
        {
          id: "sc1-r3",
          text: "Disabling Windows Defender removes critical security protection. The correct approach is to schedule scans during non-work hours.",
        },
        {
          id: "sc1-r4",
          text: "Defragmentation can help marginally on HDDs but does not address the fundamental throughput limitation of a 5400 RPM drive under heavy concurrent I/O load.",
        },
      ],
      correctRationaleId: "sc1-r1",
      feedback: {
        perfect:
          "Correct. The data clearly shows disk I/O is the bottleneck. An SSD upgrade plus scheduling background tasks to off-hours is the professional solution.",
        partial:
          "Defragmentation helps marginally but does not solve the core problem of a slow HDD being overwhelmed by concurrent background I/O.",
        wrong: "That action either removes security protection or addresses the wrong bottleneck. Follow the data — the disk is at 100%.",
      },
    },
    {
      id: "sc-scenario-2",
      type: "investigate-decide",
      title: "Memory Exhaustion and Swapping",
      objective:
        "A different user reports their PC grinds to a halt whenever they open more than 10 Chrome tabs along with Excel and Teams. The PC has an SSD, so disk speed should not be the issue. Investigate the data.",
      investigationData: [
        {
          id: "sc2-task-manager",
          label: "Task Manager — Performance and Processes",
          content:
            "CPU: 35%. Memory: 7.8 GB / 8 GB (97%). Disk: 45% active time. The Committed memory shows 12.1 GB / 11.9 GB (pagefile in use). Chrome processes total 4.2 GB, Teams uses 1.1 GB, Excel uses 850 MB. Windows and other processes consume the remaining 1.65 GB.",
          isCritical: true,
        },
        {
          id: "sc2-resource-monitor",
          label: "Resource Monitor — Memory Tab",
          content:
            "Hard Faults/sec: 380 (very high). This indicates the system is constantly swapping pages between RAM and the pagefile on disk. Standby memory: 50 MB (nearly zero cache). Free memory: 12 MB. The system has no memory headroom and is heavily relying on the pagefile.",
          isCritical: true,
        },
        {
          id: "sc2-system-info",
          label: "System Information",
          content:
            "Installed RAM: 8 GB DDR4 (1x8GB in slot A2). Total slots: 2 (one empty). Processor: Intel Core i5-12400. OS: Windows 11 Pro 64-bit. The PC has one empty DIMM slot available.",
        },
      ],
      actions: [
        {
          id: "sc2-add-ram",
          label: "Install an additional 8 GB DDR4 DIMM in the empty slot, bringing total to 16 GB",
          color: "green",
        },
        {
          id: "sc2-replace-ssd",
          label: "Replace the SSD with a faster NVMe drive",
          color: "orange",
        },
        {
          id: "sc2-limit-chrome",
          label: "Tell the user to use fewer Chrome tabs",
          color: "blue",
        },
        {
          id: "sc2-increase-pagefile",
          label: "Increase the pagefile size to 32 GB",
          color: "yellow",
        },
      ],
      correctActionId: "sc2-add-ram",
      rationales: [
        {
          id: "sc2-r1",
          text: "Memory is at 97% with 380 hard faults per second, meaning the system is constantly swapping to disk. The user's workflow legitimately requires more than 8 GB. Adding 8 GB via the empty slot directly addresses the bottleneck.",
        },
        {
          id: "sc2-r2",
          text: "A faster SSD makes swapping slightly less painful but does not fix the root cause: insufficient RAM for the workload.",
        },
        {
          id: "sc2-r3",
          text: "Limiting Chrome tabs is a workaround that restricts productivity. The user's workflow is reasonable for a modern office worker; the hardware should accommodate it.",
        },
        {
          id: "sc2-r4",
          text: "A larger pagefile provides more virtual memory space but swapping to disk is orders of magnitude slower than RAM. It masks the problem rather than solving it.",
        },
      ],
      correctRationaleId: "sc2-r1",
      feedback: {
        perfect:
          "Correct. The data shows memory exhaustion with heavy pagefile usage. Adding RAM to the empty slot is the direct, cost-effective fix for this workload.",
        partial:
          "Increasing the pagefile or using a faster disk are band-aids. The workload legitimately needs more RAM.",
        wrong: "The bottleneck is clearly RAM. Follow the performance data to the correct hardware upgrade.",
      },
    },
    {
      id: "sc-scenario-3",
      type: "investigate-decide",
      title: "Cryptominer Masquerading as System Process",
      objective:
        "A user reports their PC fan runs at full speed constantly and the system is slow even with no applications open. The PC was fine until a week ago. Investigate the unusual performance data.",
      investigationData: [
        {
          id: "sc3-task-manager",
          label: "Task Manager — Processes",
          content:
            "CPU: 95% utilization with no visible user applications running. The top process is 'Windows Audio Service Host' using 88% CPU across all 6 cores. However, the real Windows Audio Service (Audiosrv) normally uses less than 1% CPU. This process has a PID of 7742 and its path shows C:\\ProgramData\\WinAudio\\svchost.exe instead of the legitimate C:\\Windows\\System32\\svchost.exe.",
          isCritical: true,
        },
        {
          id: "sc3-autoruns",
          label: "Autoruns — Scheduled Tasks",
          content:
            "A scheduled task named 'WindowsAudioMaintenance' runs at startup, executing C:\\ProgramData\\WinAudio\\svchost.exe. The task was created 7 days ago. The publisher field is blank. The digital signature is 'Not verified.' The user installed a free PDF converter application from the internet 8 days ago.",
          isCritical: true,
        },
        {
          id: "sc3-network",
          label: "Resource Monitor — Network Activity",
          content:
            "The suspicious svchost.exe (PID 7742) maintains a persistent connection to IP 185.220.101.x on port 3333, which is a common port for cryptocurrency mining pool communication. Data transfer is minimal (stratum protocol) but constant.",
        },
      ],
      actions: [
        {
          id: "sc3-end-process",
          label: "Just end the process in Task Manager and move on",
          color: "orange",
        },
        {
          id: "sc3-remove-malware",
          label: "Kill the process, delete the malicious files and scheduled task, run a full antimalware scan, and remove the PDF converter",
          color: "green",
        },
        {
          id: "sc3-reinstall-audio",
          label: "Reinstall the Windows audio driver",
          color: "red",
        },
        {
          id: "sc3-upgrade-cpu",
          label: "Upgrade the CPU since it cannot handle the workload",
          color: "red",
        },
      ],
      correctActionId: "sc3-remove-malware",
      rationales: [
        {
          id: "sc3-r1",
          text: "The process is a cryptominer disguised with a legitimate-sounding name but running from a non-standard path with no digital signature. It was installed via a bundled free application. Complete removal requires killing the process, deleting the files and scheduled task, scanning for additional malware, and removing the source application.",
        },
        {
          id: "sc3-r2",
          text: "Ending the process alone does not remove the scheduled task that restarts it at every boot. The malware will return immediately after a reboot.",
        },
        {
          id: "sc3-r3",
          text: "This is not a Windows audio driver issue. The malicious process is impersonating an audio service but has no relation to actual audio functionality.",
        },
        {
          id: "sc3-r4",
          text: "The CPU is not inadequate. It is being consumed by malware. Upgrading hardware does not fix a security compromise.",
        },
      ],
      correctRationaleId: "sc3-r1",
      feedback: {
        perfect:
          "Excellent. You identified the cryptominer by checking the file path, signature, scheduled task, and network connections. Complete remediation removes all persistence mechanisms.",
        partial:
          "Killing the process is a start, but without removing the scheduled task and source application, the miner will restart at boot.",
        wrong: "This is malware, not a hardware or driver issue. The fake process name is a deliberate disguise.",
      },
    },
  ],
  hints: [
    "In Task Manager, identify which resource is at or near 100%. That is your bottleneck: CPU, memory, disk, or network.",
    "High hard fault rates in Resource Monitor mean the system is swapping RAM contents to disk, which drastically slows everything.",
    "Always verify the file path and digital signature of high-CPU processes. Malware often uses names that mimic legitimate Windows services.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Slow computer complaints are the most frequent help desk tickets. Technicians who can quickly identify the specific bottleneck using Task Manager and Resource Monitor resolve these tickets in minutes instead of hours.",
  toolRelevance: [
    "Task Manager",
    "Resource Monitor",
    "CrystalDiskInfo",
    "Autoruns (Sysinternals)",
    "Windows Defender",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
