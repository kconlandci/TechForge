import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "hw-bios-config",
  version: 1,
  title: "Configure BIOS/UEFI Settings for Common Tasks",
  tier: "intermediate",
  track: "hardware",
  difficulty: "moderate",
  accessLevel: "free",
  tags: ["BIOS", "UEFI", "boot-order", "secure-boot", "TPM", "XMP", "virtualization"],
  description:
    "Configure BIOS/UEFI settings for real-world scenarios including boot order, Secure Boot, TPM enablement, virtualization support, and XMP memory profiles.",
  estimatedMinutes: 18,
  learningObjectives: [
    "Navigate BIOS/UEFI menus and modify boot order for OS installation",
    "Enable Secure Boot and TPM 2.0 for Windows 11 compliance",
    "Configure hardware virtualization (VT-x/AMD-V) and XMP memory profiles",
  ],
  sortOrder: 308,
  status: "published",
  prerequisites: [],
  rendererType: "toggle-config",
  scenarios: [
    {
      type: "toggle-config",
      id: "bios-1",
      title: "Prepare BIOS for Windows 11 Installation",
      description:
        "A company is upgrading workstations from Windows 10 to Windows 11. The PCs have compatible hardware but the BIOS needs specific settings enabled to pass Windows 11 requirements. Configure the BIOS correctly.",
      targetSystem: "Dell OptiPlex 5090 UEFI BIOS",
      items: [
        {
          id: "secure-boot",
          label: "Secure Boot",
          detail: "Windows 11 requires Secure Boot to be enabled to prevent unauthorized bootloaders",
          currentState: "Disabled",
          correctState: "Enabled",
          states: ["Enabled", "Disabled"],
          rationaleId: "rat-sb",
        },
        {
          id: "tpm",
          label: "TPM 2.0 (Trusted Platform Module)",
          detail: "Windows 11 requires TPM 2.0 for hardware-based security functions including BitLocker and Credential Guard",
          currentState: "Disabled",
          correctState: "Enabled",
          states: ["Enabled", "Disabled"],
          rationaleId: "rat-tpm",
        },
        {
          id: "boot-mode",
          label: "Boot Mode",
          detail: "Windows 11 requires UEFI boot mode with GPT partitioning. Legacy BIOS/MBR is not supported",
          currentState: "Legacy BIOS",
          correctState: "UEFI",
          states: ["UEFI", "Legacy BIOS", "UEFI + Legacy"],
          rationaleId: "rat-uefi",
        },
      ],
      rationales: [
        {
          id: "rat-sb",
          text: "Secure Boot is a mandatory Windows 11 requirement. It verifies that boot software is signed and trusted, protecting against rootkits and bootkit malware.",
        },
        {
          id: "rat-tpm",
          text: "TPM 2.0 is a hard requirement for Windows 11. It provides hardware-based cryptographic operations used by BitLocker, Windows Hello, and Credential Guard. Without TPM 2.0, the Windows 11 installer will refuse to proceed.",
        },
        {
          id: "rat-uefi",
          text: "Windows 11 requires UEFI boot mode with GPT disk partitioning. Legacy BIOS with MBR is not supported. UEFI + Legacy (CSM) mode should also be avoided as it can interfere with Secure Boot.",
        },
      ],
      feedback: {
        perfect: "Excellent! All three settings - Secure Boot, TPM 2.0, and UEFI boot mode - are mandatory for Windows 11. This is a common deployment preparation task.",
        partial: "Some settings are correct but Windows 11 requires all three: Secure Boot, TPM 2.0, and UEFI mode. Missing any one will fail the compatibility check.",
        wrong: "These settings do not meet Windows 11 requirements. Review Microsoft's minimum hardware requirements for Windows 11.",
      },
    },
    {
      type: "toggle-config",
      id: "bios-2",
      title: "Enable Virtualization for Development VM",
      description:
        "A developer needs to run Hyper-V virtual machines on their workstation for testing. The VMs fail to start with a 'hardware virtualization not enabled' error. Configure the BIOS to support virtualization.",
      targetSystem: "ASUS ProArt B660 UEFI BIOS (Intel 12th Gen)",
      items: [
        {
          id: "vtx",
          label: "Intel VT-x (Virtualization Technology)",
          detail: "Hardware CPU virtualization support required by hypervisors like Hyper-V and VMware",
          currentState: "Disabled",
          correctState: "Enabled",
          states: ["Enabled", "Disabled"],
          rationaleId: "rat-vtx",
        },
        {
          id: "vtd",
          label: "Intel VT-d (Directed I/O)",
          detail: "IOMMU support for direct hardware passthrough to virtual machines",
          currentState: "Disabled",
          correctState: "Enabled",
          states: ["Enabled", "Disabled"],
          rationaleId: "rat-vtd",
        },
        {
          id: "xmp",
          label: "XMP Profile",
          detail: "Memory overclocking profile. VMs benefit from faster memory access times.",
          currentState: "Disabled",
          correctState: "XMP Profile 1",
          states: ["Disabled", "XMP Profile 1", "XMP Profile 2"],
          rationaleId: "rat-xmp",
        },
      ],
      rationales: [
        {
          id: "rat-vtx",
          text: "VT-x (Intel Virtualization Technology) is required for Hyper-V, VMware Workstation, and other Type-1 and Type-2 hypervisors to run 64-bit guest operating systems. Without it, VMs cannot start.",
        },
        {
          id: "rat-vtd",
          text: "VT-d enables direct device assignment (passthrough) to VMs and improves DMA security. While not always required for basic VM operation, it is needed for GPU passthrough and improves overall VM I/O performance.",
        },
        {
          id: "rat-xmp",
          text: "XMP (Extreme Memory Profile) runs the RAM at its rated speed rather than the JEDEC default. For VM workloads, faster memory improves performance. Profile 1 is typically the manufacturer's tested overclock.",
        },
      ],
      feedback: {
        perfect: "Great work! VT-x is mandatory for virtualization, VT-d enables advanced features like device passthrough, and XMP maximizes memory performance for VM-heavy workloads.",
        partial: "You got the critical virtualization setting right, but review the other settings that enhance VM performance.",
        wrong: "Without VT-x enabled, no hypervisor can run VMs. This is always the first thing to check when VMs fail to start.",
      },
    },
    {
      type: "toggle-config",
      id: "bios-3",
      title: "Configure Boot Order for USB OS Install",
      description:
        "A technician needs to boot from a USB drive to install a fresh copy of Windows on a new NVMe SSD. The BIOS is currently set to boot from the old HDD first. Configure the boot settings correctly.",
      targetSystem: "MSI MAG B550 TOMAHAWK UEFI BIOS",
      items: [
        {
          id: "boot-1",
          label: "First Boot Device",
          detail: "The first device the system attempts to boot from",
          currentState: "SATA HDD: WDC WD10EZEX",
          correctState: "USB: SanDisk Ultra Fit",
          states: ["SATA HDD: WDC WD10EZEX", "NVMe SSD: Samsung 970 EVO", "USB: SanDisk Ultra Fit", "Network: PXE IPv4"],
          rationaleId: "rat-boot1",
        },
        {
          id: "boot-2",
          label: "Second Boot Device",
          detail: "Fallback boot device if the first device fails or is removed",
          currentState: "Network: PXE IPv4",
          correctState: "NVMe SSD: Samsung 970 EVO",
          states: ["SATA HDD: WDC WD10EZEX", "NVMe SSD: Samsung 970 EVO", "USB: SanDisk Ultra Fit", "Network: PXE IPv4"],
          rationaleId: "rat-boot2",
        },
        {
          id: "csm",
          label: "CSM (Compatibility Support Module)",
          detail: "Legacy BIOS compatibility layer. Affects whether the system boots in UEFI or Legacy mode.",
          currentState: "Enabled",
          correctState: "Disabled",
          states: ["Enabled", "Disabled"],
          rationaleId: "rat-csm",
        },
      ],
      rationales: [
        {
          id: "rat-boot1",
          text: "To install from USB, the USB drive must be the first boot device. The UEFI BIOS will then boot the Windows installer from the USB drive. After installation, the boot order should be changed back.",
        },
        {
          id: "rat-boot2",
          text: "The NVMe SSD is the intended OS drive. Setting it as the second boot device means after the USB is removed post-install, the system automatically boots from the new Windows installation.",
        },
        {
          id: "rat-csm",
          text: "CSM should be disabled for modern Windows installs on NVMe SSDs. NVMe drives require UEFI boot (they are not visible in Legacy mode). Disabling CSM forces pure UEFI mode and creates a GPT partition table.",
        },
      ],
      feedback: {
        perfect: "Perfect! USB first for installation, NVMe second for post-install boot, and CSM disabled for proper UEFI/GPT installation. This is the correct technician workflow.",
        partial: "The boot order concept is right but check all three settings. CSM mode affects whether NVMe drives are even visible during boot.",
        wrong: "This boot configuration won't allow a USB installation on the NVMe drive. Review how boot order and CSM affect the OS installation process.",
      },
    },
  ],
  hints: [
    "Windows 11 has three firm BIOS requirements: UEFI mode, Secure Boot enabled, and TPM 2.0 enabled.",
    "Hardware virtualization (VT-x/AMD-V) must be enabled in BIOS before any hypervisor can run VMs.",
    "CSM (Compatibility Support Module) should be disabled for NVMe boot drives - they require UEFI mode.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "BIOS/UEFI configuration is a core competency for desktop support and system administration. Windows 11 deployments, VM environments, and OS installations all require confident BIOS navigation.",
  toolRelevance: [
    "UEFI BIOS interface",
    "Windows 11 PC Health Check tool",
    "tpm.msc (TPM Management Console)",
    "msinfo32 for verifying BIOS mode",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
