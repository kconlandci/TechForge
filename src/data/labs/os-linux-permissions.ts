import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "os-linux-permissions",
  version: 1,
  title: "Troubleshoot Linux File Permission Issues",
  tier: "advanced",
  track: "operating-systems",
  difficulty: "challenging",
  accessLevel: "premium",
  tags: ["linux", "permissions", "chmod", "chown", "security", "troubleshooting"],
  description:
    "Diagnose and remediate Linux file permission issues using chmod, chown, and ACLs to resolve access denied errors, broken web servers, and misconfigured service accounts.",
  estimatedMinutes: 25,
  learningObjectives: [
    "Interpret Linux permission notation (rwx, octal, and symbolic)",
    "Use chmod and chown to correct permission and ownership issues",
    "Understand the security implications of overly permissive settings (777, SUID, world-writable)",
    "Apply POSIX ACLs with setfacl and getfacl for granular access control",
    "Diagnose permission-related service failures using log analysis",
  ],
  sortOrder: 613,
  status: "published",
  prerequisites: [],
  rendererType: "triage-remediate",
  scenarios: [
    {
      id: "lp-scenario-1",
      type: "triage-remediate",
      title: "Web Server 403 Forbidden Errors",
      description:
        "An Apache web server on Ubuntu returns '403 Forbidden' for all pages after a junior admin ran a recursive permission change. The website files are in /var/www/html/.",
      evidence: [
        { type: "log", content: "Apache error log: '[error] [client 192.168.1.50] AH00035: access to /index.html denied (filesystem path '/var/www/html/index.html') because search permissions are missing on a component of the path'" },
        { type: "diagnostic", content: "ls -la /var/www/: drwx------ 3 root root 4096 html/" },
        { type: "diagnostic", content: "ls -la /var/www/html/: -rw------- 1 root root 5120 index.html" },
        { type: "diagnostic", content: "Apache runs as user www-data, group www-data" },
        { type: "diagnostic", content: "The junior admin ran: chmod -R 600 /var/www/" },
      ],
      classifications: [
        {
          id: "lp1-c1",
          label: "Apache configuration error",
          description: "The Apache web server configuration files contain incorrect directives.",
        },
        {
          id: "lp1-c2",
          label: "Incorrect file permissions preventing Apache from reading web content",
          description: "File and directory permissions were changed to 600, removing read/execute access for the web server user.",
        },
        {
          id: "lp1-c3",
          label: "SELinux blocking Apache access",
          description: "SELinux mandatory access controls are preventing Apache from accessing the web root.",
        },
      ],
      correctClassificationId: "lp1-c2",
      remediations: [
        {
          id: "lp1-rem1",
          label: "Run: chmod -R 777 /var/www/html/ to allow all access",
          description: "Set full read/write/execute permissions for all users on the entire web root.",
        },
        {
          id: "lp1-rem2",
          label: "Run: chmod 755 /var/www /var/www/html && chmod 644 /var/www/html/* to set correct directory and file permissions",
          description: "Set standard web server permissions: directories get 755 for traversal, files get 644 for read access.",
        },
        {
          id: "lp1-rem3",
          label: "Change Apache to run as root to bypass permission issues",
          description: "Modify the Apache configuration to run the httpd process as the root user.",
        },
      ],
      correctRemediationId: "lp1-rem2",
      rationales: [
        {
          id: "lp1-r1",
          text: "The junior admin set 600 (rw-------) on everything, which removes execute permission from directories (needed for traversal) and read permission for the www-data user. Apache cannot traverse the directory tree or read files.",
        },
        {
          id: "lp1-r2",
          text: "Directories need 755 (rwxr-xr-x) for Apache to traverse them, and files need 644 (rw-r--r--) for Apache to read them. This follows the principle of least privilege: owner gets full access, others get read-only access.",
        },
      ],
      correctRationaleId: "lp1-r2",
      feedback: {
        perfect:
          "Correct. Directories need execute (x) for traversal and files need read (r) for the web server. 755 for directories and 644 for files is the standard web server permission model.",
        partial:
          "Setting 777 fixes the immediate problem but creates a severe security vulnerability. Anyone on the system could modify or delete web content.",
        wrong: "Running Apache as root is extremely dangerous and violates every web security best practice.",
      },
    },
    {
      id: "lp-scenario-2",
      type: "triage-remediate",
      title: "SSH Key Authentication Failing",
      description:
        "A user cannot SSH into a server using key-based authentication. Password authentication works, but key authentication is rejected with 'Permission denied (publickey).' The authorized_keys file exists and contains the correct public key.",
      evidence: [
        { type: "log", content: "ssh -v user@server output shows: 'Offering public key: /home/user/.ssh/id_rsa' followed by 'Server refused our key'" },
        { type: "log", content: "Server-side /var/log/auth.log: 'Authentication refused: bad ownership or modes for directory /home/user'" },
        { type: "diagnostic", content: "ls -la /home/user/: drwxrwxrwx 8 user user 4096 (home directory is 777)" },
        { type: "diagnostic", content: "ls -la /home/user/.ssh/: drwxrwxrwx 2 user user 4096 (.ssh directory is 777)" },
        { type: "diagnostic", content: "ls -la /home/user/.ssh/authorized_keys: -rw-rw-rw- 1 user user 742 (authorized_keys is 666)" },
      ],
      classifications: [
        {
          id: "lp2-c1",
          label: "SSH key mismatch between client and server",
          description: "The private key on the client does not match the public key stored on the server.",
        },
        {
          id: "lp2-c2",
          label: "Overly permissive file and directory permissions causing SSH to reject key authentication",
          description: "The home directory, .ssh directory, and authorized_keys file have world-writable permissions that SSH StrictModes rejects.",
        },
        {
          id: "lp2-c3",
          label: "SSH server misconfiguration disabling key authentication",
          description: "The sshd_config file has PubkeyAuthentication set to no or key authentication is otherwise disabled.",
        },
      ],
      correctClassificationId: "lp2-c2",
      remediations: [
        {
          id: "lp2-rem1",
          label: "Regenerate the SSH key pair and re-copy the public key",
          description: "Create a new key pair with ssh-keygen and copy the public key to the server with ssh-copy-id.",
        },
        {
          id: "lp2-rem2",
          label: "Run: chmod 700 /home/user && chmod 700 /home/user/.ssh && chmod 600 /home/user/.ssh/authorized_keys",
          description: "Set restrictive permissions on the home directory, .ssh directory, and authorized_keys file to satisfy SSH StrictModes.",
        },
        {
          id: "lp2-rem3",
          label: "Edit /etc/ssh/sshd_config to set StrictModes no",
          description: "Disable SSH strict permission checking to allow key authentication regardless of file permissions.",
        },
      ],
      correctRemediationId: "lp2-rem2",
      rationales: [
        {
          id: "lp2-r1",
          text: "SSH's StrictModes (enabled by default) refuses key authentication when the home directory, .ssh directory, or authorized_keys file are writable by other users. This is a security measure to prevent key injection attacks.",
        },
        {
          id: "lp2-r2",
          text: "Setting the home directory and .ssh to 700 (owner-only access) and authorized_keys to 600 (owner read/write only) satisfies SSH StrictModes requirements. These are the exact permissions SSH requires for key authentication.",
        },
      ],
      correctRationaleId: "lp2-r2",
      feedback: {
        perfect:
          "Correct. SSH StrictModes requires home directory 700, .ssh 700, and authorized_keys 600. World-writable permissions (777/666) are rejected as a security measure.",
        partial:
          "Setting StrictModes to no would work but disables an important security check. The proper fix is correcting the permissions.",
        wrong: "The SSH keys are correct. The issue is file permissions that SSH considers insecure.",
      },
    },
    {
      id: "lp-scenario-3",
      type: "triage-remediate",
      title: "SUID Binary Security Vulnerability",
      description:
        "A security scan flagged a custom script with the SUID bit set on a production server. The script is owned by root and any user can execute it with root privileges. The security team needs this remediated immediately.",
      evidence: [
        { type: "diagnostic", content: "Security scan finding: SUID bit set on /opt/tools/backup.sh (custom shell script)" },
        { type: "diagnostic", content: "ls -la /opt/tools/backup.sh: -rwsr-xr-x 1 root root 2048 backup.sh" },
        { type: "diagnostic", content: "The script performs backup operations that require reading files from /etc/ and /var/log/" },
        { type: "diagnostic", content: "Any user on the system can execute this script with full root privileges due to SUID" },
        { type: "diagnostic", content: "SUID on shell scripts is particularly dangerous because the script interpreter (bash) can be manipulated to execute arbitrary commands as root" },
      ],
      classifications: [
        {
          id: "lp3-c1",
          label: "Normal configuration for backup operations",
          description: "The SUID bit is intentionally set to allow the backup script to run with elevated privileges as designed.",
        },
        {
          id: "lp3-c2",
          label: "Critical privilege escalation vulnerability via SUID shell script",
          description: "A shell script with SUID root can be exploited to gain full root access through environment variable manipulation.",
        },
        {
          id: "lp3-c3",
          label: "Minor finding that can be addressed in the next maintenance window",
          description: "A low-priority security finding that does not require immediate action.",
        },
      ],
      correctClassificationId: "lp3-c2",
      remediations: [
        {
          id: "lp3-rem1",
          label: "Remove SUID bit with chmod u-s /opt/tools/backup.sh, then configure sudo with a specific rule allowing only authorized users to run the script",
          description: "Eliminate the SUID vulnerability and replace with controlled sudo access that provides audit logging.",
        },
        {
          id: "lp3-rem2",
          label: "Change the script permissions to 700 to restrict who can run it",
          description: "Remove group and other access while keeping the SUID bit, limiting execution to root only.",
        },
        {
          id: "lp3-rem3",
          label: "Add input validation to the script to prevent exploitation",
          description: "Add checks for environment variables and input sanitization within the script itself.",
        },
      ],
      correctRemediationId: "lp3-rem1",
      rationales: [
        {
          id: "lp3-r1",
          text: "SUID on a shell script is a critical vulnerability. An attacker can manipulate environment variables (IFS, PATH) or use shell features to execute arbitrary commands as root. SUID should never be set on scripts.",
        },
        {
          id: "lp3-r2",
          text: "Removing the SUID bit eliminates the privilege escalation vector. Replacing it with a targeted sudo rule provides the same elevated access but only for authorized users, with full audit logging, and without the shell interpreter manipulation risks.",
        },
      ],
      correctRationaleId: "lp3-r2",
      feedback: {
        perfect:
          "Correct. SUID on shell scripts is a well-known critical vulnerability. Removing SUID and using sudo with specific rules provides controlled, audited access without the escalation risk.",
        partial:
          "Restricting to 700 still leaves SUID active for the owner. The SUID bit itself must be removed to eliminate the vulnerability.",
        wrong: "Input validation cannot prevent all SUID shell script attacks. Environment variable manipulation bypasses script-level checks.",
      },
    },
  ],
  hints: [
    "Web server directories need 755 (rwxr-xr-x) and files need 644 (rw-r--r--) for Apache/Nginx to serve content.",
    "SSH StrictModes requires: home directory 700, .ssh directory 700, authorized_keys 600.",
    "SUID on shell scripts is always a critical vulnerability. Use sudo rules instead for controlled privilege elevation.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Linux permission issues account for a significant portion of production outages and security vulnerabilities. Security engineers and DevOps professionals regularly audit permission configurations as part of compliance requirements.",
  toolRelevance: [
    "chmod (change mode)",
    "chown (change owner)",
    "ls -la (list permissions)",
    "setfacl / getfacl (POSIX ACLs)",
    "sudo / sudoers configuration",
    "find -perm (permission audit)",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
