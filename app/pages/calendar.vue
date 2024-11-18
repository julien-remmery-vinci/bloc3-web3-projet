<script setup lang="ts">
import 'vue-cal/dist/vuecal.css'
import VueCal from 'vue-cal'

const supabase = useSupabaseClient()
const user = useSupabaseUser()

// Subscriptions
const subscriptions = ref([
  { name: '', amount: 0, debitDate: '', recurrence: '' }
]) // Liste des abonnements

const events = ref([])

const getSubscriptions = async () => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.value.id)

  if (error) {
    console.error('Erreur lors de la récupération des abonnements :', error)
    return
  }

  subscriptions.value = data || []
  events.value = subscriptions.value.map(sub => ({
    title: sub.name,
    start: new Date(sub.debitDate),
    end: new Date(sub.debitDate),
    content: `Amount: ${sub.amount}, Recurrence: ${sub.recurrence}`
  }))
}

onMounted(() => {
  getSubscriptions()
})

useSeoMeta({
  title: 'Calendar'
})

const selectedDate = ref(new Date())
</script>

<template>
  <div>
    <h1>Calendar</h1>
    <VueCal active-view="month" :disable-views="['years', 'year', 'week']"
            events-count-on-month-view events-on-day-view="short" v-model="selectedDate" :events="events" />
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
