import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "cloud-migration-plan",
  version: 1,
  title: "Plan On-Premises to Cloud Migration",
  tier: "intermediate",
  track: "virtualization-cloud",
  difficulty: "moderate",
  accessLevel: "free",
  tags: ["cloud", "migration", "lift-and-shift", "planning", "assessment", "CompTIA-A+"],
  description:
    "Investigate an on-premises environment and decide on the appropriate cloud migration strategy for different workloads, considering dependencies, risks, and timeline constraints.",
  estimatedMinutes: 20,
  learningObjectives: [
    "Assess on-premises workloads for cloud migration readiness",
    "Apply the 6 Rs of cloud migration (rehost, replatform, refactor, repurchase, retain, retire)",
    "Identify migration dependencies and sequencing requirements",
    "Evaluate risk factors and rollback strategies for cloud migrations",
  ],
  sortOrder: 408,
  status: "published",
  prerequisites: [],
  rendererType: "investigate-decide",
  scenarios: [
    {
      id: "mp-scenario-1",
      type: "investigate-decide",
      title: "Migrating an Aging Email Server",
      objective:
        "Determine the best migration strategy for an on-premises Exchange Server 2016 that is running on end-of-support hardware.",
      investigationData: [
        {
          id: "mp1-current",
          label: "Current State Assessment",
          content:
            "Exchange Server 2016 running on a Dell PowerEdge R630 (purchased 2016, warranty expired 2021). The server hosts email for 200 users with 5 TB of mailbox data. Average CPU utilization is 35%, memory at 70%. The server has had 3 unplanned outages in the past year due to aging RAID controller. Next hardware failure may be unrecoverable without a backup restore.",
          isCritical: true,
        },
        {
          id: "mp1-requirements",
          label: "Business Requirements",
          content:
            "Email must be available 99.9% of the time. The company uses Outlook on desktop and mobile. They need calendar sharing, shared mailboxes, and distribution groups. No custom Exchange transport rules or third-party plugins are in use. IT staff spend 15 hours/week maintaining Exchange (patching, certificate management, backup verification).",
        },
        {
          id: "mp1-constraints",
          label: "Migration Constraints",
          content:
            "Budget: $25/user/month for email services. Timeline: must be off the old hardware within 60 days before the predicted RAID controller failure window. The company has a Microsoft Enterprise Agreement with Office 365 licenses already purchased but unused. Zero tolerance for email data loss during migration.",
        },
      ],
      actions: [
        {
          id: "mp1-rehost",
          label: "Rehost: Migrate Exchange Server to an Azure VM (lift-and-shift)",
          color: "orange",
        },
        {
          id: "mp1-repurchase",
          label: "Repurchase: Migrate all mailboxes to Microsoft 365 Exchange Online",
          color: "green",
        },
        {
          id: "mp1-replatform",
          label: "Replatform: Upgrade to Exchange Server 2019 on new on-prem hardware",
          color: "blue",
        },
        {
          id: "mp1-retain",
          label: "Retain: Keep Exchange 2016 and replace only the failing hardware",
          color: "red",
        },
      ],
      correctActionId: "mp1-repurchase",
      rationales: [
        {
          id: "mp1-r1",
          text: "Rehosting Exchange to a VM moves the management burden to the cloud but still requires the same 15 hours/week for Exchange patching, certificate management, and backup. It does not leverage the already-purchased Office 365 licenses.",
        },
        {
          id: "mp1-r2",
          text: "Migrating to Exchange Online (repurchase) eliminates all server management overhead, uses the already-purchased Office 365 licenses, provides 99.9% SLA, and Microsoft's hybrid migration tools can move 5 TB of mailbox data within the 60-day timeline with zero data loss.",
        },
        {
          id: "mp1-r3",
          text: "Purchasing new on-premises hardware and upgrading to Exchange 2019 continues the same management overhead and does not use the existing Office 365 investment. Hardware procurement may exceed the 60-day timeline.",
        },
        {
          id: "mp1-r4",
          text: "Keeping Exchange 2016 on new hardware prolongs the maintenance burden and does not address the IT staff's 15 hours/week of management overhead. Exchange 2016 mainstream support ended in 2020.",
        },
      ],
      correctRationaleId: "mp1-r2",
      feedback: {
        perfect:
          "Correct. When existing SaaS licenses are available and no custom configurations exist, repurchasing (SaaS migration) eliminates management overhead and maximizes existing investments.",
        partial:
          "That approach addresses the hardware risk but does not optimize for the existing Office 365 licenses or reduce management overhead.",
        wrong: "That strategy continues the same operational burden and hardware risk that triggered the migration decision.",
      },
    },
    {
      id: "mp-scenario-2",
      type: "investigate-decide",
      title: "Migrating a Custom ERP System",
      objective:
        "Determine the migration strategy for a heavily customized on-premises ERP system that is critical to daily operations.",
      investigationData: [
        {
          id: "mp2-app",
          label: "Application Assessment",
          content:
            "The ERP system was custom-built in-house 12 years ago using Java 8 on Apache Tomcat with an Oracle 12c database. It has 150,000 lines of custom code, 47 custom stored procedures, and integrates with 3 warehouse barcode scanners via a local TCP socket server. The original developers have left the company. Documentation is minimal.",
          isCritical: true,
        },
        {
          id: "mp2-performance",
          label: "Performance and Usage Data",
          content:
            "The application serves 80 concurrent users during business hours. Database size is 800 GB. The TCP socket server for barcode scanners requires sub-10ms latency to the warehouse floor. Peak CPU on the app server is 60%, and the database server runs at 75% CPU during month-end processing.",
        },
        {
          id: "mp2-deadline",
          label: "Timeline and Budget",
          content:
            "The data center lease expires in 6 months. Colocation costs are $4,000/month. Budget for migration is $50,000 total. There is no budget for a full application rewrite. The warehouse scanner integration must continue to function during and after migration.",
        },
      ],
      actions: [
        {
          id: "mp2-refactor",
          label: "Refactor: Rewrite the ERP as a cloud-native microservices application",
          color: "red",
        },
        {
          id: "mp2-rehost",
          label: "Rehost: Lift-and-shift the app and database servers to AWS EC2 VMs",
          color: "green",
        },
        {
          id: "mp2-repurchase",
          label: "Repurchase: Replace with a commercial SaaS ERP like SAP Business One",
          color: "orange",
        },
        {
          id: "mp2-retain",
          label: "Retain: Move servers to a new colocation facility instead of cloud",
          color: "blue",
        },
      ],
      correctActionId: "mp2-rehost",
      rationales: [
        {
          id: "mp2-r1",
          text: "Refactoring 150,000 lines of undocumented legacy code with no original developers available is unrealistic within 6 months and $50,000. This would likely take 12-18 months and several hundred thousand dollars.",
        },
        {
          id: "mp2-r2",
          text: "Lift-and-shift preserves the exact application configuration on cloud VMs within the 6-month timeline and budget. The barcode scanner integration can be maintained via a VPN or AWS Direct Connect to the warehouse. This is the lowest-risk approach for a complex, undocumented legacy system.",
        },
        {
          id: "mp2-r3",
          text: "Replacing a 12-year-old custom ERP with 47 stored procedures and warehouse integrations requires extensive data migration, workflow mapping, and user retraining. This exceeds both the 6-month timeline and $50,000 budget.",
        },
        {
          id: "mp2-r4",
          text: "Moving to a new colocation continues the same $4,000/month cost without any modernization benefit. The total cost over 3 years ($144,000) far exceeds the cloud migration alternative.",
        },
      ],
      correctRationaleId: "mp2-r2",
      feedback: {
        perfect:
          "Correct. Lift-and-shift is the safest strategy for complex legacy systems with minimal documentation, tight timelines, and limited budgets. Modernization can happen incrementally after the migration.",
        partial:
          "That approach has long-term merit but the timeline, budget, or complexity constraints make it infeasible for this specific situation.",
        wrong: "That strategy either exceeds the constraints or fails to address the data center lease deadline.",
      },
    },
    {
      id: "mp-scenario-3",
      type: "investigate-decide",
      title: "Migrating a Web Application with Database",
      objective:
        "Determine the optimal migration path for a modern web application that could benefit from cloud-native services.",
      investigationData: [
        {
          id: "mp3-app",
          label: "Application Architecture",
          content:
            "The application is a Python Django web app with a PostgreSQL 15 database, built 2 years ago following 12-factor app principles. It uses environment variables for configuration, stateless application processes, and stores user uploads in a mounted NFS share. The codebase is in Git with full CI/CD via GitHub Actions. All dependencies are pinned in requirements.txt.",
          isCritical: true,
        },
        {
          id: "mp3-scale",
          label: "Scaling Requirements",
          content:
            "Traffic is seasonal: 500 users/day normally but 5,000 users/day during quarterly peak periods lasting 2 weeks each. Current infrastructure cannot handle peak traffic, causing slow response times and occasional 502 errors. Two application servers sit behind an HAProxy load balancer. The team manually adds a third server during peaks.",
        },
        {
          id: "mp3-goals",
          label: "Migration Goals",
          content:
            "Primary goal: eliminate manual scaling and handle peak traffic automatically. Secondary goal: reduce operational overhead by leveraging managed services. The team has 3 months for migration. Budget allows for higher per-unit cloud costs if operational overhead decreases. The database should remain PostgreSQL-compatible.",
        },
      ],
      actions: [
        {
          id: "mp3-rehost",
          label: "Rehost: Move the Django app and PostgreSQL to EC2 VMs as-is",
          color: "orange",
        },
        {
          id: "mp3-replatform",
          label: "Replatform: Deploy to AWS Elastic Beanstalk with RDS PostgreSQL and S3 for uploads",
          color: "green",
        },
        {
          id: "mp3-refactor",
          label: "Refactor: Rewrite as serverless using AWS Lambda and DynamoDB",
          color: "red",
        },
        {
          id: "mp3-container",
          label: "Containerize and deploy on self-managed Kubernetes cluster",
          color: "blue",
        },
      ],
      correctActionId: "mp3-replatform",
      rationales: [
        {
          id: "mp3-r1",
          text: "Rehosting to EC2 reproduces the same manual scaling problem on cloud VMs. Without auto-scaling integration, the team would still manually add instances during peak periods.",
        },
        {
          id: "mp3-r2",
          text: "Replatforming to Elastic Beanstalk provides auto-scaling for Django, RDS manages PostgreSQL backups and patches, and S3 replaces the NFS share with unlimited scalable storage. The 12-factor architecture requires minimal code changes. This achieves both goals within 3 months.",
        },
        {
          id: "mp3-r3",
          text: "Rewriting a Django app as serverless Lambda functions with DynamoDB requires abandoning the Django framework, rewriting the PostgreSQL data layer, and fundamentally changing the application architecture. This far exceeds the 3-month timeline.",
        },
        {
          id: "mp3-r4",
          text: "A self-managed Kubernetes cluster introduces significant operational complexity that contradicts the goal of reducing operational overhead. The team would spend more time managing Kubernetes than the current HAProxy setup.",
        },
      ],
      correctRationaleId: "mp3-r2",
      feedback: {
        perfect:
          "Excellent. Replatforming is ideal for well-architected modern applications that can leverage managed cloud services with minimal code changes.",
        partial:
          "That approach works but either misses the auto-scaling goal, introduces unnecessary complexity, or requires timeline-exceeding changes.",
        wrong: "That strategy either reproduces existing problems in the cloud or requires a complete rewrite that exceeds the project constraints.",
      },
    },
  ],
  hints: [
    "Match the migration strategy to the application's age, architecture, and documentation quality. Legacy apps with minimal docs are best rehosted, while modern apps can be replatformed.",
    "Always check for existing cloud service licenses or credits before choosing a migration path. Unused SaaS licenses change the cost calculation significantly.",
    "Consider the 6 Rs: Rehost (lift-and-shift), Replatform (lift-and-reshape), Refactor (re-architect), Repurchase (replace with SaaS), Retain (keep on-prem), Retire (decommission).",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Cloud migration is one of the largest ongoing IT projects across all industries. Every organization has legacy systems to migrate, creating massive demand for professionals who can assess workloads and plan migration strategies. This skill is essential for cloud architecture and IT project management roles.",
  toolRelevance: [
    "AWS Migration Hub",
    "Azure Migrate",
    "AWS Application Discovery Service",
    "Microsoft 365 Migration Tools",
    "CloudEndure Migration",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
