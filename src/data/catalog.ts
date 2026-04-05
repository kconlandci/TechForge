import type { LabManifest } from "../types/manifest";

// Cloud labs
import { labManifest as cloudBackupStrategy } from "./labs/cloud-backup-strategy";
import { labManifest as cloudComplianceReview } from "./labs/cloud-compliance-review";
import { labManifest as cloudContainerOrchestration } from "./labs/cloud-container-orchestration";
import { labManifest as cloudCostOptimization } from "./labs/cloud-cost-optimization";
import { labManifest as cloudDisasterRecovery } from "./labs/cloud-disaster-recovery";
import { labManifest as cloudHybridSetup } from "./labs/cloud-hybrid-setup";
import { labManifest as cloudHypervisorSetup } from "./labs/cloud-hypervisor-setup";
import { labManifest as cloudIaasVsSaas } from "./labs/cloud-iaas-vs-saas";
import { labManifest as cloudMigrationPlan } from "./labs/cloud-migration-plan";
import { labManifest as cloudNetworkConfig } from "./labs/cloud-network-config";
import { labManifest as cloudSecurityConfig } from "./labs/cloud-security-config";
import { labManifest as cloudSharedResources } from "./labs/cloud-shared-resources";
import { labManifest as cloudStorageTiers } from "./labs/cloud-storage-tiers";
import { labManifest as cloudVmCreation } from "./labs/cloud-vm-creation";
import { labManifest as cloudVmVsContainer } from "./labs/cloud-vm-vs-container";

// Hardware labs
import { labManifest as hw3dPrinterIssues } from "./labs/hw-3d-printer-issues";
import { labManifest as hwBiosConfig } from "./labs/hw-bios-config";
import { labManifest as hwCpuSelection } from "./labs/hw-cpu-selection";
import { labManifest as hwCustomBuild } from "./labs/hw-custom-build";
import { labManifest as hwDiskFailure } from "./labs/hw-disk-failure";
import { labManifest as hwEsdProcedures } from "./labs/hw-esd-procedures";
import { labManifest as hwGpuTroubleshoot } from "./labs/hw-gpu-troubleshoot";
import { labManifest as hwLaserPrinterMaint } from "./labs/hw-laser-printer-maint";
import { labManifest as hwMotherboardFormFactors } from "./labs/hw-motherboard-form-factors";
import { labManifest as hwNoPost } from "./labs/hw-no-post";
import { labManifest as hwOverheatingPc } from "./labs/hw-overheating-pc";
import { labManifest as hwPeripheralSetup } from "./labs/hw-peripheral-setup";
import { labManifest as hwPrinterPaperJam } from "./labs/hw-printer-paper-jam";
import { labManifest as hwPsuFailure } from "./labs/hw-psu-failure";
import { labManifest as hwRaidConfig } from "./labs/hw-raid-config";
import { labManifest as hwRamUpgrade } from "./labs/hw-ram-upgrade";
import { labManifest as hwServerHardware } from "./labs/hw-server-hardware";
import { labManifest as hwStorageSelection } from "./labs/hw-storage-selection";
import { labManifest as hwThermalPaste } from "./labs/hw-thermal-paste";
import { labManifest as hwUpsSizing } from "./labs/hw-ups-sizing";

// Mobile labs
import { labManifest as mobileAppCrashes } from "./labs/mobile-app-crashes";
import { labManifest as mobileBasebandIssues } from "./labs/mobile-baseband-issues";
import { labManifest as mobileBatteryDrain } from "./labs/mobile-battery-drain";
import { labManifest as mobileBluetoothPairing } from "./labs/mobile-bluetooth-pairing";
import { labManifest as mobileChargingIssues } from "./labs/mobile-charging-issues";
import { labManifest as mobileDataMigration } from "./labs/mobile-data-migration";
import { labManifest as mobileDisplayCalibration } from "./labs/mobile-display-calibration";
import { labManifest as mobileEmailSync } from "./labs/mobile-email-sync";
import { labManifest as mobileMdmEnrollment } from "./labs/mobile-mdm-enrollment";
import { labManifest as mobileOsUpdateFailure } from "./labs/mobile-os-update-failure";
import { labManifest as mobileScreenReplacement } from "./labs/mobile-screen-replacement";
import { labManifest as mobileSecurityBreach } from "./labs/mobile-security-breach";
import { labManifest as mobileSlowPerformance } from "./labs/mobile-slow-performance";
import { labManifest as mobileStorageFull } from "./labs/mobile-storage-full";
import { labManifest as mobileWifiConnectivity } from "./labs/mobile-wifi-connectivity";

