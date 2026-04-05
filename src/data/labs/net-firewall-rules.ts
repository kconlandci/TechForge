import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "net-firewall-rules",
  version: 1,
  title: "Firewall Rule Configuration for Web Server",
  tier: "advanced",
  track: "networking",
  difficulty: "challenging",
  accessLevel: "premium",
  tags: ["networking", "firewall", "security", "rules", "web-server"],
  description:
    "Configure firewall rules to secure a public-facing web server while allowing necessary traffic. Balance security with availability for HTTP, HTTPS, SSH, and database access.",
  estimatedMinutes: 20,
  learningObjectives: [
    "Create firewall rules using the principle of least privilege",
    "Understand the difference between inbound and outbound rules",
    "Configure source and destination restrictions for sensitive services",
    "Order firewall rules correctly for proper evaluation",
    "Identify overly permissive rules that create security vulnerabilities",
  ],
  sortOrder: 213,
  status: "published",
  prerequisites: [],
  rendererType: "toggle-config",
  scenarios: [
    {
      type: "toggle-config",
      id: "nfr-scenario-1",
      title: "Web Server Inbound Rules",
      description:
        "Configure inbound firewall rules for a web server at 10.0.1.100. It serves public HTTP/HTTPS traffic, and the admin team (10.0.2.0/24) needs SSH access for management.",
      targetSystem: "Linux iptables — Inbound Rules",
      items: [
        {
          id: "http-rule",
          label: "HTTP (Port 80) — Source Restriction",
          detail: "Web traffic from public internet visitors",
          currentState: "Blocked",
          correctState: "Allow from Any",
          states: ["Blocked", "Allow from Any", "Allow from 10.0.0.0/8 only"],
          rationaleId: "r-http",
        },
        {
          id: "https-rule",
          label: "HTTPS (Port 443) — Source Restriction",
          detail: "Encrypted web traffic from public internet visitors",
          currentState: "Blocked",
          correctState: "Allow from Any",
          states: ["Blocked", "Allow from Any", "Allow from 10.0.0.0/8 only"],
          rationaleId: "r-https",
        },
        {
          id: "ssh-rule",
          label: "SSH (Port 22) — Source Restriction",
          detail: "Remote administration access for the IT team",
          currentState: "Allow from Any",
          correctState: "Allow from 10.0.2.0/24 only",
          states: ["Blocked", "Allow from Any", "Allow from 10.0.2.0/24 only"],
          rationaleId: "r-ssh",
        },
        {
          id: "default-rule",
          label: "Default Inbound Policy",
          detail: "What happens to traffic that does not match any explicit rule",
          currentState: "Allow All",
          correctState: "Deny All",
          states: ["Allow All", "Deny All"],
          rationaleId: "r-default",
        },
      ],
      rationales: [
        {
          id: "r-http",
          text: "HTTP must be open to the public for the web server to function. Port 80 also handles redirects to HTTPS. Blocking it would make the site unreachable.",
        },
        {
          id: "r-https",
          text: "HTTPS is the primary secure access method for public visitors. It must be open to any source for the website to be accessible.",
        },
        {
          id: "r-ssh",
          text: "SSH should be restricted to the admin subnet (10.0.2.0/24) only. Exposing SSH to the entire internet invites brute-force attacks from bots worldwide.",
        },
        {
          id: "r-default",
          text: "A deny-all default policy ensures that only explicitly permitted traffic can reach the server. This follows the principle of least privilege and blocks unexpected ports.",
        },
      ],
      feedback: {
        perfect: "Excellent! Public web ports are open, SSH is restricted to admins, and the default deny policy blocks everything else.",
        partial: "Some rules are correct. Remember: web ports are public, management ports are restricted, and the default should be deny.",
        wrong: "A web server needs public HTTP/HTTPS access, restricted SSH, and a deny-all default. Review the principle of least privilege.",
      },
    },
    {
      type: "toggle-config",
      id: "nfr-scenario-2",
      title: "Database Server Protection",
      description:
        "The web server (10.0.1.100) connects to a database server (10.0.1.200) on port 3306 (MySQL). Configure the database server's firewall to only allow necessary connections.",
      targetSystem: "Database Server Firewall — Inbound Rules",
      items: [
        {
          id: "mysql-rule",
          label: "MySQL (Port 3306) — Source Restriction",
          detail: "Database queries from the web application",
          currentState: "Allow from Any",
          correctState: "Allow from 10.0.1.100 only",
          states: ["Allow from Any", "Allow from 10.0.1.0/24", "Allow from 10.0.1.100 only", "Blocked"],
          rationaleId: "r-mysql",
        },
        {
          id: "db-ssh-rule",
          label: "SSH (Port 22) — Source Restriction",
          detail: "Database administration access",
          currentState: "Allow from Any",
          correctState: "Allow from 10.0.2.0/24 only",
          states: ["Allow from Any", "Allow from 10.0.2.0/24 only", "Blocked"],
          rationaleId: "r-db-ssh",
        },
        {
          id: "db-default",
          label: "Default Policy",
          detail: "Default action for unmatched traffic",
          currentState: "Allow All",
          correctState: "Deny All",
          states: ["Allow All", "Deny All"],
          rationaleId: "r-db-default",
        },
      ],
      rationales: [
        {
          id: "r-mysql",
          text: "Only the web server at 10.0.1.100 needs database access. Restricting to a single IP prevents other compromised servers or attackers from querying the database directly.",
        },
        {
          id: "r-db-ssh",
          text: "Database SSH access should be limited to the admin team subnet. The database should never have SSH exposed to the internet or general network.",
        },
        {
          id: "r-db-default",
          text: "Deny-all default on a database server is critical. The database should only accept connections from explicitly approved sources.",
        },
      ],
      feedback: {
        perfect: "Perfect! The database is locked down to accept connections only from the web server and admin team, with everything else denied.",
        partial: "The restrictions are in the right direction but should be as specific as possible. Use single-host restrictions where only one host needs access.",
        wrong: "A database server should never accept connections from 'Any'. Restrict each port to only the specific IPs that need access.",
      },
    },
    {
      type: "toggle-config",
      id: "nfr-scenario-3",
      title: "Outbound Rule Configuration",
      description:
        "Configure outbound rules on the web server. The server needs to reach the internet for OS updates, DNS resolution, and sending email notifications.",
      targetSystem: "Web Server Firewall — Outbound Rules",
      items: [
        {
          id: "dns-out",
          label: "DNS (Port 53) — Outbound",
          detail: "Domain name resolution for the web application",
          currentState: "Blocked",
          correctState: "Allow to DNS servers only",
          states: ["Blocked", "Allow to Any", "Allow to DNS servers only"],
          rationaleId: "r-dns-out",
        },
        {
          id: "updates-out",
          label: "HTTPS (Port 443) — Outbound",
          detail: "OS updates, package manager, and API calls",
          currentState: "Blocked",
          correctState: "Allow to Any",
          states: ["Blocked", "Allow to Any", "Allow to update servers only"],
          rationaleId: "r-updates",
        },
        {
          id: "smtp-out",
          label: "SMTP (Port 587) — Outbound",
          detail: "Sending email notifications from the web application",
          currentState: "Allow to Any",
          correctState: "Allow to mail relay only",
          states: ["Blocked", "Allow to Any", "Allow to mail relay only"],
          rationaleId: "r-smtp",
        },
      ],
      rationales: [
        {
          id: "r-dns-out",
          text: "DNS should be restricted to known DNS servers. Allowing DNS to any destination could be exploited for DNS tunneling to exfiltrate data.",
        },
        {
          id: "r-updates",
          text: "Outbound HTTPS is needed for various legitimate purposes including OS updates, API integrations, and package downloads. Allow to any but consider an outbound proxy for logging.",
        },
        {
          id: "r-smtp",
          text: "SMTP should only go to the authorized mail relay server. Allowing SMTP to any destination means a compromised server could send spam or phishing emails.",
        },
      ],
      feedback: {
        perfect: "Excellent! Outbound rules follow least privilege: DNS to known servers, HTTPS for updates, and SMTP restricted to the mail relay.",
        partial: "Outbound rules are often overlooked. Consider restricting each service to only the destinations it legitimately needs.",
        wrong: "Outbound rules are as important as inbound. A compromised server with unrestricted outbound access can exfiltrate data or send spam.",
      },
    },
  ],
  hints: [
    "Follow the principle of least privilege: only allow the minimum traffic needed for each service to function.",
    "Default deny means any traffic not explicitly allowed is blocked — this is the gold standard for server firewalls.",
    "Restrict management ports (SSH, RDP) to specific admin IP ranges, never to 'Any'.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Firewall configuration is a core skill for any cybersecurity role. Demonstrating that you can write rules using least privilege and default deny puts you ahead of most entry-level candidates.",
  toolRelevance: ["iptables", "Windows Firewall", "pfSense", "netstat", "nmap"],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
