import { create } from 'zustand';
import usePaginationStore from './usePaginationStore';
import axios from 'axios';

export const useUrlStore = create((set, get) => ({
  shortenedUrl: '',
  urls: [],
  loading: false,
  setShortenedUrl: (state) => set({ shortenedUrl: state }),
  setLoading: (state) => set({ loading: state }),

  deleteUrl: async (urlId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/url/remove/${urlId}`,
        {
          withCredentials: true
        }
      );
      set((state) => ({
        urls: {
          ...state.urls,
          urls: state.urls.urls.filter((url) => url._id !== urlId)
        },
        loading: false
      }));
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
  userUrls: async () => {
    const { dashboardPageNo } = usePaginationStore.getState();
    set({ loading: true });
    if (dashboardPageNo < 1) return;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/url/my?page=${dashboardPageNo}&limit=10`,
        {
          withCredentials: true
        }
      );
      set({ urls: response.data.data, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error(error);
    }
  },
  getUrlsByDomain: async (domainId) => {
    set({ loading: true });
    const { brandedUrlPageNo } = usePaginationStore.getState();
    if (brandedUrlPageNo < 1) return;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/url/domain/${domainId}?page=${brandedUrlPageNo}&limit=10`,
        {
          withCredentials: true
        }
      );
      // console.log(get().urls);
      // console.log(response.data.data);
      set({ urls: response.data.data, loading: false });
    } catch (error) {
      console.error(error);
      set({ loading: false });
      throw error;
    }
  },
  shortUrlByDomain: async (url, domainId, expiredIn) => {
    set({ loading: true });
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/url/short/${domainId}`,
        {
          originalUrl: url,
          expiredIn
        },
        {
          withCredentials: true
        }
      );
      if (get().urls > 0) {
        set({ urls: response.data.data, loading: false });
      } else {
        set((state) => ({
          urls: {
            ...state.urls,
            urls: [response.data.data, ...state.urls.urls]
          },
          loading: false
        }));
      }
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
  shortUrl: async (url, expiredIn) => {
    set({ loading: true });
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/url/short`,
        { originalUrl: url, expiredIn },
        {
          withCredentials: true
        }
      );

      if (get().urls > 0) {
        set({ urls: response.data.data, loading: false });
      } else {
        set((state) => ({
          urls: {
            ...state.urls,
            urls: [response.data.data, ...state.urls.urls]
          },
          loading: false
        }));
      }
    } catch (error) {
      console.error('Error shortening URL:', error);
      set({ loading: false });
      throw error;
    }
  },
  searchUrls: async (searchQuery) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/url/search?q=${searchQuery}`,
        {
          withCredentials: true
        }
      );
      set({ urls: response.data.data });
    } catch (error) {
      throw error;
    }
  },
  getUrlById: async (urlId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/url/details/${urlId}`,
        {
          withCredentials: true
        }
      );
      return response.data.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}));