// Network labs
import { labManifest as netCableIdentification } from "./labs/net-cable-identification";
import { labManifest as netDhcpFailure } from "./labs/net-dhcp-failure";
import { labManifest as netDnsResolution } from "./labs/net-dns-resolution";
import { labManifest as netFirewallRules } from "./labs/net-firewall-rules";
import { labManifest as netIpConflict } from "./labs/net-ip-conflict";
import { labManifest as netLatencyDiagnosis } from "./labs/net-latency-diagnosis";
import { labManifest as netNetworkPrinter } from "./labs/net-network-printer";
import { labManifest as netNoInternet } from "./labs/net-no-internet";
import { labManifest as netPacketAnalysis } from "./labs/net-packet-analysis";
import { labManifest as netPortForwarding } from "./labs/net-port-forwarding";
import { labManifest as netProxyConfig } from "./labs/net-proxy-config";
import { labManifest as netSlowSpeeds } from "./labs/net-slow-speeds";
import { labManifest as netSubnetPlanning } from "./labs/net-subnet-planning";
import { labManifest as netSwitchConfig } from "./labs/net-switch-config";
import { labManifest as netVlanSetup } from "./labs/net-vlan-setup";
import { labManifest as netVpnTroubleshoot } from "./labs/net-vpn-troubleshoot";
import { labManifest as netWanFailover } from "./labs/net-wan-failover";
import { labManifest as netWifiDeadZones } from "./labs/net-wifi-dead-zones";
import { labManifest as netWirelessSecurity } from "./labs/net-wireless-security";
import { labManifest as netWirelessSurvey } from "./labs/net-wireless-survey";

// OS labs
import { labManifest as osBootRepair } from "./labs/os-boot-repair";
import { labManifest as osCommandLineBasics } from "./labs/os-command-line-basics";
import { labManifest as osDiskManagement } from "./labs/os-disk-management";
import { labManifest as osDriverIssues } from "./labs/os-driver-issues";
import { labManifest as osFilePermissions } from "./labs/os-file-permissions";
import { labManifest as osGroupPolicy } from "./labs/os-group-policy";
import { labManifest as osLinuxBasics } from "./labs/os-linux-basics";
import { labManifest as osLinuxPermissions } from "./labs/os-linux-permissions";
import { labManifest as osMacosTroubleshoot } from "./labs/os-macos-troubleshoot";
import { labManifest as osPerformanceTuning } from "./labs/os-performance-tuning";
import { labManifest as osRegistryEditing } from "./labs/os-registry-editing";
import { labManifest as osTaskManager } from "./labs/os-task-manager";
import { labManifest as osUserAccountMgmt } from "./labs/os-user-account-mgmt";
import { labManifest as osWindowsInstall } from "./labs/os-windows-install";
import { labManifest as osWindowsUpdate } from "./labs/os-windows-update";

