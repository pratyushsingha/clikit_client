import { create } from 'zustand';

const usePaginationStore = create((set) => ({
  dashboardPageNo: 1,
  setDashboardPageNo: (page) => set({ dashboardPageNo: page }),
  brandedUrlPageNo: 1,
  setBrandedUrlPageNo: (page) => set({ brandedUrlPageNo: page })
}));

export default usePaginationStore;
