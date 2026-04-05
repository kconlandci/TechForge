import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "hw-motherboard-form-factors",
  version: 1,
  title: "Match Components to Motherboard Form Factors",
  tier: "beginner",
  track: "hardware",
  difficulty: "easy",
  accessLevel: "free",
  tags: ["motherboard", "ATX", "Micro-ATX", "Mini-ITX", "form-factor", "expansion-slots"],
  description:
    "Configure system builds by matching motherboards, cases, and expansion cards to their correct form factors. Identify compatibility constraints between ATX, Micro-ATX, and Mini-ITX platforms.",
  estimatedMinutes: 12,
  learningObjectives: [
    "Identify ATX, Micro-ATX, and Mini-ITX motherboard dimensions and mounting patterns",
    "Determine case compatibility for different motherboard form factors",
    "Evaluate expansion slot availability and its impact on build planning",
  ],
  sortOrder: 305,
  status: "published",
  prerequisites: [],
  rendererType: "toggle-config",
  scenarios: [
    {
      type: "toggle-config",
      id: "formfactor-1",
      title: "Small Form Factor Office Build",
      description:
        "A client wants a compact office PC that fits on a desk shelf (max case size: Mini-ITX tower). The build needs integrated graphics, one M.2 NVMe slot, and Wi-Fi. Configure the correct form factor selections.",
      targetSystem: "Compact Office Desktop",
      items: [
        {
          id: "mobo-size",
          label: "Motherboard Form Factor",
          detail: "Select the motherboard size that fits a Mini-ITX case",
          currentState: "ATX",
          correctState: "Mini-ITX",
          states: ["ATX", "Micro-ATX", "Mini-ITX"],
          rationaleId: "rat-itx",
        },
        {
          id: "case-type",
          label: "Case Form Factor",
          detail: "Select a case that accommodates the chosen motherboard and fits the shelf",
          currentState: "Mid-Tower ATX",
          correctState: "Mini-ITX Tower",
          states: ["Full-Tower ATX", "Mid-Tower ATX", "Mini-ITX Tower"],
          rationaleId: "rat-case",
        },
        {
          id: "wifi-method",
          label: "Wi-Fi Connectivity",
          detail: "Choose how to add Wi-Fi given the expansion slot constraints",
          currentState: "PCIe x1 Wi-Fi Card",
          correctState: "Onboard Wi-Fi (built into motherboard)",
          states: ["PCIe x1 Wi-Fi Card", "Onboard Wi-Fi (built into motherboard)", "USB Wi-Fi Adapter"],
          rationaleId: "rat-wifi",
        },
      ],
      rationales: [
        {
          id: "rat-itx",
          text: "Mini-ITX boards measure 170mm x 170mm and are the only standard ATX-family form factor that fits Mini-ITX cases. ATX (305x244mm) and Micro-ATX (244x244mm) are too large.",
        },
        {
          id: "rat-case",
          text: "A Mini-ITX tower case is designed specifically for Mini-ITX boards and fits the desk shelf size constraint. Mid-tower and full-tower cases are significantly larger.",
        },
        {
          id: "rat-wifi",
          text: "Mini-ITX boards typically have only one PCIe x16 slot. Since no discrete GPU is needed (integrated graphics), a PCIe card could work, but selecting a board with onboard Wi-Fi is the most reliable approach and preserves the expansion slot.",
        },
      ],
      feedback: {
        perfect: "Excellent! You correctly identified that Mini-ITX builds require careful planning around limited expansion slots, and choosing onboard Wi-Fi preserves flexibility.",
        partial: "Some selections are correct but check your form factor compatibility. Mini-ITX builds have tight constraints on both physical size and expansion options.",
        wrong: "Several selections are incompatible. Review the physical dimensions of each form factor and how they relate to case compatibility.",
      },
    },
    {
      type: "toggle-config",
      id: "formfactor-2",
      title: "Gaming PC Expansion Planning",
      description:
        "A gamer wants a PC with a full-size GPU, a PCIe sound card, and room for future expansion. They also want good airflow. Configure the form factor elements correctly.",
      targetSystem: "Gaming Desktop Build",
      items: [
        {
          id: "mobo-size",
          label: "Motherboard Form Factor",
          detail: "Select a motherboard with enough PCIe slots for a GPU and sound card plus future expansion",
          currentState: "Mini-ITX",
          correctState: "ATX",
          states: ["ATX", "Micro-ATX", "Mini-ITX"],
          rationaleId: "rat-atx",
        },
        {
          id: "case-type",
          label: "Case Size",
          detail: "Select a case that fits the motherboard and provides good airflow for gaming",
          currentState: "Mini-ITX Tower",
          correctState: "Mid-Tower ATX",
          states: ["Full-Tower ATX", "Mid-Tower ATX", "Mini-ITX Tower"],
          rationaleId: "rat-midtower",
        },
        {
          id: "gpu-slot",
          label: "Primary GPU Slot",
          detail: "Identify which slot the GPU should use for maximum bandwidth",
          currentState: "PCIe x4",
          correctState: "PCIe x16",
          states: ["PCIe x1", "PCIe x4", "PCIe x16"],
          rationaleId: "rat-pcie",
        },
      ],
      rationales: [
        {
          id: "rat-atx",
          text: "Full ATX boards offer 4-7 PCIe slots, accommodating a dual-slot GPU, a sound card, and future expansion cards. Micro-ATX has fewer slots, and Mini-ITX typically has only one x16 slot.",
        },
        {
          id: "rat-midtower",
          text: "Mid-tower ATX cases support full ATX boards with excellent airflow options (multiple fan mounts) at a reasonable size. Full-tower is unnecessarily large for this build.",
        },
        {
          id: "rat-pcie",
          text: "GPUs require the full x16 PCIe slot for maximum bandwidth (currently 16 GT/s per lane on PCIe 4.0). Using a lower-bandwidth slot would bottleneck the GPU significantly.",
        },
      ],
      feedback: {
        perfect: "Great work! ATX in a mid-tower gives you the expansion slots and airflow needed for a gaming rig with room to grow.",
        partial: "Some choices are close but not optimal. Think about how many PCIe slots you need and what case size balances space with practicality.",
        wrong: "This configuration won't support the required expansion cards. Count the PCIe slots needed and match the form factor accordingly.",
      },
    },
    {
      type: "toggle-config",
      id: "formfactor-3",
      title: "Budget Micro-ATX Workstation",
      description:
        "A small business needs a compact but capable workstation for CAD work. It requires a discrete GPU but no other expansion cards. Budget is tight, so a smaller case and board reduce costs. Configure appropriately.",
      targetSystem: "Budget CAD Workstation",
      items: [
        {
          id: "mobo-size",
          label: "Motherboard Form Factor",
          detail: "Select the most cost-effective board that supports a discrete GPU",
          currentState: "ATX",
          correctState: "Micro-ATX",
          states: ["ATX", "Micro-ATX", "Mini-ITX"],
          rationaleId: "rat-matx",
        },
        {
          id: "case-type",
          label: "Case Form Factor",
          detail: "Select a case compatible with the motherboard choice",
          currentState: "Full-Tower ATX",
          correctState: "Micro-ATX Tower",
          states: ["Full-Tower ATX", "Mid-Tower ATX", "Micro-ATX Tower"],
          rationaleId: "rat-case",
        },
        {
          id: "psu-form",
          label: "PSU Form Factor",
          detail: "Select the correct PSU form factor for the chosen case",
          currentState: "SFX",
          correctState: "ATX",
          states: ["ATX", "SFX", "TFX"],
          rationaleId: "rat-psu",
        },
      ],
      rationales: [
        {
          id: "rat-matx",
          text: "Micro-ATX boards (244x244mm) support a PCIe x16 slot for the GPU while being cheaper and smaller than full ATX. With no other expansion cards needed, the 2-4 PCIe slots on Micro-ATX are sufficient.",
        },
        {
          id: "rat-case",
          text: "Micro-ATX tower cases are compatible with Micro-ATX boards and are more compact and affordable than mid-tower or full-tower options. Note: Micro-ATX boards also physically fit in larger ATX cases, but the smaller case saves cost and desk space.",
        },
        {
          id: "rat-psu",
          text: "Most Micro-ATX tower cases use standard ATX power supplies. SFX PSUs are for Mini-ITX and compact builds, and TFX PSUs are for slim desktop cases. Always verify the case's PSU form factor support.",
        },
      ],
      feedback: {
        perfect: "Correct! Micro-ATX strikes the ideal balance of capability and cost for a single-GPU workstation. Good understanding of form factor compatibility.",
        partial: "Close, but review the relationship between case size, motherboard form factor, and PSU form factor. They all need to match.",
        wrong: "The form factors selected are mismatched. Remember: the case must fit the motherboard, and the PSU must fit the case.",
      },
    },
  ],
  hints: [
    "ATX boards are 305x244mm, Micro-ATX are 244x244mm, and Mini-ITX are 170x170mm. Larger cases can fit smaller boards but not vice versa.",
    "Mini-ITX boards typically have only one PCIe x16 slot, which limits expansion significantly.",
    "Always match the PSU form factor to what the case supports - ATX, SFX, and TFX are not interchangeable without adapters.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Understanding form factors is essential for procurement and build planning. Ordering an ATX board for a Mini-ITX case wastes time and shipping costs. A+ technicians must visualize compatibility before purchasing.",
  toolRelevance: [
    "PCPartPicker for compatibility checking",
    "Manufacturer QVL lists",
    "Measuring tape or calipers for physical verification",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
