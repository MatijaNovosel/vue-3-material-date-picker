<template>
  <table :key="tableDate" class="date-picker-table date-picker-table--date">
    <thead>
      <tr>
        <th v-for="(d, i) in weekDays" :key="i">
          {{ d }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(r, i) in rows" :key="i">
        <td v-for="(d, j) in r" :key="j">
          <button
            class="date-picker-table__current button"
            :style="tableDayStyle(d)"
            @click="emit('input', d)"
            v-if="d !== ''"
          >
            {{ formatter!(d) }}
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { createNativeLocaleFormatter, createRange } from "./helpers";
import { DatePickerAllowedDatesFunction } from "./models";

const emit = defineEmits<{
  (e: "input", value: string): void;
}>();

const props = defineProps<{
  localeFirstDayOfYear?: string | number;
  firstDayOfWeek?: string | number;
  showAdjacentMonths?: boolean;
  allowedDates?: DatePickerAllowedDatesFunction;
  disabled?: boolean;
  events?: any[] | Function | Object;
  eventColor?: any[] | Function | Object | string;
  range?: boolean;
  readonly?: boolean;
  tableDate: string;
  value?: string | string[];
  currentLocale?: string;
  color?: string;
}>();

const currentDate = computed(() => new Date().toISOString().substring(0, 10));

const formatter = createNativeLocaleFormatter(
  props.currentLocale,
  { day: "numeric", timeZone: "UTC" },
  { start: 8, length: 2 }
);

const weekdayFormatter = createNativeLocaleFormatter(props.currentLocale, {
  weekday: "narrow",
  timeZone: "UTC"
});

const weekDays = computed(() => {
  const first = parseInt((props.firstDayOfWeek || 0).toString(), 10);
  return weekdayFormatter
    ? createRange(7).map((i) => weekdayFormatter!(`2017-01-${first + i + 15}`)) // 2017-01-15 is Sunday
    : createRange(7).map(
        (i) => ["S", "M", "T", "W", "T", "F", "S"][(i + first) % 7]
      );
});

const displayedMonth = computed(
  () => Number(props.tableDate.split("-")[1]) - 1
);

const displayedYear = computed(() => Number(props.tableDate.split("-")[0]));

const tableDayStyle = (d: string) => {
  const res = {};

  if (isSelected(d)) {
    //
  }

  return res;

  return {
    [`bg-${props.color || "accent"}`]: isSelected(d),
    "bg-green-lighten-3 text-white": d === currentDate.value && !isSelected(d)
  };
};

const weekDaysBeforeFirstDayOfTheMonth = () => {
  const firstDayOfTheMonth = new Date(
    `${displayedYear.value}-${(displayedMonth.value + 1)
      .toString()
      .padStart(2, "0")}-01T00:00:00+00:00`
  );
  const weekDay = firstDayOfTheMonth.getUTCDay();
  return (weekDay - parseInt((props.firstDayOfWeek || 0).toString()) + 7) % 7;
};

const isSelected = (value: string) => {
  if (Array.isArray(props.value)) {
    if (props.range && props.value.length === 2) {
      const [from, to] = [...props.value].sort();
      return from <= value && value <= to;
    } else {
      return props.value.indexOf(value) !== -1;
    }
  }
  return value === props.value;
};

const rows = computed(() => {
  const rows: string[][] = [];
  let row = [];
  const daysInMonth = new Date(
    displayedYear.value,
    displayedMonth.value + 1,
    0
  ).getDate();
  let day = weekDaysBeforeFirstDayOfTheMonth();
  const prevMonthYear = displayedMonth.value
    ? displayedYear.value
    : displayedYear.value - 1;
  const prevMonth = (displayedMonth.value + 11) % 12;
  const firstDayFromPreviousMonth = new Date(
    displayedYear.value,
    displayedMonth.value,
    0
  ).getDate();
  const cellsInRow = 7;
  const nextMonthYear =
    displayedMonth.value === 11 ? displayedYear.value + 1 : displayedYear.value;
  const nextMonth = (displayedMonth.value + 1) % 12;
  let nextMonthDay = 1;

  // Days before current month
  while (day--) {
    const date = `${prevMonthYear}-${(prevMonth + 1)
      .toString()
      .padStart(2, "0")}-${(firstDayFromPreviousMonth - day)
      .toString()
      .padStart(2, "0")}`;
    row.push(props.showAdjacentMonths ? date : "");
  }

  // Days in current month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${displayedYear.value}-${(displayedMonth.value + 1)
      .toString()
      .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    row.push(date);
    if (row.length % cellsInRow === 0) {
      rows.push(row);
      row = [];
    }
  }

  // Days after current month
  while (row.length < cellsInRow) {
    const date = `${nextMonthYear}-${(nextMonth + 1)
      .toString()
      .padStart(2, "0")}-${(nextMonthDay++).toString().padStart(2, "0")}`;
    row.push(props.showAdjacentMonths ? date : "");
  }

  if (row.length) rows.push(row);

  return rows;
});
</script>

<style lang="sass" scoped>
@import "./variables.scss"

.date-picker-table
  position: relative
  padding: $date-picker-table-padding
  height: $date-picker-table-height

  table
    transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1)
    top: 0
    table-layout: fixed
    width: 100%

  td, th
    text-align: center
    position: relative

  th
    font-size: $date-picker-table-font-size
    color: rgba(0,0,0,.38)

  &--date .button
    height: $date-picker-table-date-button-height
    width: $date-picker-table-date-button-width

  .button
    z-index: auto
    margin: 0
    font-size: $date-picker-table-font-size

    &.button--active
      color: $date-picker-table-active-date-color

.date-picker-table--date
  th
    padding: $date-picker-table-date-padding
    font-weight: $date-picker-table-date-font-weight

  td
    width: $date-picker-table-date-width

.date-picker-table__events
  height: $date-picker-event-size
  left: 0
  position: absolute
  text-align: center
  white-space: pre
  width: 100%

  > div
    border-radius: $date-picker-event-border-radius
    display: inline-block
    height: $date-picker-event-size
    margin: $date-picker-event-margin
    width: $date-picker-event-size

.date-picker-table--date .date-picker-table__events
  bottom: $date-picker-event-month-bottom

.date-picker-table--month .date-picker-table__events
  bottom: $date-picker-event-date-bottom

.date-picker-table__current .date-picker-table__events
  margin-bottom: -1px

.date-picker-table--disabled
  pointer-events: none
</style>
