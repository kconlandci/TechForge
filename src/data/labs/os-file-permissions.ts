import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "os-file-permissions",
  version: 1,
  title: "Set NTFS File Permissions Correctly",
  tier: "beginner",
  track: "operating-systems",
  difficulty: "easy",
  accessLevel: "free",
  tags: ["ntfs", "permissions", "file-system", "windows", "security"],
  description:
    "Configure NTFS file and folder permissions to meet security requirements while maintaining appropriate access levels for users and groups.",
  estimatedMinutes: 15,
  learningObjectives: [
    "Differentiate between NTFS permission levels (Full Control, Modify, Read & Execute, Read, Write)",
    "Apply the principle of least privilege when assigning file permissions",
    "Understand permission inheritance and how to override it",
    "Configure share vs. NTFS permissions correctly",
  ],
  sortOrder: 601,
  status: "published",
  prerequisites: [],
  rendererType: "toggle-config",
  scenarios: [
    {
      id: "fp-scenario-1",
      type: "toggle-config",
      title: "Shared Department Folder",
      description:
        "The Accounting department needs a shared folder on the file server. Accountants should read and modify spreadsheets but not delete them. The Accounting Manager needs full control. Configure the NTFS permissions for D:\\Shared\\Accounting.",
      targetSystem: "Windows Server 2022 - NTFS Permissions",
      items: [
        {
          id: "fp1-accountants",
          label: "Accounting Group Permission",
          detail: "NTFS permission level for the Accounting security group",
          currentState: "Full Control",
          correctState: "Read & Execute + Write",
          states: [
            "Full Control",
            "Modify",
            "Read & Execute + Write",
            "Read & Execute",
            "Read",
          ],
          rationaleId: "fp1-r1",
        },
        {
          id: "fp1-manager",
          label: "Accounting Manager Permission",
          detail: "NTFS permission level for the Accounting Manager user",
          currentState: "Modify",
          correctState: "Full Control",
          states: ["Full Control", "Modify", "Read & Execute + Write", "Read"],
          rationaleId: "fp1-r2",
        },
        {
          id: "fp1-inheritance",
          label: "Permission Inheritance",
          detail: "Inherit permissions from parent folder D:\\Shared",
          currentState: "Enabled",
          correctState: "Disabled",
          states: ["Enabled", "Disabled"],
          rationaleId: "fp1-r3",
        },
      ],
      rationales: [
        {
          id: "fp1-r1",
          text: "Read & Execute + Write allows accountants to open, read, and create/modify files without the ability to delete. Modify permission includes delete, which violates the requirement. Full Control adds permission changes.",
        },
        {
          id: "fp1-r2",
          text: "Full Control gives the Accounting Manager the ability to manage files, modify permissions, and take ownership, which is appropriate for a department folder administrator.",
        },
        {
          id: "fp1-r3",
          text: "Disabling inheritance prevents permissions from the parent D:\\Shared folder from applying, ensuring only the explicitly assigned permissions control access to the Accounting folder.",
        },
      ],
      feedback: {
        perfect:
          "Correct. Accountants get Read & Execute + Write (no delete), the manager gets Full Control, and inheritance is disabled for clean permission management.",
        partial:
          "Review the difference between Modify (includes delete) and Read & Execute + Write (no delete).",
        wrong: "The current permissions either grant too much access or don't meet the department's needs.",
      },
    },
    {
      id: "fp-scenario-2",
      type: "toggle-config",
      title: "Sensitive HR Documents",
      description:
        "HR has a folder with employee records at D:\\HR\\Records. Only HR staff should access it. IT admins currently have inherited Full Control from the drive root. The Everyone group also has Read access inherited. Fix the permissions.",
      targetSystem: "Windows Server 2022 - NTFS Permissions",
      items: [
        {
          id: "fp2-everyone",
          label: "Everyone Group",
          detail: "Permission for the Everyone group on D:\\HR\\Records",
          currentState: "Read (Inherited)",
          correctState: "Remove",
          states: ["Read (Inherited)", "Remove", "Deny Read"],
          rationaleId: "fp2-r1",
        },
        {
          id: "fp2-hr-group",
          label: "HR Security Group",
          detail: "Permission for the HR security group",
          currentState: "Not assigned",
          correctState: "Modify",
          states: ["Not assigned", "Full Control", "Modify", "Read & Execute", "Read"],
          rationaleId: "fp2-r2",
        },
        {
          id: "fp2-inheritance",
          label: "Permission Inheritance",
          detail: "Break inheritance from parent and convert to explicit permissions",
          currentState: "Inherit from parent",
          correctState: "Break inheritance, copy existing, then remove unwanted",
          states: [
            "Inherit from parent",
            "Break inheritance, copy existing, then remove unwanted",
            "Break inheritance, remove all inherited permissions",
          ],
          rationaleId: "fp2-r3",
        },
      ],
      rationales: [
        {
          id: "fp2-r1",
          text: "The Everyone group should be removed entirely from sensitive HR records. Using Deny is not recommended as it can create complex permission conflicts. Breaking inheritance and removing the entry is the clean approach.",
        },
        {
          id: "fp2-r2",
          text: "Modify permission lets HR staff create, edit, and delete employee records as part of their job duties. Full Control is unnecessary as HR staff do not need to change permissions.",
        },
        {
          id: "fp2-r3",
          text: "Breaking inheritance and copying existing permissions first lets you selectively remove unwanted entries (Everyone, excessive IT access) while keeping SYSTEM and other necessary accounts intact.",
        },
      ],
      feedback: {
        perfect:
          "Excellent. Breaking inheritance, removing Everyone, and assigning HR the Modify permission properly secures employee records.",
        partial:
          "Check whether the Everyone group still has access and whether HR has the right permission level for their duties.",
        wrong: "Sensitive employee records must not be accessible to the Everyone group.",
      },
    },
    {
      id: "fp-scenario-3",
      type: "toggle-config",
      title: "Web Application Upload Folder",
      description:
        "A web application running under the IIS_IUSRS service account needs to write uploaded files to D:\\WebApp\\Uploads. Users should be able to read files via the website but the service account must not be able to execute scripts in this folder.",
      targetSystem: "Windows Server 2022 - NTFS Permissions",
      items: [
        {
          id: "fp3-iis",
          label: "IIS_IUSRS Permission",
          detail: "Permission for the IIS web service account",
          currentState: "Full Control",
          correctState: "Read + Write",
          states: ["Full Control", "Modify", "Read + Write", "Write"],
          rationaleId: "fp3-r1",
        },
        {
          id: "fp3-execute",
          label: "Execute Permission for Uploads Folder",
          detail: "Allow script/executable execution in the uploads directory",
          currentState: "Allowed",
          correctState: "Denied",
          states: ["Allowed", "Denied"],
          rationaleId: "fp3-r2",
        },
        {
          id: "fp3-authenticated",
          label: "Authenticated Users Permission",
          detail: "Permission for authenticated website visitors to view uploads",
          currentState: "Modify",
          correctState: "Read & Execute",
          states: ["Full Control", "Modify", "Read & Execute", "Read"],
          rationaleId: "fp3-r3",
        },
      ],
      rationales: [
        {
          id: "fp3-r1",
          text: "Read + Write allows IIS to accept file uploads and serve them back. Full Control and Modify grant unnecessary permissions that increase the attack surface if the web application is compromised.",
        },
        {
          id: "fp3-r2",
          text: "Denying execute permission on the uploads folder prevents uploaded malicious scripts from being run, which is a critical web security hardening measure.",
        },
        {
          id: "fp3-r3",
          text: "Read & Execute for Authenticated Users allows website visitors to view and download uploaded files through the web application without being able to modify or delete them.",
        },
      ],
      feedback: {
        perfect:
          "Perfect. Limiting IIS to Read + Write, denying execute, and giving users Read & Execute properly secures the upload folder against common web attacks.",
        partial:
          "Review whether the IIS service account has more permissions than needed or whether execute is properly restricted.",
        wrong: "Allowing excessive permissions on a web upload folder creates serious security vulnerabilities.",
      },
    },
  ],
  hints: [
    "Modify permission includes the ability to delete files. Use Read & Execute + Write when delete must be prevented.",
    "Break inheritance before removing inherited permissions to avoid affecting parent folder settings.",
    "Deny execute permission on upload directories to prevent execution of malicious uploaded files.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "NTFS permission misconfiguration is one of the leading causes of data breaches in Windows environments. Help desk and sysadmin roles require precise understanding of permission inheritance, least privilege, and the difference between share and NTFS permissions.",
  toolRelevance: [
    "Windows File Explorer Security Tab",
    "icacls command-line tool",
    "Advanced Security Settings dialog",
    "Active Directory Users and Computers",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
