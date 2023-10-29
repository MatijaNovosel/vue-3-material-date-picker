<template>
  <div :style="styles" class="date-picker">
    <date-picker-title
      v-if="!noTitle"
      :color="color"
      :date="pickerTitle"
      :year="paddedTableYear"
      :selecting-year="state.internalActivePicker === DATE_PICKER_MODE.year"
      @select-year="selectYear"
    />
    <date-picker-header
      v-if="
        [DATE_PICKER_MODE.date, DATE_PICKER_MODE.month].includes(
          state.internalActivePicker
        )
      "
      :color="color"
      :current-locale="props.locale"
      :value="
        state.internalActivePicker === DATE_PICKER_MODE.date
          ? `${paddedTableYear}-${(tableMonth + 1).toString().padStart(2, '0')}`
          : `${paddedTableYear}`
      "
      @input="(value: string) => state.tableDate = value"
      @toggle="
        state.internalActivePicker =
          state.internalActivePicker === DATE_PICKER_MODE.date
            ? DATE_PICKER_MODE.month
            : DATE_PICKER_MODE.year
      "
    />
    <date-picker-date-table
      v-if="state.internalActivePicker === DATE_PICKER_MODE.date"
      :value="modelValue"
      :show-adjacent-months="props.showAdjacentMonths"
      :allowed-dates="props.allowedDates"
      :readonly="props.readonly"
      :current-locale="props.locale"
      :first-day-of-week="props.firstDayOfWeek"
      :disabled="props.disabled"
      :min="props.min"
      :max="props.max"
      :color="color"
      :table-date="tableDate"
      @input="dateClick"
    />
    <date-picker-month-table
      v-else-if="state.internalActivePicker === DATE_PICKER_MODE.month"
      :value="selectedMonths"
      :color="color"
      :table-date="paddedTableYear"
      @input="monthClick"
    />
    <date-picker-years
      @input="yearClick"
      :value="tableYear"
      :color="color"
      v-else
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, watch } from "vue";
import {
  DATE_PICKER_MODE,
  SUBSTRING_TYPE_LEN,
  titleFormats
} from "./constants";
import DatePickerDateTable from "./datePickerDateTable.vue";
import DatePickerHeader from "./datePickerHeader.vue";
import DatePickerMonthTable from "./datePickerMonthTable.vue";
import DatePickerTitle from "./datePickerTitle.vue";
import DatePickerYears from "./datePickerYears.vue";
import {
  convertToUnit,
  createNativeLocaleFormatter,
  daysInMonth,
  isDateAllowed,
  sanitizeDateString,
  wrapInArray
} from "./helpers";
import {
  DatePickerAllowedDatesFunction,
  DatePickerEventColors,
  DatePickerEvents,
  DatePickerValue
} from "./models";

const emit = defineEmits<{
  (e: "update:modelValue", value: string | string[]): void;
  (e: "change", value: string | string[]): void;
}>();

const props = withDefaults(
  defineProps<{
    allowedDates?: DatePickerAllowedDatesFunction;
    disabled?: boolean;
    events?: DatePickerEvents;
    eventColor?: DatePickerEventColors;
    firstDayOfWeek?: string | number;
    max: string;
    min: string;
    multiple?: boolean;
    range?: boolean;
    readonly?: boolean;
    showCurrent?: boolean | string;
    selectedItemsTextFormatter?: (n: number) => string;
    showAdjacentMonths?: boolean;
    modelValue: DatePickerValue;
    locale?: string;
    fullWidth?: boolean;
    noTitle?: boolean;
    width?: number | string;
    color?: string;
  }>(),
  {
    color: "#2e79bd",
    min: "1970-01-01",
    max: new Date().toISOString().substring(0, 10)
  }
);

const styles = computed(() => ({
  width: props.fullWidth ? undefined : convertToUnit(props.width || 290)
}));

const pickerTitle = computed(() =>
  (formatters.value.titleDate as (value: any) => string)!(
    isMultiple.value ? multipleValue.value : props.modelValue
  )
);

const now = new Date();

const state = reactive({
  internalActivePicker: DATE_PICKER_MODE.date,
  inputDay: null as number | null,
  inputMonth: null as number | null,
  inputYear: null as number | null,
  isReversing: false,
  tableDate: now.toISOString().substring(0, 10)
});

const multipleValue = computed(() => wrapInArray(props.modelValue));

const isMultiple = computed(() => props.multiple || props.range);

const lastValue = computed(() =>
  isMultiple.value
    ? multipleValue.value[multipleValue.value.length - 1]
    : (props.modelValue as string | null)
);

const selectedMonths = computed(() => {
  if (!props.modelValue) {
    return props.modelValue;
  } else if (isMultiple.value) {
    return multipleValue.value.map((val) => val.substring(0, 7));
  } else {
    return (props.modelValue as string).substring(0, 7);
  }
});

const inputDate = computed(
  () =>
    `${state.inputYear}-${(state.inputMonth! + 1)
      .toString()
      .padStart(2, "0")}-${state.inputDay!.toString().padStart(2, "0")}`
);

const tableMonth = computed(() => Number(state.tableDate.split("-")[1]) - 1);

const tableDate = computed(
  () =>
    `${paddedTableYear.value}-${(tableMonth.value + 1)
      .toString()
      .padStart(2, "0")}`
);

