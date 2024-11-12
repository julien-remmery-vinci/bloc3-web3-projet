<script setup lang="ts">
import { ref } from 'vue'

useSeoMeta({
  title: 'Statistics'
})

// Dummy data for statistics
const stats = ref([
  { label: 'Users', value: 1200 },
  { label: 'Posts', value: 300 },
  { label: 'Comments', value: 1500 },
  { label: 'Likes', value: 5000 }
])
</script>

<template>
  <div class="stats-page">
    <h1>Statistics</h1>
    <div class="stats-grid">
      <div v-for="stat in stats" :key="stat.label" class="stat-card">
        <h2>{{ stat.value }}</h2>
        <p>{{ stat.label }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-page {
  padding: 20px;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.stat-card {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-card h2 {
  margin: 0;
  font-size: 2em;
  color: #333;
}

.stat-card p {
  margin: 0;
  font-size: 1em;
  color: #666;
}
</style>