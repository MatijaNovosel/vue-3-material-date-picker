<div align="center">
  <img src="https://github.com/MatijaNovosel/vue-3-material-date-picker/assets/36193643/952fa1cd-0ced-41f4-9b2e-933be46b1929" />
</div>

<h1 align=center>Vue material date picker</h1>
<p align=center>A material date picker component for Vue 3.</p>

## 🚀 Installation

Install using your package manager of choice:

```bash
yarn add vue-3-material-date-picker
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
import { DatePicker } from "vue-3-material-date-picker";
import "vue-3-material-date-picker/dist/style.css";

const date = ref(new Date().toISOString().substring(0, 10));

const changeDate = () => {
  date.value = "2023-09-23";
};
</script>
```

## 📃 Props

| Name                   | Type            | Default      | Description                                                                                                      |
| ---------------------- | --------------- | ------------ | ---------------------------------------------------------------------------------------------------------------- |
| `v-model`              | `string`        | null         | Standard two way input, must be passed as an ISO string (YYYY-mm-dd format e.g. 2023-04-23)                      |
| `min`                  | `string`        | 1970-01-01   | Allowed starting date, must be passed as an ISO string (YYYY-mm-dd format e.g. 2023-04-23)                       |
| `max`                  | `string`        | Current date | Allowed ending date, must be passed as an ISO string (YYYY-mm-dd format e.g. 2023-04-23)                         |
| `disabled`             | `boolean`       | false        | Makes the component uninteractable                                                                               |
| `readonly`             | `boolean`       | false        | Makes the component uninteractable, but without the style of the disabled variant                                |
| `width`                | `number/string` | 290px        | Sets the width of the element - can be provided as a string like "290px" or "290" or a number, defaults to 290px |
| `full-width`           | `boolean`       | false        | Ignores the previous `width` prop and sets the width to 100% of the parent container                             |
| `color`                | `string`        | #2e79bd      | Color of the various active component elements                                                                   |
| `first-day-of-week`    | `number/string` | 0            | Sets the first day of the week, starting with 0 for Sunday                                                       |
| `hide-title`           | `boolean`       | false        | Hide the picker title                                                                                            |
| `show-adjacent-months` | `boolean`       | false        | Toggles visibility of days from previous and next months                                                         |
| `locale`               | `string`        | undefined    | Sets the locale, accepts a string with a BCP 47 language tag e.g. en-us or hr-HR                                 |
| `allowed-dates`        | `function`      | null         | Restricts which dates can be selected                                                                            |

## 🎺 Events

| Name     | Type                     | Description                       |
| -------- | ------------------------ | --------------------------------- |
| `change` | `(date: string) => void` | Triggered when a date is selected |
