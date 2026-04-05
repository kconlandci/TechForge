import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "hw-printer-paper-jam",
  version: 1,
  title: "Recurring Printer Paper Jams - Diagnose and Fix",
  tier: "intermediate",
  track: "hardware",
  difficulty: "moderate",
  accessLevel: "free",
  tags: ["printer", "paper-jam", "feed-rollers", "inkjet", "laser", "maintenance"],
  description:
    "A shared office printer has recurring paper jams. Triage the symptoms, identify the root cause from multiple possibilities, and select the correct remediation to stop the jams.",
  estimatedMinutes: 15,
  learningObjectives: [
    "Identify common mechanical causes of recurring paper jams in printers",
    "Distinguish between paper path, roller, and media-related jam causes",
    "Apply the correct maintenance procedure to resolve persistent feed issues",
  ],
  sortOrder: 307,
  status: "published",
  prerequisites: [],
  rendererType: "triage-remediate",
  scenarios: [
    {
      type: "triage-remediate",
      id: "jam-1",
      title: "Jams at the Pickup Roller",
      description:
        "An HP LaserJet Pro M404 jams consistently when picking up paper from Tray 2. The paper gets halfway into the printer then crumples. The printer is 3 years old and handles about 2,000 pages per month. The issue started gradually and has worsened over the past month.",
      evidence: [
        {
          type: "observation",
          content: "Paper consistently jams at the same location: between Tray 2 pickup and the first set of feed rollers. The leading edge of the paper is crumpled.",
        },
        {
          type: "physical",
          content: "The pickup roller in Tray 2 appears glossy and smooth. When touched, it feels slick rather than tacky. Tray 1 (manual feed) works without jams.",
        },
        {
          type: "media",
          content: "Standard 20lb letter paper from a freshly opened ream. Paper fan test shows no stuck sheets. Same paper brand used for the past year without issues.",
        },
      ],
      classifications: [
        { id: "class-roller", label: "Worn pickup rollers", description: "The Tray 2 pickup roller has lost its grip surface and can no longer reliably grab paper." },
        { id: "class-paper", label: "Bad paper stock", description: "The paper is too thick or damp for the printer to feed." },
        { id: "class-fuser", label: "Fuser jam", description: "The fuser assembly is causing a paper backup." },
      ],
      correctClassificationId: "class-roller",
      remediations: [
        { id: "rem-roller", label: "Replace the Tray 2 pickup roller assembly", description: "Install a new pickup roller kit designed for this printer model." },
        { id: "rem-paper", label: "Switch to heavier 24lb paper", description: "Use thicker paper stock that feeds more reliably." },
        { id: "rem-fuser", label: "Replace the fuser unit", description: "Install a new fuser assembly." },
      ],
      correctRemediationId: "rem-roller",
      rationales: [
        {
          id: "rat-roller",
          text: "At 2,000 pages/month for 3 years (72,000 pages), the pickup roller has exceeded its typical lifespan of 50,000-75,000 pages. The glossy, non-tacky surface confirms rubber degradation. Tray 1 working fine isolates the issue to Tray 2's roller specifically.",
        },
        {
          id: "rat-paper",
          text: "The paper is from a fresh ream, the same brand used successfully before, and feeds fine from Tray 1. This eliminates the media as the cause.",
        },
      ],
      correctRationaleId: "rat-roller",
      feedback: {
        perfect: "Correct! The glossy, slick roller is the telltale sign of rubber degradation after high page counts. Replacing the pickup roller kit is the definitive fix.",
        partial: "You're close but look at where the jam occurs and the physical condition of the components at that location.",
        wrong: "The evidence points clearly to a specific wear component. Note which tray has the problem and examine the roller condition described.",
      },
    },
    {
      type: "triage-remediate",
      id: "jam-2",
      title: "Multiple Sheets Feeding at Once",
      description:
        "An office inkjet printer (Epson WorkForce Pro WF-4830) frequently pulls two or three sheets at once, causing jams inside the paper path. This happens intermittently, about every 10-15 pages.",
      evidence: [
        {
          type: "observation",
          content: "When a jam occurs, 2-3 sheets are found stuck together inside the printer. The sheets appear to be statically bonded to each other.",
        },
        {
          type: "environmental",
          content: "The office has no humidity control. Current humidity is measured at 25% (very dry). It is winter and the heating system runs constantly. The paper is stored in an open tray on the desk.",
        },
        {
          type: "media",
          content: "Paper is standard 20lb copy paper that has been sitting in the open tray for 2+ weeks. The paper edges feel slightly curled.",
        },
      ],
      classifications: [
        { id: "class-static", label: "Static buildup due to low humidity", description: "Dry conditions cause static electricity that bonds paper sheets together." },
        { id: "class-separation", label: "Worn separation pad", description: "The separation pad that prevents multi-sheet feeding is worn out." },
        { id: "class-overload", label: "Tray overloaded", description: "Too much paper in the tray is causing multi-feed." },
      ],
      correctClassificationId: "class-static",
      remediations: [
        { id: "rem-fan", label: "Fan the paper thoroughly before loading and store paper in sealed packaging", description: "Break static bonds by fanning paper edges. Keep unused paper in its ream wrapper to prevent moisture loss." },
        { id: "rem-pad", label: "Replace the separation pad", description: "Install a new separation pad to prevent multi-sheet feeding." },
        { id: "rem-less-paper", label: "Load fewer sheets in the tray", description: "Reduce the paper stack to half capacity." },
      ],
      correctRemediationId: "rem-fan",
      rationales: [
        {
          id: "rat-static",
          text: "At 25% humidity, paper develops strong static charges that bond sheets together. Paper stored openly in dry conditions for weeks loses moisture and curls. Fanning breaks the static bonds and proper storage prevents recurrence.",
        },
        {
          id: "rat-pad",
          text: "A worn separation pad causes consistent multi-feeding regardless of conditions. The intermittent nature and environmental factors (dry, paper exposed for weeks) point to static rather than a mechanical issue.",
        },
      ],
      correctRationaleId: "rat-static",
      feedback: {
        perfect: "Correct! Low humidity is the #1 cause of multi-sheet feeding in offices. Fanning the paper and proper storage (sealed packaging, away from heat) solves this environmental issue.",
        partial: "The intermittent nature and environmental clues are key. Look at when and why the problem occurs, not just the mechanical symptoms.",
        wrong: "The environmental evidence is important here. Consider how humidity affects paper behavior and static buildup.",
      },
    },
    {
      type: "triage-remediate",
      id: "jam-3",
      title: "Paper Jams in the Duplex Unit",
      description:
        "A Brother MFC-L8900CDW color laser printer jams every time a duplex (double-sided) print job is attempted. Single-sided printing works perfectly. The jam always occurs when the paper tries to re-enter the printer for the second side.",
      evidence: [
        {
          type: "symptom",
          content: "Every duplex job jams. Single-sided jobs of any size print perfectly. The jam always occurs at the duplex re-entry point.",
        },
        {
          type: "physical",
          content: "The duplex unit slides out for cleaning. Inspection reveals a small piece of torn paper wedged in the duplex unit's re-entry path from a previous jam that was hastily cleared.",
        },
        {
          type: "test",
          content: "The printer's built-in duplex test page also fails with the same jam error, confirming it is not a driver issue.",
        },
      ],
      classifications: [
        { id: "class-obstruction", label: "Paper fragment obstruction in duplex path", description: "A torn paper fragment from a previous jam is blocking the duplex re-entry path." },
        { id: "class-duplex-unit", label: "Defective duplex assembly", description: "The duplex unit has a mechanical failure requiring replacement." },
        { id: "class-driver", label: "Incorrect duplex driver settings", description: "The print driver has incorrect duplex configuration." },
      ],
      correctClassificationId: "class-obstruction",
      remediations: [
        { id: "rem-clear", label: "Remove the paper fragment and clean the duplex path", description: "Carefully remove the torn paper from the duplex unit, clean the path with a lint-free cloth, and test duplex printing." },
        { id: "rem-replace-duplex", label: "Order a replacement duplex assembly", description: "Replace the entire duplex unit with a new one." },
        { id: "rem-driver", label: "Reinstall the print driver", description: "Uninstall and reinstall the printer driver with correct duplex settings." },
      ],
      correctRemediationId: "rem-clear",
      rationales: [
        {
          id: "rat-clear",
          text: "The torn paper fragment wedged in the duplex path directly explains why every duplex job fails at the exact same re-entry point, while single-sided jobs (which don't use that path) work fine. Clearing the obstruction is the simplest and correct fix.",
        },
        {
          id: "rat-unit",
          text: "Replacing the entire duplex unit is unnecessary when a simple obstruction has been identified. Always attempt the least invasive repair first.",
        },
      ],
      correctRationaleId: "rat-clear",
      feedback: {
        perfect: "Exactly right! A paper fragment from a hastily cleared jam is the most common cause of consistent duplex failures. Always clear jams carefully and check for torn remnants.",
        partial: "The evidence points to something simpler than a mechanical failure. Re-read the physical inspection findings.",
        wrong: "The physical inspection revealed the cause directly. When a specific paper path always jams, look for obstructions in that specific path.",
      },
    },
  ],
  hints: [
    "If one tray or paper path works but another doesn't, the issue is localized to the failing path's components.",
    "Environmental factors like humidity significantly affect paper behavior - static causes multi-feeding, moisture causes curling.",
    "Always check for torn paper fragments after clearing a jam. A small piece left behind causes future jams in the same spot.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Printer issues are a daily reality for help desk and desktop support roles. Companies still rely heavily on printing, and a tech who can quickly resolve paper jams saves significant downtime.",
  toolRelevance: [
    "Printer maintenance kits (pickup rollers, separation pads)",
    "Compressed air for cleaning paper paths",
    "Hygrometer for checking office humidity",
    "Lint-free cloths for roller cleaning",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
