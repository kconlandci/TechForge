import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "hw-ram-upgrade",
  version: 1,
  title: "Choose the Correct RAM for a System Upgrade",
  tier: "beginner",
  track: "hardware",
  difficulty: "easy",
  accessLevel: "free",
  tags: ["RAM", "memory", "DDR4", "DDR5", "SODIMM", "upgrade"],
  description:
    "A user requests a memory upgrade. Review the system specs, current configuration, and motherboard manual to select the correct RAM module type, speed, and capacity.",
  estimatedMinutes: 12,
  learningObjectives: [
    "Distinguish between DDR3, DDR4, and DDR5 form factors and pin counts",
    "Match RAM specifications to motherboard compatibility requirements",
    "Determine maximum supported capacity and optimal channel configuration",
  ],
  sortOrder: 301,
  status: "published",
  prerequisites: [],
  rendererType: "action-rationale",
  scenarios: [
    {
      type: "action-rationale",
      id: "ram-upgrade-1",
      title: "Office Desktop Upgrade",
      context:
        "An office worker's Dell OptiPlex 7080 desktop is running slow with multiple browser tabs and Office apps. The system currently has a single 8 GB DDR4-2666 UDIMM installed. The motherboard has two DIMM slots and supports up to 64 GB of DDR4-3200 in dual-channel mode. Budget is moderate.",
      actions: [
        { id: "add-8gb-2666", label: "Add one 8 GB DDR4-2666 UDIMM (matching stick)", color: "green" },
        { id: "add-16gb-3200", label: "Add one 16 GB DDR4-3200 UDIMM", color: "yellow" },
        { id: "replace-ddr5", label: "Replace with two 8 GB DDR5-4800 DIMMs", color: "red" },
        { id: "add-8gb-sodimm", label: "Add one 8 GB DDR4-2666 SODIMM", color: "orange" },
      ],
      correctActionId: "add-8gb-2666",
      rationales: [
        {
          id: "rat-match",
          text: "Adding an identical 8 GB DDR4-2666 UDIMM enables dual-channel mode, doubling memory bandwidth. Matching speed and capacity across channels provides the best performance gain for the cost.",
        },
        {
          id: "rat-mismatch",
          text: "Mixing different RAM capacities or speeds forces the system into flex mode or single-channel, reducing bandwidth benefits. The faster stick would also be downclocked to match the slower one.",
        },
        {
          id: "rat-ddr5",
          text: "DDR5 is physically incompatible with DDR4 slots. The keying notch is in a different position, so DDR5 DIMMs cannot be installed in a DDR4 motherboard.",
        },
        {
          id: "rat-sodimm",
          text: "SODIMMs are the laptop form factor (260 pins for DDR4) and physically will not fit in desktop UDIMM slots (288 pins for DDR4).",
        },
      ],
      correctRationaleId: "rat-match",
      feedback: {
        perfect: "Excellent! Matching the existing 8 GB DDR4-2666 UDIMM enables dual-channel mode for optimal bandwidth. This is the best cost-effective upgrade.",
        partial: "You chose a compatible module, but not the optimal one. Matching speed and capacity ensures dual-channel mode is fully utilized.",
        wrong: "That module is physically incompatible with this system. Always verify DDR generation, form factor (UDIMM vs SODIMM), and slot compatibility.",
      },
    },
    {
      type: "action-rationale",
      id: "ram-upgrade-2",
      title: "Laptop Memory Expansion",
      context:
        "A user's Lenovo ThinkPad T14 Gen 3 laptop has 8 GB of DDR4-3200 soldered onto the motherboard and one empty SODIMM slot. The system supports a maximum of 40 GB total (8 GB soldered + 32 GB SODIMM). The user runs virtual machines and needs more memory.",
      actions: [
        { id: "add-32gb-sodimm", label: "Install one 32 GB DDR4-3200 SODIMM", color: "green" },
        { id: "add-16gb-udimm", label: "Install one 16 GB DDR4-3200 UDIMM", color: "red" },
        { id: "add-8gb-sodimm", label: "Install one 8 GB DDR4-3200 SODIMM", color: "yellow" },
        { id: "replace-all", label: "Replace the soldered RAM with a 32 GB module", color: "red" },
      ],
      correctActionId: "add-32gb-sodimm",
      rationales: [
        {
          id: "rat-max",
          text: "For VM workloads, maximizing RAM is critical. The 32 GB DDR4-3200 SODIMM fills the slot to the system maximum of 40 GB, providing the most headroom for virtual machines.",
        },
        {
          id: "rat-sodimm-only",
          text: "Laptops use SODIMM form factor modules. UDIMMs are physically larger desktop modules that will not fit in a laptop SODIMM slot.",
        },
        {
          id: "rat-soldered",
          text: "Soldered RAM is permanently attached to the motherboard at the factory. It cannot be removed or replaced by a technician in the field.",
        },
      ],
      correctRationaleId: "rat-max",
      feedback: {
        perfect: "Perfect choice! A 32 GB DDR4-3200 SODIMM maximizes the available capacity for VM workloads. Understanding soldered vs. slotted RAM is essential for laptop upgrades.",
        partial: "That module would work but doesn't maximize capacity for this VM-heavy use case. When running VMs, more RAM is almost always better.",
        wrong: "That option is not physically possible with this laptop. Remember: laptops use SODIMMs, and soldered RAM cannot be replaced.",
      },
    },
    {
      type: "action-rationale",
      id: "ram-upgrade-3",
      title: "ECC RAM for Small Server",
      context:
        "A small business is setting up a file server using a Supermicro X12STH-F motherboard with an Intel Xeon E-2300 series CPU. The board has four DIMM slots supporting ECC Unbuffered DDR4-3200 up to 128 GB. Data integrity is the top priority. The server will store financial records.",
      actions: [
        { id: "ecc-udimm", label: "Install four 16 GB DDR4-3200 ECC UDIMMs", color: "green" },
        { id: "non-ecc", label: "Install four 16 GB DDR4-3200 non-ECC UDIMMs", color: "yellow" },
        { id: "rdimm", label: "Install four 16 GB DDR4-3200 Registered DIMMs (RDIMMs)", color: "orange" },
        { id: "laptop-ram", label: "Install four 16 GB DDR4-3200 ECC SODIMMs", color: "red" },
      ],
      correctActionId: "ecc-udimm",
      rationales: [
        {
          id: "rat-ecc",
          text: "ECC (Error Correcting Code) RAM detects and corrects single-bit memory errors, essential for servers handling financial data. The Xeon platform supports ECC, and the board specifically requires ECC Unbuffered DIMMs.",
        },
        {
          id: "rat-non-ecc",
          text: "Non-ECC RAM lacks error correction and is unsuitable for servers where data integrity is critical. Some Xeon boards may not even POST with non-ECC modules.",
        },
        {
          id: "rat-rdimm",
          text: "Registered DIMMs (RDIMMs) have a register chip that buffers signals for higher capacity configurations. This board specifies ECC Unbuffered only; RDIMMs are not compatible.",
        },
      ],
      correctRationaleId: "rat-ecc",
      feedback: {
        perfect: "Exactly right! ECC Unbuffered DDR4 is required for this Xeon platform, and ECC is essential for data integrity on a server storing financial records.",
        partial: "Close, but you missed a key compatibility detail. Always check whether the board requires ECC, Unbuffered, or Registered modules specifically.",
        wrong: "That RAM type is not compatible with this server board. Server motherboards have strict memory type requirements - always consult the QVL (Qualified Vendor List).",
      },
    },
  ],
  hints: [
    "Always check the motherboard manual for supported DDR generation, form factor, and maximum capacity.",
    "Matching RAM speed and capacity across channels enables dual-channel mode for better performance.",
    "SODIMMs are for laptops (smaller), UDIMMs are for desktops (larger) - they are not interchangeable.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "RAM upgrades are one of the most common hardware tasks in desktop support. Ordering the wrong module wastes time and money. Knowing DDR generations, form factors, and ECC requirements is fundamental A+ knowledge.",
  toolRelevance: [
    "CPU-Z for identifying installed RAM specs",
    "Crucial System Scanner for compatibility checking",
    "Motherboard QVL (Qualified Vendor List)",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
