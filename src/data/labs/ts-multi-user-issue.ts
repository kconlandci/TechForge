import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "ts-multi-user-issue",
  version: 1,
  title: "Troubleshoot Issues Affecting Multiple Users",
  tier: "intermediate",
  track: "hardware-network-troubleshooting",
  difficulty: "moderate",
  accessLevel: "free",
  tags: [
    "multi-user",
    "scope",
    "infrastructure",
    "shared-resources",
    "troubleshooting",
  ],
  description:
    "Multiple users report the same problem simultaneously. Determine the scope, identify the shared resource causing the failure, and apply a fix that addresses the root cause rather than individual symptoms.",
  estimatedMinutes: 20,
  learningObjectives: [
    "Assess the scope of a multi-user issue to identify common factors",
    "Distinguish between infrastructure failures and coincidental individual issues",
    "Identify shared resources such as servers, switches, or Group Policy as root causes",
    "Prioritize high-impact multi-user issues over individual tickets",
    "Communicate outage status and resolution progress to affected users",
  ],
  sortOrder: 507,
  status: "published",
  prerequisites: [],
  rendererType: "action-rationale",
  scenarios: [
    {
      id: "mu-scenario-1",
      type: "action-rationale",
      title: "Scope Assessment",
      context:
        "Within 10 minutes, you receive 8 separate tickets from users in the Marketing department: 'Can't access shared drive.' 'S: drive is missing.' 'Getting access denied on marketing files.' 'Network drive disconnected.' All affected users are in the Marketing department on the 2nd floor. Users in Sales (same floor) and Engineering (3rd floor) report no issues. Your first step is to determine the scope and common factor.",
      actions: [
        {
          id: "mu1-fix-individually",
          label: "Work through each ticket individually, remapping the network drive on each PC",
          color: "red",
        },
        {
          id: "mu1-check-server",
          label: "Check the file server hosting the Marketing share and verify the Marketing Active Directory group permissions",
          color: "green",
        },
        {
          id: "mu1-reboot-switch",
          label: "Reboot the 2nd floor switch since all affected users are on the same floor",
          color: "orange",
        },
        {
          id: "mu1-send-email",
          label: "Send a mass email asking if anyone else is affected",
          color: "blue",
        },
      ],
      correctActionId: "mu1-check-server",
      rationales: [
        {
          id: "mu1-r1",
          text: "All affected users share a common department and access the same shared drive. The file server or its permissions are the most likely single point of failure. Checking the server and AD group targets the shared resource directly.",
        },
        {
          id: "mu1-r2",
          text: "Working tickets individually wastes time when the root cause is a single shared resource. Fix the shared resource and all 8 tickets are resolved simultaneously.",
        },
        {
          id: "mu1-r3",
          text: "Sales users on the same floor are unaffected, which rules out the floor switch as the cause. The common factor is department (shared drive), not location.",
        },
        {
          id: "mu1-r4",
          text: "Sending a survey email delays resolution. The scope is already clear from the 8 tickets: Marketing department, shared drive access.",
        },
      ],
      correctRationaleId: "mu1-r1",
      feedback: {
        perfect:
          "Correct. When multiple users in the same group report the same issue, look for the shared resource. The file server and AD permissions are the common factor.",
        partial:
          "The floor switch is not the common factor since Sales users on the same floor are unaffected. Focus on department-specific resources.",
        wrong: "Working individual tickets when 8 users have the same root cause is inefficient. Find and fix the shared resource.",
      },
    },
    {
      id: "mu-scenario-2",
      type: "action-rationale",
      context:
        "You check the file server and find that the Marketing shared folder permissions were modified last night at 11:42 PM. The 'Marketing-Staff' AD security group was accidentally removed from the folder ACL during a permissions cleanup performed by a junior admin. The folder still exists with all files intact, but only Domain Admins can currently access it. You need to restore access.",
      title: "Root Cause Identification and Fix",
      actions: [
        {
          id: "mu2-restore-permissions",
          label: "Re-add the Marketing-Staff security group to the folder ACL with the original permissions (Read/Write) and verify one user can access the share",
          color: "green",
        },
        {
          id: "mu2-restore-backup",
          label: "Restore the entire folder from last night's backup to undo the change",
          color: "orange",
        },
        {
          id: "mu2-create-new-share",
          label: "Create a new shared folder and copy all the files to it",
          color: "red",
        },
        {
          id: "mu2-add-users-individually",
          label: "Add each Marketing user's individual account to the folder permissions",
          color: "yellow",
        },
      ],
      correctActionId: "mu2-restore-permissions",
      rationales: [
        {
          id: "mu2-r1",
          text: "The group was accidentally removed from the ACL. Re-adding it with the original permissions is the minimal, targeted fix that restores access for all Marketing users immediately. Verify with one user before closing all tickets.",
        },
        {
          id: "mu2-r2",
          text: "Restoring from backup could overwrite files modified today. Permissions can be fixed without touching the data.",
        },
        {
          id: "mu2-r3",
          text: "Creating a new share is unnecessary work when the existing share and files are intact. Only the ACL needs correction.",
        },
        {
          id: "mu2-r4",
          text: "Adding individual users instead of the security group breaks the principle of group-based access management and creates a maintenance burden for future staff changes.",
        },
      ],
      correctRationaleId: "mu2-r1",
      feedback: {
        perfect:
          "Correct. Restoring the AD group to the ACL is the targeted fix. Always use security groups rather than individual accounts for shared resource permissions.",
        partial:
          "Backup restoration risks overwriting today's work. The simpler fix is restoring the ACL entry.",
        wrong: "That approach creates unnecessary complexity or breaks security best practices for access management.",
      },
    },
    {
      id: "mu-scenario-3",
      type: "action-rationale",
      title: "Prevention and Communication",
      context:
        "You have restored access. All 8 users confirm they can reach the Marketing shared drive. The junior admin who made the change feels terrible about the incident. You need to close out this incident properly by addressing prevention, documentation, and communication.",
      actions: [
        {
          id: "mu3-blame-admin",
          label: "Report the junior admin to management for the error",
          color: "red",
        },
        {
          id: "mu3-document-and-prevent",
          label: "Document the incident with timeline and root cause, implement a change approval process for permission modifications, and set up folder permission auditing",
          color: "green",
        },
        {
          id: "mu3-lock-permissions",
          label: "Remove all admin access to shared folders so this cannot happen again",
          color: "orange",
        },
        {
          id: "mu3-just-close",
          label: "Close all 8 tickets as resolved and move on",
          color: "blue",
        },
      ],
      correctActionId: "mu3-document-and-prevent",
      rationales: [
        {
          id: "mu3-r1",
          text: "Blaming individuals creates a culture where people hide mistakes instead of reporting them. The process failed, not the person.",
        },
        {
          id: "mu3-r2",
          text: "Documenting the incident creates a knowledge base entry, a change approval process prevents unauthorized or accidental changes, and auditing provides an alert system for future permission modifications. These are systemic improvements.",
        },
        {
          id: "mu3-r3",
          text: "Removing admin access entirely prevents necessary maintenance. The solution is controlled access with approval workflows, not elimination of access.",
        },
        {
          id: "mu3-r4",
          text: "Closing without documentation or prevention means the same type of incident will recur with no reference for faster resolution.",
        },
      ],
      correctRationaleId: "mu3-r2",
      feedback: {
        perfect:
          "Excellent. Proper incident management includes documentation, root cause analysis, and preventive measures. Change approval processes and auditing are the professional approach.",
        partial:
          "Closing tickets is necessary, but without documentation and prevention, you are setting up for repeat incidents.",
        wrong: "Blame culture and over-restrictive access controls both cause more problems than they solve.",
      },
    },
  ],
  hints: [
    "When multiple users report the same symptom, look for a shared resource or common infrastructure component as the root cause.",
    "The common factor among affected users reveals the scope: same department means shared drive or permissions, same floor means network infrastructure, same application means a server or update.",
    "After fixing a multi-user incident, always document the root cause and implement preventive measures to avoid recurrence.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "The ability to quickly scope a multi-user issue and identify the shared root cause is what separates tier-1 from tier-2 technicians. It is one of the most commonly tested competencies in IT support interviews.",
  toolRelevance: [
    "Active Directory Users and Computers",
    "File Server Manager",
    "Event Viewer (Security Log)",
    "Help Desk Ticketing System",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
