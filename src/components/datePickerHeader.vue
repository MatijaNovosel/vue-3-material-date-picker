<template>
  <div class="v-date-picker-header" :class="classes">
    <v-btn
      icon
      variant="flat"
      density="compact"
      @click="emit('input', calculateChange(-1))"
    >
      <v-icon> mdi-chevron-left </v-icon>
    </v-btn>
    <div class="v-date-picker-header__value">
      <v-btn variant="plain" @click="emit('toggle')">
        {{ formatter!(value.toString()) }}
      </v-btn>
    </div>
    <v-btn
      icon
      variant="flat"
      density="compact"
      @click="emit('input', calculateChange(1))"
    >
      <v-icon> mdi-chevron-right </v-icon>
    </v-btn>
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
  "v-date-picker-header--disabled": props.disabled
}));

const calculateChange = (sign: number) => {
  const [year, month] = String(props.value).split("-").map(Number);
  if (month == null) return `${year + sign}`;
  else return monthChange(String(props.value), sign);
};
</script>

<style lang="sass" scoped>
@import "./variables.scss"

.v-date-picker-header
  padding: $date-picker-header-padding

  align-items: center
  display: flex
  justify-content: space-between
  position: relative

  .v-btn
    margin: 0
    z-index: auto

  .v-icon
    cursor: pointer
    user-select: none

.v-date-picker-header__value
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

.v-date-picker-header--disabled
  pointer-events: none
</style>
