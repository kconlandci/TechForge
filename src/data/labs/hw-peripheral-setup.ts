import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "hw-peripheral-setup",
  version: 1,
  title: "Set Up a Multi-Monitor Workstation",
  tier: "intermediate",
  track: "hardware",
  difficulty: "moderate",
  accessLevel: "free",
  tags: ["monitors", "display", "peripherals", "DisplayPort", "HDMI", "USB-C", "docking-station"],
  description:
    "Configure a multi-monitor workstation setup including display outputs, cable selection, resolution support, and docking station connectivity for a productivity-focused user.",
  estimatedMinutes: 18,
  learningObjectives: [
    "Identify display output types: HDMI, DisplayPort, USB-C/Thunderbolt, and VGA",
    "Match cable and adapter requirements to display resolution and refresh rate needs",
    "Configure docking station connections for laptop multi-monitor setups",
  ],
  sortOrder: 306,
  status: "published",
  prerequisites: [],
  rendererType: "action-rationale",
  scenarios: [
    {
      type: "action-rationale",
      id: "peripheral-1",
      title: "Dual 4K Monitors from a Laptop",
      context:
        "A user has a Dell Latitude 5540 laptop with one HDMI 2.0 port and two USB-C ports (Thunderbolt 4). They want to connect two 4K monitors at 60Hz each while the laptop lid is closed. Both monitors have HDMI and DisplayPort inputs.",
      actions: [
        { id: "tb-dock", label: "Use a Thunderbolt 4 docking station with two DisplayPort outputs", color: "green" },
        { id: "hdmi-splitter", label: "Use an HDMI splitter to send signal to both monitors", color: "red" },
        { id: "usb-hub", label: "Use a USB-A hub with HDMI adapters", color: "orange" },
        { id: "daisy-chain", label: "Daisy-chain monitors using HDMI passthrough", color: "yellow" },
      ],
      correctActionId: "tb-dock",
      rationales: [
        {
          id: "rat-dock",
          text: "A Thunderbolt 4 dock can drive two 4K@60Hz displays through a single Thunderbolt connection, while also providing power delivery and USB expansion. This is the correct professional solution for laptop multi-monitor setups.",
        },
        {
          id: "rat-splitter",
          text: "An HDMI splitter duplicates the same image to both screens (mirror mode) rather than extending the desktop. It cannot create an extended dual-monitor setup.",
        },
        {
          id: "rat-hub",
          text: "USB-A to HDMI adapters use DisplayLink compression which adds latency and CPU overhead. They cannot reliably drive 4K@60Hz and are not suitable for primary display outputs.",
        },
      ],
      correctRationaleId: "rat-dock",
      feedback: {
        perfect: "Perfect! A Thunderbolt 4 dock is the professional solution for driving dual 4K displays from a laptop. It provides the bandwidth needed for two 4K@60Hz outputs plus peripheral connectivity.",
        partial: "That approach has limitations for 4K dual-monitor setups. Consider the bandwidth requirements and how Thunderbolt 4 addresses them.",
        wrong: "That won't achieve a dual 4K extended desktop. Review the difference between signal splitting, daisy-chaining, and proper multi-display output.",
      },
    },
    {
      type: "action-rationale",
      id: "peripheral-2",
      title: "Connecting a Legacy VGA Monitor",
      context:
        "A reception desk needs a second monitor added. The only available monitor is an older 1080p VGA-only display. The desktop PC has one HDMI port (in use for the primary monitor), one DisplayPort, and no VGA port. The monitor must display at its native 1920x1080 resolution.",
      actions: [
        { id: "dp-vga", label: "Use an active DisplayPort to VGA adapter", color: "green" },
        { id: "hdmi-vga", label: "Use a passive HDMI to VGA cable", color: "yellow" },
        { id: "usb-vga", label: "Use a USB 3.0 to VGA adapter", color: "orange" },
        { id: "no-solution", label: "The VGA monitor cannot be used - buy a new monitor", color: "red" },
      ],
      correctActionId: "dp-vga",
      rationales: [
        {
          id: "rat-dp-vga",
          text: "An active DisplayPort to VGA adapter converts the digital signal to analog VGA. The DisplayPort is available (not in use), and active adapters reliably output 1080p to VGA displays. This is the most straightforward solution.",
        },
        {
          id: "rat-hdmi-vga",
          text: "HDMI to VGA requires an active adapter (not a simple cable) because HDMI is digital and VGA is analog. A passive cable will not work. Additionally, the HDMI port is already in use.",
        },
        {
          id: "rat-usb",
          text: "USB to VGA adapters use DisplayLink and work but add CPU overhead and latency. Since a native DisplayPort is available, using it directly is the better approach.",
        },
      ],
      correctRationaleId: "rat-dp-vga",
      feedback: {
        perfect: "Correct! An active DisplayPort to VGA adapter is the clean solution. It uses the available port and reliably handles the digital-to-analog conversion at 1080p.",
        partial: "That could work as a backup option but isn't the most efficient choice. Look at which ports are available and which conversion is most straightforward.",
        wrong: "The VGA monitor can absolutely be used. Digital to analog adapters exist specifically for this scenario.",
      },
    },
    {
      type: "action-rationale",
      id: "peripheral-3",
      title: "High Refresh Rate Gaming Monitor Connection",
      context:
        "A graphic designer also games and purchased a 1440p 165Hz monitor. Their GPU has one HDMI 2.0 port and three DisplayPort 1.4 ports. They want to use the full 165Hz refresh rate. The monitor supports both HDMI 2.0 and DisplayPort 1.4.",
      actions: [
        { id: "dp-cable", label: "Connect using a DisplayPort 1.4 cable", color: "green" },
        { id: "hdmi-cable", label: "Connect using an HDMI 2.0 cable", color: "yellow" },
        { id: "vga-adapter", label: "Use a DVI-to-HDMI adapter", color: "red" },
        { id: "usb-c", label: "Connect using a USB-C to DisplayPort cable", color: "orange" },
      ],
      correctActionId: "dp-cable",
      rationales: [
        {
          id: "rat-dp",
          text: "DisplayPort 1.4 supports 1440p at up to 240Hz with 32.4 Gbps bandwidth. HDMI 2.0 maxes out at 1440p@144Hz (18 Gbps bandwidth), which is below the monitor's 165Hz capability. DisplayPort is the only option that delivers the full refresh rate.",
        },
        {
          id: "rat-hdmi",
          text: "HDMI 2.0 bandwidth tops out at 18 Gbps, which supports 1440p at 144Hz maximum. To reach 165Hz at 1440p, you need the higher bandwidth of DisplayPort 1.4.",
        },
        {
          id: "rat-dvi",
          text: "DVI has been phased out and even dual-link DVI maxes out at 2560x1600@60Hz. It cannot support high refresh rates at 1440p.",
        },
      ],
      correctRationaleId: "rat-dp",
      feedback: {
        perfect: "Exactly right! DisplayPort 1.4 is the only connection here that has enough bandwidth for 1440p at 165Hz. Understanding bandwidth limits per cable standard is essential.",
        partial: "That connection works but won't deliver the full 165Hz at 1440p. Check the bandwidth specifications of each display standard.",
        wrong: "That interface cannot support this resolution and refresh rate combination. Always match the cable's bandwidth to the display's requirements.",
      },
    },
  ],
  hints: [
    "DisplayPort generally supports higher refresh rates than HDMI at the same resolution. Check the version specs.",
    "HDMI splitters mirror the display; they don't extend it. For extended desktop, each monitor needs its own output.",
    "Thunderbolt 4 provides 40 Gbps bandwidth - enough to drive two 4K@60Hz displays through a single cable.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Multi-monitor setups are standard in corporate environments. Technicians who understand display standards, docking stations, and cable bandwidth avoid unnecessary truck rolls and return visits.",
  toolRelevance: [
    "Display Settings (Windows) for multi-monitor configuration",
    "NVIDIA/AMD Control Panel for refresh rate settings",
    "Thunderbolt/USB-C docking stations",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
