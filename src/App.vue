<template>
  <div style="display: flex">
    <date-picker
      max="2023-12-12"
      min="2020-01-24"
      :allowed-dates="(date) => parseInt(date.split('-')[2], 10) % 2 === 0"
      locale="en-us"
      v-model="date"
      disabled
    />
    <div style="margin-left: 30px">
      {{ date }}
      <button @click="changeDate" style="margin-left: 5px">Change</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import datePicker from "./components/datePicker.vue";

const date = ref(new Date().toISOString().substring(0, 10));

const changeDate = () => {
  date.value = "2023-09-23";
};
</script>
