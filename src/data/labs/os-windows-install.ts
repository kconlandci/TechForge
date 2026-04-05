import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "os-windows-install",
  version: 1,
  title: "Windows Installation Configuration Choices",
  tier: "beginner",
  track: "operating-systems",
  difficulty: "easy",
  accessLevel: "free",
  tags: ["windows", "installation", "setup", "configuration", "os-deployment"],
  description:
    "Configure Windows installation options correctly for different deployment scenarios including partition layout, edition selection, and initial setup choices.",
  estimatedMinutes: 15,
  learningObjectives: [
    "Select the correct Windows edition for a given deployment scenario",
    "Configure partition layout during Windows installation",
    "Choose appropriate installation type (upgrade vs. clean install)",
    "Set correct regional and language options during OOBE",
  ],
  sortOrder: 600,
  status: "published",
  prerequisites: [],
  rendererType: "toggle-config",
  scenarios: [
    {
      id: "wi-scenario-1",
      type: "toggle-config",
      title: "New Workstation Deployment",
      description:
        "A company is deploying a new workstation for an office employee who needs BitLocker encryption and domain join capability. The machine has a 512 GB NVMe SSD. Configure the Windows installation settings correctly.",
      targetSystem: "Windows 11 Setup",
      items: [
        {
          id: "wi1-edition",
          label: "Windows Edition",
          detail: "Select the Windows edition to install",
          currentState: "Windows 11 Home",
          correctState: "Windows 11 Pro",
          states: [
            "Windows 11 Home",
            "Windows 11 Pro",
            "Windows 11 Enterprise",
            "Windows 11 Education",
          ],
          rationaleId: "wi1-r1",
        },
        {
          id: "wi1-install-type",
          label: "Installation Type",
          detail: "Choose upgrade or custom (clean) installation",
          currentState: "Upgrade: Keep files, settings, and applications",
          correctState: "Custom: Install Windows only (advanced)",
          states: [
            "Upgrade: Keep files, settings, and applications",
            "Custom: Install Windows only (advanced)",
          ],
          rationaleId: "wi1-r2",
        },
        {
          id: "wi1-partition",
          label: "Partition Scheme",
          detail: "Configure drive partition layout",
          currentState: "Use existing partitions",
          correctState: "Delete all partitions and let Windows create new ones",
          states: [
            "Use existing partitions",
            "Delete all partitions and let Windows create new ones",
            "Create a single partition using all space",
          ],
          rationaleId: "wi1-r3",
        },
      ],
      rationales: [
        {
          id: "wi1-r1",
          text: "Windows 11 Pro includes BitLocker drive encryption and domain join capability. Home edition lacks both features. Enterprise requires volume licensing not available for single workstations.",
        },
        {
          id: "wi1-r2",
          text: "A new workstation with no existing OS requires a custom (clean) install. Upgrade is only available when a compatible previous version of Windows is already running.",
        },
        {
          id: "wi1-r3",
          text: "Deleting all partitions on a new machine and letting Windows create them ensures the correct EFI System Partition, MSR, and recovery partition layout for UEFI booting.",
        },
      ],
      feedback: {
        perfect:
          "Excellent. Pro edition provides BitLocker and domain join, clean install is correct for new hardware, and letting Windows create partitions ensures proper UEFI layout.",
        partial:
          "Some settings are correct but review the edition requirements for BitLocker and domain join capability.",
        wrong: "Review which Windows editions support enterprise features like BitLocker and domain join.",
      },
    },
    {
      id: "wi-scenario-2",
      type: "toggle-config",
      title: "Home User Upgrade",
      description:
        "A home user with Windows 10 Home wants to upgrade to Windows 11. They have personal files, installed applications, and a 256 GB SSD with 180 GB used. Configure the installation settings to preserve their data.",
      targetSystem: "Windows 11 Setup",
      items: [
        {
          id: "wi2-edition",
          label: "Windows Edition",
          detail: "Select the Windows edition to install",
          currentState: "Windows 11 Pro",
          correctState: "Windows 11 Home",
          states: [
            "Windows 11 Home",
            "Windows 11 Pro",
            "Windows 11 Enterprise",
          ],
          rationaleId: "wi2-r1",
        },
        {
          id: "wi2-install-type",
          label: "Installation Type",
          detail: "Choose upgrade or custom installation",
          currentState: "Custom: Install Windows only (advanced)",
          correctState: "Upgrade: Keep files, settings, and applications",
          states: [
            "Upgrade: Keep files, settings, and applications",
            "Custom: Install Windows only (advanced)",
          ],
          rationaleId: "wi2-r2",
        },
        {
          id: "wi2-tpm",
          label: "TPM Requirement",
          detail: "System shows TPM 2.0 detected",
          currentState: "Disable TPM check",
          correctState: "Keep TPM enabled",
          states: ["Keep TPM enabled", "Disable TPM check"],
          rationaleId: "wi2-r3",
        },
      ],
      rationales: [
        {
          id: "wi2-r1",
          text: "The user has a Windows 10 Home license. Upgrading to Windows 11 Home preserves their license entitlement. Pro would require purchasing an additional license.",
        },
        {
          id: "wi2-r2",
          text: "The upgrade option preserves existing files, applications, and settings. Custom install would wipe the drive and the user would lose their 180 GB of data.",
        },
        {
          id: "wi2-r3",
          text: "TPM 2.0 is a hardware requirement for Windows 11 and enables security features like Secure Boot and BitLocker. Since the system has TPM 2.0, keep it enabled.",
        },
      ],
      feedback: {
        perfect:
          "Correct. Matching the Home edition to the existing license, using upgrade to preserve data, and keeping TPM enabled are all the right choices.",
        partial:
          "Check whether the installation type preserves the user's existing files and applications.",
        wrong: "An incorrect installation type could result in data loss for this home user.",
      },
    },
    {
      id: "wi-scenario-3",
      type: "toggle-config",
      title: "Dual-Boot Developer Workstation",
      description:
        "A developer needs Windows 11 installed alongside an existing Linux partition on a 1 TB drive. The Linux installation occupies the last 400 GB. There is 600 GB of unallocated space at the beginning of the drive.",
      targetSystem: "Windows 11 Setup",
      items: [
        {
          id: "wi3-install-type",
          label: "Installation Type",
          detail: "Choose installation method",
          currentState: "Upgrade: Keep files, settings, and applications",
          correctState: "Custom: Install Windows only (advanced)",
          states: [
            "Upgrade: Keep files, settings, and applications",
            "Custom: Install Windows only (advanced)",
          ],
          rationaleId: "wi3-r1",
        },
        {
          id: "wi3-partition",
          label: "Target Partition",
          detail: "Select where to install Windows",
          currentState: "Drive 0 Partition 3 (Linux ext4 - 400 GB)",
          correctState: "Drive 0 Unallocated Space (600 GB)",
          states: [
            "Drive 0 Unallocated Space (600 GB)",
            "Drive 0 Partition 3 (Linux ext4 - 400 GB)",
            "Delete all partitions and use entire drive",
          ],
          rationaleId: "wi3-r2",
        },
        {
          id: "wi3-boot-mode",
          label: "BIOS Boot Mode",
          detail: "Firmware boot mode setting",
          currentState: "Legacy BIOS",
          correctState: "UEFI",
          states: ["UEFI", "Legacy BIOS", "CSM (Compatibility Support Module)"],
          rationaleId: "wi3-r3",
        },
      ],
      rationales: [
        {
          id: "wi3-r1",
          text: "Custom install is required for dual-boot setups since there is no existing Windows installation to upgrade. This allows selecting the specific partition for Windows.",
        },
        {
          id: "wi3-r2",
          text: "Installing to the unallocated space preserves the existing Linux partition. Installing to the Linux partition or deleting all partitions would destroy the Linux installation.",
        },
        {
          id: "wi3-r3",
          text: "UEFI mode is required for Windows 11 and supports GPT partition tables needed for modern dual-boot configurations. Legacy BIOS uses MBR which limits partition management.",
        },
      ],
      feedback: {
        perfect:
          "Perfect. Custom install to unallocated space in UEFI mode preserves the Linux installation and creates a proper dual-boot configuration.",
        partial:
          "Be careful with partition selection in dual-boot scenarios. Installing to the wrong partition destroys the other OS.",
        wrong: "That configuration would destroy the existing Linux installation or fail to boot properly.",
      },
    },
  ],
  hints: [
    "Match the Windows edition to the features required by the deployment scenario (BitLocker, domain join, etc.).",
    "Upgrade installations preserve files and apps; custom installations start fresh on the selected partition.",
    "Windows 11 requires UEFI firmware and TPM 2.0 for supported installations.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Windows deployment is a daily task for desktop support technicians. Understanding edition differences, installation types, and partition layouts is essential for A+ certification and real-world IT support.",
  toolRelevance: [
    "Windows Setup (setup.exe)",
    "Media Creation Tool",
    "Disk Management",
    "UEFI/BIOS Firmware Settings",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
