import { useAuthStore } from '@/store/useAuthStore';
import axios from 'axios';

const useCurrentUser = () => {
  const { setUser, setLoading, setProgress, progress } = useAuthStore();

  const fetchCurrentUser = async () => {
    setProgress(progress + 30);
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/users/current-user`,
        { withCredentials: true }
      );
      setUser(response.data.data);
      setLoading(false);
      setProgress(progress + 100);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setProgress(progress + 100);
    }
  };
  return { fetchCurrentUser };
};

export { useCurrentUser };
