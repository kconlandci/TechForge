import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "cloud-hybrid-setup",
  version: 1,
  title: "Hybrid Cloud Architecture Decisions",
  tier: "advanced",
  track: "virtualization-cloud",
  difficulty: "challenging",
  accessLevel: "premium",
  tags: ["hybrid-cloud", "architecture", "on-premises", "connectivity", "multi-cloud", "CompTIA-A+"],
  description:
    "Make architecture decisions for hybrid cloud environments, determining which workloads stay on-premises, which move to the cloud, and how to connect them securely.",
  estimatedMinutes: 20,
  learningObjectives: [
    "Evaluate workloads for hybrid cloud placement based on latency, compliance, and cost requirements",
    "Design secure connectivity between on-premises and cloud environments",
    "Plan identity and access management across hybrid environments",
    "Address data sovereignty and compliance requirements in hybrid architectures",
  ],
  sortOrder: 413,
  status: "published",
  prerequisites: [],
  rendererType: "action-rationale",
  scenarios: [
    {
      id: "hy-scenario-1",
      type: "action-rationale",
      title: "Manufacturing Plant IoT and Analytics",
      context:
        "A manufacturing plant has 500 IoT sensors on the production floor generating 2 GB of data per minute. The plant's MES (Manufacturing Execution System) requires sub-5ms response time to sensor data for real-time quality control. The engineering team also wants a cloud-based analytics dashboard for historical trend analysis accessible from corporate headquarters. The plant has a 100 Mbps internet connection with 40ms latency to the nearest Azure region.",
      actions: [
        {
          id: "hy1-all-cloud",
          label: "Send all sensor data directly to Azure IoT Hub for processing and analytics",
          color: "red",
        },
        {
          id: "hy1-hybrid-edge",
          label: "Process real-time data on-premises with Azure Stack Edge, replicate aggregated data to Azure for analytics",
          color: "green",
        },
        {
          id: "hy1-all-onprem",
          label: "Keep everything on-premises including the analytics dashboard",
          color: "orange",
        },
        {
          id: "hy1-two-clouds",
          label: "Use AWS for real-time processing and Azure for analytics",
          color: "blue",
        },
      ],
      correctActionId: "hy1-hybrid-edge",
      rationales: [
        {
          id: "hy1-r1",
          text: "Sending 2 GB/minute over a 100 Mbps link (12.5 MB/s capacity) is physically impossible without massive data loss. Even if bandwidth were sufficient, the 40ms WAN latency exceeds the 5ms real-time requirement.",
        },
        {
          id: "hy1-r2",
          text: "Azure Stack Edge processes sensor data locally with sub-5ms latency for real-time quality control. Aggregated historical data is replicated to Azure for the analytics dashboard, keeping bandwidth requirements manageable and enabling corporate access to trends without touching the production floor.",
        },
        {
          id: "hy1-r3",
          text: "Keeping analytics on-premises means corporate headquarters cannot easily access dashboards. It also wastes local compute resources on historical analysis that does not require real-time performance.",
        },
        {
          id: "hy1-r4",
          text: "Using two separate cloud providers for a single data pipeline adds complexity, cost, and data transfer charges without solving the fundamental latency and bandwidth constraints.",
        },
      ],
      correctRationaleId: "hy1-r2",
      feedback: {
        perfect:
          "Correct. Edge computing for real-time processing with cloud-based analytics is the standard hybrid pattern for IoT workloads with strict latency requirements.",
        partial:
          "That approach addresses one side of the requirement but ignores either the real-time latency constraint or the remote analytics access need.",
        wrong: "That architecture cannot meet the physical constraints of bandwidth and latency between the plant floor and the cloud.",
      },
    },
    {
      id: "hy-scenario-2",
      type: "action-rationale",
      title: "Financial Services Compliance Architecture",
      context:
        "A European bank must keep customer financial records within the EU per GDPR and national banking regulations. They want to use cloud services for their customer-facing mobile banking app, internal analytics, and employee productivity tools. Their current on-premises data center in Frankfurt has PCI DSS Level 1 certification. The bank has 2,000 employees across 15 EU branches. The CTO wants to maximize cloud adoption while maintaining full regulatory compliance.",
      actions: [
        {
          id: "hy2-all-cloud-us",
          label: "Migrate everything to AWS us-east-1 for the best service availability",
          color: "red",
        },
        {
          id: "hy2-hybrid-eu",
          label: "Use Azure EU West (Netherlands) for mobile app and analytics, keep core banking records on-premises in Frankfurt",
          color: "green",
        },
        {
          id: "hy2-all-onprem",
          label: "Keep everything on-premises to avoid any compliance risk",
          color: "orange",
        },
        {
          id: "hy2-all-cloud-eu",
          label: "Migrate everything including core banking to Azure EU West",
          color: "blue",
        },
      ],
      correctActionId: "hy2-hybrid-eu",
      rationales: [
        {
          id: "hy2-r1",
          text: "Storing EU customer financial data in US data centers violates GDPR data residency requirements. This would expose the bank to regulatory penalties of up to 4% of global revenue.",
        },
        {
          id: "hy2-r2",
          text: "The hybrid approach keeps regulated core banking records in the PCI DSS certified Frankfurt data center while leveraging EU-based cloud regions for the mobile app and analytics. This maximizes cloud benefits while maintaining compliance with both GDPR and banking regulations.",
        },
        {
          id: "hy2-r3",
          text: "Keeping everything on-premises forfeits the scalability and agility benefits the CTO wants for the mobile app and analytics. It also requires significant capital investment to scale on-premises infrastructure.",
        },
        {
          id: "hy2-r4",
          text: "Moving core banking records to cloud requires the cloud region to achieve PCI DSS Level 1 certification equivalent to the current on-premises environment. This is achievable but requires extensive compliance validation that adds months to the timeline.",
        },
      ],
      correctRationaleId: "hy2-r2",
      feedback: {
        perfect:
          "Excellent architecture decision. Keeping regulated data on-premises while cloud-enabling customer-facing and analytics workloads in EU regions balances compliance with modernization.",
        partial:
          "That approach either introduces compliance risk or unnecessarily limits the organization's ability to leverage cloud services.",
        wrong: "That option directly violates data residency regulations or ignores the CTO's goal of cloud adoption.",
      },
    },
    {
      id: "hy-scenario-3",
      type: "action-rationale",
      title: "Hybrid Identity and Access Management",
      context:
        "A company with 800 employees uses on-premises Active Directory for authentication. They are adopting Microsoft 365 and Azure for cloud workloads. Employees need single sign-on (SSO) across on-premises applications, Microsoft 365, and Azure resources. The security team requires that all authentication for on-premises resources stays within the corporate network, and MFA must be enforced for all cloud access. Password hash synchronization to the cloud is prohibited by security policy.",
      actions: [
        {
          id: "hy3-cloud-only",
          label: "Create separate cloud-only Azure AD accounts for all users",
          color: "red",
        },
        {
          id: "hy3-adfs",
          label: "Deploy AD FS (Active Directory Federation Services) with Azure AD Connect for federated SSO",
          color: "green",
        },
        {
          id: "hy3-password-hash",
          label: "Enable Azure AD Connect with password hash synchronization",
          color: "orange",
        },
        {
          id: "hy3-manual",
          label: "Have users manually log in separately to on-premises and cloud resources",
          color: "red",
        },
      ],
      correctActionId: "hy3-adfs",
      rationales: [
        {
          id: "hy3-r1",
          text: "Separate cloud accounts mean users have two sets of credentials to manage, eliminating SSO and increasing password fatigue and help desk calls for password resets.",
        },
        {
          id: "hy3-r2",
          text: "AD FS provides federated authentication where on-premises AD remains the identity authority. Authentication for on-premises resources stays within the corporate network. Azure AD Connect syncs identity (not passwords) to Azure AD, enabling SSO. Azure AD Conditional Access enforces MFA for cloud access.",
        },
        {
          id: "hy3-r3",
          text: "Password hash synchronization copies password hashes to Azure AD, which is explicitly prohibited by the security policy. Even though the hashes are encrypted, this violates the stated security requirement.",
        },
        {
          id: "hy3-r4",
          text: "Manual separate logins destroy the SSO requirement and create a poor user experience that increases support tickets and reduces productivity.",
        },
      ],
      correctRationaleId: "hy3-r2",
      feedback: {
        perfect:
          "Correct. AD FS federation provides SSO while keeping authentication authority on-premises and avoiding password hash synchronization to the cloud.",
        partial:
          "That approach provides some functionality but either violates the security policy or does not deliver the required single sign-on experience.",
        wrong: "That option either violates the password hash prohibition, eliminates SSO, or doubles the identity management burden.",
      },
    },
  ],
  hints: [
    "Hybrid cloud decisions should be driven by data residency requirements, latency constraints, and bandwidth limitations between locations.",
    "Edge computing solves the latency problem for IoT and real-time processing workloads that cannot tolerate WAN round-trip times.",
    "When security policies prohibit password synchronization to the cloud, federation services like AD FS provide SSO without sending credentials off-premises.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Hybrid cloud architecture is the reality for most enterprises. Very few organizations are 100% cloud or 100% on-premises. Professionals who can design hybrid solutions that balance compliance, performance, and cost are in the highest demand across cloud architecture and infrastructure roles.",
  toolRelevance: [
    "Azure Stack Edge",
    "AWS Outposts",
    "Azure AD Connect",
    "AD FS (Active Directory Federation Services)",
    "Azure ExpressRoute / AWS Direct Connect",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
