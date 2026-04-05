import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "ts-server-down",
  version: 1,
  title: "Production Server Unresponsive",
  tier: "advanced",
  track: "hardware-network-troubleshooting",
  difficulty: "challenging",
  accessLevel: "premium",
  tags: [
    "server",
    "production",
    "outage",
    "remote-management",
    "services",
    "troubleshooting",
  ],
  description:
    "A production server has stopped responding to all network requests. 200 users are affected. Use remote management tools, server logs, and systematic diagnosis to identify the cause and restore service with minimal downtime.",
  estimatedMinutes: 25,
  learningObjectives: [
    "Use out-of-band management (iLO, iDRAC, IPMI) to access an unresponsive server",
    "Prioritize diagnosis based on business impact and user count",
    "Interpret server event logs and performance counters to identify resource exhaustion",
    "Distinguish between server hardware failure, OS crash, and service-level failures",
    "Apply recovery procedures that minimize data loss and downtime",
  ],
  sortOrder: 511,
  status: "published",
  prerequisites: [],
  rendererType: "investigate-decide",
  scenarios: [
    {
      id: "sd-scenario-1",
      type: "investigate-decide",
      title: "Initial Server Access and Assessment",
      objective:
        "The monitoring system shows the file server (FS01, Windows Server 2022) as unreachable. Ping fails, RDP fails, and the file shares are inaccessible. 200 users are unable to access their files. The server is in a data center 2 floors away. Determine the fastest way to assess the server's state.",
      investigationData: [
        {
          id: "sd1-monitoring",
          label: "Monitoring System Alerts",
          content:
            "Server FS01 went offline at 9:47 AM. All monitoring probes (ICMP, TCP 445, TCP 3389) show DOWN. Last successful check was at 9:46 AM. The monitoring system also shows that the server's iDRAC management IP (192.168.10.15) is still responding to ping. No other servers in the same rack are affected.",
          isCritical: true,
        },
        {
          id: "sd1-idrac",
          label: "iDRAC Remote Console Access",
          content:
            "Connecting to the iDRAC web console at 192.168.10.15 succeeds. The iDRAC dashboard shows: Power State: ON. System Health: Warning — Amber. CPU temperature: 62°C (normal). Memory status: OK. Virtual console shows the Windows Server desktop is frozen at a screen displaying 'Your PC ran into a problem and needs to restart. Stop code: KERNEL_DATA_INPAGE_ERROR.' Collecting error info: 78% complete.",
          isCritical: true,
        },
        {
          id: "sd1-raid",
          label: "iDRAC Storage Controller Status",
          content:
            "RAID Controller: PERC H740P. Virtual Disk 0 (RAID 5, 4x 2TB SAS): Status DEGRADED. Physical Disk 0:1:2 shows 'Failed' state. Physical Disk 0:1:3 shows 'Online' but with 47 predicted failures. The RAID array lost one disk and a second disk is showing pre-failure SMART warnings.",
        },
      ],
      actions: [
        {
          id: "sd1-force-reboot",
          label: "Immediately force reboot the server through iDRAC to restore service",
          color: "orange",
        },
        {
          id: "sd1-replace-and-rebuild",
          label: "Replace the failed disk, initiate a RAID rebuild, then allow the BSOD collection to complete and reboot",
          color: "green",
        },
        {
          id: "sd1-physical-visit",
          label: "Walk to the data center to physically inspect the server before taking any action",
          color: "blue",
        },
        {
          id: "sd1-failover",
          label: "Immediately fail over to the backup server and deal with FS01 later",
          color: "yellow",
        },
      ],
      correctActionId: "sd1-replace-and-rebuild",
      rationales: [
        {
          id: "sd1-r1",
          text: "The BSOD stop code KERNEL_DATA_INPAGE_ERROR indicates a failed read from the disk subsystem, which correlates with the RAID degraded state and failed physical disk. Replacing the failed disk and starting the RAID rebuild before rebooting ensures the array can sustain another disk loss. Rebooting on a degraded array with a second disk showing pre-failure is extremely risky.",
        },
        {
          id: "sd1-r2",
          text: "Force rebooting without replacing the failed disk means the server will boot on a degraded RAID 5 with a second disk in pre-failure. If that disk fails during reboot, all data is lost.",
        },
        {
          id: "sd1-r3",
          text: "A physical visit wastes 10-15 minutes when iDRAC already provides full remote visibility into the server state, hardware health, and virtual console.",
        },
        {
          id: "sd1-r4",
          text: "Failing over to a backup is an option but should be considered after assessing whether FS01 can be recovered quickly. If the backup is outdated, users may lose recent work.",
        },
      ],
      correctRationaleId: "sd1-r1",
      feedback: {
        perfect:
          "Correct. The RAID degraded state caused the BSOD. Replace the failed disk first to protect the array, then reboot. iDRAC provides everything you need to diagnose without a physical visit.",
        partial:
          "Failing over is a valid business continuity step, but the root cause still needs to be addressed. The RAID degradation must be fixed regardless.",
        wrong: "Rebooting on a degraded RAID array with a second disk showing pre-failure warnings risks total data loss.",
      },
    },
    {
      id: "sd-scenario-2",
      type: "investigate-decide",
      title: "Server Running But Services Unresponsive",
      objective:
        "After replacing the failed disk and rebooting, the server comes up and is pingable, but file shares are still inaccessible. Users report 'The specified network name is no longer available.' RDP to the server works. Investigate why the file sharing service is not running.",
      investigationData: [
        {
          id: "sd2-services",
          label: "Windows Services Console (services.msc)",
          content:
            "The 'Server' service (LanmanServer) status is 'Stopped.' Attempting to start it returns: 'Windows could not start the Server service on Local Computer. Error 1068: The dependency service or group failed to start.' The dependency tree shows the Server service depends on 'Security Accounts Manager' which depends on 'Remote Procedure Call (RPC).' RPC is running, but Security Accounts Manager shows 'Stopped' with start type 'Disabled.'",
          isCritical: true,
        },
        {
          id: "sd2-event-log",
          label: "Event Viewer — System Log",
          content:
            "Warning Event 7040: 'The start type of the Security Accounts Manager service was changed from auto start to disabled.' Timestamp: 9:42 AM today (5 minutes before the crash). The change was made by the account 'DOMAIN\\svc-backup' which is the service account used by the backup software.",
          isCritical: true,
        },
        {
          id: "sd2-backup-log",
          label: "Backup Software Log",
          content:
            "The backup software log shows it ran a 'pre-backup system state optimization' script at 9:42 AM that disabled several services it considered non-essential during backup. The script disabled the Security Accounts Manager service. The backup then failed due to the disk error at 9:47 AM before it could re-enable the services in its post-backup script.",
        },
      ],
      actions: [
        {
          id: "sd2-enable-sam",
          label: "Set the Security Accounts Manager service to Automatic, start it, then start the Server service to restore file shares",
          color: "green",
        },
        {
          id: "sd2-reinstall-backup",
          label: "Uninstall the backup software to prevent it from disabling services again",
          color: "orange",
        },
        {
          id: "sd2-system-restore",
          label: "Run System Restore to a point before the backup script ran",
          color: "red",
        },
        {
          id: "sd2-reboot-again",
          label: "Reboot the server again since the services may auto-start after a clean boot",
          color: "blue",
        },
      ],
      correctActionId: "sd2-enable-sam",
      rationales: [
        {
          id: "sd2-r1",
          text: "The backup software's pre-backup script disabled the SAM service, and the crash prevented the post-backup script from re-enabling it. Setting the service back to Automatic and starting it restores the dependency chain, allowing the Server (file sharing) service to start.",
        },
        {
          id: "sd2-r2",
          text: "Uninstalling backup software removes a critical data protection service. The correct fix is to restore the service configuration and then fix the backup script so it does not disable critical services.",
        },
        {
          id: "sd2-r3",
          text: "System Restore on a production server is risky and unnecessary when the fix is simply changing a service start type back to Automatic.",
        },
        {
          id: "sd2-r4",
          text: "Rebooting will not help because the SAM service start type is set to Disabled. It will remain stopped across reboots until the start type is changed.",
        },
      ],
      correctRationaleId: "sd2-r1",
      feedback: {
        perfect:
          "Correct. The backup script disabled a critical dependency service. Restoring its start type and starting the service chain resolves the file sharing outage immediately.",
        partial:
          "Rebooting does not fix a service set to Disabled. You must change the start type first.",
        wrong: "System Restore and backup software removal are disproportionate responses to a service configuration issue.",
      },
    },
    {
      id: "sd-scenario-3",
      type: "investigate-decide",
      title: "Post-Incident Review and Prevention",
      objective:
        "File shares are restored and 200 users are back online. The total outage was 35 minutes. You need to prepare the post-incident review and recommend preventive measures. The RAID rebuild is in progress (estimated 6 hours). A second disk is showing pre-failure warnings.",
      investigationData: [
        {
          id: "sd3-timeline",
          label: "Incident Timeline",
          content:
            "9:42 AM — Backup script disables SAM service. 9:47 AM — Disk 0:1:2 fails, RAID degrades, BSOD occurs. 9:48 AM — Monitoring alert received. 9:50 AM — Technician accesses iDRAC. 9:55 AM — Root cause identified (RAID failure + disabled service). 10:05 AM — Failed disk replaced, server rebooted. 10:15 AM — SAM service re-enabled, file shares restored. 10:22 AM — All 200 users confirmed operational. Total downtime: 35 minutes.",
        },
        {
          id: "sd3-risk-assessment",
          label: "Current Risk Assessment",
          content:
            "Physical Disk 0:1:3 has 47 predicted failures in SMART data. RAID 5 with one disk rebuilding and a second disk in pre-failure state has zero fault tolerance. If disk 0:1:3 fails during the rebuild, the entire RAID array and all data will be lost. The rebuild process puts heavy load on all remaining disks, increasing the likelihood of a second failure.",
          isCritical: true,
        },
        {
          id: "sd3-backup-status",
          label: "Backup and Redundancy Status",
          content:
            "Last successful full backup: yesterday at 2:00 AM. Incremental backup at 9:42 AM failed due to the disk error. No file server replica or failover cluster exists. The data on this server is the primary copy for 200 users' work files.",
        },
      ],
      actions: [
        {
          id: "sd3-wait-rebuild",
          label: "Wait for the RAID rebuild to complete and monitor for additional disk failures",
          color: "orange",
        },
        {
          id: "sd3-proactive-replace",
          label: "Proactively replace the pre-failure disk now, verify backups are current, and recommend RAID 6 or a hot spare for future resilience",
          color: "green",
        },
        {
          id: "sd3-just-document",
          label: "Document the incident and close it since service is restored",
          color: "red",
        },
        {
          id: "sd3-migrate-data",
          label: "Immediately migrate all data to a new server",
          color: "blue",
        },
      ],
      correctActionId: "sd3-proactive-replace",
      rationales: [
        {
          id: "sd3-r1",
          text: "The pre-failure disk poses an immediate risk during the RAID rebuild. Proactively replacing it after the rebuild completes (or swapping it as a hot spare) eliminates the single point of failure. Verifying backups ensures a recovery path exists. Recommending RAID 6 or a hot spare provides dual-disk fault tolerance going forward.",
        },
        {
          id: "sd3-r2",
          text: "Waiting passively while a known-failing disk runs under heavy rebuild I/O is gambling with 200 users' data. The SMART warnings are predictive and should be acted on proactively.",
        },
        {
          id: "sd3-r3",
          text: "Closing without addressing the pre-failure disk and backup script issue leaves the same failure mode in place for next time.",
        },
        {
          id: "sd3-r4",
          text: "Migrating to a new server during a RAID rebuild adds unnecessary risk. Fix the current server first, then plan a migration if needed.",
        },
      ],
      correctRationaleId: "sd3-r1",
      feedback: {
        perfect:
          "Correct. Address the pre-failure disk proactively, verify backups, fix the backup script, and recommend improved RAID resilience. Post-incident actions should prevent recurrence.",
        partial:
          "Waiting for the rebuild to complete before addressing the pre-failure disk is a gamble. SMART predictions should be acted on, especially under rebuild stress.",
        wrong: "The incident is not over just because users are back online. The underlying risks must be addressed to prevent data loss.",
      },
    },
  ],
  hints: [
    "Out-of-band management (iDRAC, iLO, IPMI) lets you access a server that is completely unresponsive to network traffic, without a physical visit.",
    "KERNEL_DATA_INPAGE_ERROR almost always indicates a storage subsystem failure: check RAID status, disk health, and controller logs.",
    "When a service will not start due to a dependency failure, trace the dependency chain until you find the stopped or disabled service in the chain.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Production server outages are the highest-visibility incidents in IT. Technicians who can quickly diagnose and recover a downed server earn rapid trust from management and are fast-tracked for senior roles and on-call responsibilities.",
  toolRelevance: [
    "Dell iDRAC / HP iLO / IPMI",
    "Windows Services Console",
    "Event Viewer",
    "RAID Controller Management",
    "CrystalDiskInfo / SMART monitoring",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
