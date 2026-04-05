import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "net-proxy-config",
  version: 1,
  title: "Corporate Proxy Server Configuration",
  tier: "advanced",
  track: "networking",
  difficulty: "challenging",
  accessLevel: "premium",
  tags: ["networking", "proxy", "configuration", "security", "web-filtering"],
  description:
    "Configure proxy settings for a corporate environment including browser configuration, bypass lists, and authentication settings for different use cases.",
  estimatedMinutes: 18,
  learningObjectives: [
    "Configure system-wide and browser-specific proxy settings",
    "Create proxy bypass lists for internal resources and trusted services",
    "Understand proxy authentication methods and their security implications",
    "Troubleshoot common proxy misconfiguration issues",
    "Differentiate between forward proxies and reverse proxies",
  ],
  sortOrder: 219,
  status: "published",
  prerequisites: [],
  rendererType: "toggle-config",
  scenarios: [
    {
      type: "toggle-config",
      id: "npc-scenario-1",
      title: "Workstation Proxy Configuration",
      description:
        "Configure proxy settings on a new workstation joining the corporate network. The company uses a proxy server at proxy.corp.local:8080 for all web traffic. Internal sites (*.corp.local) and the local network (10.0.0.0/8) should not go through the proxy.",
      targetSystem: "Windows Internet Options — Proxy Settings",
      items: [
        {
          id: "proxy-server",
          label: "Proxy Server Address",
          detail: "HTTP/HTTPS proxy server address and port",
          currentState: "No proxy configured",
          correctState: "proxy.corp.local:8080",
          states: ["No proxy configured", "proxy.corp.local:8080", "proxy.corp.local:80", "192.168.1.1:8080"],
          rationaleId: "r-server",
        },
        {
          id: "bypass-list",
          label: "Proxy Bypass List",
          detail: "Addresses that should connect directly without the proxy",
          currentState: "Empty",
          correctState: "*.corp.local;10.*;localhost;127.0.0.1",
          states: ["Empty", "*.corp.local;10.*;localhost;127.0.0.1", "*.corp.local only", "10.* only"],
          rationaleId: "r-bypass",
        },
        {
          id: "auto-detect",
          label: "Automatic Configuration",
          detail: "WPAD/PAC file auto-detection for proxy settings",
          currentState: "Enabled (WPAD)",
          correctState: "Disabled",
          states: ["Enabled (WPAD)", "Disabled"],
          rationaleId: "r-wpad",
        },
      ],
      rationales: [
        {
          id: "r-server",
          text: "The proxy runs on proxy.corp.local port 8080. Using the hostname (not IP) ensures the connection follows DNS changes if the proxy server is migrated.",
        },
        {
          id: "r-bypass",
          text: "Internal resources (*.corp.local), the entire corporate network (10.*), and loopback addresses must bypass the proxy for direct access. Without these exceptions, internal sites would fail if the proxy is down.",
        },
        {
          id: "r-wpad",
          text: "WPAD auto-detection should be disabled when using explicit proxy settings. WPAD can be exploited for man-in-the-middle attacks if a rogue WPAD server is placed on the network.",
        },
      ],
      feedback: {
        perfect: "Excellent! Proxy is correctly configured with comprehensive bypass rules and WPAD disabled for security.",
        partial: "The proxy address is set but review the bypass list — internal resources and the local network need direct access.",
        wrong: "Without proxy configuration, the workstation cannot reach the internet through the corporate firewall. Configure the proxy address and bypass list.",
      },
    },
    {
      type: "toggle-config",
      id: "npc-scenario-2",
      title: "Proxy Authentication Settings",
      description:
        "The corporate proxy requires authentication. Configure the authentication method and credential handling for both user workstations and server applications.",
      targetSystem: "Squid Proxy — Authentication Configuration",
      items: [
        {
          id: "auth-method",
          label: "User Workstation Authentication",
          detail: "How users authenticate to use the proxy",
          currentState: "None (anonymous)",
          correctState: "Integrated Windows Authentication (Kerberos/NTLM)",
          states: ["None (anonymous)", "Basic (username/password in plaintext)", "Integrated Windows Authentication (Kerberos/NTLM)", "Client certificate"],
          rationaleId: "r-auth",
        },
        {
          id: "service-auth",
          label: "Server/Service Account Authentication",
          detail: "How automated services and servers authenticate to the proxy",
          currentState: "None (anonymous)",
          correctState: "Service account with dedicated credentials",
          states: ["None (anonymous)", "Use a shared admin password", "Service account with dedicated credentials"],
          rationaleId: "r-service",
        },
        {
          id: "failed-auth",
          label: "Failed Authentication Action",
          detail: "What happens when authentication fails",
          currentState: "Allow access anyway",
          correctState: "Block access and display error page",
          states: ["Allow access anyway", "Block access and display error page", "Redirect to guest network"],
          rationaleId: "r-fail-auth",
        },
      ],
      rationales: [
        {
          id: "r-auth",
          text: "Integrated Windows Authentication uses the user's existing Active Directory credentials via Kerberos or NTLM. It is seamless (no password prompt) and ties web access to the user's identity for auditing.",
        },
        {
          id: "r-service",
          text: "Service accounts with dedicated credentials provide accountability for automated traffic. Shared admin passwords cannot be audited per-service and are a security risk if compromised.",
        },
        {
          id: "r-fail-auth",
          text: "Blocking unauthenticated access and displaying an error page ensures all internet traffic is tied to an identity. Allowing anonymous fallback defeats the purpose of proxy authentication.",
        },
      ],
      feedback: {
        perfect: "Perfect! Integrated Windows auth for users, dedicated service accounts for servers, and strict enforcement of authentication.",
        partial: "Authentication is partially configured. Ensure both user and service traffic is authenticated and failed auth is blocked.",
        wrong: "Anonymous proxy access provides no accountability or audit trail. All traffic should be authenticated for security compliance.",
      },
    },
    {
      type: "toggle-config",
      id: "npc-scenario-3",
      title: "SSL Inspection Configuration",
      description:
        "The proxy performs SSL/TLS inspection to scan encrypted traffic for threats. Configure the inspection settings and exclusions for compliance.",
      targetSystem: "Proxy SSL/TLS Inspection Settings",
      items: [
        {
          id: "ssl-inspection",
          label: "SSL Inspection — General Status",
          detail: "Whether the proxy decrypts and inspects HTTPS traffic",
          currentState: "Disabled",
          correctState: "Enabled",
          states: ["Disabled", "Enabled"],
          rationaleId: "r-ssl",
        },
        {
          id: "banking-exclusion",
          label: "Financial/Banking Sites — Inspection",
          detail: "Whether to inspect HTTPS traffic to banking and financial websites",
          currentState: "Inspect",
          correctState: "Bypass (do not inspect)",
          states: ["Inspect", "Bypass (do not inspect)"],
          rationaleId: "r-banking",
        },
        {
          id: "healthcare-exclusion",
          label: "Healthcare Portal Sites — Inspection",
          detail: "Whether to inspect HTTPS traffic to healthcare portals containing PHI",
          currentState: "Inspect",
          correctState: "Bypass (do not inspect)",
          states: ["Inspect", "Bypass (do not inspect)"],
          rationaleId: "r-healthcare",
        },
        {
          id: "ca-cert",
          label: "Internal CA Certificate",
          detail: "Distribution of the proxy's CA certificate to workstations",
          currentState: "Not distributed",
          correctState: "Distributed via Group Policy",
          states: ["Not distributed", "Distributed via Group Policy", "Users install manually"],
          rationaleId: "r-ca",
        },
      ],
      rationales: [
        {
          id: "r-ssl",
          text: "SSL inspection allows the proxy to scan encrypted traffic for malware and data exfiltration. Without it, threats hidden in HTTPS traffic pass through uninspected.",
        },
        {
          id: "r-banking",
          text: "Financial sites should be excluded from SSL inspection for privacy and compliance. Intercepting banking credentials, even on a corporate proxy, creates liability and may violate financial regulations.",
        },
        {
          id: "r-healthcare",
          text: "Healthcare portals containing Protected Health Information (PHI) must be excluded to comply with HIPAA. SSL inspection of PHI data could constitute unauthorized access.",
        },
        {
          id: "r-ca",
          text: "The proxy's CA certificate must be trusted by workstations to avoid certificate errors. Group Policy distributes it automatically to all domain-joined machines.",
        },
      ],
      feedback: {
        perfect: "Excellent! SSL inspection is enabled with proper exclusions for financial and healthcare compliance, and the CA certificate is distributed enterprise-wide.",
        partial: "SSL inspection configuration is partially correct. Review the exclusion categories for compliance requirements.",
        wrong: "SSL inspection needs both security (enabled for general traffic) and compliance (exclusions for sensitive categories). The CA certificate must also be distributed.",
      },
    },
  ],
  hints: [
    "Always configure a bypass list for internal resources so they are not affected if the proxy goes down.",
    "Integrated Windows Authentication (Kerberos/NTLM) provides seamless authentication without password prompts for domain users.",
    "SSL inspection must exclude financial and healthcare sites for regulatory compliance (PCI-DSS, HIPAA).",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Proxy server management is a key responsibility in enterprise IT and cybersecurity. Understanding SSL inspection, authentication, and compliance exclusions is essential for security analyst and network administrator roles.",
  toolRelevance: ["Internet Options", "Group Policy", "Squid proxy", "PAC file", "netsh winhttp"],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
