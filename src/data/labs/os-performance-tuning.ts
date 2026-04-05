import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "os-performance-tuning",
  version: 1,
  title: "OS Performance Optimization",
  tier: "advanced",
  track: "operating-systems",
  difficulty: "challenging",
  accessLevel: "premium",
  tags: ["performance", "optimization", "tuning", "monitoring", "windows", "troubleshooting"],
  description:
    "Diagnose and remediate operating system performance issues by analyzing resource utilization data, identifying bottlenecks, and applying targeted optimizations for CPU, memory, disk, and startup.",
  estimatedMinutes: 25,
  learningObjectives: [
    "Identify CPU, memory, disk, and network performance bottlenecks using monitoring tools",
    "Optimize Windows startup by managing startup programs and services",
    "Configure virtual memory and page file settings for optimal performance",
    "Use Performance Monitor counters to diagnose sustained resource utilization issues",
    "Apply targeted fixes rather than generic optimization myths",
  ],
  sortOrder: 614,
  status: "published",
  prerequisites: [],
  rendererType: "triage-remediate",
  scenarios: [
    {
      id: "pt-scenario-1",
      type: "triage-remediate",
      title: "Slow Startup and Login Times",
      description:
        "A Windows 11 workstation takes over 5 minutes to reach the desktop after login. Users report seeing a black screen with a spinning cursor for minutes before the desktop appears. The hardware is a modern machine with an NVMe SSD and 16 GB RAM.",
      evidence: [
        { type: "diagnostic", content: "Task Manager Startup tab: 28 programs set to run at startup, 12 rated 'High' impact" },
        { type: "diagnostic", content: "Startup programs include: Dropbox, OneDrive, Teams, Zoom, Slack, Adobe Creative Cloud, Steam, Discord, Spotify, iTunes, Java Update Checker, plus 16 others" },
        { type: "log", content: "Event Viewer: Multiple 'The XYZ service took longer than 30000 milliseconds to start' warnings" },
        { type: "diagnostic", content: "Resource Monitor at login: Disk queue length peaks at 24 (extremely high) during first 3 minutes" },
        { type: "diagnostic", content: "CPU during startup: 100% for 2+ minutes, primarily from AntiVirus real-time scanning startup executables" },
      ],
      classifications: [
        {
          id: "pt1-c1",
          label: "Hardware is insufficient and needs upgrading",
          description: "The computer's hardware components are not powerful enough and need to be replaced or upgraded.",
        },
        {
          id: "pt1-c2",
          label: "Excessive startup programs overwhelming disk I/O and CPU at boot",
          description: "Too many programs launch simultaneously at startup, saturating disk I/O and CPU resources.",
        },
        {
          id: "pt1-c3",
          label: "Windows corruption requiring reinstallation",
          description: "The Windows operating system files are corrupted and require a clean reinstall.",
        },
      ],
      correctClassificationId: "pt1-c2",
      remediations: [
        {
          id: "pt1-rem1",
          label: "Disable non-essential startup programs (keep only security and OS-critical items), defer application launches using Task Scheduler delayed start",
          description: "Use Task Manager Startup tab to disable non-essential items and create delayed-start scheduled tasks for needed apps.",
        },
        {
          id: "pt1-rem2",
          label: "Upgrade to 32 GB RAM and a faster NVMe SSD",
          description: "Install additional RAM and replace the storage drive with a higher-performance NVMe SSD.",
        },
        {
          id: "pt1-rem3",
          label: "Install a third-party startup optimizer/cleaner tool",
          description: "Download and install a registry cleaner or startup optimizer application to manage boot programs.",
        },
      ],
      correctRemediationId: "pt1-rem1",
      rationales: [
        {
          id: "pt1-r1",
          text: "28 startup programs simultaneously launching creates a disk I/O storm (queue length 24) and CPU saturation. The NVMe SSD and 16 GB RAM are adequate hardware; the bottleneck is the sheer number of simultaneous startup tasks.",
        },
        {
          id: "pt1-r2",
          text: "Disabling non-essential startup programs reduces the boot-time I/O storm. For programs the user still needs, Task Scheduler can delay their launch by 2-3 minutes, staggering the load and allowing the desktop to become responsive quickly.",
        },
      ],
      correctRationaleId: "pt1-r2",
      feedback: {
        perfect:
          "Correct. Reducing startup programs from 28 to essential-only and staggering remaining launches eliminates the I/O storm. The hardware is fine; the workload at boot is the problem.",
        partial:
          "More RAM won't help when disk I/O is the bottleneck. The SSD is already NVMe; the issue is too many concurrent disk requests at startup.",
        wrong: "Third-party optimizer tools often add their own startup overhead and are not recommended by IT professionals.",
      },
    },
    {
      id: "pt-scenario-2",
      type: "triage-remediate",
      title: "System Freezes During Heavy Workloads",
      description:
        "A workstation running CAD software and multiple large spreadsheets freezes for 30-60 seconds at random intervals. During freezes, the disk activity LED is solid and the mouse cursor stutters.",
      evidence: [
        { type: "diagnostic", content: "RAM: 8 GB installed, consistently at 95-98% usage during normal workflow" },
        { type: "diagnostic", content: "Page file: System managed, currently 4.8 GB on C: drive (SATA HDD, not SSD)" },
        { type: "diagnostic", content: "Resource Monitor: Hard faults/sec peaks at 800+ during freezes (indicates heavy paging)" },
        { type: "diagnostic", content: "Disk: SATA HDD at 100% active time during freeze events, average response time 180ms" },
        { type: "diagnostic", content: "CPU: 35-45% average, not a bottleneck" },
        { type: "diagnostic", content: "The user runs AutoCAD, Excel with 200MB+ files, Chrome with 15 tabs, and Outlook simultaneously" },
      ],
      classifications: [
        {
          id: "pt2-c1",
          label: "Insufficient RAM causing excessive paging to a slow HDD",
          description: "Physical memory is exhausted, forcing Windows to page heavily to a slow mechanical hard drive.",
        },
        {
          id: "pt2-c2",
          label: "CPU bottleneck from too many applications",
          description: "The processor cannot keep up with the number of running applications.",
        },
        {
          id: "pt2-c3",
          label: "Malware consuming system resources",
          description: "Hidden malware processes are using CPU, memory, or disk resources in the background.",
        },
      ],
      correctClassificationId: "pt2-c1",
      remediations: [
        {
          id: "pt2-rem1",
          label: "Upgrade RAM to 16 or 32 GB to reduce paging, and if budget allows, replace the SATA HDD with an SSD to improve page file performance",
          description: "Install additional RAM modules and optionally replace the HDD with an SSD for faster virtual memory access.",
        },
        {
          id: "pt2-rem2",
          label: "Increase the page file size to reduce freezes",
          description: "Manually configure a larger page file in System Properties > Advanced > Performance Settings.",
        },
        {
          id: "pt2-rem3",
          label: "Disable the page file entirely to force Windows to use only RAM",
          description: "Remove the page file from all drives so Windows operates entirely in physical memory.",
        },
      ],
      correctRemediationId: "pt2-rem1",
      rationales: [
        {
          id: "pt2-r1",
          text: "With 8 GB RAM at 95%+ usage, Windows pages heavily to disk. The SATA HDD responds at 180ms average (vs ~0.1ms for an SSD), causing the 30-60 second freezes. 800+ hard faults/sec confirms aggressive paging. More RAM eliminates most paging; an SSD makes remaining paging faster.",
        },
        {
          id: "pt2-r2",
          text: "Upgrading RAM to 16-32 GB directly addresses the root cause by keeping more data in fast RAM instead of paging to the slow HDD. Adding an SSD further mitigates any remaining page file activity. This is a targeted hardware fix based on clear performance data.",
        },
      ],
      correctRationaleId: "pt2-r2",
      feedback: {
        perfect:
          "Correct. The performance data clearly shows a RAM shortage causing heavy paging to a slow HDD. More RAM is the primary fix; an SSD is the secondary improvement.",
        partial:
          "Increasing the page file size does not fix the underlying issue of insufficient RAM. It may slightly reduce page file fragmentation but the HDD speed remains the bottleneck.",
        wrong: "Disabling the page file can cause application crashes and BSODs when physical RAM is exhausted. Never disable it entirely.",
      },
    },
    {
      id: "pt-scenario-3",
      type: "triage-remediate",
      title: "Gradual Performance Degradation Over Months",
      description:
        "A 2-year-old workstation that was fast when new has gradually become slower over the past 6 months. Boot time, application launches, and file operations all take significantly longer than they used to.",
      evidence: [
        { type: "diagnostic", content: "C: drive (256 GB SSD): 241 GB used, only 15 GB free (6% free space)" },
        { type: "diagnostic", content: "Disk Cleanup estimate: 8 GB recoverable (temp files, Windows Update cleanup, thumbnails)" },
        { type: "diagnostic", content: "Installed programs: 147 applications (many unused)" },
        { type: "diagnostic", content: "Browser: Chrome with 47 extensions installed" },
        { type: "diagnostic", content: "Windows Defender scan: No malware detected" },
        { type: "diagnostic", content: "SSD health: CrystalDiskInfo shows 'Good' health, 89% life remaining, TRIM is enabled" },
        { type: "diagnostic", content: "RAM: 16 GB, 62% average usage (not a bottleneck)" },
      ],
      classifications: [
        {
          id: "pt3-c1",
          label: "SSD hardware degradation requiring replacement",
          description: "The SSD has worn out and its performance has degraded due to excessive write cycles.",
        },
        {
          id: "pt3-c2",
          label: "Software bloat and critically low disk space degrading SSD performance and system operation",
          description: "Accumulated unused applications and low free space are reducing SSD efficiency and system responsiveness.",
        },
        {
          id: "pt3-c3",
          label: "Windows corruption requiring a clean reinstall",
          description: "Windows system files have become corrupted over time and require a fresh installation.",
        },
      ],
      correctClassificationId: "pt3-c2",
      remediations: [
        {
          id: "pt3-rem1",
          label: "Run Disk Cleanup, uninstall unused applications, audit and remove unnecessary Chrome extensions, verify 15-20% free space is maintained for SSD performance",
          description: "Use cleanmgr, Programs and Features, and Chrome extension manager to remove bloat and recover free space.",
        },
        {
          id: "pt3-rem2",
          label: "Replace the SSD with a larger one",
          description: "Clone the existing drive to a larger SSD to provide more free space.",
        },
        {
          id: "pt3-rem3",
          label: "Run sfc /scannow and DISM to repair system files",
          description: "Use System File Checker and DISM to scan for and repair corrupted Windows system files.",
        },
      ],
      correctRemediationId: "pt3-rem1",
      rationales: [
        {
          id: "pt3-r1",
          text: "SSDs lose performance as they approach capacity because the controller has fewer empty blocks for wear leveling and garbage collection. At 6% free space, write amplification increases significantly. Additionally, 147 installed programs and 47 Chrome extensions add startup overhead, background services, and context menu bloat.",
        },
        {
          id: "pt3-r2",
          text: "Running Disk Cleanup recovers 8 GB immediately. Uninstalling unused applications (likely 50+ of 147) frees significant space and removes background services. Pruning Chrome extensions reduces browser overhead. Maintaining 15-20% free space keeps the SSD operating efficiently.",
        },
      ],
      correctRationaleId: "pt3-r2",
      feedback: {
        perfect:
          "Correct. The combination of critically low SSD free space and software bloat from 147 programs and 47 extensions explains the gradual degradation. Cleanup and uninstalls address both factors.",
        partial:
          "A larger SSD would help with capacity but does not address the software bloat. Both free space and installed application count contribute to the slowdown.",
        wrong: "The SSD is healthy (89% life). System files are likely fine since Defender found no malware. The issue is capacity and bloat.",
      },
    },
  ],
  hints: [
    "A disk queue length above 2-3 indicates I/O saturation. During startup, 28 programs can easily push this much higher.",
    "High hard fault rates (hundreds per second) indicate the system is actively paging to disk due to insufficient RAM.",
    "SSDs need 15-20% free space for optimal performance. Below that, write amplification degrades speed significantly.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Performance troubleshooting is one of the most valued IT skills because slow computers are the most common complaint from end users. Being able to diagnose the actual bottleneck rather than applying generic optimizations sets professionals apart.",
  toolRelevance: [
    "Task Manager (Startup tab, Performance tab)",
    "Resource Monitor",
    "Performance Monitor (perfmon.msc)",
    "Disk Cleanup (cleanmgr)",
    "CrystalDiskInfo / SSD health tools",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
