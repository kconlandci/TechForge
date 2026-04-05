import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "mobile-slow-performance",
  version: 1,
  title: "Diagnose and Fix an Extremely Slow Tablet",
  tier: "intermediate",
  track: "mobile-devices",
  difficulty: "moderate",
  accessLevel: "free",
  tags: ["performance", "tablet", "slow", "optimization", "troubleshooting"],
  description:
    "A tablet is running extremely slow with UI lag, app switching delays, and frequent freezes. Triage the symptoms, classify the root cause, and apply the appropriate remediation.",
  estimatedMinutes: 18,
  learningObjectives: [
    "Analyze system resource metrics to identify performance bottlenecks",
    "Classify slow performance causes: thermal throttling, memory pressure, storage I/O, or malware",
    "Apply targeted performance remediation without data loss",
    "Recognize when hardware limitations require managed expectations versus software fixes",
  ],
  sortOrder: 107,
  status: "published",
  prerequisites: [],
  rendererType: "triage-remediate",
  scenarios: [
    {
      id: "sp-scenario-1",
      type: "triage-remediate",
      title: "Thermal Throttling During Use",
      description:
        "An iPad Pro 11-inch (2021) becomes extremely sluggish after about 20 minutes of use. The user reports that animations stutter, apps take 5-10 seconds to switch, and the screen brightness dims automatically. The tablet is used in a car mount on the dashboard during summer for GPS navigation.",
      evidence: [
        {
          type: "diagnostic",
          content:
            "CPU usage: 23% (low). RAM: 2.1 GB free of 8 GB (healthy). Storage: 52% used. Battery health: 94%. Device temperature: 41 C (normal max is 35 C). A temperature warning appeared briefly 10 minutes ago. The car dashboard reaches direct sunlight exposure for several hours.",
        },
        {
          type: "observation",
          content:
            "The back of the iPad is noticeably hot. The case is a thick leather folio case. When the user brings the tablet inside to an air-conditioned room, performance returns to normal after about 10 minutes.",
        },
      ],
      classifications: [
        {
          id: "sp1-class-thermal",
          label: "Thermal throttling from environmental heat and poor heat dissipation",
          description:
            "The device is overheating due to direct sunlight on the car dashboard combined with a thermally insulating case. The CPU is being throttled to reduce heat generation.",
        },
        {
          id: "sp1-class-battery",
          label: "Battery degradation causing power delivery issues",
          description:
            "The battery may not be delivering sufficient power under load.",
        },
        {
          id: "sp1-class-software",
          label: "iOS performance bug after recent update",
          description:
            "A software bug may be causing the performance issues.",
        },
      ],
      correctClassificationId: "sp1-class-thermal",
      remediations: [
        {
          id: "sp1-rem-ventilation",
          label: "Remove the thick case, reposition the mount away from direct sunlight, and recommend a ventilated car mount designed for tablets",
          description: "Addressing the environmental heat sources and improving airflow eliminates the root cause of thermal throttling, restoring full CPU performance.",
        },
        {
          id: "sp1-rem-low-power",
          label: "Enable Low Power Mode to reduce CPU usage",
          description: "Low Power Mode further restricts an already-throttled CPU, making the device even slower rather than addressing the underlying heat problem.",
        },
        {
          id: "sp1-rem-factory-reset",
          label: "Factory reset the iPad to improve performance",
          description: "A factory reset erases all user data but cannot reduce the physical temperature of the device, leaving the thermal throttling unchanged.",
        },
      ],
      correctRemediationId: "sp1-rem-ventilation",
      rationales: [
        {
          id: "sp1-r1",
          text: "The device temperature at 41 C exceeds the normal operating maximum. Direct sunlight plus a thermally insulating leather case prevents heat dissipation. Removing the case and repositioning away from direct sun addresses the root environmental cause. A ventilated mount provides ongoing airflow.",
        },
        {
          id: "sp1-r2",
          text: "Low Power Mode reduces performance further rather than solving the thermal issue. The CPU is already throttled; reducing it more makes the device even slower.",
        },
        {
          id: "sp1-r3",
          text: "A factory reset would not reduce device temperature. The issue is physical heat, not software.",
        },
      ],
      correctRationaleId: "sp1-r1",
      feedback: {
        perfect:
          "Correct. The 41 C temperature, dashboard sun exposure, and insulating case create a thermal throttling scenario. Addressing the environment and case resolves the performance issue entirely.",
        partial:
          "Low Power Mode would reduce heat generation but also makes the device slower. The environmental fix is the correct approach.",
        wrong: "The evidence clearly points to thermal throttling. Software changes cannot fix a heat dissipation problem.",
      },
    },
    {
      id: "sp-scenario-2",
      type: "triage-remediate",
      title: "Background Process Overload",
      description:
        "A Samsung Galaxy Tab S8 is running extremely slow at all times, even after a recent reboot. Opening the Settings app takes 8 seconds. The user installed several apps from various sources over the past month to 'optimize' their tablet.",
      evidence: [
        {
          type: "diagnostic",
          content:
            "RAM usage: 7.2 GB of 8 GB used at idle. Top processes: 'Speed Booster Pro' (380 MB, constant background), 'Battery Doctor Ultimate' (290 MB, persistent notification), 'RAM Cleaner 360' (245 MB), 'Virus Shield Total' (310 MB, real-time scanning), Samsung system processes (1.8 GB). These four 'optimizer' apps collectively use 1.2 GB RAM and generate continuous CPU load from their monitoring services.",
        },
        {
          type: "log",
          content:
            "System logs show the four optimizer apps are fighting each other: RAM Cleaner kills Speed Booster's service, Speed Booster restarts and kills RAM Cleaner's service, creating a continuous kill-restart loop consuming CPU cycles. Each app also displays persistent notifications and overlay ads.",
        },
      ],
      classifications: [
        {
          id: "sp2-class-bloatware",
          label: "Parasitic 'optimizer' apps consuming resources and fighting each other",
          description:
            "The four third-party optimizer apps are collectively consuming 1.2 GB RAM and creating a continuous process kill-restart loop, which is the primary cause of the slowdown.",
        },
        {
          id: "sp2-class-malware",
          label: "The device is infected with malware",
          description:
            "One or more of the installed apps may be actual malware.",
        },
        {
          id: "sp2-class-hardware",
          label: "The tablet hardware is failing",
          description:
            "The Tab S8 may have a hardware defect causing the slowdown.",
        },
      ],
      correctClassificationId: "sp2-class-bloatware",
      remediations: [
        {
          id: "sp2-rem-uninstall-optimizers",
          label: "Uninstall all four 'optimizer' apps, reboot the device, and educate the user that these apps cause more harm than good on modern Android",
          description: "Removing the parasitic apps frees 1.2 GB of RAM and stops the CPU-consuming restart loop, while user education prevents reinstallation of similar apps.",
        },
        {
          id: "sp2-rem-factory-reset",
          label: "Factory reset and start fresh since the system may be compromised",
          description: "A factory reset destroys all user data unnecessarily when the specific problem apps have been clearly identified and can be individually removed.",
        },
        {
          id: "sp2-rem-add-ram",
          label: "Enable Samsung's RAM Plus virtual memory feature to add more RAM",
          description: "Adding virtual memory does not stop the optimizer apps from wasting resources; the existing 8 GB RAM is more than sufficient once the parasitic software is removed.",
        },
      ],
      correctRemediationId: "sp2-rem-uninstall-optimizers",
      rationales: [
        {
          id: "sp2-r1",
          text: "The optimizer apps are the direct cause: 1.2 GB RAM at idle plus a CPU-consuming restart loop. Android's built-in memory management is superior to these third-party tools. Removing them frees resources and eliminates the process fighting. User education prevents reinstallation.",
        },
        {
          id: "sp2-r2",
          text: "A factory reset is unnecessary when the problem apps are clearly identified. Uninstalling them achieves the same result without data loss.",
        },
        {
          id: "sp2-r3",
          text: "Adding virtual memory does not address the 1.2 GB of RAM and CPU cycles being wasted by the optimizer apps. The existing 8 GB is more than sufficient once the parasitic apps are removed.",
        },
      ],
      correctRationaleId: "sp2-r1",
      feedback: {
        perfect:
          "Correct. The optimizer apps are parasitic software consuming massive resources. Removing them and educating the user is the complete fix. Modern Android does not need third-party RAM or battery optimizers.",
        partial:
          "A factory reset works but is overkill when the specific problem apps are identified. Always prefer targeted removal.",
        wrong: "The Tab S8 has plenty of hardware capability. The issue is entirely caused by the installed software.",
      },
    },
    {
      id: "sp-scenario-3",
      type: "triage-remediate",
      title: "Storage I/O Bottleneck",
      description:
        "A budget Android tablet (Lenovo Tab M10) with 32 GB storage is painfully slow. Every action has a multi-second delay. The user uses it primarily for web browsing and streaming but also has several games installed. The device was fine when purchased 6 months ago.",
      evidence: [
        {
          type: "diagnostic",
          content:
            "Storage: 30.8 GB used of 32 GB (96.3% full). RAM: 2.5 GB used of 3 GB. The largest storage consumers: Games (12 GB across 8 games), Apps (6 GB), System (5 GB), Cached data (4.2 GB), Photos/Downloads (3.6 GB). I/O wait times in developer options show 340ms average (healthy is under 50ms).",
        },
        {
          type: "observation",
          content:
            "The eMMC storage indicator in developer options shows 94% of write cycles have been consumed in the heavily-used blocks. App installation takes 5+ minutes for small apps. The device gets noticeably slower during and after app updates.",
        },
      ],
      classifications: [
        {
          id: "sp3-class-storage-io",
          label: "Storage I/O bottleneck from nearly full eMMC storage",
          description:
            "At 96% capacity, the eMMC flash storage has minimal free blocks for wear leveling and write operations, causing extreme I/O latency. The 340ms I/O wait confirms the storage subsystem is the bottleneck.",
        },
        {
          id: "sp3-class-ram",
          label: "Insufficient RAM for the installed applications",
          description:
            "The 3 GB RAM may not be enough for the user's workload.",
        },
        {
          id: "sp3-class-cpu",
          label: "The budget processor cannot handle modern apps",
          description:
            "The tablet's CPU may be underpowered.",
        },
      ],
      correctClassificationId: "sp3-class-storage-io",
      remediations: [
        {
          id: "sp3-rem-free-space",
          label: "Uninstall unused games to free 8-10 GB, clear cached data, move photos to cloud storage, and add a microSD card for media storage",
          description: "Freeing storage space restores the eMMC controller's ability to perform wear leveling and garbage collection, dramatically reducing I/O wait times.",
        },
        {
          id: "sp3-rem-buy-new",
          label: "Recommend purchasing a new tablet with more storage",
          description: "Replacing the device is an expensive and unnecessary recommendation when storage management can restore the performance the tablet had six months ago.",
        },
        {
          id: "sp3-rem-disable-animations",
          label: "Disable system animations in developer options to mask the lag",
          description: "Turning off animations is a cosmetic change that hides visual stuttering but does nothing to resolve the 340ms I/O wait causing all operations to be slow.",
        },
      ],
      correctRemediationId: "sp3-rem-free-space",
      rationales: [
        {
          id: "sp3-r1",
          text: "Freeing 8-10 GB by removing unused games gives the eMMC controller room for wear leveling and garbage collection, dramatically reducing I/O wait times. Clearing the 4.2 GB cache provides additional immediate relief. A microSD card offloads media storage, preventing future capacity issues. This comprehensive approach addresses both the immediate bottleneck and long-term storage management.",
        },
        {
          id: "sp3-r2",
          text: "A new tablet is expensive and unnecessary when the current device performed well 6 months ago. Storage management can restore acceptable performance.",
        },
        {
          id: "sp3-r3",
          text: "Disabling animations hides visual lag but does not address the 340ms I/O wait that causes all operations to be slow.",
        },
      ],
      correctRationaleId: "sp3-r1",
      feedback: {
        perfect:
          "Excellent. The 96% full eMMC storage is causing severe I/O latency. Freeing space restores wear leveling efficiency, clearing cache provides immediate relief, and a microSD card prevents recurrence.",
        partial:
          "Disabling animations is cosmetic. The I/O bottleneck from full storage is the actual cause of the slowdown.",
        wrong: "The device worked fine 6 months ago. The performance degradation correlates with storage filling up, not hardware age.",
      },
    },
  ],
  hints: [
    "Check the device temperature first. Thermal throttling causes dramatic performance drops with no other obvious symptoms.",
    "Third-party optimizer apps on Android often consume more resources than they save. Check for parasitic background processes.",
    "When storage exceeds 90% capacity, flash storage I/O performance degrades significantly due to reduced wear leveling space.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Slow device complaints are the most common mobile support ticket. Being able to quickly classify the cause as thermal, memory, storage, or software saves significant troubleshooting time and impresses both users and managers.",
  toolRelevance: [
    "Device Temperature Monitor",
    "Storage Usage Analysis",
    "Running Processes / RAM Monitor",
    "Developer Options (I/O stats)",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
