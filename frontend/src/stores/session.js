// stores/session.js
import { defineStore } from 'pinia'

export const useSessionStore = defineStore('session', {
  state: () => ({
    user: null,
    isLoggedIn: false
  }),
  actions: {
    async fetchSession() {
      try {
        const res = await fetch('/api/user/session', {
          credentials: 'include',
        });

        if (!res.ok) {
          this.user = null;
          this.isLoggedIn = false;
          return false;
        }

        const data = await res.json();

        if (data.user) {
          this.user = data.user;
          this.isLoggedIn = true;
          return true;
        } else {
          this.user = null;
          this.isLoggedIn = false;
          return false;
        }
      } catch (err) {
        this.user = null;
        this.isLoggedIn = false;
        return false;
      }
    },
    logout() {
      this.user = null;
      this.isLoggedIn = false;
    }
  }
});
