import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "mobile-display-calibration",
  version: 1,
  title: "Diagnose Display Issues After a Drop - LCD vs Digitizer",
  tier: "advanced",
  track: "mobile-devices",
  difficulty: "challenging",
  accessLevel: "premium",
  tags: ["display", "lcd", "digitizer", "hardware", "diagnosis", "repair"],
  description:
    "A phone was dropped and now has display problems. Investigate the symptoms to determine whether the LCD, digitizer, backlight, or display connector is damaged and decide on the correct repair path.",
  estimatedMinutes: 22,
  learningObjectives: [
    "Distinguish between LCD, OLED, digitizer, and backlight failures based on visual symptoms",
    "Use diagnostic patterns to identify connector damage versus panel damage",
    "Determine the correct replacement component based on symptom analysis",
    "Identify when symptoms indicate logic board damage rather than display damage",
  ],
  sortOrder: 113,
  status: "published",
  prerequisites: [],
  rendererType: "investigate-decide",
  scenarios: [
    {
      id: "dc-scenario-1",
      type: "investigate-decide",
      title: "Partial Display Failure After Drop",
      objective:
        "A Pixel 7 Pro was dropped on its corner. The user says the screen looks 'broken' but can still use some parts of it. Investigate the display symptoms to determine the damaged component.",
      investigationData: [
        {
          id: "dc1-visual",
          label: "Visual Display Symptoms",
          content:
            "The top third of the screen displays normally with accurate colors and sharp text. The bottom two-thirds shows a black area with no image at all. There is a thin green horizontal line at the boundary between the working and non-working areas. The glass is not cracked anywhere on the screen. The phone body has a dent on the lower-left corner.",
          isCritical: true,
        },
        {
          id: "dc1-touch",
          label: "Touch Input Testing",
          content:
            "Touch input works correctly on the top third where the image is displayed. Interestingly, touch also works on the black lower area - tapping where keyboard keys should be produces haptic feedback and characters appear in the text field visible in the top third. This confirms the digitizer is functional across the entire screen.",
          isCritical: true,
        },
        {
          id: "dc1-flashlight",
          label: "Flashlight Test on Black Area",
          content:
            "Shining a bright flashlight at the black area at an angle does not reveal any faint image. The area is completely black with no ghost image visible. The green line flickers occasionally when the phone is gently flexed.",
          isCritical: true,
        },
      ],
      actions: [
        {
          id: "dc1-replace-digitizer",
          label: "Replace only the digitizer since the bottom area looks damaged",
          color: "red",
        },
        {
          id: "dc1-replace-oled",
          label: "Replace the OLED display panel, as the impact damaged the organic layer causing partial pixel death with a characteristic green line at the failure boundary",
          color: "green",
        },
        {
          id: "dc1-reseat-connector",
          label: "Open the phone and reseat the display connector since it may be loose from the drop",
          color: "orange",
        },
        {
          id: "dc1-replace-backlight",
          label: "Replace the backlight since the bottom area is dark",
          color: "red",
        },
      ],
      correctActionId: "dc1-replace-oled",
      rationales: [
        {
          id: "dc1-r1",
          text: "The symptoms are classic OLED panel damage: partial screen death with a green line at the failure boundary. OLED displays do not have backlights (each pixel is self-emitting). The green line indicates failed OLED driver circuits at the boundary. The working digitizer across the entire screen confirms the touch layer is intact. A fused display assembly replacement including the OLED panel is required.",
        },
        {
          id: "dc1-r2",
          text: "The digitizer is working across the entire screen as proven by the touch test on the black area. Replacing the digitizer would not fix the display issue.",
        },
        {
          id: "dc1-r3",
          text: "A loose connector would cause the entire display to fail or flicker, not create a clean boundary with a green line. The green line is characteristic of OLED panel damage at the circuit level.",
        },
        {
          id: "dc1-r4",
          text: "OLED displays do not have a separate backlight. Each pixel produces its own light. There is no backlight component to replace.",
        },
      ],
      correctRationaleId: "dc1-r1",
      feedback: {
        perfect:
          "Correct. Partial OLED death with a green boundary line is a definitive indicator of OLED panel damage. The functional digitizer confirms only the display layer needs replacement.",
        partial:
          "Reseating the connector is worth trying but the clean failure boundary with a green line is characteristic of OLED panel damage, not a connector issue.",
        wrong: "OLED displays are self-emitting and do not have backlights. The digitizer is also working correctly.",
      },
    },
    {
      id: "dc-scenario-2",
      type: "investigate-decide",
      title: "Ghost Touch and Phantom Input",
      objective:
        "After a drop, a user's iPhone 14 Plus shows random touch inputs appearing on screen even when nobody is touching it. The display image looks normal with no visual defects. Apps open by themselves and text appears in input fields randomly.",
      investigationData: [
        {
          id: "dc2-visual-check",
          label: "Display Visual Assessment",
          content:
            "The display shows perfect colors, brightness, and resolution. No cracks, lines, discoloration, or dead pixels visible. The screen surface glass has a hairline crack in the lower-right corner that is barely visible. The crack does not go through to the display underneath.",
          isCritical: true,
        },
        {
          id: "dc2-touch-pattern",
          label: "Ghost Touch Pattern Analysis",
          content:
            "Using a touch visualization app (developer mode touch point display), phantom touch points appear predominantly in the lower-right quadrant near the hairline crack. The phantom inputs occur in rapid clusters, sometimes registering 3-4 touches per second. The ghost touches stop completely when the screen is cleaned and dried but return after a few minutes of use.",
          isCritical: true,
        },
        {
          id: "dc2-humidity",
          label: "Environmental Conditions",
          content:
            "The user mentions this started right after the drop but gets worse when they are outdoors or in humid environments. The office is climate-controlled and the ghost touches are less frequent indoors. The phone has no liquid damage indicators triggered.",
          isCritical: false,
        },
      ],
      actions: [
        {
          id: "dc2-software-fix",
          label: "Reset all settings to fix a potential touch calibration software bug",
          color: "red",
        },
        {
          id: "dc2-replace-display",
          label: "Replace the display assembly, as the hairline crack has compromised the digitizer's capacitive touch grid, allowing moisture ingress that causes phantom touches",
          color: "green",
        },
        {
          id: "dc2-screen-protector",
          label: "Apply a screen protector over the crack to block the ghost touches",
          color: "orange",
        },
        {
          id: "dc2-dry-phone",
          label: "Place the phone in a desiccant bag to remove moisture permanently",
          color: "blue",
        },
      ],
      correctActionId: "dc2-replace-display",
      rationales: [
        {
          id: "dc2-r1",
          text: "The hairline crack in the glass has breached the sealed digitizer layer. Ambient moisture enters through the crack and creates phantom capacitive signals on the touch grid. The pattern near the crack and correlation with humidity confirm moisture ingress through a compromised digitizer seal. The display assembly must be replaced to restore the sealed touch layer.",
        },
        {
          id: "dc2-r2",
          text: "Software reset cannot fix a hardware issue. The touch calibration is correct; the phantom inputs are caused by physical moisture on the capacitive grid.",
        },
        {
          id: "dc2-r3",
          text: "A screen protector over the crack may temporarily reduce moisture ingress but does not seal the digitizer properly. Moisture already inside the assembly will continue causing issues.",
        },
        {
          id: "dc2-r4",
          text: "Drying the phone provides temporary relief but the crack will continue allowing moisture to re-enter. The root cause is the compromised seal, not the current moisture content.",
        },
      ],
      correctRationaleId: "dc2-r1",
      feedback: {
        perfect:
          "Correct. The hairline crack broke the digitizer seal, allowing moisture ingress that creates phantom capacitive signals. Display assembly replacement restores the sealed touch layer.",
        partial:
          "Drying provides temporary relief but does not fix the cracked seal. Moisture will continue entering through the compromised glass.",
        wrong: "This is a hardware issue caused by a cracked digitizer seal. Software fixes cannot address physical moisture ingress.",
      },
    },
    {
      id: "dc-scenario-3",
      type: "investigate-decide",
      title: "Display Shows Image but Has Distortion",
      objective:
        "A Samsung Galaxy S23 Ultra was dropped from about 3 feet onto a tile floor. The display shows an image but with strange visual distortions. The user wants to know if it needs repair or if a setting got changed.",
      investigationData: [
        {
          id: "dc3-distortion",
          label: "Display Distortion Details",
          content:
            "The display shows vertical colored lines (magenta and yellow) running from top to bottom on the right side. These lines are visible even on the boot logo before Android loads. The rest of the screen shows a normal image but with a slight purple tint overall. The lines do not move or change when scrolling content.",
          isCritical: true,
        },
        {
          id: "dc3-connector",
          label: "Physical Assessment",
          content:
            "The glass is intact with no cracks. The phone body shows a small dent near the SIM tray on the right side. When gentle pressure is applied to the right edge of the phone, the colored lines briefly change pattern (shift position slightly) before returning. The display flex cable routes along the right side of the device internally.",
          isCritical: true,
        },
        {
          id: "dc3-safe-mode",
          label: "Safe Mode Test",
          content:
            "Booting into safe mode shows the same colored lines on the safe mode splash screen. The lines appear before any Android software loads, visible immediately on the Samsung logo during boot. A screenshot taken from the phone and viewed on a computer shows a perfect image with no lines or purple tint.",
          isCritical: true,
        },
      ],
      actions: [
        {
          id: "dc3-software-reset",
          label: "Factory reset since it might be a display driver software issue",
          color: "red",
        },
        {
          id: "dc3-open-reseat",
          label: "Open the device and reseat the display flex cable, as the dent near the cable route and pressure-sensitive line behavior suggest a partially dislodged connector",
          color: "green",
        },
        {
          id: "dc3-replace-display",
          label: "Replace the entire display assembly",
          color: "orange",
        },
        {
          id: "dc3-color-settings",
          label: "Adjust the display color settings to compensate for the tint",
          color: "red",
        },
      ],
      correctActionId: "dc3-open-reseat",
      rationales: [
        {
          id: "dc3-r1",
          text: "Three critical clues point to a connector issue: (1) The dent is near the display flex cable route. (2) Physical pressure on that area changes the line pattern, indicating an intermittent connection. (3) Screenshots are clean because the GPU output is correct; the distortion occurs between the connector and the panel. Reseating the flex cable is the least invasive fix and should be attempted before panel replacement.",
        },
        {
          id: "dc3-r2",
          text: "The lines appear on the boot logo before Android loads, proving this is a hardware issue below the software level. Screenshots being clean confirms the GPU is generating a correct signal. Factory reset cannot fix a hardware connection problem.",
        },
        {
          id: "dc3-r3",
          text: "Replacing the entire display is premature. The pressure test and cable location suggest a connector issue. If reseating does not work, then panel replacement becomes the next step.",
        },
        {
          id: "dc3-r4",
          text: "Color settings cannot fix physical colored lines or a purple tint caused by a hardware connection issue. The lines exist at the hardware level.",
        },
      ],
      correctRationaleId: "dc3-r1",
      feedback: {
        perfect:
          "Excellent. The dent near the cable route, pressure-responsive lines, and clean screenshots all indicate a partially dislodged display connector. Reseating is the correct first step before committing to panel replacement.",
        partial:
          "Display replacement would fix the issue but is unnecessary if a connector reseat resolves it. Always try the least invasive repair first.",
        wrong: "The boot logo lines and clean screenshots prove this is a hardware issue, not software. Display settings cannot fix physical connection problems.",
      },
    },
  ],
  hints: [
    "OLED screens do not have backlights. A green line at a failure boundary indicates OLED driver circuit damage.",
    "Ghost touches near a hairline crack that worsen with humidity indicate moisture ingress through a compromised digitizer seal.",
    "If display distortion changes when pressure is applied near the flex cable, and screenshots are clean, the connector is likely partially dislodged.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Display diagnosis is the highest-value hardware troubleshooting skill in mobile repair. Correctly identifying the failed component (LCD vs digitizer vs connector vs logic board) avoids expensive unnecessary part replacements and builds customer confidence.",
  toolRelevance: [
    "Visual Inspection (magnification)",
    "Touch Visualization (Developer Mode)",
    "Flashlight Test for Backlight",
    "Pressure Test for Connectors",
    "Screenshot Comparison Test",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
