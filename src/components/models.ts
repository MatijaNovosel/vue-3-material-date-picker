export type ActivePicker = "DATE" | "MONTH" | "YEAR";
export type DatePickerType = "date" | "month";
export type DatePickerValue = string | string[] | undefined;
export type DatePickerFormatter = (date: string) => string;
export type DatePickerAllowedDatesFunction = (date: string) => boolean;
export type DatePickerEventColorValue = string | string[];
export type DatePickerEventColors =
  | DatePickerEventColorValue
  | Record<string, DatePickerEventColorValue>
  | ((date: string) => DatePickerEventColorValue);
export type DatePickerEvents =
  | string[]
  | ((date: string) => boolean | DatePickerEventColorValue)
  | Record<string, DatePickerEventColorValue>;

export interface SubstrOptions {
  start?: number;
  length: number;
}
