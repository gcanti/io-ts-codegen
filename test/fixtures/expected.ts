import * as t from 'io-ts'

export type Health = {
  /** Name of the service. */
  id: string,
  /** Version of the service. */
  version: string,
  /** Current UTC date and time of the request, in ISO 8601 format. */
  currentAsOfUtc: string
}

export const Health = t.interface({
  /** Name of the service. */
  id: t.string,
  /** Version of the service. */
  version: t.string,
  /** Current UTC date and time of the request, in ISO 8601 format. */
  currentAsOfUtc: t.string
})

export type ICQAlertCategory =
  | 'Critical'
  | 'Alert'
  | 'Notification'

export const ICQAlertCategory = t.keyof({
  Critical: true,
  Alert: true,
  Notification: true
})

export type ICQAlert = {
  _moduleId: number,
  moduleName: string,
  _workcellSerialNumber: string,
  workcellName: string,
  AIMCode: number,
  AIMSubCode?: number,
  alertDateTime: string,
  category: ICQAlertCategory,
  description: string
}

export const ICQAlert = t.interface({
  _moduleId: t.number,
  moduleName: t.string,
  _workcellSerialNumber: t.string,
  workcellName: t.string,
  AIMCode: t.number,
  AIMSubCode: t.union([
    t.number,
    t.undefined
  ]),
  alertDateTime: t.string,
  category: ICQAlertCategory,
  description: t.string
})

export type ICQAssayReference = {
  _number: number,
  _version: number
}

export const ICQAssayReference = t.interface({
  _number: t.number,
  _version: t.number
})

export type ICQCalibrationMethod =
  | 'Qual1Point'
  | 'Qual2Point'
  | 'CalValueReference'
  | 'ICT'
  | 'Exponential'
  | 'Linear'
  | 'Spline'
  | 'ABS'
  | 'Factor'
  | 'UseFactor'
  | 'UseFactorBlank'
  | 'PLC4Y'
  | 'PLC4X'
  | 'PLC4XTransform'
  | 'PLC5Y'
  | 'PLC5X'
  | 'PLC5XTransform'
  | 'PointToPoint'
  | 'IAReference'
  | 'Logit-4'
  | 'Logit-5'

export const ICQCalibrationMethod = t.keyof({
  Qual1Point: true,
  Qual2Point: true,
  CalValueReference: true,
  ICT: true,
  Exponential: true,
  Linear: true,
  Spline: true,
  ABS: true,
  Factor: true,
  UseFactor: true,
  UseFactorBlank: true,
  PLC4Y: true,
  PLC4X: true,
  PLC4XTransform: true,
  PLC5Y: true,
  PLC5X: true,
  PLC5XTransform: true,
  PointToPoint: true,
  IAReference: true,
  'Logit-4': true,
  'Logit-5': true
})

export type ICQCalibrationType =
  | 'Full'
  | 'Adjust'

export const ICQCalibrationType = t.keyof({
  Full: true,
  Adjust: true
})

export type ICQCalibrationStatus =
  | 'NoCal'
  | 'Ok'
  | 'Failed'
  | 'Expired'
  | 'Overridden'
  | 'OverriddenLot'
  | 'PendingQC'
  | 'InProcess'

export const ICQCalibrationStatus = t.keyof({
  NoCal: true,
  Ok: true,
  Failed: true,
  Expired: true,
  Overridden: true,
  OverriddenLot: true,
  PendingQC: true,
  InProcess: true
})

export type ICQCalibration = {
  _moduleId: number,
  moduleName: string,
  _workcellSerialNumber: string,
  workcellName: string,
  assayReference: ICQAssayReference,
  assayName: string,
  reagentLotNumber: string,
  calibratorLotNumber: string,
  method: ICQCalibrationMethod,
  type: ICQCalibrationType,
  calibrationDateTime?: string,
  expirationDateTime?: string,
  status: ICQCalibrationStatus,
  user?: string
}

export const ICQCalibration = t.interface({
  _moduleId: t.number,
  moduleName: t.string,
  _workcellSerialNumber: t.string,
  workcellName: t.string,
  assayReference: ICQAssayReference,
  assayName: t.string,
  reagentLotNumber: t.string,
  calibratorLotNumber: t.string,
  method: ICQCalibrationMethod,
  type: ICQCalibrationType,
  calibrationDateTime: t.union([
    t.string,
    t.undefined
  ]),
  expirationDateTime: t.union([
    t.string,
    t.undefined
  ]),
  status: ICQCalibrationStatus,
  user: t.union([
    t.string,
    t.undefined
  ])
})

export type ICQReagentStatus =
  | 'Ok'
  | 'Mixing'
  | 'Overridden'
  | 'Disabled'
  | 'LowAlert'
  | 'Expired'
  | 'ExpiredError'
  | 'Empty'
  | 'NoAssay'
  | 'PickError'
  | 'PlaceError'
  | 'LoadError'
  | 'Incomplete'
  | 'BCFail'
  | 'Undefined'

