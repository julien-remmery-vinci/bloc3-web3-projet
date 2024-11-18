<script setup lang="ts">
import { ref } from 'vue'
import 'vue-cal/dist/vuecal.css'
import VueCal from 'vue-cal'

useSeoMeta({
  title: 'Calendar'
})

const selectedDate = ref(new Date())
const reminders = ref([
  {
    title: 'Sample Reminder',
    start: new Date(),
    end: new Date()
  }
])

</script>

<template>
  <div>
    <h1>Calendar</h1>
    <VueCal v-model="selectedDate" :events="reminders" />
  </div>
</template>

<style scoped>
form {
  margin-bottom: 20px;
}

form div {
  margin-bottom: 10px;
}

form label {
  display: block;
  margin-bottom: 5px;
}

form input {
  width: 20%; /* Set width to 20% */
  box-sizing: border-box;
}

button {
  padding: 8px 16px; /* Reduced padding for smaller button */
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
