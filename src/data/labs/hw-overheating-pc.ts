import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "hw-overheating-pc",
  version: 1,
  title: "PC Thermal Throttling - Diagnose Overheating",
  tier: "beginner",
  track: "hardware",
  difficulty: "easy",
  accessLevel: "free",
  tags: ["thermal", "overheating", "CPU", "cooling", "thermal-paste", "throttling"],
  description:
    "A PC is running slow under load due to thermal throttling. Investigate temperature data, fan behavior, and airflow to identify the root cause of overheating.",
  estimatedMinutes: 15,
  learningObjectives: [
    "Interpret CPU and GPU temperature readings to identify thermal throttling",
    "Diagnose common causes of overheating such as dust, dried paste, and failed fans",
    "Recommend appropriate cooling solutions based on system configuration",
  ],
  sortOrder: 304,
  status: "published",
  prerequisites: [],
  rendererType: "investigate-decide",
  scenarios: [
    {
      type: "investigate-decide",
      id: "overheat-1",
      title: "Laptop Shutting Down During Video Calls",
      objective:
        "A 3-year-old laptop shuts down after 20-30 minutes of video conferencing. The user reports the bottom of the laptop is extremely hot. Investigate and decide the best course of action.",
      investigationData: [
        {
          id: "temps",
          label: "Temperature Readings (HWMonitor)",
          content:
            "CPU idle: 62C. CPU under load (video call): climbs from 78C to 98C over 20 minutes, then the laptop shuts off. CPU Tjunction max is 100C. GPU temps are normal at 55C.",
          isCritical: true,
        },
        {
          id: "fan-behavior",
          label: "Fan Behavior",
          content:
            "The laptop fan runs at full speed constantly during video calls. The exhaust air feels warm but not hot. Intake vents on the bottom are partially blocked by dust visible through the grille.",
        },
        {
          id: "history",
          label: "Maintenance History",
          content:
            "The laptop has never been opened or cleaned internally. It is used on a bed with soft blankets frequently. No thermal paste has ever been replaced.",
        },
      ],
      actions: [
        { id: "clean-repaste", label: "Clean dust from vents/heatsink and replace thermal paste", color: "green" },
        { id: "new-fan", label: "Replace the internal fan", color: "yellow" },
        { id: "cooling-pad", label: "Buy an external cooling pad", color: "orange" },
        { id: "replace-cpu", label: "Replace the CPU - it is failing", color: "red" },
      ],
      correctActionId: "clean-repaste",
      rationales: [
        {
          id: "rat-clean",
          text: "After 3 years without cleaning, dust buildup in the heatsink fins restricts airflow. The fan works (it runs at full speed) but cannot push enough air through clogged fins. Combined with 3-year-old thermal paste that has likely dried out, cleaning and repasting will restore proper heat transfer.",
        },
        {
          id: "rat-fan",
          text: "The fan is clearly working since it spins at full speed. The problem is not the fan itself but the blocked airflow path and degraded thermal paste.",
        },
        {
          id: "rat-pad",
          text: "A cooling pad treats the symptom, not the cause. The internal heatsink must be cleaned for proper cooling. A cooling pad alone cannot compensate for a clogged heatsink.",
        },
      ],
      correctRationaleId: "rat-clean",
      feedback: {
        perfect: "Correct! A 3-year-old laptop that's never been cleaned will have significant dust buildup in the heatsink. Combined with dried thermal paste, cleaning and repasting is the definitive fix.",
        partial: "You identified a related issue but missed the primary cause. The fan works fine - the problem is what's blocking the airflow and the degraded thermal interface.",
        wrong: "That won't solve the root cause. The evidence points to a maintenance issue (dust and old thermal paste), not a component failure.",
      },
    },
    {
      type: "investigate-decide",
      id: "overheat-2",
      title: "Newly Built Desktop Overheating Immediately",
      objective:
        "A user just built a new desktop PC. On first boot, the CPU temperature hits 95C within seconds at idle. The system thermal throttles immediately. All components are brand new. Investigate the cause.",
      investigationData: [
        {
          id: "temps",
          label: "BIOS Temperature Reading",
          content:
            "CPU temperature shows 93C in BIOS after being powered on for only 30 seconds. The CPU is an AMD Ryzen 7 7800X which should idle around 40-50C with the stock cooler.",
          isCritical: true,
        },
        {
          id: "cooler-install",
          label: "Cooler Installation Photos",
          content:
            "The stock AMD Wraith cooler is mounted on the CPU. All four mounting screws appear tight. However, a close-up photo reveals the plastic protective film is still on the bottom of the cooler's copper contact plate.",
          isCritical: true,
        },
        {
          id: "case-airflow",
          label: "Case Configuration",
          content:
            "Mid-tower case with two intake fans in front and one exhaust fan in rear. Cable management is clean. Side panel is currently off for troubleshooting.",
        },
      ],
      actions: [
        { id: "remove-film", label: "Remove the plastic film from the cooler base and remount", color: "green" },
        { id: "better-cooler", label: "Return the stock cooler and buy an AIO liquid cooler", color: "yellow" },
        { id: "rma-cpu", label: "RMA the CPU as defective", color: "red" },
        { id: "more-fans", label: "Add more case fans for better airflow", color: "orange" },
      ],
      correctActionId: "remove-film",
      rationales: [
        {
          id: "rat-film",
          text: "The plastic protective film on the cooler's contact surface acts as a thermal insulator, preventing heat transfer from the CPU to the heatsink. This is one of the most common new-build mistakes. Removing it and remounting will immediately fix the temperature.",
        },
        {
          id: "rat-cooler",
          text: "The stock cooler is adequate for the Ryzen 7 7800X at stock settings. The problem is not the cooler's capacity but the installation error preventing contact.",
        },
        {
          id: "rat-cpu",
          text: "A brand new CPU reaching high temps immediately with an identified installation error is not defective. Always verify the installation before suspecting component failure.",
        },
      ],
      correctRationaleId: "rat-film",
      feedback: {
        perfect: "Exactly! Leaving the plastic film on the cooler base is a classic first-time builder mistake. It completely blocks heat transfer. Remove it, clean, and remount.",
        partial: "The root cause is simpler than you think. Look carefully at the cooler installation evidence before recommending expensive replacements.",
        wrong: "There is a clear installation error visible in the evidence. Always check the obvious before assuming component failure.",
      },
    },
    {
      type: "investigate-decide",
      id: "overheat-3",
      title: "Workstation GPU Overheating During Renders",
      objective:
        "A CAD workstation's GPU hits 100C during 3D renders and the display driver crashes. The system is 18 months old and was working fine until recently. Investigate the cause.",
      investigationData: [
        {
          id: "temps",
          label: "GPU Temperature Log (GPU-Z)",
          content:
            "GPU idle: 45C. GPU under rendering load: ramps to 100C in 5 minutes, then the driver crashes with 'Display driver nvlddmkm stopped responding.' Fan speed shows 100% RPM. GPU is an NVIDIA Quadro RTX 4000.",
          isCritical: true,
        },
        {
          id: "physical",
          label: "Physical Inspection",
          content:
            "Opening the case reveals heavy dust accumulation on the GPU heatsink fins. The GPU fans spin but are caked with dust. The PCIe slot area is clear. The case filter has not been cleaned in 18 months.",
        },
        {
          id: "environment",
          label: "Work Environment",
          content:
            "The workstation sits under a desk in a carpeted office near a window that is often open. The office has no dedicated HVAC filtration.",
        },
      ],
      actions: [
        { id: "clean-gpu", label: "Clean GPU heatsink and fans with compressed air, clean case filters", color: "green" },
        { id: "rma-gpu", label: "RMA the GPU as defective", color: "red" },
        { id: "underclock", label: "Underclock the GPU to reduce heat output", color: "yellow" },
        { id: "new-case", label: "Move to a new case with better airflow", color: "orange" },
      ],
      correctActionId: "clean-gpu",
      rationales: [
        {
          id: "rat-clean",
          text: "Heavy dust buildup on the GPU heatsink and fans directly impedes heat dissipation. The fans run at 100% but cannot move air through clogged fins. Cleaning the GPU and case filters will restore proper cooling. The carpeted, unfiltered environment accelerates dust accumulation.",
        },
        {
          id: "rat-rma",
          text: "The GPU worked fine for 18 months and the physical inspection reveals an obvious environmental cause. Cleaning should be attempted before assuming hardware failure.",
        },
        {
          id: "rat-underclock",
          text: "Underclocking reduces performance to work around a maintenance issue. Cleaning addresses the root cause and restores full performance.",
        },
      ],
      correctRationaleId: "rat-clean",
      feedback: {
        perfect: "Correct! Dust accumulation is the most common cause of gradual-onset overheating. Clean the GPU, case filters, and advise the user to clean regularly, especially in carpeted environments.",
        partial: "You're treating the symptom rather than the cause. The evidence clearly shows an environmental/maintenance issue.",
        wrong: "The GPU was working fine for 18 months and there's an obvious physical cause visible. Always check for dust before assuming failure.",
      },
    },
  ],
  hints: [
    "Check for obvious physical issues (dust, plastic film, blocked vents) before suspecting component failure.",
    "CPU Tjunction max is the absolute limit - reaching it triggers thermal throttling or emergency shutdown.",
    "A fan running at 100% but failing to cool means the airflow path is blocked, not that the fan is broken.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Overheating is the number one cause of intermittent PC issues. A technician who grabs a can of compressed air and a tube of thermal paste before anything else will solve most thermal complaints in under 30 minutes.",
  toolRelevance: [
    "HWMonitor or HWiNFO for temperature monitoring",
    "GPU-Z for graphics card thermals",
    "Compressed air for dust removal",
    "Isopropyl alcohol and thermal paste for repasting",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
