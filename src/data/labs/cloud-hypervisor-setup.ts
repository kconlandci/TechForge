import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "cloud-hypervisor-setup",
  version: 1,
  title: "Configure Type 1 vs Type 2 Hypervisor",
  tier: "intermediate",
  track: "virtualization-cloud",
  difficulty: "moderate",
  accessLevel: "free",
  tags: ["hypervisor", "vmware", "hyper-v", "virtualbox", "type-1", "type-2", "CompTIA-A+"],
  description:
    "Configure hypervisor settings for different deployment scenarios, understanding the differences between Type 1 (bare-metal) and Type 2 (hosted) hypervisors.",
  estimatedMinutes: 18,
  learningObjectives: [
    "Differentiate between Type 1 and Type 2 hypervisors and their use cases",
    "Configure hypervisor resource allocation including CPU, memory, and storage",
    "Apply proper virtual switch and network adapter settings for VMs",
    "Optimize hypervisor settings for production versus development workloads",
  ],
  sortOrder: 407,
  status: "published",
  prerequisites: [],
  rendererType: "toggle-config",
  scenarios: [
    {
      id: "hy-scenario-1",
      type: "toggle-config",
      title: "VMware ESXi Production Server Configuration",
      description:
        "A small business purchased a Dell PowerEdge server with 2x Intel Xeon CPUs (32 cores total), 256 GB RAM, and 8x 1.92 TB NVMe SSDs. They need to run 3 production VMs: a domain controller, a file server, and an application server. The server has VMware ESXi 8.0 installed but uses default settings. The IT admin needs to optimize the configuration.",
      targetSystem: "VMware ESXi 8.0 - Dell PowerEdge R750",
      items: [
        {
          id: "hy1-storage",
          label: "Datastore Configuration",
          detail: "Storage configuration for the 8 NVMe drives",
          currentState: "8 individual datastores (one per drive)",
          correctState: "RAID 10 datastore (4 mirrored pairs, striped)",
          states: [
            "8 individual datastores (one per drive)",
            "Single RAID 0 stripe across all 8 drives",
            "RAID 10 datastore (4 mirrored pairs, striped)",
            "RAID 5 datastore (7 data drives, 1 parity)",
          ],
          rationaleId: "hy1-r1",
        },
        {
          id: "hy1-vswitch",
          label: "Virtual Switch Configuration",
          detail: "Virtual networking for the production VMs",
          currentState: "Single vSwitch with all VMs on one port group",
          correctState: "Separate port groups per tier with VLAN tagging",
          states: [
            "Single vSwitch with all VMs on one port group",
            "Separate port groups per tier with VLAN tagging",
            "One physical NIC per VM (passthrough)",
            "No virtual switch (use external switch only)",
          ],
          rationaleId: "hy1-r2",
        },
        {
          id: "hy1-ha",
          label: "VM Startup Policy",
          detail: "Automatic startup order after host reboot or power failure",
          currentState: "All VMs start simultaneously on boot",
          correctState: "Domain controller first, then file server, then application server with delays",
          states: [
            "All VMs start simultaneously on boot",
            "Domain controller first, then file server, then application server with delays",
            "No automatic startup (manual start only)",
            "Application server first, then others",
          ],
          rationaleId: "hy1-r3",
        },
        {
          id: "hy1-reservation",
          label: "Memory Reservation for Domain Controller",
          detail: "Memory guarantee for the Active Directory domain controller VM",
          currentState: "No reservation (share with all VMs dynamically)",
          correctState: "Full reservation matching allocated memory (16 GB)",
          states: [
            "No reservation (share with all VMs dynamically)",
            "Full reservation matching allocated memory (16 GB)",
            "50% reservation (8 GB guaranteed, 8 GB shared)",
            "Maximum limit only (cap at 16 GB, no guarantee)",
          ],
          rationaleId: "hy1-r4",
        },
      ],
      rationales: [
        {
          id: "hy1-r1",
          text: "RAID 10 provides the best balance of performance and redundancy for production workloads. It can survive a drive failure without data loss. RAID 0 has no redundancy, individual datastores complicate management, and RAID 5 has slower write performance.",
        },
        {
          id: "hy1-r2",
          text: "VLAN-tagged port groups isolate traffic between the domain controller, file server, and application server at the network layer. A single port group allows all VMs to see each other's broadcast traffic, reducing security.",
        },
        {
          id: "hy1-r3",
          text: "The domain controller must start first because the file server and application server depend on Active Directory for authentication. Starting all simultaneously causes authentication failures during boot.",
        },
        {
          id: "hy1-r4",
          text: "A full memory reservation guarantees the domain controller always has its allocated RAM available, preventing memory contention from other VMs from degrading authentication services for all users.",
        },
      ],
      feedback: {
        perfect:
          "Excellent configuration. The storage, networking, startup order, and memory settings are all optimized for a reliable production environment.",
        partial:
          "Some settings are correct but others leave gaps in redundancy, security isolation, or service dependency management.",
        wrong: "This configuration has significant issues that would cause data loss, security exposure, or service failures in production.",
      },
    },
    {
      id: "hy-scenario-2",
      type: "toggle-config",
      title: "VirtualBox Development Lab Setup",
      description:
        "A cybersecurity student is setting up a home lab on their personal laptop (Intel i7, 32 GB RAM, 1 TB NVMe SSD) running Windows 11. They want to run VirtualBox with 3 VMs simultaneously: a Kali Linux attacker, a Windows Server target, and a pfSense firewall between them. The VMs need to communicate with each other but the attacker VM must not reach the host or the internet.",
      targetSystem: "Oracle VirtualBox 7.0 on Windows 11",
      items: [
        {
          id: "hy2-attacker-net",
          label: "Kali Linux Network Adapter",
          detail: "Network adapter type for the attacker VM",
          currentState: "NAT (shares host internet via NAT)",
          correctState: "Internal Network (isolated, routed through pfSense)",
          states: [
            "NAT (shares host internet via NAT)",
            "Bridged Adapter (direct host network access)",
            "Internal Network (isolated, routed through pfSense)",
            "Host-Only Adapter (access to host, no internet)",
          ],
          rationaleId: "hy2-r1",
        },
        {
          id: "hy2-ram",
          label: "Total VM Memory Allocation",
          detail: "Combined RAM allocation across all 3 VMs",
          currentState: "24 GB (8 GB each, leaves 8 GB for host)",
          correctState: "20 GB total (8 GB Kali, 8 GB Windows, 4 GB pfSense, 12 GB for host)",
          states: [
            "24 GB (8 GB each, leaves 8 GB for host)",
            "20 GB total (8 GB Kali, 8 GB Windows, 4 GB pfSense, 12 GB for host)",
            "30 GB (10 GB each, leaves 2 GB for host)",
            "12 GB (4 GB each, leaves 20 GB for host)",
          ],
          rationaleId: "hy2-r2",
        },
        {
          id: "hy2-disk-type",
          label: "Virtual Disk Format",
          detail: "Disk image format for the VM virtual hard drives",
          currentState: "Fixed-size VDI (pre-allocates full disk space)",
          correctState: "Dynamically allocated VDI (grows as needed)",
          states: [
            "Fixed-size VDI (pre-allocates full disk space)",
            "Dynamically allocated VDI (grows as needed)",
            "Raw disk mapping (direct partition access)",
            "Differencing disk linked to a base image",
          ],
          rationaleId: "hy2-r3",
        },
      ],
      rationales: [
        {
          id: "hy2-r1",
          text: "Internal Network mode creates a completely isolated virtual network segment. Traffic only flows between VMs on the same internal network, routed through the pfSense VM. The attacker VM cannot reach the host or internet directly.",
        },
        {
          id: "hy2-r2",
          text: "Leaving at least 12 GB for the Windows 11 host ensures stable performance. pfSense needs only 4 GB as a firewall appliance. Allocating 24 GB or more to VMs would cause the host to swap, degrading all VM performance.",
        },
        {
          id: "hy2-r3",
          text: "Dynamically allocated disks start small and grow as data is written, conserving SSD space on a 1 TB laptop drive running 3 VMs. Fixed-size disks would reserve the full allocated space immediately, potentially consuming half the drive.",
        },
      ],
      feedback: {
        perfect:
          "Perfect lab setup. The network isolation prevents accidental attacks on real networks, memory allocation keeps the host stable, and dynamic disks conserve limited laptop storage.",
        partial:
          "Some settings are correct but the lab either has security isolation gaps or resource allocation issues that affect host stability.",
        wrong: "This configuration either allows the attacker VM to reach real networks or destabilizes the host machine.",
      },
    },
    {
      id: "hy-scenario-3",
      type: "toggle-config",
      title: "Hyper-V Server for Branch Office",
      description:
        "A company branch office needs a Hyper-V server to run a local file server VM and a backup VM. The branch has unreliable internet (satellite connection) and must function autonomously when the WAN link is down. The server has 64 GB RAM, 16 cores, and 4x 2 TB SATA SSDs. The branch has 25 employees.",
      targetSystem: "Windows Server 2022 with Hyper-V Role",
      items: [
        {
          id: "hy3-memory",
          label: "Dynamic Memory for File Server VM",
          detail: "Hyper-V dynamic memory configuration for the file server",
          currentState: "Static 32 GB (fixed allocation)",
          correctState: "Dynamic Memory: 8 GB startup, 4 GB minimum, 24 GB maximum",
          states: [
            "Static 32 GB (fixed allocation)",
            "Dynamic Memory: 8 GB startup, 4 GB minimum, 24 GB maximum",
            "Static 4 GB (fixed allocation)",
            "Dynamic Memory: 2 GB startup, 1 GB minimum, 64 GB maximum",
          ],
          rationaleId: "hy3-r1",
        },
        {
          id: "hy3-checkpoint",
          label: "Checkpoint Type",
          detail: "Hyper-V checkpoint (snapshot) configuration for the file server VM",
          currentState: "Standard checkpoints (captures full VM state including memory)",
          correctState: "Production checkpoints (uses VSS for application-consistent backup)",
          states: [
            "Standard checkpoints (captures full VM state including memory)",
            "Production checkpoints (uses VSS for application-consistent backup)",
            "Disabled (no checkpoints allowed)",
            "Automatic checkpoints on every startup",
          ],
          rationaleId: "hy3-r2",
        },
        {
          id: "hy3-replication",
          label: "VM Replication Target",
          detail: "Where the file server VM is replicated for disaster recovery",
          currentState: "No replication configured",
          correctState: "Hyper-V Replica to the backup VM on the same host",
          states: [
            "No replication configured",
            "Hyper-V Replica to the backup VM on the same host",
            "Hyper-V Replica to headquarters over WAN",
            "Azure Site Recovery to Azure cloud",
          ],
          rationaleId: "hy3-r3",
        },
      ],
      rationales: [
        {
          id: "hy3-r1",
          text: "Dynamic Memory allows the file server to use as little as 4 GB during quiet periods and scale up to 24 GB during peak usage, leaving resources for the backup VM and the Hyper-V host. A static 32 GB allocation starves other VMs.",
        },
        {
          id: "hy3-r2",
          text: "Production checkpoints use VSS to create application-consistent snapshots, ensuring file server data is in a clean state. Standard checkpoints capture raw memory which can cause data corruption when restored on a file server with open files.",
        },
        {
          id: "hy3-r3",
          text: "With unreliable satellite internet, replicating to headquarters or Azure is not reliable. Hyper-V Replica to the local backup VM ensures the branch can restore the file server autonomously when the WAN is down.",
        },
      ],
      feedback: {
        perfect:
          "Correct configuration. Dynamic memory optimizes resource usage, production checkpoints ensure data consistency, and local replication provides autonomy during WAN outages.",
        partial:
          "Some settings are appropriate but others either waste resources or depend on the unreliable WAN connection for critical backup operations.",
        wrong: "This configuration either overallocates resources, risks data corruption during restores, or depends on unreliable connectivity for critical operations.",
      },
    },
  ],
  hints: [
    "Type 1 hypervisors run directly on hardware and are used for production servers. Type 2 hypervisors run on a host OS and are common for development and testing.",
    "VM startup order matters when services have dependencies. Domain controllers must start before domain-joined servers.",
    "In resource-constrained environments, dynamic memory allocation prevents any single VM from monopolizing the available RAM.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Hypervisor management is a core skill for system administrators and cloud engineers. VMware and Hyper-V certifications are among the most requested in IT job postings. Understanding both Type 1 and Type 2 hypervisors prepares you for enterprise data center and desktop support roles.",
  toolRelevance: [
    "VMware ESXi / vSphere",
    "Microsoft Hyper-V Manager",
    "Oracle VirtualBox",
    "VMware Workstation Pro",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
