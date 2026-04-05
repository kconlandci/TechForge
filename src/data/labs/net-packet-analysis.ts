import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "net-packet-analysis",
  version: 1,
  title: "Network Packet Capture Analysis",
  tier: "advanced",
  track: "networking",
  difficulty: "challenging",
  accessLevel: "premium",
  tags: ["networking", "packet-analysis", "wireshark", "troubleshooting", "protocols"],
  description:
    "Analyze captured network packets to identify performance issues, security anomalies, and protocol misconfigurations. Use packet data as evidence to determine the root cause.",
  estimatedMinutes: 20,
  learningObjectives: [
    "Interpret TCP handshake sequences and identify connection failures",
    "Recognize common protocol patterns in packet captures",
    "Identify excessive retransmissions and their causes",
    "Detect suspicious traffic patterns that indicate security issues",
    "Use packet timing data to diagnose latency sources",
  ],
  sortOrder: 215,
  status: "published",
  prerequisites: [],
  rendererType: "investigate-decide",
  scenarios: [
    {
      type: "investigate-decide",
      id: "npa-scenario-1",
      title: "TCP Retransmission Storm",
      objective:
        "A file transfer between two servers is running at 10% of expected speed. Analyze the packet capture to determine the cause.",
      investigationData: [
        {
          id: "capture-stats",
          label: "Capture Statistics",
          content:
            "Total packets: 45,000 in 60 seconds\nTCP Retransmissions: 12,500 (27.8%)\nDuplicate ACKs: 8,200\nAverage RTT: 1.2ms\nSource: 10.0.1.10 -> Destination: 10.0.1.20\nWindow size: 65,535 bytes (normal)",
          isCritical: true,
        },
        {
          id: "retrans-pattern",
          label: "Retransmission Pattern",
          content:
            "Retransmissions occur in bursts every 2-3 seconds.\nPackets lost appear to be sequential (consecutive sequence numbers).\nBoth directions affected but Server A -> Server B is worse.\nNo retransmissions on traffic to other servers from either machine.",
          isCritical: true,
        },
        {
          id: "network-path",
          label: "Network Path Information",
          content:
            "Both servers on same switch (Switch 3, ports 10 and 12)\nSwitch 3 error counters: Port 10 — CRC errors: 4,521, Runts: 890\nPort 12 — CRC errors: 12, Runts: 0\nSwitch CPU: 15%, Memory: 45%",
        },
      ],
      actions: [
        { id: "replace-cable-port10", label: "Replace the cable on Switch 3 Port 10 (Server A)", color: "green" },
        { id: "increase-window", label: "Increase the TCP window size on both servers", color: "yellow" },
        { id: "upgrade-switch", label: "Replace Switch 3 with a higher-capacity model", color: "red" },
        { id: "enable-jumbo", label: "Enable jumbo frames on both servers", color: "yellow" },
      ],
      correctActionId: "replace-cable-port10",
      rationales: [
        {
          id: "r-cable",
          text: "Port 10 has 4,521 CRC errors and 890 runts, indicating physical layer corruption. A bad cable causes bit errors, triggering TCP retransmissions. Replacing the cable eliminates the error source.",
        },
        {
          id: "r-window",
          text: "The TCP window size is normal at 65,535 bytes. Increasing it would not help because packets are being corrupted in transit, not limited by flow control.",
        },
        {
          id: "r-switch-cap",
          text: "The switch CPU and memory are well within normal ranges. The errors are isolated to Port 10, not a switch-wide capacity issue.",
        },
      ],
      correctRationaleId: "r-cable",
      feedback: {
        perfect: "Correct! The high CRC error count on Port 10 indicates physical layer corruption. Replacing the cable eliminates the bit errors causing retransmissions.",
        partial: "You are looking at the right layer but check the switch port error counters for the definitive evidence.",
        wrong: "The retransmissions are caused by corrupted packets, not bandwidth or configuration issues. Check the switch error counters.",
      },
    },
    {
      type: "investigate-decide",
      id: "npa-scenario-2",
      title: "Suspicious DNS Traffic",
      objective:
        "The security team flagged unusual DNS traffic from a workstation. Analyze the packet capture to determine if this is malicious.",
      investigationData: [
        {
          id: "dns-stats",
          label: "DNS Traffic Summary",
          content:
            "Source: 192.168.1.75 (Accounting PC)\nDNS queries in last hour: 3,450 (normal baseline: ~50/hour)\nAll queries to: suspicious-cdn-relay.xyz\nQuery types: TXT records exclusively\nResponse sizes: 200-500 bytes each",
          isCritical: true,
        },
        {
          id: "query-samples",
          label: "Sample DNS Queries",
          content:
            "TXT query: aGVsbG8gd29ybGQ.suspicious-cdn-relay.xyz\nTXT query: dGhpcyBpcyBhIHR.suspicious-cdn-relay.xyz\nTXT query: lc3Qgb2YgZG5zIH.suspicious-cdn-relay.xyz\nSubdomain labels appear to be Base64-encoded data.",
          isCritical: true,
        },
        {
          id: "endpoint-info",
          label: "Endpoint Information",
          content:
            "User: jsmith (Accounting)\nLast login: 8:00 AM today\nRecent software installs: None approved\nAntivirus: Last scan 2 days ago, no alerts\nBrowser extensions: 12 installed, 3 unknown",
        },
      ],
      actions: [
        { id: "isolate-pc", label: "Immediately isolate the PC from the network and investigate for malware", color: "green" },
        { id: "block-domain", label: "Block suspicious-cdn-relay.xyz at the DNS server and continue monitoring", color: "yellow" },
        { id: "ignore", label: "This appears to be normal CDN traffic — no action needed", color: "red" },
      ],
      correctActionId: "isolate-pc",
      rationales: [
        {
          id: "r-isolate",
          text: "This is DNS tunneling — data exfiltration via encoded DNS queries. The Base64 subdomains, TXT-only queries, extreme query volume, and single suspicious domain are classic indicators. Isolating the PC prevents further data loss while forensic analysis proceeds.",
        },
        {
          id: "r-block-only",
          text: "Blocking the domain stops this specific channel but the malware could switch to another domain. The infected PC needs to be isolated and cleaned.",
        },
        {
          id: "r-ignore",
          text: "Normal CDN traffic does not use 3,450 TXT queries per hour with Base64-encoded subdomains to a single suspicious domain. This is clearly data exfiltration.",
        },
      ],
      correctRationaleId: "r-isolate",
      feedback: {
        perfect: "Correct! This is DNS tunneling used for data exfiltration. Immediate network isolation prevents further data loss while the machine is investigated.",
        partial: "Blocking the domain helps but the compromised machine is actively exfiltrating data and needs to be isolated immediately.",
        wrong: "This traffic pattern is a textbook example of DNS tunneling. The Base64-encoded subdomains and TXT query volume are clear indicators of malicious activity.",
      },
    },
    {
      type: "investigate-decide",
      id: "npa-scenario-3",
      title: "Application Timeout Analysis",
      objective:
        "A web application times out intermittently. The packet capture shows the TCP connection between the web server and database server.",
      investigationData: [
        {
          id: "tcp-timing",
          label: "TCP Connection Timing",
          content:
            "SYN -> SYN-ACK: 0.5ms (fast, normal)\nApplication request sent: +1ms\nDatabase response received: +3,200ms (SLOW)\nNormal database response time: 5-20ms\nPattern: Every 5th-6th request takes 3+ seconds\nApplication timeout setting: 5 seconds",
          isCritical: true,
        },
        {
          id: "db-server-stats",
          label: "Database Server Metrics",
          content:
            "CPU: 35% average, spikes to 95% every 30 seconds\nDisk I/O: Normal except during CPU spikes\nActive connections: 45 (max configured: 50)\nSlow query log: SELECT * FROM transactions WHERE date > '2024-01-01' — takes 3.1 seconds, runs every 30 seconds",
          isCritical: true,
        },
        {
          id: "network-check",
          label: "Network Path Check",
          content:
            "tracert shows 1 hop between web and database servers\nNo packet loss on the path\nLatency consistent at 0.5ms between hops\nNo TCP retransmissions in the capture",
        },
      ],
      actions: [
        { id: "optimize-query", label: "Optimize the slow database query and add an index on the date column", color: "green" },
        { id: "increase-timeout", label: "Increase the application timeout to 10 seconds", color: "yellow" },
        { id: "add-bandwidth", label: "Upgrade the network link between the servers", color: "red" },
      ],
      correctActionId: "optimize-query",
      rationales: [
        {
          id: "r-query",
          text: "The packet timing shows the delay is in database response time (3,200ms), not the network (0.5ms). A full table scan on the transactions table spikes the CPU every 30 seconds, blocking other queries. Adding an index dramatically reduces this query time.",
        },
        {
          id: "r-timeout",
          text: "Increasing the timeout masks the symptom but does not fix the root cause. Users still experience 3+ second delays and the database continues to be overloaded.",
        },
        {
          id: "r-bandwidth",
          text: "The network shows zero packet loss, sub-millisecond latency, and no retransmissions. The bottleneck is the database, not the network.",
        },
      ],
      correctRationaleId: "r-query",
      feedback: {
        perfect: "Correct! The packet timing proves the delay is in the database response, not the network. Optimizing the slow query eliminates the CPU spikes and 3-second delays.",
        partial: "You identified the right layer but the fix should address the root cause. Look at the slow query log for the specific problem.",
        wrong: "The network is performing perfectly (0.5ms, zero loss). The packet capture proves the delay is in the database processing time.",
      },
    },
  ],
  hints: [
    "High CRC errors and runts on a switch port typically indicate a physical layer problem like a bad cable.",
    "DNS tunneling uses encoded data in subdomain labels and generates abnormally high query volumes to a single domain.",
    "Packet timing reveals whether delays are in the network (high RTT) or the application (slow response after fast delivery).",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Packet analysis with Wireshark is a premium skill that separates senior network engineers from junior technicians. Being able to read packet captures and pinpoint issues earns significantly higher salaries in networking and cybersecurity roles.",
  toolRelevance: ["Wireshark", "tcpdump", "netstat", "switch CLI", "nslookup"],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
