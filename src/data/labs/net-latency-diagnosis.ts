import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "net-latency-diagnosis",
  version: 1,
  title: "High Latency Diagnosis for Applications",
  tier: "advanced",
  track: "networking",
  difficulty: "challenging",
  accessLevel: "premium",
  tags: ["networking", "latency", "performance", "troubleshooting", "traceroute"],
  description:
    "Specific applications are experiencing high latency while general internet browsing works fine. Triage the evidence, classify the latency source, and apply the correct remediation.",
  estimatedMinutes: 18,
  learningObjectives: [
    "Use tracert and pathping to identify latency at specific network hops",
    "Differentiate between network latency, server processing time, and DNS delays",
    "Classify latency issues by their root cause and network layer",
    "Apply QoS policies to prioritize latency-sensitive traffic",
  ],
  sortOrder: 218,
  status: "published",
  prerequisites: [],
  rendererType: "triage-remediate",
  scenarios: [
    {
      type: "triage-remediate",
      id: "nld-scenario-1",
      title: "VoIP Call Quality Degradation",
      description:
        "Users report choppy voice and dropped words on VoIP calls during peak hours (10 AM - 3 PM). Calls are fine before 9 AM and after 5 PM. Internet browsing speeds seem normal during peak hours.",
      evidence: [
        {
          type: "command-output",
          content: "pathping to VoIP provider (during peak hours):\nHop 1: 192.168.1.1 (gateway) — 1ms, 0% loss\nHop 2: 72.14.200.1 (ISP) — 8ms, 0% loss\nHop 3: 72.14.201.5 (ISP backbone) — 45ms, 2% loss\nHop 4-8: Various transit — 50-55ms, 0% loss\nHop 9: voip.provider.com — 55ms, 0% loss",
        },
        {
          type: "observation",
          content: "QoS monitoring dashboard:\nWAN link utilization: 95% during peak hours\nVoIP traffic: not prioritized (best-effort queue)\nLarge file downloads and video streaming detected during peak hours\nJitter during peak: 40ms (acceptable: <30ms)\nPacket loss during peak: 2% at ISP hop (acceptable: <1%)",
        },
        {
          type: "command-output",
          content: "Off-peak pathping to same VoIP provider:\nAll hops: <10ms latency, 0% packet loss\nWAN utilization off-peak: 30%",
        },
      ],
      classifications: [
        { id: "bandwidth-contention", label: "WAN Bandwidth Contention", description: "Bulk data transfers are consuming available bandwidth during peak hours, causing VoIP packet loss and jitter." },
        { id: "isp-congestion", label: "ISP Network Congestion", description: "The ISP backbone is congested during business hours affecting all customers." },
        { id: "voip-server", label: "VoIP Provider Server Overload", description: "The VoIP provider's servers are overloaded during peak hours." },
      ],
      correctClassificationId: "bandwidth-contention",
      remediations: [
        { id: "implement-qos", label: "Implement QoS", description: "Configure Quality of Service to prioritize VoIP traffic (DSCP EF marking) over bulk downloads and streaming on the WAN link." },
        { id: "upgrade-wan", label: "Upgrade WAN Bandwidth", description: "Increase the internet bandwidth from the ISP to accommodate all traffic types." },
        { id: "contact-isp", label: "Contact ISP About Congestion", description: "Open a support ticket with the ISP about the congestion at hop 3." },
      ],
      correctRemediationId: "implement-qos",
      rationales: [
        { id: "r-qos", text: "The WAN link is at 95% utilization during peak hours with no QoS. VoIP requires consistent low-latency delivery. QoS policies prioritize voice packets, ensuring they are sent first regardless of bulk traffic." },
        { id: "r-upgrade", text: "Upgrading bandwidth would help but is expensive and does not guarantee VoIP priority. Without QoS, a larger pipe can still be saturated by bulk transfers." },
      ],
      correctRationaleId: "r-qos",
      feedback: {
        perfect: "Correct! QoS prioritization ensures VoIP packets get preferential treatment during peak hours. This is more cost-effective than bandwidth upgrades and directly addresses the problem.",
        partial: "You identified the bandwidth issue but the most targeted fix is QoS rather than increasing overall capacity.",
        wrong: "The evidence shows the WAN link is saturated during peak hours. Off-peak performance is fine, ruling out ISP and VoIP provider issues.",
      },
    },
    {
      type: "triage-remediate",
      id: "nld-scenario-2",
      title: "Cloud Application Slowness",
      description:
        "The company's cloud CRM application takes 8-10 seconds to load pages. All other websites load in under 2 seconds. The CRM vendor says their servers are healthy.",
      evidence: [
        {
          type: "command-output",
          content: "tracert crm.vendor.com:\nHop 1: 192.168.1.1 — 1ms\nHop 2-5: ISP and transit — 15-25ms\nHop 6: crm-edge.vendor.com — 28ms\nTotal network latency: 28ms (acceptable)",
        },
        {
          type: "command-output",
          content: "Browser Developer Tools (F12) — Network tab:\nDNS lookup: 15ms\nTCP connect: 30ms\nTLS handshake: 45ms\nServer response (TTFB): 6,800ms (!!)\nContent download: 200ms\nTotal: ~7,100ms per page load",
          icon: "warning",
        },
        {
          type: "observation",
          content: "CRM app loads fast from a phone on cellular data (1.5 seconds).\nCRM loads fast from a coffee shop Wi-Fi (1.2 seconds).\nOnly slow from the office network.\nOffice uses a web proxy server for all HTTP/HTTPS traffic.",
        },
      ],
      classifications: [
        { id: "proxy-bottleneck", label: "Web Proxy Server Bottleneck", description: "The office web proxy server is adding significant processing delay to CRM traffic, inflating the Time to First Byte." },
        { id: "wan-latency", label: "WAN Path Latency", description: "The network path from the office to the CRM vendor has excessive latency." },
        { id: "crm-server-slow", label: "CRM Server Performance", description: "The CRM vendor's servers are slow in responding to requests." },
      ],
      correctClassificationId: "proxy-bottleneck",
      remediations: [
        { id: "bypass-proxy", label: "Bypass Proxy for CRM", description: "Add crm.vendor.com to the proxy bypass list so CRM traffic goes directly to the internet without proxy processing." },
        { id: "upgrade-proxy", label: "Upgrade Proxy Hardware", description: "Replace the proxy server with a more powerful machine to reduce processing delay." },
        { id: "contact-crm", label: "Escalate to CRM Vendor", description: "Open a support ticket with the CRM vendor about slow server response times." },
      ],
      correctRemediationId: "bypass-proxy",
      rationales: [
        { id: "r-bypass", text: "The CRM loads fast on cellular and coffee shop Wi-Fi (no proxy). Network latency is only 28ms. The 6,800ms TTFB is caused by the proxy server processing. Bypassing the proxy for this trusted domain immediately resolves the slowness." },
        { id: "r-hardware", text: "Upgrading proxy hardware may help but bypassing the proxy for trusted cloud applications is simpler, faster, and addresses the root cause directly." },
      ],
      correctRationaleId: "r-bypass",
      feedback: {
        perfect: "Correct! The proxy server is adding 6+ seconds of processing delay. Bypassing it for the trusted CRM domain provides immediate relief.",
        partial: "You identified the proxy involvement but the quickest fix is bypassing it for specific trusted domains rather than upgrading hardware.",
        wrong: "The CRM works fast from other networks without a proxy. Network latency is only 28ms. The proxy is the bottleneck.",
      },
    },
    {
      type: "triage-remediate",
      id: "nld-scenario-3",
      title: "Gaming and Video Conference Lag",
      description:
        "A remote employee working from home experiences lag spikes during video calls and has high ping in speed tests. Their ISP advertises 100 Mbps download speeds.",
      evidence: [
        {
          type: "command-output",
          content: "Speedtest results:\nDownload: 92 Mbps (good)\nUpload: 4.5 Mbps\nPing: 15ms\nJitter: 8ms\n\nBut during a video call:\nPing spikes to 200-400ms\nUpload drops to 0.5 Mbps\nVideo freezes for 2-3 seconds repeatedly",
        },
        {
          type: "observation",
          content: "The employee's teenager is uploading videos to social media during work hours.\nHome router: Consumer model, no QoS features enabled.\nWAN upload bandwidth: 5 Mbps total (cable internet, asymmetric).\nVideo call requires: ~2 Mbps upload for HD video.",
        },
        {
          type: "command-output",
          content: "Router status during video call:\nUpload utilization: 99%\nActive upload connections:\n- Social media upload: 3.8 Mbps\n- Video call: 0.7 Mbps (should be 2 Mbps)\n- OS updates: 0.3 Mbps\n- Other: 0.2 Mbps",
        },
      ],
      classifications: [
        { id: "upload-saturation", label: "Upload Bandwidth Saturation", description: "The limited upload bandwidth (5 Mbps) is completely saturated by social media uploads, starving the video call of needed bandwidth." },
        { id: "isp-throttle", label: "ISP Throttling Video", description: "The ISP is throttling video conferencing traffic during peak hours." },
        { id: "wifi-interference", label: "Wi-Fi Interference", description: "Wireless interference in the home is causing packet loss and latency spikes." },
      ],
      correctClassificationId: "upload-saturation",
      remediations: [
        { id: "enable-sqm", label: "Enable SQM/QoS on Router", description: "Enable Smart Queue Management (SQM) or QoS on the home router to prioritize video call traffic and limit upload bandwidth per device." },
        { id: "upgrade-isp", label: "Upgrade ISP Plan", description: "Upgrade to a plan with higher upload speeds (e.g., fiber with symmetric upload)." },
        { id: "wire-connection", label: "Switch to Wired Ethernet", description: "Connect the work laptop directly to the router via Ethernet cable." },
      ],
      correctRemediationId: "enable-sqm",
      rationales: [
        { id: "r-sqm", text: "SQM/QoS on the router limits social media upload bandwidth and prioritizes video call traffic. This immediately fixes the bufferbloat causing 200-400ms latency spikes without requiring an ISP upgrade." },
        { id: "r-isp", text: "Upgrading upload speed would help but is a longer-term solution. QoS provides immediate relief using the existing 5 Mbps upload by managing how it is shared." },
      ],
      correctRationaleId: "r-sqm",
      feedback: {
        perfect: "Correct! SQM/QoS on the home router prevents the social media uploads from starving the video call. This is the fastest and most cost-effective fix for upload saturation.",
        partial: "You identified the upload bandwidth issue but the quickest remedy is traffic prioritization on the existing connection.",
        wrong: "The speedtest shows 92 Mbps download is fine. The problem is the 5 Mbps upload being consumed by social media uploads. Check the upload utilization.",
      },
    },
  ],
  hints: [
    "Compare application performance from different network locations to identify whether the issue is local, network-path, or server-side.",
    "Time to First Byte (TTFB) in browser developer tools reveals whether the delay is network transit or server/proxy processing.",
    "Upload bandwidth saturation causes bufferbloat — where ACK packets are delayed, creating latency spikes even for download-heavy activities.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Latency diagnosis is a high-level troubleshooting skill valued in network operations centers (NOCs) and managed service providers. Understanding where in the network path the delay occurs prevents wasted time investigating the wrong components.",
  toolRelevance: ["tracert", "pathping", "browser dev tools", "QoS configuration", "speedtest"],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
