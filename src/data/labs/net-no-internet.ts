import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "net-no-internet",
  version: 1,
  title: "Connected But No Internet Access",
  tier: "beginner",
  track: "networking",
  difficulty: "easy",
  accessLevel: "free",
  tags: ["networking", "troubleshooting", "internet", "connectivity", "tcp-ip"],
  description:
    "A user's PC shows 'Connected' on the network icon but cannot access any websites or online services. Investigate and resolve the connectivity issue.",
  estimatedMinutes: 10,
  learningObjectives: [
    "Use ipconfig to examine current TCP/IP configuration",
    "Differentiate between local network connectivity and internet access",
    "Identify common causes of 'connected but no internet' scenarios",
    "Apply systematic troubleshooting methodology to network issues",
  ],
  sortOrder: 200,
  status: "published",
  prerequisites: [],
  rendererType: "investigate-decide",
  scenarios: [
    {
      type: "investigate-decide",
      id: "nni-scenario-1",
      title: "Missing Default Gateway",
      objective:
        "Determine why the workstation can reach local devices but has no internet access.",
      investigationData: [
        {
          id: "ipconfig-output",
          label: "ipconfig /all Output",
          content:
            "IPv4 Address: 192.168.1.50\nSubnet Mask: 255.255.255.0\nDefault Gateway: (blank)\nDNS Servers: 192.168.1.1\nDHCP Enabled: No",
          isCritical: true,
        },
        {
          id: "ping-local",
          label: "ping 192.168.1.1",
          content:
            "Reply from 192.168.1.1: bytes=32 time<1ms TTL=64\nReply from 192.168.1.1: bytes=32 time<1ms TTL=64",
        },
        {
          id: "ping-external",
          label: "ping 8.8.8.8",
          content:
            "Request timed out.\nRequest timed out.\nRequest timed out.\nRequest timed out.",
        },
      ],
      actions: [
        { id: "set-gateway", label: "Set the default gateway to 192.168.1.1", color: "green" },
        { id: "replace-nic", label: "Replace the network adapter", color: "red" },
        { id: "restart-dns", label: "Flush the DNS cache", color: "yellow" },
        { id: "change-dns", label: "Change DNS servers to 8.8.8.8", color: "blue" },
      ],
      correctActionId: "set-gateway",
      rationales: [
        {
          id: "r-gateway",
          text: "The default gateway is missing from the static configuration. Without a gateway, traffic cannot leave the local subnet to reach the internet.",
        },
        {
          id: "r-nic",
          text: "The NIC is working since local pings succeed. Replacing hardware is unnecessary when the issue is configuration.",
        },
        {
          id: "r-dns",
          text: "DNS flush would not help because the machine cannot reach any external IP at all, not just domain names.",
        },
      ],
      correctRationaleId: "r-gateway",
      feedback: {
        perfect: "Correct! The missing default gateway prevents any traffic from leaving the local subnet. Adding 192.168.1.1 as the gateway restores internet access.",
        partial: "You identified a network setting issue but missed the root cause. Look at which fields are blank in the ipconfig output.",
        wrong: "The local network is functional since pings to 192.168.1.1 succeed. The issue is in the IP configuration, not hardware.",
      },
    },
    {
      type: "investigate-decide",
      id: "nni-scenario-2",
      title: "DNS Server Unreachable",
      objective:
        "A user can ping external IPs but websites do not load. Determine the root cause.",
      investigationData: [
        {
          id: "ipconfig-output-2",
          label: "ipconfig /all Output",
          content:
            "IPv4 Address: 10.0.0.25\nSubnet Mask: 255.255.255.0\nDefault Gateway: 10.0.0.1\nDNS Servers: 10.0.0.5\nDHCP Enabled: Yes",
        },
        {
          id: "ping-dns",
          label: "ping 10.0.0.5",
          content:
            "Request timed out.\nRequest timed out.\nRequest timed out.\nRequest timed out.",
          isCritical: true,
        },
        {
          id: "ping-google",
          label: "ping 8.8.8.8",
          content:
            "Reply from 8.8.8.8: bytes=32 time=14ms TTL=118\nReply from 8.8.8.8: bytes=32 time=15ms TTL=118",
        },
      ],
      actions: [
        { id: "change-dns-servers", label: "Change DNS to 8.8.8.8 and 8.8.4.4", color: "green" },
        { id: "reset-tcp", label: "Run netsh winsock reset", color: "yellow" },
        { id: "disable-firewall", label: "Disable Windows Firewall completely", color: "red" },
      ],
      correctActionId: "change-dns-servers",
      rationales: [
        {
          id: "r-dns-fix",
          text: "The configured DNS server at 10.0.0.5 is unreachable. External IPs work fine, so switching to public DNS servers like 8.8.8.8 resolves name resolution.",
        },
        {
          id: "r-winsock",
          text: "Winsock reset fixes corrupted network stack, but connectivity to external IPs is working. The problem is specifically DNS resolution.",
        },
        {
          id: "r-firewall",
          text: "Disabling the firewall entirely is a security risk and would not fix a DNS server being offline.",
        },
      ],
      correctRationaleId: "r-dns-fix",
      feedback: {
        perfect: "Correct! The internal DNS server is down. Switching to public DNS servers restores name resolution while the internal server is repaired.",
        partial: "You are on the right track with a network fix, but compare which pings succeed and which fail to pinpoint the issue.",
        wrong: "External connectivity works fine. The problem is specifically that the DNS server cannot be reached.",
      },
    },
    {
      type: "investigate-decide",
      id: "nni-scenario-3",
      title: "Proxy Misconfiguration",
      objective:
        "A laptop was moved from a corporate network to a home network. It connects to Wi-Fi but cannot browse websites.",
      investigationData: [
        {
          id: "ipconfig-output-3",
          label: "ipconfig Output",
          content:
            "IPv4 Address: 192.168.0.105\nSubnet Mask: 255.255.255.0\nDefault Gateway: 192.168.0.1\nDNS Servers: 192.168.0.1",
        },
        {
          id: "ping-test",
          label: "ping google.com",
          content:
            "Reply from 142.250.80.46: bytes=32 time=12ms TTL=117\nReply from 142.250.80.46: bytes=32 time=11ms TTL=117",
        },
        {
          id: "browser-error",
          label: "Browser Error Message",
          content:
            "ERR_PROXY_CONNECTION_FAILED — Unable to connect to the proxy server at proxy.corp.local:8080",
          isCritical: true,
        },
      ],
      actions: [
        { id: "remove-proxy", label: "Disable the proxy server in browser/system settings", color: "green" },
        { id: "renew-dhcp", label: "Run ipconfig /release and ipconfig /renew", color: "yellow" },
        { id: "reinstall-browser", label: "Reinstall the web browser", color: "red" },
      ],
      correctActionId: "remove-proxy",
      rationales: [
        {
          id: "r-proxy",
          text: "The laptop still has corporate proxy settings configured. Since it is on a home network, the proxy server is unreachable. Disabling the proxy allows direct internet access.",
        },
        {
          id: "r-dhcp-renew",
          text: "DHCP is working correctly as shown by a valid IP configuration. Renewing the lease would not change the proxy settings.",
        },
        {
          id: "r-browser",
          text: "The browser is functioning but is configured to use an unreachable proxy. Reinstalling would not remove system-level proxy settings.",
        },
      ],
      correctRationaleId: "r-proxy",
      feedback: {
        perfect: "Correct! The corporate proxy setting persists after moving networks. Disabling the proxy in Internet Options or system settings resolves the issue.",
        partial: "The network stack is healthy. Look at the browser error message for a clue about what is blocking web access.",
        wrong: "Ping confirms full connectivity including DNS resolution. The issue is at the application layer, not the network layer.",
      },
    },
  ],
  hints: [
    "Check each field in the ipconfig output carefully — is anything missing or incorrect?",
    "Compare which pings succeed and which fail to narrow down the layer of the problem.",
    "Consider whether the issue is at the network layer (IP routing) or the application layer (DNS, proxy).",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "The 'connected but no internet' call is one of the most frequent help desk tickets. Mastering this troubleshooting pattern will handle roughly 15-20% of your daily workload as a desktop support technician.",
  toolRelevance: ["ipconfig", "ping", "nslookup", "tracert"],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
