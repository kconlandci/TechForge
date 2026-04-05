import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "cloud-network-config",
  version: 1,
  title: "Configure Cloud Virtual Network",
  tier: "intermediate",
  track: "virtualization-cloud",
  difficulty: "moderate",
  accessLevel: "free",
  tags: ["cloud", "networking", "vpc", "vnet", "subnets", "firewall", "CompTIA-A+"],
  description:
    "Configure virtual network components including subnets, route tables, security groups, and gateways for a cloud-hosted application environment.",
  estimatedMinutes: 20,
  learningObjectives: [
    "Design VPC/VNet architecture with public and private subnets",
    "Configure network security groups and firewall rules for cloud resources",
    "Set up proper routing between subnets and to the internet",
    "Apply the principle of least privilege to network access controls",
  ],
  sortOrder: 405,
  status: "published",
  prerequisites: [],
  rendererType: "toggle-config",
  scenarios: [
    {
      id: "nc-scenario-1",
      type: "toggle-config",
      title: "Three-Tier Application VPC Design",
      description:
        "A company is deploying a three-tier web application on AWS. The web tier needs internet access, the application tier should only accept traffic from the web tier, and the database tier must be completely isolated from direct internet access. Currently, all resources are in a single public subnet with a default security group allowing all traffic.",
      targetSystem: "AWS VPC - 10.0.0.0/16",
      items: [
        {
          id: "nc1-web-subnet",
          label: "Web Tier Subnet Type",
          detail: "Subnet configuration for the web servers hosting the public-facing load balancer",
          currentState: "Private subnet (no internet gateway)",
          correctState: "Public subnet (with internet gateway and public IPs)",
          states: [
            "Private subnet (no internet gateway)",
            "Public subnet (with internet gateway and public IPs)",
            "Isolated subnet (no route table)",
          ],
          rationaleId: "nc1-r1",
        },
        {
          id: "nc1-app-subnet",
          label: "Application Tier Subnet Type",
          detail: "Subnet configuration for the backend application servers",
          currentState: "Public subnet (with internet gateway and public IPs)",
          correctState: "Private subnet (with NAT gateway for outbound only)",
          states: [
            "Public subnet (with internet gateway and public IPs)",
            "Private subnet (with NAT gateway for outbound only)",
            "Private subnet (no outbound internet access)",
            "Isolated subnet (no route table)",
          ],
          rationaleId: "nc1-r2",
        },
        {
          id: "nc1-db-subnet",
          label: "Database Tier Subnet Type",
          detail: "Subnet configuration for the RDS database instances",
          currentState: "Public subnet (with internet gateway and public IPs)",
          correctState: "Private subnet (no outbound internet access)",
          states: [
            "Public subnet (with internet gateway and public IPs)",
            "Private subnet (with NAT gateway for outbound only)",
            "Private subnet (no outbound internet access)",
            "Isolated subnet (no route table)",
          ],
          rationaleId: "nc1-r3",
        },
        {
          id: "nc1-db-sg",
          label: "Database Security Group Inbound Rule",
          detail: "Inbound access rules for the database security group",
          currentState: "Allow all traffic from 0.0.0.0/0",
          correctState: "Allow MySQL 3306 from application subnet CIDR only",
          states: [
            "Allow all traffic from 0.0.0.0/0",
            "Allow MySQL 3306 from application subnet CIDR only",
            "Allow MySQL 3306 from VPC CIDR (10.0.0.0/16)",
            "Block all inbound traffic",
          ],
          rationaleId: "nc1-r4",
        },
      ],
      rationales: [
        {
          id: "nc1-r1",
          text: "The web tier hosts the load balancer that receives traffic from the internet. It must be in a public subnet with an internet gateway to accept inbound connections from end users.",
        },
        {
          id: "nc1-r2",
          text: "Application servers should not be directly reachable from the internet. A private subnet with a NAT gateway allows them to pull software updates and reach external APIs while blocking unsolicited inbound connections.",
        },
        {
          id: "nc1-r3",
          text: "Database servers should have no internet access at all. They only need to communicate with the application tier within the VPC. This minimizes the attack surface for the most sensitive data layer.",
        },
        {
          id: "nc1-r4",
          text: "Database security groups should follow least privilege: only allow the specific port (3306 for MySQL) from the application subnet. Allowing the entire VPC or all traffic exposes the database to unnecessary risk.",
        },
      ],
      feedback: {
        perfect:
          "Excellent network design. Each tier has appropriate isolation with least-privilege access between layers.",
        partial:
          "Some tiers are correctly isolated but others have overly permissive or overly restrictive access. Review the data flow between tiers.",
        wrong: "This configuration either exposes sensitive tiers to the internet or blocks legitimate traffic between application layers.",
      },
    },
    {
      id: "nc-scenario-2",
      type: "toggle-config",
      title: "Site-to-Site VPN Configuration",
      description:
        "A company needs to connect their on-premises data center (192.168.0.0/16) to their Azure VNet (10.0.0.0/16) via a site-to-site VPN. On-premises servers must reach cloud databases, and cloud application servers must reach on-premises Active Directory. The current setup has no connectivity between the two environments.",
      targetSystem: "Azure VPN Gateway - VpnGw1",
      items: [
        {
          id: "nc2-gateway",
          label: "VPN Gateway SKU",
          detail: "Azure VPN Gateway performance tier",
          currentState: "Basic (100 Mbps, no BGP support)",
          correctState: "VpnGw1 (650 Mbps, BGP supported)",
          states: [
            "Basic (100 Mbps, no BGP support)",
            "VpnGw1 (650 Mbps, BGP supported)",
            "VpnGw3 (1.25 Gbps, BGP supported)",
            "ExpressRoute (dedicated private connection)",
          ],
          rationaleId: "nc2-r1",
        },
        {
          id: "nc2-encryption",
          label: "IPSec Encryption Protocol",
          detail: "Encryption algorithm for the VPN tunnel",
          currentState: "DES (56-bit)",
          correctState: "AES-256 with SHA-256",
          states: [
            "DES (56-bit)",
            "3DES (168-bit)",
            "AES-128 with SHA-1",
            "AES-256 with SHA-256",
          ],
          rationaleId: "nc2-r2",
        },
        {
          id: "nc2-routing",
          label: "Routing Configuration",
          detail: "How routes are exchanged between on-premises and cloud networks",
          currentState: "Static routes (manually configured)",
          correctState: "BGP dynamic routing (automatic route exchange)",
          states: [
            "Static routes (manually configured)",
            "BGP dynamic routing (automatic route exchange)",
            "Default route (send all traffic through VPN)",
            "No routing (rely on DNS resolution)",
          ],
          rationaleId: "nc2-r3",
        },
      ],
      rationales: [
        {
          id: "nc2-r1",
          text: "VpnGw1 provides adequate bandwidth for hybrid connectivity and supports BGP for dynamic routing. Basic lacks BGP support, VpnGw3 is overprovisioned for this workload, and ExpressRoute is for dedicated private circuits, not VPN.",
        },
        {
          id: "nc2-r2",
          text: "AES-256 with SHA-256 is the current industry standard for IPSec VPN encryption. DES and 3DES are deprecated due to known vulnerabilities. AES-128 with SHA-1 is acceptable but SHA-1 is being phased out.",
        },
        {
          id: "nc2-r3",
          text: "BGP dynamically exchanges routes between the on-premises and cloud networks, automatically adapting to new subnets and failover paths. Static routes require manual updates for every network change and do not support automatic failover.",
        },
      ],
      feedback: {
        perfect:
          "Correct configuration. The VPN gateway, encryption, and routing are all properly configured for a secure and maintainable hybrid connection.",
        partial:
          "Some settings are appropriate but others use deprecated protocols or inflexible routing that will cause maintenance issues.",
        wrong: "This configuration has security vulnerabilities or connectivity gaps that would prevent reliable hybrid networking.",
      },
    },
    {
      id: "nc-scenario-3",
      type: "toggle-config",
      title: "Cloud DNS and Load Balancer Setup",
      description:
        "A SaaS company is setting up their production environment on AWS. They need DNS resolution for their public website (app.example.com), internal service discovery between microservices, and load balancing across multiple availability zones. Currently, DNS points to a single EC2 instance IP address with no load balancing.",
      targetSystem: "AWS Route 53 + Application Load Balancer",
      items: [
        {
          id: "nc3-dns-record",
          label: "DNS Record Type for app.example.com",
          detail: "Route 53 record type pointing to the application infrastructure",
          currentState: "A record pointing to a single EC2 instance IP",
          correctState: "Alias record pointing to the Application Load Balancer",
          states: [
            "A record pointing to a single EC2 instance IP",
            "Alias record pointing to the Application Load Balancer",
            "CNAME record pointing to an EC2 public DNS name",
            "MX record pointing to the mail server",
          ],
          rationaleId: "nc3-r1",
        },
        {
          id: "nc3-lb-type",
          label: "Load Balancer Type",
          detail: "AWS load balancer type for the web application",
          currentState: "Classic Load Balancer (CLB)",
          correctState: "Application Load Balancer (ALB)",
          states: [
            "Classic Load Balancer (CLB)",
            "Application Load Balancer (ALB)",
            "Network Load Balancer (NLB)",
            "Gateway Load Balancer (GWLB)",
          ],
          rationaleId: "nc3-r2",
        },
        {
          id: "nc3-health",
          label: "Health Check Configuration",
          detail: "How the load balancer determines if targets are healthy",
          currentState: "TCP port check on port 80",
          correctState: "HTTP GET /health returning 200 OK",
          states: [
            "TCP port check on port 80",
            "HTTP GET /health returning 200 OK",
            "ICMP ping check",
            "No health check (send to all targets)",
          ],
          rationaleId: "nc3-r3",
        },
      ],
      rationales: [
        {
          id: "nc3-r1",
          text: "An Alias record to the ALB provides automatic failover and multi-AZ resolution without exposing individual instance IPs. A records to single instances create a single point of failure with no load distribution.",
        },
        {
          id: "nc3-r2",
          text: "ALB operates at Layer 7 (HTTP/HTTPS) and supports path-based routing for microservices, host-based routing, and WebSocket support. CLB is legacy, NLB is for TCP/UDP workloads, and GWLB is for network appliances.",
        },
        {
          id: "nc3-r3",
          text: "An HTTP health check on a dedicated /health endpoint verifies the application is actually functional, not just that the port is open. A TCP check passes even when the app is crashed but the port is held open by the OS.",
        },
      ],
      feedback: {
        perfect:
          "Excellent setup. The DNS, load balancer, and health checks work together to provide a reliable, highly available application endpoint.",
        partial:
          "Some components are configured well but others leave single points of failure or use legacy services that limit functionality.",
        wrong: "This configuration maintains the original single-point-of-failure issues or uses incorrect service types for a web application.",
      },
    },
  ],
  hints: [
    "In a three-tier architecture, each tier should have different levels of internet exposure. Databases should never be directly reachable from the internet.",
    "For VPN connections, always use current encryption standards. DES and 3DES are considered broken.",
    "Load balancer health checks should verify application functionality, not just network connectivity.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Cloud networking is one of the most in-demand skills in IT. Every cloud deployment requires proper VPC/VNet design, and misconfigured security groups are one of the top causes of data breaches. Mastering these concepts opens doors to cloud engineering and security roles.",
  toolRelevance: [
    "AWS VPC Console",
    "Azure Virtual Network",
    "AWS Security Groups",
    "Azure Network Security Groups",
    "AWS Route 53",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
