import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "cloud-iaas-vs-saas",
  version: 1,
  title: "Choose the Right Cloud Service Model",
  tier: "beginner",
  track: "virtualization-cloud",
  difficulty: "easy",
  accessLevel: "free",
  tags: ["cloud", "iaas", "paas", "saas", "service-models", "CompTIA-A+"],
  description:
    "Evaluate business requirements and choose the appropriate cloud service model (IaaS, PaaS, or SaaS) for different organizational scenarios.",
  estimatedMinutes: 12,
  learningObjectives: [
    "Distinguish between IaaS, PaaS, and SaaS cloud service models",
    "Match business requirements to the correct cloud service tier",
    "Identify the management responsibilities at each service level",
    "Evaluate cost implications of different cloud service models",
  ],
  sortOrder: 400,
  status: "published",
  prerequisites: [],
  rendererType: "action-rationale",
  scenarios: [
    {
      id: "iaas-scenario-1",
      type: "action-rationale",
      title: "Startup Needs Email and Productivity Tools",
      context:
        "A 15-person marketing startup needs email, document editing, spreadsheets, and video conferencing. They have no IT staff and want something running by end of week. Their budget is $15/user/month. They do not need custom server configurations or development environments.",
      actions: [
        {
          id: "s1-iaas",
          label: "Deploy IaaS VMs on AWS EC2 and install Exchange Server and LibreOffice",
          color: "orange",
        },
        {
          id: "s1-paas",
          label: "Use Azure App Service to build a custom productivity platform",
          color: "blue",
        },
        {
          id: "s1-saas",
          label: "Subscribe to Microsoft 365 Business Basic for the entire team",
          color: "green",
        },
        {
          id: "s1-onprem",
          label: "Purchase an on-premises server and install productivity software locally",
          color: "red",
        },
      ],
      correctActionId: "s1-saas",
      rationales: [
        {
          id: "s1-r1",
          text: "IaaS requires provisioning and managing VMs, installing and patching Exchange, and ongoing sysadmin work. A 15-person startup with no IT staff cannot maintain this.",
        },
        {
          id: "s1-r2",
          text: "SaaS delivers ready-to-use email, docs, and video conferencing with zero infrastructure management. Microsoft 365 fits the budget, requires no IT expertise, and can be deployed in hours.",
        },
        {
          id: "s1-r3",
          text: "PaaS is designed for developers building custom applications, not for consuming pre-built productivity tools.",
        },
        {
          id: "s1-r4",
          text: "On-premises infrastructure requires capital expenditure, physical space, and dedicated IT staff for maintenance and security patching.",
        },
      ],
      correctRationaleId: "s1-r2",
      feedback: {
        perfect:
          "Correct. SaaS is the ideal model when the business needs standard productivity tools without any infrastructure management overhead.",
        partial:
          "That approach would work technically but introduces unnecessary complexity and cost for a simple productivity use case.",
        wrong: "That model requires infrastructure expertise and capital investment this startup does not have.",
      },
    },
    {
      id: "iaas-scenario-2",
      type: "action-rationale",
      title: "Company Needs Custom Legacy Application Hosting",
      context:
        "A manufacturing company runs a legacy inventory management application built on Windows Server 2019 with SQL Server 2017. The application requires specific registry tweaks, custom DLL files, and a direct iSCSI connection to storage. Their data center lease expires in 90 days and they need to migrate the app without rewriting it.",
      actions: [
        {
          id: "s2-saas",
          label: "Find a SaaS inventory management replacement",
          color: "blue",
        },
        {
          id: "s2-iaas",
          label: "Provision IaaS VMs on Azure with Windows Server 2019 and replicate the exact server configuration",
          color: "green",
        },
        {
          id: "s2-paas",
          label: "Deploy the application to Azure App Service PaaS",
          color: "orange",
        },
        {
          id: "s2-container",
          label: "Containerize the legacy application in Docker and run it on Kubernetes",
          color: "red",
        },
      ],
      correctActionId: "s2-iaas",
      rationales: [
        {
          id: "s2-r1",
          text: "A SaaS replacement would require data migration, user retraining, and workflow changes in 90 days, which is extremely risky for a legacy system with custom integrations.",
        },
        {
          id: "s2-r2",
          text: "IaaS provides full control over the OS, registry, DLLs, and storage configuration. The existing server setup can be replicated exactly on cloud VMs, enabling a lift-and-shift migration within the 90-day deadline.",
        },
        {
          id: "s2-r3",
          text: "PaaS abstracts away the OS layer, so custom registry tweaks, DLL installations, and iSCSI storage configurations are not possible.",
        },
        {
          id: "s2-r4",
          text: "Containerizing a legacy Windows app with custom registry and DLL dependencies is complex and may break the application. This is not a realistic 90-day project.",
        },
      ],
      correctRationaleId: "s2-r2",
      feedback: {
        perfect:
          "Correct. IaaS gives you full OS-level control, making it the right choice for lift-and-shift migration of legacy applications with custom system-level configurations.",
        partial:
          "That option has merit long-term but does not meet the 90-day deadline or preserve the exact system configuration needed.",
        wrong: "That approach cannot accommodate the custom OS-level requirements of this legacy application.",
      },
    },
    {
      id: "iaas-scenario-3",
      type: "action-rationale",
      title: "Development Team Needs Application Hosting Platform",
      context:
        "A software development team of 8 developers is building a Node.js web application with a PostgreSQL database. They want to focus on writing code, not managing servers or patching operating systems. They need auto-scaling, built-in CI/CD integration, and managed database services. The team lead says: 'We should not be spending time on OS updates or load balancer configuration.'",
      actions: [
        {
          id: "s3-iaas",
          label: "Provision EC2 instances and manually install Node.js, PostgreSQL, and configure load balancers",
          color: "orange",
        },
        {
          id: "s3-paas",
          label: "Deploy to AWS Elastic Beanstalk with Amazon RDS for PostgreSQL",
          color: "green",
        },
        {
          id: "s3-saas",
          label: "Subscribe to a pre-built SaaS project management tool",
          color: "red",
        },
        {
          id: "s3-serverless",
          label: "Rewrite the entire application as serverless Lambda functions",
          color: "blue",
        },
      ],
      correctActionId: "s3-paas",
      rationales: [
        {
          id: "s3-r1",
          text: "IaaS with manual EC2 provisioning puts the team right back to managing servers, OS patches, and load balancer configs, exactly what they want to avoid.",
        },
        {
          id: "s3-r2",
          text: "PaaS like Elastic Beanstalk handles OS patching, auto-scaling, and load balancing automatically. Paired with RDS for managed PostgreSQL, the team can focus entirely on application code and deployment.",
        },
        {
          id: "s3-r3",
          text: "SaaS provides finished applications, not development platforms. The team is building their own application, not looking for an existing one.",
        },
        {
          id: "s3-r4",
          text: "Rewriting an entire Node.js app as serverless functions requires significant architectural changes and is not necessary when PaaS already solves the stated requirements.",
        },
      ],
      correctRationaleId: "s3-r2",
      feedback: {
        perfect:
          "Excellent. PaaS is designed for developers who want managed infrastructure with auto-scaling and CI/CD integration without OS-level management.",
        partial:
          "That approach could work but introduces more management overhead or unnecessary rework than the team needs.",
        wrong: "That option does not match the team's requirement to deploy and scale a custom application.",
      },
    },
  ],
  hints: [
    "Think about who manages what: SaaS manages everything, PaaS manages the platform, IaaS only manages hardware and virtualization.",
    "Match the level of control needed to the service model. Legacy apps with OS-level requirements need IaaS.",
    "Consider the team's expertise and timeline. Less IT staff and shorter deadlines favor higher-level service models.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Understanding cloud service models is fundamental for any IT role. Help desk technicians field questions about SaaS apps daily, while system administrators must decide between IaaS and PaaS for infrastructure projects. This knowledge directly maps to CompTIA A+ Domain 4 objectives.",
  toolRelevance: [
    "AWS Management Console",
    "Azure Portal",
    "Microsoft 365 Admin Center",
    "Google Cloud Console",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
