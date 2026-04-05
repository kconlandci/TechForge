import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "os-linux-basics",
  version: 1,
  title: "Linux Command Decisions for Admin Tasks",
  tier: "intermediate",
  track: "operating-systems",
  difficulty: "moderate",
  accessLevel: "free",
  tags: ["linux", "bash", "terminal", "administration", "commands"],
  description:
    "Choose the correct Linux commands for common system administration tasks including user management, service control, package management, and file system operations.",
  estimatedMinutes: 18,
  learningObjectives: [
    "Select appropriate Linux commands for user and group management",
    "Use package management commands for software installation and updates",
    "Manage system services using systemctl and related tools",
    "Navigate the Linux file system and use essential file commands",
  ],
  sortOrder: 605,
  status: "published",
  prerequisites: [],
  rendererType: "action-rationale",
  scenarios: [
    {
      id: "lb-scenario-1",
      type: "action-rationale",
      title: "Creating a Service Account",
      context:
        "You need to create a new user account on an Ubuntu 22.04 server for a web application service. The account should not have a home directory, should not be able to log in interactively, and should use /usr/sbin/nologin as its shell. Which command creates this account correctly?",
      actions: [
        {
          id: "lb1-useradd",
          label: "sudo useradd -r -s /usr/sbin/nologin webapp-svc",
          color: "green",
        },
        {
          id: "lb1-adduser",
          label: "sudo adduser webapp-svc",
          color: "blue",
        },
        {
          id: "lb1-useradd-home",
          label: "sudo useradd -m -s /bin/bash webapp-svc",
          color: "orange",
        },
        {
          id: "lb1-usermod",
          label: "sudo usermod -s /usr/sbin/nologin webapp-svc",
          color: "red",
        },
      ],
      correctActionId: "lb1-useradd",
      rationales: [
        {
          id: "lb1-r1",
          text: "useradd -r creates a system account (UID below 1000) without a home directory by default. The -s /usr/sbin/nologin flag prevents interactive login. This is the correct way to create service accounts.",
        },
        {
          id: "lb1-r2",
          text: "adduser is an interactive wrapper that creates a regular user with a home directory and prompts for a password. It is designed for human users, not service accounts.",
        },
        {
          id: "lb1-r3",
          text: "useradd -m creates a home directory and /bin/bash allows interactive login. Both are unnecessary and insecure for a service account.",
        },
        {
          id: "lb1-r4",
          text: "usermod modifies an existing user. The account does not exist yet, so this command would fail.",
        },
      ],
      correctRationaleId: "lb1-r1",
      feedback: {
        perfect:
          "Correct. useradd -r -s /usr/sbin/nologin creates a proper system service account: no home directory, no interactive login, and a UID in the system range.",
        partial:
          "That command creates a user but with settings inappropriate for a service account. Review the -r flag and shell options.",
        wrong: "That command either creates the wrong type of account or operates on a non-existent user.",
      },
    },
    {
      id: "lb-scenario-2",
      type: "action-rationale",
      title: "Investigating Disk Usage",
      context:
        "A Linux server's root partition is at 95% capacity. You need to find which directories are consuming the most space under /var. The server has limited memory so you want an efficient command that shows directory sizes sorted by largest first.",
      actions: [
        {
          id: "lb2-du",
          label: "sudo du -sh /var/*/ | sort -rh | head -20",
          color: "green",
        },
        {
          id: "lb2-ls",
          label: "ls -la /var/",
          color: "orange",
        },
        {
          id: "lb2-df",
          label: "df -h /var",
          color: "blue",
        },
        {
          id: "lb2-find",
          label: "find /var -type f -exec ls -s {} + | sort -n",
          color: "red",
        },
      ],
      correctActionId: "lb2-du",
      rationales: [
        {
          id: "lb2-r1",
          text: "du -sh /var/*/ shows the total size of each immediate subdirectory in human-readable format. Piping through sort -rh sorts by size descending, and head -20 limits output. This efficiently identifies the largest directories.",
        },
        {
          id: "lb2-r2",
          text: "ls -la shows file names and sizes in the current directory only. It does not recursively calculate total directory sizes, so it will not reveal which subdirectories under /var are consuming the most space.",
        },
        {
          id: "lb2-r3",
          text: "df -h shows filesystem-level disk usage (total, used, available) but does not break down usage by directory. It confirms the problem but does not help identify the cause.",
        },
        {
          id: "lb2-r4",
          text: "find with -exec ls -s spawns a new process for every file, which is extremely slow and memory-intensive on a filesystem with millions of files. On a server with limited memory this could cause issues.",
        },
      ],
      correctRationaleId: "lb2-r1",
      feedback: {
        perfect:
          "Correct. du -sh with sort -rh is the standard efficient approach for identifying large directories on Linux. It gives you actionable data quickly.",
        partial:
          "That command provides related information but does not efficiently show per-directory space consumption.",
        wrong: "That approach is either too slow for a production server or does not show directory sizes.",
      },
    },
    {
      id: "lb-scenario-3",
      type: "action-rationale",
      title: "Managing a Failed Service",
      context:
        "The nginx web server on an Ubuntu server stopped serving requests. Running 'systemctl status nginx' shows it is in a 'failed' state with the message: 'nginx: [emerg] bind() to 0.0.0.0:80 failed (98: Address already in use)'. You need to fix this and get nginx running again.",
      actions: [
        {
          id: "lb3-restart",
          label: "sudo systemctl restart nginx",
          color: "orange",
        },
        {
          id: "lb3-find-port",
          label: "sudo ss -tlnp | grep :80 to find the conflicting process, then stop it and restart nginx",
          color: "green",
        },
        {
          id: "lb3-change-port",
          label: "Change nginx to listen on port 8080 instead",
          color: "blue",
        },
        {
          id: "lb3-reboot",
          label: "Reboot the server to clear the port conflict",
          color: "red",
        },
      ],
      correctActionId: "lb3-find-port",
      rationales: [
        {
          id: "lb3-r1",
          text: "Simply restarting nginx will fail with the same error because port 80 is still in use by another process. You must identify and resolve the conflict first.",
        },
        {
          id: "lb3-r2",
          text: "ss -tlnp shows which process is currently listening on port 80. Once identified, you can stop the conflicting process (e.g., an orphaned nginx worker or apache2) and then restart nginx successfully.",
        },
        {
          id: "lb3-r3",
          text: "Changing the nginx port is a workaround that breaks existing configurations, DNS records, and client expectations. The root cause is another process occupying port 80.",
        },
        {
          id: "lb3-r4",
          text: "Rebooting a production server to fix a port conflict is excessive and causes unnecessary downtime. The issue can be resolved without a reboot.",
        },
      ],
      correctRationaleId: "lb3-r2",
      feedback: {
        perfect:
          "Correct. Using ss -tlnp to identify the process holding port 80, stopping it, and then restarting nginx resolves the conflict without unnecessary downtime or configuration changes.",
        partial:
          "Restarting nginx alone will fail because the port conflict still exists. You must address the conflicting process first.",
        wrong: "That approach either causes unnecessary downtime or creates new configuration problems.",
      },
    },
  ],
  hints: [
    "The -r flag with useradd creates a system account with a UID below 1000 and no home directory by default.",
    "du -sh shows summarized human-readable directory sizes; df -h shows filesystem-level usage only.",
    "Use ss -tlnp or netstat -tlnp to identify which process is listening on a specific port.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Linux administration skills are increasingly required even in traditionally Windows-centric IT roles. Cloud infrastructure, containerization, and DevOps all rely heavily on Linux command-line proficiency.",
  toolRelevance: [
    "bash shell",
    "useradd / adduser",
    "du / df",
    "systemctl",
    "ss / netstat",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
