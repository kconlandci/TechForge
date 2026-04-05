import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "ts-printer-fleet",
  version: 1,
  title: "Troubleshoot Multiple Printer Issues Simultaneously",
  tier: "advanced",
  track: "hardware-network-troubleshooting",
  difficulty: "challenging",
  accessLevel: "premium",
  tags: [
    "printer",
    "fleet",
    "print-server",
    "spooler",
    "triage",
    "troubleshooting",
  ],
  description:
    "Multiple printers across the office are failing in different ways at the same time. Triage, classify, and remediate each printer issue while identifying whether a common root cause exists.",
  estimatedMinutes: 25,
  learningObjectives: [
    "Triage multiple simultaneous printer failures by severity and impact",
    "Distinguish between print server issues, driver problems, and hardware faults",
    "Identify a common root cause when multiple devices fail after a shared event",
    "Apply printer-specific diagnostics including test pages, spooler management, and queue analysis",
    "Prioritize remediation based on business impact and number of affected users",
  ],
  sortOrder: 513,
  status: "published",
  prerequisites: [],
  rendererType: "triage-remediate",
  scenarios: [
    {
      id: "pf-scenario-1",
      type: "triage-remediate",
      title: "Print Server Spooler Crash Affecting All Network Printers",
      description:
        "Monday morning: 15 tickets arrive within 20 minutes reporting printing failures across all departments. No one can print to any network printer. USB-connected local printers are working. The print server (Windows Server 2022) was patched over the weekend.",
      evidence: [
        {
          type: "ticket-summary",
          content:
            "15 tickets across all departments. All report 'Printer offline' or 'Error - Printing' for network printers. Local USB printers are unaffected. The issue began when users arrived Monday morning.",
        },
        {
          type: "server-status",
          content:
            "Print Server (PRINT01): RDP accessible. The Print Spooler service is in 'Stopped' state. Attempting to start it results in: 'The Print Spooler service started and then stopped. Some services stop automatically if they are not in use by other services or programs.' Event Viewer shows: 'The print spooler service terminated unexpectedly. It has done this 3 times. Faulting module: HPPrintDriver_v4.dll.'",
        },
        {
          type: "patch-history",
          content:
            "Weekend patch: KB5035845 (March 2026 cumulative update) was installed Saturday night. This update includes changes to the print subsystem. The HP Universal Print Driver version 7.2.0.25 installed on the server is a known incompatibility with this update according to HP's support bulletin released Friday.",
        },
      ],
      classifications: [
        {
          id: "pf1-c-network",
          label: "Network Connectivity Issue to Print Server",
          description:
            "The print server has lost network connectivity, preventing printer communication.",
        },
        {
          id: "pf1-c-driver-crash",
          label: "Print Driver Incompatibility Crashing Spooler",
          description:
            "The Windows Update introduced a conflict with the HP print driver, causing the spooler to crash on startup.",
        },
        {
          id: "pf1-c-permissions",
          label: "Print Server Permissions Changed by Update",
          description:
            "The Windows Update changed security permissions on the print spooler.",
        },
      ],
      correctClassificationId: "pf1-c-driver-crash",
      remediations: [
        {
          id: "pf1-rem-update-driver",
          label: "Update the HP driver to a compatible version and restart the spooler",
          description:
            "Download the HP Universal Print Driver version 7.3.0.1 (compatible with KB5035845 per HP's bulletin), install it on the print server while the spooler is stopped, then start the Print Spooler service.",
        },
        {
          id: "pf1-rem-uninstall-update",
          label: "Uninstall the Windows Update KB5035845",
          description:
            "Roll back the problematic Windows Update to restore the previous print subsystem behavior.",
        },
        {
          id: "pf1-rem-reinstall-server",
          label: "Reinstall Windows Server on the print server",
          description:
            "Wipe and reinstall the print server operating system to start fresh.",
        },
      ],
      correctRemediationId: "pf1-rem-update-driver",
      rationales: [
        {
          id: "pf1-rat1",
          text: "The Event Viewer identifies the specific faulting module (HPPrintDriver_v4.dll), and HP has acknowledged the incompatibility with a newer compatible driver version. Updating the driver fixes the crash while keeping the security patches from the Windows Update.",
        },
        {
          id: "pf1-rat2",
          text: "Uninstalling the Windows Update removes important security patches. The better approach is to update the incompatible driver to a version that works with the new update.",
        },
      ],
      correctRationaleId: "pf1-rat1",
      feedback: {
        perfect:
          "Correct. The faulting module is identified, the vendor has a fix, and updating the driver resolves the crash while preserving the Windows security update. Always update forward rather than rolling back patches.",
        partial:
          "Rolling back the update fixes the immediate issue but leaves the server without security patches. Update the driver instead.",
        wrong: "Reinstalling the server is massively disproportionate to a driver compatibility issue.",
      },
    },
    {
      id: "pf-scenario-2",
      type: "triage-remediate",
      title: "Individual Printer Hardware Failure",
      description:
        "After fixing the print server, most printers are working again. However, one HP LaserJet in the Legal department is producing prints with a repeating gray smear every 3.75 inches down every page. The smear appears on every print job regardless of what is being printed. A test page from the printer's built-in menu shows the same defect.",
      evidence: [
        {
          type: "print-sample",
          content:
            "The gray smear repeats at exactly 3.75-inch intervals on every printed page. The smear is consistent in position and intensity. It appears even on the printer's internal test page (printed without any PC involvement). The interval of 3.75 inches corresponds to the circumference of the printer's drum unit in this model.",
        },
        {
          type: "maintenance-log",
          content:
            "Printer page count: 87,342 pages. The drum unit is rated for 50,000 pages and has never been replaced. The toner cartridge was replaced 2,000 pages ago. The fuser unit was replaced at 60,000 pages and is within its service life.",
        },
        {
          type: "supplies-status",
          content:
            "Printer status page: Toner level 92%. Drum life remaining: 0% (REPLACE DRUM warning active). Fuser life remaining: 45%. Paper tray: Full, correct media loaded.",
        },
      ],
      classifications: [
        {
          id: "pf2-c-toner",
          label: "Defective Toner Cartridge",
          description:
            "The recently replaced toner cartridge is defective and leaking.",
        },
        {
          id: "pf2-c-drum",
          label: "Worn Drum Unit Past End of Life",
          description:
            "The imaging drum has exceeded its rated life by 37,000 pages and is producing repeating defects at drum circumference intervals.",
        },
        {
          id: "pf2-c-fuser",
          label: "Fuser Roller Contamination",
          description:
            "The fuser roller has accumulated toner residue causing a repeating mark.",
        },
      ],
      correctClassificationId: "pf2-c-drum",
      remediations: [
        {
          id: "pf2-rem-replace-drum",
          label: "Replace the drum unit",
          description:
            "Install a new imaging drum unit and reset the drum page counter. Run a cleaning cycle and print several test pages to verify the smear is resolved.",
        },
        {
          id: "pf2-rem-replace-toner",
          label: "Replace the toner cartridge",
          description:
            "Install a new toner cartridge even though the current one is at 92%.",
        },
        {
          id: "pf2-rem-clean-fuser",
          label: "Run fuser cleaning pages",
          description:
            "Print the fuser cleaning page sequence from the printer maintenance menu.",
        },
      ],
      correctRemediationId: "pf2-rem-replace-drum",
      rationales: [
        {
          id: "pf2-rat1",
          text: "The repeating defect at 3.75-inch intervals matches the drum circumference. The drum is at 87,342 pages against a 50,000-page rating (174% of rated life) and shows 0% remaining. The drum surface has degraded, causing a consistent mark at each drum rotation.",
        },
        {
          id: "pf2-rat2",
          text: "The toner is new (92% remaining) and was replaced only 2,000 pages ago. The defect pattern matches the drum rotation, not the toner cartridge roller. The fuser has 45% life remaining and its rotation interval would produce a different defect spacing.",
        },
      ],
      correctRationaleId: "pf2-rat1",
      feedback: {
        perfect:
          "Correct. The repeating interval matches the drum circumference and the drum is far past its rated life. Replacing it will resolve the smear pattern.",
        partial:
          "Fuser cleaning might help if the fuser were contaminated, but the defect interval matches the drum, not the fuser roller.",
        wrong: "The toner is nearly full and recently replaced. The defect interval identifies the drum as the component causing the marks.",
      },
    },
    {
      id: "pf-scenario-3",
      type: "triage-remediate",
      title: "Print Jobs Stuck in Queue for Specific Printer",
      description:
        "After the server fix and the drum replacement, a third issue emerges: users sending jobs to the color printer in Marketing report their jobs show 'Error - Printing' and pile up in the queue. Deleting and resending the jobs does not help. Other printers are working fine from the same PCs. The color printer's front panel shows 'Ready' status.",
      evidence: [
        {
          type: "queue-analysis",
          content:
            "The print queue on the server for this printer shows 23 stuck jobs, all in 'Error' status. The queue cannot be cleared using the normal 'Cancel All Documents' option. The oldest job has been stuck for 2 hours. The spooler does not crash, but jobs for this specific printer fail while jobs to other printers from the same server process normally.",
        },
        {
          type: "port-test",
          content:
            "Port configuration for this printer shows a TCP/IP port pointing to 10.1.5.200 on port 9100 (standard RAW printing). Telnet test: 'telnet 10.1.5.200 9100' connects successfully. Ping to 10.1.5.200 replies in 1ms. The IP address on the printer's configuration page matches 10.1.5.200. However, the printer's configuration page also shows the printer's hostname resolved via DNS to 10.1.5.201 (a different IP). The IP was recently changed during a network reconfiguration but the print server port was not updated.",
        },
        {
          type: "driver-check",
          content:
            "After deeper inspection, the print server port is actually using a WSD (Web Services for Devices) port, not a raw TCP/IP port. The WSD discovery is resolving the printer by its new DHCP-assigned IP (10.1.5.201) but the SNMP status monitoring is querying the old static IP (10.1.5.200) and failing, causing the driver to report an error state. Jobs are sent but the error flag prevents them from printing.",
        },
      ],
      classifications: [
        {
          id: "pf3-c-driver",
          label: "Corrupted Print Driver",
          description:
            "The print driver for this specific printer is corrupted and needs reinstallation.",
        },
        {
          id: "pf3-c-port",
          label: "Port Configuration Mismatch After IP Change",
          description:
            "The WSD port and SNMP monitoring are using stale IP information after the printer's network address changed, causing a status error that blocks print jobs.",
        },
        {
          id: "pf3-c-printer-hw",
          label: "Printer Hardware Fault",
          description:
            "The color printer's internal processing is failing despite showing Ready status.",
        },
      ],
      correctClassificationId: "pf3-c-port",
      remediations: [
        {
          id: "pf3-rem-reconfigure-port",
          label: "Reconfigure the printer port with the correct IP and clear the stuck queue",
          description:
            "Delete the WSD port and create a new standard TCP/IP port pointing to 10.1.5.201 (the printer's current IP). Assign the printer a DHCP reservation to prevent future IP changes. Stop the spooler, clear the C:\\Windows\\System32\\spool\\PRINTERS directory, restart the spooler, and print a test page.",
        },
        {
          id: "pf3-rem-reinstall-driver",
          label: "Remove and reinstall the print driver",
          description:
            "Completely remove the print driver and reinstall it from scratch.",
        },
        {
          id: "pf3-rem-replace-printer",
          label: "Replace the color printer",
          description:
            "The printer may have an internal fault causing the error status.",
        },
      ],
      correctRemediationId: "pf3-rem-reconfigure-port",
      rationales: [
        {
          id: "pf3-rat1",
          text: "The WSD port mismatch after the IP change causes SNMP queries to fail, which flags an error status on the print queue. Reconfiguring the port to the correct IP and adding a DHCP reservation prevents recurrence. Clearing the stuck spooler jobs requires stopping the spooler and cleaning the spool directory.",
        },
        {
          id: "pf3-rat2",
          text: "The driver is not corrupted. The issue is that the printer port is pointing to stale network information. Reinstalling the driver does not change the port configuration.",
        },
      ],
      correctRationaleId: "pf3-rat1",
      feedback: {
        perfect:
          "Correct. The IP change caused a WSD/SNMP mismatch. Reconfiguring the port, reserving the IP, and clearing the stuck queue resolves the issue. Always update print server ports when printer IPs change.",
        partial:
          "The driver is not the problem. The port configuration points to the wrong IP address after the network change.",
        wrong: "The printer itself is working (shows Ready status and telnet connects). The fault is in the print server configuration.",
      },
    },
  ],
  hints: [
    "When all network printers fail simultaneously, the common point of failure is the print server or its Print Spooler service, not the individual printers.",
    "Repeating print defects at consistent intervals correspond to the circumference of a specific roller or drum. Measure the interval and match it to the component.",
    "If a printer shows Ready but jobs stay in Error, check the port configuration. IP address changes, WSD mismatches, and SNMP failures are common causes of phantom errors.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Printer troubleshooting is often undervalued but is one of the most common and visible support tasks. Technicians who can rapidly triage multiple printer issues simultaneously and identify common root causes earn a reputation for efficiency.",
  toolRelevance: [
    "Print Management Console",
    "Windows Services (Print Spooler)",
    "Event Viewer",
    "Printer Configuration Page",
    "telnet (port testing)",
    "DHCP Management Console",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
