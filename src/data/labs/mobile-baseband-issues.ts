import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "mobile-baseband-issues",
  version: 1,
  title: "Diagnose Intermittent Cellular Connectivity Problems",
  tier: "advanced",
  track: "mobile-devices",
  difficulty: "challenging",
  accessLevel: "premium",
  tags: ["cellular", "baseband", "signal", "network", "sim", "troubleshooting"],
  description:
    "A phone has intermittent cellular connectivity with dropped calls and lost data. Triage the evidence to classify the root cause and apply the correct fix for baseband, SIM, carrier, or antenna issues.",
  estimatedMinutes: 25,
  learningObjectives: [
    "Interpret cellular signal metrics (dBm, RSSI, RSRP, SINR) for diagnostic purposes",
    "Distinguish between SIM card failures, antenna damage, carrier configuration issues, and baseband problems",
    "Use field test mode and carrier diagnostics to identify cellular issues",
    "Apply correct remediation for each type of cellular connectivity failure",
  ],
  sortOrder: 114,
  status: "published",
  prerequisites: [],
  rendererType: "triage-remediate",
  scenarios: [
    {
      id: "bi-scenario-1",
      type: "triage-remediate",
      title: "Dropped Calls and Signal Fluctuation",
      description:
        "A user's iPhone 15 drops calls after 30-60 seconds and cellular data intermittently disconnects. The signal indicator fluctuates between 1 bar and 4 bars while the user is sitting still at their desk. Other employees with the same carrier have consistent 4-bar signal in the same location.",
      evidence: [
        {
          type: "diagnostic",
          content:
            "Field Test Mode (* # * # 3001 # * # *) shows: RSRP: fluctuating between -65 dBm and -115 dBm (should be stable around -75 dBm in this location). SINR: varying from 25 dB to -3 dB. Band: alternating between Band 2 (1900 MHz) and Band 71 (600 MHz) every 10-20 seconds. The phone is constantly performing band reselection. SIM card: Physical nano-SIM, carrier: T-Mobile, plan: active, no account restrictions.",
        },
        {
          type: "observation",
          content:
            "The user has a thick metal case with a built-in magnetic ring mount. Removing the case, the signal stabilizes at -72 dBm on Band 2 with consistent 4 bars. With the case on, signal drops to -105 dBm and the band reselection resumes. The metal case has magnetic elements positioned directly over the antenna lines on the back of the phone.",
        },
      ],
      classifications: [
        {
          id: "bi1-class-case",
          label: "Metallic case with magnets attenuating cellular antenna signal",
          description:
            "The metal case and magnetic ring are blocking and detuning the cellular antennas, causing severe signal attenuation that triggers constant band reselection as the baseband searches for a usable signal.",
        },
        {
          id: "bi1-class-sim",
          label: "Faulty SIM card causing intermittent deregistration",
          description:
            "The SIM card may be making poor contact in the tray.",
        },
        {
          id: "bi1-class-tower",
          label: "Cell tower issue in the area",
          description:
            "The nearby cell tower may be having issues causing signal problems.",
        },
      ],
      correctClassificationId: "bi1-class-case",
      remediations: [
        {
          id: "bi1-rem-case",
          label: "Remove the metal/magnetic case and recommend a non-metallic case that does not obstruct the antenna lines. Suggest a MagSafe-compatible case designed for iPhone if they need a magnetic mount",
          description: "Eliminating the metallic interference restores full antenna performance, as proven by the controlled test showing stable signal without the case.",
        },
        {
          id: "bi1-rem-carrier",
          label: "Contact T-Mobile to report signal issues and request a signal booster",
          description: "Involving the carrier assumes a network-side problem, but other employees have strong signal in the same location, ruling out a tower issue.",
        },
        {
          id: "bi1-rem-replace-sim",
          label: "Replace the SIM card or switch to eSIM",
          description: "Swapping the SIM addresses a hardware authentication component that is already functioning correctly when the case is removed.",
        },
      ],
      correctRemediationId: "bi1-rem-case",
      rationales: [
        {
          id: "bi1-r1",
          text: "The proof is definitive: removing the case immediately stabilizes the signal. The metal case and magnets positioned over the antenna lines attenuate the cellular signal by 30+ dBm, pushing it from excellent (-72 dBm) to poor (-105 dBm). This causes the baseband to constantly search for a better signal through band reselection. A non-metallic case or properly designed MagSafe case eliminates the interference.",
        },
        {
          id: "bi1-r2",
          text: "Other employees have strong signal in the same location, ruling out a tower issue. The signal is stable without the case, confirming the case is the variable.",
        },
        {
          id: "bi1-r3",
          text: "The SIM card is functioning correctly when the case is removed. Signal stability without the case eliminates the SIM as the cause.",
        },
      ],
      correctRationaleId: "bi1-r1",
      feedback: {
        perfect:
          "Correct. The metal case with magnets over the antenna lines causes 30+ dBm signal attenuation. Removing it immediately proves the root cause. A non-metallic case recommendation is the complete fix.",
        partial:
          "The carrier and SIM are not the issue. The definitive test was removing the case and observing signal stabilization.",
        wrong: "The case removal test proves the case is causing the attenuation. Other causes were ruled out by the controlled test.",
      },
    },
    {
      id: "bi-scenario-2",
      type: "triage-remediate",
      title: "No Service After Carrier Switch",
      description:
        "A user switched from AT&T to Mint Mobile (T-Mobile MVNO) yesterday by inserting a new Mint Mobile SIM into their unlocked Samsung Galaxy S22. The phone shows 'No Service' and cannot make calls or use data. Wi-Fi calling works when connected to Wi-Fi.",
      evidence: [
        {
          type: "diagnostic",
          content:
            "SIM status: Detected, ICCID valid, Mint Mobile. Network mode: LTE/5G auto. Manual network search finds: T-Mobile (forbidden), AT&T (forbidden), Verizon (forbidden). APN settings still show: Name: ATT Phone, APN: phone, MMSC: http://mmsc.mobile.att.net. Carrier settings version: AT&T 51.0. The phone was previously used on AT&T for 2 years.",
        },
        {
          type: "log",
          content:
            "Baseband log shows: 'Network registration rejected: cause #11 (PLMN not allowed)'. The phone repeatedly attempts to register on PLMN 310-260 (T-Mobile) but is rejected. Carrier bundle for T-Mobile/Mint has not been downloaded. The phone's IMEI passes Mint Mobile's activation check.",
        },
      ],
      classifications: [
        {
          id: "bi2-class-carrier-config",
          label: "Stale carrier configuration from previous carrier blocking new network registration",
          description:
            "The phone still has AT&T carrier settings, APN, and carrier bundle. It needs the T-Mobile/Mint carrier configuration to register on the T-Mobile network. The 'PLMN not allowed' error indicates the network is rejecting the device due to incorrect carrier provisioning.",
        },
        {
          id: "bi2-class-locked",
          label: "The phone is still carrier-locked to AT&T",
          description:
            "Despite being sold as unlocked, the phone may still have a carrier lock.",
        },
        {
          id: "bi2-class-sim-defective",
          label: "The Mint Mobile SIM card is defective",
          description:
            "The new SIM card may be damaged or not activated properly.",
        },
      ],
      correctClassificationId: "bi2-class-carrier-config",
      remediations: [
        {
          id: "bi2-rem-update-carrier",
          label: "Reset network settings to clear stale AT&T configuration, configure the correct Mint Mobile APN (wholesale), check for carrier settings update, and restart the phone to force fresh network registration",
          description: "Clearing the old carrier configuration and applying the correct APN and carrier bundle allows the baseband to register on the T-Mobile network with proper provisioning parameters.",
        },
        {
          id: "bi2-rem-contact-att",
          label: "Contact AT&T to request an unlock code",
          description: "Requesting an unlock assumes the phone is carrier-locked, but the IMEI already passes Mint Mobile's activation check, confirming it is unlocked.",
        },
        {
          id: "bi2-rem-replace-sim",
          label: "Request a replacement SIM from Mint Mobile",
          description: "Replacing the SIM targets the physical card, which is already detected with a valid ICCID and supports Wi-Fi calling, proving it is functional.",
        },
      ],
      correctRemediationId: "bi2-rem-update-carrier",
      rationales: [
        {
          id: "bi2-r1",
          text: "The AT&T APN settings, carrier bundle, and network configuration are still active. Resetting network settings clears the stale AT&T configuration. Setting the correct Mint Mobile APN (typically 'wholesale' for T-Mobile MVNOs) enables data connectivity. A carrier settings update downloads the T-Mobile radio configuration. Restarting forces a fresh PLMN registration with correct parameters. The IMEI passes activation, confirming the phone is truly unlocked.",
        },
        {
          id: "bi2-r2",
          text: "The IMEI passes Mint's activation check, confirming the phone is unlocked. An AT&T lock would show in the activation check. The issue is carrier configuration, not a device lock.",
        },
        {
          id: "bi2-r3",
          text: "The SIM is detected with a valid ICCID and Wi-Fi calling works through the SIM, proving it is functional. The network rejection is due to carrier configuration, not the SIM hardware.",
        },
      ],
      correctRationaleId: "bi2-r1",
      feedback: {
        perfect:
          "Correct. Stale AT&T carrier configuration is preventing T-Mobile network registration. Resetting network settings, configuring the Mint APN, and updating carrier settings resolves the 'PLMN not allowed' rejection.",
        partial:
          "The phone is confirmed unlocked by the IMEI check. The SIM is confirmed working by Wi-Fi calling. Focus on the carrier configuration.",
        wrong: "The evidence shows the phone is unlocked and the SIM is functional. The issue is carrier configuration settings.",
      },
    },
    {
      id: "bi-scenario-3",
      type: "triage-remediate",
      title: "Intermittent Data Loss on 5G",
      description:
        "A user's Pixel 8 Pro intermittently loses cellular data in areas with strong signal. Voice calls work fine but data connections drop every 15-30 minutes and require toggling airplane mode to restore. The issue started after a recent system update.",
      evidence: [
        {
          type: "diagnostic",
          content:
            "Network mode: 5G preferred. Signal: -78 dBm on n77 (C-band 5G) consistently strong. When data drops, the signal indicator still shows full bars and '5G' icon. Toggling to LTE-only mode: data is stable with no drops over 2 hours of testing. Toggling back to 5G: data drops resume within 20 minutes. Android version: 14 QPR3 (installed 5 days ago).",
        },
        {
          type: "log",
          content:
            "Modem logs show: 'NR RRC connection release with cause: other' occurring at each data drop. The 5G NR (New Radio) connection is being released by the network but the phone's modem fails to gracefully fall back to LTE NSA or re-establish the NR connection. The baseband firmware version updated with the QPR3 system update. Multiple Pixel 8 Pro users on community forums report identical symptoms after the same update.",
        },
      ],
      classifications: [
        {
          id: "bi3-class-firmware",
          label: "Baseband firmware regression in the recent system update causing 5G handoff failures",
          description:
            "The QPR3 update included a baseband firmware change that introduced a bug in NR connection release handling. The modem fails to gracefully fall back to LTE when the 5G connection is released, causing a data connectivity gap. The issue is confirmed on community forums by multiple users with the same device and update.",
        },
        {
          id: "bi3-class-carrier",
          label: "Carrier 5G tower configuration issue",
          description:
            "The carrier's 5G tower may be misconfigured in this area.",
        },
        {
          id: "bi3-class-sim",
          label: "SIM card not provisioned for 5G",
          description:
            "The SIM may need updating to support 5G properly.",
        },
      ],
      correctClassificationId: "bi3-class-firmware",
      remediations: [
        {
          id: "bi3-rem-lte-workaround",
          label: "Set network mode to LTE-only as a temporary workaround, report the bug through the Android Beta Feedback app, and monitor for the next monthly update that should include a baseband fix",
          description: "LTE-only mode bypasses the buggy 5G handoff code while maintaining stable data connectivity, and reporting the bug ensures it is tracked for an official firmware fix.",
        },
        {
          id: "bi3-rem-factory-reset",
          label: "Factory reset to clean up the update",
          description: "A factory reset reinstalls the same system image with the same baseband firmware, so the modem bug persists after the reset.",
        },
        {
          id: "bi3-rem-downgrade",
          label: "Flash the previous Android version to downgrade the baseband",
          description: "Flashing older firmware reverses security patches and risks bootloader issues, while LTE-only mode achieves stable connectivity without those risks.",
        },
      ],
      correctRemediationId: "bi3-rem-lte-workaround",
      rationales: [
        {
          id: "bi3-r1",
          text: "LTE-only mode provides stable data connectivity as proven by the 2-hour test, making it an effective temporary workaround. The baseband firmware bug is confirmed by multiple users and will be fixed in a future update. Reporting through official channels ensures Google is aware. Monitoring monthly updates allows restoring 5G once the fix is released. This approach maintains usable data service while waiting for the proper fix.",
        },
        {
          id: "bi3-r2",
          text: "A factory reset will not change the baseband firmware version. The same QPR3 update will still have the same modem bug after a reset.",
        },
        {
          id: "bi3-r3",
          text: "Flashing previous firmware is complex, risks bootloader lock issues, and loses security patches. LTE-only mode achieves the same stable connectivity without the risks of downgrading.",
        },
      ],
      correctRationaleId: "bi3-r1",
      feedback: {
        perfect:
          "Correct. LTE-only mode is a stable workaround while the baseband firmware bug is addressed in a future update. Reporting the bug and monitoring for fixes is the professional approach to a known firmware regression.",
        partial:
          "Factory reset does not change the baseband firmware. The bug exists in the modem software delivered with the QPR3 update.",
        wrong: "The issue is a confirmed baseband firmware bug. Factory reset and SIM changes cannot fix modem firmware. LTE-only mode provides the safe workaround.",
      },
    },
  ],
  hints: [
    "If signal fluctuates wildly while stationary, check for metallic cases or magnetic accessories covering the antenna lines.",
    "After switching carriers, stale APN settings and carrier bundles from the old carrier can prevent network registration.",
    "When data drops but voice works on 5G, try LTE-only mode. If that is stable, the issue is likely a 5G baseband firmware bug.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Cellular connectivity troubleshooting requires understanding RF concepts and carrier configurations. Being able to read signal metrics (dBm, SINR) and interpret baseband logs is an advanced skill that distinguishes senior mobile technicians from general support staff.",
  toolRelevance: [
    "Field Test Mode / Signal Diagnostics",
    "APN Configuration",
    "Network Mode Settings",
    "Carrier Settings Update",
    "Baseband / Modem Logs",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
