<template>
  <div class="auth-page">
    <div class="auth-container">
      <h1>Connexion</h1>
      <LoginForm />
      <p class="auth-link">
        Vous n'avez pas de compte ? 
        <nuxt-link to="/register">Inscrivez-vous</nuxt-link>
      </p>
    </div>
  </div>
</template>