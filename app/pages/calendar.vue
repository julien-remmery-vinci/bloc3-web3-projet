<script setup lang="ts">
import 'vue-cal/dist/vuecal.css'
import VueCal from 'vue-cal'

const supabase = useSupabaseClient()
const user = useSupabaseUser()

// Subscriptions
const subscriptions = ref([
  { name: '', amount: 0, debit_date: '', recurrence: '' }
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
    start: new Date(sub.debit_date),
    end: new Date(sub.debit_date),
    content: `Amount: ${sub.amount}$, Recurrence: ${sub.recurrence}`,
    class: 'event-class'
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
    <VueCal active-view="month" :disable-views="['years', 'year', 'week']"
            events-count-on-month-view style="height: 600px" :time="false" events-on-day-view="short" v-model="selectedDate" :events="events" />
  </div>
</template>

<style>
.vuecal__cell-events-count {
  color: white;
  background-color: hotpink;

}
.vuecal__now-line {color: hotpink;}
.vuecal__event.event-class{
  background-color: transparent;
  color: hotpink;}
</style>
