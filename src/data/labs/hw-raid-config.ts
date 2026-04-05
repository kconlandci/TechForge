import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "hw-raid-config",
  version: 1,
  title: "Configure RAID for a Small Business Server",
  tier: "intermediate",
  track: "hardware",
  difficulty: "moderate",
  accessLevel: "free",
  tags: ["RAID", "RAID-0", "RAID-1", "RAID-5", "RAID-10", "server", "redundancy"],
  description:
    "Configure RAID arrays for different small business server scenarios. Select the appropriate RAID level based on performance, redundancy, and capacity requirements.",
  estimatedMinutes: 18,
  learningObjectives: [
    "Compare RAID levels 0, 1, 5, and 10 for performance, redundancy, and usable capacity",
    "Match RAID configurations to business requirements and risk tolerance",
    "Calculate usable storage capacity for each RAID level",
  ],
  sortOrder: 312,
  status: "published",
  prerequisites: [],
  rendererType: "toggle-config",
  scenarios: [
    {
      type: "toggle-config",
      id: "raid-1",
      title: "File Server for Accounting Department",
      description:
        "An accounting department needs a file server to store financial records. Data integrity and fault tolerance are top priorities. The server has four 2 TB SATA drives. Downtime must be minimized if a single drive fails.",
      targetSystem: "Dell PowerEdge T350 RAID Controller",
      items: [
        {
          id: "raid-level",
          label: "RAID Level",
          detail: "Select the RAID level that balances fault tolerance and usable capacity for financial data",
          currentState: "RAID 0 (Striping)",
          correctState: "RAID 5 (Striping with Parity)",
          states: ["RAID 0 (Striping)", "RAID 1 (Mirroring)", "RAID 5 (Striping with Parity)", "RAID 10 (Mirror + Stripe)"],
          rationaleId: "rat-raid5",
        },
        {
          id: "hot-spare",
          label: "Hot Spare Configuration",
          detail: "Whether to designate a drive as an automatic replacement if an array drive fails",
          currentState: "No Hot Spare",
          correctState: "No Hot Spare",
          states: ["No Hot Spare", "One Global Hot Spare"],
          rationaleId: "rat-spare",
        },
        {
          id: "cache-policy",
          label: "Write Cache Policy",
          detail: "Controls whether write data is cached in RAM before being written to disk",
          currentState: "Write-Through",
          correctState: "Write-Back with BBU",
          states: ["Write-Through", "Write-Back with BBU", "Write-Back without BBU"],
          rationaleId: "rat-cache",
        },
      ],
      rationales: [
        {
          id: "rat-raid5",
          text: "RAID 5 provides single-drive fault tolerance with parity distributed across all drives. With four 2 TB drives, RAID 5 yields 6 TB usable space (n-1 drives). RAID 1 would only use 2 drives effectively, and RAID 10 would yield only 4 TB. RAID 5 balances capacity, performance, and redundancy for a file server.",
        },
        {
          id: "rat-spare",
          text: "With only four drives and a RAID 5 array using all four, there is no drive available to serve as a hot spare. A hot spare requires an additional physical drive beyond what the array uses.",
        },
        {
          id: "rat-cache",
          text: "Write-Back caching with a Battery Backup Unit (BBU) improves write performance by caching data in RAID controller RAM while the BBU protects against data loss during power failures. Write-Back without BBU risks data loss if power is lost before cached data is written to disk.",
        },
      ],
      feedback: {
        perfect: "Excellent! RAID 5 with Write-Back BBU caching is the textbook configuration for a file server prioritizing data integrity with good capacity utilization.",
        partial: "Some choices are correct. Review the tradeoffs: RAID level affects capacity and redundancy, hot spare requires an extra drive, and cache policy affects both performance and data safety.",
        wrong: "This configuration doesn't meet the requirements. For financial data, redundancy is mandatory (no RAID 0) and data safety should never be compromised.",
      },
    },
    {
      type: "toggle-config",
      id: "raid-2",
      title: "Database Server for E-Commerce",
      description:
        "An e-commerce company needs a high-performance database server. The database handles thousands of concurrent transactions per second. Both read and write performance are critical. Data loss is unacceptable. The server has six 1.2 TB 10K RPM SAS drives.",
      targetSystem: "HPE ProLiant DL380 Gen10 Smart Array",
      items: [
        {
          id: "raid-level",
          label: "RAID Level",
          detail: "Select the RAID level optimized for high-performance transactional database workloads",
          currentState: "RAID 5 (Striping with Parity)",
          correctState: "RAID 10 (Mirror + Stripe)",
          states: ["RAID 0 (Striping)", "RAID 1 (Mirroring)", "RAID 5 (Striping with Parity)", "RAID 10 (Mirror + Stripe)"],
          rationaleId: "rat-raid10",
        },
        {
          id: "stripe-size",
          label: "Stripe Size",
          detail: "The size of data blocks distributed across drives. Affects sequential vs random I/O performance.",
          currentState: "256 KB",
          correctState: "64 KB",
          states: ["16 KB", "64 KB", "256 KB", "1 MB"],
          rationaleId: "rat-stripe",
        },
        {
          id: "read-policy",
          label: "Read Cache Policy",
          detail: "Controls read-ahead caching behavior for sequential data access optimization",
          currentState: "No Read Ahead",
          correctState: "Adaptive Read Ahead",
          states: ["No Read Ahead", "Always Read Ahead", "Adaptive Read Ahead"],
          rationaleId: "rat-read",
        },
      ],
      rationales: [
        {
          id: "rat-raid10",
          text: "RAID 10 combines mirroring and striping for the best write performance with redundancy. Database transaction logs require fast random writes, and RAID 10 does not incur the write penalty of RAID 5 (which must calculate and write parity). RAID 10 with six drives gives 3.6 TB usable and can tolerate one drive failure per mirror pair.",
        },
        {
          id: "rat-stripe",
          text: "A 64 KB stripe size aligns well with typical database page sizes (8-16 KB for SQL Server, 16 KB for MySQL InnoDB). Smaller stripes distribute random I/O across more drives, improving transaction throughput.",
        },
        {
          id: "rat-read",
          text: "Adaptive Read Ahead automatically detects sequential access patterns and pre-fetches data, while leaving random access unaffected. This benefits database sequential scans without hurting random transaction performance.",
        },
      ],
      feedback: {
        perfect: "Perfect! RAID 10 is the gold standard for database servers due to superior write performance. The stripe size and read policy choices further optimize for transactional workloads.",
        partial: "The RAID level matters most for database performance. RAID 5's write penalty (read-modify-write for parity) makes it suboptimal for write-heavy transactional databases.",
        wrong: "Database servers have specific I/O patterns that some RAID levels handle poorly. Review the write penalty characteristics of each RAID level.",
      },
    },
    {
      type: "toggle-config",
      id: "raid-3",
      title: "Video Surveillance Storage",
      description:
        "A warehouse needs a network video recorder (NVR) that stores security camera footage from 16 cameras recording 24/7. Write performance is critical (constant ingestion from cameras). The system has eight 4 TB SATA drives. The footage retention period must maximize available storage.",
      targetSystem: "Synology RackStation RS1221+ NVR",
      items: [
        {
          id: "raid-level",
          label: "RAID Level",
          detail: "Select the RAID level that maximizes storage capacity while maintaining fault tolerance for 24/7 recording",
          currentState: "RAID 10 (Mirror + Stripe)",
          correctState: "RAID 5 (Striping with Parity)",
          states: ["RAID 0 (Striping)", "RAID 1 (Mirroring)", "RAID 5 (Striping with Parity)", "RAID 10 (Mirror + Stripe)"],
          rationaleId: "rat-raid5-nvr",
        },
        {
          id: "filesystem",
          label: "File System",
          detail: "Select the appropriate file system for the NAS volume",
          currentState: "ext4",
          correctState: "Btrfs",
          states: ["ext4", "Btrfs"],
          rationaleId: "rat-btrfs",
        },
      ],
      rationales: [
        {
          id: "rat-raid5-nvr",
          text: "RAID 5 across eight 4 TB drives provides 28 TB usable capacity (7 x 4 TB) with single-drive fault tolerance. RAID 10 would only yield 16 TB. For surveillance, maximizing retention time is critical, and the sequential write pattern of video streams does not suffer from RAID 5's random write penalty as badly as database workloads do.",
        },
        {
          id: "rat-btrfs",
          text: "Btrfs provides data checksumming and self-healing capabilities that protect video file integrity. For 24/7 surveillance storage, detecting and repairing silent data corruption (bit rot) over long retention periods is valuable.",
        },
      ],
      feedback: {
        perfect: "Correct! RAID 5 maximizes retention capacity for surveillance, and Btrfs protects data integrity. Sequential video writes do not suffer RAID 5's random write penalty.",
        partial: "Consider the specific I/O pattern of video surveillance (sequential writes) and the goal of maximizing retention time.",
        wrong: "The RAID level chosen either wastes capacity or provides no redundancy. Surveillance storage needs both maximum retention and drive fault tolerance.",
      },
    },
  ],
  hints: [
    "RAID 5 has a write penalty for random I/O (each write requires read-modify-write of parity), but sequential writes are handled efficiently.",
    "RAID 10 offers the best write performance with redundancy but uses 50% of total capacity for mirroring.",
    "RAID 0 has zero redundancy - a single drive failure loses ALL data. Never use RAID 0 for data that matters.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "RAID configuration is a fundamental server administration skill. Understanding which RAID level fits which workload prevents costly mistakes in storage planning.",
  toolRelevance: [
    "RAID controller BIOS/management utility",
    "Disk Management or Storage Spaces (Windows)",
    "mdadm (Linux software RAID)",
    "RAID calculator tools",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
