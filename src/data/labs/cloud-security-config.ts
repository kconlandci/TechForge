import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "cloud-security-config",
  version: 1,
  title: "Configure Cloud Security Groups and Firewalls",
  tier: "advanced",
  track: "virtualization-cloud",
  difficulty: "challenging",
  accessLevel: "premium",
  tags: ["cloud", "security", "firewall", "security-groups", "nsg", "zero-trust", "CompTIA-A+"],
  description:
    "Configure cloud security groups, network ACLs, and firewall rules to protect a multi-tier application following the principle of least privilege and defense-in-depth.",
  estimatedMinutes: 22,
  learningObjectives: [
    "Design security group rules following the principle of least privilege",
    "Implement defense-in-depth with multiple security layers",
    "Configure stateful vs stateless firewall rules in cloud environments",
    "Audit and remediate overly permissive security configurations",
  ],
  sortOrder: 410,
  status: "published",
  prerequisites: [],
  rendererType: "toggle-config",
  scenarios: [
    {
      id: "sc-scenario-1",
      type: "toggle-config",
      title: "Locking Down a Public-Facing Web Application",
      description:
        "A security audit found that an AWS web application has overly permissive security groups. The application has a public ALB, private EC2 application servers, and a private RDS MySQL database. The audit report states: 'All security groups allow 0.0.0.0/0 inbound on all ports. This is a critical finding.' You must remediate all findings.",
      targetSystem: "AWS Security Groups - Production VPC",
      items: [
        {
          id: "sc1-alb-sg",
          label: "ALB Security Group - Inbound Rules",
          detail: "Inbound rules for the public-facing Application Load Balancer",
          currentState: "Allow ALL traffic from 0.0.0.0/0",
          correctState: "Allow HTTPS (443) from 0.0.0.0/0 only",
          states: [
            "Allow ALL traffic from 0.0.0.0/0",
            "Allow HTTPS (443) from 0.0.0.0/0 only",
            "Allow HTTP (80) and HTTPS (443) from 0.0.0.0/0",
            "Allow HTTPS (443) from corporate IP range only",
          ],
          rationaleId: "sc1-r1",
        },
        {
          id: "sc1-app-sg",
          label: "App Server Security Group - Inbound Rules",
          detail: "Inbound rules for the EC2 application servers",
          currentState: "Allow ALL traffic from 0.0.0.0/0",
          correctState: "Allow port 8080 from ALB security group only",
          states: [
            "Allow ALL traffic from 0.0.0.0/0",
            "Allow port 8080 from ALB security group only",
            "Allow port 8080 from VPC CIDR (10.0.0.0/16)",
            "Allow HTTPS (443) from 0.0.0.0/0",
          ],
          rationaleId: "sc1-r2",
        },
        {
          id: "sc1-db-sg",
          label: "RDS Security Group - Inbound Rules",
          detail: "Inbound rules for the MySQL RDS database",
          currentState: "Allow ALL traffic from 0.0.0.0/0",
          correctState: "Allow MySQL (3306) from App Server security group only",
          states: [
            "Allow ALL traffic from 0.0.0.0/0",
            "Allow MySQL (3306) from App Server security group only",
            "Allow MySQL (3306) from VPC CIDR (10.0.0.0/16)",
            "Allow MySQL (3306) from 0.0.0.0/0",
          ],
          rationaleId: "sc1-r3",
        },
        {
          id: "sc1-ssh-access",
          label: "SSH Management Access",
          detail: "How administrators access EC2 instances for management",
          currentState: "SSH (22) open from 0.0.0.0/0 on all security groups",
          correctState: "SSH via AWS Systems Manager Session Manager (no inbound SSH port needed)",
          states: [
            "SSH (22) open from 0.0.0.0/0 on all security groups",
            "SSH (22) from corporate VPN IP range only",
            "SSH via AWS Systems Manager Session Manager (no inbound SSH port needed)",
            "SSH (22) from a bastion host security group only",
          ],
          rationaleId: "sc1-r4",
        },
      ],
      rationales: [
        {
          id: "sc1-r1",
          text: "The ALB only needs HTTPS (443) from the internet. HTTP should redirect to HTTPS at the ALB level, not by opening port 80. Restricting to corporate IPs would block customer access to a public application.",
        },
        {
          id: "sc1-r2",
          text: "App servers should only accept traffic from the ALB, not from the entire VPC or internet. Referencing the ALB security group ID (not CIDR) ensures only traffic forwarded by the ALB reaches the application.",
        },
        {
          id: "sc1-r3",
          text: "The database should only accept connections from the application servers. Using the App Server security group ID ensures that only those specific instances can connect, even if subnets change.",
        },
        {
          id: "sc1-r4",
          text: "AWS Systems Manager Session Manager provides encrypted, audited shell access without opening any inbound ports. This eliminates the SSH attack surface entirely while providing better audit logging than traditional SSH.",
        },
      ],
      feedback: {
        perfect:
          "Excellent remediation. Every security group now follows least-privilege with security group references creating a chain of trust from ALB to app to database.",
        partial:
          "Some rules are improved but others still allow broader access than necessary. Security group references are more precise than CIDR ranges.",
        wrong: "Critical security gaps remain. Allowing all traffic or exposing the database to the internet violates basic cloud security principles.",
      },
    },
    {
      id: "sc-scenario-2",
      type: "toggle-config",
      title: "Azure NSG Rules for Hybrid Environment",
      description:
        "A company connects their Azure VNet to their on-premises network (172.16.0.0/12) via ExpressRoute. Azure hosts a web app accessible to the public and an internal API accessible only from on-premises. A penetration test found that the internal API is reachable from the internet and the web app can directly query the on-premises database, violating network segmentation policies.",
      targetSystem: "Azure Network Security Groups",
      items: [
        {
          id: "sc2-web-nsg",
          label: "Web App Subnet NSG - Outbound Rules",
          detail: "Outbound rules controlling what the web app can connect to",
          currentState: "Allow all outbound traffic to any destination",
          correctState: "Allow outbound to API subnet on port 443 only, deny direct on-prem access",
          states: [
            "Allow all outbound traffic to any destination",
            "Allow outbound to API subnet on port 443 only, deny direct on-prem access",
            "Deny all outbound traffic",
            "Allow outbound to internet only, deny all internal",
          ],
          rationaleId: "sc2-r1",
        },
        {
          id: "sc2-api-nsg",
          label: "Internal API Subnet NSG - Inbound Rules",
          detail: "Inbound rules controlling who can reach the internal API",
          currentState: "Allow HTTPS from any source (0.0.0.0/0)",
          correctState: "Allow HTTPS from on-premises CIDR (172.16.0.0/12) and web app subnet only",
          states: [
            "Allow HTTPS from any source (0.0.0.0/0)",
            "Allow HTTPS from on-premises CIDR (172.16.0.0/12) and web app subnet only",
            "Allow HTTPS from on-premises CIDR (172.16.0.0/12) only",
            "Deny all inbound traffic",
          ],
          rationaleId: "sc2-r2",
        },
        {
          id: "sc2-nsg-logging",
          label: "NSG Flow Logs",
          detail: "Network traffic logging for security monitoring and incident response",
          currentState: "Disabled on all NSGs",
          correctState: "Enabled on all NSGs with Log Analytics workspace integration",
          states: [
            "Disabled on all NSGs",
            "Enabled on all NSGs with Log Analytics workspace integration",
            "Enabled on internet-facing NSGs only",
            "Enabled but stored only in local storage account",
          ],
          rationaleId: "sc2-r3",
        },
      ],
      rationales: [
        {
          id: "sc2-r1",
          text: "The web app should only communicate with the API subnet, not directly with on-premises databases. This enforces the network segmentation policy by ensuring the API layer acts as the sole gateway to on-premises resources.",
        },
        {
          id: "sc2-r2",
          text: "The internal API needs access from both on-premises users and the web app. Allowing from the internet was the pen test finding. Restricting to on-prem CIDR and the web app subnet closes the vulnerability while maintaining both legitimate access paths.",
        },
        {
          id: "sc2-r3",
          text: "NSG flow logs on all NSGs provide complete traffic visibility for security monitoring and incident investigation. Log Analytics integration enables alerting on anomalous traffic patterns. Logging only internet-facing NSGs creates blind spots for lateral movement detection.",
        },
      ],
      feedback: {
        perfect:
          "Excellent. The NSG rules now enforce proper network segmentation between the web tier, API tier, and on-premises network with full traffic visibility.",
        partial:
          "Some segmentation issues are fixed but the configuration still has gaps that allow unintended access paths or lacks visibility into traffic patterns.",
        wrong: "Critical network segmentation violations remain. The internal API must not be reachable from the internet.",
      },
    },
    {
      id: "sc-scenario-3",
      type: "toggle-config",
      title: "Container Security Configuration",
      description:
        "A development team deployed Docker containers on an ECS cluster with default security settings. A security scan found containers running as root, using the latest tag, and communicating on a shared network without restrictions. You need to harden the container security configuration.",
      targetSystem: "AWS ECS Task Definitions and Security",
      items: [
        {
          id: "sc3-user",
          label: "Container User Context",
          detail: "The Linux user that processes run as inside the container",
          currentState: "root (UID 0)",
          correctState: "Non-root user (e.g., appuser UID 1000)",
          states: [
            "root (UID 0)",
            "Non-root user (e.g., appuser UID 1000)",
            "Nobody user (UID 65534)",
            "Privileged mode (--privileged flag)",
          ],
          rationaleId: "sc3-r1",
        },
        {
          id: "sc3-image-tag",
          label: "Container Image Tag",
          detail: "How the container image version is specified in the task definition",
          currentState: "myapp:latest",
          correctState: "myapp:v2.4.1@sha256:abc123... (pinned digest)",
          states: [
            "myapp:latest",
            "myapp:v2.4.1 (version tag)",
            "myapp:v2.4.1@sha256:abc123... (pinned digest)",
            "myapp:stable",
          ],
          rationaleId: "sc3-r2",
        },
        {
          id: "sc3-readonly",
          label: "Container Root Filesystem",
          detail: "Whether the container can write to its own filesystem",
          currentState: "Read-write (default, container can modify all files)",
          correctState: "Read-only with tmpfs mounts for required writable directories",
          states: [
            "Read-write (default, container can modify all files)",
            "Read-only with tmpfs mounts for required writable directories",
            "Read-only with no writable directories",
            "Read-write with full host filesystem mount",
          ],
          rationaleId: "sc3-r3",
        },
        {
          id: "sc3-network",
          label: "Container Network Mode",
          detail: "Network isolation between containers in the ECS cluster",
          currentState: "Bridge mode (all containers share a Docker bridge network)",
          correctState: "awsvpc mode (each task gets its own ENI and security group)",
          states: [
            "Bridge mode (all containers share a Docker bridge network)",
            "awsvpc mode (each task gets its own ENI and security group)",
            "Host mode (container uses the host network stack directly)",
            "None (no network access)",
          ],
          rationaleId: "sc3-r4",
        },
      ],
      rationales: [
        {
          id: "sc3-r1",
          text: "Running as root inside a container means that a container escape vulnerability gives the attacker root access on the host. Non-root users limit the blast radius of container breakout exploits.",
        },
        {
          id: "sc3-r2",
          text: "The latest tag is mutable and can point to different images at different times, causing unpredictable deployments. A pinned digest (sha256) guarantees the exact image bytes deployed, preventing supply chain attacks and ensuring reproducibility.",
        },
        {
          id: "sc3-r3",
          text: "A read-only root filesystem prevents attackers from writing malicious binaries or modifying application files inside the container. tmpfs mounts allow application-required temporary files without exposing the filesystem to persistent modification.",
        },
        {
          id: "sc3-r4",
          text: "awsvpc mode gives each task its own network interface and security group, enabling per-service network policies. Bridge mode allows all containers to communicate freely, which violates the principle of least privilege.",
        },
      ],
      feedback: {
        perfect:
          "Outstanding container hardening. Non-root execution, pinned images, read-only filesystem, and per-task network isolation create a strong defense-in-depth posture.",
        partial:
          "Some security improvements applied but gaps remain. Container security requires multiple layers working together.",
        wrong: "This configuration leaves significant attack surface. Running as root with a writable filesystem and shared networking is a security risk.",
      },
    },
  ],
  hints: [
    "Security group rules should reference other security group IDs rather than IP ranges when possible. This creates a chain of trust that adapts automatically.",
    "Eliminate SSH access entirely by using managed shell services like AWS Systems Manager Session Manager or Azure Bastion.",
    "Container security requires multiple layers: non-root users, pinned images, read-only filesystems, and per-container network isolation.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Cloud security misconfigurations are the leading cause of cloud data breaches. Security group auditing and remediation is a daily task for cloud security engineers. This skill is directly tested in CompTIA A+ and is a gateway to cloud security certifications like AWS Security Specialty.",
  toolRelevance: [
    "AWS Security Groups",
    "Azure Network Security Groups",
    "AWS Systems Manager",
    "AWS ECS Task Definitions",
    "Docker Security Best Practices",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
