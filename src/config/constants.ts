import { bridgeObjType } from './../global.types';
export const geoserverApiUrl = '/api-geoserver';
export const skdfApiUrl = '/api-skdf';
export const pgApiUrl = '/api-pg';
export const imageApiUrl = '/api-image';
export const pgGraphApiUrl = '/api-pg-graph';
export const pgApiSkdfUrl = '/api2-pg-skdf';

export const start = 0;
export const limit = 10;
export const publicSchemaHeader = { headers: { 'Content-Profile': 'gis_api_public' } };
export const diagSchemaHeaders = { headers: { 'Content-Profile': 'diag', 'Accept-Profile': 'diag' } };
export const commandSchemaHeader = { headers: { 'Content-Profile': 'command_api' } };
export const baseGisSchemaHeader = { headers: { 'Content-Profile': 'base_gis' } };
export const commandSchemaHeaderOctetStream = {
  headers: { 'Content-Profile': 'command_api', 'Content-Type': 'application/octet-stream', 'Accept-Profile': 'command_api' },
};
export const commandapiSchemaHeader = {
  headers: { 'Content-Profile': 'command_api', 'Accept-Profile': 'command_api', Accept: 'text/plain' },
};
export const privateSchemaHeader = { headers: { 'Content-Profile': 'gis_api_private' } };
export const querySchemaHeader = { headers: { 'Content-Profile': 'query_api' } };
export const gisSchemaHeader = { headers: { 'Content-Profile': 'gis', 'Accept-Profile': 'gis' } };
export const gisapiSchemaHeader = { headers: { 'Content-Profile': 'gis_api', 'Accept-Profile': 'gis_api' } };
export const hwmSchemaHeader = { headers: { 'Content-Profile': 'hwm', 'Accept-Profile': 'hwm' } };
//export const commandapiSchemaHeader = { headers: { 'Content-Profile': 'command_api', 'Accept-Profile': 'command_api' } };
export const cmnPublicShemaHeader = { headers: { 'Content-Profile': 'cmn_public' } };
// 3 - Районы - districts
// 4 - Город - cities
// 6 - Населенные пункты - towns
// 65 - Планировочные структуры - planningStructures

export const districtsDicFilterCode = '3';
export const citiesDicFilterCode = '4';
export const townsDicFilterCode = '6';
export const planningStructuresDicFilterCode = '65';

export enum ApplicationModes {
  mapMode,
  panoramaMode,
  lidarMode,
}

export type ApplicationMode = keyof typeof ApplicationModes;

export const defaultBridgeObj: bridgeObjType = {
  FULL_NAME: 'Нет данных',
  TYPE_NAME: '',
  TYPE: null,
  BRIDGE_TYPE_1: null,
  BRIDGE_TYPE_1_NAME: 'Нет данных',
  START: 'Нет данных',
  FINISH: 'Нет данных',
  GEOM: null,
  OBSTACLE_NAME: 'Нет данных',
  TYPE_OF_OBSTACLE: null,
  TYPE_OF_OBSTACLE_NAME: 'Нет данных',
  LENGTH: null,
  TECHNICAL_CONDITION: null,
  TECHNICAL_CONDITION_NAME: 'Нет данных',
  REGION: null,
  REGION_NAME: 'Нет данных',
  OWNER: null,
  OWNER_NAME: 'Нет данных',
};

export const defaultBridgeObjWithoutName: bridgeObjType = {
  FULL_NAME: '',
  TYPE: null,
  BRIDGE_TYPE_1: null,
  START: '',
  FINISH: '',
  GEOM: null,
  TYPE_OF_OBSTACLE: null,
  LENGTH: '',
  TECHNICAL_CONDITION: null,
  REGION: null,
  OWNER: null,
};
