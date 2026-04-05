import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "hw-custom-build",
  version: 1,
  title: "Spec a Custom PC for Video Editing",
  tier: "advanced",
  track: "hardware",
  difficulty: "challenging",
  accessLevel: "premium",
  tags: ["custom-build", "workstation", "video-editing", "components", "compatibility", "specification"],
  description:
    "Investigate client requirements and system specifications to design a custom video editing workstation. Evaluate component compatibility, performance requirements, and budget constraints.",
  estimatedMinutes: 22,
  learningObjectives: [
    "Analyze workload requirements to determine appropriate component specifications",
    "Verify component compatibility across CPU socket, RAM type, and form factor",
    "Balance performance, capacity, and budget for a professional workstation build",
  ],
  sortOrder: 317,
  status: "published",
  prerequisites: [],
  rendererType: "investigate-decide",
  scenarios: [
    {
      type: "investigate-decide",
      id: "build-1",
      title: "GPU Selection for DaVinci Resolve",
      objective:
        "A video production studio needs a workstation for DaVinci Resolve color grading and rendering of 6K RAW footage. DaVinci Resolve is heavily GPU-accelerated and benefits from large VRAM pools. Budget for the GPU is $1,000-1,500. Investigate the requirements and select the best GPU.",
      investigationData: [
        {
          id: "software-reqs",
          label: "DaVinci Resolve System Requirements",
          content:
            "Blackmagic recommends: minimum 8 GB VRAM for HD, 16+ GB VRAM for 4K+ workflows. DaVinci Resolve uses GPU for debayering RAW footage, color grading, Fusion effects, and neural engine AI features. It utilizes CUDA (NVIDIA) and OpenCL. NVIDIA CUDA is preferred for maximum compatibility with all features.",
          isCritical: true,
        },
        {
          id: "workload",
          label: "Production Workload Details",
          content:
            "The studio shoots in 6K Blackmagic RAW. Typical timeline has 3-5 color-corrected clips with Power Windows and multiple nodes. The Fusion page is used for motion graphics. Neural Engine AI features (face refinement, speed warp) are used regularly.",
        },
        {
          id: "current-options",
          label: "Available GPU Options in Budget",
          content:
            "NVIDIA RTX 4070 Ti Super: 16 GB VRAM, $800. NVIDIA RTX 4080 Super: 16 GB VRAM, $1,000. NVIDIA RTX 4090: 24 GB VRAM, $1,600 (slightly over budget). AMD RX 7900 XTX: 24 GB VRAM, $950.",
        },
      ],
      actions: [
        { id: "rtx4080s", label: "NVIDIA RTX 4080 Super (16 GB VRAM, CUDA)", color: "green" },
        { id: "rtx4070ti", label: "NVIDIA RTX 4070 Ti Super (16 GB VRAM, CUDA)", color: "yellow" },
        { id: "rx7900xtx", label: "AMD RX 7900 XTX (24 GB VRAM, OpenCL)", color: "orange" },
        { id: "rtx4090", label: "NVIDIA RTX 4090 (24 GB VRAM, CUDA)", color: "blue" },
      ],
      correctActionId: "rtx4080s",
      rationales: [
        {
          id: "rat-4080s",
          text: "The RTX 4080 Super provides 16 GB VRAM (meeting the 16+ GB recommendation for 4K+ work), full CUDA support for all DaVinci Resolve features including Neural Engine, and fits within the $1,000-1,500 budget at $1,000. CUDA is strongly preferred over OpenCL in Resolve for feature completeness and performance.",
        },
        {
          id: "rat-amd",
          text: "While the RX 7900 XTX has 24 GB VRAM at a lower price, DaVinci Resolve's Neural Engine AI features require CUDA and do not work on AMD GPUs. The studio uses these features regularly, making NVIDIA essential.",
        },
        {
          id: "rat-4090",
          text: "The RTX 4090 exceeds the stated budget of $1,000-1,500 at $1,600. While it would offer the best performance, staying within budget constraints is a professional requirement.",
        },
      ],
      correctRationaleId: "rat-4080s",
      feedback: {
        perfect: "Excellent! The RTX 4080 Super meets all requirements: sufficient VRAM, CUDA support for Neural Engine, and fits the budget. Understanding software-specific GPU requirements is essential for workstation builds.",
        partial: "That GPU could work for some aspects but misses a critical requirement. Check whether all the software features the studio uses are supported.",
        wrong: "That selection either lacks required software compatibility or exceeds the budget. Always verify software-specific GPU requirements before selecting hardware.",
      },
    },
    {
      type: "investigate-decide",
      id: "build-2",
      title: "Storage Architecture for Multi-Cam Editing",
      objective:
        "The same video workstation needs a storage solution for editing multi-camera 4K ProRes footage. A typical project uses 4 camera angles totaling 500 GB of footage, with 2 TB of archived projects. The motherboard has two M.2 NVMe slots (PCIe 4.0) and six SATA ports. Total storage budget: $500.",
      investigationData: [
        {
          id: "bandwidth",
          label: "Storage Bandwidth Requirements",
          content:
            "4K ProRes 422 at 24fps requires approximately 110 MB/s per stream. Four simultaneous streams (multi-cam) require 440 MB/s sustained read. An NVMe SSD provides 3,500-7,000 MB/s; a SATA SSD provides 550 MB/s; a 7200 RPM HDD provides 150 MB/s.",
          isCritical: true,
        },
        {
          id: "workflow",
          label: "Editor Workflow",
          content:
            "Active projects (1-2 at a time, ~500 GB each) need fast random and sequential access. Completed projects are archived and rarely accessed. The OS and applications need fast boot and launch times.",
        },
        {
          id: "budget-options",
          label: "Storage Options in Budget",
          content:
            "1 TB NVMe Gen4 SSD: ~$80. 2 TB NVMe Gen4 SSD: ~$150. 500 GB SATA SSD: ~$40. 4 TB HDD 7200 RPM: ~$80. 8 TB HDD 5400 RPM: ~$130.",
        },
      ],
      actions: [
        { id: "three-tier", label: "500 GB NVMe (OS) + 2 TB NVMe (projects) + 4 TB HDD (archive)", color: "green" },
        { id: "all-nvme", label: "Two 2 TB NVMe SSDs (OS + projects on one, archive on other)", color: "yellow" },
        { id: "ssd-hdd", label: "500 GB SATA SSD (OS) + 8 TB HDD (everything else)", color: "orange" },
        { id: "single-nvme", label: "Single 2 TB NVMe SSD for everything", color: "red" },
      ],
      correctActionId: "three-tier",
      rationales: [
        {
          id: "rat-three",
          text: "Three-tier storage: NVMe for OS ensures fast boot/app launches, a separate NVMe for active projects provides the 3,500+ MB/s bandwidth needed for multi-cam 4K editing (far exceeding the 440 MB/s requirement with room for effects rendering), and HDD for archives maximizes capacity at minimal cost. Total cost: ~$80 + ~$150 + ~$80 = ~$310, well within budget.",
        },
        {
          id: "rat-all-nvme",
          text: "Using NVMe for archives wastes expensive high-speed storage on rarely accessed data. Archives don't need SSD speeds and the budget is better spent elsewhere.",
        },
        {
          id: "rat-sata",
          text: "A single 7200 RPM HDD provides only 150 MB/s - insufficient for four simultaneous 4K ProRes streams requiring 440 MB/s. Multi-cam editing would stutter and drop frames.",
        },
      ],
      correctRationaleId: "rat-three",
      feedback: {
        perfect: "Perfect storage architecture! Separating OS, active projects, and archives across appropriate tiers maximizes both performance and capacity while staying well under budget.",
        partial: "The approach has merit but doesn't optimally balance performance and cost across the different storage tiers.",
        wrong: "That configuration either can't handle the multi-cam bandwidth requirements or wastes budget on unnecessary speed for archival storage.",
      },
    },
    {
      type: "investigate-decide",
      id: "build-3",
      title: "RAM Configuration for After Effects",
      objective:
        "The workstation also runs Adobe After Effects for motion graphics. The motherboard supports four DDR5 DIMM slots, up to 128 GB, in dual-channel configuration. After Effects is one of the most RAM-hungry applications in the creative suite. Budget for RAM: $300.",
      investigationData: [
        {
          id: "ae-reqs",
          label: "Adobe After Effects RAM Usage",
          content:
            "After Effects pre-renders frames into RAM for real-time playback (RAM Preview). More RAM means longer preview sequences before it must flush. Adobe recommends 64 GB minimum for professional 4K work. Each 4K composition frame takes approximately 128-256 MB of RAM.",
          isCritical: true,
        },
        {
          id: "system-needs",
          label: "Total System RAM Budget",
          content:
            "OS and background apps: ~8 GB. DaVinci Resolve GPU cache: ~4-8 GB. After Effects RAM Preview: as much as available. Chrome and reference material: ~4-8 GB. System overhead: ~4 GB.",
        },
        {
          id: "pricing",
          label: "DDR5 RAM Pricing",
          content:
            "32 GB (2x16 GB) DDR5-5600: ~$100. 64 GB (2x32 GB) DDR5-5600: ~$190. 128 GB (4x32 GB) DDR5-5600: ~$380. 96 GB (2x48 GB) DDR5-5600: ~$290.",
        },
      ],
      actions: [
        { id: "96gb", label: "96 GB (2x48 GB DDR5-5600) - leaves two slots for future upgrade", color: "green" },
        { id: "64gb", label: "64 GB (2x32 GB DDR5-5600) - meets minimum recommendation", color: "yellow" },
        { id: "128gb", label: "128 GB (4x32 GB DDR5-5600) - maximum capacity", color: "orange" },
        { id: "32gb", label: "32 GB (2x16 GB DDR5-5600) - below recommendation", color: "red" },
      ],
      correctActionId: "96gb",
      rationales: [
        {
          id: "rat-96",
          text: "96 GB in 2x48 GB configuration provides 50% more than Adobe's 64 GB minimum, fits the $300 budget at $290, and leaves two DIMM slots empty for future expansion to 192 GB. Using two sticks maintains optimal dual-channel bandwidth. This balances capacity, cost, and upgrade path perfectly.",
        },
        {
          id: "rat-64",
          text: "64 GB meets the minimum but After Effects will benefit significantly from more RAM. At $190, there is budget headroom to get more capacity without exceeding $300.",
        },
        {
          id: "rat-128",
          text: "128 GB exceeds the $300 budget at $380. Additionally, filling all four slots removes any future upgrade path without replacing existing modules.",
        },
      ],
      correctRationaleId: "rat-96",
      feedback: {
        perfect: "Excellent! 96 GB in a 2x48 GB configuration is the sweet spot: exceeds the minimum, fits the budget, maintains dual-channel, and preserves the upgrade path. This shows professional build planning.",
        partial: "That amount of RAM would work but isn't the optimal choice when considering budget, performance, and future upgrade potential together.",
        wrong: "That configuration either exceeds the budget, underperforms for the workload, or eliminates future upgrade options. Balance all three factors.",
      },
    },
  ],
  hints: [
    "DaVinci Resolve's Neural Engine requires NVIDIA CUDA - it does not work on AMD GPUs.",
    "Multi-cam editing bandwidth = per-stream bandwidth x number of simultaneous streams. Ensure the storage can handle the total.",
    "Using fewer DIMM slots (2 instead of 4) leaves room for future upgrades without replacing existing modules.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Custom workstation builds for creative professionals require understanding both hardware specifications and software-specific requirements. The ability to spec a system that meets technical needs within budget is a highly valued skill.",
  toolRelevance: [
    "PCPartPicker for compatibility verification",
    "Puget Systems benchmark database for workstation hardware recommendations",
    "Blackmagic Disk Speed Test for storage bandwidth verification",
    "CPU-Z and GPU-Z for verifying installed specifications",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
