// -2 - Unloaded
// -1 - Loading
// 1 - Loaded
// 2 - Error
export type ProgressState = -2 | -1 | 1 | 2;

export interface Settings {
  numberState: number;
  selectState: string;
  textState: string;
}

export interface Option {
  label: string;
  value: string;
}
