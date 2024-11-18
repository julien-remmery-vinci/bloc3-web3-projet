<script setup lang="ts">
const user = useSupabaseUser()

// Get redirect path from cookies
const cookieName = useRuntimeConfig().public.supabase.cookieName
const redirectPath = useCookie(`${cookieName}-redirect-path`).value

watch(user, async () => {
  if (user.value) {
    if (new Date(user.value.last_sign_in_at).getTime() - new Date(user.value.created_at).getTime() < 1000 * 60 * 5) {
      return navigateTo('/infos')
    }
    // Clear cookie
    useCookie(`${cookieName}-redirect-path`).value = null
    // Redirect to path
    return navigateTo(redirectPath || '/')
  }
}, { immediate: true })
</script>

<template>
  <div>Waiting for login...</div>
</template>
