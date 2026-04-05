import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "net-wan-failover",
  version: 1,
  title: "WAN Failover Configuration",
  tier: "advanced",
  track: "networking",
  difficulty: "challenging",
  accessLevel: "premium",
  tags: ["networking", "wan", "failover", "redundancy", "high-availability"],
  description:
    "Configure WAN failover on a dual-WAN router so the office automatically switches to a backup internet connection when the primary link fails.",
  estimatedMinutes: 18,
  learningObjectives: [
    "Configure primary and secondary WAN connections on a dual-WAN router",
    "Set up health check monitoring to detect WAN link failures",
    "Choose appropriate failover vs load-balancing strategies",
    "Understand DNS and routing implications during WAN failover",
    "Plan for automatic failback when the primary link recovers",
  ],
  sortOrder: 216,
  status: "published",
  prerequisites: [],
  rendererType: "action-rationale",
  scenarios: [
    {
      type: "action-rationale",
      id: "nwf-scenario-1",
      title: "Failover Mode Selection",
      context:
        "A small medical office has a primary 200 Mbps fiber connection and a backup 50 Mbps cable connection. They process patient records that require reliable connectivity. The primary link had two outages last quarter lasting 2-4 hours each. The backup link costs $80/month and they want to minimize unnecessary usage.",
      actions: [
        { id: "active-passive", label: "Active-Passive Failover (backup only activates on primary failure)", color: "green" },
        { id: "load-balance", label: "Active-Active Load Balancing (use both links simultaneously)", color: "yellow" },
        { id: "round-robin", label: "Round-Robin DNS (alternate between links per request)", color: "red" },
      ],
      correctActionId: "active-passive",
      rationales: [
        {
          id: "r-passive",
          text: "Active-passive failover keeps the backup idle until needed, minimizing backup bandwidth costs. When the primary fails, traffic seamlessly shifts to the 50 Mbps backup, which is adequate for a small office.",
        },
        {
          id: "r-load",
          text: "Load balancing uses both links constantly, increasing the backup line usage and cost. The 50 Mbps backup also has much less capacity, creating asymmetric performance. For a small office, the primary alone is sufficient.",
        },
        {
          id: "r-dns",
          text: "Round-robin DNS does not detect link failures. If the primary goes down, half the traffic still routes to the dead link until DNS records are updated, which can take hours.",
        },
      ],
      correctRationaleId: "r-passive",
      feedback: {
        perfect: "Correct! Active-passive failover provides reliability during outages while keeping backup costs low for this small office.",
        partial: "Your choice provides redundancy but consider the cost and complexity implications for a small medical office.",
        wrong: "For a small office with a cost-conscious backup link, active-passive failover provides the best balance of reliability and economy.",
      },
    },
    {
      type: "action-rationale",
      id: "nwf-scenario-2",
      title: "Health Check Configuration",
      context:
        "You need to configure the WAN health check that determines when to fail over. The router can ping a target IP at configurable intervals. The primary ISP gateway is 72.14.200.1 but the ISP has had routing issues where the gateway responds but internet is unreachable beyond it.",
      actions: [
        { id: "ping-external", label: "Ping multiple public IPs (8.8.8.8 and 1.1.1.1) every 10 seconds, failover after 3 consecutive failures", color: "green" },
        { id: "ping-gateway", label: "Ping the ISP gateway (72.14.200.1) every 30 seconds, failover after 1 failure", color: "yellow" },
        { id: "ping-internal", label: "Ping the router's own WAN interface every 5 seconds", color: "red" },
      ],
      correctActionId: "ping-external",
      rationales: [
        {
          id: "r-external",
          text: "Pinging external IPs beyond the ISP catches both link failures and ISP routing problems. Using multiple targets prevents false failovers if one target is temporarily unreachable. Three consecutive failures avoids triggering on brief packet loss.",
        },
        {
          id: "r-gateway-only",
          text: "Pinging only the ISP gateway misses routing issues beyond the gateway. The ISP had exactly this type of problem. Also, failing over after just 1 failure causes unnecessary switchovers from momentary packet loss.",
        },
        {
          id: "r-internal",
          text: "Pinging the router's own interface only tests that the interface is up, not that the link has internet connectivity. This provides almost no useful health information.",
        },
      ],
      correctRationaleId: "r-external",
      feedback: {
        perfect: "Correct! Pinging multiple external targets every 10 seconds with a 3-failure threshold provides reliable failure detection without false positives.",
        partial: "Your monitoring approach detects some failures but consider the ISP routing issue history. The health check should verify end-to-end connectivity.",
        wrong: "Health checks must verify actual internet reachability, not just local link or gateway status.",
      },
    },
    {
      type: "action-rationale",
      id: "nwf-scenario-3",
      title: "Failback Strategy",
      context:
        "The primary WAN link has recovered after a 3-hour outage. The office has been running on the backup 50 Mbps connection. Some users are in the middle of large file uploads to cloud services. The router can be configured for automatic or manual failback.",
      actions: [
        { id: "gradual-failback", label: "Automatic failback after 5 minutes of stable primary connectivity, with new connections on primary and existing on backup until complete", color: "green" },
        { id: "immediate-failback", label: "Immediately switch all traffic back to primary the instant it recovers", color: "yellow" },
        { id: "manual-failback", label: "Require manual administrator action to switch back to primary", color: "blue" },
      ],
      correctActionId: "gradual-failback",
      rationales: [
        {
          id: "r-gradual",
          text: "A 5-minute stability check ensures the primary is truly recovered and not flapping. Routing new connections to primary while letting existing transfers finish on backup prevents disrupting in-progress uploads.",
        },
        {
          id: "r-immediate",
          text: "Immediate failback risks disrupting active transfers and sessions. If the primary is unstable and flapping, it causes repeated failover/failback cycles that disrupt all users.",
        },
        {
          id: "r-manual",
          text: "Manual failback provides maximum control but keeps users on the slower 50 Mbps connection until an admin intervenes, which could be hours if the outage occurs after business hours.",
        },
      ],
      correctRationaleId: "r-gradual",
      feedback: {
        perfect: "Correct! Gradual failback with a stability delay prevents link flapping and preserves active connections during the transition.",
        partial: "Your approach addresses failback but consider the impact on in-progress file transfers and the risk of link flapping.",
        wrong: "Both immediate and manual approaches have significant drawbacks. Gradual failback with a stability timer is the balanced approach.",
      },
    },
  ],
  hints: [
    "Active-passive failover keeps the backup idle until the primary fails, minimizing backup bandwidth costs.",
    "Health checks should test end-to-end internet reachability, not just local gateway connectivity.",
    "Failback should include a stability timer to prevent link flapping if the primary connection is intermittent.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "WAN failover configuration is a valuable skill for managed service providers and small business IT. Clients pay premium rates for guaranteed uptime, and proper failover design prevents costly outages.",
  toolRelevance: ["router admin interface", "ping", "tracert", "speedtest", "network monitoring"],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
