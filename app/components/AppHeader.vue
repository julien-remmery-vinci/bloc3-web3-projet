<script setup lang="ts">
const supabase = useSupabaseClient()
const session = useSupabaseSession()

const links = [{
  label: 'Infos',
  to: '/infos'
}, {
  label: 'Calendar',
  to: '/calendar'
}]

async function signOut() {
  const { error } = await supabase.auth.signOut()
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
        v-if="!session"
        label="Sign in"
        color="gray"
        to="/signin"
      />
      <UForm
        v-if="session"
        :state="{ session }"
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