const tableYear = computed(() => Number(state.tableDate.split("-")[0]));

const paddedTableYear = computed(() =>
  tableYear.value.toString().padStart(4, "0")
);

const minMonth = computed(() =>
  props.min ? sanitizeDateString(props.min, "month") : null
);

const maxMonth = computed(() =>
  props.max ? sanitizeDateString(props.max, "month") : null
);

const minYear = computed(() =>
  props.min ? sanitizeDateString(props.min, "year") : null
);

const maxYear = computed(() =>
  props.max ? sanitizeDateString(props.max, "year") : null
);

const formatters = computed(() => ({
  year: createNativeLocaleFormatter(
    props.locale,
    { year: "numeric", timeZone: "UTC" },
    { length: 4 }
  ),
  titleDate: isMultiple.value
    ? defaultTitleMultipleDateFormatter.value
    : defaultTitleDateFormatter.value
}));

const defaultTitleMultipleDateFormatter = computed(() => (dates: string[]) => {
  if (!dates.length) return "-";
  if (dates.length === 1) return defaultTitleDateFormatter.value!(dates[0]);
  if (props.selectedItemsTextFormatter) {
    return props.selectedItemsTextFormatter(dates.length);
  }
  return `Selected ${dates.length} dates`;
});

const defaultTitleDateFormatter = computed(() =>
  createNativeLocaleFormatter(props.locale, titleFormats["date"], {
    start: 0,
    length: SUBSTRING_TYPE_LEN["date"]
  })
);

const emitInput = (newInput: string) => {
  if (props.range) {
    if (multipleValue.value.length !== 1) {
      emit("update:modelValue", [newInput]);
    } else {
      const output = [multipleValue.value[0], newInput];
      emit("update:modelValue", output);
      emit("change", output);
    }
    return;
  }

  const output = props.multiple
    ? multipleValue.value.indexOf(newInput) === -1
      ? multipleValue.value.concat([newInput])
      : multipleValue.value.filter((x) => x !== newInput)
    : newInput;

  emit("update:modelValue", output);
  props.multiple || emit("change", newInput);
};

const checkMultipleProp = () => {
  if (props.modelValue == null) return;
  const valueType = props.modelValue.constructor.name;
  const expected = isMultiple.value ? "Array" : "String";
  if (valueType !== expected) {
    console.warn(
      `Value must be ${
        isMultiple.value ? "an" : "a"
      } ${expected}, got ${valueType}`
    );
  }
};

const yearClick = (value: number) => {
  state.inputYear = value;
  state.tableDate = `${value}-${((tableMonth.value || 0) + 1)
    .toString()
    .padStart(2, "0")}`;
  state.internalActivePicker = DATE_PICKER_MODE.month;
  if (
    !props.readonly &&
    !isMultiple.value &&
    isDateAllowed(inputDate.value, props.min, props.max, props.allowedDates)
  ) {
    emit("update:modelValue", inputDate.value);
  }
};

const monthClick = (value: string) => {
  state.inputYear = parseInt(value.split("-")[0], 10);
  state.inputMonth = parseInt(value.split("-")[1], 10) - 1;
  if (state.inputDay) {
    state.inputDay = Math.min(
      state.inputDay,
      daysInMonth(state.inputYear, state.inputMonth + 1)
    );
  }
  state.tableDate = value;
  state.internalActivePicker = DATE_PICKER_MODE.date;
  if (
    !props.readonly &&
    !isMultiple.value &&
    isDateAllowed(inputDate.value, props.min, props.max, props.allowedDates)
  ) {
    emit("update:modelValue", inputDate.value);
  }
};

const dateClick = (value: string) => {
  state.inputYear = parseInt(value.split("-")[0], 10);
  state.inputMonth = parseInt(value.split("-")[1], 10) - 1;
  state.inputDay = parseInt(value.split("-")[2], 10);
  emitInput(inputDate.value);
};

const setInputDate = () => {
  if (lastValue.value) {
    const array = lastValue.value.split("-");
    state.inputYear = parseInt(array[0], 10);
    state.inputMonth = parseInt(array[1], 10) - 1;
    state.inputDay = parseInt(array[2], 10);
  } else {
    state.inputYear = state.inputYear || now.getFullYear();
    state.inputMonth =
      state.inputMonth == null ? state.inputMonth : now.getMonth();
    state.inputDay = state.inputDay || now.getDate();
  }
};

const selectYear = (value: boolean) => {
  state.internalActivePicker = value
    ? DATE_PICKER_MODE.year
    : DATE_PICKER_MODE.date;
};

watch(
  () => props.modelValue,
  (val) => {
    checkMultipleProp();
    setInputDate();
    if (
      (!isMultiple.value && props.modelValue) ||
      (isMultiple.value && multipleValue.value.length && (!val || !val.length))
    ) {
      state.tableDate = sanitizeDateString(inputDate.value, "month");
    }
  }
);

onMounted(() => {
  const multipleValue = wrapInArray(props.modelValue);
  const date =
    multipleValue[multipleValue.length - 1] ||
    (typeof props.showCurrent === "string"
      ? props.showCurrent
      : `${now.getFullYear()}-${now.getMonth() + 1}`);
  state.tableDate = sanitizeDateString(date as string, "month");
});
</script>

<style lang="sass" scoped>
.date-picker
  font-family: "Roboto"
</style>
