<script setup lang="ts">
import { ref } from 'vue'
import 'vue-cal/dist/vuecal.css'
import VueCal from 'vue-cal'

useSeoMeta({
  title: 'Hello World'
})

const selectedDate = ref(new Date())
</script>

<template>
  <div>
    <VueCal v-model="selectedDate" />
  </div>
</template>

<style scoped>
/* You can remove the styles if they are not needed */
</style>