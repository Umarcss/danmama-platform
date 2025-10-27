import { defineStore } from 'pinia';
import { mockApi } from 'src/services/mockApi';
import { useLoadingStore } from './loading-store';

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
      const loadingStore = useLoadingStore();
      loadingStore.startLoading('login', 'Authenticating', 'Verifying your credentials...');
      
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
      } finally {
        loadingStore.stopLoading('login');
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
    },
  },
});