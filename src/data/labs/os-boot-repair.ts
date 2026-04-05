import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "os-boot-repair",
  version: 1,
  title: "Advanced Boot Repair (BCD, MBR, EFI)",
  tier: "advanced",
  track: "operating-systems",
  difficulty: "challenging",
  accessLevel: "premium",
  tags: ["boot-repair", "bcd", "mbr", "efi", "recovery", "windows"],
  description:
    "Diagnose and repair advanced boot failures including corrupted BCD stores, damaged MBR/GPT, missing EFI boot entries, and bootloader recovery using Windows Recovery Environment tools.",
  estimatedMinutes: 30,
  learningObjectives: [
    "Use bootrec commands to repair MBR, boot sector, and BCD store",
    "Rebuild the BCD store from scratch when standard repair fails",
    "Repair UEFI boot entries using bcdboot and bcdedit",
    "Diagnose boot failures using error screens and recovery environment tools",
    "Distinguish between MBR/Legacy and GPT/UEFI boot processes",
  ],
  sortOrder: 612,
  status: "published",
  prerequisites: [],
  rendererType: "investigate-decide",
  scenarios: [
    {
      id: "br-scenario-1",
      type: "investigate-decide",
      title: "BOOTMGR Is Missing Error",
      objective:
        "A Windows 10 workstation (Legacy BIOS with MBR disk) displays 'BOOTMGR is missing. Press Ctrl+Alt+Del to restart.' after a power outage. The system cannot boot. Investigate using the Windows Recovery Environment.",
      investigationData: [
        {
          id: "br1-recovery-cmd",
          label: "Windows Recovery Environment - Command Prompt",
          content:
            "bootrec /fixmbr - The operation completed successfully.\nbootrec /fixboot - The operation completed successfully.\nbootrec /rebuildbcd - Total identified Windows installations: 0\n\nNote: rebuildbcd cannot find any Windows installations despite Windows being installed on C:\\.\n\ndiskpart > list volume shows:\n  Volume 0: System Reserved  350 MB  NTFS  Healthy (System, Active)\n  Volume 1: C:\\  465 GB  NTFS  Healthy (Boot)\n  Volume 2: Recovery  500 MB  NTFS  Healthy",
          isCritical: true,
        },
        {
          id: "br1-further",
          label: "Further Investigation",
          content:
            "dir C:\\Windows shows the Windows directory exists with all expected files.\ndir C:\\Windows\\System32\\config shows the registry hives exist.\nbcdedit returns: 'The boot configuration data store could not be opened. The system cannot find the file specified.'\nThe BCD store at \\Boot\\BCD on the System Reserved partition is missing/corrupted.",
        },
      ],
      actions: [
        {
          id: "br1-reinstall",
          label: "Reinstall Windows since the BCD store cannot be found",
          color: "red",
        },
        {
          id: "br1-rebuild-bcd",
          label: "Run: bcdboot C:\\Windows /s S: /f BIOS to manually rebuild the BCD store from the Windows installation",
          color: "green",
        },
        {
          id: "br1-startup-repair",
          label: "Run Startup Repair from the recovery menu repeatedly",
          color: "orange",
        },
        {
          id: "br1-fixmbr-only",
          label: "Run bootrec /fixmbr again since it worked the first time",
          color: "blue",
        },
      ],
      correctActionId: "br1-rebuild-bcd",
      rationales: [
        {
          id: "br1-r1",
          text: "Reinstalling Windows is unnecessary. The Windows installation on C:\\ is intact. Only the BCD (Boot Configuration Data) store on the System Reserved partition needs to be rebuilt.",
        },
        {
          id: "br1-r2",
          text: "bcdboot C:\\Windows /s S: /f BIOS copies the boot files from the Windows installation to the System Reserved partition (S:) and creates a new BCD store. The /f BIOS flag specifies MBR/Legacy boot firmware. This rebuilds what rebuildbcd could not auto-detect.",
        },
        {
          id: "br1-r3",
          text: "Startup Repair has limited capability for BCD corruption. If the BCD store is completely missing, Startup Repair often fails silently or loops. Manual bcdboot is more reliable for this scenario.",
        },
        {
          id: "br1-r4",
          text: "fixmbr only rewrites the master boot record code, not the BCD store. The MBR was already fixed successfully. The remaining problem is the missing BCD store.",
        },
      ],
      correctRationaleId: "br1-r2",
      feedback: {
        perfect:
          "Correct. bcdboot rebuilds the BCD store by copying boot files from the intact Windows installation. This is the definitive fix when rebuildbcd cannot auto-detect the OS.",
        partial:
          "Startup Repair may work but is unreliable for completely missing BCD stores. bcdboot is the manual, reliable alternative.",
        wrong: "The Windows installation is intact. Only the boot configuration needs rebuilding.",
      },
    },
    {
      id: "br-scenario-2",
      type: "investigate-decide",
      title: "UEFI Boot Entry Missing After Disk Clone",
      objective:
        "After cloning a Windows 11 installation from a SATA SSD to a new NVMe SSD using third-party cloning software, the system boots to the UEFI firmware screen with 'No bootable device found.' The UEFI firmware shows no Windows Boot Manager entry.",
      investigationData: [
        {
          id: "br2-uefi-menu",
          label: "UEFI Firmware Boot Menu",
          content:
            "Boot options:\n  1. USB: Generic Flash Disk\n  2. Network: IPv4 Intel Ethernet\n  3. Network: IPv6 Intel Ethernet\nNo 'Windows Boot Manager' entry is listed.\nSecure Boot: Enabled\nBoot Mode: UEFI (no CSM)\nThe old SATA SSD has been physically removed.\nThe NVMe drive is detected in UEFI as 'Samsung 970 EVO Plus 1TB'.",
          isCritical: true,
        },
        {
          id: "br2-recovery-env",
          label: "Windows Recovery Environment (booted from USB installer)",
          content:
            "diskpart > list disk:\n  Disk 0: Samsung 970 EVO Plus  931 GB  GPT\ndiskpart > list volume:\n  Volume 0: EFI  100 MB  FAT32  Healthy (System)\n  Volume 1: C:\\  930 GB  NTFS  Healthy\n\nThe EFI System Partition exists with correct FAT32 format.\ndir C:\\Windows confirms the Windows installation is intact.\nNote: The cloning tool copied partitions but did not create the UEFI NVRAM boot entry for the new disk.",
        },
      ],
      actions: [
        {
          id: "br2-bcdboot",
          label: "Run: bcdboot C:\\Windows /s S: /f UEFI to create the boot files and UEFI NVRAM entry for the NVMe drive",
          color: "green",
        },
        {
          id: "br2-disable-secure-boot",
          label: "Disable Secure Boot in UEFI settings",
          color: "orange",
        },
        {
          id: "br2-enable-csm",
          label: "Enable CSM (Compatibility Support Module) in UEFI",
          color: "blue",
        },
        {
          id: "br2-reclone",
          label: "Re-clone the drive using different cloning software",
          color: "red",
        },
      ],
      correctActionId: "br2-bcdboot",
      rationales: [
        {
          id: "br2-r1",
          text: "bcdboot C:\\Windows /s S: /f UEFI copies the EFI boot files to the EFI System Partition and creates the Windows Boot Manager NVRAM entry in UEFI firmware. This is exactly what the cloning tool failed to do.",
        },
        {
          id: "br2-r2",
          text: "Disabling Secure Boot would not create a boot entry. The issue is a missing NVRAM entry, not a Secure Boot signature problem. The Windows bootloader is properly signed.",
        },
        {
          id: "br2-r3",
          text: "Enabling CSM switches to Legacy BIOS compatibility mode, but the disk is GPT which requires UEFI. CSM with GPT often causes additional boot problems and is not the solution.",
        },
        {
          id: "br2-r4",
          text: "Re-cloning would likely reproduce the same issue since the NVRAM entry creation is firmware-level, not partition-level. The existing clone is fine; only the boot entry is missing.",
        },
      ],
      correctRationaleId: "br2-r1",
      feedback: {
        perfect:
          "Correct. The clone is intact but the UEFI NVRAM boot entry was not created. bcdboot with /f UEFI writes the boot files and registers the Windows Boot Manager in the firmware.",
        partial:
          "Secure Boot and CSM changes affect boot mode, not boot entries. The issue is a missing NVRAM entry for the cloned drive.",
        wrong: "The cloned data is intact. Only the UEFI boot entry needs to be created.",
      },
    },
    {
      id: "br-scenario-3",
      type: "investigate-decide",
      title: "Blue Screen Boot Loop with INACCESSIBLE_BOOT_DEVICE",
      objective:
        "A Windows 11 workstation shows INACCESSIBLE_BOOT_DEVICE (stop code 0x7B) and enters a boot loop after the IT department changed the SATA controller mode from AHCI to RAID in the BIOS for a planned storage upgrade that was later cancelled.",
      investigationData: [
        {
          id: "br3-bsod",
          label: "BSOD Analysis",
          content:
            "Stop code: INACCESSIBLE_BOOT_DEVICE (0x0000007B)\nThis error occurs when Windows cannot access the boot partition.\nThe error started immediately after the BIOS change from AHCI to RAID mode.\nThe SATA controller mode determines which storage driver Windows loads at boot time.\nWindows was installed with AHCI mode and does not have the RAID driver loaded at boot.",
          isCritical: true,
        },
        {
          id: "br3-bios",
          label: "BIOS/UEFI Settings Review",
          content:
            "Current SATA Mode: RAID\nPrevious SATA Mode: AHCI\nThe storage upgrade requiring RAID has been cancelled.\nThe workstation has a single NVMe SSD (not part of any RAID array).\nChanging back to AHCI in BIOS is possible.\nNote: If AHCI cannot be changed back, the RAID driver can be loaded via Safe Mode registry edit.",
        },
      ],
      actions: [
        {
          id: "br3-change-ahci",
          label: "Change the SATA controller mode back to AHCI in BIOS since the RAID upgrade was cancelled",
          color: "green",
        },
        {
          id: "br3-reinstall",
          label: "Reinstall Windows with RAID mode enabled",
          color: "red",
        },
        {
          id: "br3-safe-mode-raid",
          label: "Boot into Safe Mode and enable the RAID driver in the registry",
          color: "blue",
        },
        {
          id: "br3-startup-repair",
          label: "Run Startup Repair from the Windows recovery environment",
          color: "orange",
        },
      ],
      correctActionId: "br3-change-ahci",
      rationales: [
        {
          id: "br3-r1",
          text: "Since the RAID upgrade was cancelled and there is no RAID array, simply reverting the BIOS setting from RAID back to AHCI restores the storage controller mode Windows was installed with. Windows will boot normally using the AHCI driver it already has.",
        },
        {
          id: "br3-r2",
          text: "Reinstalling Windows is completely unnecessary. The OS and data are intact. The BIOS setting change is the only issue.",
        },
        {
          id: "br3-r3",
          text: "Loading the RAID driver via Safe Mode registry edit would work if RAID mode were actually needed. Since the upgrade was cancelled, reverting to AHCI is simpler and avoids unnecessary driver complexity.",
        },
        {
          id: "br3-r4",
          text: "Startup Repair cannot fix a BIOS configuration mismatch. The issue is at the firmware level, not in the Windows boot files.",
        },
      ],
      correctRationaleId: "br3-r1",
      feedback: {
        perfect:
          "Correct. The simplest and most direct fix is reverting the BIOS change since the RAID upgrade was cancelled. Windows will boot with its original AHCI driver immediately.",
        partial:
          "Enabling the RAID driver would fix the boot, but since RAID is not needed, reverting to AHCI is the simpler solution.",
        wrong: "The OS is intact. The boot failure is caused by a BIOS setting mismatch, not data corruption.",
      },
    },
  ],
  hints: [
    "bcdboot rebuilds boot files and BCD store from an intact Windows installation. Use /f BIOS for Legacy or /f UEFI for UEFI systems.",
    "INACCESSIBLE_BOOT_DEVICE (0x7B) often indicates a storage controller mode mismatch between BIOS settings and the installed Windows driver.",
    "After disk cloning, UEFI NVRAM entries must be recreated since they reference the original disk, not the clone.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Boot repair skills are what separate IT professionals from casual users. Being able to recover a non-booting system without reinstalling Windows saves hours of downtime and demonstrates deep OS knowledge valued by employers.",
  toolRelevance: [
    "Windows Recovery Environment (WinRE)",
    "bootrec (fixmbr, fixboot, rebuildbcd)",
    "bcdboot",
    "bcdedit",
    "diskpart",
    "UEFI Firmware Settings",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
