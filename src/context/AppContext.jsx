import { createContext, useState } from 'react';
import axios from 'axios';

export const AppContext = createContext();

export default function AppContextProvider({ children }) {
  const [progress, setProgress] = useState(false);
  const [qrcode, setQrcode] = useState([]);
  const [shortenedUrl, setShortenedUrl] = useState([]);
  const [user, setUser] = useState([]);

  const generateQrCode = async (url_id) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/url/qrcode/${url_id}`,
        { withCredentials: true }
      );
      setQrcode(response.data.data.qrcode);
      // localStorage.setItem('qrcode', response.data.data.qrcode);
    } catch (error) {
      console.log(error);
    }
  };

  const currentUser = async () => {
    setProgress(progress + 30);
    try {
      if (localStorage.getItem('accessToken') !== null) {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/users/current-user`,
          { withCredentials: true }
        );
        setUser(response.data.data);
        // console.log(user);
        setProgress(progress + 100);
      }
    } catch (error) {
      console.log(error);
      setProgress(progress + 100);
    }
  };

  const value = {
    progress,
    setProgress,
    qrcode,
    generateQrCode,
    shortenedUrl,
    setShortenedUrl,
    currentUser,
    user,
    setUser
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
