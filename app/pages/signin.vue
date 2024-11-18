<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Sign in'
})

const supabase = useSupabaseClient()

const signInWithGithub = async () => {
  const { data } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: 'http://localhost:3000/confirm'
    }
  })

  if (data.url) {
    navigateTo(data.url)
  }
}

const signInWithGoogle = async () => {
  const { data } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'http://localhost:3000/confirm'
    }
  })

  if (data.url) {
    navigateTo(data.url)
  }
}

const signInWithGMicrosoft = async () => {
  const { data } = await supabase.auth.signInWithOAuth({
    provider: 'azure',
    options: {
      scopes: 'email',
      redirectTo: 'http://localhost:3000/confirm'
    }
  })

  if (data.url) {
    navigateTo(data.url)
  }
}

const providers = [
  {
    label: 'Continue with GitHub',
    icon: 'i-simple-icons-github',
    color: 'white' as const,
    click: signInWithGithub
  },
  {
    label: 'Continue with Google',
    icon: 'i-simple-icons-google',
    color: 'white' as const,
    click: signInWithGoogle
  },
  {
    label: 'Continue with Microsoft',
    icon: 'i-simple-icons-microsoft',
    color: 'white' as const,
    click: signInWithGMicrosoft
  }
]
</script>

<!-- eslint-disable vue/multiline-html-element-content-newline -->
<!-- eslint-disable vue/singleline-html-element-content-newline -->
<template>
  <UCard class="max-w-sm w-full bg-white/75 dark:bg-white/5 backdrop-blur">
    <UAuthForm
      :providers="providers"
      title="Welcome"
      align="top"
      icon="i-heroicons-lock-closed"
      :ui="{ base: 'text-center', footer: 'text-center' }"
    >
      <template #footer>
        By signing in, you agree to our <NuxtLink
          to="/"
          class="text-primary font-medium"
        >Terms of Service</NuxtLink>.
      </template>
    </UAuthForm>
  </UCard>
</template>
