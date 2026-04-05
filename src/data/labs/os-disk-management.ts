import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "os-disk-management",
  version: 1,
  title: "Partition and Format Decisions",
  tier: "intermediate",
  track: "operating-systems",
  difficulty: "moderate",
  accessLevel: "free",
  tags: ["disk-management", "partitions", "formatting", "storage", "diskpart"],
  description:
    "Make correct partition and format decisions for different storage scenarios using Disk Management and diskpart, choosing the right file system, partition style, and volume configuration.",
  estimatedMinutes: 18,
  learningObjectives: [
    "Choose between GPT and MBR partition styles for different scenarios",
    "Select the correct file system (NTFS, FAT32, exFAT) based on requirements",
    "Use diskpart commands for disk initialization and partition creation",
    "Understand dynamic vs. basic disks and volume types (simple, spanned, striped)",
  ],
  sortOrder: 608,
  status: "published",
  prerequisites: [],
  rendererType: "action-rationale",
  scenarios: [
    {
      id: "dm-scenario-1",
      type: "action-rationale",
      title: "Initialize a New 4 TB Drive",
      context:
        "A new 4 TB hard drive has been installed in a Windows 11 workstation. Disk Management shows it as 'Not Initialized'. The drive will store large video files (some exceeding 4 GB each) and needs to be accessible only from this Windows machine. How should you initialize and format it?",
      actions: [
        {
          id: "dm1-mbr-fat32",
          label: "Initialize as MBR, create a primary partition, format as FAT32",
          color: "red",
        },
        {
          id: "dm1-gpt-ntfs",
          label: "Initialize as GPT, create a simple volume, format as NTFS with default allocation unit size",
          color: "green",
        },
        {
          id: "dm1-mbr-ntfs",
          label: "Initialize as MBR, create a primary partition, format as NTFS",
          color: "orange",
        },
        {
          id: "dm1-gpt-exfat",
          label: "Initialize as GPT, create a simple volume, format as exFAT",
          color: "blue",
        },
      ],
      correctActionId: "dm1-gpt-ntfs",
      rationales: [
        {
          id: "dm1-r1",
          text: "FAT32 has a 4 GB maximum file size limit, making it impossible to store the large video files. It also has a 2 TB volume size limit, wasting half the drive.",
        },
        {
          id: "dm1-r2",
          text: "GPT supports drives larger than 2 TB (MBR is limited to 2 TB). NTFS is the correct file system for a Windows-only data drive as it supports large files, permissions, encryption, and journaling.",
        },
        {
          id: "dm1-r3",
          text: "MBR has a 2 TB partition size limit. On a 4 TB drive, MBR would only allow access to the first 2 TB, wasting half the storage capacity.",
        },
        {
          id: "dm1-r4",
          text: "exFAT supports large files and large volumes but lacks NTFS features like security permissions, journaling, and encryption. Since the drive is Windows-only, NTFS is the better choice.",
        },
      ],
      correctRationaleId: "dm1-r2",
      feedback: {
        perfect:
          "Correct. GPT is required for drives over 2 TB, and NTFS provides the full feature set needed for a Windows-only data drive with large files.",
        partial:
          "MBR cannot address more than 2 TB, so half the drive would be inaccessible. GPT is required for 4 TB drives.",
        wrong: "That combination either wastes drive capacity or cannot handle the file sizes required.",
      },
    },
    {
      id: "dm-scenario-2",
      type: "action-rationale",
      title: "Create a Bootable USB Drive",
      context:
        "You need to create a bootable USB flash drive (32 GB) for Windows 11 installation media. The USB must work on both UEFI and older Legacy BIOS systems. The Windows ISO is 5.2 GB. What format should you use?",
      actions: [
        {
          id: "dm2-fat32",
          label: "Format as FAT32 and use a tool that splits the install.wim file to fit",
          color: "green",
        },
        {
          id: "dm2-ntfs",
          label: "Format as NTFS for full file support",
          color: "blue",
        },
        {
          id: "dm2-exfat",
          label: "Format as exFAT for large file support",
          color: "orange",
        },
        {
          id: "dm2-ext4",
          label: "Format as ext4 for maximum compatibility",
          color: "red",
        },
      ],
      correctActionId: "dm2-fat32",
      rationales: [
        {
          id: "dm2-r1",
          text: "FAT32 is the only file system recognized by both UEFI and Legacy BIOS firmware for booting. The install.wim file exceeds 4 GB, so it must be split using DISM or a tool like Rufus. This is the standard approach for universal bootable media.",
        },
        {
          id: "dm2-r2",
          text: "NTFS is not natively supported by UEFI firmware for booting. While some UEFI implementations support it, Legacy BIOS systems cannot boot from NTFS, breaking the compatibility requirement.",
        },
        {
          id: "dm2-r3",
          text: "exFAT is not supported for booting by most UEFI or Legacy BIOS firmware. It is designed for removable media data exchange, not bootable media.",
        },
        {
          id: "dm2-r4",
          text: "ext4 is a Linux file system that is not recognized by Windows or most UEFI/BIOS firmware. It cannot be used for Windows installation media.",
        },
      ],
      correctRationaleId: "dm2-r1",
      feedback: {
        perfect:
          "Correct. FAT32 with file splitting ensures boot compatibility across both UEFI and Legacy BIOS systems. Tools like Rufus handle this automatically.",
        partial:
          "NTFS works for UEFI-only systems but fails on Legacy BIOS, which violates the compatibility requirement.",
        wrong: "That file system is not supported for boot media on the required platforms.",
      },
    },
    {
      id: "dm-scenario-3",
      type: "action-rationale",
      title: "Recover a RAW Partition",
      context:
        "A user's 500 GB data drive suddenly shows as RAW in Disk Management instead of NTFS. The drive contains important files. Windows prompts 'You need to format the disk before you can use it.' What should you do?",
      actions: [
        {
          id: "dm3-format",
          label: "Format the drive as NTFS as Windows suggests",
          color: "red",
        },
        {
          id: "dm3-chkdsk",
          label: "Run chkdsk D: /f from an elevated command prompt to attempt repair of the file system",
          color: "green",
        },
        {
          id: "dm3-delete-partition",
          label: "Delete the partition and create a new one",
          color: "red",
        },
        {
          id: "dm3-diskpart-clean",
          label: "Run diskpart > clean on the drive to fix corruption",
          color: "orange",
        },
      ],
      correctActionId: "dm3-chkdsk",
      rationales: [
        {
          id: "dm3-r1",
          text: "Formatting the drive destroys all existing data. Never format a drive showing as RAW when it contains important files. The file system metadata may be repairable.",
        },
        {
          id: "dm3-r2",
          text: "chkdsk /f can often repair corrupted NTFS metadata that causes a drive to appear as RAW. If the underlying data is intact, chkdsk rebuilds the file system structure and restores access to files.",
        },
        {
          id: "dm3-r3",
          text: "Deleting the partition destroys the partition table entry and makes data recovery significantly harder. This is a destructive action on a drive with important files.",
        },
        {
          id: "dm3-r4",
          text: "The diskpart clean command erases the entire disk signature and partition information. This would destroy all data and partition structure beyond easy recovery.",
        },
      ],
      correctRationaleId: "dm3-r2",
      feedback: {
        perfect:
          "Correct. chkdsk /f is the appropriate first step for a RAW partition that was previously NTFS. It can rebuild corrupted file system metadata and recover access to files.",
        partial:
          "Before considering data recovery software, always try chkdsk first as it is the least invasive repair option.",
        wrong: "That action destroys data on a drive the user needs. Never format or clean a drive with important files.",
      },
    },
  ],
  hints: [
    "MBR partition style is limited to 2 TB maximum partition size. GPT is required for larger drives.",
    "FAT32 is the only file system universally recognized for boot media across UEFI and Legacy BIOS.",
    "When a drive shows as RAW, try chkdsk /f before formatting. Formatting destroys existing data.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Disk management mistakes can cause permanent data loss. Employers expect IT professionals to understand partition styles, file system limitations, and when to use destructive vs. non-destructive operations.",
  toolRelevance: [
    "Disk Management (diskmgmt.msc)",
    "diskpart command-line tool",
    "chkdsk",
    "format command",
    "Rufus / Media Creation Tool",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
