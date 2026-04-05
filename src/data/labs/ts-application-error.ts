import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "ts-application-error",
  version: 1,
  title: "Troubleshoot Application Crashes at Specific Times",
  tier: "intermediate",
  track: "hardware-network-troubleshooting",
  difficulty: "moderate",
  accessLevel: "free",
  tags: [
    "application",
    "crash",
    "event-viewer",
    "scheduled-tasks",
    "conflict",
    "troubleshooting",
  ],
  description:
    "An application crashes predictably at specific times. Use Event Viewer, Task Scheduler, and process analysis to determine whether the cause is a resource conflict, scheduled task, or software incompatibility.",
  estimatedMinutes: 20,
  learningObjectives: [
    "Correlate application crash times with Event Viewer entries and scheduled tasks",
    "Use Process Monitor to identify file or registry conflicts between applications",
    "Identify resource contention between scheduled tasks and user applications",
    "Apply targeted fixes to resolve application conflicts without disabling critical services",
  ],
  sortOrder: 506,
  status: "published",
  prerequisites: [],
  rendererType: "triage-remediate",
  scenarios: [
    {
      id: "ae-scenario-1",
      type: "triage-remediate",
      title: "Accounting Software Crashes During Backup Window",
      description:
        "The accounting department reports that their ERP application crashes every day at approximately 1:00 PM. The crash has occurred for the past week. Users lose unsaved work each time. Other applications on the same PCs continue to function normally.",
      evidence: [
        {
          type: "event-log",
          content:
            "Event Viewer Application Log: Faulting application ERPClient.exe at 12:58-13:03 PM daily. Exception code 0xc0000005 (access violation). Faulting module: sqlncli11.dll (SQL Native Client). The crash always occurs during a database write operation.",
        },
        {
          type: "scheduled-task",
          content:
            "Task Scheduler shows a 'SQL Database Backup' job that runs daily at 12:55 PM on the database server. This backup job locks the database tables for exclusive access during the backup window, which lasts approximately 10 minutes. The backup schedule was changed from 2:00 AM to 12:55 PM one week ago by a junior DBA.",
        },
        {
          type: "process-analysis",
          content:
            "Process Monitor shows ERPClient.exe attempting SQL write operations at 12:58 PM that return 'ACCESS DENIED' from the database server because the backup has exclusive table locks. The application does not handle this error gracefully and crashes with an access violation.",
        },
      ],
      classifications: [
        {
          id: "ae1-c-memory",
          label: "Memory Leak in ERP Application",
          description:
            "The ERP application has a memory leak that causes it to crash after running for several hours.",
        },
        {
          id: "ae1-c-backup-conflict",
          label: "Database Backup Lock Conflict",
          description:
            "The database backup job's exclusive table locks conflict with the ERP application's write operations during business hours.",
        },
        {
          id: "ae1-c-virus",
          label: "Malware Interfering with the Application",
          description:
            "Malware is interfering with the ERP application's database connection.",
        },
      ],
      correctClassificationId: "ae1-c-backup-conflict",
      remediations: [
        {
          id: "ae1-rem-reschedule",
          label: "Reschedule the backup to off-hours",
          description:
            "Move the SQL Database Backup job back to 2:00 AM when no users are actively working in the ERP system.",
        },
        {
          id: "ae1-rem-reinstall",
          label: "Reinstall the ERP client on all affected PCs",
          description:
            "Uninstall and reinstall the ERP client application to fix the crash.",
        },
        {
          id: "ae1-rem-add-ram",
          label: "Add more RAM to the database server",
          description:
            "Increase server memory to prevent resource contention.",
        },
      ],
      correctRemediationId: "ae1-rem-reschedule",
      rationales: [
        {
          id: "ae1-rat1",
          text: "The crash occurs precisely when the backup job acquires exclusive table locks, and the timeline correlates with the schedule change one week ago. Moving the backup to off-hours eliminates the conflict between the backup locks and user write operations.",
        },
        {
          id: "ae1-rat2",
          text: "Reinstalling the client does not address the server-side backup lock that causes the access violation. The client is functioning correctly up to the point where the database rejects its writes.",
        },
      ],
      correctRationaleId: "ae1-rat1",
      feedback: {
        perfect:
          "Correct. The schedule change from 2:00 AM to 12:55 PM caused the conflict. Restoring the off-hours schedule eliminates the crash.",
        partial:
          "Additional RAM does not prevent exclusive table locks during backup. The issue is scheduling, not resources.",
        wrong: "The evidence clearly links the crash to the backup schedule change. Client reinstallation does not address server-side locking.",
      },
    },
    {
      id: "ae-scenario-2",
      type: "triage-remediate",
      title: "Application Crashes After Antivirus Update",
      description:
        "A CAD application used by the engineering team crashes on launch with an error 'Unable to load plugin: render_core.dll.' The crashes began on Monday morning. The application was working fine on Friday. No application updates were installed over the weekend.",
      evidence: [
        {
          type: "event-log",
          content:
            "Application log shows: 'CADPro.exe failed to start. Unable to load C:\\Program Files\\CADPro\\plugins\\render_core.dll. Module was blocked by Group Policy or antivirus.' Timestamp: Monday 8:02 AM.",
        },
        {
          type: "antivirus-log",
          content:
            "The corporate antivirus (SentinelOne) pushed a signature update at 3:00 AM Monday. The update added a new heuristic rule that flags DLLs performing direct GPU memory access as 'Suspicious:GenHeuristic.GPU.DirectMem.' render_core.dll was quarantined on all engineering PCs at 3:15 AM. The quarantine log shows the file was moved to the antivirus vault.",
        },
        {
          type: "file-check",
          content:
            "The file C:\\Program Files\\CADPro\\plugins\\render_core.dll does not exist on disk. The antivirus quarantine vault contains the file with a 'Suspicious' classification. The file hash matches the known-good hash from the CADPro vendor's checksum list.",
        },
      ],
      classifications: [
        {
          id: "ae2-c-corrupted",
          label: "Corrupted Application Installation",
          description: "The CAD application installation has become corrupted.",
        },
        {
          id: "ae2-c-false-positive",
          label: "Antivirus False Positive Quarantine",
          description:
            "A new antivirus heuristic incorrectly flagged a legitimate application DLL and quarantined it.",
        },
        {
          id: "ae2-c-malware",
          label: "Actual Malware in the Plugin",
          description:
            "The plugin DLL has been infected with malware that the new signature correctly detected.",
        },
      ],
      correctClassificationId: "ae2-c-false-positive",
      remediations: [
        {
          id: "ae2-rem-restore-exclude",
          label: "Restore the file from quarantine and add an exclusion",
          description:
            "Restore render_core.dll from the antivirus quarantine vault, add the file path to the antivirus exclusion list, and report the false positive to the antivirus vendor.",
        },
        {
          id: "ae2-rem-reinstall-app",
          label: "Reinstall CADPro on all engineering PCs",
          description:
            "Uninstall and reinstall the CAD application to replace the missing DLL.",
        },
        {
          id: "ae2-rem-disable-av",
          label: "Disable the antivirus entirely",
          description:
            "Turn off the antivirus to prevent it from quarantining application files.",
        },
      ],
      correctRemediationId: "ae2-rem-restore-exclude",
      rationales: [
        {
          id: "ae2-rat1",
          text: "The file hash matches the vendor's known-good checksum, the quarantine coincides with a new heuristic rule, and the application worked before the AV update. This is a classic false positive. Restoring the file, excluding it, and reporting to the vendor is the correct response.",
        },
        {
          id: "ae2-rat2",
          text: "Reinstalling would replace the DLL, but the antivirus would quarantine it again immediately unless an exclusion is added first.",
        },
      ],
      correctRationaleId: "ae2-rat1",
      feedback: {
        perfect:
          "Correct. The verified file hash, timing with the AV update, and quarantine log all confirm a false positive. Restore, exclude, and report to the vendor.",
        partial:
          "Reinstalling replaces the file but the AV will quarantine it again. You must add the exclusion first.",
        wrong: "Disabling antivirus entirely removes critical security protection. Targeted exclusions are the professional approach.",
      },
    },
    {
      id: "ae-scenario-3",
      type: "triage-remediate",
      title: "Application Freezes at End of Month",
      description:
        "A payroll application freezes and becomes unresponsive for 10-15 minutes at the end of every month when HR processes payroll for 500 employees. The application works fine during the rest of the month with smaller batch operations.",
      evidence: [
        {
          type: "task-manager",
          content:
            "During the freeze: PayrollApp.exe CPU at 2%, Memory at 1.8 GB (of 16 GB available), Disk at 3%. The application window shows '(Not Responding)' in the title bar. The application has a single-threaded architecture for database operations.",
        },
        {
          type: "database-query",
          content:
            "The payroll calculation runs a single SQL query that processes all 500 employee records sequentially. The query takes 12 minutes to complete. During this time, the application UI thread is blocked waiting for the database response. The database server CPU is at 85% processing the query, with the payroll calculation query using a full table scan instead of indexed lookups.",
        },
        {
          type: "performance-history",
          content:
            "Six months ago, the company had 250 employees and the payroll run took 3 minutes. The processing time has grown linearly with headcount. At the current growth rate, next quarter's payroll run will take over 20 minutes.",
        },
      ],
      classifications: [
        {
          id: "ae3-c-memory",
          label: "Insufficient RAM on the Workstation",
          description: "The workstation needs more memory to handle the payroll batch.",
        },
        {
          id: "ae3-c-db-performance",
          label: "Unoptimized Database Query with Missing Index",
          description:
            "The payroll query performs a full table scan instead of using indexed lookups, causing linear scaling with employee count that blocks the single-threaded application UI.",
        },
        {
          id: "ae3-c-network",
          label: "Network Latency to Database Server",
          description:
            "Network latency is causing the database query to take too long.",
        },
      ],
      correctClassificationId: "ae3-c-db-performance",
      remediations: [
        {
          id: "ae3-rem-add-index",
          label: "Add appropriate database indexes and escalate the UI threading issue to the vendor",
          description:
            "Work with the DBA to add indexes on the payroll calculation tables to eliminate the full table scan, and submit a feature request to the vendor for asynchronous query handling in the application.",
        },
        {
          id: "ae3-rem-upgrade-pc",
          label: "Upgrade the workstation hardware",
          description:
            "Install a faster CPU and more RAM in the HR workstation.",
        },
        {
          id: "ae3-rem-split-batches",
          label: "Tell HR to process payroll in smaller batches",
          description:
            "Have HR run payroll in groups of 100 employees at a time.",
        },
      ],
      correctRemediationId: "ae3-rem-add-index",
      rationales: [
        {
          id: "ae3-rat1",
          text: "The full table scan causes the query to scale linearly with employee count. Adding appropriate indexes reduces the query time dramatically. The UI freeze is a vendor-side architectural issue that should be reported, but the immediate fix is database optimization.",
        },
        {
          id: "ae3-rat2",
          text: "The workstation CPU is at 2% and memory is well within limits. The bottleneck is on the database server running an unoptimized query, not the local hardware.",
        },
      ],
      correctRationaleId: "ae3-rat1",
      feedback: {
        perfect:
          "Correct. The full table scan is the root cause of the performance degradation. Database indexing addresses the immediate problem, and reporting the single-threaded UI to the vendor addresses the architectural issue.",
        partial:
          "Splitting batches is a workaround that adds burden to HR. Fix the database performance issue instead.",
        wrong: "The workstation hardware is not the bottleneck. CPU and memory usage on the PC are low during the freeze.",
      },
    },
  ],
  hints: [
    "When an application crashes at the same time every day, check Task Scheduler and server maintenance windows for conflicting scheduled operations.",
    "If an application suddenly stops working after a weekend, check antivirus signature updates and Windows updates that may have been applied automatically.",
    "When an application freezes but CPU and memory are low, the bottleneck is likely I/O or a blocked thread waiting for an external response.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Application troubleshooting often requires cross-team collaboration with DBAs, security teams, and vendors. Technicians who can gather the right evidence and communicate findings clearly across teams are promoted faster.",
  toolRelevance: [
    "Event Viewer",
    "Task Scheduler",
    "Process Monitor (Sysinternals)",
    "Task Manager",
    "Antivirus Management Console",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
