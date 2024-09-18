import { create } from 'zustand';

export const useUrlStore = create((set) => ({
  shortenedUrl: '',
  loading: false,
  setShortenedUrl: (state) => set({ shortenedUrl: state }),
  setLoading: (state) => set({ loading: state })
}));
