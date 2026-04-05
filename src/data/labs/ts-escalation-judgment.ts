import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "ts-escalation-judgment",
  version: 1,
  title: "When to Escalate vs. Self-Resolve",
  tier: "intermediate",
  track: "hardware-network-troubleshooting",
  difficulty: "moderate",
  accessLevel: "free",
  tags: [
    "escalation",
    "judgment",
    "priority",
    "sla",
    "communication",
    "troubleshooting",
  ],
  description:
    "Practice the critical judgment call of when to escalate an issue to a senior technician, vendor, or manager versus when to continue troubleshooting yourself. Learn the escalation criteria used in professional IT environments.",
  estimatedMinutes: 18,
  learningObjectives: [
    "Identify situations that require immediate escalation based on impact and scope",
    "Recognize when continued self-troubleshooting wastes time versus when escalation is premature",
    "Apply SLA timelines and business impact to escalation decisions",
    "Communicate escalation requests with proper documentation and context",
    "Understand the role of escalation in the troubleshooting methodology",
  ],
  sortOrder: 509,
  status: "published",
  prerequisites: [],
  rendererType: "action-rationale",
  scenarios: [
    {
      id: "ej-scenario-1",
      type: "action-rationale",
      title: "Server Room Environmental Alert",
      context:
        "You receive a monitoring alert: the server room temperature has risen from 68°F to 88°F in the last 30 minutes and is continuing to climb. The HVAC system shows an error state. You are a tier-1 desktop support technician. The server room contains 12 production servers serving 400 users. The facilities team and the senior sysadmin are available by phone. Server hardware typically begins throttling at 95°F and can sustain damage above 104°F.",
      actions: [
        {
          id: "ej1-investigate-hvac",
          label: "Go to the server room and try to troubleshoot the HVAC system yourself",
          color: "red",
        },
        {
          id: "ej1-escalate-immediately",
          label: "Immediately call facilities for HVAC repair and the senior sysadmin to prepare server protection measures, then open the server room door for temporary airflow",
          color: "green",
        },
        {
          id: "ej1-monitor-temp",
          label: "Continue monitoring the temperature and escalate if it reaches 95°F",
          color: "orange",
        },
        {
          id: "ej1-shutdown-servers",
          label: "Immediately shut down all 12 servers to prevent heat damage",
          color: "yellow",
        },
      ],
      correctActionId: "ej1-escalate-immediately",
      rationales: [
        {
          id: "ej1-r1",
          text: "This is a high-impact, time-sensitive situation affecting 400 users worth of production infrastructure. HVAC repair is outside your skillset, and the sysadmin needs to prepare contingency plans. Escalating immediately while providing temporary relief (opening the door) is the correct response.",
        },
        {
          id: "ej1-r2",
          text: "Troubleshooting HVAC systems is not within a desktop technician's scope. Attempting it wastes critical time as temperatures continue to rise.",
        },
        {
          id: "ej1-r3",
          text: "Waiting until 95°F leaves almost no margin before hardware throttling. At the current rate of climb, you have approximately 10-15 minutes before damage risk. Escalate now while there is time to respond.",
        },
        {
          id: "ej1-r4",
          text: "Shutting down all servers causes a total outage for 400 users. The sysadmin should make that decision based on a proper risk assessment, not a tier-1 technician acting unilaterally.",
        },
      ],
      correctRationaleId: "ej1-r1",
      feedback: {
        perfect:
          "Correct. This requires immediate escalation to the right teams. Environmental emergencies with production impact need facilities for HVAC and senior staff for server decisions. You provided temporary mitigation while escalating.",
        partial:
          "Waiting for a higher threshold wastes valuable response time. The temperature trajectory matters more than the current reading.",
        wrong: "Either you are outside your scope trying to fix HVAC, or you are making a major infrastructure decision that belongs to senior staff.",
      },
    },
    {
      id: "ej-scenario-2",
      type: "action-rationale",
      title: "Single User Printer Issue at 45 Minutes",
      context:
        "A single user cannot print to their local USB printer. You have been troubleshooting for 45 minutes. You have tried: restarting the Print Spooler, reinstalling the printer driver, using a different USB port, and testing with a different USB cable. None of these resolved the issue. The printer works when connected to a different PC. The user's PC does not recognize any USB device plugged into any port. Your department SLA is 1 hour for standard priority tickets. A senior technician is available.",
      actions: [
        {
          id: "ej2-keep-trying",
          label: "Continue troubleshooting for the remaining 15 minutes before the SLA expires",
          color: "orange",
        },
        {
          id: "ej2-escalate-with-docs",
          label: "Escalate to the senior technician with full documentation of all steps taken and your finding that no USB ports are functional",
          color: "green",
        },
        {
          id: "ej2-replace-pc",
          label: "Replace the user's PC since no USB ports work",
          color: "blue",
        },
        {
          id: "ej2-reinstall-windows",
          label: "Reinstall Windows to fix the USB subsystem",
          color: "red",
        },
      ],
      correctActionId: "ej2-escalate-with-docs",
      rationales: [
        {
          id: "ej2-r1",
          text: "You have exhausted standard troubleshooting steps and identified the real issue: complete USB failure across all ports. This points to a motherboard USB controller failure or BIOS/firmware issue that is beyond tier-1 scope. Escalating with documentation ensures the senior tech does not repeat your steps.",
        },
        {
          id: "ej2-r2",
          text: "Continuing to troubleshoot the same problem for 15 more minutes without new ideas wastes time. You have already isolated the issue to the USB subsystem.",
        },
        {
          id: "ej2-r3",
          text: "Replacing the PC may be the eventual outcome, but that decision should be made by the senior tech after verifying the USB controller failure and checking if a BIOS update or USB controller reset might fix it.",
        },
        {
          id: "ej2-r4",
          text: "Reinstalling Windows is a 2+ hour process that likely will not fix a hardware-level USB controller issue. The senior tech should assess whether this is hardware before committing to a destructive action.",
        },
      ],
      correctRationaleId: "ej2-r1",
      feedback: {
        perfect:
          "Correct. You reached the limit of tier-1 troubleshooting, identified the scope of the failure, and escalated with complete documentation. This is the professional approach when you have exhausted your tools.",
        partial:
          "Running out the SLA clock without escalating is worse than escalating with 15 minutes remaining. The SLA exists to protect the user.",
        wrong: "Major hardware decisions and destructive OS actions belong to senior staff when the diagnosis points to a hardware failure.",
      },
    },
    {
      id: "ej-scenario-3",
      type: "action-rationale",
      title: "Premature Escalation Scenario",
      context:
        "A user's Outlook is not connecting to the Exchange server. You have spent 5 minutes on the ticket. You confirmed the user's internet works (web browsing is fine). You have not yet checked the Outlook profile, tested Outlook in Safe Mode, or verified Exchange server status. A colleague suggests you escalate to the Exchange admin team immediately since it might be a server issue.",
      actions: [
        {
          id: "ej3-escalate-now",
          label: "Escalate to the Exchange admin team as your colleague suggests",
          color: "red",
        },
        {
          id: "ej3-continue-basic",
          label: "Continue basic troubleshooting: test Outlook Safe Mode, check the Outlook profile, verify if other users can connect to Exchange, and check Exchange server status in the monitoring dashboard",
          color: "green",
        },
        {
          id: "ej3-reinstall-outlook",
          label: "Reinstall Microsoft Office to fix the Outlook issue",
          color: "orange",
        },
        {
          id: "ej3-create-new-profile",
          label: "Immediately create a new Outlook profile without further diagnosis",
          color: "yellow",
        },
      ],
      correctActionId: "ej3-continue-basic",
      rationales: [
        {
          id: "ej3-r1",
          text: "Five minutes is far too early to escalate a single-user Outlook issue. Basic checks like Safe Mode, profile verification, and confirming whether other users are affected should take 10-15 minutes and will determine if the issue is local or server-side before involving the Exchange team.",
        },
        {
          id: "ej3-r2",
          text: "Escalating without performing basic diagnostics wastes the Exchange admin team's time. If the issue is a corrupted local profile, they will send it right back to you.",
        },
        {
          id: "ej3-r3",
          text: "Reinstalling Office is a 30+ minute process that should only be attempted after basic troubleshooting has ruled out simpler fixes like Safe Mode or a profile rebuild.",
        },
        {
          id: "ej3-r4",
          text: "Creating a new profile without diagnosis might work but does not identify the root cause. If the issue is server-side, a new profile will not help. Basic diagnosis first.",
        },
      ],
      correctRationaleId: "ej3-r1",
      feedback: {
        perfect:
          "Correct. Continue basic troubleshooting before escalating. Check Outlook Safe Mode, the profile, and whether other users are affected. Escalation should happen after you have exhausted your scope, not after 5 minutes.",
        partial:
          "Creating a new profile might fix a profile issue, but you should first verify the Exchange server is reachable and check if others are affected. Diagnosis before action.",
        wrong: "Premature escalation wastes other teams' time and marks you as someone who cannot handle tier-1 work independently.",
      },
    },
  ],
  hints: [
    "Escalate immediately when the impact is high (many users affected), the issue is outside your skillset, or there is a risk of damage (data loss, hardware damage, security breach).",
    "Do not escalate until you have exhausted the troubleshooting steps within your scope and documented everything you tried.",
    "When escalating, always include: what the problem is, what you have already tried, what you found, and why you are escalating.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Knowing when to escalate is one of the most important soft skills in IT. Escalating too early makes you look incapable; escalating too late causes SLA breaches and extended outages. Hiring managers specifically ask about escalation judgment in interviews.",
  toolRelevance: [
    "Help Desk Ticketing System",
    "Monitoring Dashboard",
    "SLA Documentation",
    "Escalation Matrix",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
