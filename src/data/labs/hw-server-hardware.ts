import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "hw-server-hardware",
  version: 1,
  title: "Server Hardware Failure Diagnosis",
  tier: "advanced",
  track: "hardware",
  difficulty: "challenging",
  accessLevel: "premium",
  tags: ["server", "RAID", "ECC-RAM", "hot-swap", "redundancy", "iDRAC", "iLO", "hardware-monitoring"],
  description:
    "Diagnose hardware failures in server environments including RAID degradation, ECC memory errors, and fan failures. Use out-of-band management tools and hardware monitoring to triage and remediate issues.",
  estimatedMinutes: 22,
  learningObjectives: [
    "Interpret server hardware monitoring alerts from out-of-band management (iDRAC, iLO)",
    "Diagnose RAID array degradation and determine correct rebuild procedures",
    "Triage server hardware failures to minimize downtime in production environments",
  ],
  sortOrder: 319,
  status: "published",
  prerequisites: [],
  rendererType: "triage-remediate",
  scenarios: [
    {
      type: "triage-remediate",
      id: "server-1",
      title: "RAID 5 Array in Degraded State",
      description:
        "A Dell PowerEdge R740 file server's iDRAC sends an amber alert: 'Virtual Disk 0 is degraded.' The server has a RAID 5 array across four 2 TB SAS drives. The server is still operational but performance has dropped noticeably. This is a production file server used by 50 employees.",
      evidence: [
        {
          type: "alert",
          content: "iDRAC Alert: Physical Disk 0:1:2 (slot 2) - Predictive Failure. SMART data shows Reallocated Sector Count at warning threshold. Virtual Disk 0 state: Degraded.",
        },
        {
          type: "performance",
          content: "RAID controller log shows the array dropped from RAID 5 (4 drives) to degraded mode (3 drives + failed). Read performance reduced by approximately 40% as parity calculations now reconstruct data from the failed drive's parity.",
        },
        {
          type: "inventory",
          content: "The server has hot-swap drive bays. A compatible replacement 2 TB SAS drive is available in the spare parts inventory. The server has no hot spare configured.",
        },
      ],
      classifications: [
        { id: "class-degraded", label: "RAID 5 degraded - single drive predictive failure", description: "One drive in the RAID 5 array has triggered a SMART predictive failure, degrading the array to fault-tolerance-zero state." },
        { id: "class-controller", label: "RAID controller failure", description: "The RAID controller hardware is malfunctioning." },
        { id: "class-backplane", label: "Drive backplane connectivity issue", description: "The SAS backplane has a faulty connection to one drive slot." },
      ],
      correctClassificationId: "class-degraded",
      remediations: [
        { id: "rem-hot-swap", label: "Hot-swap the failed drive with the spare and initiate rebuild", description: "Remove the predictive-failure drive from the hot-swap bay and insert the replacement. The RAID controller will automatically begin rebuilding the array." },
        { id: "rem-shutdown", label: "Shut down the server and replace all drives", description: "Power off the server and replace all four drives with new ones." },
        { id: "rem-ignore", label: "Monitor the situation and schedule replacement for the weekend", description: "Wait for a maintenance window since the server is still operational." },
      ],
      correctRemediationId: "rem-hot-swap",
      rationales: [
        {
          id: "rat-hotswap",
          text: "RAID 5 in degraded mode has zero fault tolerance - if another drive fails during this window, all data is lost. The hot-swap capability allows replacing the failing drive without shutting down the server. The RAID controller will automatically rebuild the array onto the new drive. This should be done immediately, not deferred to a weekend, because every hour in degraded mode is a risk window.",
        },
        {
          id: "rat-delay",
          text: "Waiting for a maintenance window is extremely risky. In degraded RAID 5, a second drive failure means total data loss. The predictive failure alert means the drive could fail completely at any time. Hot-swap replacement should happen as soon as a spare is available.",
        },
      ],
      correctRationaleId: "rat-hotswap",
      feedback: {
        perfect: "Correct! Immediate hot-swap replacement is critical for degraded RAID 5. Every minute in degraded state is a risk window. Hot-swap bays exist precisely for this zero-downtime scenario.",
        partial: "The urgency assessment needs adjustment. Degraded RAID 5 has zero remaining fault tolerance. Consider the risk of delay.",
        wrong: "Degraded RAID 5 means one more failure equals total data loss. This is not a situation to delay or approach with excessive caution. Hot-swap replacement should be immediate.",
      },
    },
    {
      type: "triage-remediate",
      id: "server-2",
      title: "ECC Memory Correctable Errors Increasing",
      description:
        "An HPE ProLiant DL380 Gen10 application server's iLO reports increasing correctable ECC memory errors on DIMM slot 3A. The server runs a critical database application. Error count has risen from 0 to 847 correctable errors in the past 24 hours.",
      evidence: [
        {
          type: "alert",
          content: "iLO Alert: DIMM 3A correctable ECC error count: 847 in 24 hours (threshold: 50). Error type: Single-bit correctable. No uncorrectable errors yet. DIMM 3A: 32 GB DDR4-2933 Registered ECC.",
        },
        {
          type: "trend",
          content: "Error rate is accelerating: 12 errors in the first 8 hours, 135 errors in the next 8 hours, 700 errors in the last 8 hours. The DIMM has been in service for 3 years.",
        },
        {
          type: "impact",
          content: "Application performance is currently unaffected. ECC is correcting all errors transparently. However, the accelerating trend suggests the DIMM is deteriorating and uncorrectable (multi-bit) errors could follow, which would cause a system crash.",
        },
      ],
      classifications: [
        { id: "class-dimm", label: "Failing DIMM (accelerating ECC errors)", description: "The memory module in slot 3A is deteriorating, with correctable errors increasing exponentially toward potential uncorrectable failure." },
        { id: "class-slot", label: "Defective DIMM slot on motherboard", description: "The memory slot itself has a contact issue causing errors." },
        { id: "class-cosmic", label: "Normal single-event upset (cosmic ray)", description: "The errors are from normal background radiation and will stabilize." },
      ],
      correctClassificationId: "class-dimm",
      remediations: [
        { id: "rem-schedule", label: "Schedule DIMM replacement during the next maintenance window (within 48 hours)", description: "Plan a brief maintenance window to swap the DIMM while the server has memory sparing configured to isolate the failing DIMM from the active pool." },
        { id: "rem-immediate", label: "Shut down the server immediately and replace the DIMM", description: "Emergency shutdown to prevent any chance of uncorrectable errors." },
        { id: "rem-monitor", label: "Continue monitoring for another week", description: "Wait to see if the error rate stabilizes before taking action." },
      ],
      correctRemediationId: "rem-schedule",
      rationales: [
        {
          id: "rat-schedule",
          text: "The errors are currently all correctable and the application is unaffected, so an emergency shutdown is unnecessary. However, the exponentially accelerating error rate indicates the DIMM is degrading and uncorrectable errors could occur soon. Scheduling replacement within 48 hours balances minimizing production downtime with addressing the risk before it becomes critical. Memory sparing can isolate the DIMM meanwhile.",
        },
        {
          id: "rat-monitor",
          text: "Waiting a week with an exponentially accelerating error rate is reckless. At the current acceleration, uncorrectable errors could occur within hours to days, potentially crashing the production database server.",
        },
      ],
      correctRationaleId: "rat-schedule",
      feedback: {
        perfect: "Excellent judgment! Scheduling prompt replacement during a maintenance window balances production availability with the urgency of the accelerating failure. Memory sparing buys time safely.",
        partial: "The urgency assessment needs calibration. Consider the error trend and what happens if correctable errors become uncorrectable on a production database server.",
        wrong: "The exponentially accelerating error rate demands timely action, but the currently correctable nature of the errors allows for a planned approach rather than panic.",
      },
    },
    {
      type: "triage-remediate",
      id: "server-3",
      title: "Server Fan Failure in Hot Aisle",
      description:
        "A rack-mounted server in a data center triggers an iDRAC alert for a failed fan module. The server has redundant hot-swap fans (N+1 configuration). The data center maintains 72F (22C) ambient temperature. The server hosts a load-balanced web application with other servers handling the same traffic.",
      evidence: [
        {
          type: "alert",
          content: "iDRAC Alert: Fan Module 3 failure detected. System fan redundancy: Degraded (N+1 to N). Remaining fans have increased RPM to compensate. Current inlet temperature: 77F (25C).",
        },
        {
          type: "thermal",
          content: "CPU 1 temperature: 72C (warning threshold: 85C, critical: 95C). CPU 2 temperature: 68C. Remaining fans operating at 85% RPM (increased from normal 45%). Ambient data center temperature: 72F (22C).",
        },
        {
          type: "infrastructure",
          content: "The server is in a hot aisle/cold aisle configuration. Spare fan modules are stocked in the data center parts cabinet. The web application traffic has been verified as handled by other servers in the load balancer pool.",
        },
      ],
      classifications: [
        { id: "class-fan", label: "Single fan module failure (redundant)", description: "One fan module has failed but the N+1 redundancy design keeps the server operational. Remaining fans compensate with increased RPM." },
        { id: "class-cooling", label: "Data center cooling failure", description: "The entire data center HVAC system is having issues, affecting this server." },
        { id: "class-thermal", label: "CPU overheating requiring immediate shutdown", description: "The CPUs are approaching dangerous temperatures requiring emergency power-off." },
      ],
      correctClassificationId: "class-fan",
      remediations: [
        { id: "rem-hot-swap-fan", label: "Hot-swap the failed fan module during business hours", description: "Replace the failed fan module from spare stock without server shutdown. Hot-swap fans can be replaced with the server running." },
        { id: "rem-shutdown", label: "Shut down the server immediately and replace the fan", description: "Emergency power-off to prevent thermal damage before replacing the fan." },
        { id: "rem-migrate", label: "Migrate all VMs/workloads off this server first, then shut down for repair", description: "Use live migration to move workloads before powering off for fan replacement." },
      ],
      correctRemediationId: "rem-hot-swap-fan",
      rationales: [
        {
          id: "rat-hotswap-fan",
          text: "The server has hot-swap fan modules specifically designed for live replacement. CPU temperatures are elevated but well below warning thresholds (72C vs 85C warning). The N+1 redundancy keeps the server safe while operating with remaining fans at higher RPM. Replacing the fan module during business hours with no downtime is the correct procedure for enterprise servers with redundant cooling.",
        },
        {
          id: "rat-no-shutdown",
          text: "Shutting down a production server for a fan replacement is unnecessary when the fans are hot-swappable and the server has N+1 redundancy. CPU temps at 72C are well within safe operating range. Enterprise servers are designed for this exact scenario.",
        },
      ],
      correctRationaleId: "rat-hotswap-fan",
      feedback: {
        perfect: "Perfect! Hot-swap fan replacement during business hours is the correct enterprise approach. The server's N+1 redundancy, safe CPU temps, and hot-swap design all support a no-downtime repair.",
        partial: "The redundancy design and temperature readings should inform your urgency level. Enterprise servers have hot-swap components for a reason.",
        wrong: "Review the temperature readings and redundancy state. The server is designed to handle exactly this scenario without downtime. Enterprise hardware repairs should not cause unnecessary outages.",
      },
    },
  ],
  hints: [
    "Degraded RAID 5 has zero remaining fault tolerance. Replace the failed drive as soon as a spare is available - do not delay.",
    "Exponentially increasing ECC errors indicate a deteriorating DIMM that will likely produce uncorrectable errors soon.",
    "Enterprise servers with hot-swap components (fans, drives, PSUs) are designed for live replacement without shutdown.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Server hardware troubleshooting is a core skill for system administrators and data center technicians. Understanding out-of-band management (iDRAC, iLO), RAID states, and hot-swap procedures is essential for minimizing production downtime.",
  toolRelevance: [
    "Dell iDRAC / HPE iLO / Lenovo XClarity (out-of-band management)",
    "RAID controller management utilities",
    "Server hardware event logs",
    "IPMI tools for remote monitoring",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
