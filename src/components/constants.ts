export const DAYS_IN_MONTH_LEAP: number[] = [
  0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
];

export const DAYS_IN_MONTH: number[] = [
  0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
];

export const titleFormats: Record<string, Intl.DateTimeFormatOptions> = {
  year: { year: "numeric", timeZone: "UTC" },
  month: { month: "long", timeZone: "UTC" },
  date: { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" },
};
