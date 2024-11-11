<script>
export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    async loginUser() {
      try {
        await this.$store.dispatch('auth/login', { email: this.email, password: this.password });
        this.$router.push('/'); // Redirection après la connexion
      } catch (error) {
        console.error('Erreur de connexion:', error);
      }
    },
  },
};
</script>

<template>
    <form @submit.prevent="loginUser">
        <input type="email" v-model="email" placeholder="Email" required />
        <input type="password" v-model="password" placeholder="Mot de passe" required />
        <button type="submit">Se connecter</button>
    </form>
</template>