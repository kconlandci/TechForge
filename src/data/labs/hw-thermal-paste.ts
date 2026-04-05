import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "hw-thermal-paste",
  version: 1,
  title: "Thermal Management Best Practices",
  tier: "advanced",
  track: "hardware",
  difficulty: "challenging",
  accessLevel: "premium",
  tags: ["thermal-paste", "TIM", "heatsink", "cooling", "CPU", "thermal-management"],
  description:
    "Apply thermal interface material correctly, select appropriate cooler types for different TDP loads, and configure optimal case airflow. Evaluate thermal management decisions for real system builds.",
  estimatedMinutes: 18,
  learningObjectives: [
    "Select the correct thermal paste application method for different CPU IHS sizes",
    "Choose appropriate cooler types based on CPU TDP and use case",
    "Design case airflow patterns that maximize cooling efficiency",
  ],
  sortOrder: 315,
  status: "published",
  prerequisites: [],
  rendererType: "action-rationale",
  scenarios: [
    {
      type: "action-rationale",
      id: "thermal-1",
      title: "Thermal Paste Application for Large IHS CPU",
      context:
        "A technician is repasting an AMD Threadripper 3970X processor. The Threadripper has an unusually large integrated heat spreader (IHS) measuring approximately 72mm x 52mm - much larger than standard desktop CPUs. The cooler is a Noctua NH-U14S TR4-SP3 tower cooler. The old paste has been cleaned with 99% isopropyl alcohol.",
      actions: [
        { id: "x-pattern", label: "Apply paste in an X pattern across the full IHS surface", color: "green" },
        { id: "pea-center", label: "Apply a single pea-sized dot in the center of the IHS", color: "yellow" },
        { id: "spread-manual", label: "Spread a thin layer across the IHS with a plastic card", color: "blue" },
        { id: "rice-grain", label: "Apply a rice-grain-sized amount in the center", color: "red" },
      ],
      correctActionId: "x-pattern",
      rationales: [
        {
          id: "rat-x",
          text: "Threadripper's large IHS (72x52mm) has active die areas that extend across the entire surface, not just the center. A single center dot may not spread to the edges, leaving die areas uncooled. An X pattern ensures coverage across the full IHS, which is critical for Threadripper's multi-chiplet layout where heat sources are distributed across the entire package.",
        },
        {
          id: "rat-pea",
          text: "A pea-sized center dot works well for smaller CPUs (Intel LGA 1700, AMD AM5) with centered dies. On Threadripper's massive IHS, the paste may not spread to the outer chiplets, causing hot spots at the edges.",
        },
        {
          id: "rat-spread",
          text: "Manual spreading can work but risks trapping air bubbles in the paste layer. The mounting pressure of the cooler naturally spreads the paste without introducing air pockets. Manual spreading is the least preferred method for most applications.",
        },
      ],
      correctRationaleId: "rat-x",
      feedback: {
        perfect: "Correct! Threadripper's large IHS and distributed chiplet design requires broader paste coverage. The X pattern ensures thermal compound reaches all die areas under the massive heat spreader.",
        partial: "That method works for smaller CPUs but does not provide adequate coverage for Threadripper's 72x52mm IHS with distributed chiplets.",
        wrong: "On a CPU this large with die areas spread across the entire IHS, that application method will leave portions of the chip without thermal contact.",
      },
    },
    {
      type: "action-rationale",
      id: "thermal-2",
      title: "Cooler Selection for 125W TDP CPU in SFF Case",
      context:
        "A client wants a small form factor (SFF) PC using an Intel Core i7-13700K (125W base TDP, 253W PL2 turbo). The case is a Dan A4-H2O (Mini-ITX, 11.2 liters) which supports a 240mm AIO radiator or a low-profile air cooler up to 55mm tall. The system will be used for software development and occasional gaming. Noise is a moderate concern.",
      actions: [
        { id: "aio-240", label: "240mm AIO liquid cooler (e.g., Corsair H100i)", color: "green" },
        { id: "lp-air", label: "Low-profile 55mm air cooler (e.g., Noctua NH-L9i)", color: "yellow" },
        { id: "tower-cooler", label: "Full tower cooler (e.g., Noctua NH-D15)", color: "red" },
        { id: "stock-cooler", label: "Intel stock cooler (Laminar RM1)", color: "red" },
      ],
      correctActionId: "aio-240",
      rationales: [
        {
          id: "rat-aio",
          text: "The i7-13700K can pull up to 253W under turbo boost. A 240mm AIO provides sufficient cooling capacity for this power draw in an SFF case. The Dan A4-H2O is specifically designed to accommodate a 240mm radiator, making this the intended cooling solution. A 55mm low-profile cooler cannot adequately cool 253W.",
        },
        {
          id: "rat-lp",
          text: "Low-profile coolers like the NH-L9i are designed for 65W TDP processors. At 253W turbo, the i7-13700K would thermal throttle severely with a 55mm cooler, eliminating the performance advantage of the K-series CPU.",
        },
        {
          id: "rat-tower",
          text: "A full tower cooler like the NH-D15 is 165mm tall and physically cannot fit in a case with a 55mm CPU cooler clearance. Physical measurements must be verified before purchasing.",
        },
      ],
      correctRationaleId: "rat-aio",
      feedback: {
        perfect: "Excellent! The 240mm AIO is the only option that fits the case AND handles the i7-13700K's 253W turbo power. SFF builds require careful thermal planning.",
        partial: "Consider both the physical constraints of the case and the thermal output of the CPU. Not every cooler that fits can handle the heat.",
        wrong: "That cooler either doesn't physically fit in the case or cannot handle the CPU's thermal output. SFF builds have strict constraints on both dimensions and cooling capacity.",
      },
    },
    {
      type: "action-rationale",
      id: "thermal-3",
      title: "Optimizing Case Airflow Pattern",
      context:
        "A mid-tower ATX case currently has: one 120mm rear exhaust fan and one 120mm top exhaust fan. No intake fans. The system has an air-cooled CPU and a dual-fan GPU. The user reports high idle temperatures (CPU 55C, GPU 50C at ambient 22C). The case has dust filters on the front panel and supports three 120mm front fans and two 120mm top fans.",
      actions: [
        { id: "add-front-intake", label: "Add two 120mm front intake fans (positive pressure config)", color: "green" },
        { id: "add-top-exhaust", label: "Add another top exhaust fan", color: "yellow" },
        { id: "remove-rear", label: "Remove the rear exhaust to reduce turbulence", color: "red" },
        { id: "all-intake", label: "Switch all fans to intake", color: "orange" },
      ],
      correctActionId: "add-front-intake",
      rationales: [
        {
          id: "rat-positive",
          text: "The case currently has zero intake fans and two exhaust fans, creating strong negative pressure. This starves the GPU and CPU of cool air and pulls unfiltered air through every gap. Adding two front intake fans creates a balanced or slightly positive pressure airflow pattern: cool air enters through the filtered front, flows over the GPU and CPU, and exits through the rear and top exhausts. Positive pressure also reduces dust buildup by ensuring most air enters through filtered intakes.",
        },
        {
          id: "rat-more-exhaust",
          text: "Adding more exhaust without intake fans worsens the negative pressure problem. The case needs cool air coming in, not more hot air being pulled out of an already starving system.",
        },
        {
          id: "rat-all-intake",
          text: "All intake fans with no exhaust creates extreme positive pressure and hot air stagnation around the CPU and GPU. A balanced approach with more intake than exhaust (2-3 intake, 1-2 exhaust) is optimal.",
        },
      ],
      correctRationaleId: "rat-positive",
      feedback: {
        perfect: "Perfect! Positive pressure airflow (more intake than exhaust) through filtered intakes is the gold standard for PC case cooling. This cools components and reduces dust ingress simultaneously.",
        partial: "You understand that airflow matters, but the direction and balance are critical. Think about where cool air enters and how hot air exits.",
        wrong: "That configuration would worsen the thermal situation. The core principle is: cool filtered air in the front, hot air out the rear and top.",
      },
    },
  ],
  hints: [
    "Large CPUs like Threadripper need more paste coverage (X pattern) because their dies extend across the full IHS surface.",
    "Always check CPU cooler height clearance against the case specification. A tower cooler that doesn't fit cannot be used, period.",
    "Positive pressure (more intake than exhaust) reduces dust buildup by forcing air to exit through filtered paths.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Thermal management separates good builds from great ones. In the field, properly cooled systems last longer, perform better, and cause fewer support tickets. Understanding airflow and TIM application is fundamental.",
  toolRelevance: [
    "Thermal paste (Arctic MX-4, Noctua NT-H1, etc.)",
    "99% isopropyl alcohol and lint-free wipes for cleaning",
    "HWiNFO64 for temperature monitoring",
    "Infrared thermometer for spot-checking case airflow",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
