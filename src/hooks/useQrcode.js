import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import { useState } from 'react';

const useQrcode = () => {
  const { toast } = useToast();
  const [qrcode, setQrcode] = useState([]);

  const generateQrCode = async (url_id) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/url/qrcode/${url_id}`,
        {},
        { withCredentials: true }
      );
      setQrcode(response.data.data.qrcode);
    } catch (error) {
      console.log(error);
      toast({
        variant: 'destructive',
        title: 'error',
        description:
          `${error.response?.data?.message}` || 'something went wrong'
      });
    }
  };
  return { qrcode, generateQrCode, setQrcode };
};

export { useQrcode };
