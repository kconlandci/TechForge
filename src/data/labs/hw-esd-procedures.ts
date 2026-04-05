import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "hw-esd-procedures",
  version: 1,
  title: "ESD Safety Procedures for Hardware Work",
  tier: "advanced",
  track: "hardware",
  difficulty: "challenging",
  accessLevel: "premium",
  tags: ["ESD", "electrostatic-discharge", "grounding", "anti-static", "safety", "components"],
  description:
    "Configure proper ESD safety procedures for different hardware handling scenarios. Set the correct grounding, storage, and handling practices to prevent electrostatic damage to sensitive components.",
  estimatedMinutes: 15,
  learningObjectives: [
    "Identify which computer components are most vulnerable to ESD damage",
    "Apply proper grounding techniques using wrist straps and ESD mats",
    "Implement correct ESD-safe storage and transport procedures for components",
  ],
  sortOrder: 316,
  status: "published",
  prerequisites: [],
  rendererType: "toggle-config",
  scenarios: [
    {
      type: "toggle-config",
      id: "esd-1",
      title: "Workbench Setup for RAM Installation",
      description:
        "A technician is setting up a workstation to install RAM modules into 10 desktop PCs. The work will take several hours. Configure the ESD-safe workspace correctly.",
      targetSystem: "Hardware Technician Workbench",
      items: [
        {
          id: "wrist-strap",
          label: "Anti-Static Wrist Strap",
          detail: "Wrist strap connection for continuous grounding while handling components",
          currentState: "Not worn",
          correctState: "Worn and clipped to grounded ESD mat",
          states: ["Not worn", "Worn and clipped to grounded ESD mat", "Worn but unclipped (loose)", "Clipped to painted case panel"],
          rationaleId: "rat-strap",
        },
        {
          id: "work-surface",
          label: "Work Surface",
          detail: "The surface where components will be placed during installation",
          currentState: "Carpeted desk surface",
          correctState: "Grounded ESD mat",
          states: ["Carpeted desk surface", "Grounded ESD mat", "Bare metal desk", "Wooden table"],
          rationaleId: "rat-mat",
        },
        {
          id: "ram-handling",
          label: "RAM Module Handling",
          detail: "How the RAM modules are stored before installation",
          currentState: "Loose in a cardboard box",
          correctState: "In anti-static bags until ready to install",
          states: ["Loose in a cardboard box", "In anti-static bags until ready to install", "On a regular plastic bag", "Stacked on top of each other on the desk"],
          rationaleId: "rat-bag",
        },
      ],
      rationales: [
        {
          id: "rat-strap",
          text: "The wrist strap must be worn snugly on bare skin and clipped to the grounded ESD mat or a known-good earth ground. This equalizes the technician's charge with the ground, preventing static discharge into components. An unclipped strap provides zero protection.",
        },
        {
          id: "rat-mat",
          text: "A grounded ESD mat dissipates static charge at a controlled rate. Carpet generates static through triboelectric charging. Bare metal can cause instantaneous discharge. The mat's controlled resistance (1 megohm) safely drains charge without risking the components.",
        },
        {
          id: "rat-bag",
          text: "Anti-static bags are designed to shield components from external static fields. Regular plastic bags can actually generate static. Components should remain in anti-static bags until the moment they are ready to be installed.",
        },
      ],
      feedback: {
        perfect: "Excellent! Proper ESD workbench setup: grounded wrist strap, ESD mat, and anti-static storage. These three elements form the foundation of safe hardware handling.",
        partial: "Some procedures are correct but ESD protection requires all elements working together. A single gap in the chain can cause damage.",
        wrong: "Several ESD safety practices are incorrect. Review the fundamentals: continuous grounding, ESD-safe surfaces, and proper component storage.",
      },
    },
    {
      type: "toggle-config",
      id: "esd-2",
      title: "Field Service Call - No ESD Mat Available",
      description:
        "A technician is on a field service call to replace a motherboard at a client's office. No ESD mat is available. The office has carpeted floors. Configure the best available ESD practices for field conditions.",
      targetSystem: "Field Service Hardware Replacement",
      items: [
        {
          id: "strap-ground",
          label: "Wrist Strap Ground Point",
          detail: "Where to clip the wrist strap when no ESD mat is available",
          currentState: "Don't use wrist strap (no mat available)",
          correctState: "Clip to unpainted metal on the PC chassis (plugged in but powered off)",
          states: ["Don't use wrist strap (no mat available)", "Clip to unpainted metal on the PC chassis (plugged in but powered off)", "Clip to the wooden desk", "Hold the strap clip in your hand"],
          rationaleId: "rat-chassis",
        },
        {
          id: "component-surface",
          label: "Component Staging Surface",
          detail: "Where to place the new motherboard while preparing the case",
          currentState: "On the carpet next to the desk",
          correctState: "On top of the anti-static bag it shipped in",
          states: ["On the carpet next to the desk", "On top of the anti-static bag it shipped in", "Directly on the metal desk surface", "On a regular plastic bag from a store"],
          rationaleId: "rat-surface",
        },
        {
          id: "self-grounding",
          label: "Self-Grounding Practice",
          detail: "Additional grounding practice when working on carpeted floors",
          currentState: "No additional precautions needed",
          correctState: "Touch unpainted metal on the case frequently to equalize charge",
          states: ["No additional precautions needed", "Touch unpainted metal on the case frequently to equalize charge", "Spray carpet with water to reduce static", "Wear rubber-soled shoes for insulation"],
          rationaleId: "rat-touch",
        },
      ],
      rationales: [
        {
          id: "rat-chassis",
          text: "When no ESD mat is available, the PC chassis serves as a ground reference. With the PC plugged in (but powered off), the chassis is connected to earth ground through the power cord's ground pin. Clipping the wrist strap to unpainted metal on the chassis grounds the technician.",
        },
        {
          id: "rat-surface",
          text: "The anti-static bag the component shipped in can serve as a temporary anti-static surface for staging. While not as effective as an ESD mat, it is far better than carpet, plastic, or bare metal. Note: components should be placed ON TOP of anti-static bags, not inside them for this purpose.",
        },
        {
          id: "rat-touch",
          text: "On carpeted floors, charge builds rapidly when moving. Frequently touching unpainted metal on the grounded chassis equalizes any charge that has accumulated. This is a critical supplementary practice even when wearing a wrist strap.",
        },
      ],
      feedback: {
        perfect: "Great adaptation! You applied ESD best practices to field conditions: using the chassis as ground, anti-static bags as temporary surfaces, and frequent self-grounding. Real technicians face these situations daily.",
        partial: "Some field adaptations are correct. Remember: the PC chassis (plugged in, powered off) provides a reliable ground point, and anti-static bags double as temporary work surfaces.",
        wrong: "These practices put components at risk. Even in the field without ideal equipment, ESD protection is achievable using the chassis ground and anti-static bags.",
      },
    },
    {
      type: "toggle-config",
      id: "esd-3",
      title: "Component Shipping and Storage",
      description:
        "A company is shipping surplus motherboards, RAM, and GPUs to a remote office. Configure the correct packaging and storage procedures to prevent ESD damage during transport.",
      targetSystem: "IT Asset Shipping Preparation",
      items: [
        {
          id: "mobo-pack",
          label: "Motherboard Packaging",
          detail: "How to package motherboards for shipping",
          currentState: "Wrap in bubble wrap only",
          correctState: "Place in anti-static bag, then cushion with anti-static foam in a box",
          states: ["Wrap in bubble wrap only", "Place in anti-static bag, then cushion with anti-static foam in a box", "Place directly in a cardboard box with newspaper", "Wrap in regular plastic wrap"],
          rationaleId: "rat-mobo",
        },
        {
          id: "ram-pack",
          label: "RAM Module Packaging",
          detail: "How to package RAM sticks for shipping",
          currentState: "Place all sticks in one anti-static bag together",
          correctState: "Each stick in its own anti-static bag inside a padded container",
          states: ["Place all sticks in one anti-static bag together", "Each stick in its own anti-static bag inside a padded container", "Wrap in aluminum foil", "Place in regular ziplock bags with foam"],
          rationaleId: "rat-ram",
        },
        {
          id: "humidity",
          label: "Storage Environment",
          detail: "Environmental consideration for long-term component storage",
          currentState: "No environmental controls needed",
          correctState: "Store in climate-controlled room (40-60% relative humidity)",
          states: ["No environmental controls needed", "Store in climate-controlled room (40-60% relative humidity)", "Store in maximum humidity to prevent static", "Store in sealed airtight containers"],
          rationaleId: "rat-humidity",
        },
      ],
      rationales: [
        {
          id: "rat-mobo",
          text: "Anti-static bags create a Faraday cage that shields the board from external static fields. Anti-static foam provides cushioning without generating triboelectric charge like regular bubble wrap or packing materials can. Regular bubble wrap can generate significant static through friction during shipping.",
        },
        {
          id: "rat-ram",
          text: "Individual anti-static bags prevent RAM modules from shorting against each other's exposed contacts during transit. Modules in a single bag can shift and contact each other's gold pins, potentially causing physical damage or charge transfer between modules.",
        },
        {
          id: "rat-humidity",
          text: "Moderate humidity (40-60% RH) reduces static charge generation while avoiding condensation. Very low humidity increases ESD risk dramatically, while very high humidity can cause corrosion on exposed contacts and connectors.",
        },
      ],
      feedback: {
        perfect: "Perfect! Correct shipping procedures: anti-static bags with individual packaging, anti-static cushioning, and climate-controlled storage. These practices prevent damage across thousands of dollars in hardware.",
        partial: "Some packaging choices are good, but every step in the chain matters. One gap in ESD protection during shipping can damage components that worked fine in the lab.",
        wrong: "These packaging methods will likely damage sensitive components during shipping. Anti-static bags and proper cushioning are not optional for hardware transport.",
      },
    },
  ],
  hints: [
    "A wrist strap must be connected to a ground point to work. An unclipped or loose strap provides zero ESD protection.",
    "Anti-static bags shield from external static. Regular plastic bags generate static through friction. They are not interchangeable.",
    "In field situations, the PC chassis (plugged in but off) serves as an earth ground through the power cord's ground pin.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "ESD damage costs the electronics industry billions annually. Most ESD damage is latent - the component works initially but fails weeks later. Proper ESD procedures are a non-negotiable professional standard.",
  toolRelevance: [
    "Anti-static wrist strap",
    "ESD mat with grounding cable",
    "Anti-static bags and foam",
    "ESD-safe tools and storage containers",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
