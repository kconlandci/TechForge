import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "net-subnet-planning",
  version: 1,
  title: "Subnet Planning for Small Business",
  tier: "intermediate",
  track: "networking",
  difficulty: "moderate",
  accessLevel: "free",
  tags: ["networking", "subnetting", "ip-addressing", "planning", "cidr"],
  description:
    "Plan and assign subnets for a small business with multiple departments and network segments. Calculate correct subnet masks and address ranges.",
  estimatedMinutes: 15,
  learningObjectives: [
    "Calculate subnet ranges and broadcast addresses from CIDR notation",
    "Allocate appropriately-sized subnets for different department needs",
    "Avoid IP address range overlaps between subnets",
    "Plan for future growth when assigning subnet sizes",
  ],
  sortOrder: 211,
  status: "published",
  prerequisites: [],
  rendererType: "action-rationale",
  scenarios: [
    {
      type: "action-rationale",
      id: "nsp-scenario-1",
      title: "Main Office Subnet Sizing",
      context:
        "A small business has 45 employees and expects to grow to 60 within two years. They need a single subnet for the main office floor. The allocated address space is 10.1.0.0/16. You need to choose the right subnet size.",
      actions: [
        { id: "slash-26", label: "10.1.1.0/26 (62 usable hosts)", color: "green" },
        { id: "slash-24", label: "10.1.1.0/24 (254 usable hosts)", color: "yellow" },
        { id: "slash-28", label: "10.1.1.0/28 (14 usable hosts)", color: "red" },
        { id: "slash-16", label: "10.1.0.0/16 (65,534 usable hosts)", color: "red" },
      ],
      correctActionId: "slash-26",
      rationales: [
        {
          id: "r-26",
          text: "A /26 provides 62 usable addresses, covering the current 45 users plus room to reach 60. It efficiently uses the address space without over-allocating.",
        },
        {
          id: "r-24",
          text: "A /24 provides 254 hosts which is far more than needed. While it works, it wastes address space that could be used for other subnets.",
        },
        {
          id: "r-28",
          text: "A /28 only provides 14 usable addresses. This cannot even cover the current 45 employees, let alone growth to 60.",
        },
        {
          id: "r-16",
          text: "Using the entire /16 for one office floor wastes the entire address space and creates an enormous broadcast domain that degrades performance.",
        },
      ],
      correctRationaleId: "r-26",
      feedback: {
        perfect: "Correct! A /26 efficiently fits 45-60 hosts with minimal waste. Good subnet planning accounts for growth without over-allocating.",
        partial: "Your subnet works but consider efficiency. The goal is to fit the requirement with the smallest appropriate subnet.",
        wrong: "Count the hosts needed (current + growth) and choose the smallest subnet that fits. A /26 gives 62 usable addresses.",
      },
    },
    {
      type: "action-rationale",
      id: "nsp-scenario-2",
      title: "Server Network Allocation",
      context:
        "The company has 8 servers and plans to add 4 more. The server network needs its own subnet separate from the office floor. Available space starts at 10.1.2.0. Servers include: 2 domain controllers, 2 file servers, 1 email server, 1 web server, 1 database server, and 1 backup server.",
      actions: [
        { id: "server-28", label: "10.1.2.0/28 (14 usable hosts)", color: "green" },
        { id: "server-24", label: "10.1.2.0/24 (254 usable hosts)", color: "yellow" },
        { id: "server-30", label: "10.1.2.0/30 (2 usable hosts)", color: "red" },
      ],
      correctActionId: "server-28",
      rationales: [
        {
          id: "r-s28",
          text: "A /28 provides 14 usable addresses for 8 current servers plus 4 planned, totaling 12. This leaves 2 addresses for unexpected additions while keeping the subnet tight.",
        },
        {
          id: "r-s24",
          text: "A /24 provides 254 addresses for 12 servers. This is extremely wasteful and creates an unnecessarily large broadcast domain for a server segment.",
        },
        {
          id: "r-s30",
          text: "A /30 only provides 2 usable addresses, which cannot accommodate 8 servers. /30 subnets are used for point-to-point links, not server networks.",
        },
      ],
      correctRationaleId: "r-s28",
      feedback: {
        perfect: "Correct! A /28 gives 14 usable addresses for 12 planned servers with a small buffer. Efficient and appropriately sized.",
        partial: "The subnet works but could be sized more efficiently. Server subnets should be tight since server counts are predictable.",
        wrong: "Count the total servers (current 8 + planned 4 = 12) and choose the smallest subnet that accommodates them.",
      },
    },
    {
      type: "action-rationale",
      id: "nsp-scenario-3",
      title: "Guest Wi-Fi Subnet",
      context:
        "The office lobby needs a guest Wi-Fi subnet. Maximum expected concurrent guests is 20. The guest network must be completely isolated from the 10.1.x.x corporate space. The ISP provided a second public IP block, so the guest network will use 172.16.0.0/16 as its private range.",
      actions: [
        { id: "guest-27", label: "172.16.1.0/27 (30 usable hosts)", color: "green" },
        { id: "guest-24", label: "172.16.1.0/24 (254 usable hosts)", color: "yellow" },
        { id: "guest-corp", label: "10.1.3.0/27 (30 usable hosts, in corporate range)", color: "red" },
      ],
      correctActionId: "guest-27",
      rationales: [
        {
          id: "r-g27",
          text: "A /27 provides 30 usable addresses for up to 20 guests with room for growth. Using the 172.16.x.x range keeps it completely separate from the corporate 10.1.x.x space.",
        },
        {
          id: "r-g24",
          text: "A /24 provides 254 addresses for only 20 guests. Over-allocating a guest network is wasteful and increases potential for abuse if the network is compromised.",
        },
        {
          id: "r-corp-range",
          text: "Placing the guest network in the 10.1.x.x range mixes guest and corporate addressing. Even with firewall rules, this increases risk and complicates routing policies.",
        },
      ],
      correctRationaleId: "r-g27",
      feedback: {
        perfect: "Correct! A /27 on the isolated 172.16.x.x range provides adequate guest capacity while maintaining complete separation from corporate resources.",
        partial: "The size or range choice needs adjustment. Ensure the guest network uses a separate address space from corporate.",
        wrong: "Guest networks should use a completely different address range than corporate, and be sized appropriately for the expected number of guests.",
      },
    },
  ],
  hints: [
    "Always plan for growth: choose a subnet that fits current needs plus expected expansion.",
    "Common subnet sizes: /24 = 254 hosts, /25 = 126 hosts, /26 = 62 hosts, /27 = 30 hosts, /28 = 14 hosts.",
    "Guest and IoT networks should use different address ranges than corporate networks for clear isolation.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Subnetting is one of the most heavily tested topics on the CompTIA A+ and Network+ exams. In the field, proper subnet planning prevents address conflicts and simplifies network troubleshooting for years to come.",
  toolRelevance: ["subnet calculator", "ipconfig", "network diagram tool", "spreadsheet"],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
