export interface Satellite {
  id: string;
  name: string;
  noradId: number;
  designator: string;
  type: 'EO_OPTICAL' | 'RADAR_SAR' | 'COMMS_RELAY' | 'ASTRO_OBS';
  status: 'NOMINAL' | 'ECLIPSE' | 'MANEUVER' | 'DOWNLINK';
  altitudeKm: number;
  apogeeKm: number;
  perigeeKm: number;
  inclinationDeg: number;
  velocityKmh: number;
  periodMinutes: number;
  batteryLevelPct: number;
  solarKw: number;
  busTempC: number;
  lat: number;
  lng: number;
  tleLine1: string;
  tleLine2: string;
  launchDate: string;
}

export interface GroundStation {
  id: string;
  code: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  elevationM: number;
  bands: ('S-Band' | 'X-Band' | 'Ka-Band')[];
  dishDiameterM: number;
  currentStatus: 'TRACKING' | 'ACQUIRING' | 'STANDBY' | 'CALIBRATION';
  activePassSatId?: string;
  snrDb: number;
  nextPassAos: string;
  passDurationMin: number;
  maxElevationDeg: number;
}

export interface SubsystemTelemetry {
  reactionWheels: {
    id: number;
    rpm: number;
    tempC: number;
    currentAmps: number;
    jitterMilliRad: number;
  }[];
  solarPanels: {
    panel: string;
    sunAngleDeg: number;
    voltageV: number;
    currentA: number;
    outputWatts: number;
    status: 'OPTIMAL' | 'SHADOW' | 'SLEWING';
  }[];
  magnetorquers: {
    axis: 'X' | 'Y' | 'Z';
    dipoleAm2: number;
    polarity: '+' | '-';
    state: 'ACTIVE' | 'DAMPING' | 'OFF';
  }[];
  powerBus: {
    busVoltageV: number;
    busCurrentA: number;
    batteryDODPct: number;
    packTempC: number;
    whRemaining: number;
  };
  attitude: {
    rollDeg: number;
    pitchDeg: number;
    yawDeg: number;
    starTrackerLock: boolean;
    quaternion: [number, number, number, number];
  };
}

export interface PayloadTask {
  id: string;
  satId: string;
  satName: string;
  targetName: string;
  targetLat: number;
  targetLng: number;
  sensorMode: 'MULTISPECTRAL_4K' | 'HYPERSPECTRAL_16CH' | 'SAR_STRIPMAP' | 'THERMAL_INFRARED';
  gsdResolutionM: number;
  priority: 'CRITICAL' | 'HIGH' | 'ROUTINE';
  dataSizeGb: number;
  cloudCoverEstimatePct: number;
  downlinkStatus: 'QUEUED' | 'CAPTURED' | 'BUFFERED' | 'DOWNLINKING' | 'COMPLETED';
  downlinkProgressPct: number;
  acquisitionTimestamp: string;
}
