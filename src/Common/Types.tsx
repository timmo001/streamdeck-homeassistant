// -2 - Unloaded
// -1 - Loading
// 1 - Loaded
// 2 - Error
export type ProgressState = -2 | -1 | 1 | 2;

// -2 - Unloaded
// -1 - Loading
// 0 - Loaded
// 1 - Invalid Authentication
// 2 - Auth Error
// 3 - Connection Lost
// 4 - Host Required
// 5 - Invalid HTTPS to HTTP (HTTPS URL Required)
// 6 - Unknown Error
export type HassConnectionState = -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface GenericObject {
  [key: string]: any;
}

export interface Option {
  label: string;
  value: string;
}

export interface GlobalSettings {
  haConnection?: SettingHaConnection;
}

export interface Settings {
  haEntity?: string;
  haValue?: string | number | number[] | object;
  haValue2?: string | number | number[] | object;
  wrap?: boolean;
}

export interface SettingHaConnection {
  name: string;
  authToken: string;
  url: string;
}
