import { ChevronRight, Rocket, Copy, QrCode, Check } from 'lucide-react';
import { z } from 'zod';
import axios from 'axios';

import {
  Button,
  Input,
  Dialog,
  DialogTrigger,
  Label,
  AppContext
} from '@/components/Index';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Spinner from '@/components/loader/Spinner';
// import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import QrDialog from '@/components/QrDialog';

const urlSchema = z.object({
  url: z.string().nonempty("URL can't be empty").url({ message: 'Invalid URL' })
});

const HomePage = () => {
  // const { toast } = useToast();

  const [isCopied, setIsCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const { generateQrCode, qrcode, shortenedUrl, setShortenedUrl } =
    useContext(AppContext);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(urlSchema)
  });

  const shortUrl = async ({ url }) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/url/short`,
        { originalUrl: url },
        { withCredentials: true }
      );

      setShortenedUrl(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error shortening URL:', error);
      toast({
        variant: 'destructive',
        title: 'error',
        description: `${error.response.data.message}`
      });
      setLoading(false);
    }
  };

  const handleCopy = async (e) => {
    e.preventDefault();
    shortenedUrl.map((url) =>
      window.navigator.clipboard.writeText(url.shortenUrl)
    );
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div className="flex justify-center items-center flex-col text-center">
      <p className="h1">
        Simplify your <span className="textGradiant">Links</span>
      </p>
      <span className="text-center w-3/5 my-3 text-slate-400">
        Your go-to URL shortener, provides a streamlined approach to link
        sharing. We empower you to manage your links effortlessly. Explore our
        user-friendly dashboard and robust analytics to enhance your link
        management experience.
      </span>
      <Button className="bgGradiant text-white my-2">
        {localStorage.getItem('accessToken') ? (
          <Link to="/dashboard">Get Started</Link>
        ) : (
          <Link to="/login">Get Started</Link>
        )}
        <ChevronRight />
      </Button>
      <form onSubmit={handleSubmit(shortUrl)}>
        <div className="my-5 flex justify-center items-center border-2 rounded">
          <Input
            placeholder="Shorten your link"
            {...register('url', { required: true })}
          />
          <Button type="submit" variant="ghost">
            {loading ? <Spinner className="w-10 h-10" /> : <Rocket />}
          </Button>
        </div>
        {errors.url && <p className="text-red-600">{errors.url?.message}</p>}
      </form>
      {shortenedUrl &&
        shortenedUrl.map((url) => (
          <div key={url._id} className="bg-gray-800 rounded p-3 ">
            <div className="flex justify-between">
              <a href={`${url.shortenUrl}`} target="_blank">
                <div className="flex mx-3">
                  <img
                    className="h-10 w-10 rounded-full self-center mr-2"
                    src={url.logo}
                    alt={url.originalUrl}
                  />
                  <div className="">
                    <p className="flex justify-start font-bold">
                      {url.shortenUrl}
                    </p>
                    <p className="text-sm flex justify-start">
                      {url?.originalUrl?.slice(0, 30)}...
                    </p>
                  </div>
                </div>
              </a>
              <div className="flex space-x-4">
                <button onClick={handleCopy}>
                  {isCopied === true ? <Check /> : <Copy />}
                </button>
                <Dialog>
                  <DialogTrigger asChild>
                    <button onClick={() => generateQrCode(url._id)}>
                      <QrCode />
                    </button>
                  </DialogTrigger>
                  <QrDialog shortenedUrl={url} qrcode={qrcode} />
                </Dialog>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default HomePage;
