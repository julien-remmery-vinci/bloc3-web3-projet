<script setup>
import { supabase } from '../utils/supabase'

const users = ref([])

async function getUsers() {
  const { data } = await supabase.from('users').select()
  users.value = data
  console.log(data)
}

onMounted(() => {
  getUsers()
})
</script>

<template>
  <div>
    <h1>Home</h1>
    <ul>
      <li
        v-for="user in users"
        :key="user.id"
      >
        {{ user.name }}
      </li>
    </ul>
  </div>
</template>
