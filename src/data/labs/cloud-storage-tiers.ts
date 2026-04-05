import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "cloud-storage-tiers",
  version: 1,
  title: "Choose the Right Cloud Storage Tier",
  tier: "intermediate",
  track: "virtualization-cloud",
  difficulty: "moderate",
  accessLevel: "free",
  tags: ["cloud", "storage", "s3", "blob", "tiering", "cost-optimization", "CompTIA-A+"],
  description:
    "Analyze workload access patterns and data lifecycle requirements to select the optimal cloud storage tier, balancing performance, availability, and cost.",
  estimatedMinutes: 15,
  learningObjectives: [
    "Compare hot, cool, cold, and archive storage tiers across cloud providers",
    "Match data access patterns to the appropriate storage class",
    "Calculate cost implications of storage tier selection for different data volumes",
    "Design lifecycle policies to automatically transition data between tiers",
  ],
  sortOrder: 406,
  status: "published",
  prerequisites: [],
  rendererType: "action-rationale",
  scenarios: [
    {
      id: "st-scenario-1",
      type: "action-rationale",
      title: "Storing Application Log Files",
      context:
        "A SaaS application generates 50 GB of log files daily. Developers actively search logs from the last 7 days for debugging. Logs older than 7 days are accessed maybe once a month during incident investigations. Compliance requires retaining all logs for 1 year. After 1 year, logs can be deleted. Current monthly log storage cost on S3 Standard is $4,500 and growing.",
      actions: [
        {
          id: "st1-all-standard",
          label: "Keep all logs on S3 Standard for fastest access",
          color: "red",
        },
        {
          id: "st1-lifecycle",
          label: "S3 Standard for 7 days, then S3 Glacier Instant Retrieval for up to 1 year, then auto-delete",
          color: "green",
        },
        {
          id: "st1-all-glacier",
          label: "Store all logs directly in Glacier Deep Archive",
          color: "orange",
        },
        {
          id: "st1-delete-old",
          label: "Delete logs older than 7 days to reduce costs",
          color: "red",
        },
      ],
      correctActionId: "st1-lifecycle",
      rationales: [
        {
          id: "st1-r1",
          text: "Keeping 18 TB of accumulated logs on S3 Standard when most are rarely accessed wastes thousands of dollars monthly on premium storage for data that needs infrequent access at most.",
        },
        {
          id: "st1-r2",
          text: "A tiered lifecycle policy keeps recent logs on fast storage for active debugging, moves older logs to cheaper storage with millisecond retrieval for monthly incident reviews, and automatically deletes at the 1-year compliance boundary.",
        },
        {
          id: "st1-r3",
          text: "Glacier Deep Archive has 12-48 hour retrieval times. Developers cannot wait 12 hours to pull logs during an active incident investigation within the first month.",
        },
        {
          id: "st1-r4",
          text: "Deleting logs older than 7 days violates the 1-year compliance retention requirement and could result in regulatory penalties.",
        },
      ],
      correctRationaleId: "st1-r2",
      feedback: {
        perfect:
          "Correct. Lifecycle policies automate the transition between storage tiers based on access patterns, optimizing cost while meeting both operational and compliance needs.",
        partial:
          "That approach reduces cost or maintains compliance but does not optimally balance both requirements with appropriate access times.",
        wrong: "That option either violates compliance requirements or maintains the current excessive cost structure.",
      },
    },
    {
      id: "st-scenario-2",
      type: "action-rationale",
      title: "Media Company Video Asset Storage",
      context:
        "A media production company stores 200 TB of video assets. New videos (last 30 days) are edited and accessed multiple times daily. Videos from the past year are used occasionally for social media clips and compilations. Videos older than 1 year are accessed extremely rarely but must be preserved indefinitely for potential licensing deals. The company spends $12,000/month with all assets on Azure Blob Hot tier.",
      actions: [
        {
          id: "st2-all-cool",
          label: "Move everything to Azure Blob Cool tier to save money",
          color: "orange",
        },
        {
          id: "st2-tiered",
          label: "Hot tier for 30 days, Cool tier for 1 year, Archive tier for indefinite retention",
          color: "green",
        },
        {
          id: "st2-compress",
          label: "Compress all videos with maximum compression and keep on Hot tier",
          color: "blue",
        },
        {
          id: "st2-delete-old",
          label: "Delete videos older than 2 years to reduce storage volume",
          color: "red",
        },
      ],
      correctActionId: "st2-tiered",
      rationales: [
        {
          id: "st2-r1",
          text: "Moving actively edited recent videos to Cool tier incurs early deletion fees and higher per-access charges that offset storage savings for frequently accessed content.",
        },
        {
          id: "st2-r2",
          text: "A three-tier lifecycle matches the natural access pattern: daily editing on Hot, occasional reuse from Cool with acceptable retrieval time, and Archive for the vast majority of dormant assets that rarely generate licensing revenue.",
        },
        {
          id: "st2-r3",
          text: "Maximum compression degrades video quality, which is unacceptable for a media production company. The storage savings from compression are minimal compared to proper tier management.",
        },
        {
          id: "st2-r4",
          text: "Deleting old videos destroys potential licensing revenue. A single viral clip from the archive could generate more revenue than years of storage costs.",
        },
      ],
      correctRationaleId: "st2-r2",
      feedback: {
        perfect:
          "Excellent. A three-tier strategy matches the declining access frequency while preserving all assets for potential future monetization.",
        partial:
          "That reduces cost in one area but creates problems for active workflows or destroys valuable long-term assets.",
        wrong: "That option either degrades production quality, destroys revenue-generating assets, or does not meaningfully reduce costs.",
      },
    },
    {
      id: "st-scenario-3",
      type: "action-rationale",
      title: "Healthcare Imaging Data Storage",
      context:
        "A hospital generates 5 TB of medical imaging data (X-rays, MRIs, CT scans) per month. Current-year images are accessed frequently for active patient care. Images from 1-3 years ago are accessed occasionally when patients return. Images older than 3 years must be retained for 10 years per HIPAA but are accessed less than once per 1,000 images per year. Retrieval within 24 hours is acceptable for archived images.",
      actions: [
        {
          id: "st3-all-premium",
          label: "Store all images on premium SSD-backed storage for instant access",
          color: "red",
        },
        {
          id: "st3-lifecycle",
          label: "S3 Standard for current year, S3 Standard-IA for years 1-3, S3 Glacier for years 3-10",
          color: "green",
        },
        {
          id: "st3-tape",
          label: "Move all images older than 1 year to physical tape storage on-site",
          color: "orange",
        },
        {
          id: "st3-reduce-quality",
          label: "Reduce image resolution for older scans to save storage space",
          color: "red",
        },
      ],
      correctActionId: "st3-lifecycle",
      rationales: [
        {
          id: "st3-r1",
          text: "Premium SSD storage for 600+ TB of accumulated images over 10 years would cost tens of thousands monthly. The vast majority of images are rarely accessed after the first year.",
        },
        {
          id: "st3-r2",
          text: "This tiered approach matches clinical access patterns: active care images on fast storage, returning patient lookups on cheaper infrequent-access storage, and long-term HIPAA retention on archive storage with 24-hour retrieval that meets the stated acceptable retrieval window.",
        },
        {
          id: "st3-r3",
          text: "Physical tape storage requires on-site management, is vulnerable to environmental damage, and makes the 24-hour retrieval SLA difficult to guarantee. Cloud archive eliminates these risks.",
        },
        {
          id: "st3-r4",
          text: "Reducing medical image resolution violates diagnostic integrity standards. Original imaging data must be preserved at full resolution for patient care and legal purposes.",
        },
      ],
      correctRationaleId: "st3-r2",
      feedback: {
        perfect:
          "Correct. Tiered storage aligned to clinical access patterns meets both operational performance and long-term HIPAA compliance requirements cost-effectively.",
        partial:
          "That approach addresses some concerns but either overspends on rarely accessed data or introduces risks to data integrity.",
        wrong: "That option either violates medical data integrity requirements or creates unsustainable storage costs.",
      },
    },
  ],
  hints: [
    "Storage tier selection should be driven by access frequency. Data accessed daily should be on hot/standard storage, while rarely accessed data should be on archive tiers.",
    "Lifecycle policies automate tier transitions and deletions, eliminating manual management and ensuring compliance with retention requirements.",
    "Consider retrieval time requirements. Archive storage may take hours to retrieve, which is fine for compliance but not for active operations.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Cloud storage cost optimization is a major focus for organizations spending thousands monthly on data storage. Professionals who can design lifecycle policies that cut storage costs by 60-80% while maintaining compliance are highly valued in cloud operations and FinOps roles.",
  toolRelevance: [
    "AWS S3 Storage Classes",
    "Azure Blob Storage Tiers",
    "S3 Lifecycle Policies",
    "Azure Blob Lifecycle Management",
    "AWS Cost Explorer",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
