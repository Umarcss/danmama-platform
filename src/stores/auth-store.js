import { defineStore } from 'pinia';
import { mockApi } from 'src/services/mockApi';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(credentials) {
      try {
        const response = await mockApi.login(credentials.username, credentials.password);
        if (response.success) {
          this.token = response.token;
          localStorage.setItem('token', this.token);
          return { success: true };
        } else {
          return { success: false, error: response.error };
        }
      } catch {
        return { success: false, error: 'An unexpected error occurred.' };
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
    },
  },
});