import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "mobile-screen-replacement",
  version: 1,
  title: "Choose the Correct Approach for Cracked Screen Repair",
  tier: "beginner",
  track: "mobile-devices",
  difficulty: "easy",
  accessLevel: "free",
  tags: ["screen-repair", "hardware", "lcd", "digitizer", "mobile"],
  description:
    "A customer brings in a phone with a cracked screen. Determine whether the LCD, digitizer, or both are damaged and choose the correct repair path based on symptoms and device type.",
  estimatedMinutes: 12,
  learningObjectives: [
    "Distinguish between LCD damage and digitizer damage based on visual symptoms",
    "Determine when a full display assembly replacement is required versus component-level repair",
    "Identify proper ESD precautions and repair workspace requirements",
    "Select the correct replacement part based on device model and damage type",
  ],
  sortOrder: 101,
  status: "published",
  prerequisites: [],
  rendererType: "action-rationale",
  scenarios: [
    {
      id: "sr-scenario-1",
      type: "action-rationale",
      title: "Assessing the Damage",
      context:
        "A customer brings in an iPhone 14 that was dropped face-down on concrete. The glass has a spider-web crack pattern across the top half. The display still shows an image clearly with accurate colors beneath the cracks. Touch works perfectly on the bottom half but does not respond at all on the top half where the cracks are concentrated. There is no discoloration, bleeding, or black spots on the display.",
      actions: [
        {
          id: "sr1-replace-lcd",
          label: "Replace only the LCD panel",
          color: "blue",
        },
        {
          id: "sr1-replace-digitizer",
          label: "Order a digitizer-only replacement since only touch is affected",
          color: "orange",
        },
        {
          id: "sr1-replace-assembly",
          label: "Replace the full display assembly since iPhone uses fused display units",
          color: "green",
        },
        {
          id: "sr1-screen-protector",
          label: "Apply a screen protector over the cracks to restore touch functionality",
          color: "red",
        },
      ],
      correctActionId: "sr1-replace-assembly",
      rationales: [
        {
          id: "sr1-r1",
          text: "The LCD is functioning correctly since colors are accurate and there are no black spots or bleeding. The damage is to the digitizer layer. However, iPhones use fused OLED display assemblies where the digitizer cannot be separated from the display panel in standard repair.",
        },
        {
          id: "sr1-r2",
          text: "While only the digitizer appears damaged, iPhone 14 uses a fused display assembly. Attempting to separate the digitizer from the OLED panel requires specialized equipment and risks destroying the display. Standard repair procedure is full assembly replacement.",
        },
        {
          id: "sr1-r3",
          text: "A screen protector cannot restore digitizer functionality on a cracked screen. The touch sensor grid is physically broken.",
        },
      ],
      correctRationaleId: "sr1-r2",
      feedback: {
        perfect:
          "Correct. Modern iPhones use fused display assemblies. Even when only the digitizer is damaged, the standard repair is full assembly replacement because the layers cannot be safely separated.",
        partial:
          "You correctly identified the digitizer as the damaged component, but iPhone displays are fused units requiring full assembly replacement.",
        wrong: "That approach will not resolve the touch input failure. A physical repair is needed.",
      },
    },
    {
      id: "sr-scenario-2",
      type: "action-rationale",
      title: "Pre-Repair Safety and Preparation",
      context:
        "You have the replacement display assembly ready for the iPhone 14. Your repair bench has a heat gun, suction cups, spudgers, pentalobe and tri-point screwdrivers, and an ESD mat. The customer says they need the phone back in 30 minutes and asks you to skip the 'unnecessary steps' to speed things up. The phone battery is at 78%.",
      actions: [
        {
          id: "sr2-skip-esd",
          label: "Skip the ESD mat to save time since the customer is in a rush",
          color: "red",
        },
        {
          id: "sr2-power-off-esd",
          label: "Power off the device, ground yourself on the ESD mat, and disconnect the battery connector before beginning disassembly",
          color: "green",
        },
        {
          id: "sr2-drain-battery",
          label: "Drain the battery to 0% before starting the repair",
          color: "orange",
        },
        {
          id: "sr2-start-immediately",
          label: "Begin heating the screen edges immediately while the phone is still on",
          color: "blue",
        },
      ],
      correctActionId: "sr2-power-off-esd",
      rationales: [
        {
          id: "sr2-r1",
          text: "Skipping ESD protection risks static discharge that can destroy sensitive components like the logic board. Customer convenience never overrides safety protocols.",
        },
        {
          id: "sr2-r2",
          text: "Powering off the device and disconnecting the battery connector prevents short circuits during disassembly. Using the ESD mat protects components from static damage. These are mandatory safety steps for any mobile device repair.",
        },
        {
          id: "sr2-r3",
          text: "Draining to 0% is unnecessary and wastes time. Powering off and disconnecting the battery cable is sufficient. Lithium batteries should not be fully drained as it can damage battery health.",
        },
        {
          id: "sr2-r4",
          text: "Working on a powered device risks short circuits when prying near ribbon cables and connectors. The heat gun near a powered lithium battery is a fire hazard.",
        },
      ],
      correctRationaleId: "sr2-r2",
      feedback: {
        perfect:
          "Correct. Power off, ESD grounding, and battery disconnection are non-negotiable safety steps. Never skip safety protocols regardless of time pressure.",
        partial:
          "Draining the battery is unnecessary and actually harmful to lithium batteries. Simply powering off and disconnecting the battery connector is the correct procedure.",
        wrong: "Working on powered devices or skipping ESD precautions risks component damage and personal safety. Never compromise on repair safety.",
      },
    },
    {
      id: "sr-scenario-3",
      type: "action-rationale",
      title: "Post-Repair Verification",
      context:
        "You have completed the screen replacement. The new display powers on and shows a clear image. Before returning the phone to the customer, you need to verify the repair is complete. You notice the display appears slightly brighter than the original at the same brightness setting, and True Tone is showing as unavailable in Display settings.",
      actions: [
        {
          id: "sr3-return-phone",
          label: "Return the phone to the customer since the display works",
          color: "orange",
        },
        {
          id: "sr3-run-diagnostics",
          label: "Run full touch grid test, check Face ID, test True Tone calibration data transfer, and verify all sensors before returning",
          color: "green",
        },
        {
          id: "sr3-recalibrate-brightness",
          label: "Manually adjust the brightness to match the original screen",
          color: "blue",
        },
        {
          id: "sr3-reinstall-old-screen",
          label: "Reinstall the old cracked screen since True Tone doesn't work on the new one",
          color: "red",
        },
      ],
      correctActionId: "sr3-run-diagnostics",
      rationales: [
        {
          id: "sr3-r1",
          text: "A display showing an image is only partial verification. True Tone requires transferring the ambient light sensor calibration data from the old screen's serialized chip. Face ID, touch responsiveness across the entire grid, proximity sensor, and ambient light sensor all need verification after screen replacement.",
        },
        {
          id: "sr3-r2",
          text: "Adjusting brightness manually does not fix the True Tone issue, which requires serialized component data transfer.",
        },
        {
          id: "sr3-r3",
          text: "Reinstalling the cracked screen is not a solution. True Tone can be restored by transferring the sensor calibration data from the original screen's flex cable.",
        },
      ],
      correctRationaleId: "sr3-r1",
      feedback: {
        perfect:
          "Excellent. Full post-repair verification including True Tone data transfer, Face ID, touch grid testing, and sensor checks is essential before returning the device to the customer.",
        partial:
          "Returning without full verification risks the customer discovering issues later. Always perform comprehensive post-repair testing.",
        wrong: "That approach leaves multiple potential issues unchecked. Professional repair requires thorough verification.",
      },
    },
  ],
  hints: [
    "On modern smartphones, look for whether the display still shows a clear image to determine if the LCD/OLED is damaged versus the digitizer.",
    "Most modern smartphones use fused display assemblies where the glass, digitizer, and display panel are bonded together.",
    "After screen replacement, always verify True Tone, Face ID, touch responsiveness, and all sensors before returning the device.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Screen replacement is the most common physical repair in mobile device support. Understanding fused display assemblies, proper ESD handling, and post-repair verification separates professional technicians from amateurs.",
  toolRelevance: [
    "Pentalobe Screwdriver",
    "Tri-point Screwdriver",
    "Heat Gun / iOpener",
    "Suction Cup and Spudger",
    "ESD Mat and Wrist Strap",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
