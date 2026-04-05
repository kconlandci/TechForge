import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "cloud-compliance-review",
  version: 1,
  title: "Cloud Compliance and Governance Assessment",
  tier: "advanced",
  track: "virtualization-cloud",
  difficulty: "challenging",
  accessLevel: "premium",
  tags: ["cloud", "compliance", "governance", "security", "audit", "HIPAA", "GDPR", "CompTIA-A+"],
  description:
    "Assess cloud environments for compliance violations, classify the severity of findings, and apply the correct remediation to meet regulatory and organizational security standards.",
  estimatedMinutes: 22,
  learningObjectives: [
    "Identify common cloud compliance violations across major frameworks (HIPAA, GDPR, PCI DSS)",
    "Classify compliance findings by severity and business impact",
    "Apply targeted remediations that address compliance gaps without disrupting services",
    "Understand the shared responsibility model for compliance in cloud environments",
  ],
  sortOrder: 414,
  status: "published",
  prerequisites: [],
  rendererType: "triage-remediate",
  scenarios: [
    {
      id: "cr-scenario-1",
      type: "triage-remediate",
      title: "Unencrypted Patient Data in S3",
      description:
        "During a quarterly security audit of a healthcare company's AWS environment, the compliance team discovered potential HIPAA violations related to patient data storage and access controls. You need to assess the findings and implement remediation.",
      evidence: [
        {
          type: "audit-finding",
          content:
            "AWS Config rule 's3-bucket-server-side-encryption-enabled' shows NONCOMPLIANT for bucket 'patient-records-prod'. The bucket contains 50,000 PDF files with patient lab results, insurance claims, and medical histories. Bucket policy allows s3:GetObject without any condition keys. No S3 access logging is enabled.",
        },
        {
          type: "access-log",
          content:
            "CloudTrail logs show 15 IAM users have s3:* permissions on the patient-records-prod bucket. 8 of these users are in the marketing department and have no legitimate need to access patient data. One marketing user downloaded 200 files last week.",
        },
        {
          type: "config",
          content:
            "S3 bucket settings: Versioning: Disabled. Server-Side Encryption: None. Block Public Access: Enabled (only non-public setting correctly configured). Access logging: Disabled. Object Lock: Disabled. No S3 Lifecycle Policy configured.",
        },
      ],
      classifications: [
        {
          id: "cr1-c1",
          label: "Critical HIPAA Violation - Unencrypted PHI with Excessive Access",
          description: "Protected health information is stored without encryption and accessible by unauthorized personnel, violating HIPAA Security Rule requirements for encryption and access controls",
        },
        {
          id: "cr1-c2",
          label: "Low Risk - Missing Best Practices",
          description: "The bucket is not publicly accessible so the data is adequately protected by AWS's internal security",
        },
        {
          id: "cr1-c3",
          label: "Moderate - Logging Gap Only",
          description: "The main issue is missing access logs which limits audit capability",
        },
      ],
      correctClassificationId: "cr1-c1",
      remediations: [
        {
          id: "cr1-rem1",
          label: "Enable SSE-KMS encryption, implement least-privilege IAM policies, enable access logging and versioning",
          description: "Apply AES-256 encryption via KMS, restrict bucket access to healthcare staff only, enable S3 access logging for audit trail, and enable versioning to protect against accidental deletion",
        },
        {
          id: "cr1-rem2",
          label: "Enable default SSE-S3 encryption only",
          description: "Turn on server-side encryption with Amazon S3 managed keys for all new objects",
        },
        {
          id: "cr1-rem3",
          label: "Move all files to a new encrypted bucket and delete the old one",
          description: "Create a new bucket with encryption enabled and migrate all patient files to it",
        },
      ],
      correctRemediationId: "cr1-rem1",
      rationales: [
        {
          id: "cr1-r1",
          text: "HIPAA requires encryption of PHI at rest (Security Rule 164.312(a)(2)(iv)), access controls limiting PHI to authorized personnel (Security Rule 164.312(a)(1)), and audit controls recording access to PHI (Security Rule 164.312(b)). All three controls are missing simultaneously.",
        },
        {
          id: "cr1-r2",
          text: "KMS encryption provides key rotation and audit trail capabilities required by HIPAA. Least-privilege IAM removes the 8 marketing users' access immediately. S3 access logging creates the audit trail for the unauthorized downloads. Versioning protects against both accidental and malicious deletion of medical records.",
        },
      ],
      correctRationaleId: "cr1-r2",
      feedback: {
        perfect:
          "Excellent compliance remediation. You addressed all three HIPAA requirements simultaneously: encryption at rest, least-privilege access controls, and audit logging.",
        partial:
          "Encryption alone does not address the access control violation. Marketing users can still download patient data even if it is encrypted, because they have IAM permissions.",
        wrong: "This is not a low-risk finding. Unencrypted PHI with excessive access is a reportable HIPAA violation that can result in fines up to $1.5 million per violation category.",
      },
    },
    {
      id: "cr-scenario-2",
      type: "triage-remediate",
      title: "GDPR Data Processing Violation in Azure",
      description:
        "A European SaaS company received a customer complaint that their personal data was being processed in a US Azure region despite their account settings specifying EU-only data processing. The legal team is concerned about a potential GDPR violation.",
      evidence: [
        {
          type: "complaint",
          content:
            "Customer (EU citizen) reported: 'I found in your privacy dashboard that my data was processed by servers in Virginia, USA. I specifically opted for EU-only processing when I signed up. This violates GDPR Article 44 on international data transfers.' The customer has threatened to file a complaint with their national data protection authority.",
        },
        {
          type: "architecture",
          content:
            "Investigation reveals: Primary Azure SQL Database is in West Europe (Netherlands). Azure Cognitive Services (AI text analysis) is configured to use US East for processing because certain AI models were only available in that region at deployment time. Customer text data is sent to US East for sentiment analysis and returned to West Europe. This affects all EU customers who use the analytics feature.",
        },
        {
          type: "config",
          content:
            "Azure Policy review shows: No Azure Policy restricts resource deployment to EU regions. The engineering team was unaware of the GDPR requirement when selecting the Cognitive Services region. No Data Processing Agreement (DPA) or Standard Contractual Clauses (SCCs) are in place for the US data transfer. The EU-only processing option in the user interface does not actually enforce region restrictions in the backend.",
        },
      ],
      classifications: [
        {
          id: "cr2-c1",
          label: "Critical GDPR Violation - Unauthorized International Data Transfer",
          description: "Personal data of EU citizens is transferred to the US without adequate safeguards (SCCs, adequacy decision, or binding corporate rules) as required by GDPR Articles 44-49",
        },
        {
          id: "cr2-c2",
          label: "Minor Technical Configuration Issue",
          description: "The wrong Azure region was selected but data is still within Microsoft's network so it is adequately protected",
        },
        {
          id: "cr2-c3",
          label: "Customer Misunderstanding",
          description: "The customer does not understand how cloud data processing works and the complaint is unfounded",
        },
      ],
      correctClassificationId: "cr2-c1",
      remediations: [
        {
          id: "cr2-rem1",
          label: "Migrate Cognitive Services to EU West, deploy Azure Policy to block non-EU resource creation, fix the UI toggle to enforce backend restrictions",
          description: "Move the AI processing to an EU region, enforce region restrictions via policy, and ensure the user-facing EU-only toggle actually controls backend data processing",
        },
        {
          id: "cr2-rem2",
          label: "Add a disclaimer to the terms of service stating data may be processed outside the EU",
          description: "Update the legal terms to disclose that some processing occurs in the US",
        },
        {
          id: "cr2-rem3",
          label: "Disable the analytics feature for EU customers only",
          description: "Remove access to the sentiment analysis feature for customers who selected EU-only processing",
        },
      ],
      correctRemediationId: "cr2-rem1",
      rationales: [
        {
          id: "cr2-r1",
          text: "GDPR Article 44 prohibits transferring personal data outside the EU without appropriate safeguards. No SCCs, adequacy decisions, or binding corporate rules are in place. The customer's complaint is legally valid and could trigger a data protection authority investigation.",
        },
        {
          id: "cr2-r2",
          text: "Migrating Cognitive Services to EU West stops the unauthorized transfer immediately. Azure Policy enforcement prevents future non-EU deployments by blocking resource creation outside approved regions. Fixing the UI toggle ensures the user's data residency choice is actually enforced end-to-end.",
        },
      ],
      correctRationaleId: "cr2-r2",
      feedback: {
        perfect:
          "Correct. You addressed the immediate violation (migrate to EU), the systemic gap (Azure Policy enforcement), and the root cause (UI toggle not connected to backend).",
        partial:
          "That approach addresses part of the problem but either leaves the international transfer in place or removes functionality instead of fixing the underlying architecture.",
        wrong: "GDPR data transfer requirements cannot be satisfied by disclaimers or by dismissing the customer complaint. This is a real compliance violation.",
      },
    },
    {
      id: "cr-scenario-3",
      type: "triage-remediate",
      title: "Cloud Shared Responsibility Gap",
      description:
        "A company passed their PCI DSS audit for the on-premises payment processing system but then migrated the same system to AWS EC2 without updating their compliance controls. A follow-up audit found new compliance gaps that did not exist on-premises.",
      evidence: [
        {
          type: "audit-report",
          content:
            "PCI DSS auditor findings for the AWS-hosted payment system: Finding 1: EC2 instances have no host-based intrusion detection system (HIDS) installed (PCI DSS Req 11.4). Finding 2: No file integrity monitoring (FIM) on payment application servers (PCI DSS Req 11.5). Finding 3: OS security patches are 45 days behind (PCI DSS Req 6.2 requires patches within 30 days). Note: These controls were handled by the on-premises Tripwire and WSUS infrastructure that was not migrated.",
        },
        {
          type: "architecture",
          content:
            "The team assumed AWS handles all security for EC2 instances since 'it is in the cloud.' The shared responsibility model was not reviewed during migration planning. AWS manages the hypervisor, physical security, and network infrastructure. The customer is responsible for OS patching, application security, host-level firewall, and monitoring on EC2 instances.",
        },
        {
          type: "config",
          content:
            "EC2 instances: Amazon Linux 2 with no third-party security agents installed. AWS Systems Manager Patch Manager: Not configured. Amazon Inspector: Not enabled. AWS CloudTrail: Enabled (only AWS-managed control in place). No equivalent of on-premises Tripwire for FIM or IDS. Security group rules are configured correctly.",
        },
      ],
      classifications: [
        {
          id: "cr3-c1",
          label: "Shared Responsibility Misunderstanding",
          description: "The migration team assumed AWS handles customer-side security controls that remain the customer's responsibility under the shared responsibility model",
        },
        {
          id: "cr3-c2",
          label: "AWS Service Deficiency",
          description: "AWS should be providing these security controls as part of the EC2 service",
        },
        {
          id: "cr3-c3",
          label: "Minor Compliance Delay",
          description: "The controls will eventually be in place once the migration is fully complete",
        },
      ],
      correctClassificationId: "cr3-c1",
      remediations: [
        {
          id: "cr3-rem1",
          label: "Deploy Amazon Inspector for vulnerability scanning, AWS Systems Manager for patch management, and OSSEC for HIDS/FIM",
          description: "Install cloud-native equivalents for each missing control: Inspector replaces vulnerability scanning, SSM Patch Manager replaces WSUS, and OSSEC agent provides IDS and FIM equivalent to Tripwire",
        },
        {
          id: "cr3-rem2",
          label: "Open an AWS support ticket requesting them to install security agents on the EC2 instances",
          description: "Ask AWS to handle the security controls since the infrastructure is in their cloud",
        },
        {
          id: "cr3-rem3",
          label: "Move back to on-premises where the existing security controls are still in place",
          description: "Reverse the migration and return to the on-premises environment that passed the PCI DSS audit",
        },
      ],
      correctRemediationId: "cr3-rem1",
      rationales: [
        {
          id: "cr3-r1",
          text: "Under the AWS shared responsibility model, the customer is responsible for 'security IN the cloud' including OS patching, application security, host-based monitoring, and data encryption on EC2 instances. AWS is responsible for 'security OF the cloud' including the physical data center, hypervisor, and network infrastructure.",
        },
        {
          id: "cr3-r2",
          text: "Amazon Inspector provides continuous vulnerability scanning equivalent to the on-premises scanner. SSM Patch Manager automates OS patching with configurable compliance windows (meeting the 30-day PCI requirement). OSSEC provides both intrusion detection and file integrity monitoring, replacing Tripwire. All three can be deployed without downtime.",
        },
      ],
      correctRationaleId: "cr3-r2",
      feedback: {
        perfect:
          "Excellent understanding of the shared responsibility model. You identified the customer-side control gaps and deployed cloud-native equivalents for each missing PCI DSS requirement.",
        partial:
          "Moving back to on-premises works but abandons the cloud migration benefits. The correct approach is to implement the customer-side controls in the cloud environment.",
        wrong: "AWS does not manage customer OS-level security on EC2 instances. The shared responsibility model clearly delineates this boundary.",
      },
    },
  ],
  hints: [
    "The cloud shared responsibility model means the cloud provider secures the infrastructure, but the customer secures their data, applications, and OS configurations.",
    "HIPAA, GDPR, and PCI DSS all have specific requirements for encryption, access controls, and audit logging that must be implemented regardless of whether data is on-premises or in the cloud.",
    "When migrating to the cloud, every on-premises security control must have a cloud equivalent. Do not assume the cloud provider handles controls that were previously your responsibility.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Cloud compliance is a rapidly growing field with significant career opportunities. Companies face millions in fines for HIPAA, GDPR, and PCI DSS violations. Professionals who understand cloud compliance frameworks and the shared responsibility model are in extremely high demand across healthcare, finance, and technology sectors.",
  toolRelevance: [
    "AWS Config",
    "Azure Policy",
    "AWS Security Hub",
    "Amazon Inspector",
    "AWS Systems Manager Patch Manager",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
