import { createContext, useState } from 'react';
import axios from 'axios';

export const AppContext = createContext();

export default function AppContextProvider({ children }) {
  const [progress, setProgress] = useState(false);
  const [qrcode, setQrcode] = useState([]);
  const [shortenedUrl, setShortenedUrl] = useState([]);

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

  const value = {
    progress,
    setProgress,
    qrcode,
    generateQrCode,
    shortenedUrl,
    setShortenedUrl
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
