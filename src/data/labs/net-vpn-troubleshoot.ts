import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "net-vpn-troubleshoot",
  version: 1,
  title: "VPN Connection Troubleshooting",
  tier: "intermediate",
  track: "networking",
  difficulty: "moderate",
  accessLevel: "free",
  tags: ["networking", "vpn", "remote-access", "troubleshooting", "security"],
  description:
    "A remote employee cannot connect to the corporate VPN. Investigate the connection failures and determine the correct fix for each scenario.",
  estimatedMinutes: 15,
  learningObjectives: [
    "Identify common VPN connection failure causes",
    "Troubleshoot split-tunnel vs full-tunnel VPN configurations",
    "Diagnose firewall and port blocking issues affecting VPN",
    "Understand VPN protocol requirements for different environments",
  ],
  sortOrder: 212,
  status: "published",
  prerequisites: [],
  rendererType: "investigate-decide",
  scenarios: [
    {
      type: "investigate-decide",
      id: "nvt-scenario-1",
      title: "Hotel Wi-Fi Blocking VPN",
      objective:
        "An employee at a hotel cannot establish a VPN connection. The VPN client shows 'Connection timed out'. Determine the cause.",
      investigationData: [
        {
          id: "vpn-log",
          label: "VPN Client Log",
          content:
            "Initiating IKEv2 connection to vpn.company.com...\nSending IKE_SA_INIT request on port 500...\nNo response received. Retrying...\nNo response received. Retrying...\nConnection timed out after 30 seconds.",
          isCritical: true,
        },
        {
          id: "internet-test",
          label: "Internet Connectivity Test",
          content:
            "ping google.com — Success (15ms)\nBrowsing websites — Working normally\nSpeedtest — 25 Mbps down, 10 Mbps up",
        },
        {
          id: "hotel-info",
          label: "Hotel Network Details",
          content:
            "Connected to: HotelGuest-WiFi\nHotel uses a captive portal with terms acceptance\nOther hotel guests report similar VPN issues\nHotel IT confirms they restrict outbound traffic to ports 80 and 443 only.",
          isCritical: true,
        },
      ],
      actions: [
        { id: "switch-ssl", label: "Switch VPN protocol to SSL/TLS VPN on port 443", color: "green" },
        { id: "call-hotel", label: "Ask hotel IT to open ports 500 and 4500", color: "yellow" },
        { id: "use-hotspot", label: "Use mobile phone hotspot instead of hotel Wi-Fi", color: "blue" },
        { id: "reinstall-vpn", label: "Reinstall the VPN client software", color: "red" },
      ],
      correctActionId: "switch-ssl",
      rationales: [
        {
          id: "r-ssl",
          text: "The hotel blocks all ports except 80 and 443. Switching to an SSL/TLS VPN on port 443 tunnels through the restriction since HTTPS traffic is always allowed.",
        },
        {
          id: "r-hotel-it",
          text: "Hotels rarely make firewall exceptions for individual guests. This is not a practical or timely solution.",
        },
        {
          id: "r-hotspot",
          text: "A mobile hotspot would work but uses cellular data and may have poor signal inside the hotel. The SSL VPN is a more reliable solution.",
        },
        {
          id: "r-reinstall",
          text: "The VPN client is working correctly and attempting to connect. The issue is network-level port blocking, not a software problem.",
        },
      ],
      correctRationaleId: "r-ssl",
      feedback: {
        perfect: "Correct! Hotel networks commonly block non-standard ports. SSL VPN on port 443 passes through this restriction since HTTPS is always permitted.",
        partial: "Your solution would provide VPN access but there is a more efficient option. Consider which ports the hotel allows.",
        wrong: "The VPN client is functional. The hotel firewall blocks the IKEv2 ports (500/4500). Use a protocol that works on an allowed port.",
      },
    },
    {
      type: "investigate-decide",
      id: "nvt-scenario-2",
      title: "VPN Connected But No Internal Access",
      objective:
        "The VPN connects successfully but the employee cannot reach any internal resources like file shares or intranet sites.",
      investigationData: [
        {
          id: "vpn-status",
          label: "VPN Client Status",
          content:
            "Status: Connected\nVPN IP: 10.10.0.55\nDuration: 5 minutes\nBytes sent/received: 2,400 / 1,800",
        },
        {
          id: "route-table",
          label: "route print (relevant entries)",
          content:
            "0.0.0.0/0 -> 192.168.1.1 (home router)\n10.10.0.0/24 -> 10.10.0.1 (VPN tunnel)\n10.0.0.0/8 -> NOT PRESENT\n192.168.1.0/24 -> 192.168.1.1 (home LAN)",
          isCritical: true,
        },
        {
          id: "ping-tests",
          label: "Connectivity Tests",
          content:
            "ping 10.10.0.1 (VPN gateway) — Success\nping 10.0.1.10 (file server) — Request timed out\nping 10.0.1.5 (domain controller) — Request timed out\nping google.com — Success (through home router)",
        },
      ],
      actions: [
        { id: "request-full-tunnel", label: "Ask the VPN admin to push routes for 10.0.0.0/8 or switch to full-tunnel mode", color: "green" },
        { id: "add-manual-route", label: "Manually add a route: route add 10.0.0.0/8 10.10.0.1", color: "yellow" },
        { id: "disable-home-router", label: "Disconnect from home Wi-Fi and reconnect", color: "red" },
      ],
      correctActionId: "request-full-tunnel",
      rationales: [
        {
          id: "r-full-tunnel",
          text: "The VPN is configured as split-tunnel but is not pushing routes for the 10.0.x.x corporate subnets. The VPN admin needs to push the 10.0.0.0/8 route so corporate traffic goes through the tunnel.",
        },
        {
          id: "r-manual-route",
          text: "A manual route works temporarily but is lost on reboot and must be repeated by every remote user. The server-side fix is the proper solution.",
        },
        {
          id: "r-disconnect",
          text: "The home connection is fine. The issue is missing routes in the VPN configuration that direct corporate traffic through the tunnel.",
        },
      ],
      correctRationaleId: "r-full-tunnel",
      feedback: {
        perfect: "Correct! The VPN is missing routes for corporate subnets. The VPN administrator needs to push the appropriate routes to clients.",
        partial: "Your fix addresses the routing issue but consider the scalable solution that fixes it for all remote users.",
        wrong: "The VPN tunnel is established. The problem is that routes for internal subnets are not being sent to the client.",
      },
    },
    {
      type: "investigate-decide",
      id: "nvt-scenario-3",
      title: "Certificate Expired",
      objective:
        "A remote user's VPN suddenly stopped working after months of reliable use. The client shows a certificate error.",
      investigationData: [
        {
          id: "error-msg",
          label: "VPN Client Error",
          content:
            "Error: The server certificate has expired.\nCertificate issued to: vpn.company.com\nExpiry date: March 25, 2026\nCurrent date: March 27, 2026",
          isCritical: true,
        },
        {
          id: "other-users",
          label: "Help Desk Report",
          content:
            "12 other remote users reported the same error starting this morning.\nNo VPN configuration changes were made recently.\nOn-site employees are unaffected.",
        },
        {
          id: "server-check",
          label: "VPN Server Status",
          content:
            "VPN server is running and responding to requests.\nServer certificate: vpn.company.com, expired March 25, 2026.\nNew certificate was issued but not yet installed.",
          isCritical: true,
        },
      ],
      actions: [
        { id: "install-new-cert", label: "Install the renewed SSL certificate on the VPN server", color: "green" },
        { id: "tell-users-ignore", label: "Instruct users to bypass the certificate warning", color: "red" },
        { id: "switch-protocol", label: "Switch the VPN to a non-certificate protocol", color: "red" },
      ],
      correctActionId: "install-new-cert",
      rationales: [
        {
          id: "r-cert",
          text: "The SSL certificate expired 2 days ago. A renewed certificate is already available and just needs to be installed on the VPN server. This immediately resolves the issue for all users.",
        },
        {
          id: "r-bypass",
          text: "Bypassing certificate warnings trains users to ignore security errors and could expose them to man-in-the-middle attacks. This is never an acceptable production solution.",
        },
        {
          id: "r-protocol",
          text: "Changing the VPN protocol is a drastic measure when the fix is simply installing the renewed certificate. Every user's client would need reconfiguration.",
        },
      ],
      correctRationaleId: "r-cert",
      feedback: {
        perfect: "Correct! The expired certificate needs to be replaced with the renewed one. This is a server-side fix that resolves the issue for all users simultaneously.",
        partial: "You are on the right track with a server-side fix. The renewed certificate is already available and just needs installation.",
        wrong: "The issue is a simple expired certificate. The renewed cert exists and just needs to be installed — do not bypass security warnings.",
      },
    },
  ],
  hints: [
    "If VPN fails at certain locations, check whether the network blocks non-standard ports. SSL VPN on port 443 usually works everywhere.",
    "When VPN connects but internal resources are unreachable, check the routing table for missing routes to corporate subnets.",
    "Certificate errors affecting all users simultaneously usually indicate a server-side certificate expiration.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "VPN troubleshooting is critical as remote work becomes standard. Being able to quickly diagnose whether the issue is protocol-related, routing-related, or certificate-related saves significant downtime for remote employees.",
  toolRelevance: ["VPN client", "route print", "ping", "tracert", "nslookup"],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
