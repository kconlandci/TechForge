import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "ts-intermittent-drops",
  version: 1,
  title: "Diagnose Intermittent Network Drops",
  tier: "intermediate",
  track: "hardware-network-troubleshooting",
  difficulty: "moderate",
  accessLevel: "free",
  tags: [
    "network",
    "intermittent",
    "ping",
    "tracert",
    "duplex",
    "troubleshooting",
  ],
  description:
    "A user experiences random network disconnections throughout the day. Use continuous ping, tracert, and NIC diagnostics to identify whether the problem is local, infrastructure, or ISP-related.",
  estimatedMinutes: 20,
  learningObjectives: [
    "Use continuous ping to establish a baseline and detect packet loss patterns",
    "Interpret tracert output to isolate which network hop is causing drops",
    "Check NIC duplex and speed settings for auto-negotiation mismatches",
    "Correlate intermittent symptoms with environmental or infrastructure triggers",
    "Document an intermittent issue for escalation with supporting data",
  ],
  sortOrder: 505,
  status: "published",
  prerequisites: [],
  rendererType: "investigate-decide",
  scenarios: [
    {
      id: "id-scenario-1",
      type: "investigate-decide",
      title: "Packet Loss to Default Gateway",
      objective:
        "A user reports their network drops randomly 3-5 times per day for about 30 seconds each time. You set up continuous ping tests to multiple destinations. Analyze the results to determine where the failure is occurring.",
      investigationData: [
        {
          id: "id1-ping-gateway",
          label: "Continuous Ping to Default Gateway (10.1.1.1)",
          content:
            "ping -t 10.1.1.1 running for 2 hours. Results: 7,200 packets sent, 7,014 received, 186 lost (2.6% loss). Losses occur in bursts of 15-20 consecutive packets every 20-40 minutes, then connectivity resumes. During loss bursts, the NIC link light on the PC flickers off and back on.",
          isCritical: true,
        },
        {
          id: "id1-ping-external",
          label: "Continuous Ping to External Host (8.8.8.8)",
          content:
            "ping -t 8.8.8.8 results mirror the gateway ping exactly. Losses occur at the same timestamps as gateway losses. When the gateway is reachable, external hosts are also reachable with normal latency (22ms).",
        },
        {
          id: "id1-nic-status",
          label: "NIC Event Log and Configuration",
          content:
            "Event Viewer shows repeated 'Network link has been established at 100 Mbps Full Duplex' events corresponding to each drop period. The NIC is set to Auto-Negotiation. The switch port is configured for 1 Gbps Full Duplex (forced). The cable run from the wall jack to the IDF patch panel is 85 meters (within spec for Cat5e). The patch cable at the user's desk is visibly bent at a sharp angle where the desk leg presses against it.",
          isCritical: true,
        },
      ],
      actions: [
        {
          id: "id1-replace-cable",
          label: "Replace the damaged patch cable and set the switch port to auto-negotiation to match the NIC",
          color: "green",
        },
        {
          id: "id1-replace-nic",
          label: "Replace the network interface card",
          color: "orange",
        },
        {
          id: "id1-call-isp",
          label: "Contact the ISP about packet loss",
          color: "red",
        },
        {
          id: "id1-static-speed",
          label: "Force the NIC to 100 Mbps to match what it keeps negotiating down to",
          color: "yellow",
        },
      ],
      correctActionId: "id1-replace-cable",
      rationales: [
        {
          id: "id1-r1",
          text: "The link light flickers during drops and the NIC renegotiates to 100 Mbps each time, indicating a physical layer issue. The damaged patch cable under the desk leg is causing intermittent contact loss. Additionally, the switch port forced to 1 Gbps while the NIC is on auto-negotiate causes duplex mismatches during renegotiation.",
        },
        {
          id: "id1-r2",
          text: "The NIC successfully establishes links after each drop, showing it is functional. The problem is the physical cable causing link resets.",
        },
        {
          id: "id1-r3",
          text: "The loss pattern occurs between the PC and the first hop (gateway). Since ping to the gateway drops simultaneously with external ping, the problem is local, not ISP-related.",
        },
        {
          id: "id1-r4",
          text: "Forcing 100 Mbps is a workaround that reduces bandwidth tenfold and does not address the physical cable damage causing the intermittent link drops.",
        },
      ],
      correctRationaleId: "id1-r1",
      feedback: {
        perfect:
          "Correct. The damaged cable causes link drops, and the speed mismatch between forced 1 Gbps on the switch and auto-negotiate on the NIC creates renegotiation issues. Fix the cable and align the speed settings.",
        partial:
          "Forcing a lower speed works around the cable issue but does not fix it and sacrifices bandwidth.",
        wrong: "The problem is between the PC and the switch. External factors and hardware replacement are not indicated.",
      },
    },
    {
      id: "id-scenario-2",
      type: "investigate-decide",
      title: "Drops Only to External Hosts",
      objective:
        "A different user reports they lose internet access several times a day but can always access internal file shares during the outages. Analyze the diagnostic data to identify the failure point.",
      investigationData: [
        {
          id: "id2-ping-results",
          label: "Simultaneous Ping Tests",
          content:
            "ping -t 10.1.1.1 (gateway): 0% loss over 3 hours, consistent 1ms. ping -t 10.1.1.254 (firewall inside): 0% loss, consistent 1ms. ping -t 203.0.113.1 (firewall outside/ISP): Intermittent timeouts, 4.2% loss in bursts. ping -t 8.8.8.8 (external): Same loss pattern as firewall outside interface.",
          isCritical: true,
        },
        {
          id: "id2-tracert",
          label: "Tracert During an Active Drop",
          content:
            "tracert 8.8.8.8 during a drop: Hop 1 (10.1.1.1 gateway) <1ms. Hop 2 (10.1.1.254 firewall) <1ms. Hop 3 (203.0.113.1 ISP router) * * * Request timed out. Hop 4 onwards: All time out. Tracert during normal operation: All hops respond normally with expected latency.",
          isCritical: true,
        },
        {
          id: "id2-firewall-logs",
          label: "Firewall Interface Statistics",
          content:
            "The firewall WAN interface shows CRC errors incrementing steadily: 847 errors in the last 24 hours. The WAN interface connects to the ISP modem via a short Cat6 cable. Input errors and output errors on the LAN interface are zero.",
        },
      ],
      actions: [
        {
          id: "id2-replace-wan-cable",
          label: "Replace the cable between the firewall WAN port and the ISP modem, and contact the ISP if errors persist",
          color: "green",
        },
        {
          id: "id2-reboot-firewall",
          label: "Reboot the firewall to clear the error counters",
          color: "orange",
        },
        {
          id: "id2-reconfigure-dns",
          label: "Change the DNS server configuration",
          color: "red",
        },
        {
          id: "id2-upgrade-firewall",
          label: "Replace the firewall with a newer model",
          color: "blue",
        },
      ],
      correctActionId: "id2-replace-wan-cable",
      rationales: [
        {
          id: "id2-r1",
          text: "The tracert and ping data show the failure point is between the firewall and the ISP router. CRC errors on the WAN interface confirm physical layer corruption on that link. Replacing the cable addresses the most likely cause, with ISP escalation as the next step if errors continue.",
        },
        {
          id: "id2-r2",
          text: "Rebooting the firewall resets counters but does not fix the physical cable or ISP link causing the CRC errors. The errors will resume immediately.",
        },
        {
          id: "id2-r3",
          text: "DNS is not involved. The ping tests use IP addresses directly and still show packet loss, proving the issue is at the network layer, not DNS.",
        },
        {
          id: "id2-r4",
          text: "The firewall LAN interface has zero errors and the issue is specific to the WAN link. Replacing the firewall does not fix a cable or ISP problem.",
        },
      ],
      correctRationaleId: "id2-r1",
      feedback: {
        perfect:
          "Correct. You isolated the failure to the WAN link using progressive ping tests and tracert, then confirmed with CRC errors on the WAN interface. Cable replacement first, ISP escalation if needed.",
        partial:
          "Rebooting clears counters but does not fix the physical layer issue. The CRC errors indicate a cable or connector problem.",
        wrong: "The failure point has been clearly identified between the firewall and ISP. The fix must address that specific link.",
      },
    },
    {
      id: "id-scenario-3",
      type: "investigate-decide",
      title: "Time-Correlated Network Drops",
      objective:
        "A user reports network drops every day at approximately the same times: around 9:00 AM, 12:00 PM, and 5:00 PM. The drops last 2-3 minutes. Other users in the area are not affected. Investigate the pattern.",
      investigationData: [
        {
          id: "id3-ping-log",
          label: "24-Hour Continuous Ping Log with Timestamps",
          content:
            "Packet loss events logged at 8:57 AM (45 packets lost), 12:02 PM (38 packets lost), and 4:58 PM (52 packets lost). All other times show 0% loss. During each loss event, the NIC link remains up (link light stays solid) but no packets are delivered.",
          isCritical: true,
        },
        {
          id: "id3-environment",
          label: "Environmental and Physical Investigation",
          content:
            "The user's desk is next to the break room. The user's network cable runs through the ceiling plenum alongside a bundle of power cables feeding the break room appliances. The break room has a commercial microwave, a refrigerator, and a coffee machine that all cycle at peak usage times (morning arrival, lunch, end of day). An electrician confirms the network cable is not shielded (UTP Cat5e) and runs parallel to the power cables for approximately 15 feet.",
          isCritical: true,
        },
        {
          id: "id3-switch-logs",
          label: "Switch Port Statistics",
          content:
            "The switch port for this user shows increasing FCS (Frame Check Sequence) errors during the reported drop times. Error counts spike when cross-referenced with the break room usage schedule. No FCS errors on adjacent switch ports.",
        },
      ],
      actions: [
        {
          id: "id3-reroute-cable",
          label: "Reroute the network cable away from the power cables or replace it with shielded (STP) cable",
          color: "green",
        },
        {
          id: "id3-replace-switch",
          label: "Replace the access switch due to FCS errors",
          color: "red",
        },
        {
          id: "id3-replace-microwave",
          label: "Replace the break room microwave with a newer model",
          color: "orange",
        },
        {
          id: "id3-add-ups",
          label: "Install a UPS on the user's desk to filter power",
          color: "blue",
        },
      ],
      correctActionId: "id3-reroute-cable",
      rationales: [
        {
          id: "id3-r1",
          text: "The time correlation with break room appliance usage, the unshielded cable running parallel to power cables, and FCS errors on only this port all indicate electromagnetic interference (EMI) corrupting the network signal. Rerouting or using shielded cable eliminates the interference source.",
        },
        {
          id: "id3-r2",
          text: "The switch is not faulty. FCS errors on a single port during specific times indicate corrupted frames arriving at the switch, not a switch hardware problem.",
        },
        {
          id: "id3-r3",
          text: "The microwave is not defective. The problem is the cable routing, not the appliances themselves. Any high-power electrical equipment would cause similar EMI on an unshielded cable run alongside it.",
        },
        {
          id: "id3-r4",
          text: "A UPS conditions power to the PC, but the interference is on the network cable, not the power supply. The corrupted frames occur on the Ethernet link, not the electrical supply.",
        },
      ],
      correctRationaleId: "id3-r1",
      feedback: {
        perfect:
          "Excellent. You correlated the time-based pattern with environmental factors and identified EMI from parallel power cables as the root cause. Rerouting or shielding the cable is the correct fix.",
        partial:
          "Replacing the microwave would reduce one source of EMI, but the fundamental problem is cable routing alongside power lines.",
        wrong: "The evidence points to EMI on the network cable, not a switch or power issue at the user's desk.",
      },
    },
  ],
  hints: [
    "Use continuous ping (ping -t) to multiple destinations simultaneously to determine which hop is failing.",
    "If the link light flickers during drops, the problem is at the physical layer: cable, connector, or port.",
    "Time-correlated failures often point to environmental factors like EMI, temperature changes, or scheduled processes.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Intermittent network issues are among the most challenging and frustrating tickets to resolve. Technicians who can methodically isolate intermittent problems using continuous monitoring and correlation analysis are highly valued in enterprise environments.",
  toolRelevance: [
    "ping (continuous with -t flag)",
    "tracert / traceroute",
    "Event Viewer",
    "Switch port statistics",
    "Cable tester",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
