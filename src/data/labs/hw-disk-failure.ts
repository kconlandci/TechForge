import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "hw-disk-failure",
  version: 1,
  title: "Diagnose a Failing Hard Drive",
  tier: "intermediate",
  track: "hardware",
  difficulty: "moderate",
  accessLevel: "free",
  tags: ["HDD", "SSD", "SMART", "disk-failure", "data-recovery", "CrystalDiskInfo"],
  description:
    "A workstation shows signs of storage failure. Investigate SMART data, error logs, and symptoms to determine if the drive is failing and what action to take before data loss occurs.",
  estimatedMinutes: 18,
  learningObjectives: [
    "Interpret SMART (Self-Monitoring, Analysis, and Reporting Technology) attributes for drive health",
    "Distinguish between imminent drive failure and recoverable errors",
    "Recommend appropriate data backup and drive replacement procedures",
  ],
  sortOrder: 309,
  status: "published",
  prerequisites: [],
  rendererType: "investigate-decide",
  scenarios: [
    {
      type: "investigate-decide",
      id: "disk-1",
      title: "Clicking HDD with Increasing Bad Sectors",
      objective:
        "A user reports their desktop has become very slow and they hear occasional clicking sounds from inside the case. Files are taking longer to open and some have become corrupted. Investigate the drive health data.",
      investigationData: [
        {
          id: "smart-data",
          label: "CrystalDiskInfo SMART Report",
          content:
            "Health Status: CAUTION. Reallocated Sectors Count: 847 (threshold: 36). Current Pending Sector Count: 124. Reported Uncorrectable Errors: 43. Power-On Hours: 31,204. The drive is a 2 TB Seagate Barracuda (ST2000DM008).",
          isCritical: true,
        },
        {
          id: "event-log",
          label: "Windows Event Viewer",
          content:
            "Multiple 'Disk' warnings: 'The driver detected a controller error on \\Device\\Harddisk0\\DR0.' Also found: 'The file system structure on the disk is corrupt and unusable. Please run the chkdsk utility on the volume C:.'",
        },
        {
          id: "symptoms",
          label: "User-Reported Symptoms",
          content:
            "Clicking/ticking sounds from the PC during file access. Several Excel files opened with corrupted data. System boot time has increased from 45 seconds to 4+ minutes over the past two weeks.",
        },
      ],
      actions: [
        { id: "backup-replace", label: "Immediately back up data to external drive and replace the HDD", color: "green" },
        { id: "run-chkdsk", label: "Run chkdsk /r to repair the drive", color: "yellow" },
        { id: "defrag", label: "Defragment the drive to improve performance", color: "red" },
        { id: "ignore", label: "Monitor for another week to see if it worsens", color: "red" },
      ],
      correctActionId: "backup-replace",
      rationales: [
        {
          id: "rat-backup",
          text: "847 reallocated sectors far exceeds the threshold, 124 pending sectors indicate ongoing failure, and clicking sounds are a mechanical warning sign. This drive is in active failure. Priority one is backing up surviving data immediately before total failure occurs, then replacing the drive.",
        },
        {
          id: "rat-chkdsk",
          text: "Running chkdsk on a mechanically failing drive risks accelerating the failure. The drive is not experiencing logical errors - it has physical sector damage. Chkdsk cannot fix physical media degradation.",
        },
        {
          id: "rat-defrag",
          text: "Defragmenting a failing drive dramatically increases read/write operations on damaged sectors, likely causing further data loss or complete drive failure.",
        },
      ],
      correctRationaleId: "rat-backup",
      feedback: {
        perfect: "Correct! With SMART data this bad and mechanical clicking, the drive could fail completely at any moment. Immediate backup and replacement is the only responsible action.",
        partial: "Your instinct is right that something needs to be done, but the severity demands immediate action. This drive is in active failure.",
        wrong: "That action could cause complete data loss. With 847 reallocated sectors and clicking sounds, this drive needs immediate backup and replacement, not further use.",
      },
    },
    {
      type: "investigate-decide",
      id: "disk-2",
      title: "SSD with Endurance Warning",
      objective:
        "A database server's SMART monitoring tool triggers a warning on the boot SSD. The server is still performing normally. Investigate whether this requires immediate action.",
      investigationData: [
        {
          id: "smart-data",
          label: "SMART Data (Samsung 870 EVO 500 GB)",
          content:
            "Health Status: GOOD. Wear Leveling Count: 92% remaining. Total Host Writes: 156 TB (rated endurance: 300 TBW). Power-On Hours: 18,720. Temperature: 38C. Reallocated NAND Block Count: 0. No errors reported.",
          isCritical: true,
        },
        {
          id: "monitoring",
          label: "Monitoring Alert Details",
          content:
            "Alert triggered because Wear Leveling Count dropped below the 95% warning threshold set by the admin. The drive has used 52% of its rated write endurance (156 TB of 300 TBW).",
        },
        {
          id: "workload",
          label: "Server Workload Analysis",
          content:
            "The server writes approximately 20 TB per year. At current rate, the drive will reach its 300 TBW endurance rating in about 7 more years. The SSD is 2.5 years old.",
        },
      ],
      actions: [
        { id: "plan-replace", label: "Schedule proactive replacement within 6-12 months and ensure backups are current", color: "green" },
        { id: "immediate-replace", label: "Replace the SSD immediately - it is failing", color: "yellow" },
        { id: "ignore", label: "Dismiss the alert - the drive is fine and no action needed", color: "orange" },
        { id: "reduce-writes", label: "Reduce database write operations to extend SSD life", color: "blue" },
      ],
      correctActionId: "plan-replace",
      rationales: [
        {
          id: "rat-plan",
          text: "The SSD is healthy with 92% wear remaining and zero errors, but proactive replacement planning is best practice for production servers. Scheduling a replacement within 6-12 months provides a safety margin while ensuring backup procedures are verified. The drive is not in danger of imminent failure.",
        },
        {
          id: "rat-immediate",
          text: "Immediate replacement is unnecessary. The drive has 92% wear remaining and no errors. Premature replacement wastes a drive with years of useful life remaining.",
        },
        {
          id: "rat-ignore",
          text: "Completely ignoring wear data on a production server SSD is poor practice. While the drive is healthy now, proactive lifecycle management prevents unplanned downtime.",
        },
      ],
      correctRationaleId: "rat-plan",
      feedback: {
        perfect: "Excellent judgment! The SSD is healthy but proactive lifecycle management on production servers means planning replacements before end-of-life. Verify backups and schedule replacement at a convenient maintenance window.",
        partial: "You're either being too aggressive or too passive. The drive is healthy but deserves a plan. Production server storage needs lifecycle management.",
        wrong: "Review the SMART data more carefully. The drive is not failing, but production servers require proactive maintenance planning.",
      },
    },
    {
      type: "investigate-decide",
      id: "disk-3",
      title: "NVMe SSD Not Detected After Power Outage",
      objective:
        "After a building-wide power outage, a workstation no longer detects its NVMe boot drive in BIOS. The system boots to 'No Boot Device Found.' Investigate and determine the cause.",
      investigationData: [
        {
          id: "bios-check",
          label: "BIOS Storage Detection",
          content:
            "The BIOS NVMe device list shows no drives detected. The M.2 slot previously contained a Western Digital WD_BLACK SN770 1 TB NVMe SSD. SATA ports show the secondary HDD is detected normally.",
          isCritical: true,
        },
        {
          id: "physical",
          label: "Physical Inspection",
          content:
            "The NVMe SSD is seated in the M.2 slot and secured with its screw. No visible burn marks or damage. The M.2 slot's mounting screw is tight. The system was not on a UPS and lost power abruptly.",
        },
        {
          id: "test",
          label: "Diagnostic Steps Taken",
          content:
            "Reseating the NVMe drive in the same slot: not detected. Testing the NVMe drive in a USB-to-NVMe enclosure on another PC: also not detected. Testing a different known-good NVMe drive in the original M.2 slot: detected successfully.",
        },
      ],
      actions: [
        { id: "replace-nvme", label: "Replace the NVMe SSD - it failed due to the power outage", color: "green" },
        { id: "replace-mobo", label: "Replace the motherboard - the M.2 slot is damaged", color: "red" },
        { id: "flash-bios", label: "Flash the BIOS - a corruption is hiding the drive", color: "orange" },
        { id: "cmos-reset", label: "Clear CMOS to reset BIOS detection", color: "yellow" },
      ],
      correctActionId: "replace-nvme",
      rationales: [
        {
          id: "rat-nvme-dead",
          text: "The diagnostic steps confirm the NVMe drive is dead: it is not detected in the original slot, not detected in an external enclosure on another PC, but a different NVMe works fine in the original slot. Power surges from outages can damage NVMe controller chips. The drive needs replacement.",
        },
        {
          id: "rat-mobo",
          text: "The M.2 slot is confirmed working since a different NVMe drive was detected successfully. The motherboard is not the problem.",
        },
        {
          id: "rat-bios",
          text: "A BIOS corruption would affect detection of all NVMe drives, but a known-good drive was detected in the same slot. The BIOS is functioning correctly.",
        },
      ],
      correctRationaleId: "rat-nvme-dead",
      feedback: {
        perfect: "Correct! The isolation test (different drive works in same slot, bad drive fails everywhere) conclusively proves the NVMe SSD failed. Power outages can kill SSD controllers. This is why UPS protection matters.",
        partial: "Your logic is close but review the diagnostic steps. The isolation testing tells you exactly which component failed.",
        wrong: "The diagnostic evidence eliminates that possibility. When a drive fails everywhere but the slot works with a different drive, the conclusion is clear.",
      },
    },
  ],
  hints: [
    "SMART attributes like Reallocated Sectors, Pending Sectors, and Uncorrectable Errors are the key indicators of drive health.",
    "Clicking sounds from an HDD are a mechanical warning - back up data immediately before attempting any repairs.",
    "Isolation testing (swapping the drive to another system, trying a different drive in the same slot) identifies whether the drive or the slot has failed.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Drive failures cause real data loss. Technicians who can read SMART data, recognize warning signs, and act quickly save companies from catastrophic data loss. This skill is tested on the A+ exam and used daily in the field.",
  toolRelevance: [
    "CrystalDiskInfo for SMART monitoring",
    "Windows Event Viewer for disk error logs",
    "chkdsk for file system integrity",
    "USB-to-NVMe/SATA enclosures for isolation testing",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
