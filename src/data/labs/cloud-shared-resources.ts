import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "cloud-shared-resources",
  version: 1,
  title: "Cloud Resource Allocation Decisions",
  tier: "beginner",
  track: "virtualization-cloud",
  difficulty: "easy",
  accessLevel: "free",
  tags: ["cloud", "resources", "allocation", "multi-tenancy", "shared", "CompTIA-A+"],
  description:
    "Make resource allocation decisions in shared cloud environments, balancing performance, cost, and isolation requirements for different workloads.",
  estimatedMinutes: 12,
  learningObjectives: [
    "Understand shared vs dedicated resource models in cloud computing",
    "Identify when workloads require dedicated rather than shared resources",
    "Evaluate the cost-performance tradeoffs of different allocation strategies",
    "Recognize noisy neighbor problems and their solutions",
  ],
  sortOrder: 402,
  status: "published",
  prerequisites: [],
  rendererType: "action-rationale",
  scenarios: [
    {
      id: "sr-scenario-1",
      type: "action-rationale",
      title: "Choosing Between Shared and Dedicated Hosting",
      context:
        "A medical clinic runs a patient scheduling application that stores protected health information (PHI). They are moving from an on-premises server to the cloud. The compliance officer requires that patient data must not reside on hardware shared with other organizations. Current usage is low: 20 staff members, under 100 appointments per day.",
      actions: [
        {
          id: "sr1-shared-vm",
          label: "Deploy on a shared multi-tenant VM (e.g., AWS t3.medium)",
          color: "blue",
        },
        {
          id: "sr1-dedicated-host",
          label: "Provision a dedicated host to ensure physical hardware isolation",
          color: "green",
        },
        {
          id: "sr1-serverless",
          label: "Use serverless functions (AWS Lambda) for the entire application",
          color: "orange",
        },
        {
          id: "sr1-private-cloud",
          label: "Build a private cloud data center on-site",
          color: "red",
        },
      ],
      correctActionId: "sr1-dedicated-host",
      rationales: [
        {
          id: "sr1-r1",
          text: "Shared multi-tenant VMs place workloads on hardware shared with other tenants. While logically isolated, this does not meet the compliance officer's physical isolation requirement for PHI data.",
        },
        {
          id: "sr1-r2",
          text: "A dedicated host guarantees that no other organization's workloads run on the same physical hardware, meeting the compliance requirement for PHI isolation while still leveraging cloud benefits.",
        },
        {
          id: "sr1-r3",
          text: "Serverless functions run on shared infrastructure with no visibility into the underlying hardware, making compliance verification impossible for strict PHI requirements.",
        },
        {
          id: "sr1-r4",
          text: "Building a private data center is massively overscoped for a 20-person clinic. Dedicated cloud hosts provide the same physical isolation at a fraction of the cost.",
        },
      ],
      correctRationaleId: "sr1-r2",
      feedback: {
        perfect:
          "Correct. Dedicated hosts satisfy physical isolation requirements for regulated data while keeping cloud scalability and managed infrastructure benefits.",
        partial:
          "That option could work but does not directly address the compliance officer's physical isolation requirement.",
        wrong: "That approach either violates the compliance requirement or is vastly overengineered for a small clinic.",
      },
    },
    {
      id: "sr-scenario-2",
      type: "action-rationale",
      title: "Handling Noisy Neighbor Performance Issues",
      context:
        "Your company runs an e-commerce website on a shared cloud VM (AWS t3.large). Over the past week, response times spike unpredictably between 2-5 PM, increasing from 200ms to over 2 seconds. Your application logs show no errors, CPU stays at 30%, and memory at 45%. AWS Health Dashboard shows no incidents. Your VM is on a shared host.",
      actions: [
        {
          id: "sr2-upgrade-cpu",
          label: "Double the VM size to t3.2xlarge for more CPU and memory",
          color: "orange",
        },
        {
          id: "sr2-dedicated",
          label: "Migrate to a dedicated instance (m5.large) to eliminate shared hardware contention",
          color: "green",
        },
        {
          id: "sr2-restart",
          label: "Restart the VM daily at 1 PM before the slowdowns begin",
          color: "red",
        },
        {
          id: "sr2-cdn",
          label: "Add a CDN to cache all responses",
          color: "blue",
        },
      ],
      correctActionId: "sr2-dedicated",
      rationales: [
        {
          id: "sr2-r1",
          text: "Upgrading the VM size does not fix contention at the hypervisor level. If another tenant on the same host is consuming excessive I/O or network bandwidth, a bigger VM still shares the same bottleneck.",
        },
        {
          id: "sr2-r2",
          text: "Dedicated instances eliminate the noisy neighbor problem by ensuring no other customers share the underlying hardware. The consistent afternoon spikes with low app utilization are classic signs of hypervisor-level resource contention.",
        },
        {
          id: "sr2-r3",
          text: "Restarting the VM does not address the root cause and introduces downtime. The VM may land on the same shared host after restart.",
        },
        {
          id: "sr2-r4",
          text: "A CDN helps with static content but cannot resolve backend application response time issues caused by shared infrastructure contention.",
        },
      ],
      correctRationaleId: "sr2-r2",
      feedback: {
        perfect:
          "Excellent diagnosis. Low application utilization with unpredictable performance spikes on shared infrastructure is the classic noisy neighbor pattern.",
        partial:
          "That might improve things but does not address the root cause of hypervisor-level resource contention.",
        wrong: "That approach does not solve the underlying shared infrastructure contention issue.",
      },
    },
    {
      id: "sr-scenario-3",
      type: "action-rationale",
      title: "Right-Sizing Shared Resources for a Test Environment",
      context:
        "Your team needs a cloud environment for running automated tests during business hours. Tests run for about 20 minutes every 2 hours between 9 AM and 5 PM. The test suite needs 4 vCPUs and 8 GB RAM while running. Currently, a dedicated m5.xlarge instance runs 24/7 costing $140/month. Management wants to cut this cost by at least 50%.",
      actions: [
        {
          id: "sr3-spot",
          label: "Switch to a spot instance for the same m5.xlarge size",
          color: "blue",
        },
        {
          id: "sr3-burstable",
          label: "Use a burstable t3.xlarge instance with auto-stop scheduling outside business hours",
          color: "green",
        },
        {
          id: "sr3-smaller",
          label: "Downgrade to t3.small (2 vCPU, 2 GB) running 24/7",
          color: "red",
        },
        {
          id: "sr3-lambda",
          label: "Rewrite all tests as Lambda functions",
          color: "orange",
        },
      ],
      correctActionId: "sr3-burstable",
      rationales: [
        {
          id: "sr3-r1",
          text: "Spot instances can be interrupted with 2-minute notice, which would abort test runs mid-execution. This causes unreliable test results and wasted developer time investigating false failures.",
        },
        {
          id: "sr3-r2",
          text: "A burstable t3.xlarge can handle the intermittent 20-minute test bursts perfectly while costing less than a fixed-performance instance. Combined with auto-stop scheduling for evenings and weekends, this achieves the 50%+ cost reduction target reliably.",
        },
        {
          id: "sr3-r3",
          text: "A t3.small with 2 vCPU and 2 GB RAM cannot meet the test suite's requirement of 4 vCPUs and 8 GB RAM. Tests would fail or run unacceptably slowly.",
        },
        {
          id: "sr3-r4",
          text: "Rewriting an existing test suite as Lambda functions is a major engineering effort that likely exceeds the cost savings target for months or years.",
        },
      ],
      correctRationaleId: "sr3-r2",
      feedback: {
        perfect:
          "Correct. Burstable instances are ideal for intermittent workloads, and auto-stop scheduling eliminates waste during off-hours.",
        partial:
          "That approach reduces cost but introduces reliability risks or insufficient resources for the test workload.",
        wrong: "That option either cannot run the tests successfully or requires disproportionate engineering effort.",
      },
    },
  ],
  hints: [
    "Consider whether compliance or regulatory requirements demand physical hardware isolation, not just logical isolation.",
    "When application metrics look normal but performance degrades, look at the infrastructure layer for shared resource contention.",
    "Burstable instance types are designed for intermittent workloads that do not need sustained high CPU.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Understanding cloud resource allocation and multi-tenancy is critical for IT professionals. Help desk teams troubleshoot performance issues that stem from shared infrastructure, and system administrators must balance cost with isolation requirements daily.",
  toolRelevance: [
    "AWS EC2 Dedicated Hosts",
    "Azure Dedicated Host",
    "AWS Instance Scheduler",
    "Cloud Cost Management Tools",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
