import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "cloud-disaster-recovery",
  version: 1,
  title: "Design a Cloud Disaster Recovery Plan",
  tier: "advanced",
  track: "virtualization-cloud",
  difficulty: "challenging",
  accessLevel: "premium",
  tags: ["cloud", "disaster-recovery", "high-availability", "failover", "RTO", "RPO", "CompTIA-A+"],
  description:
    "Investigate business continuity requirements and design appropriate disaster recovery strategies using cloud services for different criticality levels.",
  estimatedMinutes: 22,
  learningObjectives: [
    "Define and apply RTO and RPO requirements to DR strategy selection",
    "Compare pilot light, warm standby, and multi-site DR architectures",
    "Design cross-region failover strategies for critical applications",
    "Evaluate the cost-benefit tradeoffs of different DR tiers",
  ],
  sortOrder: 411,
  status: "published",
  prerequisites: [],
  rendererType: "investigate-decide",
  scenarios: [
    {
      id: "dr-scenario-1",
      type: "investigate-decide",
      title: "E-Commerce Platform DR Strategy",
      objective:
        "Design a disaster recovery strategy for an e-commerce platform that generates $50,000/hour in revenue during peak shopping seasons.",
      investigationData: [
        {
          id: "dr1-business",
          label: "Business Impact Analysis",
          content:
            "The e-commerce platform generates $50,000/hour during Black Friday and holiday season (November-December). Average revenue is $8,000/hour year-round. Every hour of downtime during peak season costs $50,000 in lost sales plus an estimated $25,000 in customer trust damage. The CFO has approved a DR budget of up to $15,000/month.",
          isCritical: true,
        },
        {
          id: "dr1-current",
          label: "Current Architecture",
          content:
            "The platform runs in AWS us-east-1 with: 4 EC2 instances behind an ALB, an RDS Multi-AZ MySQL database (500 GB), 2 TB of product images in S3, and ElastiCache Redis for session data. Current backup is RDS automated snapshots every 12 hours with 7-day retention. No cross-region replication exists.",
        },
        {
          id: "dr1-requirements",
          label: "Recovery Requirements",
          content:
            "Management requires: RTO of 1 hour (full service restoration within 60 minutes). RPO of 15 minutes (maximum 15 minutes of data loss). Automatic health monitoring with alert-based failover initiation. Quarterly DR testing without impacting production. The solution must handle a complete us-east-1 regional failure.",
        },
      ],
      actions: [
        {
          id: "dr1-backup-restore",
          label: "Backup and Restore: Cross-region S3 backup with manual restore procedures",
          color: "red",
        },
        {
          id: "dr1-pilot-light",
          label: "Pilot Light: RDS cross-region read replica in us-west-2, launch EC2 on failover",
          color: "orange",
        },
        {
          id: "dr1-warm-standby",
          label: "Warm Standby: Scaled-down replica of entire stack in us-west-2 with Route 53 failover",
          color: "green",
        },
        {
          id: "dr1-multi-site",
          label: "Multi-Site Active-Active: Full production capacity in both us-east-1 and us-west-2",
          color: "blue",
        },
      ],
      correctActionId: "dr1-warm-standby",
      rationales: [
        {
          id: "dr1-r1",
          text: "Backup and restore requires rebuilding the entire infrastructure from scratch during a disaster. RDS restoration alone takes 30-60 minutes, and provisioning EC2, configuring ALB, and warming caches would far exceed the 1-hour RTO.",
        },
        {
          id: "dr1-r2",
          text: "Warm standby maintains a running but smaller copy of the entire stack in us-west-2. The RDS read replica provides continuous replication (meeting the 15-minute RPO), and Route 53 health checks can trigger automatic DNS failover. EC2 auto-scaling expands the standby to full capacity within minutes during failover.",
        },
        {
          id: "dr1-r3",
          text: "Pilot light keeps only the database replicated. Launching and configuring EC2 instances, ALB, and ElastiCache from scratch during a disaster introduces risk of exceeding the 1-hour RTO, especially under the stress of a regional outage.",
        },
        {
          id: "dr1-r4",
          text: "Multi-site active-active doubles the infrastructure cost to $30,000+/month, exceeding the $15,000 DR budget. It provides near-zero RTO but is overengineered for a 1-hour RTO requirement.",
        },
      ],
      correctRationaleId: "dr1-r2",
      feedback: {
        perfect:
          "Excellent DR design. Warm standby provides the right balance of recovery speed, data protection, and cost for this business's RTO and RPO requirements.",
        partial:
          "That approach either risks missing the RTO/RPO targets or significantly exceeds the DR budget for the stated requirements.",
        wrong: "That strategy cannot meet the 1-hour RTO and 15-minute RPO requirements within the approved budget.",
      },
    },
    {
      id: "dr-scenario-2",
      type: "investigate-decide",
      title: "Healthcare Records System DR",
      objective:
        "Design a disaster recovery plan for a hospital electronic health records (EHR) system that is critical to patient care and regulated by HIPAA.",
      investigationData: [
        {
          id: "dr2-criticality",
          label: "Clinical Impact Assessment",
          content:
            "The EHR system is used by 300 physicians and nurses 24/7 for medication ordering, lab results, and patient history. If the system is down, the hospital reverts to paper-based processes that increase medication error risk by 5x. HIPAA requires that electronic health records be recoverable and available, with documented DR procedures tested annually.",
          isCritical: true,
        },
        {
          id: "dr2-architecture",
          label: "System Architecture",
          content:
            "The EHR runs on Azure in East US: 8 VMs running the application tier, Azure SQL Database (2 TB) with geo-replication to West US, 500 GB of medical imaging in Azure Blob Storage with GRS replication, and Azure Active Directory for clinician authentication. The hospital also has an on-premises data center with aging equipment.",
        },
        {
          id: "dr2-requirements",
          label: "Recovery Requirements",
          content:
            "RTO: 15 minutes (patient safety critical). RPO: 0 data loss (zero tolerance for lost medical records). Must maintain HIPAA compliance in both primary and DR regions. DR site must be geographically separated by at least 300 miles. Annual DR test must demonstrate full functionality including clinical workflows.",
        },
      ],
      actions: [
        {
          id: "dr2-warm-standby",
          label: "Warm Standby in West US with Azure SQL geo-replication failover",
          color: "orange",
        },
        {
          id: "dr2-active-active",
          label: "Active-Active: Full production in both East US and West US with Azure Front Door",
          color: "green",
        },
        {
          id: "dr2-onprem-backup",
          label: "Failover to on-premises data center using Azure Site Recovery",
          color: "red",
        },
        {
          id: "dr2-backup-restore",
          label: "Daily backup to West US with manual restore procedures",
          color: "red",
        },
      ],
      correctActionId: "dr2-active-active",
      rationales: [
        {
          id: "dr2-r1",
          text: "Warm standby requires failover time for scaling up VMs and promoting the database replica. With a 15-minute RTO for a patient-safety-critical system, there is very little margin for error during a high-stress regional outage scenario.",
        },
        {
          id: "dr2-r2",
          text: "Active-active with Azure Front Door provides near-instant failover because both regions are already handling production traffic. Azure SQL geo-replication with auto-failover groups achieves zero RPO. Both regions maintain HIPAA compliance independently, and annual DR testing is simplified because both sites process real traffic daily.",
        },
        {
          id: "dr2-r3",
          text: "The on-premises data center has aging equipment and would need significant investment to meet HIPAA standards for the EHR workload. Failover to on-prem introduces hardware failure risk during the disaster recovery scenario.",
        },
        {
          id: "dr2-r4",
          text: "Daily backups with manual restore cannot achieve zero RPO (up to 24 hours of data loss) or a 15-minute RTO. Lost medical records could directly endanger patient safety.",
        },
      ],
      correctRationaleId: "dr2-r2",
      feedback: {
        perfect:
          "Correct. Patient-safety-critical systems with zero RPO and 15-minute RTO require active-active architecture where both regions are production-ready at all times.",
        partial:
          "That approach provides some protection but the RTO or RPO risk is too high for a system where downtime directly threatens patient safety.",
        wrong: "That strategy cannot meet the clinical requirements. Any solution with data loss potential or extended recovery time is unacceptable for an EHR system.",
      },
    },
    {
      id: "dr-scenario-3",
      type: "investigate-decide",
      title: "Small Business DR on a Budget",
      objective:
        "Design a cost-effective disaster recovery approach for a small accounting firm with limited IT budget and moderate recovery requirements.",
      investigationData: [
        {
          id: "dr3-business",
          label: "Business Profile",
          content:
            "A 20-person accounting firm uses a cloud-hosted practice management system, QuickBooks Online, and Microsoft 365 for daily operations. They also run a single on-premises Windows Server 2022 that hosts a legacy tax preparation application with a 200 GB SQL Express database. IT budget for DR is $200/month maximum.",
          isCritical: true,
        },
        {
          id: "dr3-analysis",
          label: "Impact Analysis",
          content:
            "If cloud services (Microsoft 365, QuickBooks Online) go down, the firm can wait for the provider to restore service. If the on-premises tax server goes down, 3-5 accountants are blocked. During tax season (January-April), the server is critical with an RTO of 4 hours. Off-season RTO can be 24 hours. RPO is 1 hour year-round.",
        },
        {
          id: "dr3-current",
          label: "Current Backup State",
          content:
            "Windows Server Backup runs to an external USB drive nightly. The USB drive sits next to the server. No off-site backup exists. No documented recovery procedures exist. The last test restore was attempted 2 years ago and failed due to a corrupted backup. QuickBooks Online and Microsoft 365 have their own built-in redundancy.",
        },
      ],
      actions: [
        {
          id: "dr3-azure-site-recovery",
          label: "Deploy Azure Site Recovery for automated VM failover to Azure",
          color: "blue",
        },
        {
          id: "dr3-cloud-backup",
          label: "Azure Backup for the on-prem server with hourly backups and documented restore runbook",
          color: "green",
        },
        {
          id: "dr3-second-server",
          label: "Purchase a second identical server as a warm standby in the office",
          color: "orange",
        },
        {
          id: "dr3-nas-backup",
          label: "Replace the USB drive with a NAS device on the local network",
          color: "red",
        },
      ],
      correctActionId: "dr3-cloud-backup",
      rationales: [
        {
          id: "dr3-r1",
          text: "Azure Site Recovery costs approximately $25/server/month plus VM compute during failover. While powerful, maintaining a hot standby VM in Azure during tax season exceeds the $200/month budget significantly.",
        },
        {
          id: "dr3-r2",
          text: "Azure Backup costs approximately $10/month for 200 GB with hourly backup frequency (meeting 1-hour RPO). A documented restore runbook ensures the 4-hour tax season RTO is achievable and testable. Cloud storage protects against on-site disasters. Total cost stays well under $200/month.",
        },
        {
          id: "dr3-r3",
          text: "A second server costs $3,000-5,000 upfront plus ongoing maintenance. It also does not protect against office-level disasters like fire or flooding since both servers are in the same location.",
        },
        {
          id: "dr3-r4",
          text: "A local NAS improves backup speed over USB but does not provide off-site protection. Fire, flood, or ransomware that hits the server would likely affect a NAS on the same network.",
        },
      ],
      correctRationaleId: "dr3-r2",
      feedback: {
        perfect:
          "Correct. Azure Backup provides cost-effective off-site protection within the budget while meeting the RPO with hourly backups. The restore runbook is critical for meeting the RTO.",
        partial:
          "That option provides better protection than the current USB backup but either exceeds the budget or does not provide off-site disaster protection.",
        wrong: "That approach keeps backups on-site where they are vulnerable to the same physical disasters that could destroy the server.",
      },
    },
  ],
  hints: [
    "Match the DR strategy cost to the business impact of downtime. A $50,000/hour revenue loss justifies more DR spending than a small firm with $200/month budget.",
    "RTO determines how fast you need to recover. Shorter RTOs require more running infrastructure in the DR site.",
    "RPO determines how much data loss is acceptable. Zero RPO requires synchronous or near-synchronous replication.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Disaster recovery planning is a critical skill that spans all IT roles. From help desk to CTO, everyone plays a role in DR. Being able to design and test DR plans demonstrates strategic thinking that employers prize. DR plan design is a common interview question for cloud and infrastructure roles.",
  toolRelevance: [
    "Azure Site Recovery",
    "AWS Disaster Recovery",
    "Azure Backup",
    "AWS Route 53 Health Checks",
    "Azure Front Door",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
