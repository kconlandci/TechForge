import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "ts-network-outage",
  version: 1,
  title: "Systematic Approach to an Office Network Outage",
  tier: "beginner",
  track: "hardware-network-troubleshooting",
  difficulty: "easy",
  accessLevel: "free",
  tags: [
    "network",
    "outage",
    "ping",
    "ipconfig",
    "switch",
    "troubleshooting",
  ],
  description:
    "An entire office floor loses network connectivity. Apply systematic network troubleshooting from the bottom up using ping, ipconfig, and physical layer checks to isolate the failure.",
  estimatedMinutes: 18,
  learningObjectives: [
    "Apply the bottom-up troubleshooting approach to network outages",
    "Use ipconfig and ping to isolate network layer failures",
    "Check physical layer components including cables, switches, and patch panels",
    "Determine the scope of a network outage to narrow the root cause",
  ],
  sortOrder: 503,
  status: "published",
  prerequisites: [],
  rendererType: "triage-remediate",
  scenarios: [
    {
      id: "no-scenario-1",
      type: "triage-remediate",
      title: "Floor-Wide Network Outage",
      description:
        "All 25 users on the 3rd floor report no internet or network access simultaneously. Users on the 2nd and 4th floors are unaffected. The 3rd floor has its own IDF closet with a Cisco Catalyst 2960 access switch that uplinks to the MDF core switch via fiber.",
      evidence: [
        {
          type: "user-report",
          content:
            "All 25 users on the 3rd floor lost connectivity at approximately 10:15 AM. No users on other floors are affected.",
        },
        {
          type: "command-output",
          content:
            "ipconfig on a 3rd floor PC shows: IPv4 Address 169.254.x.x, Subnet Mask 255.255.0.0. This is an APIPA address indicating no DHCP response was received.",
        },
        {
          type: "physical-inspection",
          content:
            "The IDF closet on the 3rd floor shows the Cisco 2960 switch is powered on with the system LED green. However, all port LEDs are off except the uplink port which shows amber. The facilities team reports the IDF closet AC unit failed overnight and the closet temperature reads 104°F.",
        },
      ],
      classifications: [
        {
          id: "no1-c-internet",
          label: "Internet Service Provider Outage",
          description:
            "The ISP connection is down, affecting the entire building.",
        },
        {
          id: "no1-c-switch",
          label: "Access Switch Failure Due to Overheating",
          description:
            "The 3rd floor access switch has shut down ports due to thermal protection from the failed AC unit.",
        },
        {
          id: "no1-c-dhcp",
          label: "DHCP Server Failure",
          description:
            "The DHCP server is down, preventing all clients from getting IP addresses.",
        },
        {
          id: "no1-c-fiber",
          label: "Fiber Uplink Failure",
          description:
            "The fiber cable between the IDF and MDF has been cut or disconnected.",
        },
      ],
      correctClassificationId: "no1-c-switch",
      remediations: [
        {
          id: "no1-rem-reboot",
          label: "Reboot the switch and restore cooling",
          description:
            "Power cycle the 3rd floor switch after restoring cooling to the IDF closet. This allows the switch to reinitialize ports once temperature returns to safe operating range.",
        },
        {
          id: "no1-rem-replace-fiber",
          label: "Replace the fiber uplink cable",
          description:
            "Replace the fiber patch cable between the access switch and the core switch.",
        },
        {
          id: "no1-rem-restart-dhcp",
          label: "Restart the DHCP server service",
          description:
            "Restart the DHCP service on the server to restore IP address assignment.",
        },
        {
          id: "no1-rem-call-isp",
          label: "Contact the ISP for a service outage report",
          description:
            "Call the internet service provider to report the outage.",
        },
      ],
      correctRemediationId: "no1-rem-reboot",
      rationales: [
        {
          id: "no1-rat1",
          text: "The outage is isolated to one floor, ruling out ISP and DHCP server issues which would affect the whole building. The amber uplink LED and inactive port LEDs on a switch in an overheated closet indicate thermal shutdown of switch ports.",
        },
        {
          id: "no1-rat2",
          text: "Restoring cooling first and then power cycling the switch addresses the root cause. Simply rebooting without fixing the cooling will cause the switch to overheat again.",
        },
      ],
      correctRationaleId: "no1-rat1",
      feedback: {
        perfect:
          "Correct. The floor-specific outage, overheated IDF closet, and amber uplink LED all point to thermal shutdown of the access switch. Restoring cooling before rebooting prevents recurrence.",
        partial:
          "You identified part of the problem but missed the thermal root cause. The AC failure is what caused the switch to protect itself by shutting down ports.",
        wrong: "The evidence clearly shows this is a floor-specific switch issue caused by overheating, not an ISP or building-wide problem.",
      },
    },
    {
      id: "no-scenario-2",
      type: "triage-remediate",
      title: "Single User No Connectivity",
      description:
        "One user on the 3rd floor (after the switch was recovered) reports they still have no network access. All other users on the floor are working normally. The user's PC previously worked fine on this network drop.",
      evidence: [
        {
          type: "command-output",
          content:
            "ipconfig output: Ethernet adapter shows 'Media disconnected.' The NIC shows no link light. Other users at adjacent desks have full connectivity.",
        },
        {
          type: "physical-inspection",
          content:
            "The patch cable from the user's wall jack to their PC appears firmly connected at both ends. The link light on the PC NIC is off. Swapping to a known-good cable restores the link light and the user gets a valid IP address immediately.",
        },
      ],
      classifications: [
        {
          id: "no2-c-nic",
          label: "Failed Network Interface Card",
          description: "The user's NIC hardware has failed.",
        },
        {
          id: "no2-c-cable",
          label: "Faulty Patch Cable",
          description:
            "The user's patch cable has a broken conductor or damaged connector preventing a physical link.",
        },
        {
          id: "no2-c-port",
          label: "Switch Port Disabled",
          description:
            "The switch port assigned to this user's drop is administratively disabled.",
        },
      ],
      correctClassificationId: "no2-c-cable",
      remediations: [
        {
          id: "no2-rem-replace-cable",
          label: "Replace the patch cable",
          description:
            "Permanently replace the faulty patch cable with a new tested cable and label it.",
        },
        {
          id: "no2-rem-replace-nic",
          label: "Replace the NIC or install a USB network adapter",
          description:
            "Replace the internal NIC or add an external USB Ethernet adapter.",
        },
        {
          id: "no2-rem-enable-port",
          label: "Enable the switch port via CLI",
          description:
            "Log into the switch and issue 'no shutdown' on the interface.",
        },
      ],
      correctRemediationId: "no2-rem-replace-cable",
      rationales: [
        {
          id: "no2-rat1",
          text: "The 'Media disconnected' status and absent link light indicate a Layer 1 physical issue. Swapping the cable immediately restored connectivity, confirming the original cable was faulty.",
        },
        {
          id: "no2-rat2",
          text: "Replacing the cable is the correct permanent fix. The swap test definitively proved the cable was the point of failure since the NIC and switch port both work with a different cable.",
        },
      ],
      correctRationaleId: "no2-rat1",
      feedback: {
        perfect:
          "Correct. The cable swap test is the definitive Layer 1 diagnostic. When swapping the cable restores the link, the cable is the problem.",
        partial:
          "The cable swap already proved the NIC and port are working. No need to replace hardware that has been verified functional.",
        wrong: "The cable swap test proved the cable was faulty. The NIC and switch port both work with a good cable.",
      },
    },
    {
      id: "no-scenario-3",
      type: "triage-remediate",
      title: "Intermittent Connectivity After Recovery",
      description:
        "After the network recovery, three users report they can access internal resources but cannot reach any websites. Other users on the same floor can browse the internet normally. All three affected users sit in the same cubicle cluster.",
      evidence: [
        {
          type: "command-output",
          content:
            "ping 10.1.1.1 (default gateway): Reply received, 1ms. ping 8.8.8.8 (Google DNS): Reply received, 22ms. ping google.com: 'Ping request could not find host google.com.' nslookup google.com: 'DNS request timed out. Server: 10.1.1.50.' The DNS server 10.1.1.50 is the old DNS server that was decommissioned last week. The current DNS server is 10.1.1.51.",
        },
        {
          type: "configuration",
          content:
            "ipconfig /all on the affected PCs shows DNS Servers: 10.1.1.50. These three PCs have static IP configurations instead of DHCP. Working PCs use DHCP and received DNS server 10.1.1.51 automatically.",
        },
      ],
      classifications: [
        {
          id: "no3-c-dns-server",
          label: "DNS Server Down",
          description:
            "The DNS server is offline and not responding to queries.",
        },
        {
          id: "no3-c-static-dns",
          label: "Static DNS Configuration Pointing to Decommissioned Server",
          description:
            "The affected PCs have static network settings with an outdated DNS server address.",
        },
        {
          id: "no3-c-firewall",
          label: "Firewall Blocking DNS Traffic",
          description:
            "A firewall rule is blocking DNS queries from these specific PCs.",
        },
      ],
      correctClassificationId: "no3-c-static-dns",
      remediations: [
        {
          id: "no3-rem-update-dns",
          label: "Update DNS settings on the static PCs to 10.1.1.51",
          description:
            "Change the DNS server address from 10.1.1.50 to 10.1.1.51 on all three PCs, or convert them to DHCP if appropriate.",
        },
        {
          id: "no3-rem-restart-dns",
          label: "Restart the DNS server service",
          description:
            "Restart the DNS service on server 10.1.1.50 to bring it back online.",
        },
        {
          id: "no3-rem-flush-dns",
          label: "Run ipconfig /flushdns on the affected PCs",
          description:
            "Clear the DNS resolver cache to force new lookups.",
        },
      ],
      correctRemediationId: "no3-rem-update-dns",
      rationales: [
        {
          id: "no3-rat1",
          text: "Ping to IP addresses works but DNS resolution fails, isolating the problem to DNS. The affected PCs use static DNS pointing to a decommissioned server, while DHCP clients automatically received the updated DNS server address.",
        },
        {
          id: "no3-rat2",
          text: "Updating the DNS server address or converting to DHCP fixes the immediate issue and prevents future problems when DNS servers change. Flushing DNS cache would not help since the PCs are querying the wrong server entirely.",
        },
      ],
      correctRationaleId: "no3-rat1",
      feedback: {
        perfect:
          "Correct. The diagnostic chain — ping works, DNS fails, static config points to decommissioned server — clearly identifies stale static DNS configuration as the root cause.",
        partial:
          "Flushing DNS cache clears stale entries but does not change which DNS server the PC queries. The server address itself is wrong.",
        wrong: "The DNS server 10.1.1.50 was deliberately decommissioned. Restarting it is not appropriate.",
      },
    },
  ],
  hints: [
    "When an entire floor loses connectivity but other floors are fine, the problem is between the users and the rest of the network — check the access switch and IDF closet.",
    "The 'Media disconnected' status means there is no physical link. Start at Layer 1: cables, connectors, and port LEDs.",
    "If ping to an IP works but ping to a hostname fails, the issue is DNS resolution, not general connectivity.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Network outages are high-pressure incidents where structured troubleshooting separates junior from senior technicians. Being able to quickly scope an outage and work through the OSI layers systematically is a skill that impresses in interviews and on the job.",
  toolRelevance: [
    "ipconfig",
    "ping",
    "nslookup",
    "Physical inspection (LEDs, cables)",
    "Switch CLI (show interfaces)",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
