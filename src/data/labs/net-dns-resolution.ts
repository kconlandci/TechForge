import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "net-dns-resolution",
  version: 1,
  title: "DNS Resolution Failures",
  tier: "intermediate",
  track: "networking",
  difficulty: "moderate",
  accessLevel: "free",
  tags: ["networking", "dns", "name-resolution", "troubleshooting", "nslookup"],
  description:
    "Users can reach servers by IP address but not by hostname. Triage the DNS resolution failure, classify the issue, and apply the correct remediation.",
  estimatedMinutes: 15,
  learningObjectives: [
    "Use nslookup and dig to diagnose DNS resolution failures",
    "Differentiate between DNS server issues and client configuration problems",
    "Understand DNS caching and how to flush stale records",
    "Classify DNS problems by severity and impact",
  ],
  sortOrder: 206,
  status: "published",
  prerequisites: [],
  rendererType: "triage-remediate",
  scenarios: [
    {
      type: "triage-remediate",
      id: "ndr-scenario-1",
      title: "Stale DNS Cache Entry",
      description:
        "A user cannot access the company intranet site at intranet.corp.local after it was migrated to a new server last night. Other users can access it fine.",
      evidence: [
        {
          type: "command-output",
          content: "nslookup intranet.corp.local\nServer: 192.168.1.10\nAddress: 192.168.1.10\nName: intranet.corp.local\nAddress: 192.168.1.50 (NEW server IP)",
        },
        {
          type: "command-output",
          content: "ping intranet.corp.local\nPinging 192.168.1.30 (OLD server IP)\nRequest timed out.",
        },
        {
          type: "observation",
          content: "The user's PC has been running since yesterday without restarting. Other users who restarted their PCs this morning can access the site.",
        },
      ],
      classifications: [
        { id: "stale-cache", label: "Stale DNS Cache", description: "The local DNS resolver cache contains an outdated A record from before the server migration." },
        { id: "dns-server-down", label: "DNS Server Failure", description: "The DNS server is not responding to queries." },
        { id: "wrong-dns-config", label: "Incorrect DNS Configuration", description: "The client is pointed at the wrong DNS server." },
      ],
      correctClassificationId: "stale-cache",
      remediations: [
        { id: "flush-dns", label: "Flush DNS Cache", description: "Run ipconfig /flushdns to clear the local DNS resolver cache and force a fresh lookup." },
        { id: "change-dns", label: "Change DNS Server", description: "Point the client to a different DNS server." },
        { id: "restart-dns-service", label: "Restart DNS Server Service", description: "Restart the DNS Server service on 192.168.1.10." },
      ],
      correctRemediationId: "flush-dns",
      rationales: [
        { id: "r-cache", text: "nslookup bypasses the local cache and queries the DNS server directly, returning the new IP. ping uses the cached (old) IP. Flushing the cache forces the system to query DNS fresh." },
        { id: "r-server", text: "The DNS server is responding correctly to nslookup queries with the updated IP. The server is not the problem." },
      ],
      correctRationaleId: "r-cache",
      feedback: {
        perfect: "Correct! The nslookup vs ping discrepancy proves the local cache is stale. Running ipconfig /flushdns clears the old record.",
        partial: "You identified a DNS issue but the key is the difference between nslookup (queries server directly) and ping (uses local cache).",
        wrong: "The DNS server is working correctly. Compare the nslookup result with the ping result to see where the stale data lives.",
      },
    },
    {
      type: "triage-remediate",
      id: "ndr-scenario-2",
      title: "DNS Suffix Search List Missing",
      description:
        "A user can browse the internet but cannot access internal servers by short name (e.g., 'fileserver'). Using the FQDN 'fileserver.corp.local' works fine.",
      evidence: [
        {
          type: "command-output",
          content: "nslookup fileserver\nServer: 192.168.1.10\n*** Can't find fileserver: Non-existent domain",
        },
        {
          type: "command-output",
          content: "nslookup fileserver.corp.local\nServer: 192.168.1.10\nName: fileserver.corp.local\nAddress: 192.168.1.200",
        },
        {
          type: "command-output",
          content: "ipconfig /all (excerpt)\nDNS Suffix Search List: (empty)\nConnection-specific DNS Suffix: (empty)",
        },
      ],
      classifications: [
        { id: "missing-suffix", label: "Missing DNS Suffix", description: "The DNS suffix search list is empty so short names cannot be resolved to FQDNs." },
        { id: "dns-zone-issue", label: "DNS Zone Misconfiguration", description: "The corp.local zone on the DNS server is misconfigured." },
        { id: "firewall-block", label: "Firewall Blocking DNS", description: "A firewall rule is blocking certain DNS queries." },
      ],
      correctClassificationId: "missing-suffix",
      remediations: [
        { id: "add-suffix", label: "Configure DNS Suffix", description: "Add 'corp.local' to the DNS suffix search list via DHCP option or manual network adapter settings." },
        { id: "recreate-zone", label: "Recreate DNS Zone", description: "Delete and recreate the corp.local forward lookup zone on the DNS server." },
        { id: "add-hosts", label: "Add Hosts File Entries", description: "Add all internal server names to the local hosts file." },
      ],
      correctRemediationId: "add-suffix",
      rationales: [
        { id: "r-suffix", text: "Without a DNS suffix, the resolver sends 'fileserver' as-is to the DNS server, which has no record for that bare name. Adding 'corp.local' as the suffix makes the resolver try 'fileserver.corp.local' automatically." },
        { id: "r-zone", text: "The FQDN lookup works, proving the DNS zone is correct. The issue is client-side suffix configuration, not server-side zones." },
      ],
      correctRationaleId: "r-suffix",
      feedback: {
        perfect: "Correct! The empty DNS suffix search list prevents short name resolution. Configuring the suffix via DHCP (Option 15) is the scalable fix.",
        partial: "The FQDN works, so the DNS server is fine. Focus on why short names fail — what converts 'fileserver' into 'fileserver.corp.local'?",
        wrong: "The DNS server resolves the FQDN correctly. The problem is that the client does not know to append 'corp.local' to short names.",
      },
    },
    {
      type: "triage-remediate",
      id: "ndr-scenario-3",
      title: "Hosts File Override",
      description:
        "A single user's PC resolves 'portal.company.com' to a different IP than everyone else. The user reports seeing a blank page when visiting the company portal.",
      evidence: [
        {
          type: "command-output",
          content: "nslookup portal.company.com (from affected PC)\nServer: 10.0.0.5\nName: portal.company.com\nAddress: 203.0.113.50 (correct IP)",
        },
        {
          type: "command-output",
          content: "ping portal.company.com (from affected PC)\nPinging portal.company.com [10.99.99.99]\nRequest timed out.",
        },
        {
          type: "file-content",
          content: "C:\\Windows\\System32\\drivers\\etc\\hosts:\n10.99.99.99    portal.company.com    # test redirect - added by developer",
        },
      ],
      classifications: [
        { id: "hosts-override", label: "Hosts File Override", description: "A manual entry in the hosts file is overriding DNS resolution for this specific domain." },
        { id: "dns-poisoning", label: "DNS Cache Poisoning", description: "The DNS cache has been poisoned with a malicious entry." },
        { id: "split-dns", label: "Split DNS Issue", description: "Internal and external DNS servers return different results." },
      ],
      correctClassificationId: "hosts-override",
      remediations: [
        { id: "remove-hosts-entry", label: "Remove Hosts File Entry", description: "Delete the incorrect entry from the hosts file and save. The system will then use DNS normally." },
        { id: "flush-and-scan", label: "Flush DNS and Run Antimalware", description: "Flush the DNS cache and run a full antimalware scan." },
        { id: "change-dns-server", label: "Switch to Public DNS", description: "Change the DNS servers to 8.8.8.8 and 1.1.1.1." },
      ],
      correctRemediationId: "remove-hosts-entry",
      rationales: [
        { id: "r-hosts", text: "The hosts file takes precedence over DNS queries. The developer left a test entry that redirects the portal to a non-existent IP. Removing the line restores normal DNS resolution." },
        { id: "r-poison", text: "nslookup returns the correct IP, ruling out DNS poisoning. The override is happening at the OS level via the hosts file, not at the DNS server." },
      ],
      correctRationaleId: "r-hosts",
      feedback: {
        perfect: "Correct! The hosts file entry overrides DNS. Removing the developer's test entry immediately restores access to the portal.",
        partial: "You are on the right track with a client-side fix. The key evidence is the discrepancy between nslookup (queries DNS) and ping (checks hosts file first).",
        wrong: "Compare the nslookup result with the ping result. The hosts file is checked before DNS and contains the override.",
      },
    },
  ],
  hints: [
    "nslookup queries the DNS server directly, while ping and browsers check the hosts file and local cache first.",
    "The DNS suffix search list is what converts short names like 'fileserver' into FQDNs like 'fileserver.corp.local'.",
    "Always check the hosts file (C:\\Windows\\System32\\drivers\\etc\\hosts) when a single PC has unique DNS behavior.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "DNS issues account for a surprising number of network problems. The saying 'it is always DNS' exists for a reason. Mastering nslookup and understanding the resolution order (hosts file, cache, DNS) is essential for any IT role.",
  toolRelevance: ["nslookup", "ipconfig /flushdns", "ping", "hosts file", "ipconfig /all"],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
