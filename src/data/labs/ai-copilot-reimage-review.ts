import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "ai-copilot-reimage-review",
  version: 1,
  title: "The Copilot Said 'Just Reimage It'",
  tier: "advanced",
  track: "hardware-network-troubleshooting",
  difficulty: "challenging",
  accessLevel: "premium",
  tags: ["ai-copilot", "ai-review", "troubleshooting", "bsod", "malware", "help-desk", "verification"],
  description:
    "Your help desk's new AI copilot drafts the fix before you see the ticket. Across three tickets, check its work against the real evidence: veto a destructive reimage, catch a fabricated KB citation, and refuse an unsafe malware reply — before any of it reaches a user.",
  estimatedMinutes: 15,
  learningObjectives: [
    "Diff an AI copilot's proposed fix against primary evidence (crash dumps, event logs, change history) before approving it",
    "Verify cited KB articles, registry keys, and values at the source to detect hallucinated specifics",
    "Recognize when a copilot's plan creates blast radius — downtime and data loss disproportionate to the fault",
    "Refuse unsafe generated remediation, including scripts that disable security protections",
    "Correct AI-drafted user communications that promise more than the evidence supports",
  ],
  sortOrder: 515,
  status: "published",
  prerequisites: [],
  rendererType: "investigate-decide",
  scenarios: [
    {
      type: "investigate-decide",
      id: "copilot-s1",
      title: "The Reimage Plan",
      objective:
        "The VP of Sales has had intermittent blue screens for three days. The help desk's AI copilot reviewed the ticket and drafted a resolution plan before the ticket reached you. You are the human check on that plan. Review the evidence and decide what actually happens to this laptop.",
      investigationData: [
        {
          id: "ai-plan",
          label: "AI Copilot — Draft Resolution Plan",
          content: "Diagnosis: corrupt Windows installation. Plan: reimage the laptop from the standard image, estimated 4 hours including application reinstall. The copilot notes: 'User files are backed up to the cloud per policy, so no data is at risk.' Confidence: high. Status: ready for technician approval.",
        },
        {
          id: "dump-analysis",
          label: "Minidump Analysis (WinDbg)",
          content: "All five crash dumps from the past three days show the same result: BugCheck 0xD1 (DRIVER_IRQL_NOT_LESS_OR_EQUAL), faulting module netwtw10.sys — the Intel Wi-Fi driver. No dump implicates disk, memory, or OS system files.",
        },
        {
          id: "change-log",
          label: "Change Log and Symptom Timeline",
          content: "The laptop's Wi-Fi driver was updated by the vendor's update utility three days ago — the same morning the crashes began. Crashes occur both on the office dock and on the VP's home network. Nothing else on the machine changed that week.",
          isCritical: true,
        },
        {
          id: "data-check",
          label: "User Data Check",
          content: "The VP's active deal files live in a local-only CRM export folder that is not synced to the cloud (a known policy exception, migration pending). A reimage wipes that folder. Between imaging, application setup, and data restore, the VP — who travels daily — loses most of a business day.",
        },
      ],
      actions: [
        { id: "approve-reimage", label: "Approve the copilot's plan and reimage the laptop", color: "red" },
        { id: "rollback-driver", label: "Reject the reimage: roll back the Wi-Fi driver to the previous version, then monitor crashes for 48 hours", color: "green" },
        { id: "hardware-diagnostics-first", label: "Run the full memory and disk diagnostic suites first, then decide", color: "yellow" },
        { id: "replace-laptop", label: "Escalate for a warranty replacement laptop and set the current one aside", color: "blue" },
      ],
      correctActionId: "rollback-driver",
      rationales: [
        { id: "r-copilot-s1-correct", text: "The copilot pattern-matched 'repeated blue screens' to 'corrupt OS' without reading the dumps. The primary evidence is unambiguous: five crashes, one faulting module — the Wi-Fi driver — and the crashes started the morning that driver was updated. Rolling back a driver takes about 15 minutes, is fully reversible, and directly tests the hypothesis. The reimage, by contrast, costs the VP a day and would wipe a local-only folder the copilot incorrectly claimed was backed up. Verify the copilot's factual claims (especially 'no data at risk') against the evidence before approving any destructive plan." },
        { id: "r-copilot-s1-reimage", text: "Approving the reimage means accepting two unverified copilot claims: that the OS is corrupt (the dumps say the driver is at fault) and that user files are backed up (the deal folder is local-only). A reimage also reinstalls the current drivers — quite possibly recreating the crash on a freshly wiped machine." },
        { id: "r-copilot-s1-diagnostics", text: "Memory and disk tests are reasonable when dumps are ambiguous, but these dumps are not: they isolate the Wi-Fi driver five times. Hours of generic diagnostics delay a 15-minute reversible fix and keep a traveling VP on a crashing machine." },
        { id: "r-copilot-s1-replace", text: "A warranty swap has the same costs as the reimage — a lost day and the local-only data problem — to fix a fault the evidence places in a driver, not the hardware. It also hands the vendor a machine whose only defect is a software version." },
      ],
      correctRationaleId: "r-copilot-s1-correct",
      feedback: {
        perfect: "Correct. You read the dumps instead of the copilot's summary — and they told a different story: one driver, updated the day the crashes started. The habit to keep: a copilot's diagnosis is a hypothesis; the crash dumps, logs, and change history are the evidence. Test the cheapest reversible fix that matches the evidence first.",
        partial: "You avoided the reimage, but chose hours of testing or a hardware swap the evidence doesn't call for. Five identical dumps pointing at one recently updated driver justify going straight to the rollback and monitoring the result.",
        wrong: "The reimage was the copilot's guess, not a conclusion from evidence. It would have cost the VP a day, destroyed local-only deal files the copilot wrongly claimed were backed up, and possibly reinstalled the same bad driver. Always diff the copilot's claims against the primary artifacts before approving a destructive plan.",
      },
    },
    {
      type: "investigate-decide",
      id: "copilot-s2",
      title: "The Citation That Doesn't Exist",
      objective:
        "A shared workstation's print spooler keeps crashing. The AI copilot produced step-by-step fix instructions, citing a specific Microsoft KB article and a registry value with complete confidence. Before anyone applies those steps, verify them against the evidence and decide how this ticket proceeds.",
      investigationData: [
        {
          id: "ai-steps",
          label: "AI Copilot — Proposed Fix",
          content: "Per the copilot: 'This is a known issue documented in Microsoft KB5072841 (Print Spooler reliability update). Fix: set the registry value IsolationMode = 2 under HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Services\\Spooler, then restart the Print Spooler service. Documented in the KB article.'",
        },
        {
          id: "kb-search",
          label: "Microsoft Support — KB Search",
          content: "Searching Microsoft's support catalog for 'KB5072841' returns no results — the article number does not exist. Current official spooler guidance covers clearing the spool folder, restarting the service, and updating or removing problem printer drivers. No Microsoft document mentions an IsolationMode value for the Spooler service.",
        },
        {
          id: "registry-check",
          label: "Registry Editor — Spooler Service Key",
          content: "The Spooler service key on the workstation contains its standard values (ImagePath, DisplayName, DependOnService, and others). There is no value named IsolationMode, and the copilot's cited key path is the only place that name appears — in the copilot's own answer.",
          isCritical: true,
        },
        {
          id: "event-log",
          label: "Event Viewer — Print Spooler Errors",
          content: "Each spooler crash faults in module HPUPDPS.DLL, the HP universal print driver used by the department's shared printer. Crashes began last week, immediately after that driver auto-updated. Two identical workstations that do not use the HP printer have had zero spooler crashes.",
        },
      ],
      actions: [
        { id: "apply-copilot-steps", label: "Apply the copilot's steps exactly as written — it cited a KB article", color: "red" },
        { id: "documented-fix-instead", label: "Don't apply invented steps: clear the spool folder, restart the Print Spooler service, and roll back the faulting HP universal driver — then flag the copilot's fabricated citation", color: "green" },
        { id: "registry-edit-only", label: "Apply just the registry value — an extra value can't hurt anything", color: "yellow" },
        { id: "escalate-citing-kb", label: "Escalate to Microsoft support, citing KB5072841 as the documented cause", color: "blue" },
      ],
      correctActionId: "documented-fix-instead",
      rationales: [
        { id: "r-copilot-s2-correct", text: "Both of the copilot's authorities are fabricated: the KB number returns no results in Microsoft's catalog, and the registry value exists only in the copilot's answer. Hallucinated specifics are delivered with the same confidence as real ones — the only defense is checking the source, which takes a minute. Meanwhile the event log names the real cause: every crash faults in the HP universal driver that updated last week. The documented fix path (clear the spool folder, restart the service, roll back the faulting driver) addresses that cause, and flagging the citation teaches the team — and the tool's feedback loop — that this output failed verification." },
        { id: "r-copilot-s2-apply", text: "A citation is a claim, not evidence. Applying registry edits sourced from a nonexistent article means making undocumented changes to a production service on the strength of invented authority — and it does nothing about the driver that is actually crashing the spooler." },
        { id: "r-copilot-s2-registry-only", text: "'It can't hurt' is how undocumented changes accumulate. An invented value can alter service behavior in untested ways, will confuse the next technician who finds it, and still leaves the faulting driver in place. If a value isn't in the vendor's documentation, it doesn't go on the machine." },
        { id: "r-copilot-s2-escalate", text: "Escalating with a fabricated KB number wastes the vendor's time and your credibility — Microsoft support will find no such article, because there isn't one. Escalations must be built on verified evidence; here, the event log already identifies the fixable local cause." },
      ],
      correctRationaleId: "r-copilot-s2-correct",
      feedback: {
        perfect: "Correct. You checked the citation before the fix — the KB article doesn't exist and neither does the registry value. That one-minute verification is the whole skill: AI tools fabricate references fluently, so KB numbers, key paths, and values get confirmed at the source, every time. And you still fixed the printer, using the cause the event log actually showed.",
        partial: "You avoided the full set of invented steps, but any part of them — the registry value, or an escalation citing the fake KB — carries the fabrication forward. When the authority is invented, the whole answer fails verification; fall back to documented fixes and the evidence in the logs.",
        wrong: "The copilot's confidence was the trap. KB5072841 does not exist and IsolationMode appears nowhere in Microsoft's documentation or the registry — applying 'documented' steps from an invented document is how unverified changes reach production machines. Verify first: search the catalog, check the key, read the event log.",
      },
    },
    {
      type: "investigate-decide",
      id: "copilot-s3",
      title: "Don't Send That Reply (or Run That Script)",
      objective:
        "A Finance user reports fake antivirus pop-ups and a possible malware infection. The AI copilot has drafted the reply to the user and found a 'cleanup script' on a forum. Nothing has been sent or run yet. Review the evidence and decide what happens next.",
      investigationData: [
        {
          id: "ai-draft",
          label: "AI Copilot — Draft Reply and Suggested Script",
          content: "Draft reply: 'Good news — scans show your files are completely safe and no data was affected. Run the attached cleanup tool and you'll be all set.' The copilot links a forum-posted batch script described as a one-click cleaner; the script disables real-time protection 'so the cleaner can work' and downloads an executable from a file-sharing site.",
        },
        {
          id: "edr-alert",
          label: "Endpoint Protection — Alert Detail",
          content: "The workstation spawned a suspicious PowerShell process that connected to two external IP addresses. Analysts are still examining a changed file-extension pattern in the user's Documents folder. The investigation is open: whether files are safe is not yet established, and no scan has cleared the machine.",
          isCritical: true,
        },
        {
          id: "policy-context",
          label: "Ticket Context and Security Policy",
          content: "The user works in Finance and can open shared payment spreadsheets. Company policy for suspected compromise: isolate the machine from the network immediately, hand the ticket to the security team, and never run third-party cleanup scripts. Support does not confirm a machine is safe until Security clears it.",
        },
        {
          id: "forum-source",
          label: "Forum Thread — Script Source",
          content: "The script was posted this week by an anonymous account with no history. Two replies in the same thread report that after running it, their browsers were hijacked by an unwanted search extension.",
        },
      ],
      actions: [
        { id: "send-draft-run-script", label: "Send the copilot's reply and have the user run the cleanup script", color: "red" },
        { id: "isolate-escalate-correct", label: "Don't send, don't run: isolate the workstation from the network now, escalate to the security team, and send a corrected reply saying the machine is isolated and under investigation", color: "green" },
        { id: "test-script-yourself", label: "Run the script on the workstation yourself first to see if it works, then decide about the reply", color: "yellow" },
        { id: "keep-working-monitor", label: "Let the user keep working and monitor the machine for a few hours before deciding", color: "blue" },
      ],
      correctActionId: "isolate-escalate-correct",
      rationales: [
        { id: "r-copilot-s3-correct", text: "The draft promises a conclusion — 'completely safe' — that the open EDR investigation directly contradicts, and the 'remedy' is an anonymous script that disables real-time protection and downloads unknown code onto a possibly compromised Finance machine. Both halves fail verification. Policy and evidence point the same way: isolate first (stops any spread to shared payment data), escalate to Security (they own compromise calls), and communicate honestly — the user is told the machine is isolated and being investigated, not reassured with a promise nobody can yet make. Reviewing AI-drafted messages matters most exactly here, where the draft sounds kind and is wrong." },
        { id: "r-copilot-s3-send", text: "Sending the draft tells a Finance user, in writing, that an actively investigated machine is 'completely safe,' and the script then disables the protection that might prove otherwise while fetching an unknown executable. If the machine is compromised, this sequence both spreads the incident and documents that support dismissed it." },
        { id: "r-copilot-s3-test", text: "Running the script yourself doesn't de-risk it — the risk is what the script does: turns off real-time protection and executes downloaded code. 'Testing' it on the very machine under investigation can complete the attacker's work. Unknown remediation code is never run, by anyone, on a suspect machine." },
        { id: "r-copilot-s3-monitor", text: "Passive monitoring leaves a machine with suspicious outbound connections and possible file encryption attached to the network — and to Finance's shared spreadsheets — for hours. Isolation is cheap and immediate; the cost of waiting is measured in other people's files." },
      ],
      correctRationaleId: "r-copilot-s3-correct",
      feedback: {
        perfect: "Correct on both counts: you stopped the message and the script. A generated draft is not a communication decision — its reassurance contradicted an open investigation — and a script whose first step is disabling protection is a red flag, not a remedy. Isolate, escalate, and tell the user the truth: that's the sequence that protects the user and the network.",
        partial: "You hesitated at the right moment, but any version of running that script or leaving the machine connected keeps the risk alive. With a suspected compromise, the order is fixed: isolate first, then escalate, then communicate — verification of 'cleaners' from forums never enters into it.",
        wrong: "The copilot offered the two most dangerous options available: a written promise of safety the evidence doesn't support, and an anonymous script that disables security protection on a Finance workstation under active investigation. AI suggestions get the most scrutiny when they're reassuring — check what the EDR actually says before anything is sent or run.",
      },
    },
  ],
  hints: [
    "A copilot's confidence is not evidence. Compare its claims against the primary artifacts — crash dumps, event logs, change history, EDR alerts — before approving any plan.",
    "Verify citations at the source: search the vendor's KB catalog for the article number, and check that registry keys and values actually exist. Hallucinated specifics are stated with the same confidence as real ones.",
    "Never let a generated draft promise more than the evidence supports, and never run scripts that disable security protections — isolate, escalate, and communicate honestly instead.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "AI copilots are now the first drafter of most help-desk work — diagnoses, fix steps, and user replies. The technicians who get trusted with them are the ones who verify: reading the dump before the summary, checking the citation before the fix, and catching the reassuring draft that the evidence doesn't support. 'The human who checks the copilot' is becoming a defined role on support teams, and it is the role that gets escalated to when things go wrong.",
  toolRelevance: ["Microsoft Copilot", "ChatGPT", "WinDbg (minidump analysis)", "Windows Event Viewer", "Microsoft Support KB catalog"],
  createdAt: "2026-10-16",
  updatedAt: "2026-10-16",
};
