import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "mobile-charging-issues",
  version: 1,
  title: "Troubleshoot Phone Charging Problems",
  tier: "intermediate",
  track: "mobile-devices",
  difficulty: "moderate",
  accessLevel: "free",
  tags: ["charging", "usb-c", "lightning", "battery", "hardware", "troubleshooting"],
  description:
    "A phone is not charging properly. Investigate whether the issue is the cable, port, adapter, or battery and decide on the correct repair path based on diagnostic evidence.",
  estimatedMinutes: 18,
  learningObjectives: [
    "Systematically isolate charging failures to cable, port, adapter, or battery",
    "Interpret charging indicators and amperage readings for diagnosis",
    "Identify USB-C port contamination and physical damage symptoms",
    "Determine when a charging issue requires hardware repair versus accessory replacement",
  ],
  sortOrder: 108,
  status: "published",
  prerequisites: [],
  rendererType: "investigate-decide",
  scenarios: [
    {
      id: "ci-scenario-1",
      type: "investigate-decide",
      title: "Intermittent Charging Connection",
      objective:
        "A user's Google Pixel 8 charges intermittently. The charging indicator flickers on and off, and the phone only charges if the cable is held at a specific angle. The user has tried two different cables.",
      investigationData: [
        {
          id: "ci1-cable-test",
          label: "Cable and Adapter Testing",
          content:
            "Cable 1 (original Google cable): Intermittent charging on this phone, works perfectly on a different Pixel 8. Cable 2 (Amazon Basics USB-C): Same intermittent behavior on this phone, also works fine on the other Pixel 8. The original 30W Google adapter outputs correct voltage when tested with a USB-C power meter.",
          isCritical: true,
        },
        {
          id: "ci1-port-inspection",
          label: "USB-C Port Visual Inspection",
          content:
            "Using a flashlight and magnification, the USB-C port shows compressed lint and debris packed into the back of the connector. The center pin (CC pin) has a small fiber wrapped around it. The port housing appears physically intact with no bent or broken pins visible.",
          isCritical: true,
        },
        {
          id: "ci1-wireless-test",
          label: "Wireless Charging Test",
          content:
            "Placing the phone on a Qi wireless charger results in normal, consistent charging at 12W. The battery charges from 20% to 35% in 15 minutes without interruption.",
          isCritical: false,
        },
      ],
      actions: [
        {
          id: "ci1-clean-port",
          label: "Carefully clean the USB-C port using a non-conductive tool (plastic spudger or wooden toothpick) to remove the compressed lint and debris",
          color: "green",
        },
        {
          id: "ci1-replace-port",
          label: "Replace the USB-C port assembly",
          color: "orange",
        },
        {
          id: "ci1-compressed-air",
          label: "Blast compressed air into the port to clear debris",
          color: "blue",
        },
        {
          id: "ci1-use-wireless",
          label: "Tell the user to just use wireless charging going forward",
          color: "red",
        },
      ],
      correctActionId: "ci1-clean-port",
      rationales: [
        {
          id: "ci1-r1",
          text: "The cables work on another device and wireless charging works, isolating the problem to the USB-C port. Compressed lint and debris prevent the connector from seating fully, causing intermittent contact. Careful cleaning with a non-conductive tool removes the debris without damaging the pins. Compressed air alone often cannot dislodge packed lint.",
        },
        {
          id: "ci1-r2",
          text: "Replacing the port is unnecessary when the port pins are physically intact. Debris is a common and easily fixable cause of intermittent charging.",
        },
        {
          id: "ci1-r3",
          text: "Compressed air is often insufficient for packed, compressed lint that has been pushed in over months of use. A physical tool is needed to dislodge compacted debris.",
        },
        {
          id: "ci1-r4",
          text: "Using only wireless charging is a workaround that leaves the port non-functional for data transfer and fast charging.",
        },
      ],
      correctRationaleId: "ci1-r1",
      feedback: {
        perfect:
          "Correct. Port contamination from lint and debris is the most common cause of intermittent charging. Careful cleaning with a non-conductive tool restores full contact without risking pin damage.",
        partial:
          "Compressed air is a good first attempt but often fails with compacted debris. A physical non-conductive tool is needed for packed lint.",
        wrong: "The port hardware is intact. The issue is removable debris, not a hardware defect.",
      },
    },
    {
      id: "ci-scenario-2",
      type: "investigate-decide",
      title: "Slow Charging Despite Fast Charger",
      objective:
        "A user complains their iPhone 15 Pro takes over 4 hours to charge from 0% to 100%. They purchased a '65W fast charger' from a market stall. The phone should support 27W USB-C PD fast charging.",
      investigationData: [
        {
          id: "ci2-charger-specs",
          label: "Charger and Cable Analysis",
          content:
            "The charger label says '65W GaN Fast Charger' but only lists output specifications of 5V/2A (10W). There is no USB-PD, PPS, or QC marking. The included cable is USB-A to USB-C (not USB-C to USB-C). The cable feels lightweight and the connectors have no brand markings.",
          isCritical: true,
        },
        {
          id: "ci2-power-meter",
          label: "USB Power Meter Reading",
          content:
            "Connected between the charger and phone, the USB power meter shows: Voltage: 5.02V, Current: 0.98A, Power: 4.92W. No USB-PD negotiation detected. The phone's battery settings show 'Charging' (not 'Fast Charging').",
          isCritical: true,
        },
        {
          id: "ci2-battery-health",
          label: "Battery Health Status",
          content:
            "Battery health: 98% maximum capacity. Battery cycle count: 47. Optimized Battery Charging: Enabled. No battery service warnings. The phone charges normally (0-50% in 30 minutes) when using the Apple 20W adapter with a USB-C to USB-C cable.",
          isCritical: false,
        },
      ],
      actions: [
        {
          id: "ci2-replace-charger",
          label: "Explain that the charger only outputs 5W despite its labeling, and recommend a certified USB-PD charger with a proper USB-C to USB-C cable for fast charging",
          color: "green",
        },
        {
          id: "ci2-disable-optimized",
          label: "Disable Optimized Battery Charging to speed up charging",
          color: "orange",
        },
        {
          id: "ci2-service-battery",
          label: "Send the phone for battery service since it charges slowly",
          color: "red",
        },
        {
          id: "ci2-update-ios",
          label: "Update iOS to fix a potential charging bug",
          color: "blue",
        },
      ],
      correctActionId: "ci2-replace-charger",
      rationales: [
        {
          id: "ci2-r1",
          text: "The '65W' charger is falsely labeled and only outputs 5V/2A (about 5W actual). The USB-A to USB-C cable cannot carry USB-PD negotiation signals needed for fast charging. The phone charges normally with the Apple 20W adapter, confirming the phone is fine. A certified USB-PD charger with USB-C to USB-C cable will enable the 27W fast charging.",
        },
        {
          id: "ci2-r2",
          text: "Optimized Battery Charging slows charging above 80% to protect battery longevity. It does not cause the 0-100% charging to take 4+ hours, and disabling it slightly reduces battery lifespan.",
        },
        {
          id: "ci2-r3",
          text: "The battery health is 98% and charges normally with a proper charger. The phone does not need service.",
        },
      ],
      correctRationaleId: "ci2-r1",
      feedback: {
        perfect:
          "Correct. The counterfeit charger delivers only 5W despite its false 65W label, and the USB-A cable cannot negotiate USB-PD. A proper USB-PD charger with USB-C to USB-C cable restores fast charging.",
        partial:
          "Disabling Optimized Charging slightly speeds the 80-100% range but does not fix the fundamental 5W power delivery problem.",
        wrong: "The battery and phone are healthy. The charger and cable are the problem.",
      },
    },
    {
      id: "ci-scenario-3",
      type: "investigate-decide",
      title: "Phone Not Charging At All",
      objective:
        "A Samsung Galaxy A54 shows no response when any charger is plugged in. No charging indicator, no LED, no vibration. The phone is at 3% battery and about to die.",
      investigationData: [
        {
          id: "ci3-basic-tests",
          label: "Initial Testing Results",
          content:
            "Tested with 3 known-good chargers and cables (all verified working on other devices). No response from any combination. The USB-C port is visually clean and undamaged. No moisture detected in the port. The phone was working normally until the battery drained to 3%.",
          isCritical: true,
        },
        {
          id: "ci3-wireless-test",
          label: "Wireless Charging Attempt",
          content:
            "The Galaxy A54 does not support wireless charging (hardware limitation of this model). Alternative charging paths are not available.",
          isCritical: false,
        },
        {
          id: "ci3-history",
          label: "Device History",
          content:
            "The phone is 14 months old. The user reports it was working normally yesterday but they let it drain completely and it shut off. When they plugged it in this morning, the screen stayed black for 20 minutes with no charging indicator. After 25 minutes, the Samsung boot logo appeared briefly then disappeared. The phone has been repeating this cycle: black screen for 20 min, brief boot logo, black screen again.",
          isCritical: true,
        },
      ],
      actions: [
        {
          id: "ci3-deep-discharge-recovery",
          label: "Leave the phone connected to a charger for 30-60 minutes without touching it, as deeply discharged lithium batteries require trickle charging before the phone can boot",
          color: "green",
        },
        {
          id: "ci3-replace-battery",
          label: "Open the phone and replace the battery",
          color: "orange",
        },
        {
          id: "ci3-force-restart",
          label: "Perform a force restart by holding Power + Volume Down for 20 seconds",
          color: "blue",
        },
        {
          id: "ci3-send-repair",
          label: "Send to Samsung for warranty repair since the charging port is defective",
          color: "red",
        },
      ],
      correctActionId: "ci3-deep-discharge-recovery",
      rationales: [
        {
          id: "ci3-r1",
          text: "A deeply discharged lithium battery requires trickle charging at very low current before it can provide enough power to boot. The brief boot logo appearance after 25 minutes confirms the phone IS charging but the battery does not have enough charge to sustain the boot process. Leaving it connected without interruption for 30-60 minutes allows the trickle charge to reach a bootable level.",
        },
        {
          id: "ci3-r2",
          text: "Battery replacement is premature. The phone is showing signs of charging (brief boot after 25 minutes). Deep discharge recovery should be attempted first.",
        },
        {
          id: "ci3-r3",
          text: "Force restarting a phone at 0% battery will fail because there is insufficient power. Each boot attempt drains the small trickle charge, extending recovery time.",
        },
        {
          id: "ci3-r4",
          text: "The charging port is working since the boot logo appears after time on the charger. The issue is deep battery discharge, not a port defect.",
        },
      ],
      correctRationaleId: "ci3-r1",
      feedback: {
        perfect:
          "Correct. The brief boot logo after 25 minutes proves the port and charger are working. The battery is in deep discharge recovery mode and needs uninterrupted trickle charging time to reach a bootable voltage.",
        partial:
          "Force restarting wastes the small trickle charge that has accumulated, extending recovery time. Let the battery charge undisturbed.",
        wrong: "The brief boot logo confirms charging is occurring. The issue is insufficient battery voltage for a full boot, not a hardware defect.",
      },
    },
  ],
  hints: [
    "Test the cable and charger on another device first to isolate whether the problem is the phone or the accessories.",
    "A USB-C port that charges intermittently is most commonly caused by lint and debris packed into the connector.",
    "A deeply discharged phone may appear completely dead but show brief signs of life after 20-30 minutes on a charger. Be patient.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Charging issues account for a significant percentage of mobile repair tickets. The ability to quickly isolate the cause to cable, charger, port contamination, or battery state saves time and avoids unnecessary hardware repairs.",
  toolRelevance: [
    "USB Power Meter",
    "Port Inspection (flashlight/magnifier)",
    "Non-conductive Cleaning Tools",
    "Known-good Test Cables and Chargers",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