export const ICQReagentStatus = t.keyof({
  Ok: true,
  Mixing: true,
  Overridden: true,
  Disabled: true,
  LowAlert: true,
  Expired: true,
  ExpiredError: true,
  Empty: true,
  NoAssay: true,
  PickError: true,
  PlaceError: true,
  LoadError: true,
  Incomplete: true,
  BCFail: true,
  Undefined: true
})

export type ICQReagentCartridgeStatus =
  | 'Ok'
  | 'UnloadError'
  | 'LoadError'
  | 'ScheduledUnload'
  | 'ScheduledLoad'
  | 'PartiallyUnloaded'
  | 'Scanning'
  | 'Unloading'
  | 'Loading'

export const ICQReagentCartridgeStatus = t.keyof({
  Ok: true,
  UnloadError: true,
  LoadError: true,
  ScheduledUnload: true,
  ScheduledLoad: true,
  PartiallyUnloaded: true,
  Scanning: true,
  Unloading: true,
  Loading: true
})

export type ICQOnBoardSolution = {
  _moduleId: number,
  moduleName: string,
  _workcellSerialNumber: string,
  workcellName: string,
  _lotNumber: string,
  _serialNumber: string,
  configurationId: string,
  configurationVersion: number,
  expirationDate: string,
  carouselPosition?: number,
  RSMPosition?: number,
  percentOfRemainingVolume: number,
  remainingHoursOfOnBoardStability?: number,
  status: ICQReagentStatus,
  cartridgeStatus: ICQReagentCartridgeStatus
}

export const ICQOnBoardSolution = t.interface({
  _moduleId: t.number,
  moduleName: t.string,
  _workcellSerialNumber: t.string,
  workcellName: t.string,
  _lotNumber: t.string,
  _serialNumber: t.string,
  configurationId: t.string,
  configurationVersion: t.number,
  expirationDate: t.string,
  carouselPosition: t.union([
    t.number,
    t.undefined
  ]),
  RSMPosition: t.union([
    t.number,
    t.undefined
  ]),
  percentOfRemainingVolume: t.number,
  remainingHoursOfOnBoardStability: t.union([
    t.number,
    t.undefined
  ]),
  status: ICQReagentStatus,
  cartridgeStatus: ICQReagentCartridgeStatus
})

export type ICQModuleType =
  | 'IA'
  | 'CC'

export const ICQModuleType = t.keyof({
  IA: true,
  CC: true
})

export type ICQOverallStatus =
  | 'Ok'
  | 'Warning'
  | 'Error'

export const ICQOverallStatus = t.keyof({
  Ok: true,
  Warning: true,
  Error: true
})

export type ICQModuleStatus =
  | 'Offline'
  | 'Stopped'
  | 'Initializing'
  | 'Warming'
  | 'Idle'
  | 'Running'
  | 'Processing'
  | 'Pausing'
  | 'Maintenance'

export const ICQModuleStatus = t.keyof({
  Offline: true,
  Stopped: true,
  Initializing: true,
  Warming: true,
  Idle: true,
  Running: true,
  Processing: true,
  Pausing: true,
  Maintenance: true
})

export type ICQProcessingModule = {
  _id: number,
  serialNumber: string,
  type: ICQModuleType,
  name: string,
  overallStatus: ICQOverallStatus,
  status: ICQModuleStatus,
  numberOfTestsInProgress: number,
  reagentOverallStatus: ICQOverallStatus,
  supplyOverallStatus: ICQOverallStatus,
  calibrationOverallStatus: ICQOverallStatus,
  QCAnalysisOverallStatus: ICQOverallStatus,
  maintenanceOverallStatus: ICQOverallStatus
}

export const ICQProcessingModule = t.interface({
  _id: t.number,
  serialNumber: t.string,
  type: ICQModuleType,
  name: t.string,
  overallStatus: ICQOverallStatus,
  status: ICQModuleStatus,
  numberOfTestsInProgress: t.number,
  reagentOverallStatus: ICQOverallStatus,
  supplyOverallStatus: ICQOverallStatus,
  calibrationOverallStatus: ICQOverallStatus,
  QCAnalysisOverallStatus: ICQOverallStatus,
  maintenanceOverallStatus: ICQOverallStatus
})

export type ICQQCAnalysisStatus =
  | 'Success'
  | 'QCOutOfRange'
  | 'WestgardWarning'
  | 'WestgardFailure'

export const ICQQCAnalysisStatus = t.keyof({
  Success: true,
  QCOutOfRange: true,
  WestgardWarning: true,
  WestgardFailure: true
})

export type ICQQCAnalysis = {
  _moduleId: number,
  moduleName: string,
  _workcellSerialNumber: string,
  workcellName: string,
  assayReference: ICQAssayReference,
  assayName: string,
  controlSetName: string,
  controlLevelName: string,
  controlLotNumber: string,
  assayQCStatus: ICQQCAnalysisStatus
}

