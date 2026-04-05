import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "hw-laser-printer-maint",
  version: 1,
  title: "Laser Printer Print Quality Issues",
  tier: "intermediate",
  track: "hardware",
  difficulty: "moderate",
  accessLevel: "free",
  tags: ["laser-printer", "toner", "fuser", "drum", "print-quality", "maintenance"],
  description:
    "Diagnose laser printer print quality defects including streaks, ghosting, and faded output. Identify which component in the laser printing process is causing each defect.",
  estimatedMinutes: 18,
  learningObjectives: [
    "Identify the laser printing process stages: charging, exposing, developing, transferring, fusing",
    "Match specific print defects to their root cause components",
    "Recommend the correct replacement part or maintenance action for each defect",
  ],
  sortOrder: 311,
  status: "published",
  prerequisites: [],
  rendererType: "triage-remediate",
  scenarios: [
    {
      type: "triage-remediate",
      id: "laser-1",
      title: "Repetitive Ghost Images on Pages",
      description:
        "An HP LaserJet Enterprise M507 prints a faint ghost image of the previous page on every subsequent page. The ghost appears at a regular interval of about 3.75 inches apart. Print density is otherwise normal.",
      evidence: [
        {
          type: "defect",
          content: "A faint but readable ghost of text or images from the previous page appears on the current page. The ghost repeats at approximately 3.75-inch intervals (the circumference of the photosensitive drum).",
        },
        {
          type: "component-age",
          content: "The toner cartridge was replaced recently (500 pages ago). The drum unit has printed 48,000 pages (rated life: 50,000 pages). The fuser kit was replaced 20,000 pages ago.",
        },
      ],
      classifications: [
        { id: "class-drum", label: "Worn photosensitive drum", description: "The drum's photosensitive coating is degraded and not fully discharging between pages, retaining the previous image." },
        { id: "class-toner", label: "Defective toner cartridge", description: "The new toner cartridge is distributing toner unevenly." },
        { id: "class-fuser", label: "Failing fuser assembly", description: "The fuser is not properly bonding toner to the page." },
      ],
      correctClassificationId: "class-drum",
      remediations: [
        { id: "rem-drum", label: "Replace the drum unit", description: "Install a new imaging drum to restore proper charge cycling." },
        { id: "rem-toner", label: "Replace the toner cartridge", description: "Install a different toner cartridge." },
        { id: "rem-fuser", label: "Replace the fuser kit", description: "Install a new fuser assembly." },
      ],
      correctRemediationId: "rem-drum",
      rationales: [
        {
          id: "rat-drum",
          text: "Ghost images repeating at the drum's circumference interval (3.75 inches) directly indicate the drum is not fully discharging between rotations. At 48,000 pages near its 50,000-page rated life, the photosensitive coating is worn. Replacing the drum resolves ghosting.",
        },
        {
          id: "rat-toner",
          text: "The toner cartridge is only 500 pages old. Toner issues typically manifest as faded output, uneven density, or speckling - not ghost images at the drum's rotation interval.",
        },
      ],
      correctRationaleId: "rat-drum",
      feedback: {
        perfect: "Exactly right! Ghost images at the drum rotation interval are the classic symptom of a worn drum. The page count near end-of-life confirms the diagnosis.",
        partial: "The repetition interval is the key clue. Each printer component has a different circumference. Match the defect interval to the component.",
        wrong: "Ghost images at regular intervals are not caused by that component. Learn the circumference of each laser printer component to match defects to causes.",
      },
    },
    {
      type: "triage-remediate",
      id: "laser-2",
      title: "Toner Smears When Touched",
      description:
        "Users report that printed pages from a Brother HL-L6200DW smear when touched or rubbed. The toner appears to sit on top of the paper rather than being bonded to it. The printer is 4 years old with moderate usage.",
      evidence: [
        {
          type: "defect",
          content: "Freshly printed pages smear when fingers rub across the text. Black toner transfers to fingers. The print itself looks normal in terms of density and alignment before touching.",
        },
        {
          type: "test",
          content: "A fuser test page printed from the printer's menu also smears. The paper exiting the printer is barely warm to the touch. The fuser has printed 125,000 pages (rated at 100,000).",
        },
      ],
      classifications: [
        { id: "class-fuser", label: "Failed/worn fuser assembly", description: "The fuser is not reaching sufficient temperature to bond toner to the paper." },
        { id: "class-toner", label: "Low-quality or wrong toner", description: "The toner formulation is incompatible with this printer's fuser temperature." },
        { id: "class-paper", label: "Incompatible paper type", description: "The paper surface is too smooth for toner adhesion." },
      ],
      correctClassificationId: "class-fuser",
      remediations: [
        { id: "rem-fuser", label: "Replace the fuser assembly", description: "Install a new fuser kit to restore proper heat bonding of toner to paper." },
        { id: "rem-toner", label: "Try a different toner cartridge brand", description: "Replace with OEM toner to ensure compatibility." },
        { id: "rem-paper", label: "Switch to laser-compatible paper", description: "Use paper rated for laser printers with proper surface texture." },
      ],
      correctRemediationId: "rem-fuser",
      rationales: [
        {
          id: "rat-fuser",
          text: "The fuser uses heat and pressure to bond toner to paper. At 125,000 pages (25% beyond its 100,000-page rated life), the heating element or pressure roller is worn. The barely warm paper exiting the printer confirms the fuser is not reaching the required temperature (typically 200C/392F). Replacing the fuser restores proper bonding.",
        },
        {
          id: "rat-toner",
          text: "Toner smearing is about the fusing process, not the toner itself. The print density looks normal, meaning toner is being applied correctly - it just isn't being bonded to the paper by heat.",
        },
      ],
      correctRationaleId: "rat-fuser",
      feedback: {
        perfect: "Correct! Toner that smears means the fuser is failing to bond it to the paper. The page count exceeding the fuser's rated life and lukewarm output confirm the diagnosis.",
        partial: "The smearing symptom is specifically about one stage of the laser printing process. Think about what bonds toner to paper.",
        wrong: "Toner smearing is directly related to the fusing stage. The fuser applies heat and pressure to permanently bond toner particles to the paper surface.",
      },
    },
    {
      type: "triage-remediate",
      id: "laser-3",
      title: "Vertical Black Lines Down Every Page",
      description:
        "A Canon imageRUNNER printer produces a thin black line running vertically down every page from top to bottom. The line appears in the same position regardless of what is being printed. It appears on both single-sided and duplex prints.",
      evidence: [
        {
          type: "defect",
          content: "A continuous thin black line runs from the top to the bottom of every page, approximately 2 inches from the left edge. The line is present even on blank test pages.",
        },
        {
          type: "inspection",
          content: "Removing the toner cartridge and examining the drum reveals a fine scratch running along the drum surface in the direction of rotation. The scratch is visible under a flashlight and located 2 inches from the drum edge.",
        },
      ],
      classifications: [
        { id: "class-scratch", label: "Scratched drum surface", description: "A physical scratch on the drum creates a line of toner deposit on every page." },
        { id: "class-blade", label: "Damaged wiper blade", description: "The cleaning blade has a nick that allows a line of residual toner to pass." },
        { id: "class-corona", label: "Dirty primary charge corona wire", description: "Debris on the corona wire is affecting the charge distribution." },
      ],
      correctClassificationId: "class-scratch",
      remediations: [
        { id: "rem-cartridge", label: "Replace the toner cartridge/drum unit", description: "Install a new cartridge with a fresh drum to eliminate the scratch." },
        { id: "rem-clean-blade", label: "Clean or replace the wiper blade", description: "Remove and clean the cleaning blade assembly." },
        { id: "rem-clean-corona", label: "Clean the primary charge corona wire", description: "Gently clean the corona wire with the built-in cleaning tool." },
      ],
      correctRemediationId: "rem-cartridge",
      rationales: [
        {
          id: "rat-scratch",
          text: "A physical scratch on the drum prevents the photosensitive surface from holding a proper charge at that point, causing toner to deposit in a continuous line. Since the drum is part of the toner cartridge assembly in this printer, replacing the cartridge installs a new, undamaged drum.",
        },
        {
          id: "rat-blade",
          text: "A damaged wiper blade would leave toner residue, but the physical inspection confirmed the scratch is on the drum itself. The drum scratch is the primary defect.",
        },
      ],
      correctRationaleId: "rat-scratch",
      feedback: {
        perfect: "Correct! A scratched drum creates a continuous vertical line at the same position on every page. Replacing the cartridge/drum assembly is the only fix for physical drum damage.",
        partial: "You're on the right track - the defect is in the imaging path. But the physical inspection reveals the specific damaged component.",
        wrong: "The physical inspection identified the cause directly. A visible scratch on the drum surface corresponds exactly to the line position on the printed page.",
      },
    },
  ],
  hints: [
    "Each laser printer component has a specific circumference. Repeating defects at regular intervals match the component whose size equals that interval.",
    "The fuser bonds toner to paper using heat (about 200C). If toner smears when touched, the fuser is the likely culprit.",
    "Vertical lines that appear in the same position on every page indicate a physical defect on the drum or a component in the paper path.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Laser printer maintenance is a heavily tested topic on the CompTIA A+ exam. In the field, print quality defect diagnosis saves the cost of unnecessary part replacements.",
  toolRelevance: [
    "Printer configuration/test pages",
    "Maintenance kit (fuser, rollers, drum)",
    "Laser printer cleaning supplies",
    "Manufacturer defect reference guides",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
