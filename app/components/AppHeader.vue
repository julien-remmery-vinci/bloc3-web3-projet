<script setup lang="ts">
const supabase = useSupabaseClient()
const { data } = await supabase.auth.getSession()

const links = [{
  label: 'Stats',
  to: '/stats'
}, {
  label: 'Calendar',
  to: '/calendar'
}]

async function signOut() {
  const { error } = await supabase.auth.signOut()
  console.log(error)
  if (!error) {
    navigateTo('/')
  }
}
</script>

<template>
  <UHeader :links="links">
    <template #logo>
      Budget Planner
    </template>

    <template #right>
      <UButton
        v-if="!data.session"
        label="Sign in"
        color="gray"
        to="/login"
      />
      <UForm
        v-if="data.session"
        :state="{ data }"
        @submit="signOut"
      >
        <UButton
          label="Sign out"
          color="gray"
          type="submit"
        />
      </UForm>
    </template>
  </UHeader>
</template>
