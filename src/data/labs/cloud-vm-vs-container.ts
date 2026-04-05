import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "cloud-vm-vs-container",
  version: 1,
  title: "VM vs Container: Choose the Right Approach",
  tier: "intermediate",
  track: "virtualization-cloud",
  difficulty: "moderate",
  accessLevel: "free",
  tags: ["vm", "container", "docker", "virtualization", "cloud", "CompTIA-A+"],
  description:
    "Investigate workload requirements and decide whether a traditional virtual machine or a container-based deployment is the best fit for each scenario.",
  estimatedMinutes: 18,
  learningObjectives: [
    "Compare the architecture of VMs and containers at the OS and kernel level",
    "Identify workloads best suited for VMs versus containers",
    "Evaluate startup time, resource overhead, and isolation tradeoffs",
    "Determine when hybrid approaches using both VMs and containers are appropriate",
  ],
  sortOrder: 404,
  status: "published",
  prerequisites: [],
  rendererType: "investigate-decide",
  scenarios: [
    {
      id: "vc-scenario-1",
      type: "investigate-decide",
      title: "Microservice API Deployment",
      objective:
        "Determine the best deployment model for a new microservices API platform that needs to scale individual services independently.",
      investigationData: [
        {
          id: "vc1-arch",
          label: "Architecture Requirements",
          content:
            "The platform consists of 12 stateless Node.js microservices communicating via REST APIs. Each service is independently versioned and deployed. Peak traffic causes 10x scaling on 3 services while others stay at baseline. Average response time target is under 100ms. Services need to start in under 5 seconds during scale-out events.",
          isCritical: true,
        },
        {
          id: "vc1-infra",
          label: "Current Infrastructure",
          content:
            "The team currently runs all services on 3 large VMs (8 vCPU, 32 GB each) with PM2 process manager. Average VM utilization is 15% except during peak when it hits 85%. New service deployments require 20-minute VM provisioning. The team has Docker experience from development environments.",
        },
        {
          id: "vc1-budget",
          label: "Budget and Constraints",
          content:
            "Monthly infrastructure budget is $2,000. The team cannot justify paying for idle capacity during off-peak hours. Management wants deployment frequency to increase from weekly to multiple times per day.",
        },
      ],
      actions: [
        {
          id: "vc1-vms",
          label: "Keep all services on VMs with auto-scaling groups",
          color: "orange",
        },
        {
          id: "vc1-containers",
          label: "Containerize all services and deploy on Amazon ECS with Fargate",
          color: "green",
        },
        {
          id: "vc1-serverless",
          label: "Rewrite all services as serverless Lambda functions",
          color: "blue",
        },
        {
          id: "vc1-bare-metal",
          label: "Move to dedicated bare metal servers for maximum performance",
          color: "red",
        },
      ],
      correctActionId: "vc1-containers",
      rationales: [
        {
          id: "vc1-r1",
          text: "VMs have 20-minute provisioning time, which cannot meet the 5-second startup requirement for rapid scale-out. Auto-scaling groups help but VM boot time is the bottleneck.",
        },
        {
          id: "vc1-r2",
          text: "Containers start in seconds, scale individual services independently, and eliminate wasted capacity on idle VMs. ECS with Fargate charges only for running containers, aligning cost with actual usage. The team already has Docker experience.",
        },
        {
          id: "vc1-r3",
          text: "Rewriting 12 microservices as Lambda functions requires significant refactoring for cold starts, execution time limits, and stateless constraints. This is unnecessary when containers already fit the architecture.",
        },
        {
          id: "vc1-r4",
          text: "Bare metal provides no elasticity for the 10x scaling requirement and would waste budget during off-peak hours with fixed capacity.",
        },
      ],
      correctRationaleId: "vc1-r2",
      feedback: {
        perfect:
          "Correct. Containers are ideal for stateless microservices that need rapid scaling, independent deployment, and efficient resource utilization.",
        partial:
          "That approach addresses some requirements but misses key needs around startup time, scaling granularity, or cost optimization.",
        wrong: "That deployment model cannot meet the scaling, startup time, or cost requirements for this microservices platform.",
      },
    },
    {
      id: "vc-scenario-2",
      type: "investigate-decide",
      title: "Legacy Windows Application Hosting",
      objective:
        "Decide the best virtualization approach for hosting a legacy Windows desktop application in the cloud for remote workers.",
      investigationData: [
        {
          id: "vc2-app",
          label: "Application Details",
          content:
            "The application is a 15-year-old .NET Framework 4.5 Windows desktop app that reads/writes to local registry keys, uses COM+ components, and requires specific Windows DLL versions. It connects to a SQL Server database over a trusted Windows domain connection. The application has no web interface and must run as a desktop application.",
          isCritical: true,
        },
        {
          id: "vc2-users",
          label: "User Requirements",
          content:
            "45 remote workers need to access this application daily. They currently use it on office PCs but the company moved to permanent remote work. Users need their own isolated sessions that persist between logins. RDP or similar remote desktop protocol is the expected access method.",
        },
        {
          id: "vc2-security",
          label: "Security and Compliance",
          content:
            "The application processes financial data subject to SOX compliance. Each user session must be fully isolated. Audit logs must show per-user activity. The security team requires full OS-level patching control.",
        },
      ],
      actions: [
        {
          id: "vc2-containers",
          label: "Run the application in Windows containers on Azure Container Instances",
          color: "orange",
        },
        {
          id: "vc2-vdi",
          label: "Deploy Azure Virtual Desktop (AVD) with Windows VMs and per-user session hosts",
          color: "green",
        },
        {
          id: "vc2-web-app",
          label: "Wrap the application in Electron and deploy as a web application",
          color: "red",
        },
        {
          id: "vc2-citrix",
          label: "Install Citrix on a single shared VM and publish the application",
          color: "blue",
        },
      ],
      correctActionId: "vc2-vdi",
      rationales: [
        {
          id: "vc2-r1",
          text: "Windows containers have limited support for GUI applications, COM+ components, and registry-dependent legacy apps. Container isolation does not match the per-user session isolation and SOX audit trail requirements.",
        },
        {
          id: "vc2-r2",
          text: "Azure Virtual Desktop provides full Windows VMs with RDP access, per-user session isolation, domain-joined OS for trusted SQL connections, and complete OS patching control. This is the standard solution for legacy desktop app remoting with compliance requirements.",
        },
        {
          id: "vc2-r3",
          text: "A 15-year-old .NET Framework 4.5 desktop app with COM+ and registry dependencies cannot be wrapped in Electron. This would require a complete rewrite.",
        },
        {
          id: "vc2-r4",
          text: "A single shared VM creates a single point of failure and makes per-user isolation and SOX audit trails much harder to enforce. If the VM goes down, all 45 users lose access simultaneously.",
        },
      ],
      correctRationaleId: "vc2-r2",
      feedback: {
        perfect:
          "Excellent. VMs with full desktop environments are the correct choice for legacy Windows applications that depend on OS-level components, registry access, and domain connectivity.",
        partial:
          "That approach could partially work but does not fully address the legacy dependencies, user isolation, or compliance requirements.",
        wrong: "That technology cannot support the legacy application's OS-level dependencies and desktop environment requirements.",
      },
    },
    {
      id: "vc-scenario-3",
      type: "investigate-decide",
      title: "CI/CD Build Environment",
      objective:
        "Determine the best approach for running CI/CD build agents that compile, test, and package applications for multiple technology stacks.",
      investigationData: [
        {
          id: "vc3-builds",
          label: "Build Requirements",
          content:
            "The team builds applications in Java 17, Python 3.11, Node.js 20, and Go 1.21. Each build must run in a clean environment to prevent dependency conflicts. Builds take 3-10 minutes. The team runs 50-80 builds per day during business hours with zero builds overnight. Build artifacts must not persist between runs.",
          isCritical: true,
        },
        {
          id: "vc3-current",
          label: "Current Setup",
          content:
            "Currently using 4 dedicated VMs as build agents (one per language). VMs accumulate cached dependencies and stale files over time, causing intermittent build failures that are solved by rebuilding the VMs from scratch quarterly. Total monthly cost is $600 for VMs running 24/7.",
        },
        {
          id: "vc3-team",
          label: "Team Capabilities",
          content:
            "The DevOps engineer maintains Dockerfiles for all four language stacks used in development. Jenkins is the CI/CD tool with existing Docker pipeline plugins. The team wants builds to start within 30 seconds of a code push.",
        },
      ],
      actions: [
        {
          id: "vc3-more-vms",
          label: "Add more dedicated VMs and rebuild them weekly to prevent cache issues",
          color: "red",
        },
        {
          id: "vc3-docker-agents",
          label: "Run ephemeral Docker container build agents that are destroyed after each build",
          color: "green",
        },
        {
          id: "vc3-single-vm",
          label: "Consolidate to a single powerful VM with all languages installed",
          color: "orange",
        },
        {
          id: "vc3-cloud-build",
          label: "Migrate all builds to a managed cloud build service like AWS CodeBuild",
          color: "blue",
        },
      ],
      correctActionId: "vc3-docker-agents",
      rationales: [
        {
          id: "vc3-r1",
          text: "More VMs increase cost without solving the root cause. Weekly rebuilds still allow cache corruption to occur and cause failures throughout the week.",
        },
        {
          id: "vc3-r2",
          text: "Ephemeral Docker containers start in seconds (meeting the 30-second requirement), guarantee a clean environment every build (eliminating cache corruption), and can be scaled to handle parallel builds. Jenkins Docker plugins make this straightforward, and existing Dockerfiles can be reused directly.",
        },
        {
          id: "vc3-r3",
          text: "A single VM with all languages installed creates more dependency conflicts, not fewer. It is also a single point of failure that blocks all builds when it needs maintenance.",
        },
        {
          id: "vc3-r4",
          text: "AWS CodeBuild is a valid option but requires migrating from Jenkins, rewriting build configurations, and adds vendor lock-in. Docker containers solve the same problems while preserving the existing Jenkins investment.",
        },
      ],
      correctRationaleId: "vc3-r2",
      feedback: {
        perfect:
          "Perfect. Ephemeral containers are the industry standard for CI/CD build agents because they guarantee clean environments, start instantly, and scale with demand.",
        partial:
          "That option has some merit but does not fully solve the clean environment requirement or adds unnecessary complexity and cost.",
        wrong: "That approach worsens the existing problems or introduces new single points of failure.",
      },
    },
  ],
  hints: [
    "Consider whether the workload needs a full OS environment or just an isolated application runtime. Legacy apps with OS dependencies usually need VMs.",
    "Container startup time is measured in seconds while VM startup is measured in minutes. This matters for auto-scaling and ephemeral workloads.",
    "Ephemeral (disposable) environments that reset after each use are a natural fit for containers.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "The VM vs container decision is one of the most common architecture questions in IT interviews. Employers want candidates who understand when each technology is appropriate, not just which is newer. Demonstrating this judgment sets you apart from candidates who default to one approach for everything.",
  toolRelevance: [
    "Docker Desktop",
    "Azure Virtual Desktop",
    "Amazon ECS / Fargate",
    "VMware vSphere",
    "Jenkins CI/CD",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
