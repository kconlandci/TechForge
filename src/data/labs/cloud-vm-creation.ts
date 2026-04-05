import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "cloud-vm-creation",
  version: 1,
  title: "Configure Virtual Machine Settings for Workload",
  tier: "beginner",
  track: "virtualization-cloud",
  difficulty: "easy",
  accessLevel: "free",
  tags: ["vm", "virtual-machine", "cloud", "configuration", "compute", "CompTIA-A+"],
  description:
    "Configure virtual machine CPU, memory, storage, and network settings to match specific workload requirements on a cloud platform.",
  estimatedMinutes: 15,
  learningObjectives: [
    "Select appropriate VM size based on workload requirements",
    "Configure vCPU and memory allocation for different application types",
    "Choose the correct storage type and size for VM disks",
    "Apply proper network configuration for cloud VMs",
  ],
  sortOrder: 401,
  status: "published",
  prerequisites: [],
  rendererType: "toggle-config",
  scenarios: [
    {
      id: "vm-scenario-1",
      type: "toggle-config",
      title: "Web Server VM Configuration",
      description:
        "A small business needs a VM to host their WordPress website that receives approximately 500 visitors per day. The site uses a MySQL database on the same server. Current on-prem server uses 2 cores and 4 GB RAM with 60% average utilization.",
      targetSystem: "Azure Virtual Machine - Standard_B2s",
      items: [
        {
          id: "vm1-vcpu",
          label: "vCPU Count",
          detail: "Number of virtual CPU cores allocated to the VM",
          currentState: "1 vCPU",
          correctState: "2 vCPUs",
          states: ["1 vCPU", "2 vCPUs", "4 vCPUs", "8 vCPUs"],
          rationaleId: "vm1-r1",
        },
        {
          id: "vm1-ram",
          label: "Memory (RAM)",
          detail: "Amount of RAM allocated to the virtual machine",
          currentState: "2 GB",
          correctState: "4 GB",
          states: ["1 GB", "2 GB", "4 GB", "8 GB", "16 GB"],
          rationaleId: "vm1-r2",
        },
        {
          id: "vm1-disk",
          label: "OS Disk Type",
          detail: "Storage performance tier for the boot and data disk",
          currentState: "Standard HDD",
          correctState: "Standard SSD",
          states: ["Standard HDD", "Standard SSD", "Premium SSD", "Ultra Disk"],
          rationaleId: "vm1-r3",
        },
        {
          id: "vm1-network",
          label: "Network Security Group",
          detail: "Inbound port rules for the VM",
          currentState: "Allow all inbound traffic",
          correctState: "Allow HTTP (80), HTTPS (443), SSH (22) only",
          states: [
            "Allow all inbound traffic",
            "Allow HTTP (80), HTTPS (443), SSH (22) only",
            "Allow HTTPS (443) only",
            "Block all inbound traffic",
          ],
          rationaleId: "vm1-r4",
        },
      ],
      rationales: [
        {
          id: "vm1-r1",
          text: "The existing server uses 2 cores at 60% utilization. Matching with 2 vCPUs ensures comparable performance. 1 vCPU would bottleneck, while 4+ is overprovisioned for 500 daily visitors.",
        },
        {
          id: "vm1-r2",
          text: "WordPress with MySQL on the same server needs at least 4 GB RAM. 2 GB causes swapping under load, while 8+ GB is overprovisioned for this traffic level.",
        },
        {
          id: "vm1-r3",
          text: "Standard SSD provides consistent low-latency reads for WordPress page loads and database queries. HDD causes slow page loads, while Premium SSD is unnecessary for this workload.",
        },
        {
          id: "vm1-r4",
          text: "A web server needs HTTP/HTTPS for visitors and SSH for admin access. Allowing all traffic is a security risk, while blocking HTTP prevents the site from functioning.",
        },
      ],
      feedback: {
        perfect:
          "Excellent configuration. You matched the VM specs to the workload and applied proper security rules.",
        partial:
          "Some settings are close but could be optimized. Review the workload requirements against each configuration choice.",
        wrong: "Several settings would cause performance or security issues. Match each setting to the specific workload needs.",
      },
    },
    {
      id: "vm-scenario-2",
      type: "toggle-config",
      title: "Development Environment VM Setup",
      description:
        "A developer needs a cloud VM for building and testing a Java Spring Boot application with Docker containers. They compile code frequently and run integration tests with multiple containers. They work 8 hours/day, 5 days/week and want to minimize costs when not working.",
      targetSystem: "AWS EC2 Instance - t3.xlarge",
      items: [
        {
          id: "vm2-vcpu",
          label: "Instance Type",
          detail: "EC2 instance size determining compute and memory",
          currentState: "t3.micro (2 vCPU, 1 GB)",
          correctState: "t3.xlarge (4 vCPU, 16 GB)",
          states: [
            "t3.micro (2 vCPU, 1 GB)",
            "t3.medium (2 vCPU, 4 GB)",
            "t3.xlarge (4 vCPU, 16 GB)",
            "m5.4xlarge (16 vCPU, 64 GB)",
          ],
          rationaleId: "vm2-r1",
        },
        {
          id: "vm2-storage",
          label: "EBS Volume Type",
          detail: "Storage type for the root and data volumes",
          currentState: "gp2 (General Purpose SSD)",
          correctState: "gp3 (General Purpose SSD)",
          states: [
            "gp2 (General Purpose SSD)",
            "gp3 (General Purpose SSD)",
            "io2 (Provisioned IOPS)",
            "st1 (Throughput Optimized HDD)",
          ],
          rationaleId: "vm2-r2",
        },
        {
          id: "vm2-shutdown",
          label: "Auto-Stop Schedule",
          detail: "Automatic instance scheduling to control costs",
          currentState: "No schedule (runs 24/7)",
          correctState: "Stop daily at 6 PM, start at 8 AM weekdays",
          states: [
            "No schedule (runs 24/7)",
            "Stop daily at 6 PM, start at 8 AM weekdays",
            "Terminate daily at 6 PM, launch new at 8 AM",
            "Stop after 1 hour of idle CPU",
          ],
          rationaleId: "vm2-r3",
        },
      ],
      rationales: [
        {
          id: "vm2-r1",
          text: "Java compilation, Spring Boot, and Docker containers demand at least 4 vCPUs and 16 GB RAM. A micro instance cannot run Docker effectively, while m5.4xlarge is excessive for a single developer.",
        },
        {
          id: "vm2-r2",
          text: "gp3 provides the same performance as gp2 at 20% lower cost, with the ability to independently scale IOPS and throughput. io2 is overkill and st1 is too slow for compilation.",
        },
        {
          id: "vm2-r3",
          text: "Stopping (not terminating) the instance outside work hours saves ~65% on compute costs while preserving all data and configuration. Terminating destroys the instance and requires rebuilding.",
        },
      ],
      feedback: {
        perfect:
          "Perfect setup. The instance size matches the development workload and the cost controls prevent waste during off-hours.",
        partial:
          "Close, but either the instance is mismatched for the workload or costs are not optimized for a 40-hour work week.",
        wrong: "This configuration either cannot handle the development workload or wastes significant budget on unused resources.",
      },
    },
    {
      id: "vm-scenario-3",
      type: "toggle-config",
      title: "File Server Migration to Cloud VM",
      description:
        "A company is migrating a Windows file server to the cloud. The server stores 2 TB of shared files accessed by 50 employees via SMB. Peak usage is Monday mornings when everyone syncs files. Current issues include slow access during peak times and no backup solution.",
      targetSystem: "Azure VM - Standard_D4s_v5",
      items: [
        {
          id: "vm3-size",
          label: "VM Size",
          detail: "Compute tier for the file server VM",
          currentState: "Standard_B2ms (2 vCPU, 8 GB)",
          correctState: "Standard_D4s_v5 (4 vCPU, 16 GB)",
          states: [
            "Standard_B2ms (2 vCPU, 8 GB)",
            "Standard_D4s_v5 (4 vCPU, 16 GB)",
            "Standard_E8s_v5 (8 vCPU, 64 GB)",
            "Standard_F4s_v2 (4 vCPU, 8 GB)",
          ],
          rationaleId: "vm3-r1",
        },
        {
          id: "vm3-data-disk",
          label: "Data Disk Configuration",
          detail: "Storage configuration for the 2 TB file share",
          currentState: "Single 2 TB Standard HDD",
          correctState: "Single 2 TB Premium SSD",
          states: [
            "Single 2 TB Standard HDD",
            "Single 2 TB Premium SSD",
            "Single 4 TB Ultra Disk",
            "No data disk (use OS disk only)",
          ],
          rationaleId: "vm3-r2",
        },
        {
          id: "vm3-backup",
          label: "Backup Configuration",
          detail: "Backup strategy for the file server data",
          currentState: "No backup configured",
          correctState: "Azure Backup with daily snapshots, 30-day retention",
          states: [
            "No backup configured",
            "Azure Backup with daily snapshots, 30-day retention",
            "Manual weekly export to blob storage",
            "RAID 1 mirror on a second data disk",
          ],
          rationaleId: "vm3-r3",
        },
      ],
      rationales: [
        {
          id: "vm3-r1",
          text: "A D4s_v5 with 4 vCPUs and 16 GB provides the network throughput and memory for 50 concurrent SMB users. B-series is burstable and cannot sustain peak load. E-series memory focus is unnecessary for a file server.",
        },
        {
          id: "vm3-r2",
          text: "Premium SSD eliminates the Monday morning bottleneck with consistent IOPS for 50 concurrent users. Standard HDD causes the same slow access they are migrating away from. Ultra Disk is cost-prohibitive for file serving.",
        },
        {
          id: "vm3-r3",
          text: "Azure Backup provides automated, policy-driven daily snapshots with point-in-time recovery. Manual exports are error-prone, and RAID 1 protects against disk failure but not accidental deletion or ransomware.",
        },
      ],
      feedback: {
        perfect:
          "Well configured. The VM handles concurrent users, the storage eliminates bottlenecks, and automated backups protect the data.",
        partial:
          "Some settings address the issues but others leave existing problems unresolved or introduce new risks.",
        wrong: "This configuration would reproduce the same performance and reliability issues they had on-premises.",
      },
    },
  ],
  hints: [
    "Match VM resources to the existing workload. Look at current utilization numbers to right-size the cloud instance.",
    "Consider storage performance tiers carefully. IOPS requirements vary dramatically between HDD and SSD options.",
    "Factor in cost optimization features like auto-stop schedules for non-production workloads.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "VM provisioning and right-sizing is a daily task for cloud administrators and help desk technicians supporting cloud infrastructure. Overprovisioning wastes budget while underprovisioning causes performance complaints. Mastering this balance is a highly valued skill.",
  toolRelevance: [
    "Azure Portal VM Creation Wizard",
    "AWS EC2 Launch Instance Wizard",
    "Azure Pricing Calculator",
    "AWS Instance Type Comparison",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
