<div align="center">
  <img src="https://user-images.githubusercontent.com/36193643/236633388-ab400a17-41ba-42a4-a06c-05d62349def2.png" />
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
import { DatePicker } from "vue-material-date-picker";
import "vue-material-date-picker/dist/style.css";
const date = ref(new Date().toISOString().substring(0, 10));
</script>
```

## 📃 Props

| Name      | Type       | Default | Description            |
| --------- | ---------- | ------- | ---------------------- |
| `v-model` | `number[]` |         | Standard two way input |
