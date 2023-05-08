<template>
  <div style="display: flex">
    <date-picker
      max="2020-04-12"
      min="2020-01-24"
      locale="en-us"
      v-model="date"
    />
    {{ date }}
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import datePicker from "./components/datePicker.vue";

const date = ref(new Date().toISOString().substring(0, 10));
</script>
