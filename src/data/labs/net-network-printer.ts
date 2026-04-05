import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "net-network-printer",
  version: 1,
  title: "Network Printer Unreachable",
  tier: "advanced",
  track: "networking",
  difficulty: "challenging",
  accessLevel: "premium",
  tags: ["networking", "printer", "troubleshooting", "printing", "connectivity"],
  description:
    "A shared network printer that was working yesterday is now unreachable from all workstations. Triage the issue, classify the root cause, and apply the correct remediation.",
  estimatedMinutes: 15,
  learningObjectives: [
    "Systematically troubleshoot network printer connectivity issues",
    "Differentiate between print server, network, and printer hardware problems",
    "Use ping and printer management pages to diagnose printer status",
    "Resolve common print spooler and driver issues",
  ],
  sortOrder: 214,
  status: "published",
  prerequisites: [],
  rendererType: "triage-remediate",
  scenarios: [
    {
      type: "triage-remediate",
      id: "nnp-scenario-1",
      title: "Printer IP Changed After DHCP Renewal",
      description:
        "The HP LaserJet on the second floor stopped printing for all users this morning. The printer's LCD panel shows 'Ready' and no error messages.",
      evidence: [
        {
          type: "command-output",
          content: "ping 192.168.1.150 (configured printer IP)\nRequest timed out.\nRequest timed out.",
        },
        {
          type: "observation",
          content: "Printer LCD shows: IP Address: 192.168.1.175 (DHCP)\nPrinter status: Ready\nPaper: OK, Toner: 45%",
        },
        {
          type: "command-output",
          content: "Print queue on Windows: All jobs stuck with status 'Error — Printing'\nPrinter port configured as: Standard TCP/IP Port to 192.168.1.150",
        },
      ],
      classifications: [
        { id: "ip-changed", label: "IP Address Changed", description: "The printer obtained a new DHCP address different from what workstations are configured to use." },
        { id: "printer-offline", label: "Printer Hardware Offline", description: "The printer is powered off or has a hardware failure." },
        { id: "spooler-crash", label: "Print Spooler Crash", description: "The Windows print spooler service has crashed on the print server." },
      ],
      correctClassificationId: "ip-changed",
      remediations: [
        { id: "static-ip", label: "Assign Static IP", description: "Configure a static IP of 192.168.1.150 on the printer (or create a DHCP reservation) and update the printer port if needed." },
        { id: "restart-spooler", label: "Restart Print Spooler", description: "Restart the Windows Print Spooler service on all workstations." },
        { id: "reinstall-driver", label: "Reinstall Printer Driver", description: "Remove and reinstall the printer driver on all affected PCs." },
      ],
      correctRemediationId: "static-ip",
      rationales: [
        { id: "r-ip", text: "The printer's DHCP lease expired and it received a new IP (.175 instead of .150). Assigning a static IP or DHCP reservation prevents this from recurring." },
        { id: "r-spooler", text: "The print spooler is working — it is actively trying to send jobs to .150. The issue is that .150 no longer responds because the printer moved to .175." },
      ],
      correctRationaleId: "r-ip",
      feedback: {
        perfect: "Correct! The DHCP renewal changed the printer's IP. Setting a static IP or DHCP reservation permanently fixes this common issue.",
        partial: "You identified a network issue but focus on why the old IP stopped working. Compare the configured port address with the printer's current address.",
        wrong: "The printer hardware is fine (Ready status). The Windows workstations are sending to the old IP address that the printer no longer holds.",
      },
    },
    {
      type: "triage-remediate",
      id: "nnp-scenario-2",
      title: "Print Spooler Service Crashed",
      description:
        "All printers on the print server are showing as offline. Individual users cannot print to any shared printer. The print server is a Windows Server machine.",
      evidence: [
        {
          type: "command-output",
          content: "ping 192.168.1.10 (print server)\nReply from 192.168.1.10: bytes=32 time<1ms TTL=128\nServer is reachable on the network.",
        },
        {
          type: "command-output",
          content: "sc query spooler (on print server)\nSERVICE_NAME: spooler\nSTATE: 1 STOPPED\nWIN32_EXIT_CODE: 1 (ERROR)",
        },
        {
          type: "observation",
          content: "Event Viewer on print server:\nSource: Print Spooler\nEvent ID: 1000\nFaulting application: spoolsv.exe terminated unexpectedly.\nA corrupted print job may have caused the crash.",
        },
      ],
      classifications: [
        { id: "spooler-stopped", label: "Print Spooler Service Stopped", description: "The spooler service crashed and is not running, preventing all print jobs from processing." },
        { id: "network-down", label: "Network Connectivity Issue", description: "The print server has lost network connectivity to the printers." },
        { id: "driver-conflict", label: "Driver Conflict", description: "A printer driver update caused incompatibility issues." },
      ],
      correctClassificationId: "spooler-stopped",
      remediations: [
        { id: "clear-restart", label: "Clear Print Queue and Restart Spooler", description: "Delete all pending print jobs from C:\\Windows\\System32\\spool\\PRINTERS, then restart the Print Spooler service." },
        { id: "reboot-server", label: "Reboot the Print Server", description: "Perform a full restart of the Windows Server machine." },
        { id: "reconnect-printers", label: "Reconnect All Printers", description: "Remove and re-add all printer connections on the print server." },
      ],
      correctRemediationId: "clear-restart",
      rationales: [
        { id: "r-clear", text: "A corrupted print job caused the crash. Clearing the spool folder removes the bad job, and restarting the service restores printing without a full server reboot." },
        { id: "r-reboot", text: "A reboot would restart the spooler, but the corrupted job would still be in the queue and could crash the service again immediately." },
      ],
      correctRationaleId: "r-clear",
      feedback: {
        perfect: "Correct! Clear the spool folder to remove the corrupted job, then restart the spooler service. This is faster than rebooting and prevents the crash from recurring.",
        partial: "You identified the spooler issue but the corrupted print job must be removed before restarting, or the crash will repeat.",
        wrong: "The server is reachable by ping. The problem is the Print Spooler service, not network connectivity.",
      },
    },
    {
      type: "triage-remediate",
      id: "nnp-scenario-3",
      title: "Printer on Wrong VLAN",
      description:
        "After a network switch upgrade over the weekend, the accounting department can no longer print to their dedicated printer. Other departments can print to their own printers fine.",
      evidence: [
        {
          type: "command-output",
          content: "ping 192.168.10.50 (accounting printer, from accounting PC on VLAN 10)\nRequest timed out.\n\nping 192.168.10.50 (from IT admin PC on VLAN 99)\nReply from 192.168.10.50: bytes=32 time=2ms TTL=64",
        },
        {
          type: "observation",
          content: "Switch port for accounting printer: Port 15\nPost-upgrade VLAN assignment for Port 15: VLAN 99 (Management)\nExpected VLAN for Port 15: VLAN 10 (Accounting)\nOther accounting devices (Ports 1-14): Correctly on VLAN 10",
        },
        {
          type: "command-output",
          content: "Printer web interface (accessed from VLAN 99):\nIP: 192.168.10.50\nSubnet: 255.255.255.0\nGateway: 192.168.10.1\nStatus: Online, Ready",
        },
      ],
      classifications: [
        { id: "wrong-vlan", label: "Incorrect VLAN Assignment", description: "The printer's switch port was assigned to the wrong VLAN during the switch upgrade, isolating it from accounting users." },
        { id: "printer-config", label: "Printer IP Misconfiguration", description: "The printer has the wrong IP address or subnet after the switch upgrade." },
        { id: "acl-block", label: "ACL Blocking Traffic", description: "A new access control list on the switch is blocking print traffic." },
      ],
      correctClassificationId: "wrong-vlan",
      remediations: [
        { id: "fix-vlan", label: "Reassign Switch Port to VLAN 10", description: "Change Port 15 on the switch from VLAN 99 back to VLAN 10 (Accounting) to restore connectivity." },
        { id: "change-printer-ip", label: "Change Printer IP to VLAN 99 Range", description: "Reconfigure the printer to use a VLAN 99 IP address." },
        { id: "add-route", label: "Add Inter-VLAN Route", description: "Configure routing between VLAN 10 and VLAN 99 for printer access." },
      ],
      correctRemediationId: "fix-vlan",
      rationales: [
        { id: "r-vlan-fix", text: "The switch port was incorrectly assigned to VLAN 99 during the upgrade. Moving it back to VLAN 10 restores direct Layer 2 connectivity between accounting PCs and their printer." },
        { id: "r-ip-change", text: "Changing the printer to VLAN 99 would work technically but puts an accounting printer on the management network, violating network segmentation policies." },
      ],
      correctRationaleId: "r-vlan-fix",
      feedback: {
        perfect: "Correct! The switch upgrade placed the printer port on the wrong VLAN. Reassigning Port 15 to VLAN 10 restores accounting access immediately.",
        partial: "You identified the connectivity issue but the simplest fix maintains the original network design. The port just needs the correct VLAN.",
        wrong: "The printer works from VLAN 99 but not from VLAN 10. This means the printer's switch port is on the wrong VLAN after the upgrade.",
      },
    },
  ],
  hints: [
    "Always verify the printer's current IP address matches what workstations are configured to use.",
    "If all printers are affected, the issue is likely the print server or spooler service, not individual printers.",
    "After network changes (switch upgrades, re-cabling), verify VLAN assignments on every reconnected port.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Printer issues are among the most common help desk tickets. While they seem simple, network printer problems can involve DHCP, VLANs, print spoolers, and driver management — touching many networking fundamentals at once.",
  toolRelevance: ["ping", "printer web interface", "services.msc", "Event Viewer", "switch CLI"],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