export const ICQQCAnalysis = t.interface({
  _moduleId: t.number,
  moduleName: t.string,
  _workcellSerialNumber: t.string,
  workcellName: t.string,
  assayReference: ICQAssayReference,
  assayName: t.string,
  controlSetName: t.string,
  controlLevelName: t.string,
  controlLotNumber: t.string,
  assayQCStatus: ICQQCAnalysisStatus
})

export type ICQQCMaterialStatus =
  | 'Ok'
  | 'LowAlert'
  | 'Empty'
  | 'Expired'
  | 'Overridden'

export const ICQQCMaterialStatus = t.keyof({
  Ok: true,
  LowAlert: true,
  Empty: true,
  Expired: true,
  Overridden: true
})

export type ICQQCMaterial = {
  _moduleId: number,
  moduleName: string,
  _workcellSerialNumber: string,
  workcellName: string,
  assayReferences: Array<ICQAssayReference>,
  assayNames: Array<string>,
  _setName: string,
  _levelName: string,
  _lotNumber: string,
  _serialNumber: string,
  carouselPosition?: number,
  RSMPosition?: number,
  rackId: string,
  rackPosition: number,
  percentVolumeRemaining: number,
  materialExpirationDate: string,
  remainingHoursOfOnBoardStability: number,
  remainingMinutesOfInUseStability?: number,
  status: ICQQCMaterialStatus
}

export const ICQQCMaterial = t.interface({
  _moduleId: t.number,
  moduleName: t.string,
  _workcellSerialNumber: t.string,
  workcellName: t.string,
  assayReferences: t.array(ICQAssayReference),
  assayNames: t.array(t.string),
  _setName: t.string,
  _levelName: t.string,
  _lotNumber: t.string,
  _serialNumber: t.string,
  carouselPosition: t.union([
    t.number,
    t.undefined
  ]),
  RSMPosition: t.union([
    t.number,
    t.undefined
  ]),
  rackId: t.string,
  rackPosition: t.number,
  percentVolumeRemaining: t.number,
  materialExpirationDate: t.string,
  remainingHoursOfOnBoardStability: t.number,
  remainingMinutesOfInUseStability: t.union([
    t.number,
    t.undefined
  ]),
  status: ICQQCMaterialStatus
})

export type ICQRSMStatus =
  | 'Offline'
  | 'Stopped'
  | 'Initializing'
  | 'Idle'
  | 'Running'
  | 'Pausing'
  | 'Maintenance'

export const ICQRSMStatus = t.keyof({
  Offline: true,
  Stopped: true,
  Initializing: true,
  Idle: true,
  Running: true,
  Pausing: true,
  Maintenance: true
})

export type ICQRSM = {
  serialNumber: string,
  name: string,
  overallStatus: ICQOverallStatus,
  status: ICQRSMStatus
}

export const ICQRSM = t.interface({
  serialNumber: t.string,
  name: t.string,
  overallStatus: ICQOverallStatus,
  status: ICQRSMStatus
})

export type ICQConnectionStatus =
  | 'Connected'
  | 'NotConnected'
  | 'NotConfigured'

export const ICQConnectionStatus = t.keyof({
  Connected: true,
  NotConnected: true,
  NotConfigured: true
})

export type ICQPrinterStatus =
  | 'NoError'
  | 'Warning'
  | 'Error'
  | 'NotConfigured'

export const ICQPrinterStatus = t.keyof({
  NoError: true,
  Warning: true,
  Error: true,
  NotConfigured: true
})

export type ICQWorkcell = {
  _serialNumber: string,
  name: string,
  numberOfSamples: number,
  numberOfResultsPending: number,
  numberOfExceptions: number,
  LISConnectionStatus: ICQConnectionStatus,
  LASConnectionStatus: ICQConnectionStatus,
  AbbottLinkConnectionStatus: ICQConnectionStatus,
  PrinterConnectionStatus: ICQPrinterStatus,
  currentUser: string,
  processingModules: Array<ICQProcessingModule>,
  RSM: ICQRSM
}

export const ICQWorkcell = t.interface({
  _serialNumber: t.string,
  name: t.string,
  numberOfSamples: t.number,
  numberOfResultsPending: t.number,
  numberOfExceptions: t.number,
  LISConnectionStatus: ICQConnectionStatus,
  LASConnectionStatus: ICQConnectionStatus,
  AbbottLinkConnectionStatus: ICQConnectionStatus,
  PrinterConnectionStatus: ICQPrinterStatus,
  currentUser: t.string,
  processingModules: t.array(ICQProcessingModule),
  RSM: ICQRSM
})

export type CampingLocation =
  | 'Seaside'
  | 'Mountains'

export const CampingLocation = t.keyof({
  Seaside: true,
  Mountains: true
})

export type Camping = {
  /** camping name */
  name: string,
  /** number of tents */
  size: number,
  /** camping location */
  location: CampingLocation
}

export const Camping = t.interface({
  /** camping name */
  name: t.string,
  /** number of tents */
  size: t.number,
  /** camping location */
  location: CampingLocation
})
