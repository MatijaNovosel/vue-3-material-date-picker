<template>
  <div class="date-picker-header" :class="classes">
    <button class="button" @click="emit('input', calculateChange(-1))">
      &lt;
    </button>
    <div class="date-picker-header__value">
      <button class="button" @click="emit('toggle')">
        {{ formatter!(value.toString()) }}
      </button>
    </div>
    <button class="button" @click="emit('input', calculateChange(1))">
      &gt;
    </button>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { createNativeLocaleFormatter, monthChange } from "./helpers";

const emit = defineEmits<{
  (e: "input", value: string): void;
  (e: "toggle"): void;
}>();

const props = defineProps<{
  disabled?: boolean;
  min?: string;
  max?: string;
  nextAriaLabel?: string;
  nextIcon?: string;
  prevAriaLabel?: string;
  prevIcon?: string;
  readonly?: boolean;
  currentLocale?: string;
  color?: string;
  value: number | string;
}>();

const formatter = computed(() => {
  if (String(props.value).split("-")[1]) {
    return createNativeLocaleFormatter(
      props.currentLocale || "en-us",
      { month: "long", year: "numeric", timeZone: "UTC" },
      { length: 7 }
    );
  } else {
    return createNativeLocaleFormatter(
      props.currentLocale || "en-us",
      { year: "numeric", timeZone: "UTC" },
      { length: 4 }
    );
  }
});

const classes = computed(() => ({
  "date-picker-header--disabled": props.disabled
}));

const calculateChange = (sign: number) => {
  const [year, month] = String(props.value).split("-").map(Number);
  if (month == null) return `${year + sign}`;
  else return monthChange(String(props.value), sign);
};
</script>

<style lang="sass" scoped>
@import "./variables.scss"

.date-picker-header
  padding: $date-picker-header-padding

  align-items: center
  display: flex
  justify-content: space-between
  position: relative

  .button
    margin: 0
    z-index: auto

  .v-icon
    cursor: pointer
    user-select: none

.date-picker-header__value
  flex: 1
  text-align: center
  position: relative
  overflow: hidden

  div
    transition: $date-picker-header-value-transition
    width: 100%

  button
    cursor: pointer
    font-weight: $date-picker-header-button-font-weight
    outline: none
    padding: $date-picker-header-button-padding
    transition: $date-picker-header-button-transition

.date-picker-header--disabled
  pointer-events: none
</style>
