import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "net-port-forwarding",
  version: 1,
  title: "Router Port Forwarding Configuration",
  tier: "intermediate",
  track: "networking",
  difficulty: "moderate",
  accessLevel: "free",
  tags: ["networking", "port-forwarding", "router", "nat", "firewall"],
  description:
    "Configure port forwarding rules on a small office router to allow external access to internal services like a web server, remote desktop, and security cameras.",
  estimatedMinutes: 12,
  learningObjectives: [
    "Configure port forwarding rules for specific services",
    "Understand the relationship between public and private IP addresses in NAT",
    "Select appropriate port numbers for common network services",
    "Avoid security risks when opening ports to the internet",
  ],
  sortOrder: 209,
  status: "published",
  prerequisites: [],
  rendererType: "toggle-config",
  scenarios: [
    {
      type: "toggle-config",
      id: "npf-scenario-1",
      title: "Web Server Port Forwarding",
      description:
        "The office has a web server at 192.168.1.100 that needs to be accessible from the internet on standard ports. Configure the router's port forwarding rules.",
      targetSystem: "Netgear Nighthawk Router — Port Forwarding",
      items: [
        {
          id: "http-port",
          label: "HTTP Service — External Port",
          detail: "External port for web traffic to reach the internal web server",
          currentState: "8080",
          correctState: "80",
          states: ["80", "443", "8080", "8443"],
          rationaleId: "r-http",
        },
        {
          id: "https-port",
          label: "HTTPS Service — External Port",
          detail: "External port for encrypted web traffic",
          currentState: "8443",
          correctState: "443",
          states: ["80", "443", "8080", "8443"],
          rationaleId: "r-https",
        },
        {
          id: "internal-ip",
          label: "Destination Internal IP",
          detail: "Internal server IP to forward traffic to",
          currentState: "192.168.1.1",
          correctState: "192.168.1.100",
          states: ["192.168.1.1", "192.168.1.100", "192.168.1.254", "0.0.0.0"],
          rationaleId: "r-dest-ip",
        },
      ],
      rationales: [
        {
          id: "r-http",
          text: "Standard HTTP uses port 80. Using a non-standard port like 8080 requires visitors to type :8080 in the URL, which is inconvenient and unprofessional.",
        },
        {
          id: "r-https",
          text: "Standard HTTPS uses port 443. Browsers automatically try port 443 for https:// URLs without requiring the user to specify a port.",
        },
        {
          id: "r-dest-ip",
          text: "Traffic must be forwarded to 192.168.1.100 (the web server), not 192.168.1.1 (the router itself) or the broadcast address.",
        },
      ],
      feedback: {
        perfect: "Correct! HTTP (80) and HTTPS (443) are forwarded to the web server at 192.168.1.100 using standard ports.",
        partial: "The forwarding concept is right but check that you are using standard ports and the correct internal IP.",
        wrong: "Port forwarding must point to the internal server IP and use the standard ports for web services.",
      },
    },
    {
      type: "toggle-config",
      id: "npf-scenario-2",
      title: "Remote Desktop Access",
      description:
        "An employee needs to Remote Desktop into their office PC (192.168.1.50) from home. Configure port forwarding while minimizing security risk.",
      targetSystem: "Netgear Nighthawk Router — RDP Port Forwarding",
      items: [
        {
          id: "rdp-ext-port",
          label: "External Port for RDP",
          detail: "Port exposed to the internet for remote desktop connections",
          currentState: "3389",
          correctState: "33890",
          states: ["3389", "33890", "22", "443"],
          rationaleId: "r-rdp-port",
        },
        {
          id: "rdp-int-port",
          label: "Internal Port for RDP",
          detail: "Port on the destination PC where RDP is listening",
          currentState: "33890",
          correctState: "3389",
          states: ["3389", "33890", "22", "443"],
          rationaleId: "r-rdp-int",
        },
        {
          id: "rdp-source-filter",
          label: "Source IP Restriction",
          detail: "Limit which external IPs can use this port forward rule",
          currentState: "Any (0.0.0.0/0)",
          correctState: "Employee Home IP Only",
          states: ["Any (0.0.0.0/0)", "Employee Home IP Only", "Internal Only (192.168.1.0/24)"],
          rationaleId: "r-source",
        },
      ],
      rationales: [
        {
          id: "r-rdp-port",
          text: "Using a non-standard external port (33890) for RDP reduces exposure to automated scanning bots that target the default port 3389. This is security through obscurity as an additional layer.",
        },
        {
          id: "r-rdp-int",
          text: "The internal port remains 3389 because that is where the Windows Remote Desktop service listens. The router translates 33890 externally to 3389 internally.",
        },
        {
          id: "r-source",
          text: "Restricting the source to the employee's home IP prevents the entire internet from attempting to connect. This dramatically reduces brute-force attack surface.",
        },
      ],
      feedback: {
        perfect: "Excellent! RDP uses a non-standard external port mapped to the standard internal port, with source IP filtering for security.",
        partial: "The forwarding works but consider the security implications. Non-standard ports and source filtering add important protection.",
        wrong: "Exposing RDP on the default port to all internet IPs is extremely dangerous. Apply port obscurity and source filtering.",
      },
    },
    {
      type: "toggle-config",
      id: "npf-scenario-3",
      title: "Security Camera DVR Access",
      description:
        "The office security DVR at 192.168.1.200 uses port 37777 for its mobile app. The owner wants to view cameras remotely on their phone.",
      targetSystem: "Netgear Nighthawk Router — DVR Port Forwarding",
      items: [
        {
          id: "dvr-protocol",
          label: "Protocol",
          detail: "Which protocol to forward for the DVR application",
          currentState: "UDP Only",
          correctState: "TCP",
          states: ["TCP", "UDP Only", "Both TCP/UDP"],
          rationaleId: "r-protocol",
        },
        {
          id: "dvr-ext-port",
          label: "External Port",
          detail: "Port exposed to the internet for DVR app access",
          currentState: "80",
          correctState: "37777",
          states: ["80", "443", "37777", "8080"],
          rationaleId: "r-dvr-port",
        },
        {
          id: "dvr-dest",
          label: "Internal Destination",
          detail: "IP and port of the DVR on the local network",
          currentState: "192.168.1.1:37777",
          correctState: "192.168.1.200:37777",
          states: ["192.168.1.1:37777", "192.168.1.200:37777", "192.168.1.200:80", "192.168.1.100:37777"],
          rationaleId: "r-dvr-dest",
        },
      ],
      rationales: [
        {
          id: "r-protocol",
          text: "DVR management connections typically use TCP for reliable data transfer. The mobile app establishes a TCP connection to stream video and control the DVR.",
        },
        {
          id: "r-dvr-port",
          text: "The DVR application uses port 37777. The mobile app is configured to connect on this specific port. Using port 80 or 443 would conflict with any web server rules.",
        },
        {
          id: "r-dvr-dest",
          text: "The destination must be the DVR at 192.168.1.200 on port 37777. Pointing to the router IP or the wrong internal device would not reach the DVR.",
        },
      ],
      feedback: {
        perfect: "Correct! TCP port 37777 is forwarded to the DVR at 192.168.1.200, enabling the mobile app to connect remotely.",
        partial: "The forwarding direction is right but verify the protocol, port number, and destination IP match the DVR requirements.",
        wrong: "Check the DVR documentation for its specific port and protocol. The destination must point to the DVR, not the router.",
      },
    },
  ],
  hints: [
    "Standard web services use port 80 (HTTP) and 443 (HTTPS). Using non-standard ports requires users to specify the port in the URL.",
    "For security-sensitive services like RDP, use a non-standard external port and restrict source IPs when possible.",
    "The internal destination port must match what the service is actually listening on, even if the external port differs.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Port forwarding is one of the most common tasks for small business IT support. Knowing how to do it securely — with non-standard ports and source filtering — separates competent techs from those who create security vulnerabilities.",
  toolRelevance: ["router admin interface", "netstat", "nmap", "ipconfig"],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
