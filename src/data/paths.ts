// ============================================================
// TechForge — Learning Paths
// Ordered sequences of labs forming a curriculum.
// ============================================================

export interface LearningPath {
  id: string;
  title: string;
  name: string;
  description: string;
  targetAudience: string;
  labIds: string[];
  icon: string;
}

export const learningPaths: LearningPath[] = [
  {
    id: "hardware-hero",
    title: "Hardware Hero",
    name: "Hardware Hero",
    description:
      "Master PC hardware from diagnosis to repair — motherboards, RAM, storage, power supplies, printers, and mobile devices.",
    targetAudience: "Aspiring IT technicians, help desk professionals",
    icon: "HardDrive",
    labIds: [
      // Hardware labs (easy → challenging)
      "hw-no-post",
      "hw-ram-upgrade",
      "hw-storage-selection",
      "hw-psu-failure",
      "hw-overheating-pc",
      "hw-motherboard-form-factors",
      "hw-peripheral-setup",
      "hw-printer-paper-jam",
      "hw-bios-config",
      "hw-disk-failure",
      "hw-cpu-selection",
      "hw-laser-printer-maint",
      "hw-raid-config",
      "hw-esd-procedures",
      "hw-server-hardware",
      "hw-custom-build",
      "hw-3d-printer-issues",
      // Mobile device labs
      "mobile-battery-drain",
      "mobile-screen-replacement",
      "mobile-charging-issues",
      "mobile-slow-performance",
      "mobile-display-calibration",
      "mobile-wifi-connectivity",
      "mobile-email-sync",
      "mobile-security-breach",
      "mobile-app-crashes",
      "mobile-bluetooth-pairing",
      "mobile-storage-full",
      "mobile-os-update-failure",
      "mobile-data-migration",
      "mobile-baseband-issues",
      "mobile-mdm-enrollment",
      "hw-gpu-troubleshoot",
      "hw-ups-sizing",
      "hw-thermal-paste",
    ],
  },
  {
    id: "network-navigator",
    title: "Network Navigator",
    name: "Network Navigator",
    description:
      "Build networking skills from cable identification to VLAN configuration — troubleshoot connectivity, configure routers, and diagnose Wi-Fi issues.",
    targetAudience: "IT technicians, network support staff",
    icon: "Network",
    labIds: [
      "net-no-internet",
      "net-slow-speeds",
      "net-cable-identification",
      "net-ip-conflict",
      "net-dhcp-failure",
      "net-wifi-dead-zones",
      "net-dns-resolution",
      "net-switch-config",
      "net-vlan-setup",
      "net-port-forwarding",
      "net-wireless-security",
      "net-subnet-planning",
      "net-vpn-troubleshoot",
      "net-firewall-rules",
      "net-network-printer",
      "net-packet-analysis",
      "net-wan-failover",
      "net-wireless-survey",
      "net-latency-diagnosis",
      "net-proxy-config",
    ],
  },
  {
    id: "os-operator",
    title: "OS Operator",
    name: "OS Operator",
    description:
      "Navigate Windows, Linux, and macOS like a pro — command line mastery, driver troubleshooting, boot repair, and performance tuning.",
    targetAudience: "Desktop support technicians, system administrators",
    icon: "Cpu",
    labIds: [
      "os-windows-install",
      "os-file-permissions",
      "os-command-line-basics",
      "os-task-manager",
      "os-windows-update",
      "os-linux-basics",
      "os-driver-issues",
      "os-registry-editing",
      "os-disk-management",
      "os-user-account-mgmt",
      "os-macos-troubleshoot",
      "os-group-policy",
      "os-boot-repair",
      "os-linux-permissions",
      "os-performance-tuning",
    ],
  },
  {
    id: "cloud-virtual",
    title: "Cloud & Virtual",
    name: "Cloud & Virtual",
    description:
      "Understand virtualization and cloud computing — VMs, containers, cloud service models, migration planning, and cost optimization.",
    targetAudience: "IT professionals moving to cloud, aspiring cloud admins",
    icon: "Cloud",
    labIds: [
      "cloud-iaas-vs-saas",
      "cloud-vm-creation",
      "cloud-shared-resources",
      "cloud-backup-strategy",
      "cloud-vm-vs-container",
      "cloud-network-config",
      "cloud-storage-tiers",
      "cloud-hypervisor-setup",
      "cloud-migration-plan",
      "cloud-cost-optimization",
      "cloud-security-config",
      "cloud-disaster-recovery",
      "cloud-container-orchestration",
      "cloud-hybrid-setup",
      "cloud-compliance-review",
    ],
  },
  {
    id: "master-troubleshooter",
    title: "Master Troubleshooter",
    name: "Master Troubleshooter",
    description:
      "Apply systematic troubleshooting methodology across hardware, networking, and software — isolate faults, escalate correctly, and document solutions.",
    targetAudience: "All IT professionals, especially those preparing for escalation roles",
    icon: "Cpu",
    labIds: [
      "ts-methodology-basics",
      "ts-blue-screen",
      "ts-boot-failure",
      "ts-network-outage",
      "ts-slow-computer",
      "ts-intermittent-drops",
      "ts-application-error",
      "ts-multi-user-issue",
      "ts-hardware-vs-software",
      "ts-escalation-judgment",
      "ts-complex-network",
      "ts-server-down",
      "ts-wireless-interference",
      "ts-printer-fleet",
      "ts-documentation-review",
    ],
  },
];
