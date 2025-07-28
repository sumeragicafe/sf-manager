import { defineStore } from 'pinia'

export const useSessionStore = defineStore('session', {
  state: () => ({
    user: null,
    isLoggedIn: false,
    permissions: [],
    loading: false,
    error: null
  }),
  actions: {
    resetSession() {
      this.user = null;
      this.isLoggedIn = false;
      this.permissions = [];
    },
    async fetchSession() {
      this.loading = true;
      this.error = null;

      try {
        const res = await fetch('/api/user/session', {
          credentials: 'include',
        });

        if (!res.ok) {
          this.resetSession();
          return false;
        }

        const data = await res.json();

        if (data.user) {
          this.user = data.user;
          this.isLoggedIn = true;
          this.permissions = Array.isArray(data.user.role?.permissions)
            ? data.user.role.permissions.map(p => {
                if (typeof p === 'string') return p;
                if (p && typeof p.name === 'string') return p.name;
                return null;
              }).filter(Boolean)
            : [];
          return true;
        } else {
          this.resetSession();
          return false;
        }
      } catch (err) {
        this.error = err;
        this.resetSession();
        return false;
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.resetSession();
    }
  }
});
