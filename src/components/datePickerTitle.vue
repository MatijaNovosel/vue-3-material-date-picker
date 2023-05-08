<template>
  <div class="v-date-picker-title v-picker__title" :class="classes">
    <div
      :class="titleClasses"
      class="v-picker__title__btn v-date-picker-title__year"
      @click="emit('select-year', true)"
    >
      {{ year }}
      <v-icon v-if="yearIcon">
        {{ yearIcon }}
      </v-icon>
    </div>
    <div
      :class="titleDateClasses"
      class="v-picker__title__btn v-date-picker-title__date"
      @click="emit('select-year', false)"
    >
      <transition name="picker-transition">
        <div :key="date">
          {{ date }}
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

const emit = defineEmits<{
  (e: "select-year", value: boolean): void;
}>();

const props = defineProps<{
  date?: string;
  disabled?: boolean;
  readonly?: boolean;
  selectingYear?: boolean;
  value?: string;
  year?: number | string;
  yearIcon?: string;
  color?: string;
}>();

const classes = computed(() => ({
  // TODO: Treba handlati druge načine predaje boja osim vuetify klasa, npr. hex
  [`bg-${props.color}` || "bg-accent"]: true
}));

const titleClasses = computed(() => ({
  "v-picker__title__btn--active": props.selectingYear,
  "v-picker__title__btn--readonly": props.readonly
}));

const titleDateClasses = computed(() => ({
  "v-picker__title__btn--active": !props.selectingYear,
  "v-picker__title__btn--readonly": props.readonly
}));
</script>

<style lang="sass" scoped>
@import './variables.scss'
@import './transitions.scss'

.v-date-picker-title
  display: flex
  justify-content: space-between
  flex-direction: column
  flex-wrap: wrap
  line-height: 1

  &__year
    align-items: center
    display: inline-flex
    font-size: $date-picker-title-year-font-size
    font-weight: $date-picker-title-year-font-weight
    margin-bottom: $date-picker-title-year-bottom-margin

  &__date
    font-size: $date-picker-title-date-font-size
    text-align: left
    font-weight: $date-picker-title-date-font-weight
    position: relative
    overflow: hidden
    padding-bottom: 8px
    margin-bottom: -8px

    > div
      position: relative

  &--disabled
    pointer-events: none

.v-picker
  border-radius: $picker-border-radius
  contain: layout style
  display: inline-flex
  flex-direction: column
  font-size: $picker-font-size
  vertical-align: top
  position: relative

  &__title
    color: white
    border-top-left-radius: $picker-border-radius
    border-top-right-radius: $picker-border-radius
    padding: $picker-title-padding

    &__btn
      transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1)

      &:not(.v-picker__title__btn--active)
        opacity: $picker-inactive-btn-opacity
        cursor: pointer

        &:hover:not(:focus)
          opacity: 1

.v-picker--full-width
  display: flex
  width: 100%

  > .v-picker__body
    margin: initial

.v-picker__title__btn--readonly
  pointer-events: none

.v-picker__title__btn--active
    opacity: $picker-active-btn-opacity
</style>
