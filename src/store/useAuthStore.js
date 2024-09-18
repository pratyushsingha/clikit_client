import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  isAuthenticated: false,
  progress: 0,
  setUser: (state) => set({ user: state }),
  setLoading: (state) => set({ loading: state }),
  setIsAuthenticated: (state) => set({ isAuthenticated: state }),
  setProgress: (state) => set({ progress: state })
}));
