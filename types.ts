
export enum LandmarkType {
  EIFFEL_TOWER = 'EIFFEL_TOWER',
  COLOSSEUM = 'COLOSSEUM',
  PYRAMIDS = 'PYRAMIDS',
  N_SEOUL_TOWER = 'N_SEOUL_TOWER',
  SUNGNYEMUN = 'SUNGNYEMUN',
  EMPIRE_STATE = 'EMPIRE_STATE',
  SAGRADA_FAMILIA = 'SAGRADA_FAMILIA',
  OPERA_HOUSE = 'OPERA_HOUSE'
}

export enum SimulationState {
  IDLE = 'IDLE',
  BUILDING = 'BUILDING',
  READY = 'READY',
  BREAKING = 'BREAKING'
}

export interface VoxelData {
  id: string;
  x: number;
  y: number;
  z: number;
  color: string;
}

export interface LandmarkInfo {
  id: LandmarkType;
  name: string;
  country: string;
  description: string;
  primaryColor: string;
}
