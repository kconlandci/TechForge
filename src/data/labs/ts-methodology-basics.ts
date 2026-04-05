import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "ts-methodology-basics",
  version: 1,
  title: "Apply the CompTIA Troubleshooting Methodology",
  tier: "beginner",
  track: "hardware-network-troubleshooting",
  difficulty: "easy",
  accessLevel: "free",
  tags: [
    "troubleshooting",
    "methodology",
    "comptia",
    "problem-solving",
    "documentation",
  ],
  description:
    "Walk through the official CompTIA troubleshooting methodology step by step, applying each phase to a real-world help desk ticket involving a user who cannot print.",
  estimatedMinutes: 15,
  learningObjectives: [
    "List the steps of the CompTIA troubleshooting methodology in order",
    "Apply each methodology step to a concrete support scenario",
    "Explain why skipping steps leads to misdiagnosis or repeated failures",
    "Document findings and actions at each troubleshooting phase",
  ],
  sortOrder: 500,
  status: "published",
  prerequisites: [],
  rendererType: "action-rationale",
  scenarios: [
    {
      id: "tm-scenario-1",
      type: "action-rationale",
      title: "Identify the Problem",
      context:
        "A user submits a ticket: 'My printer doesn't work.' You are the first technician to respond. You have no other information. According to the CompTIA troubleshooting methodology, the first step is to identify the problem. You need to decide what to do first.",
      actions: [
        {
          id: "tm1-replace-printer",
          label: "Replace the printer with a spare unit from the supply room",
          color: "red",
        },
        {
          id: "tm1-ask-questions",
          label: "Ask the user targeted questions: What exactly happens when you try to print? When did it last work? Has anything changed?",
          color: "green",
        },
        {
          id: "tm1-reinstall-drivers",
          label: "Remotely reinstall the printer drivers on the user's PC",
          color: "blue",
        },
        {
          id: "tm1-check-server",
          label: "Check the print server logs immediately",
          color: "orange",
        },
      ],
      correctActionId: "tm1-ask-questions",
      rationales: [
        {
          id: "tm1-r1",
          text: "Replacing hardware without diagnosis wastes resources and does not address the actual root cause, which may be software or network related.",
        },
        {
          id: "tm1-r2",
          text: "Asking targeted questions gathers critical information: error messages, scope of the problem, recent changes, and whether it affects one user or many. This is Step 1 of the methodology.",
        },
        {
          id: "tm1-r3",
          text: "Reinstalling drivers is a potential fix, but acting before understanding the problem often leads to wasted effort and can introduce new issues.",
        },
        {
          id: "tm1-r4",
          text: "Checking server logs is useful but premature. You don't yet know whether the problem is local, network, or server-side.",
        },
      ],
      correctRationaleId: "tm1-r2",
      feedback: {
        perfect:
          "Correct. Gathering information through targeted questions is always the first step. You cannot fix what you do not understand.",
        partial:
          "Checking logs is a reasonable diagnostic step, but it belongs later in the process. Start by identifying the problem scope from the user.",
        wrong: "Jumping to a fix before understanding the problem violates the methodology and frequently results in wasted time or new issues.",
      },
    },
    {
      id: "tm-scenario-2",
      type: "action-rationale",
      title: "Establish a Theory and Test",
      context:
        "The user reports: 'When I hit Print in Word, nothing happens. No error, no queue entry. It worked fine yesterday. Nobody else in my department has this issue.' You check and confirm the printer works from other PCs. The user's PC shows the printer status as 'Offline' in Devices and Printers, but network connectivity is fine (ping to printer succeeds). You need to establish a theory of probable cause and test it.",
      actions: [
        {
          id: "tm2-restart-spooler",
          label: "Restart the Print Spooler service on the user's PC and check if the printer comes back online",
          color: "green",
        },
        {
          id: "tm2-replace-cable",
          label: "Replace the network cable between the user's PC and the wall jack",
          color: "orange",
        },
        {
          id: "tm2-reimage-pc",
          label: "Reimage the PC to restore default printer configuration",
          color: "red",
        },
        {
          id: "tm2-call-vendor",
          label: "Call the printer vendor for support",
          color: "blue",
        },
      ],
      correctActionId: "tm2-restart-spooler",
      rationales: [
        {
          id: "tm2-r1",
          text: "The printer shows Offline on one PC while working from others, and ping succeeds. This points to a local Print Spooler issue. Restarting the spooler is a targeted, testable theory that matches the evidence.",
        },
        {
          id: "tm2-r2",
          text: "Replacing the cable is illogical because ping already confirms network connectivity is working.",
        },
        {
          id: "tm2-r3",
          text: "Reimaging a PC is a last-resort, destructive action that violates the principle of testing simple theories before escalating.",
        },
        {
          id: "tm2-r4",
          text: "Calling the vendor is premature when the evidence points to a local OS service issue, not a printer hardware fault.",
        },
      ],
      correctRationaleId: "tm2-r1",
      feedback: {
        perfect:
          "Excellent. You formed a theory based on evidence (Offline status on one PC, ping works, others can print) and chose a targeted test. This is Steps 2 and 3 of the methodology.",
        partial:
          "That approach doesn't match the evidence gathered so far. Always let the symptoms guide your theory.",
        wrong: "Destructive or escalation actions are not appropriate when simpler, evidence-based theories have not been tested yet.",
      },
    },
    {
      id: "tm-scenario-3",
      type: "action-rationale",
      title: "Verify and Document",
      context:
        "Restarting the Print Spooler resolved the Offline status. The user prints a test page successfully. According to the methodology, you now need to verify full functionality and document the resolution. The user mentions this has happened twice before in the past month.",
      actions: [
        {
          id: "tm3-close-ticket",
          label: "Close the ticket immediately since the test page printed successfully",
          color: "orange",
        },
        {
          id: "tm3-verify-document-prevent",
          label: "Have the user print from Word to verify, document the root cause and fix in the ticket, and investigate the recurring spooler crashes to establish a preventive measure",
          color: "green",
        },
        {
          id: "tm3-blame-user",
          label: "Tell the user to restart their spooler themselves next time it happens",
          color: "red",
        },
        {
          id: "tm3-replace-pc",
          label: "Schedule a PC replacement since the spooler keeps failing",
          color: "blue",
        },
      ],
      correctActionId: "tm3-verify-document-prevent",
      rationales: [
        {
          id: "tm3-r1",
          text: "Closing immediately skips verification in the user's actual workflow and ignores the recurrence pattern, leaving the root cause of repeated failures unaddressed.",
        },
        {
          id: "tm3-r2",
          text: "Verifying in the user's application confirms the fix works in practice, documenting creates a knowledge base entry for future tickets, and investigating the recurrence addresses the root cause to prevent future incidents.",
        },
        {
          id: "tm3-r3",
          text: "Pushing the workaround onto the user does not fix the underlying issue and creates a poor support experience.",
        },
        {
          id: "tm3-r4",
          text: "Replacing a PC for a recurring spooler issue is disproportionate. The recurrence likely has a specific cause like a corrupted driver or conflicting software.",
        },
      ],
      correctRationaleId: "tm3-r2",
      feedback: {
        perfect:
          "Perfect. You completed the final methodology steps: verify with the user, document everything, and establish preventive measures for recurring issues.",
        partial:
          "Closing without full verification and documentation is a common shortcut that leads to repeat tickets and knowledge loss.",
        wrong: "That approach either ignores documentation requirements or proposes a disproportionate response to a solvable problem.",
      },
    },
  ],
  hints: [
    "The CompTIA methodology always starts with identifying the problem through information gathering before taking any action.",
    "Theories should be based on evidence collected, and you should test the simplest likely cause first.",
    "Verification means confirming the fix works in the user's actual workflow, and documentation ensures the solution is available for future reference.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "The CompTIA troubleshooting methodology is not just exam material. It is the framework used in every professional IT environment. Hiring managers look for structured problem-solving skills in interviews, and technicians who follow the methodology resolve issues faster with fewer escalations.",
  toolRelevance: [
    "Help Desk Ticketing Systems",
    "Windows Services Console (services.msc)",
    "Devices and Printers",
    "Command Prompt (ping)",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
