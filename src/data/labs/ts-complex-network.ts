import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "ts-complex-network",
  version: 1,
  title: "Multi-Layer Network Troubleshooting",
  tier: "advanced",
  track: "hardware-network-troubleshooting",
  difficulty: "challenging",
  accessLevel: "premium",
  tags: [
    "network",
    "multi-layer",
    "vlan",
    "routing",
    "firewall",
    "advanced-troubleshooting",
  ],
  description:
    "Troubleshoot a complex network issue that spans multiple OSI layers, VLANs, and network devices. Isolate the failure point in a multi-segment enterprise network using methodical layer-by-layer analysis.",
  estimatedMinutes: 30,
  learningObjectives: [
    "Apply the OSI model systematically to isolate network failures at specific layers",
    "Diagnose VLAN configuration issues including trunk port misconfigurations",
    "Use tracert, pathping, and packet capture concepts to isolate multi-hop failures",
    "Interpret firewall logs and ACL rules that may silently drop traffic",
    "Coordinate troubleshooting across network segments involving multiple device types",
  ],
  sortOrder: 510,
  status: "published",
  prerequisites: [],
  rendererType: "triage-remediate",
  scenarios: [
    {
      id: "cn-scenario-1",
      type: "triage-remediate",
      title: "Inter-VLAN Communication Failure",
      description:
        "After a switch firmware upgrade over the weekend, users in the Accounting VLAN (VLAN 20, subnet 10.1.20.0/24) can communicate with each other but cannot reach the file server in the Server VLAN (VLAN 100, subnet 10.1.100.0/24). Users in Engineering (VLAN 30) and Sales (VLAN 40) can reach the file server normally.",
      evidence: [
        {
          type: "command-output",
          content:
            "From an Accounting PC (10.1.20.15): ping 10.1.20.1 (VLAN 20 gateway) — Success, <1ms. ping 10.1.100.10 (file server) — Request timed out. ping 10.1.30.1 (Engineering gateway) — Request timed out. tracert 10.1.100.10 — Hop 1: 10.1.20.1 <1ms, Hop 2: * * * Request timed out.",
        },
        {
          type: "switch-config",
          content:
            "The core switch (Layer 3) show ip route output includes routes for VLAN 20, 30, 40, and 100. Interface VLAN 20 shows 'up/up' with IP 10.1.20.1. However, 'show interfaces trunk' reveals that after the firmware upgrade, the trunk port connecting to the access switch for VLAN 20 is only carrying VLANs 1, 30, and 40 in the allowed list. VLAN 20 was dropped from the trunk allowed list during the upgrade.",
          icon: "switch",
        },
        {
          type: "verification",
          content:
            "From the core switch CLI: ping 10.1.20.15 from the VLAN 20 SVI — Success. This confirms the Layer 3 interface is up and routing exists, but the trunk port is not carrying VLAN 20 traffic to the access switch where the Accounting PCs are connected. Intra-VLAN traffic works because it stays on the access switch locally.",
        },
      ],
      classifications: [
        {
          id: "cn1-c-firewall",
          label: "Firewall Rule Blocking Accounting Traffic",
          description:
            "A new firewall rule is blocking traffic from the Accounting VLAN.",
        },
        {
          id: "cn1-c-trunk",
          label: "VLAN 20 Missing from Trunk Allowed List",
          description:
            "The switch firmware upgrade reset the trunk port allowed VLAN list, dropping VLAN 20 and preventing inter-VLAN routing for Accounting.",
        },
        {
          id: "cn1-c-routing",
          label: "Missing Route for VLAN 20 Subnet",
          description:
            "The routing table is missing the route for the 10.1.20.0/24 subnet.",
        },
      ],
      correctClassificationId: "cn1-c-trunk",
      remediations: [
        {
          id: "cn1-rem-add-vlan",
          label: "Add VLAN 20 back to the trunk allowed list",
          description:
            "On the core switch, add VLAN 20 to the trunk port allowed list: 'switchport trunk allowed vlan add 20'. Verify with 'show interfaces trunk' that VLAN 20 appears in the allowed, active, and forwarding columns.",
        },
        {
          id: "cn1-rem-add-route",
          label: "Add a static route for the 10.1.20.0/24 subnet",
          description:
            "Add a static route pointing the Accounting subnet to the correct next hop.",
        },
        {
          id: "cn1-rem-create-acl",
          label: "Create an ACL to permit Accounting VLAN traffic",
          description:
            "Create an access control list that explicitly permits traffic from VLAN 20.",
        },
      ],
      correctRemediationId: "cn1-rem-add-vlan",
      rationales: [
        {
          id: "cn1-rat1",
          text: "The trunk port allowed VLAN list shows VLAN 20 is missing after the firmware upgrade. Intra-VLAN traffic works (stays local on the access switch) but inter-VLAN traffic fails because VLAN 20 frames cannot cross the trunk to reach the Layer 3 switch for routing.",
        },
        {
          id: "cn1-rat2",
          text: "The route exists (show ip route confirmed it) and the SVI is up. The problem is Layer 2: the trunk is not carrying VLAN 20 tagged frames to the core switch.",
        },
      ],
      correctRationaleId: "cn1-rat1",
      feedback: {
        perfect:
          "Correct. The firmware upgrade dropped VLAN 20 from the trunk allowed list. Adding it back restores inter-VLAN routing for Accounting. Always verify trunk VLAN lists after firmware upgrades.",
        partial:
          "The routing table already has the correct routes. The issue is at Layer 2: the trunk port is not forwarding VLAN 20 frames.",
        wrong: "The evidence shows a Layer 2 trunk configuration issue, not a firewall or routing problem.",
      },
    },
    {
      id: "cn-scenario-2",
      type: "triage-remediate",
      title: "Asymmetric Routing Causing Connection Drops",
      description:
        "Users in the branch office can initiate connections to the headquarters file server, but the connections drop after exactly 30 seconds. The branch office connects to HQ via a site-to-site VPN. The issue started after a second ISP link was added to the HQ firewall for redundancy.",
      evidence: [
        {
          type: "command-output",
          content:
            "From branch office: ping 10.0.1.50 (HQ file server) — Replies received consistently, 45ms latency. TCP connections to port 445 (SMB) establish successfully but terminate after exactly 30 seconds. The firewall session table shows TCP sessions for branch office traffic being created on interface WAN1 but return traffic arriving on interface WAN2.",
        },
        {
          type: "firewall-log",
          content:
            "HQ Firewall log: 'Asymmetric traffic detected. Session on WAN1 but return packet on WAN2. Action: DROP after session timeout (30s).' The firewall has stateful inspection enabled and drops packets that arrive on a different interface than the original session was created on. This is the expected security behavior to prevent spoofing.",
        },
        {
          type: "routing-table",
          content:
            "HQ routing table shows two default routes: 0.0.0.0/0 via ISP1-GW (WAN1, metric 10) and 0.0.0.0/0 via ISP2-GW (WAN2, metric 20). However, ISP2's upstream router is advertising the branch office subnet via BGP, causing return traffic to take the WAN2 path instead of the VPN tunnel on WAN1.",
        },
      ],
      classifications: [
        {
          id: "cn2-c-vpn",
          label: "VPN Tunnel Configuration Error",
          description: "The VPN tunnel is misconfigured and dropping traffic.",
        },
        {
          id: "cn2-c-asymmetric",
          label: "Asymmetric Routing Due to Dual WAN",
          description:
            "Return traffic takes a different path than inbound traffic, causing the stateful firewall to drop the mismatched sessions.",
        },
        {
          id: "cn2-c-bandwidth",
          label: "Bandwidth Saturation on WAN1",
          description:
            "WAN1 is overloaded, causing traffic to spill over to WAN2.",
        },
      ],
      correctClassificationId: "cn2-c-asymmetric",
      remediations: [
        {
          id: "cn2-rem-policy-route",
          label: "Add a policy-based route for branch office return traffic",
          description:
            "Create a policy route on the HQ firewall that forces all traffic destined for the branch office subnet to exit via WAN1 (the VPN interface), ensuring symmetric routing regardless of the ISP2 BGP advertisement.",
        },
        {
          id: "cn2-rem-disable-wan2",
          label: "Disconnect the second ISP link",
          description:
            "Remove the WAN2 connection to eliminate the dual-path issue.",
        },
        {
          id: "cn2-rem-disable-stateful",
          label: "Disable stateful inspection on the firewall",
          description:
            "Turn off stateful packet inspection to allow asymmetric traffic.",
        },
      ],
      correctRemediationId: "cn2-rem-policy-route",
      rationales: [
        {
          id: "cn2-rat1",
          text: "The firewall logs explicitly show asymmetric routing: sessions created on WAN1 with return packets on WAN2. A policy-based route forces branch office traffic to use the correct interface, maintaining both the VPN and the redundant ISP link.",
        },
        {
          id: "cn2-rat2",
          text: "Disabling the second ISP removes redundancy that was intentionally added. Disabling stateful inspection eliminates a critical security feature. Policy routing solves the problem without sacrificing redundancy or security.",
        },
      ],
      correctRationaleId: "cn2-rat1",
      feedback: {
        perfect:
          "Correct. Policy-based routing ensures return traffic for VPN destinations uses the correct interface, resolving the asymmetric routing while preserving both the redundant WAN link and stateful security inspection.",
        partial:
          "Disconnecting WAN2 fixes the symptom but sacrifices the ISP redundancy that was the purpose of the change.",
        wrong: "Disabling stateful inspection is a severe security risk. Never disable security features to work around a routing issue.",
      },
    },
    {
      id: "cn-scenario-3",
      type: "triage-remediate",
      title: "DNS Resolution Works but HTTPS Fails",
      description:
        "Users on VLAN 50 (Guest Network) can resolve domain names and ping external IP addresses, but all HTTPS websites time out. HTTP websites load normally. The Guest VLAN was set up last week by the network team.",
      evidence: [
        {
          type: "command-output",
          content:
            "nslookup google.com — Resolves to correct IP. ping 142.250.80.46 (Google) — Replies received, 18ms. curl http://example.com — 200 OK, page loads. curl https://google.com — Connection timed out. telnet 142.250.80.46 80 — Connected. telnet 142.250.80.46 443 — Connection timed out.",
        },
        {
          type: "firewall-rule",
          content:
            "Firewall ACL for VLAN 50 (Guest): Rule 1: ALLOW DNS (UDP/TCP 53) to any. Rule 2: ALLOW HTTP (TCP 80) to any. Rule 3: ALLOW ICMP to any. Rule 4: DENY ALL. There is no rule permitting TCP port 443 (HTTPS). The network team configured HTTP access but forgot to include HTTPS.",
        },
        {
          type: "comparison",
          content:
            "The Employee VLAN firewall ACL includes: ALLOW TCP 80 (HTTP), ALLOW TCP 443 (HTTPS), ALLOW DNS, ALLOW ICMP, and additional rules. The Guest VLAN ACL is missing the TCP 443 rule.",
        },
      ],
      classifications: [
        {
          id: "cn3-c-ssl",
          label: "SSL/TLS Certificate Issue on Guest Network",
          description:
            "The guest network captive portal is interfering with HTTPS certificate validation.",
        },
        {
          id: "cn3-c-firewall-443",
          label: "Firewall ACL Missing TCP 443 Rule for Guest VLAN",
          description:
            "The Guest VLAN firewall rules permit HTTP but do not include a rule to allow HTTPS (TCP 443) traffic.",
        },
        {
          id: "cn3-c-proxy",
          label: "Web Proxy Misconfiguration",
          description:
            "A web proxy is intercepting and failing to forward HTTPS traffic.",
        },
      ],
      correctClassificationId: "cn3-c-firewall-443",
      remediations: [
        {
          id: "cn3-rem-add-443",
          label: "Add TCP 443 allow rule to the Guest VLAN ACL",
          description:
            "Insert a rule permitting TCP port 443 (HTTPS) outbound for the Guest VLAN, positioned before the DENY ALL rule. Verify by testing HTTPS connectivity from a guest device.",
        },
        {
          id: "cn3-rem-disable-firewall",
          label: "Remove the DENY ALL rule for the Guest VLAN",
          description:
            "Remove the default deny rule to allow all traffic from the Guest VLAN.",
        },
        {
          id: "cn3-rem-install-cert",
          label: "Install a trusted CA certificate on guest devices",
          description:
            "Push a certificate to guest devices to resolve SSL issues.",
        },
      ],
      correctRemediationId: "cn3-rem-add-443",
      rationales: [
        {
          id: "cn3-rat1",
          text: "The telnet test to port 443 times out while port 80 connects, and the firewall ACL explicitly shows no rule for TCP 443 before the DENY ALL. Adding the missing rule is the precise, minimal fix.",
        },
        {
          id: "cn3-rat2",
          text: "Removing DENY ALL opens the Guest VLAN to unrestricted access, which is a security risk. Guest networks should have explicit allow rules for only the traffic that is needed.",
        },
      ],
      correctRationaleId: "cn3-rat1",
      feedback: {
        perfect:
          "Correct. The telnet port test and ACL review conclusively show TCP 443 is blocked. Adding the specific rule resolves HTTPS while maintaining the security posture of the Guest VLAN.",
        partial:
          "Removing DENY ALL fixes the symptom but completely eliminates Guest VLAN security controls. Always use specific allow rules.",
        wrong: "This is not a certificate or proxy issue. The connection times out at the TCP level (port 443 blocked) before any SSL handshake occurs.",
      },
    },
  ],
  hints: [
    "When inter-VLAN traffic fails but intra-VLAN traffic works, check the trunk port VLAN allowed list and Layer 3 routing between VLANs.",
    "If TCP connections establish but drop after a consistent timeout, look for asymmetric routing or stateful firewall session mismatches.",
    "When HTTP works but HTTPS does not, test connectivity to port 443 specifically. If it times out, the issue is a firewall rule, not SSL.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Multi-layer network troubleshooting is the domain of network administrators and senior technicians. Demonstrating the ability to work through complex, multi-device issues in an interview sets you apart from candidates who only handle desktop-level problems.",
  toolRelevance: [
    "tracert / pathping",
    "telnet (port testing)",
    "Switch CLI (show interfaces trunk, show vlan)",
    "Firewall ACL review",
    "nslookup / dig",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
