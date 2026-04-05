import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "cloud-cost-optimization",
  version: 1,
  title: "Diagnose Unexpected Cloud Costs",
  tier: "intermediate",
  track: "virtualization-cloud",
  difficulty: "moderate",
  accessLevel: "free",
  tags: ["cloud", "cost-management", "finops", "optimization", "billing", "CompTIA-A+"],
  description:
    "Triage unexpected cloud billing spikes by analyzing evidence, classifying the root cause, and applying the correct remediation to bring costs under control.",
  estimatedMinutes: 18,
  learningObjectives: [
    "Read and interpret cloud billing dashboards and cost breakdowns",
    "Identify common causes of unexpected cloud cost increases",
    "Apply targeted cost remediation strategies without disrupting services",
    "Implement preventive controls like budgets and alerts to catch future cost anomalies",
  ],
  sortOrder: 409,
  status: "published",
  prerequisites: [],
  rendererType: "triage-remediate",
  scenarios: [
    {
      id: "co-scenario-1",
      type: "triage-remediate",
      title: "AWS Bill Doubled Overnight",
      description:
        "The finance team flagged that last month's AWS bill jumped from $3,200 to $6,800. The cloud team did not deploy any new services. You need to investigate the cost spike, identify the root cause, and fix it.",
      evidence: [
        {
          type: "billing",
          content:
            "AWS Cost Explorer shows: EC2 costs increased from $1,800 to $1,900 (normal). S3 storage costs increased from $200 to $3,400 (17x increase). RDS costs stable at $800. Data transfer costs increased from $400 to $500.",
        },
        {
          type: "log",
          content:
            "S3 access logs show a new bucket 'temp-data-export-20260215' was created by IAM user 'dev-intern' with 8 TB of uncompressed CSV files. The bucket has S3 Standard storage class, versioning enabled, and no lifecycle policy. The same data exists in the RDS database.",
        },
        {
          type: "config",
          content:
            "The 'dev-intern' IAM user has the 'AmazonS3FullAccess' managed policy attached directly. No S3 bucket policies restrict creation. No AWS Budgets or billing alerts are configured for the account.",
        },
      ],
      classifications: [
        {
          id: "co1-c1",
          label: "Cryptomining Attack",
          description: "Unauthorized access spawning compute resources for cryptocurrency mining",
        },
        {
          id: "co1-c2",
          label: "Uncontrolled Data Duplication",
          description: "An authorized user created a large data export without storage management policies",
        },
        {
          id: "co1-c3",
          label: "DDoS Attack Costs",
          description: "External attack generating excessive data transfer and compute charges",
        },
      ],
      correctClassificationId: "co1-c2",
      remediations: [
        {
          id: "co1-rem1",
          label: "Delete the temp bucket, restrict IAM permissions, configure budgets and alerts",
          description: "Remove the duplicated data, apply least-privilege IAM, and set up cost monitoring",
        },
        {
          id: "co1-rem2",
          label: "Block the dev-intern account and report a security incident",
          description: "Disable the IAM user and escalate to the security team",
        },
        {
          id: "co1-rem3",
          label: "Enable AWS Shield Advanced for DDoS protection",
          description: "Subscribe to the advanced DDoS protection service to prevent future attacks",
        },
      ],
      correctRemediationId: "co1-rem1",
      rationales: [
        {
          id: "co1-r1",
          text: "The S3 access logs clearly show an authorized IAM user created the bucket with legitimate data. This is not a security breach but a permissions and governance failure. The user had overly broad S3 access with no cost guardrails.",
        },
        {
          id: "co1-r2",
          text: "Deleting the temp bucket removes the cost source immediately. Restricting IAM to least-privilege prevents recurrence. AWS Budgets with alerts catch future anomalies before they reach the finance team as a surprise.",
        },
      ],
      correctRationaleId: "co1-r2",
      feedback: {
        perfect:
          "Correct triage. You identified the data duplication root cause and applied targeted remediation: remove the cost source, restrict permissions, and add monitoring.",
        partial:
          "You identified part of the issue but the remediation either goes too far (treating it as a security incident) or does not address the underlying governance gap.",
        wrong: "The evidence clearly shows an authorized user action, not an attack. Misclassifying the root cause leads to the wrong remediation.",
      },
    },
    {
      id: "co-scenario-2",
      type: "triage-remediate",
      title: "Azure Dev/Test Environment Running 24/7",
      description:
        "A development team's Azure subscription costs $8,000/month when the budget is $3,000. The team has 6 developers who work standard business hours (9 AM - 5 PM, Monday through Friday). Management wants costs reduced to budget without losing any development environments.",
      evidence: [
        {
          type: "billing",
          content:
            "Azure Cost Analysis shows: 12 VMs running 24/7 (2 per developer) at $5,200/month. 6 Azure SQL databases at $1,800/month. Storage at $400/month. Networking at $600/month. VMs are D4s_v5 size (4 vCPU, 16 GB RAM each).",
        },
        {
          type: "metrics",
          content:
            "Azure Monitor shows average VM CPU utilization is 8% outside business hours and 45% during business hours. VMs are idle from 6 PM Friday to 9 AM Monday (62 hours/week). SQL databases show near-zero DTU usage outside business hours. No auto-shutdown policies are configured.",
        },
        {
          type: "config",
          content:
            "All VMs use Pay-As-You-Go pricing. No Reserved Instances or Savings Plans are purchased. No Azure DevTest Labs or auto-shutdown schedules are configured. Each developer has 2 VMs: one for development and one for testing. All VMs run Windows Server with Visual Studio.",
        },
      ],
      classifications: [
        {
          id: "co2-c1",
          label: "Overprovisioned VM Sizes",
          description: "VMs are larger than needed for the development workload",
        },
        {
          id: "co2-c2",
          label: "Idle Resource Waste",
          description: "Development resources running 24/7 when only used during business hours",
        },
        {
          id: "co2-c3",
          label: "Excessive Database Licensing",
          description: "SQL databases are on the wrong pricing tier",
        },
      ],
      correctClassificationId: "co2-c2",
      remediations: [
        {
          id: "co2-rem1",
          label: "Downgrade all VMs to B2s (2 vCPU, 4 GB) to reduce per-hour costs",
          description: "Reduce VM sizes to the smallest available to cut compute costs",
        },
        {
          id: "co2-rem2",
          label: "Implement auto-shutdown at 6 PM and auto-start at 9 AM weekdays, plus apply Azure DevTest pricing",
          description: "Eliminate idle hours and leverage discounted dev/test licensing for Windows VMs",
        },
        {
          id: "co2-rem3",
          label: "Delete half the VMs and have developers share resources",
          description: "Reduce the VM count by 50% to cut costs in half",
        },
      ],
      correctRemediationId: "co2-rem2",
      rationales: [
        {
          id: "co2-r1",
          text: "The VMs run 168 hours/week but are only used 40 hours (24%). Auto-shutdown during nights and weekends eliminates 76% of idle compute hours. Azure DevTest pricing removes the Windows Server license cost from dev VMs, providing an additional 40% discount on the running hours.",
        },
        {
          id: "co2-r2",
          text: "Combined auto-shutdown and DevTest pricing would reduce VM costs from $5,200 to approximately $1,500/month, bringing the total subscription well under the $3,000 budget without reducing VM sizes or developer productivity.",
        },
      ],
      correctRationaleId: "co2-r1",
      feedback: {
        perfect:
          "Excellent. You correctly identified idle resource waste as the primary cost driver and applied the two most impactful remediations: time-based scheduling and DevTest licensing.",
        partial:
          "You identified a contributing factor but the primary remediation missed the biggest cost reduction opportunity from eliminating 76% of idle compute hours.",
        wrong: "That classification misses the dominant cost factor. Idle hours are the primary waste, not VM sizing or database pricing.",
      },
    },
    {
      id: "co-scenario-3",
      type: "triage-remediate",
      title: "Data Transfer Costs Exceeding Compute",
      description:
        "A media streaming startup notices their AWS data transfer bill is $4,200/month, exceeding their EC2 compute costs of $2,800. The CEO asks you to investigate why bandwidth costs are so high for a small startup with only 10,000 active users.",
      evidence: [
        {
          type: "billing",
          content:
            "AWS Cost Explorer data transfer breakdown: EC2 to Internet (outbound): $3,800/month (38 TB outbound). Inter-AZ data transfer: $350/month. S3 to Internet: $50/month. The application serves 720p video streams directly from EC2 instances.",
        },
        {
          type: "architecture",
          content:
            "The application architecture shows: Users connect directly to EC2 instances via public IPs. Each EC2 instance transcodes video on-the-fly and streams to users. No CDN or caching layer exists. Video files are stored on EBS volumes attached to EC2 instances. Average video size is 500 MB, and each active user streams an average of 4 videos per month.",
        },
        {
          type: "log",
          content:
            "CloudWatch metrics show that 60% of video streams are for the top 50 most popular videos (repeat content). EC2 instances in us-east-1 serve users globally, including Europe and Asia, resulting in higher latency and no edge optimization.",
        },
      ],
      classifications: [
        {
          id: "co3-c1",
          label: "Missing CDN and Edge Caching",
          description: "Popular content served repeatedly from origin servers without caching at the edge",
        },
        {
          id: "co3-c2",
          label: "Oversized EC2 Instances",
          description: "Compute instances are larger than needed for the streaming workload",
        },
        {
          id: "co3-c3",
          label: "Data Exfiltration",
          description: "Unauthorized data transfer from compromised EC2 instances",
        },
      ],
      correctClassificationId: "co3-c1",
      remediations: [
        {
          id: "co3-rem1",
          label: "Deploy CloudFront CDN with S3 origin for video content",
          description: "Move videos to S3, serve through CloudFront edge locations to cache popular content and reduce origin transfer",
        },
        {
          id: "co3-rem2",
          label: "Upgrade EC2 instances to larger sizes with more network bandwidth",
          description: "Use network-optimized instances to handle the streaming traffic more efficiently",
        },
        {
          id: "co3-rem3",
          label: "Restrict outbound traffic with security group rules",
          description: "Limit egress bandwidth at the security group level to cap data transfer costs",
        },
      ],
      correctRemediationId: "co3-rem1",
      rationales: [
        {
          id: "co3-r1",
          text: "60% of streams are for the top 50 videos, meaning the same content is transferred from EC2 to the internet repeatedly. A CDN caches popular content at edge locations, eliminating redundant origin transfers and reducing the 38 TB outbound to a fraction of that.",
        },
        {
          id: "co3-r2",
          text: "CloudFront also provides edge locations globally, improving latency for European and Asian users. S3 as the origin eliminates EBS storage costs and EC2 transcoding overhead for pre-transcoded content. Expected cost reduction is 60-70%.",
        },
      ],
      correctRationaleId: "co3-r1",
      feedback: {
        perfect:
          "Correct. CDN deployment is the standard solution for high data transfer costs from repeated content delivery. Caching popular videos at edge locations dramatically reduces origin bandwidth.",
        partial:
          "You identified a real issue but the proposed fix addresses symptoms rather than the architectural root cause of serving repeated content without caching.",
        wrong: "The evidence shows legitimate streaming traffic, not a security incident or a compute sizing issue. The architecture is missing a caching layer.",
      },
    },
  ],
  hints: [
    "When investigating cloud cost spikes, start with the billing breakdown to identify which service category increased the most.",
    "Idle resources running outside business hours are one of the most common causes of cloud budget overruns in development environments.",
    "High data transfer costs often indicate missing CDN or caching layers, especially when the same content is served repeatedly.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Cloud cost optimization (FinOps) is one of the fastest-growing specializations in IT. Organizations routinely overspend on cloud by 30-40%, creating strong demand for professionals who can identify and eliminate waste. This skill directly impacts a company's bottom line and is highly valued at all career levels.",
  toolRelevance: [
    "AWS Cost Explorer",
    "Azure Cost Management",
    "AWS Budgets",
    "CloudWatch Billing Alerts",
    "AWS CloudFront",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
