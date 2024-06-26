<div align="center">
  <img src="https://github.com/MatijaNovosel/vue-3-material-date-picker/assets/36193643/424ba8ee-5745-4efd-a411-80449424d149" />
</div>

<h1 align=center>Vue material date picker</h1>
<p align=center>A material date picker component for Vue 3.</p>

## 🚀 Installation

Install using your package manager of choice:

```bash
yarn add vue-3-material-date-picker
```

## ✨ Features

- Multiple date selection

<div align="center">
  <img src="https://github.com/MatijaNovosel/vue-3-material-date-picker/assets/36193643/2ce3f107-2213-47fa-8ad7-2f875cdc6f78" />
</div>

- Customizable and themable

<div align="center">
  <img src="https://github.com/MatijaNovosel/vue-3-material-date-picker/assets/36193643/f1c46ab5-aba4-4a36-ba2c-dce3a32aef19" />
</div>

- Can be changed to any locale on the fly

<div align="center">
  <img src="https://github.com/MatijaNovosel/vue-3-material-date-picker/assets/36193643/2d6270b5-e356-4404-ba19-668fd54a0c4b" />
</div>

## 📺 Demo

https://matija-components.vercel.app/date-picker

## ⚙️ Usage

Import the component locally or define it globally and include the css file:

```vue
<template>
  <div style="display: flex">
    <date-picker
      multiple
      :selected-items-text-formatter="(n) => `${n} dates selected`"
      :first-day-of-week="1"
      :allowed-dates="(date) => parseInt(date.split('-')[2], 10) % 2 === 0"
      :locale="locale"
      v-model="date"
    />
    <div style="margin-left: 30px">
      {{ date }}
      <button @click="changeDate" style="margin-left: 5px">Change</button>
      <button @click="changeLocale" style="margin-left: 5px">
        Change locale
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { DatePicker } from "vue-3-material-date-picker";
import "vue-3-material-date-picker/dist/style.css";

const date = ref(new Date().toISOString().substring(0, 10));
const locale = ref("en-US");

const changeDate = () => {
  date.value = "2023-09-23";
};

const changeLocale = () => {
  locale.value = "hr-HR";
};
</script>
```

## 📃 Props

| Name                            | Type                                   | Default             | Description                                                                                                      |
| ------------------------------- | -------------------------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `v-model`                       | `string/string[]`                      | null                | Standard two way input, must be passed as an ISO string (YYYY-mm-dd format e.g. 2023-04-23)                      |
| `min`                           | `string`                               | 1970-01-01          | Allowed starting date, must be passed as an ISO string (YYYY-mm-dd format e.g. 2023-04-23)                       |
| `max`                           | `string`                               | Current date        | Allowed ending date, must be passed as an ISO string (YYYY-mm-dd format e.g. 2023-04-23)                         |
| `disabled`                      | `boolean`                              | false               | Makes the component uninteractable                                                                               |
| `readonly`                      | `boolean`                              | false               | Makes the component uninteractable, but without the style of the disabled variant                                |
| `width`                         | `number/string`                        | 290px               | Sets the width of the element - can be provided as a string like "290px" or "290" or a number, defaults to 290px |
| `full-width`                    | `boolean`                              | false               | Ignores the previous `width` prop and sets the width to 100% of the parent container                             |
| `color`                         | `string`                               | #2e79bd             | Color of the various active component elements                                                                   |
| `first-day-of-week`             | `number/string`                        | 0                   | Sets the first day of the week, starting with 0 for Sunday                                                       |
| `hide-title`                    | `boolean`                              | false               | Hide the picker title                                                                                            |
| `show-adjacent-months`          | `boolean`                              | false               | Toggles visibility of days from previous and next months                                                         |
| `locale`                        | `string`                               | undefined           | Sets the locale, accepts a string with a BCP 47 language tag e.g. en-us or hr-HR                                 |
| `multiple`                      | `boolean`                              | false               | Allow the selection of multiple dates                                                                            |
| `allowed-dates`                 | `function ((date: string) => boolean)` | null                | Restricts which dates can be selected                                                                            |
| `selected-items-text-formatter` | `function ((n: number) => string)`     | Selected ${n} dates | Function for formatting the text for selecting multiple dates                                                    |
| `title-text-formatter`          | `function ((date: string) => string)`  | undefined           | Function for formatting the title text                                                                           |
| `events`                        | `string[]`                             | []                  | Marks the provided dates on the component with a small dot                                                       |

## 🎺 Events

| Name           | Type                     | Description                                       |
| -------------- | ------------------------ | ------------------------------------------------- |
| `change`       | `(date: string) => void` | Triggered when a date is selected                 |
| `select:year`  | `() => void`             | Triggered when the user selects the year portion  |
| `select:month` | `() => void`             | Triggered when the user selects the month portion |
| `select:day`   | `() => void`             | Triggered when the user selects the day portion   |

## 🧩 Slots

### title

Use this slot if you want to override the date picker title, an example being:

```vue
<date-picker v-model="date">
  <template
    #title="{
      date,
      selectYears,
      selectMonths,
      selectDays,
    }"
  >
    {{ date }}
  </template>
</date-picker>
```

There are a few props being exposed:

| Name           | Type       | Default | Description                                                     |
| -------------- | ---------- | ------- | --------------------------------------------------------------- |
| `date`         | `string`   | null    | Currently selected date                                         |
| `selectYears`  | `function` | N/A     | Helper function used for triggering the selection of the years  |
| `selectMonths` | `function` | N/A     | Helper function used for triggering the selection of the months |
| `selectDays`   | `function` | N/A     | Helper function used for triggering the selection of the days   |
