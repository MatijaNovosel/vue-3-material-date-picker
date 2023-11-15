<template>
  <div style="display: flex">
    <date-picker
      :multiple="multiple"
      :selected-items-text-formatter="(n) => `${n} dates selected`"
      :first-day-of-week="1"
      :locale="locale"
      v-model="date"
    />
    <div style="margin-left: 30px">
      {{ JSON.stringify(date) }}
      <button @click="changeDate" style="margin-left: 5px">Change</button>
      <button @click="changeLocale" style="margin-left: 5px">Change ss</button>
      <input type="checkbox" v-model="multiple" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import datePicker from "./components/datePicker.vue";

const date = ref(new Date().toISOString().substring(0, 10));
const locale = ref("en-US");
const multiple = ref(false);

const changeDate = () => {
  date.value = "2023-09-23";
};

const changeLocale = () => {
  locale.value = "hr-HR";
};
</script>
