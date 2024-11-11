<template>
  <div>
    <header class="site-header">
      <h1 class="site-title">Budget Planner</h1>
      <nav class="nav-bar">
        <nuxt-link to="/login" class="nav-link">Connexion</nuxt-link>
        <nuxt-link to="/register" class="nav-link">Inscription</nuxt-link>
      </nav>
    </header>

    <NuxtPage />

    <footer class="site-footer">
      <p>&copy; 2024 - Budget Planner Web 3</p>
    </footer>
  </div>
</template>

<script>
export default {};
</script>
