<script setup>
const supabase = useSupabaseClient()

const users = ref([])

const getUsers = async () => {
  const { data } = await supabase.from('users').select()
  users.value = data
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
