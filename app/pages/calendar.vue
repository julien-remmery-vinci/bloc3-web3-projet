<script setup lang="ts">
import { ref } from 'vue'
import 'vue-cal/dist/vuecal.css'
import VueCal from 'vue-cal'

useSeoMeta({
  title: 'Calendar'
})

const selectedDate = ref(new Date())
const reminders = ref([])

const newReminder = ref({
  title: '',
  start: ''
})

const addReminder = () => {
  if (newReminder.value.title && newReminder.value.start) {
    reminders.value.push({
      title: newReminder.value.title,
      start: new Date(newReminder.value.start),
      end: new Date(newReminder.value.start) // End date is the same as start date for simplicity
    })
    newReminder.value = { title: '', start: '' }
  }
}
</script>

<template>
  <div>
    <h1>Calendar</h1>
    <form @submit.prevent="addReminder">
      <div>
        <label for="title">Reminder Title:</label>
        <input id="title" v-model="newReminder.title" type="text" required />
      </div>
      <div>
        <label for="start">Date and Time:</label>
        <input id="start" v-model="newReminder.start" type="datetime-local" required />
      </div>
      <button type="submit">Add Reminder</button>
    </form>
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
  width: 20%;
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
