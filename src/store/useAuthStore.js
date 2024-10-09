import { create } from 'zustand';
import axios from 'axios';

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  isAuthenticated: false,
  progress: 0,
  setUser: (state) => set({ user: state }),
  setLoading: (state) => set({ loading: state }),
  setIsAuthenticated: (state) => set({ isAuthenticated: state }),
  setProgress: (state) => set({ progress: state }),

  login: async (email, password) => {
    set({
      loading: true,
      progress: 30
    });
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/login`,
        {
          email,
          password
        },
        { withCredentials: true }
      );
      set({
        user: response.data.data.user,
        isAuthenticated: true,
        loading: false,
        progress: 100
      });
      return response?.data?.data;
    } catch (error) {
      set({ loading: false, progress: 100 });
      throw error;
    }
  },
  signup: async (fullName, email, password) => {
    set({
      loading: true,
      progress: 30
    });
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/register`,
        {
          fullName,
          email,
          password
        },
        { withCredentials: true }
      );
      set({ loading: false, progress: 100 });
      return response;
    } catch (error) {
      set({ loading: false, progress: 100 });
      throw error;
    }
  },
  ResetPass: async (email, password, token) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/users/reset-password`,
        {
          email,
          password,
          token
        }
      );
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  sendPasswordResetEmail: async (email) => {
    set({ loading: true });
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/forgot-password`,
        { email }
      );
      set({ loading: false });
      return response;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
  logout: async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/logout`,
        {},
        { withCredentials: true }
      );
      set({
        user: null,
        isAuthenticated: false
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  authStatus: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/users/auth-status`,
        {
          withCredentials: true
        }
      );
      set({
        isAuthenticated: response.data.data.isAuthenticated,
        loading: false
      });
    } catch (error) {
      console.error('authStatus error:', error);
      set({ loading: false });
      throw error;
    }
  },
  currentUser: async () => {
    set({ loading: true, progress: 30 });
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/users/current-user`,
        { withCredentials: true }
      );

      set({ user: response.data.data, loading: false, progress: 100 });
    } catch (error) {
      console.error('currentUser error:', error);
      set({ loading: false, progress: 100 });
      throw error;
    }
  },
  changePass: async (email, oldPassword, newPassword) => {
    set({ loading: true });
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/users/change-password`,
        {
          email,
          oldPassword,
          newPassword
        },
        { withCredentials: true }
      );
      set({ loading: false });
      return response;
    } catch (error) {
      set({ loading: false });
      console.log(error);
      throw error;
    }
  }
}));
