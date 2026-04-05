import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "cloud-backup-strategy",
  version: 1,
  title: "Choose a Cloud Backup Approach",
  tier: "beginner",
  track: "virtualization-cloud",
  difficulty: "easy",
  accessLevel: "free",
  tags: ["cloud", "backup", "disaster-recovery", "storage", "data-protection", "CompTIA-A+"],
  description:
    "Select the appropriate cloud backup strategy based on data criticality, recovery time objectives, and budget constraints for different business scenarios.",
  estimatedMinutes: 12,
  learningObjectives: [
    "Compare full, incremental, and differential backup strategies in the cloud",
    "Evaluate Recovery Time Objective (RTO) and Recovery Point Objective (RPO) requirements",
    "Select appropriate cloud backup services for different data types",
    "Understand retention policies and their cost implications",
  ],
  sortOrder: 403,
  status: "published",
  prerequisites: [],
  rendererType: "action-rationale",
  scenarios: [
    {
      id: "bs-scenario-1",
      type: "action-rationale",
      title: "Backing Up a Small Business Database",
      context:
        "A retail store runs a point-of-sale system with a 50 GB SQL Server database. Transactions occur throughout the day from 8 AM to 10 PM. Losing more than 1 hour of sales data is unacceptable. The current backup is a weekly full backup to a USB drive stored on-site. The store was recently hit by ransomware that encrypted the server and the USB backup drive.",
      actions: [
        {
          id: "bs1-weekly-full",
          label: "Continue weekly full backups but store copies on a second USB drive off-site",
          color: "red",
        },
        {
          id: "bs1-cloud-incremental",
          label: "Configure Azure Backup with daily full and hourly incremental backups to geo-redundant storage",
          color: "green",
        },
        {
          id: "bs1-cloud-full-daily",
          label: "Schedule daily full backups to an S3 bucket in the same region",
          color: "orange",
        },
        {
          id: "bs1-manual-export",
          label: "Manually export the database to cloud storage at end of each business day",
          color: "blue",
        },
      ],
      correctActionId: "bs1-cloud-incremental",
      rationales: [
        {
          id: "bs1-r1",
          text: "USB backups on-site are vulnerable to the same ransomware, theft, or fire that hits the server. A second USB drive does not solve the core problem of on-site-only backup.",
        },
        {
          id: "bs1-r2",
          text: "Hourly incremental backups to geo-redundant cloud storage meet the 1-hour RPO requirement. Geo-redundancy protects against regional disasters, and cloud storage is immune to local ransomware attacks.",
        },
        {
          id: "bs1-r3",
          text: "Daily full backups to a single-region S3 bucket still risk up to 24 hours of data loss, exceeding the 1-hour RPO. Same-region storage also lacks geographic disaster protection.",
        },
        {
          id: "bs1-r4",
          text: "Manual end-of-day exports risk up to 14 hours of data loss (full business day) and depend on a human remembering to run the export every day.",
        },
      ],
      correctRationaleId: "bs1-r2",
      feedback: {
        perfect:
          "Correct. Hourly incremental backups to geo-redundant cloud storage meet the RPO while protecting against ransomware, theft, and regional disasters.",
        partial:
          "That improves over the current approach but does not fully meet the 1-hour RPO or geographic redundancy needs.",
        wrong: "That strategy leaves the business exposed to the same risks that caused the ransomware incident.",
      },
    },
    {
      id: "bs-scenario-2",
      type: "action-rationale",
      title: "Archival Backup for Compliance Records",
      context:
        "A law firm must retain client case files for 7 years per regulatory requirements. They have 10 TB of closed case files that are rarely accessed (maybe once or twice per year for audits). The files are currently on an aging NAS that is running out of space. Cost is a primary concern since these files generate no revenue. Retrieval time of up to 12 hours is acceptable for the rare audit requests.",
      actions: [
        {
          id: "bs2-s3-standard",
          label: "Upload all files to AWS S3 Standard storage",
          color: "orange",
        },
        {
          id: "bs2-glacier",
          label: "Archive to AWS S3 Glacier Deep Archive with a 7-year lifecycle retention policy",
          color: "green",
        },
        {
          id: "bs2-new-nas",
          label: "Purchase a larger NAS device and copy the files over",
          color: "red",
        },
        {
          id: "bs2-azure-hot",
          label: "Upload to Azure Blob Storage Hot tier for instant access",
          color: "blue",
        },
      ],
      correctActionId: "bs2-glacier",
      rationales: [
        {
          id: "bs2-r1",
          text: "S3 Standard costs approximately $0.023/GB/month. For 10 TB over 7 years, that is over $19,000 in storage costs alone. This is excessive for data accessed once or twice per year.",
        },
        {
          id: "bs2-r2",
          text: "Glacier Deep Archive costs approximately $0.00099/GB/month, roughly 23x cheaper than S3 Standard. The 12-hour retrieval time matches the acceptable audit access window, and lifecycle policies automate the 7-year retention requirement.",
        },
        {
          id: "bs2-r3",
          text: "A new NAS repeats the same problem: aging hardware, limited space, on-site risk from fire or theft, and no automated retention policy enforcement.",
        },
        {
          id: "bs2-r4",
          text: "Azure Blob Hot tier is designed for frequently accessed data. It has similar cost issues to S3 Standard for rarely accessed archival data.",
        },
      ],
      correctRationaleId: "bs2-r2",
      feedback: {
        perfect:
          "Excellent. Glacier Deep Archive is purpose-built for long-term compliance archival with minimal access requirements at the lowest cost per GB.",
        partial:
          "That works but dramatically overspends on storage for data that is accessed once or twice per year.",
        wrong: "That approach does not address the cost concern or continues the risk of on-premises-only storage.",
      },
    },
    {
      id: "bs-scenario-3",
      type: "action-rationale",
      title: "VM Snapshot Strategy for Production Servers",
      context:
        "Your company deploys application updates to 5 production Azure VMs every Tuesday. Last month, a bad deployment corrupted application data and it took 6 hours to manually rebuild the servers. The team lead wants a reliable way to quickly roll back all 5 VMs if a deployment fails. VMs run Windows Server 2022 with a total of 500 GB of data. The rollback must complete within 30 minutes.",
      actions: [
        {
          id: "bs3-pre-deploy-snap",
          label: "Take Azure VM snapshots of all 5 VMs immediately before each deployment",
          color: "green",
        },
        {
          id: "bs3-nightly-backup",
          label: "Configure nightly Azure Backup and restore from last night's backup if needed",
          color: "orange",
        },
        {
          id: "bs3-image-gallery",
          label: "Create a golden image in Azure Shared Image Gallery and redeploy from it",
          color: "blue",
        },
        {
          id: "bs3-file-copy",
          label: "Copy all application files to blob storage before deployment",
          color: "red",
        },
      ],
      correctActionId: "bs3-pre-deploy-snap",
      rationales: [
        {
          id: "bs3-r1",
          text: "Pre-deployment snapshots capture the exact state of each VM's disks moments before the update. Reverting a snapshot takes minutes, well within the 30-minute rollback window, and restores the complete OS and application state.",
        },
        {
          id: "bs3-r2",
          text: "Nightly backups would restore to the previous night's state, potentially losing a full day of production data and any configuration changes made before the deployment.",
        },
        {
          id: "bs3-r3",
          text: "A golden image captures a baseline configuration, not the current production state with live data. Redeploying from it would lose all production data accumulated since the image was created.",
        },
        {
          id: "bs3-r4",
          text: "Copying application files does not capture OS state, registry changes, database state, or service configurations. A file-level backup cannot reliably restore a corrupted deployment.",
        },
      ],
      correctRationaleId: "bs3-r1",
      feedback: {
        perfect:
          "Correct. Pre-deployment VM snapshots provide the fastest and most complete rollback path, capturing the exact disk state moments before any changes.",
        partial:
          "That provides some protection but either loses recent data or does not capture the full system state needed for a complete rollback.",
        wrong: "That approach cannot achieve a reliable 30-minute rollback to the exact pre-deployment state.",
      },
    },
  ],
  hints: [
    "RPO defines the maximum acceptable data loss measured in time. Match your backup frequency to meet this requirement.",
    "For archival data accessed very rarely, use the cheapest storage tier that still meets your retrieval time requirements.",
    "VM snapshots capture the complete disk state at a point in time, making them ideal for pre-change rollback protection.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Backup strategy is a foundational skill for every IT role. Help desk staff explain backup options to users, system administrators implement and test backup plans, and cloud engineers optimize backup costs. A failed backup during a real incident can end careers.",
  toolRelevance: [
    "Azure Backup",
    "AWS Backup",
    "Azure VM Snapshots",
    "AWS S3 Glacier",
    "Veeam Backup for Cloud",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
