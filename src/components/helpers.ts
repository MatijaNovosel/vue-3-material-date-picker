import {
  DAYS_IN_MONTH,
  DAYS_IN_MONTH_LEAP,
  SUBSTRING_TYPE_LEN
} from "./constants";
import {
  DatePickerAllowedDatesFunction,
  DatePickerFormatter,
  SubstrOptions
} from "./models";

const makeIsoString = (dateString: string) => {
  const [year, month, date] = dateString.trim().split(" ")[0].split("-");
  return [
    year.toString().padStart(4, "0"),
    (month || 1).toString().padStart(2, "0"),
    (date || 1).toString().padStart(2, "0")
  ].join("-");
};

export function createNativeLocaleFormatter(
  locale: string | undefined,
  options: Intl.DateTimeFormatOptions,
  substrOptions: SubstrOptions = { start: 0, length: 0 }
): DatePickerFormatter | undefined {
  try {
    const intlFormatter = new Intl.DateTimeFormat(locale || undefined, options);
    return (dateString: string) =>
      intlFormatter.format(
        new Date(`${makeIsoString(dateString)}T00:00:00+00:00`)
      );
  } catch (e) {
    return substrOptions.start || substrOptions.length
      ? (dateString: string) =>
          makeIsoString(dateString).substring(
            substrOptions.start || 0,
            substrOptions.length
          )
      : undefined;
  }
}

export function isDateAllowed(
  date: string,
  min: string,
  max: string,
  allowedFn: DatePickerAllowedDatesFunction | undefined
) {
  return (
    (!allowedFn || allowedFn(date)) &&
    (!min || date >= min.substring(0, 10)) &&
    (!max || date <= max)
  );
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInMonth(year: number, month: number) {
  return isLeapYear(year) ? DAYS_IN_MONTH_LEAP[month] : DAYS_IN_MONTH[month];
}

function createUTCDate(year: number, month = 0, day = 1) {
  let date;
  if (year < 100 && year >= 0) {
    date = new Date(Date.UTC(year, month, day));
    if (isFinite(date.getUTCFullYear())) {
      date.setUTCFullYear(year);
    }
  } else {
    date = new Date(Date.UTC(year, month, day));
  }

  return date;
}

function firstWeekOffset(
  year: number,
  firstDayOfWeek: number,
  firstDayOfYear: number
) {
  const firstWeekDayInFirstWeek = 7 + firstDayOfWeek - firstDayOfYear;
  const firstWeekDayOfYear =
    (7 +
      createUTCDate(year, 0, firstWeekDayInFirstWeek).getUTCDay() -
      firstDayOfWeek) %
    7;

  return -firstWeekDayOfYear + firstWeekDayInFirstWeek - 1;
}

function dayOfYear(
  year: number,
  month: number,
  day: number,
  firstDayOfWeek: number
) {
  let dayOfYear = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334][
    month
  ];
  if (month > 1 && isLeapYear(year)) dayOfYear++;
  return dayOfYear + day;
}

function weeksInYear(
  year: number,
  firstDayOfWeek: number,
  firstDayOfYear: number
) {
  const weekOffset = firstWeekOffset(year, firstDayOfWeek, firstDayOfYear);
  const weekOffsetNext = firstWeekOffset(
    year + 1,
    firstDayOfWeek,
    firstDayOfYear
  );
  const daysInYear = isLeapYear(year) ? 366 : 365;

  return (daysInYear - weekOffset + weekOffsetNext) / 7;
}

export function weekNumber(
  year: number,
  month: number,
  day: number,
  firstDayOfWeek: number,
  localeFirstDayOfYear: number
): number {
  const weekOffset = firstWeekOffset(
    year,
    firstDayOfWeek,
    localeFirstDayOfYear
  );
  const week = Math.ceil(
    (dayOfYear(year, month, day, firstDayOfWeek) - weekOffset) / 7
  );

  if (week < 1) {
    return week + weeksInYear(year - 1, firstDayOfWeek, localeFirstDayOfYear);
  } else if (week > weeksInYear(year, firstDayOfWeek, localeFirstDayOfYear)) {
    return week - weeksInYear(year, firstDayOfWeek, localeFirstDayOfYear);
  } else {
    return week;
  }
}

export const monthChange = (value: string, sign: number) => {
  const [year, month] = value.split("-").map(Number);
  if (month + sign === 0) {
    return `${year - 1}-12`;
  } else if (month + sign === 13) {
    return `${year + 1}-01`;
  } else {
    return `${year}-${(month + sign).toString().padStart(2, "0")}`;
  }
};

export function convertToUnit(
  str: string | number | null | undefined,
  unit = "px"
): string | undefined {
  if (str == null || str === "") {
    return undefined;
  } else if (isNaN(+str!)) {
    return String(str);
  } else {
    return `${Number(str)}${unit}`;
  }
}

export function createRange(length: number): number[] {
  return Array.from({ length }, (v, k) => k);
}

export function sanitizeDateString(
  dateString: string,
  type: "date" | "month" | "year"
): string {
  const [year, month = 1, date = 1] = dateString.split("-");
  return `${year}-${month.toString().padStart(2, "0")}-${date
    .toString()
    .padStart(2, "0")}`.substring(0, SUBSTRING_TYPE_LEN[type]);
}

export function wrapInArray<T>(v: T | T[] | null | undefined): T[] {
  return v != null && v != undefined ? (Array.isArray(v) ? v : [v]) : [];
}

export function capitalize(word: string | undefined) {
  if (!word) return word;
  return word[0].toUpperCase() + word.substr(1).toLowerCase();
}
