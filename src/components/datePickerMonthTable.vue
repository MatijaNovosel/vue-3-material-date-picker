<template>
  <table class="date-picker-table date-picker-table--month">
    <tbody>
      <tr v-for="(r, i) in rows" :key="i">
        <td v-for="(d, j) in r" :key="j">
          <div
            class="button"
            @click="emit('input', d)"
            :class="tableMonthClasses(d)"
          >
            {{ formatter!(d) }}
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { createNativeLocaleFormatter } from "./helpers";

const emit = defineEmits<{
  (e: "input", value: string): void;
}>();

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    readonly?: boolean;
    tableDate: string;
    value?: string | string[];
    range?: boolean;
    currentLocale?: string;
    color?: string;
  }>(),
  {
    color: "#2e79bd"
  }
);

const formatter = createNativeLocaleFormatter(
  props.currentLocale,
  { month: "short", timeZone: "UTC" },
  { start: 5, length: 2 }
);

const displayedYear = computed(() => Number(props.tableDate.split("-")[0]));
const currentDate = computed(() => new Date().toISOString().substring(0, 7));

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

const tableMonthClasses = (d: string) => {
  return {
    selected: isSelected(d),
    "current-month": d === currentDate.value && !isSelected(d)
  };
};

const rows = computed(() => {
  const res = [];
  const cols = Array(3).fill(null);
  const rows = 12 / cols.length;

  for (let row = 0; row < rows; row++) {
    const tds = cols.map((_, col) => {
      const month = row * cols.length + col;
      const date = `${displayedYear.value}-${(month + 1)
        .toString()
        .padStart(2, "0")}`;
      return date;
    });
    res.push(tds);
  }

  return res;
});
</script>

<style lang="sass" scoped>
@import "./variables.scss"

.selected
  background-color: v-bind(color)
  color: white
  border-radius: 4px
  font-weight: bold

.date-picker-table
  position: relative
  padding: $date-picker-table-padding
  height: $date-picker-table-height
  width: 100%

  table
    transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1)
    top: 0
    table-layout: fixed

  td, th
    text-align: center
    position: relative

  th
    font-size: $date-picker-table-font-size
    color: rgba(0,0,0,.38)

  .button
    z-index: auto
    margin: 0
    font-size: $date-picker-table-font-size
    cursor: pointer
    user-select: none
    text-transform: uppercase
    height: $date-picker-table-date-button-height
    display: flex
    align-items: center
    justify-content: center

    &.button--active
      color: $date-picker-table-active-date-color

.date-picker-table--month
  td
    width: 33.333333%
    height: $date-picker-table-month-height
    vertical-align: middle
    text-align: center

.date-picker-table--disabled
  pointer-events: none

.current-month
  border: 1px solid v-bind(color)
  box-sizing: border-box
  -moz-box-sizing: border-box
  -webkit-box-sizing: border-box
  border-radius: 6px
</style>
