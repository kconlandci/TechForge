import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "mobile-wifi-connectivity",
  version: 1,
  title: "Troubleshoot Phone Wi-Fi Connection Failures",
  tier: "beginner",
  track: "mobile-devices",
  difficulty: "easy",
  accessLevel: "free",
  tags: ["wifi", "networking", "connectivity", "troubleshooting", "mobile"],
  description:
    "A user's phone can see Wi-Fi networks but fails to connect. Investigate the symptoms, identify the root cause, and decide on the correct fix from multiple possibilities.",
  estimatedMinutes: 15,
  learningObjectives: [
    "Systematically diagnose Wi-Fi connectivity failures on mobile devices",
    "Differentiate between authentication failures, DHCP issues, and radio problems",
    "Use network diagnostic information to identify the root cause",
    "Apply the least disruptive fix for each type of Wi-Fi issue",
  ],
  sortOrder: 102,
  status: "published",
  prerequisites: [],
  rendererType: "investigate-decide",
  scenarios: [
    {
      id: "wc-scenario-1",
      type: "investigate-decide",
      title: "Wi-Fi Authentication Failure",
      objective:
        "Determine why the user's Galaxy S22 can see their home Wi-Fi network but gets 'Authentication failed' every time they try to connect.",
      investigationData: [
        {
          id: "wc1-wifi-settings",
          label: "Wi-Fi Settings Screen",
          content:
            "Network: HomeNet-5G, Security: WPA3, Signal: Excellent (-35 dBm), Status: Authentication failed. Saved networks include: HomeNet-5G, CoffeeShop, Work-Guest. The password was saved 6 months ago.",
          isCritical: true,
        },
        {
          id: "wc1-other-devices",
          label: "Other Device Status",
          content:
            "The user's laptop connects to HomeNet-5G without issues. Their iPad also connects fine. The router was updated last week and the admin changed the security from WPA2 to WPA3 Personal.",
          isCritical: true,
        },
        {
          id: "wc1-airplane-mode",
          label: "Airplane Mode Toggle Test",
          content:
            "Toggling airplane mode on and off did not resolve the issue. The phone discovers the network immediately after airplane mode is turned off.",
          isCritical: false,
        },
      ],
      actions: [
        {
          id: "wc1-forget-reconnect",
          label: "Forget the network and reconnect with the current password, ensuring WPA3 compatibility",
          color: "green",
        },
        {
          id: "wc1-reset-network",
          label: "Reset all network settings on the phone",
          color: "orange",
        },
        {
          id: "wc1-factory-reset",
          label: "Factory reset the phone",
          color: "red",
        },
        {
          id: "wc1-change-router",
          label: "Tell the user to buy a new router",
          color: "red",
        },
      ],
      correctActionId: "wc1-forget-reconnect",
      rationales: [
        {
          id: "wc1-r1",
          text: "The saved network profile was created under WPA2. Since the router was changed to WPA3, the stored credentials and security negotiation parameters are stale. Forgetting the network and reconnecting forces the phone to create a new profile with WPA3 parameters.",
        },
        {
          id: "wc1-r2",
          text: "Resetting all network settings would fix this but also destroys all saved Wi-Fi passwords, Bluetooth pairings, and VPN configurations unnecessarily.",
        },
        {
          id: "wc1-r3",
          text: "A factory reset is extreme for a Wi-Fi authentication issue. The investigation clearly points to a stale saved network profile.",
        },
      ],
      correctRationaleId: "wc1-r1",
      feedback: {
        perfect:
          "Correct. The stale WPA2 profile is causing the authentication mismatch. Forgetting and reconnecting creates a fresh WPA3-compatible profile.",
        partial:
          "Resetting all network settings works but is unnecessarily destructive. A targeted forget-and-reconnect is the better approach.",
        wrong: "That action is far too aggressive for a stale Wi-Fi profile issue.",
      },
    },
    {
      id: "wc-scenario-2",
      type: "investigate-decide",
      title: "DHCP Address Assignment Failure",
      objective:
        "A user's iPhone 13 connects to the office Wi-Fi but shows 'No Internet Connection' with a self-assigned 169.254.x.x IP address. Investigate and resolve.",
      investigationData: [
        {
          id: "wc2-ip-config",
          label: "iPhone Network Details",
          content:
            "IP Address: 169.254.42.118, Subnet: 255.255.0.0, Router: (blank), DNS: (blank). Wi-Fi shows connected with a strong signal. The SSID is 'CorpNet-Secure' using WPA2-Enterprise.",
          isCritical: true,
        },
        {
          id: "wc2-other-users",
          label: "Office Network Status",
          content:
            "Three other employees connected in the last hour without issues. IT admin confirms the DHCP server is running with 200 addresses in the pool and only 47 are leased. The DHCP scope is 10.0.1.100-10.0.1.300.",
          isCritical: true,
        },
        {
          id: "wc2-recent-changes",
          label: "Recent Device Changes",
          content:
            "The user installed a VPN app yesterday for personal use. The VPN app's settings show 'Always-On VPN' is enabled, and the VPN attempts to connect automatically when Wi-Fi is joined. The VPN server is unreachable from the corporate network.",
          isCritical: true,
        },
      ],
      actions: [
        {
          id: "wc2-renew-lease",
          label: "Renew the DHCP lease on the phone",
          color: "blue",
        },
        {
          id: "wc2-static-ip",
          label: "Configure a static IP address",
          color: "orange",
        },
        {
          id: "wc2-disable-vpn",
          label: "Disable the Always-On VPN that is interfering with DHCP negotiation, then renew the lease",
          color: "green",
        },
        {
          id: "wc2-contact-admin",
          label: "Escalate to the network admin to check the DHCP server",
          color: "blue",
        },
      ],
      correctActionId: "wc2-disable-vpn",
      rationales: [
        {
          id: "wc2-r1",
          text: "The Always-On VPN is intercepting network traffic during the DHCP negotiation phase, preventing the phone from obtaining an IP address from the corporate DHCP server. Disabling it and renewing the lease allows proper DHCP assignment.",
        },
        {
          id: "wc2-r2",
          text: "Simply renewing the lease will fail again because the VPN is still intercepting the DHCP traffic. The VPN must be disabled first.",
        },
        {
          id: "wc2-r3",
          text: "A static IP bypasses DHCP but creates management problems and may conflict with corporate network policy. It does not address the root cause.",
        },
        {
          id: "wc2-r4",
          text: "The DHCP server is healthy with available addresses. The problem is client-side VPN interference, not a server issue.",
        },
      ],
      correctRationaleId: "wc2-r1",
      feedback: {
        perfect:
          "Correct. The Always-On VPN is intercepting DHCP traffic before the phone can obtain an address. Disabling it resolves the 169.254.x.x self-assigned IP.",
        partial:
          "Renewing the lease alone won't work because the VPN will continue interfering. You need to address the VPN first.",
        wrong: "The evidence points to a client-side issue, not a server or hardware problem.",
      },
    },
    {
      id: "wc-scenario-3",
      type: "investigate-decide",
      title: "Intermittent Wi-Fi Disconnections",
      objective:
        "A user's Pixel 7 keeps disconnecting from Wi-Fi every 10-15 minutes, then automatically reconnects after about 30 seconds. This only started happening this week.",
      investigationData: [
        {
          id: "wc3-wifi-log",
          label: "Wi-Fi Connection Log",
          content:
            "The log shows a pattern: Connected at 9:00, Disconnected at 9:12, Connected at 9:13, Disconnected at 9:25, Connected at 9:26. Each disconnect event shows 'Reason: DHCP lease renewal failed'. The router's DHCP lease time is set to 15 minutes.",
          isCritical: true,
        },
        {
          id: "wc3-router-config",
          label: "Router Configuration",
          content:
            "Router model: Netgear R7000. Firmware was updated 3 days ago to version 1.0.11.128. DHCP lease time: 15 minutes (was changed from 24 hours during the firmware update which reset some settings to defaults). Channel: Auto. Band: 5 GHz.",
          isCritical: true,
        },
        {
          id: "wc3-phone-settings",
          label: "Phone Wi-Fi Advanced Settings",
          content:
            "Wi-Fi MAC type: Randomized (default). Switch to mobile data automatically: ON. Wi-Fi power saving mode: ON. The phone's Wi-Fi works flawlessly at other locations like coffee shops and the user's workplace.",
          isCritical: false,
        },
      ],
      actions: [
        {
          id: "wc3-increase-lease",
          label: "Access the router and increase the DHCP lease time back to 24 hours",
          color: "green",
        },
        {
          id: "wc3-disable-randomized-mac",
          label: "Disable randomized MAC address on the phone",
          color: "orange",
        },
        {
          id: "wc3-replace-router",
          label: "Replace the router since the firmware update broke it",
          color: "red",
        },
        {
          id: "wc3-disable-power-saving",
          label: "Disable Wi-Fi power saving mode",
          color: "blue",
        },
      ],
      correctActionId: "wc3-increase-lease",
      rationales: [
        {
          id: "wc3-r1",
          text: "The firmware update reset the DHCP lease time from 24 hours to 15 minutes. The extremely short lease causes frequent renewal attempts, and the Pixel is failing to renew within the window. Increasing the lease time back to a reasonable value like 8-24 hours eliminates the frequent renewal failures.",
        },
        {
          id: "wc3-r2",
          text: "Randomized MAC addresses can cause DHCP issues in some configurations, but the disconnect pattern matching the exact lease time and the firmware reset evidence point clearly to the lease time setting.",
        },
        {
          id: "wc3-r3",
          text: "The router hardware is fine. The firmware update simply reset the DHCP lease time to a very short default value.",
        },
      ],
      correctRationaleId: "wc3-r1",
      feedback: {
        perfect:
          "Correct. The firmware update reset the lease time to 15 minutes, and the disconnection pattern matches the lease renewal failures exactly. Restoring a longer lease time resolves the issue.",
        partial:
          "While MAC randomization can sometimes cause DHCP issues, the evidence strongly points to the lease time being reset by the firmware update.",
        wrong: "The router is functioning correctly. The issue is a configuration setting that was reset during the firmware update.",
      },
    },
  ],
  hints: [
    "When Wi-Fi authentication fails, check if the router's security protocol has changed since the network was last saved.",
    "A 169.254.x.x IP address means the device failed to get an address from the DHCP server. Look for what might be blocking that process.",
    "If disconnections follow a predictable time pattern, compare that interval to the DHCP lease time on the router.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Wi-Fi troubleshooting is a daily task in IT support. The ability to distinguish between authentication, DHCP, and radio issues through systematic investigation dramatically reduces resolution time.",
  toolRelevance: [
    "Wi-Fi Settings / Network Details",
    "DHCP Lease Information",
    "Router Admin Console",
    "Network Connection Logs",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
