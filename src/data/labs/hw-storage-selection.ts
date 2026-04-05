import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "hw-storage-selection",
  version: 1,
  title: "Choose the Right Storage: SSD vs HDD for the Job",
  tier: "beginner",
  track: "hardware",
  difficulty: "easy",
  accessLevel: "free",
  tags: ["SSD", "HDD", "NVMe", "SATA", "M.2", "storage"],
  description:
    "Evaluate user requirements and select the optimal storage device. Compare NVMe SSDs, SATA SSDs, and traditional HDDs for different workloads and budgets.",
  estimatedMinutes: 12,
  learningObjectives: [
    "Compare performance characteristics of NVMe SSD, SATA SSD, and HDD storage",
    "Match storage technology to workload requirements and budget constraints",
    "Identify physical interfaces including M.2, 2.5-inch SATA, and 3.5-inch form factors",
  ],
  sortOrder: 302,
  status: "published",
  prerequisites: [],
  rendererType: "action-rationale",
  scenarios: [
    {
      type: "action-rationale",
      id: "storage-1",
      title: "OS Drive for a Budget Office PC",
      context:
        "A small business needs to speed up 10 aging office desktops. Users complain about slow boot times and sluggish app launches. The PCs have SATA III ports and one empty 2.5-inch drive bay each. Budget is $50 per machine. Current storage is a 500 GB 7200 RPM HDD with 200 GB used.",
      actions: [
        { id: "sata-ssd", label: "Install a 500 GB 2.5-inch SATA SSD", color: "green" },
        { id: "nvme-ssd", label: "Install a 500 GB NVMe M.2 SSD", color: "yellow" },
        { id: "faster-hdd", label: "Upgrade to a 10,000 RPM HDD", color: "orange" },
        { id: "hybrid", label: "Install a 1 TB SSHD (hybrid drive)", color: "blue" },
      ],
      correctActionId: "sata-ssd",
      rationales: [
        {
          id: "rat-sata-ssd",
          text: "A 2.5-inch SATA SSD fits the existing bay, connects to the available SATA III port, fits the budget, and will dramatically improve boot and app launch times compared to the mechanical HDD.",
        },
        {
          id: "rat-nvme",
          text: "NVMe requires an M.2 slot on the motherboard, which aging office desktops may not have. Even if available, the cost premium is not justified for basic office workloads.",
        },
        {
          id: "rat-hdd",
          text: "A 10,000 RPM HDD provides marginal improvement over 7200 RPM and is still dramatically slower than any SSD. The cost-to-performance ratio favors SSDs.",
        },
      ],
      correctRationaleId: "rat-sata-ssd",
      feedback: {
        perfect: "Great choice! A SATA SSD is the most impactful upgrade for aging office PCs - compatible, affordable, and dramatically faster than the old HDD.",
        partial: "That could work in some cases, but consider the existing hardware interfaces and budget constraints for the best practical choice.",
        wrong: "That selection either won't fit this hardware or won't provide meaningful performance improvement. SATA SSDs are the sweet spot for legacy system upgrades.",
      },
    },
    {
      type: "action-rationale",
      id: "storage-2",
      title: "Video Editing Workstation Storage",
      context:
        "A video editor needs storage for a new workstation that will handle 4K video projects. They need fast read/write for editing active projects (about 500 GB at a time) plus bulk storage for archived footage (8 TB). The motherboard has two M.2 NVMe slots and six SATA III ports. Budget allows up to $600 for storage.",
      actions: [
        { id: "nvme-plus-hdd", label: "1 TB NVMe SSD for projects + 8 TB 7200 RPM HDD for archives", color: "green" },
        { id: "all-ssd", label: "Two 4 TB SATA SSDs for everything", color: "yellow" },
        { id: "all-hdd", label: "Two 8 TB 5400 RPM HDDs in mirror", color: "red" },
        { id: "nvme-only", label: "Single 2 TB NVMe SSD for everything", color: "orange" },
      ],
      correctActionId: "nvme-plus-hdd",
      rationales: [
        {
          id: "rat-tiered",
          text: "A tiered storage approach puts active projects on fast NVMe (3500+ MB/s reads) for smooth 4K editing, while archived footage sits on affordable HDD bulk storage. This maximizes both performance and capacity within budget.",
        },
        {
          id: "rat-all-ssd",
          text: "8 TB of SATA SSD storage far exceeds the budget and provides more speed than archived footage requires. SSDs for active work, HDDs for cold storage is the industry standard.",
        },
        {
          id: "rat-all-hdd",
          text: "Editing 4K video directly from a 5400 RPM HDD will cause dropped frames and painful scrubbing performance. Active editing projects need SSD speeds.",
        },
      ],
      correctRationaleId: "rat-tiered",
      feedback: {
        perfect: "Exactly right! Tiered storage is the professional approach: NVMe for active projects that need speed, HDD for archives that need capacity. This is how real video editing studios work.",
        partial: "You have the right idea but the balance isn't optimal. Consider which files need speed vs. which just need space.",
        wrong: "That configuration will either blow the budget or create painful bottlenecks for 4K editing. Tiered storage is the right strategy here.",
      },
    },
    {
      type: "action-rationale",
      id: "storage-3",
      title: "NAS Storage for Home Media Server",
      context:
        "A user is building a 4-bay Synology NAS for a home media server and backup destination. It will store family photos, movies, and Time Machine backups. The NAS runs 24/7. Total storage need is approximately 12 TB. Data loss would be devastating as some photos are irreplaceable.",
      actions: [
        { id: "nas-hdd", label: "Four 4 TB NAS-rated HDDs (e.g., WD Red Plus) in RAID 5", color: "green" },
        { id: "desktop-hdd", label: "Four 4 TB desktop HDDs (e.g., WD Blue) in RAID 5", color: "yellow" },
        { id: "ssd-raid", label: "Four 4 TB SATA SSDs in RAID 5", color: "orange" },
        { id: "single-drive", label: "One 16 TB NAS-rated HDD, no RAID", color: "red" },
      ],
      correctActionId: "nas-hdd",
      rationales: [
        {
          id: "rat-nas",
          text: "NAS-rated drives (like WD Red Plus or Seagate IronWolf) are designed for 24/7 operation, handle vibration from multi-bay enclosures, and have firmware optimized for RAID rebuilds. RAID 5 provides single-disk fault tolerance with 12 TB usable space.",
        },
        {
          id: "rat-desktop",
          text: "Desktop drives are designed for 8-hour workdays and can fail prematurely under 24/7 NAS workloads. Their firmware may also cause RAID rebuild issues due to aggressive error recovery timers.",
        },
        {
          id: "rat-single",
          text: "A single drive with no RAID means one drive failure loses all irreplaceable data. For critical data, redundancy is essential.",
        },
      ],
      correctRationaleId: "rat-nas",
      feedback: {
        perfect: "Perfect! NAS-rated drives in RAID 5 provide the reliability, 24/7 endurance, and fault tolerance needed for irreplaceable data. This is the correct professional recommendation.",
        partial: "The RAID configuration is good but the drive selection matters. Consider the 24/7 duty cycle and vibration characteristics needed for NAS use.",
        wrong: "That configuration puts irreplaceable data at risk. Always use NAS-rated drives for 24/7 operation and RAID for redundancy when data loss is unacceptable.",
      },
    },
  ],
  hints: [
    "Match the storage interface (NVMe, SATA, USB) to what the system physically supports.",
    "Consider the duty cycle: NAS drives are built for 24/7 use, desktop drives are not.",
    "Tiered storage (fast SSD for active work, large HDD for archives) is standard in professional environments.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Storage selection is a daily decision in IT. A+ technicians must understand not just speed vs. capacity tradeoffs but also duty cycles, RAID levels, and interface compatibility to make sound recommendations.",
  toolRelevance: [
    "CrystalDiskInfo for drive health monitoring",
    "CrystalDiskMark for benchmarking",
    "Disk Management (Windows) for partition configuration",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
