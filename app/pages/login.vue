<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Login'
})

const fields = [{
  name: 'email',
  type: 'email',
  label: 'Email',
  placeholder: 'Enter your email'
}]

const validate = (state: any) => {
  const errors = []
  if (!state.email) errors.push({ path: 'email', message: 'Email is required' })
  if (!state.password) errors.push({ path: 'password', message: 'Password is required' })
  return errors
}

const supabase = useSupabaseClient()

const signInWithGithub = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
      redirectTo: 'http://localhost:3000/confirm',
    },
    })

    if(data.url) {
      navigateTo(data.url)
    }
}

const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
      redirectTo: 'http://localhost:3000/confirm',
    },
    })

    if(data.url) {
      navigateTo(data.url)
    }
}

const signInWithGMicrosoft = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        scopes: 'email',
        redirectTo: 'http://localhost:3000/confirm',
      },
    })

    if(data.url) {
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

async function onSubmit(data: any) {
  
}
</script>

<!-- eslint-disable vue/multiline-html-element-content-newline -->
<!-- eslint-disable vue/singleline-html-element-content-newline -->
<template>
  <UCard class="max-w-sm w-full bg-white/75 dark:bg-white/5 backdrop-blur">
    <UAuthForm
      :fields="fields"
      :validate="validate"
      :providers="providers"
      title="Welcome back"
      align="top"
      icon="i-heroicons-lock-closed"
      :ui="{ base: 'text-center', footer: 'text-center' }"
      :submit-button="{ trailingIcon: 'i-heroicons-arrow-right-20-solid' }"
      @submit="onSubmit"
    >
      <template #password-hint>
        <NuxtLink
          to="/"
          class="text-primary font-medium"
        >Forgot password?</NuxtLink>
      </template>

      <template #footer>
        By signing in, you agree to our <NuxtLink
          to="/"
          class="text-primary font-medium"
        >Terms of Service</NuxtLink>.
      </template>
    </UAuthForm>
  </UCard>
</template>
