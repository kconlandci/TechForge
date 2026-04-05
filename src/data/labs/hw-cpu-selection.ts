import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "hw-cpu-selection",
  version: 1,
  title: "Choose the Right CPU for a Workstation Build",
  tier: "intermediate",
  track: "hardware",
  difficulty: "moderate",
  accessLevel: "free",
  tags: ["CPU", "processor", "Intel", "AMD", "socket", "workstation", "cores", "threads"],
  description:
    "Select the appropriate CPU for different workstation use cases. Evaluate core count, clock speed, socket compatibility, TDP, and integrated graphics requirements.",
  estimatedMinutes: 15,
  learningObjectives: [
    "Compare CPU specifications relevant to different workload types",
    "Match CPUs to compatible motherboard sockets and chipsets",
    "Evaluate the tradeoff between core count and clock speed for specific tasks",
  ],
  sortOrder: 310,
  status: "published",
  prerequisites: [],
  rendererType: "action-rationale",
  scenarios: [
    {
      type: "action-rationale",
      id: "cpu-1",
      title: "Video Editing Workstation CPU",
      context:
        "A video production company needs a workstation for 4K video editing in DaVinci Resolve and Adobe Premiere Pro. The workflow involves heavy multi-threaded rendering and color grading. Budget for CPU is $400-500. The motherboard uses an LGA 1700 socket (Intel 12th/13th gen).",
      actions: [
        { id: "i7-13700k", label: "Intel Core i7-13700K (16 cores / 24 threads, 3.4 GHz base)", color: "green" },
        { id: "i5-13600k", label: "Intel Core i5-13600K (14 cores / 20 threads, 3.5 GHz base)", color: "yellow" },
        { id: "i9-10900k", label: "Intel Core i9-10900K (10 cores / 20 threads, 3.7 GHz base)", color: "red" },
        { id: "i3-13100", label: "Intel Core i3-13100 (4 cores / 8 threads, 3.4 GHz base)", color: "red" },
      ],
      correctActionId: "i7-13700k",
      rationales: [
        {
          id: "rat-i7",
          text: "The i7-13700K offers 16 cores and 24 threads, which is ideal for multi-threaded video rendering in DaVinci Resolve. It fits the LGA 1700 socket and falls within the $400-500 budget. The high core count significantly accelerates render times.",
        },
        {
          id: "rat-i5",
          text: "The i5-13600K is an excellent CPU but with 14 cores it leaves performance on the table for professional video editing workloads that scale with core count.",
        },
        {
          id: "rat-i9-old",
          text: "The i9-10900K uses LGA 1200 socket and is physically incompatible with the LGA 1700 motherboard. Socket compatibility must always be verified first.",
        },
      ],
      correctRationaleId: "rat-i7",
      feedback: {
        perfect: "Excellent! The i7-13700K balances high core count for rendering with the right socket and budget. For multi-threaded video editing, more cores directly translate to faster renders.",
        partial: "That CPU could work but isn't optimal for this workload and budget. Consider which specification matters most for multi-threaded rendering.",
        wrong: "That CPU either won't fit the motherboard or is severely underpowered for professional video editing. Check socket compatibility and core count requirements.",
      },
    },
    {
      type: "action-rationale",
      id: "cpu-2",
      title: "Point-of-Sale Terminal CPU",
      context:
        "A retail chain is building 20 point-of-sale (POS) terminals. Each runs a lightweight POS application, processes transactions, and connects to a receipt printer. The terminals need integrated graphics (no discrete GPU). Low power consumption is important for the small enclosures. The motherboard uses AM4 socket.",
      actions: [
        { id: "5600g", label: "AMD Ryzen 5 5600G (6 cores, 65W TDP, Radeon integrated graphics)", color: "yellow" },
        { id: "4300g", label: "AMD Ryzen 3 4300G (4 cores, 65W TDP, Radeon integrated graphics)", color: "green" },
        { id: "5950x", label: "AMD Ryzen 9 5950X (16 cores, 105W TDP, no integrated graphics)", color: "red" },
        { id: "5600x", label: "AMD Ryzen 5 5600X (6 cores, 65W TDP, no integrated graphics)", color: "orange" },
      ],
      correctActionId: "4300g",
      rationales: [
        {
          id: "rat-4300g",
          text: "The Ryzen 3 4300G provides 4 cores (more than sufficient for a POS application), integrated Radeon graphics (mandatory since no GPU is planned), and a 65W TDP suitable for small enclosures. It is the most cost-effective choice that meets all requirements.",
        },
        {
          id: "rat-5600g",
          text: "The Ryzen 5 5600G has integrated graphics but 6 cores is overkill for a POS terminal. The extra cost multiplied by 20 units adds up without providing meaningful benefit for this lightweight workload.",
        },
        {
          id: "rat-no-igpu",
          text: "The 5950X and 5600X lack integrated graphics entirely. Without a discrete GPU, these systems would have no display output. The 'G' suffix on AMD processors indicates integrated graphics.",
        },
      ],
      correctRationaleId: "rat-4300g",
      feedback: {
        perfect: "Correct! The Ryzen 3 4300G is the right-sized CPU for POS: it has integrated graphics, sufficient cores, and is cost-effective across 20 units. The 'G' suffix indicating integrated graphics is key.",
        partial: "Close, but consider the scale (20 units) and the actual workload requirements. More expensive CPUs provide no benefit for POS software.",
        wrong: "That CPU is missing a critical requirement or is significantly over-specced. Review the integrated graphics requirement and the POS workload demands.",
      },
    },
    {
      type: "action-rationale",
      id: "cpu-3",
      title: "Gaming and Streaming PC CPU",
      context:
        "A content creator needs a PC that can game at high frame rates while simultaneously streaming to Twitch using software encoding (x264). This requires high single-core performance for gaming AND strong multi-threaded performance for the encoding thread. The motherboard has an AM5 socket (AMD Ryzen 7000 series).",
      actions: [
        { id: "7800x3d", label: "AMD Ryzen 7 7800X3D (8 cores / 16 threads, 3D V-Cache, 120W TDP)", color: "yellow" },
        { id: "7900x", label: "AMD Ryzen 9 7900X (12 cores / 24 threads, 4.7 GHz base, 170W TDP)", color: "green" },
        { id: "7600x", label: "AMD Ryzen 5 7600X (6 cores / 12 threads, 4.7 GHz base, 105W TDP)", color: "orange" },
        { id: "7950x", label: "AMD Ryzen 9 7950X (16 cores / 32 threads, 4.5 GHz base, 170W TDP)", color: "blue" },
      ],
      correctActionId: "7900x",
      rationales: [
        {
          id: "rat-7900x",
          text: "The 7900X offers 12 cores / 24 threads with high clock speeds, providing both the single-threaded gaming performance and the multi-threaded headroom needed for simultaneous x264 encoding. It balances both workloads better than any other option.",
        },
        {
          id: "rat-7800x3d",
          text: "The 7800X3D excels at pure gaming due to its 3D V-Cache but only has 8 cores. Simultaneous x264 streaming requires additional cores beyond what the game uses, and 8 cores may create thread contention.",
        },
        {
          id: "rat-7600x",
          text: "Six cores is insufficient for gaming plus x264 encoding simultaneously. The encoding thread would starve the game of CPU time, causing frame drops in both the game and the stream.",
        },
      ],
      correctRationaleId: "rat-7900x",
      feedback: {
        perfect: "Great choice! The 7900X's 12 cores handle both gaming and x264 encoding without thread contention. It's the balanced pick for simultaneous gaming and streaming workloads.",
        partial: "That CPU handles one of the workloads well but may struggle with both simultaneously. Consider how many cores gaming + encoding require concurrently.",
        wrong: "That selection doesn't adequately address both the gaming and streaming requirements running simultaneously. Core count and clock speed both matter here.",
      },
    },
  ],
  hints: [
    "AMD CPUs with the 'G' suffix (like 5600G) have integrated graphics. Those without it (like 5600X) do not.",
    "Multi-threaded workloads like video rendering scale directly with core count - more cores means faster renders.",
    "Socket compatibility is non-negotiable: LGA 1700 CPUs cannot fit in LGA 1200 boards and vice versa.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "CPU selection affects every aspect of system performance. A+ technicians must match processors to workloads, verify socket compatibility, and understand that the most expensive option is not always the best option.",
  toolRelevance: [
    "CPU-Z for identifying installed processor details",
    "Cinebench for multi-core benchmarking",
    "PCPartPicker for socket compatibility verification",
    "Task Manager for monitoring per-core utilization",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
