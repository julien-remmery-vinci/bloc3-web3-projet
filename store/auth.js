export const state = () => ({
    isAuthenticated: false,
    user: null,
    token: null,
  });
  
  export const mutations = {
    SET_AUTH(state, status) {
      state.isAuthenticated = status;
    },
    SET_USER(state, user) {
      state.user = user;
    },
    SET_TOKEN(state, token) {
      state.token = token;
    },
  };
  
  export const actions = {
    async login({ commit }, { email, password }) {
      try {
        // Exemple d'appel à une API pour la connexion
        const response = await this.$axios.post('/api/login', { email, password });
        const { user, token } = response.data;
  
        // Stocke les informations d'authentification dans l'état
        commit('SET_AUTH', true);
        commit('SET_USER', user);
        commit('SET_TOKEN', token);
  
        // Stocke le token dans le localStorage (facultatif)
        localStorage.setItem('authToken', token);
      } catch (error) {
        console.error("Erreur de connexion :", error);
        throw new Error("Échec de la connexion");
      }
    },
  
    logout({ commit }) {
      commit('SET_AUTH', false);
      commit('SET_USER', null);
      commit('SET_TOKEN', null);
      localStorage.removeItem('authToken');
    },
  
    initializeAuth({ commit }) {
      const token = localStorage.getItem('authToken');
      if (token) {
        commit('SET_AUTH', true);
        commit('SET_TOKEN', token);
      } else {
        commit('SET_AUTH', false);
      }
    }
  };
  