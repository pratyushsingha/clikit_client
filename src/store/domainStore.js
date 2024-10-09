import { create } from 'zustand';
import axios from 'axios';

export const useDomainStore = create((set, get) => ({
  domains: [],
  loading: false,
  domainDetails: {},

  setLoading: (loading) => set({ loading }),

  getAllDomains: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/domain/all`,
        {
          withCredentials: true
        }
      );
      set({ domains: response.data.data, loading: false });
    } catch (error) {
      console.error(error);
      set({ loading: false });
      throw error;
    }
  },

  addDomain: async ({ domain }) => {
    set({ loading: true });
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/domain`,
        { domain },
        {
          withCredentials: true
        }
      );
      const currentDomains = get().domains;
      set({ domains: [...currentDomains, response.data.data], loading: false });
      return response;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  fetchDomainDetails: async (domainId) => {
    set({ loading: false });
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/domain/${domainId}`,
        {
          withCredentials: true
        }
      );
      console.log(response);
      set({ domainDetails: response.data.data, loading: false });
    } catch (error) {
      console.error(error);
      set({ loading: false });
      throw error;
    }
  },

  verifyDomainOwnership: async (domainId) => {
    set({ loading: true });
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/domain/${domainId}/verify`,
        {
          withCredentials: true
        }
      );
      set((state) => ({
        domainDetails: {
          ...state.domainDetails,
          isDomainVerified: true
        },
        loading: false
      }));
      return response.data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  }
}));
