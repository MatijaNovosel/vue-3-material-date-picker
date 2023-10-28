<div align="center">
  <img src="https://github.com/MatijaNovosel/vue-material-date-picker/assets/36193643/05c61e60-55b3-479f-bfb1-947f0fd1433e" />
</div>

<h1 align=center>Vue material date picker</h1>
<p align=center>A material date picker component for Vue 3.</p>

## 🚀 Installation

Install using your package manager of choice:

```bash
yarn add vue-material-date-picker
```

## ⚙️ Usage

Import the component locally or define it globally and include the css file:

```vue
<template>
  <div style="display: flex">
    <date-picker
      max="2023-12-12"
      min="2020-01-24"
      :first-day-of-week="1"
      :allowed-dates="(date) => parseInt(date.split('-')[2], 10) % 2 === 0"
      locale="en-us"
      v-model="date"
    />
    <div style="margin-left: 30px">
      {{ date }}
      <button @click="changeDate" style="margin-left: 5px">Change</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { DatePicker } from "vue-material-date-picker";
import "vue-material-date-picker/dist/style.css";

const date = ref(new Date().toISOString().substring(0, 10));

const changeDate = () => {
  date.value = "2023-09-23";
};
</script>
```

## 📃 Props

| Name      | Type       | Default | Description            |
| --------- | ---------- | ------- | ---------------------- |
| `v-model` | `number[]` |         | Standard two way input |
