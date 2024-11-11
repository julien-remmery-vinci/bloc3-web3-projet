<template>
    <div class="auth-page">
      <div class="auth-container">
        <h1>Inscription</h1>
        <form @submit.prevent="registerUser">
          <input type="text" v-model="username" placeholder="Nom d'utilisateur" required />
          <input type="email" v-model="email" placeholder="Email" required />
          <input type="password" v-model="password" placeholder="Mot de passe" required />
          <input type="password" v-model="password" placeholder="Confirmer le mot de passe" required />
          <button type="submit">S'inscrire</button>
        </form>
        <p class="auth-link">
          Déjà inscrit ? <nuxt-link to="/login">Connectez-vous</nuxt-link>
        </p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: '',
        email: '',
        password: '',
      };
    },
    methods: {
      async registerUser() {
        try {
          await this.$store.dispatch('auth/register', {
            username: this.username,
            email: this.email,
            password: this.password,
          });
          this.$router.push('/login'); // Redirection vers la page de connexion
        } catch (error) {
          console.error("Erreur d'inscription:", error);
        }
      },
    },
  };
  </script>
  