// Troubleshooting labs
import { labManifest as tsApplicationError } from "./labs/ts-application-error";
import { labManifest as tsBlueScreen } from "./labs/ts-blue-screen";
import { labManifest as tsBootFailure } from "./labs/ts-boot-failure";
import { labManifest as tsComplexNetwork } from "./labs/ts-complex-network";
import { labManifest as tsDocumentationReview } from "./labs/ts-documentation-review";
import { labManifest as tsEscalationJudgment } from "./labs/ts-escalation-judgment";
import { labManifest as tsHardwareVsSoftware } from "./labs/ts-hardware-vs-software";
import { labManifest as tsIntermittentDrops } from "./labs/ts-intermittent-drops";
import { labManifest as tsMethodologyBasics } from "./labs/ts-methodology-basics";
import { labManifest as tsMultiUserIssue } from "./labs/ts-multi-user-issue";
import { labManifest as tsNetworkOutage } from "./labs/ts-network-outage";
import { labManifest as tsPrinterFleet } from "./labs/ts-printer-fleet";
import { labManifest as tsServerDown } from "./labs/ts-server-down";
import { labManifest as tsSlowComputer } from "./labs/ts-slow-computer";
import { labManifest as tsWirelessInterference } from "./labs/ts-wireless-interference";

const allLabs: LabManifest[] = [
  // Cloud
  cloudBackupStrategy,
  cloudComplianceReview,
  cloudContainerOrchestration,
  cloudCostOptimization,
  cloudDisasterRecovery,
  cloudHybridSetup,
  cloudHypervisorSetup,
  cloudIaasVsSaas,
  cloudMigrationPlan,
  cloudNetworkConfig,
  cloudSecurityConfig,
  cloudSharedResources,
  cloudStorageTiers,
  cloudVmCreation,
  cloudVmVsContainer,
  // Hardware
  hw3dPrinterIssues,
  hwBiosConfig,
  hwCpuSelection,
  hwCustomBuild,
  hwDiskFailure,
  hwEsdProcedures,
  hwGpuTroubleshoot,
  hwLaserPrinterMaint,
  hwMotherboardFormFactors,
  hwNoPost,
  hwOverheatingPc,
  hwPeripheralSetup,
  hwPrinterPaperJam,
  hwPsuFailure,
  hwRaidConfig,
  hwRamUpgrade,
  hwServerHardware,
  hwStorageSelection,
  hwThermalPaste,
  hwUpsSizing,
  // Mobile
  mobileAppCrashes,
  mobileBasebandIssues,
  mobileBatteryDrain,
  mobileBluetoothPairing,
  mobileChargingIssues,
  mobileDataMigration,
  mobileDisplayCalibration,
  mobileEmailSync,
  mobileMdmEnrollment,
  mobileOsUpdateFailure,
  mobileScreenReplacement,
  mobileSecurityBreach,
  mobileSlowPerformance,
  mobileStorageFull,
  mobileWifiConnectivity,
  // Network
  netCableIdentification,
  netDhcpFailure,
  netDnsResolution,
  netFirewallRules,
  netIpConflict,
  netLatencyDiagnosis,
  netNetworkPrinter,
  netNoInternet,
  netPacketAnalysis,
  netPortForwarding,
  netProxyConfig,
  netSlowSpeeds,
  netSubnetPlanning,
  netSwitchConfig,
  netVlanSetup,
  netVpnTroubleshoot,
  netWanFailover,
  netWifiDeadZones,
  netWirelessSecurity,
  netWirelessSurvey,
  // OS
  osBootRepair,
  osCommandLineBasics,
  osDiskManagement,
  osDriverIssues,
  osFilePermissions,
  osGroupPolicy,
  osLinuxBasics,
  osLinuxPermissions,
  osMacosTroubleshoot,
  osPerformanceTuning,
  osRegistryEditing,
  osTaskManager,
  osUserAccountMgmt,
  osWindowsInstall,
  osWindowsUpdate,
  // Troubleshooting
  tsApplicationError,
  tsBlueScreen,
  tsBootFailure,
  tsComplexNetwork,
  tsDocumentationReview,
  tsEscalationJudgment,
  tsHardwareVsSoftware,
  tsIntermittentDrops,
  tsMethodologyBasics,
  tsMultiUserIssue,
  tsNetworkOutage,
  tsPrinterFleet,
  tsServerDown,
  tsSlowComputer,
  tsWirelessInterference,
];

export const labCatalog = allLabs.sort((a, b) => a.sortOrder - b.sortOrder);
