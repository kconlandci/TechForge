import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "ts-documentation-review",
  version: 1,
  title: "Review and Improve Troubleshooting Documentation",
  tier: "advanced",
  track: "hardware-network-troubleshooting",
  difficulty: "challenging",
  accessLevel: "premium",
  tags: [
    "documentation",
    "knowledge-base",
    "sop",
    "process-improvement",
    "troubleshooting",
  ],
  description:
    "Evaluate existing troubleshooting documentation and knowledge base articles for accuracy, completeness, and usability. Identify gaps, incorrect procedures, and opportunities to improve the team's troubleshooting resources.",
  estimatedMinutes: 22,
  learningObjectives: [
    "Evaluate troubleshooting documentation for technical accuracy and completeness",
    "Identify missing steps, incorrect procedures, and outdated information in existing docs",
    "Apply documentation best practices including clear structure, version control, and audience awareness",
    "Recognize when a knowledge base article could prevent unnecessary escalations",
    "Improve documentation to reduce mean time to resolution for common issues",
  ],
  sortOrder: 514,
  status: "published",
  prerequisites: [],
  rendererType: "action-rationale",
  scenarios: [
    {
      id: "dr-scenario-1",
      type: "action-rationale",
      title: "Evaluating a Flawed KB Article",
      context:
        "You are reviewing the team's knowledge base. A frequently referenced article titled 'Fix: Outlook Not Connecting to Exchange' contains these steps: 1) Restart the computer. 2) If that doesn't work, create a new Outlook profile. 3) If still broken, reinstall Office. 4) Escalate to Exchange team. The article was written 2 years ago and has been used to resolve 47 tickets. However, the team's ticket data shows that 60% of Outlook connectivity issues in the past 6 months were caused by expired passwords or MFA token failures, which this article does not mention.",
      actions: [
        {
          id: "dr1-keep-article",
          label: "Keep the article as-is since it has resolved 47 tickets",
          color: "red",
        },
        {
          id: "dr1-rewrite-article",
          label: "Rewrite the article to start with the most common causes (credentials, MFA, network), add diagnostic steps before each fix, and include verification steps",
          color: "green",
        },
        {
          id: "dr1-delete-article",
          label: "Delete the article since it is outdated and misleading",
          color: "orange",
        },
        {
          id: "dr1-add-note",
          label: "Add a note at the top saying 'Also check passwords and MFA' but leave the rest unchanged",
          color: "yellow",
        },
      ],
      correctActionId: "dr1-rewrite-article",
      rationales: [
        {
          id: "dr1-r1",
          text: "The article skips diagnosis entirely and jumps to increasingly destructive fixes. 60% of cases are credential-related, yet the article does not mention credentials. A proper rewrite starts with the most common causes, includes diagnostic checks before each action, and adds verification steps.",
        },
        {
          id: "dr1-r2",
          text: "Keeping a flawed article leads to unnecessary Outlook profile recreations and Office reinstalls when the actual cause is an expired password or MFA issue.",
        },
        {
          id: "dr1-r3",
          text: "Deleting the article removes all institutional knowledge. Rewriting preserves the useful parts while fixing the gaps.",
        },
        {
          id: "dr1-r4",
          text: "A quick note is better than nothing but does not fix the structural problem: the article lacks diagnostic steps and jumps to destructive actions without verification.",
        },
      ],
      correctRationaleId: "dr1-r1",
      feedback: {
        perfect:
          "Correct. A proper KB article starts with diagnostic steps (check credentials, check MFA, check network), proceeds through fixes in order of least to most disruptive, and includes verification at each step.",
        partial:
          "Adding a note helps somewhat, but the article's structure is fundamentally flawed. It needs a complete rewrite to be effective.",
        wrong: "The article contains some useful information. Deleting or keeping it as-is are both suboptimal. Improve it.",
      },
    },
    {
      id: "dr-scenario-2",
      type: "action-rationale",
      title: "Missing Documentation After an Incident",
      context:
        "Last week, a senior technician spent 3 hours troubleshooting a VPN connectivity issue caused by a Windows Firewall profile switching from 'Domain' to 'Public' after a network change. The fix was to run 'gpupdate /force' to reapply the domain firewall profile. The technician resolved the issue but did not document the solution. This week, the same issue occurred for two other users, and a junior technician spent 2 hours on each ticket before escalating. You are reviewing the gap.",
      actions: [
        {
          id: "dr2-verbal-training",
          label: "Ask the senior tech to verbally tell the team about the fix at the next meeting",
          color: "orange",
        },
        {
          id: "dr2-create-kb",
          label: "Create a detailed KB article with symptoms, diagnostic steps, root cause explanation, fix, and verification, then link it to the ticketing system for auto-suggestion",
          color: "green",
        },
        {
          id: "dr2-email-team",
          label: "Send an email to the team describing the fix",
          color: "yellow",
        },
        {
          id: "dr2-ignore",
          label: "It's a rare issue that might not happen again; documenting it is not worth the time",
          color: "red",
        },
      ],
      correctActionId: "dr2-create-kb",
      rationales: [
        {
          id: "dr2-r1",
          text: "Three occurrences in two weeks is a pattern, not a rare event. A KB article with symptoms and diagnostic steps allows any technician to resolve the issue in minutes instead of hours. Linking it to the ticketing system enables auto-suggestion when matching symptoms are entered.",
        },
        {
          id: "dr2-r2",
          text: "Verbal knowledge transfer is unreliable. Team members forget, miss meetings, or leave the company. Written documentation persists and scales.",
        },
        {
          id: "dr2-r3",
          text: "Emails get lost in inboxes and are not searchable in the context of a troubleshooting workflow. KB articles integrated with the ticketing system are available at the point of need.",
        },
        {
          id: "dr2-r4",
          text: "Seven hours of technician time were spent on an issue that could be resolved in 10 minutes with documentation. The ROI on writing the article is immediate.",
        },
      ],
      correctRationaleId: "dr2-r1",
      feedback: {
        perfect:
          "Correct. Creating a searchable, structured KB article linked to the ticketing system ensures any technician can resolve this issue quickly. The 7 hours already wasted justify the 30 minutes to document the fix.",
        partial:
          "Emails and verbal transfers are better than nothing, but they are not searchable at the point of need. A KB article is the professional standard.",
        wrong: "Ignoring a documented pattern of repeat incidents guarantees more wasted hours in the future.",
      },
    },
    {
      id: "dr-scenario-3",
      type: "action-rationale",
      title: "SOP for a Critical Process",
      context:
        "You are tasked with creating a Standard Operating Procedure (SOP) for responding to a server room environmental alert (temperature, humidity, water leak). Currently, there is no written procedure — technicians use their judgment, which has led to inconsistent responses. Last month, a junior tech ignored a humidity alert that later caused condensation on server components. You need to decide the best approach to the SOP.",
      actions: [
        {
          id: "dr3-simple-checklist",
          label: "Create a one-page checklist with alert types, immediate actions, escalation contacts, and decision thresholds for each environmental parameter",
          color: "green",
        },
        {
          id: "dr3-detailed-manual",
          label: "Write a 20-page comprehensive manual covering every possible environmental scenario",
          color: "orange",
        },
        {
          id: "dr3-trust-judgment",
          label: "Continue relying on technician judgment since every situation is different",
          color: "red",
        },
        {
          id: "dr3-automated-only",
          label: "Set up automated alerts and responses so humans do not need to be involved",
          color: "blue",
        },
      ],
      correctActionId: "dr3-simple-checklist",
      rationales: [
        {
          id: "dr3-r1",
          text: "A concise, action-oriented checklist is most effective in emergency situations. It provides clear thresholds (e.g., above 85°F: escalate immediately), specific contacts, and immediate actions without requiring the technician to read through pages of documentation under pressure.",
        },
        {
          id: "dr3-r2",
          text: "A 20-page manual will not be read during an active alert. Emergency SOPs must be scannable and actionable in under 60 seconds.",
        },
        {
          id: "dr3-r3",
          text: "Relying on judgment alone already failed when a junior tech ignored a humidity alert. SOPs provide a minimum standard that every team member can follow regardless of experience level.",
        },
        {
          id: "dr3-r4",
          text: "Full automation is ideal for some responses (like alerting) but environmental incidents often require human assessment and physical actions (opening doors, moving equipment) that cannot be automated.",
        },
      ],
      correctRationaleId: "dr3-r1",
      feedback: {
        perfect:
          "Correct. Emergency SOPs should be concise checklists with clear thresholds, actions, and contacts. They must be usable under pressure by any team member regardless of experience level.",
        partial:
          "Automation helps with detection and notification, but physical response still requires human action guided by a clear procedure.",
        wrong: "The humidity incident already proved that unguided judgment leads to missed critical responses. SOPs are necessary.",
      },
    },
  ],
  hints: [
    "Good troubleshooting documentation starts with symptoms (what the user sees), proceeds through diagnostic steps, and only then prescribes fixes in order of least to most disruptive.",
    "If an issue occurs more than twice, it deserves a knowledge base article. The time spent writing the article is always less than the time wasted resolving repeat tickets without it.",
    "Emergency SOPs should be one-page checklists with clear decision thresholds, not lengthy manuals. They must be usable under pressure in under 60 seconds.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Documentation skills are what separate good technicians from team leads and managers. IT professionals who create and maintain useful knowledge bases are recognized as force multipliers who make the entire team more effective.",
  toolRelevance: [
    "Knowledge Base Systems (Confluence, SharePoint)",
    "Ticketing System (ServiceNow, Jira Service Management)",
    "Version Control for Documentation",
    "SOP Templates",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
