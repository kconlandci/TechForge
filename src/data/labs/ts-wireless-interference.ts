import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "ts-wireless-interference",
  version: 1,
  title: "Diagnose Wi-Fi Performance Degradation",
  tier: "advanced",
  track: "hardware-network-troubleshooting",
  difficulty: "challenging",
  accessLevel: "premium",
  tags: [
    "wireless",
    "wifi",
    "interference",
    "channel",
    "signal",
    "troubleshooting",
  ],
  description:
    "Wi-Fi performance has degraded significantly in a specific area of the office. Use Wi-Fi analysis tools, channel surveys, and interference detection to identify and resolve the root cause of poor wireless performance.",
  estimatedMinutes: 25,
  learningObjectives: [
    "Use Wi-Fi analyzer tools to evaluate signal strength, noise, and channel utilization",
    "Identify co-channel interference and overlapping channel conflicts on 2.4 GHz",
    "Recognize non-Wi-Fi interference sources such as microwaves and Bluetooth devices",
    "Apply channel planning and power adjustments to optimize wireless coverage",
    "Distinguish between interference, capacity, and configuration issues",
  ],
  sortOrder: 512,
  status: "published",
  prerequisites: [],
  rendererType: "investigate-decide",
  scenarios: [
    {
      id: "wi-scenario-1",
      type: "investigate-decide",
      title: "2.4 GHz Channel Congestion",
      objective:
        "Users in the open office area report extremely slow Wi-Fi speeds (2-5 Mbps down) despite being close to an access point. Wired users at adjacent desks have no performance issues. The Wi-Fi was fine 3 months ago when the company occupied half the floor. Since then, two neighboring companies moved into the same building floor. Investigate the wireless environment.",
      investigationData: [
        {
          id: "wi1-analyzer",
          label: "Wi-Fi Analyzer Scan (2.4 GHz Band)",
          content:
            "The scan shows 23 SSIDs visible on the 2.4 GHz band. Your company AP is on channel 6. Neighboring company A has 3 APs on channel 6. Neighboring company B has 2 APs on channel 5 and 2 on channel 7 (overlapping with channel 6). Channel utilization on channel 6 is 94%. Channels 1 and 11 show 45% and 52% utilization respectively. Signal strength from your AP is -55 dBm (good).",
          isCritical: true,
        },
        {
          id: "wi1-client-stats",
          label: "Client Connection Statistics",
          content:
            "Connected clients on the affected AP: 47 devices. The AP model supports a maximum of 50 concurrent clients. Client connection rates show most devices connected at 54 Mbps (802.11g fallback) instead of the expected 300 Mbps (802.11n). The AP is configured for 2.4 GHz only; the 5 GHz radio is disabled in the controller.",
          isCritical: true,
        },
        {
          id: "wi1-signal-map",
          label: "Signal Coverage Heat Map",
          content:
            "Signal strength across the open office ranges from -50 dBm to -65 dBm (adequate coverage). The issue is not signal strength but rather channel contention: many APs competing for the same airtime on channel 6.",
        },
      ],
      actions: [
        {
          id: "wi1-boost-power",
          label: "Increase the transmit power on your AP to overpower the neighboring signals",
          color: "red",
        },
        {
          id: "wi1-enable-5ghz",
          label: "Enable the 5 GHz radio on the AP, move capable devices to 5 GHz, and change the 2.4 GHz channel to 1 or 11",
          color: "green",
        },
        {
          id: "wi1-add-more-aps",
          label: "Install 3 more access points to increase coverage",
          color: "orange",
        },
        {
          id: "wi1-complain-neighbors",
          label: "Ask the neighboring companies to change their Wi-Fi channels",
          color: "blue",
        },
      ],
      correctActionId: "wi1-enable-5ghz",
      rationales: [
        {
          id: "wi1-r1",
          text: "Channel 6 on 2.4 GHz is saturated at 94% utilization by multiple competing APs. Enabling 5 GHz provides much more available spectrum with far less congestion. Moving the remaining 2.4 GHz radio to channel 1 or 11 reduces co-channel interference since those channels are less utilized.",
        },
        {
          id: "wi1-r2",
          text: "Increasing transmit power makes the interference worse for everyone, including your own clients, and violates good wireless design principles. It does not increase available airtime.",
        },
        {
          id: "wi1-r3",
          text: "Adding more 2.4 GHz APs in an already congested environment adds more co-channel interference. The problem is airtime contention, not coverage.",
        },
        {
          id: "wi1-r4",
          text: "You cannot control neighboring companies' wireless configurations. The solution must be within your own infrastructure.",
        },
      ],
      correctRationaleId: "wi1-r1",
      feedback: {
        perfect:
          "Correct. Moving to 5 GHz leverages the much wider spectrum with less congestion, and optimizing the 2.4 GHz channel to 1 or 11 minimizes co-channel interference. This is standard enterprise wireless remediation.",
        partial:
          "Asking neighbors is reasonable in theory but you cannot depend on their cooperation. You must fix what you control.",
        wrong: "Increasing power or adding APs in a congested 2.4 GHz environment makes the problem worse, not better.",
      },
    },
    {
      id: "wi-scenario-2",
      type: "investigate-decide",
      title: "Periodic Wi-Fi Drops Near Break Room",
      objective:
        "Users in the desks nearest the break room experience Wi-Fi disconnections and severe packet loss during lunch hours (11:30 AM to 1:30 PM) and morning break (9:30-10:00 AM). The rest of the day is fine. The Wi-Fi is on the 2.4 GHz band in this area. Investigate the interference pattern.",
      investigationData: [
        {
          id: "wi2-spectrum",
          label: "Spectrum Analyzer Readings",
          content:
            "A spectrum analyzer running during the lunch hour shows broadband interference across the entire 2.4 GHz band (channels 1-11) in 15-second bursts followed by 5-second gaps. The interference pattern is consistent with a commercial microwave oven operating at 2.45 GHz. The noise floor during bursts rises from -95 dBm to -45 dBm, effectively drowning out the Wi-Fi signal.",
          isCritical: true,
        },
        {
          id: "wi2-ap-logs",
          label: "Access Point Controller Logs",
          content:
            "The AP nearest the break room logs show: 'Radar/interference detected on channel 6, clients deauthenticated' during lunch periods. Client retry rates spike to 45% (normal is under 5%). The AP attempts Dynamic Frequency Selection (DFS) channel changes but the interference spans all 2.4 GHz channels.",
          isCritical: true,
        },
        {
          id: "wi2-5ghz-check",
          label: "5 GHz Band Status in Affected Area",
          content:
            "The APs in this area have 5 GHz radios enabled. Clients connected to 5 GHz during the interference period show normal performance with no packet loss. The microwave interference does not affect the 5 GHz band. However, 60% of the affected clients are connected to 2.4 GHz because their devices default to the stronger 2.4 GHz signal.",
        },
      ],
      actions: [
        {
          id: "wi2-replace-microwave",
          label: "Replace the break room microwave with a newer, better-shielded model",
          color: "orange",
        },
        {
          id: "wi2-band-steering",
          label: "Enable band steering on the APs to push capable clients to 5 GHz, and reduce 2.4 GHz transmit power near the break room to encourage 5 GHz association",
          color: "green",
        },
        {
          id: "wi2-move-ap",
          label: "Relocate the access point further from the break room",
          color: "blue",
        },
        {
          id: "wi2-shield-wall",
          label: "Install RF shielding material in the break room wall",
          color: "yellow",
        },
      ],
      correctActionId: "wi2-band-steering",
      rationales: [
        {
          id: "wi2-r1",
          text: "Microwave interference blankets the entire 2.4 GHz band and cannot be mitigated by channel changes. Band steering moves capable clients to 5 GHz, which is unaffected. Reducing 2.4 GHz power near the break room makes 5 GHz the preferred band for dual-band clients.",
        },
        {
          id: "wi2-r2",
          text: "Replacing the microwave may help slightly but microwave ovens inherently operate at 2.45 GHz. Even a newer model will emit some interference. The sustainable fix is moving clients to 5 GHz.",
        },
        {
          id: "wi2-r3",
          text: "Moving the AP reduces coverage for nearby users and does not fix the interference for clients in the affected area. The microwave signal propagates through walls.",
        },
        {
          id: "wi2-r4",
          text: "RF shielding is expensive and may not be effective if the break room has doorways and openings. Band steering is simpler and more effective.",
        },
      ],
      correctRationaleId: "wi2-r1",
      feedback: {
        perfect:
          "Correct. Microwave interference cannot be avoided on 2.4 GHz. Band steering to 5 GHz is the standard enterprise solution, confirmed by the data showing 5 GHz clients are unaffected.",
        partial:
          "A better microwave helps marginally, but 2.45 GHz operation will always interfere with 2.4 GHz Wi-Fi. The permanent fix is 5 GHz.",
        wrong: "Moving the AP or adding shielding does not address the root issue and may create coverage gaps.",
      },
    },
    {
      id: "wi-scenario-3",
      type: "investigate-decide",
      title: "Roaming Failures in Long Hallway",
      objective:
        "Users walking through a long hallway with their laptops experience 5-10 second Wi-Fi disconnections as they move between access point coverage areas. The hallway has 3 APs spaced at 50-foot intervals. VoIP calls over Wi-Fi are dropping during the walk. Investigate the roaming configuration.",
      investigationData: [
        {
          id: "wi3-roaming",
          label: "Client Roaming Behavior Analysis",
          content:
            "Packet captures show clients holding onto the original AP with signal strength as low as -80 dBm before finally roaming to the next AP at -85 dBm. At -80 dBm, the connection is barely usable. The client then takes 4-6 seconds to authenticate to the new AP using full 802.1X EAP-TLS authentication. During this time, all traffic is dropped.",
          isCritical: true,
        },
        {
          id: "wi3-ap-config",
          label: "Access Point Configuration",
          content:
            "802.11r (Fast BSS Transition / Fast Roaming): Disabled. 802.11k (Neighbor Reports): Disabled. Minimum RSSI threshold (to kick weak clients): Not configured. AP transmit power: Maximum (results in large overlap zones where clients see strong signals from the original AP and resist roaming). All 3 APs are on different non-overlapping channels (1, 6, 11).",
          isCritical: true,
        },
        {
          id: "wi3-voip-requirements",
          label: "VoIP Requirements",
          content:
            "The VoIP vendor specifies maximum roaming time of 150ms to avoid call drops. Current roaming takes 4,000-6,000ms due to full re-authentication. The 802.11r standard enables pre-authentication that reduces roaming to under 50ms. The AP firmware supports 802.11r and 802.11k but both features are disabled.",
        },
      ],
      actions: [
        {
          id: "wi3-enable-roaming",
          label: "Enable 802.11r (Fast Roaming) and 802.11k (Neighbor Reports), configure a minimum RSSI threshold, and reduce AP power to optimize cell sizes",
          color: "green",
        },
        {
          id: "wi3-add-aps",
          label: "Add 3 more access points to eliminate coverage gaps",
          color: "orange",
        },
        {
          id: "wi3-use-wired",
          label: "Tell users to use wired connections for VoIP calls",
          color: "blue",
        },
        {
          id: "wi3-increase-power",
          label: "Increase AP power to maximum to extend coverage and reduce the need to roam",
          color: "red",
        },
      ],
      correctActionId: "wi3-enable-roaming",
      rationales: [
        {
          id: "wi3-r1",
          text: "802.11r pre-authentication reduces roaming to under 50ms (meeting VoIP requirements). 802.11k helps clients discover the next AP before signal degrades. Minimum RSSI forces clients to roam before signal quality drops to unusable levels. Reducing AP power creates cleaner cell boundaries for predictable roaming.",
        },
        {
          id: "wi3-r2",
          text: "More APs at maximum power creates larger overlap zones with more co-channel interference and actually makes roaming behavior worse, not better.",
        },
        {
          id: "wi3-r3",
          text: "Forcing wired connections defeats the purpose of wireless mobility and is not practical for users walking through hallways.",
        },
        {
          id: "wi3-r4",
          text: "Maximum power is already the current setting and is part of the problem. Higher power makes clients hold onto distant APs longer instead of roaming to the closer one.",
        },
      ],
      correctRationaleId: "wi3-r1",
      feedback: {
        perfect:
          "Correct. Enabling 802.11r and 802.11k addresses the roaming delay, RSSI thresholds force timely roaming, and power reduction creates clean cell boundaries. This is the proper enterprise wireless roaming configuration.",
        partial:
          "Adding APs without fixing the roaming configuration makes the problem worse. More APs mean more roaming decisions with the same slow authentication.",
        wrong: "Maximum power and wired workarounds do not solve the fundamental roaming speed problem that drops VoIP calls.",
      },
    },
  ],
  hints: [
    "On 2.4 GHz, only channels 1, 6, and 11 are non-overlapping. If nearby APs use channels like 3, 5, or 7, they create overlapping interference with channel 6.",
    "Microwave ovens operate at 2.45 GHz and interfere with the entire 2.4 GHz Wi-Fi band. The only reliable mitigation is moving clients to 5 GHz.",
    "Slow roaming between APs is often caused by disabled 802.11r (fast roaming) and high AP power levels that make clients resist handing off.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Wireless troubleshooting is a specialized and high-demand skill. As offices move increasingly to Wi-Fi-first designs, technicians with wireless diagnostic expertise command premium salaries and are essential to network teams.",
  toolRelevance: [
    "Wi-Fi Analyzer (NetSpot, inSSIDer)",
    "Spectrum Analyzer",
    "Wireless Controller Dashboard",
    "Wireshark (802.11 captures)",
    "Heat map survey tools",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
