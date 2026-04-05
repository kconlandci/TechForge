import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "hw-3d-printer-issues",
  version: 1,
  title: "3D Printer Troubleshooting",
  tier: "advanced",
  track: "hardware",
  difficulty: "challenging",
  accessLevel: "premium",
  tags: ["3D-printer", "FDM", "filament", "nozzle", "bed-adhesion", "troubleshooting"],
  description:
    "Diagnose common 3D printer (FDM) issues including poor bed adhesion, stringing, layer shifting, and clogged nozzles. Classify the defect type and apply the correct remediation.",
  estimatedMinutes: 20,
  learningObjectives: [
    "Identify common FDM 3D printing defects from visual symptoms",
    "Classify print failures by their mechanical or thermal root cause",
    "Apply correct calibration and maintenance procedures to resolve print issues",
  ],
  sortOrder: 318,
  status: "published",
  prerequisites: [],
  rendererType: "triage-remediate",
  scenarios: [
    {
      type: "triage-remediate",
      id: "3dp-1",
      title: "First Layer Won't Stick to Build Plate",
      description:
        "A prototyping lab's Prusa i3 MK3S+ FDM printer fails to print a first layer that adheres to the PEI build plate. PLA filament is being used. The first layer lines appear rounded on top rather than squished flat, and they peel up within the first few minutes of a print.",
      evidence: [
        {
          type: "observation",
          content: "First layer lines are cylindrical/round instead of flat and squished. The nozzle appears to be too far from the bed. Lines do not bond to each other or to the PEI surface.",
        },
        {
          type: "measurement",
          content: "Bed temperature: 60C (correct for PLA on PEI). Nozzle temperature: 210C (correct for PLA). A feeler gauge between the nozzle and bed measures 0.35mm gap. The recommended first layer gap for a 0.4mm nozzle is approximately 0.10-0.15mm.",
        },
        {
          type: "history",
          content: "The print bed was cleaned with isopropyl alcohol before the attempt. The printer was recently moved to a new table and may have been bumped during transport.",
        },
      ],
      classifications: [
        { id: "class-z-offset", label: "Z-offset too high (nozzle too far from bed)", description: "The first layer is being extruded too far from the build surface, preventing proper squish and adhesion." },
        { id: "class-temp", label: "Incorrect bed temperature", description: "The bed temperature is too low for proper PLA adhesion." },
        { id: "class-surface", label: "Contaminated build surface", description: "The PEI surface has oils or residue preventing adhesion." },
      ],
      correctClassificationId: "class-z-offset",
      remediations: [
        { id: "rem-z-cal", label: "Run Z-offset calibration (Live Z Adjust) and lower the nozzle closer to the bed", description: "Adjust the Z-offset until the first layer is properly squished (approximately 0.10-0.15mm gap)." },
        { id: "rem-heat-bed", label: "Increase bed temperature to 70C", description: "Raise the bed temperature for better PLA adhesion." },
        { id: "rem-clean", label: "Clean the bed with acetone for deep cleaning", description: "Use acetone to remove any contamination from the PEI surface." },
      ],
      correctRemediationId: "rem-z-cal",
      rationales: [
        {
          id: "rat-z",
          text: "The feeler gauge confirms a 0.35mm gap versus the required 0.10-0.15mm. The nozzle is too far from the bed for the first layer to squish properly. Moving the printer likely shifted the Z-offset calibration. Running Live Z Adjust to bring the nozzle closer will produce the flat, well-adhered first layer lines needed for successful prints.",
        },
        {
          id: "rat-temp",
          text: "60C is the standard and correct PLA bed temperature for PEI sheets. The temperature is not the issue when the physical gap measurement clearly shows the nozzle is too high.",
        },
      ],
      correctRationaleId: "rat-z",
      feedback: {
        perfect: "Correct! The 0.35mm gap measurement directly identifies the problem - Z-offset calibration. This is the most common issue after moving a printer. Live Z Adjust is the correct fix.",
        partial: "Look at the measurements more carefully. The gap between nozzle and bed tells you exactly what needs adjustment.",
        wrong: "The feeler gauge measurement is the key evidence. When the nozzle is too far from the bed, no amount of temperature or surface treatment will fix the adhesion.",
      },
    },
    {
      type: "triage-remediate",
      id: "3dp-2",
      title: "Layer Shifting Mid-Print",
      description:
        "An engineering lab's Creality Ender 3 V2 produces parts with visible layer shifts. At a random point during a multi-hour print, all subsequent layers shift approximately 5mm in the X-axis direction. The bottom portion of the print is dimensionally accurate.",
      evidence: [
        {
          type: "defect",
          content: "Horizontal layer shift of approximately 5mm in the X direction. The shift happens once at a random layer height (different each time) and all subsequent layers continue at the offset position. Y-axis is unaffected.",
        },
        {
          type: "mechanical",
          content: "The X-axis belt tension is loose - it deflects significantly when pressed with a finger. The set screws on the X-axis stepper motor pulley are finger-tight but not properly secured with an Allen wrench. No grinding noises are heard during printing.",
        },
        {
          type: "electrical",
          content: "The stepper motor driver current (Vref) for the X-axis reads 0.58V (appropriate for this motor). All cable connections to the X-axis motor are secure.",
        },
      ],
      classifications: [
        { id: "class-belt", label: "Loose X-axis belt and pulley", description: "The loose belt and unsecured pulley set screws allow the X-axis to skip position under acceleration." },
        { id: "class-driver", label: "Overheating stepper driver", description: "The X-axis stepper driver is overheating and missing steps." },
        { id: "class-slicer", label: "Slicer software error", description: "The slicing software generated bad G-code with an offset." },
      ],
      correctClassificationId: "class-belt",
      remediations: [
        { id: "rem-belt", label: "Tighten X-axis belt and secure pulley set screws with threadlocker", description: "Tension the X-axis belt until it produces a low twang when plucked, and secure both grub screws on the motor pulley with blue threadlocker." },
        { id: "rem-driver", label: "Add heatsinks to the stepper drivers", description: "Apply aluminum heatsinks to the stepper driver chips on the mainboard." },
        { id: "rem-reslice", label: "Re-slice the model with different settings", description: "Generate new G-code from the slicer software." },
      ],
      correctRemediationId: "rem-belt",
      rationales: [
        {
          id: "rat-belt",
          text: "A loose belt allows the carriage to skip position during rapid acceleration moves. Unsecured pulley set screws can slip on the motor shaft, causing a permanent position offset. The shift happening only on the X-axis, at random layers, and as a single-event offset (not gradual) is consistent with a mechanical skip. Tightening the belt and securing the pulley fixes the root cause.",
        },
        {
          id: "rat-driver",
          text: "The Vref reading of 0.58V is within normal range and no overheating symptoms (thermal shutdown would cause repeated shifts, not a single one) are present. The driver is functioning correctly.",
        },
      ],
      correctRationaleId: "rat-belt",
      feedback: {
        perfect: "Correct! A single-axis layer shift that happens once and persists is the hallmark of a belt skip or pulley slip. Securing the mechanical components eliminates this common issue.",
        partial: "The axis-specific nature and single-event pattern of the shift point to a mechanical cause. Check the physical components on the affected axis.",
        wrong: "Layer shifts that affect only one axis and occur as a single event are almost always mechanical. The belt and pulley inspection reveals the cause directly.",
      },
    },
    {
      type: "triage-remediate",
      id: "3dp-3",
      title: "Under-Extrusion and Grinding Sounds",
      description:
        "A design studio's Prusa Mini+ printer produces prints with visible gaps between extrusion lines and thin, weak walls. A clicking/grinding sound comes from the extruder gear during printing. The issue has worsened gradually over the past two weeks.",
      evidence: [
        {
          type: "defect",
          content: "Visible gaps between extrusion lines on walls. Infill is sparse and stringy. Top surfaces have holes where layers should be solid. Parts are fragile and break easily along layer lines.",
        },
        {
          type: "audio",
          content: "Regular clicking/grinding sound from the extruder during extrusion. The sound is the extruder gear skipping against the filament. The filament shows gear bite marks but is not feeding smoothly.",
        },
        {
          type: "inspection",
          content: "Removing the filament reveals the nozzle produces only a thin, inconsistent stream when manually pushing filament through. The nozzle has been in use for 6 months of daily printing with PLA. The Bowden tube coupler appears secure.",
        },
      ],
      classifications: [
        { id: "class-clog", label: "Partially clogged nozzle", description: "Carbonized filament residue has partially blocked the nozzle opening, restricting flow and causing the extruder to skip." },
        { id: "class-extruder", label: "Worn extruder gear", description: "The extruder drive gear teeth are worn smooth and cannot grip filament." },
        { id: "class-temp", label: "Nozzle temperature too low", description: "The filament is not melting sufficiently for proper extrusion." },
      ],
      correctClassificationId: "class-clog",
      remediations: [
        { id: "rem-nozzle", label: "Replace the nozzle and perform a cold pull to clear any residue in the heatbreak", description: "Install a new brass nozzle and use the cold pull method to clean the melt zone." },
        { id: "rem-gear", label: "Replace the extruder drive gear", description: "Install a new hardened steel drive gear." },
        { id: "rem-temp", label: "Increase nozzle temperature by 10C", description: "Raise the print temperature for better flow." },
      ],
      correctRemediationId: "rem-nozzle",
      rationales: [
        {
          id: "rat-clog",
          text: "After 6 months of daily PLA printing, carbonized residue accumulates inside the nozzle, gradually narrowing the bore. The thin, inconsistent manual extrusion test confirms restricted flow. The extruder grinding is a secondary symptom - the gear is trying to push filament through a partially blocked nozzle. Replacing the nozzle and doing a cold pull clears the entire melt path.",
        },
        {
          id: "rat-gear",
          text: "While the gear is grinding, this is caused by backpressure from the clogged nozzle, not worn gear teeth. The manual push test showing restricted flow at the nozzle confirms the blockage is downstream of the extruder.",
        },
      ],
      correctRationaleId: "rat-clog",
      feedback: {
        perfect: "Correct! The manual extrusion test showing restricted flow at the nozzle is the key diagnostic. Extruder grinding is a symptom of the clog, not the cause. Nozzle replacement after months of use is routine maintenance.",
        partial: "The extruder grinding is a symptom, not the root cause. Look at where the flow restriction was actually measured.",
        wrong: "The manual push test localized the flow restriction to the nozzle. Always test flow at the nozzle before blaming the extruder mechanism.",
      },
    },
  ],
  hints: [
    "The manual push test (pushing filament by hand through a heated nozzle) tells you whether the restriction is in the extruder or the hot end.",
    "Single-event layer shifts on one axis are almost always mechanical: check belt tension and pulley set screws on the affected axis.",
    "First layer adhesion problems: use a feeler gauge to verify the nozzle-to-bed gap. The gap should be roughly 0.10-0.15mm for a 0.4mm nozzle.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "3D printing is increasingly used in IT for creating custom brackets, enclosures, and prototypes. Understanding FDM printer maintenance and troubleshooting adds a valuable skill to any hardware technician's toolkit.",
  toolRelevance: [
    "Feeler gauges for Z-offset calibration",
    "Allen wrenches for mechanical adjustments",
    "Acupuncture needles for nozzle cleaning",
    "Digital calipers for dimensional verification",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
