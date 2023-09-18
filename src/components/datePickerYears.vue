<template>
  <ul class="date-picker-years" ref="yearList">
    <li
      :class="{
        active: parseInt(value.toString(), 10) === year
      }"
      v-for="year in years"
      :key="year"
      @click="emit('input', year)"
    >
      {{ formatter!(year.toString()) }}
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { createNativeLocaleFormatter } from "./helpers";

const emit = defineEmits<{
  (e: "input", value: number): void;
}>();

const yearList = ref<HTMLElement | null>(null);

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    readonly?: boolean;
    value: string | number;
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
  { year: "numeric", timeZone: "UTC" },
  { length: 4 }
);

const years = computed(() => {
  const children = [];
  const selectedYear = props.value
    ? parseInt(props.value.toString(), 10)
    : new Date().getFullYear();
  const maxYear = selectedYear + 100;
  const minYear = Math.min(maxYear, selectedYear - 100);

  for (let year = maxYear; year >= minYear; year--) {
    children.push(year);
  }

  return children;
});

onMounted(() => {
  setTimeout(() => {
    yearList.value!.scrollTop =
      yearList.value!.scrollHeight / 2 - yearList.value!.offsetHeight / 2;
  }, 200);
});
</script>

<style lang="sass" scoped>
@import './variables.scss'

.date-picker-years
  font-size: $date-picker-years-font-size
  font-weight: $date-picker-years-font-weight
  height: $date-picker-years-portrait-height
  list-style-type: none
  overflow: auto
  text-align: $date-picker-years-item-align

  &.date-picker-years
    padding: 0

  li
    cursor: pointer
    padding: $date-picker-years-item-padding
    transition: none

    &.active
      font-size: $date-picker-years-active-font-size
      font-weight: $date-picker-years-active-font-weight
      padding: $date-picker-years-active-padding
      color: v-bind(color) !important

    &:hover
      background: $date-picker-years-item-hover-background
</style>
