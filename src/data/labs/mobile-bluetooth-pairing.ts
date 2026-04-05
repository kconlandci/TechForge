import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "mobile-bluetooth-pairing",
  version: 1,
  title: "Resolve Bluetooth Device Pairing Failures",
  tier: "intermediate",
  track: "mobile-devices",
  difficulty: "moderate",
  accessLevel: "free",
  tags: ["bluetooth", "pairing", "wireless", "peripherals", "troubleshooting"],
  description:
    "A user's Bluetooth headset won't pair with their phone. Walk through the diagnostic process to identify the pairing failure cause and apply the correct fix.",
  estimatedMinutes: 15,
  learningObjectives: [
    "Identify common Bluetooth pairing failure modes including version incompatibility and stale pairings",
    "Distinguish between discovery, authentication, and profile connection failures",
    "Apply the correct fix for each type of Bluetooth issue",
    "Understand Bluetooth version compatibility and profile requirements",
  ],
  sortOrder: 106,
  status: "published",
  prerequisites: [],
  rendererType: "action-rationale",
  scenarios: [
    {
      id: "bp-scenario-1",
      type: "action-rationale",
      title: "Headset Not Appearing in Scan",
      context:
        "A user just bought Sony WH-1000XM5 headphones and they do not appear in the Bluetooth device list on their Samsung Galaxy S21. The user turned on Bluetooth on the phone and pressed the power button on the headphones. The phone shows other nearby devices (a colleague's AirPods, an office speaker) but not the Sony headphones. The headphones LED shows a solid blue light.",
      actions: [
        {
          id: "bp1-restart-phone",
          label: "Restart the phone and try again",
          color: "blue",
        },
        {
          id: "bp1-pairing-mode",
          label: "Put the headphones into pairing mode by holding the power button for 7 seconds until the LED flashes blue and red alternately",
          color: "green",
        },
        {
          id: "bp1-nfc-tap",
          label: "Use NFC to pair by tapping the phone to the headphones",
          color: "orange",
        },
        {
          id: "bp1-reset-headphones",
          label: "Factory reset the headphones",
          color: "red",
        },
      ],
      correctActionId: "bp1-pairing-mode",
      rationales: [
        {
          id: "bp1-r1",
          text: "A solid blue LED indicates the headphones are powered on but not in pairing mode. Most Bluetooth headphones require entering a specific pairing mode (usually by holding the power button for several seconds) to become discoverable to new devices. Simply powering on only reconnects to previously paired devices.",
        },
        {
          id: "bp1-r2",
          text: "Restarting the phone would not help because the headphones are not broadcasting as discoverable. The phone can see other Bluetooth devices, confirming its Bluetooth radio is working.",
        },
        {
          id: "bp1-r3",
          text: "NFC pairing can work but requires NFC to be enabled on both devices and the phone to be placed precisely on the NFC tag. It is not the primary troubleshooting step when the device is simply not in pairing mode.",
        },
      ],
      correctRationaleId: "bp1-r1",
      feedback: {
        perfect:
          "Correct. The headphones need to be in pairing mode to be discoverable. A solid blue LED means powered on, while flashing blue/red means discoverable. Most users miss this step with new Bluetooth devices.",
        partial:
          "NFC pairing is an alternative but the core issue is that the headphones are not in discoverable mode. Understanding pairing mode is the fundamental concept.",
        wrong: "The phone's Bluetooth is working (it sees other devices). The issue is on the headphone side.",
      },
    },
    {
      id: "bp-scenario-2",
      type: "action-rationale",
      title: "Pairing Succeeds but Audio Fails",
      context:
        "After entering pairing mode, the headphones appear and pair successfully. The phone shows them as 'Connected' under Bluetooth settings. However, when the user plays music on Spotify, audio comes from the phone speaker instead of the headphones. The user checks the Bluetooth settings and sees the headphones connected but only 'Phone calls' is listed under the device profile, not 'Media audio'.",
      actions: [
        {
          id: "bp2-unpair-repair",
          label: "Unpair the headphones and pair again",
          color: "blue",
        },
        {
          id: "bp2-enable-a2dp",
          label: "Tap the headphones in Bluetooth settings, enable the 'Media audio' (A2DP) profile toggle, and verify the audio output switches",
          color: "green",
        },
        {
          id: "bp2-change-audio-output",
          label: "Go to Spotify settings and manually change the audio output device",
          color: "orange",
        },
        {
          id: "bp2-update-firmware",
          label: "Update the headphone firmware via the Sony app",
          color: "blue",
        },
      ],
      correctActionId: "bp2-enable-a2dp",
      rationales: [
        {
          id: "bp2-r1",
          text: "The A2DP (Advanced Audio Distribution Profile) is the Bluetooth profile that handles stereo media audio streaming. When only HFP (Hands-Free Profile for calls) is connected, media audio does not route to the headphones. Enabling the A2DP profile in the device's Bluetooth settings resolves this directly.",
        },
        {
          id: "bp2-r2",
          text: "Re-pairing may reconnect with the same partial profile selection. The issue is that A2DP was not enabled during the initial connection, which should be toggled on directly.",
        },
        {
          id: "bp2-r3",
          text: "Spotify follows the system audio output. Changing it in-app is not the root fix and may not even be available on all devices.",
        },
      ],
      correctRationaleId: "bp2-r1",
      feedback: {
        perfect:
          "Correct. The A2DP profile was not connected. Enabling it in Bluetooth device settings immediately routes media audio to the headphones.",
        partial:
          "Re-pairing might fix it but enabling A2DP directly is faster and does not risk losing the pairing entirely.",
        wrong: "The connection is already established. The issue is which Bluetooth profile is active, not the pairing itself.",
      },
    },
    {
      id: "bp-scenario-3",
      type: "action-rationale",
      title: "Bluetooth Interference and Dropped Connection",
      context:
        "The headphones work for 2-3 minutes then audio starts cutting out with brief silence gaps every few seconds. The user is sitting at their desk in an open office. The desk has a USB 3.0 hub with multiple devices connected, a wireless mouse receiver, and a microwave in the adjacent break room. The phone is in the user's pocket on the opposite side from the headphones. Moving closer to the phone does not help.",
      actions: [
        {
          id: "bp3-move-usb-hub",
          label: "Move the USB 3.0 hub away from the phone or disconnect unused USB 3.0 devices, as USB 3.0 is a known source of 2.4 GHz interference",
          color: "green",
        },
        {
          id: "bp3-disable-wifi",
          label: "Disable Wi-Fi on the phone to eliminate 2.4 GHz band competition",
          color: "orange",
        },
        {
          id: "bp3-replace-headphones",
          label: "The headphones are defective and need replacement",
          color: "red",
        },
        {
          id: "bp3-change-codec",
          label: "Switch to a different Bluetooth audio codec in developer options",
          color: "blue",
        },
      ],
      correctActionId: "bp3-move-usb-hub",
      rationales: [
        {
          id: "bp3-r1",
          text: "USB 3.0 devices are a well-documented source of 2.4 GHz electromagnetic interference that disrupts Bluetooth connections. The USB 3.0 hub with multiple active devices on the desk is the most likely interference source. Moving it away from the Bluetooth signal path or disconnecting unused devices resolves the interference.",
        },
        {
          id: "bp3-r2",
          text: "Disabling Wi-Fi may marginally help but modern phones handle Bluetooth/Wi-Fi coexistence well. The USB 3.0 interference is a more significant and specific source based on the desk layout.",
        },
        {
          id: "bp3-r3",
          text: "The headphones worked for 2-3 minutes before cutting out, which is typical of interference rather than a hardware defect. A defective radio would likely fail consistently from the start.",
        },
        {
          id: "bp3-r4",
          text: "Changing the Bluetooth codec may help with bandwidth but does not address the physical RF interference from the USB 3.0 hub.",
        },
      ],
      correctRationaleId: "bp3-r1",
      feedback: {
        perfect:
          "Excellent. USB 3.0 interference with Bluetooth is a common but often overlooked issue. The 2.4 GHz broadband noise from USB 3.0 data transfer directly impacts Bluetooth signal quality.",
        partial:
          "Wi-Fi coexistence is generally well-handled by modern phones. USB 3.0 interference is the more likely and specific cause given the desk setup.",
        wrong: "Intermittent audio with brief gaps is a classic interference pattern, not a hardware defect.",
      },
    },
  ],
  hints: [
    "If a new Bluetooth device does not appear in the scan, verify it is in pairing/discoverable mode, not just powered on.",
    "Bluetooth uses profiles like A2DP for media audio and HFP for phone calls. Check which profiles are connected if audio routing is wrong.",
    "USB 3.0 devices emit broadband noise in the 2.4 GHz range that can interfere with Bluetooth connections.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Bluetooth issues are among the most reported problems in BYOD environments. Understanding pairing modes, audio profiles, and RF interference helps you resolve tickets that frustrate both users and less-experienced technicians.",
  toolRelevance: [
    "Bluetooth Settings",
    "Device Profile Manager",
    "Developer Options (Bluetooth codec)",
    "RF Interference Diagnosis",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
