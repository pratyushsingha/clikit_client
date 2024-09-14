import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  AppContext,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  InputDiv,
  Spinner
} from '@/components/Index';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useToast } from '@/components/ui/use-toast';
import useAuth from '@/hooks/useAuth';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import Pichart from '@/components/Pichart';
import {
  osConfig,
  chartConfig,
  deviceConfig,
  browserConfig
} from '@/utils/Index';
import ButtonsCard from '@/components/ui/tailwindcss-buttons';

const backHalfSchema = z.object({
  urlId: z
    .string()
    .nonempty("backhalf can't be empty")
    .min(2, { message: 'Minimum 2 characters' })
    .max(10, { message: 'Maximum 10 characters' })
});
const AnalyticsPage = () => {
  const { toast } = useToast();
  const { id } = useParams();
  const { token } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    watch,
    setValue
  } = useForm({
    defaultValues: {
      urlId: ''
    },
    resolver: zodResolver(backHalfSchema)
  });

  const { user } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [sevenDaysData, setSevenDaysData] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({
    os: [],
    device: [],
    browsers: [],
    totalViews: 0
  });
  const [url, setUrl] = useState([]);

  const urlDetails = async () => {
    setAnalyticsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/url/details/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );
      setUrl(response.data.data);
      console.log(response.data.data);
      setValue('urlId', response.data.data.urlId);
      setAnalyticsLoading(false);
    } catch (error) {
      console.log(error);
      setAnalyticsLoading(false);
    }
  };

  const updateBachHalf = async (data) => {
    setLoading(true);
    const previousUrlId = url.urlId;
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/url/back-half/${id}`,
        data,
        {
          withCredentials: true
        }
      );
      setUrl((prev) => ({
        ...prev,
        customUrl: url.customUrl.split('/')[0] + `/${response.data.data.urlId}`,
        shortenUrl:
          url.shortenUrl.split(`/${previousUrlId}`)[0] +
          `/${response.data.data.urlId}`,
        urlId: response.data.data.urlId
      }));
      toast({
        title: `${response.data.message}`
      });

      setLoading(false);
    } catch (error) {
      console.log(error);
      toast({
        variant: 'destructive',
        title: 'error',
        description: `${error.response.data.message}`
      });
      setLoading(false);
    }
  };

  const sevenDaysAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/url/sevenDays/${id}`,
        {
          withCredentials: true
        }
      );
      setSevenDaysData(response.data.data);
      setAnalyticsLoading(false);
    } catch (error) {
      console.log(error);
      toast({
        variant: 'destructive',
        title: 'error',
        description: `${error.response.data.message}`
      });
      setAnalyticsLoading(false);
    }
  };

  const urlAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/url/analytics/${id}`,
        {
          withCredentials: true
        }
      );
      setAnalyticsData((prev) => ({
        ...prev,
        totalViews: response.data.data.totalVisits,
        os: [
          {
            type: 'linux',
            clicks: response.data.data.linuxVisits,
            fill: 'var(--color-linux)'
          },
          {
            type: 'android',
            clicks: response.data.data.androidVisits,
            fill: 'var(--color-android)'
          },
          {
            type: 'windows',
            clicks: response.data.data.windowsVisits,
            fill: 'var(--color-linux)'
          }
        ],
        device: [
          {
            type: 'mobile',
            clicks: response.data.data.mobileDevices,
            fill: 'var(--color-mobile)'
          },
          {
            type: 'ipad',
            clicks: response.data.data.ipadVisits,
            fill: 'var(--color-ipad)'
          },
          {
            type: 'iPhone',
            clicks: response.data.data.iPhoneVisits,
            fill: 'var(--color-iphone)'
          }
        ],
        browsers: [
          {
            type: 'safari',
            clicks: response.data.data.safariClicks,
            fill: 'var(--color-safari)'
          },
          {
            type: 'chrome',
            clicks: response.data.data.chromeVisits,
            fill: 'var(--color-chrome)'
          }
        ]
      }));
      setAnalyticsLoading(false);
    } catch (error) {
      console.log(error);
      toast({
        variant: 'destructive',
        title: 'error',
        description: `${error.response.data.message}`
      });
      setAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    sevenDaysAnalytics();
    urlAnalytics();
    urlDetails();
  }, [setAnalyticsData]);

  return analyticsLoading ? (
    <div className="text-center">
      <Spinner />
    </div>
  ) : (
    <>
      <a
        href={url.customUrl ? `https://${url.customUrl}` : url.shortenUrl}
        target="_blank"
      >
        <button className="inline-flex h-12 my-4 animate-shimmer items-center justify-center rounded-md border border-green-600 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
          🔗 {url.customUrl ?? url.shortenUrl} 🎊
        </button>
      </a>
      <h1 className="h2 text-slate-300 mb-3">Url Insights 🔍</h1>
      <div className="grid gap-3 sm:grid-cols-2">
        <Card className="border">
          <CardHeader>
            <CardTitle>Seven Days Click Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={sevenDaysData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="_id"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 5)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="clicks" fill="var(--color-desktop)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <div>
          <Card className="h-[120px]">
            <CardHeader>
              <CardTitle>Total Views</CardTitle>
            </CardHeader>
            <CardContent className="h3">{analyticsData.totalViews}</CardContent>
          </Card>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 my-3">
        <div className="flex-col sm:col-span-4">
          <Pichart
            chartTitle={'Operating Systems'}
            config={osConfig}
            data={analyticsData.os}
            dataKey={'clicks'}
            nameKey={'type'}
          />
        </div>
        <div className="flex-col sm:col-span-4">
          <Pichart
            chartTitle={'Devices'}
            config={deviceConfig}
            data={analyticsData.device}
            dataKey={'clicks'}
            nameKey={'type'}
          />
        </div>
        <div className="flex-col sm:col-span-4">
          <Pichart
            chartTitle={'Browsers'}
            config={browserConfig}
            data={analyticsData.browsers}
            dataKey={'clicks'}
            nameKey={'type'}
          />
        </div>
      </div>
      <div className="border border-dotted rounded border-green-500 p-5">
        <p className="h3 my-3 ">Edit Link</p>
        <div
          className={`grid grid-4 gap-3 ${user.userType === 'free' ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}
        >
          <p className="mb-5 font-semibold">Backhalf</p>
          <form onSubmit={handleSubmit(updateBachHalf)}>
            <div className="space-y-3">
              <InputDiv
                label="Domain"
                placeholder={`${import.meta.env.VITE_DOMAIN}`}
                disabled
              />
              <InputDiv
                disabled={user.userType === 'free'}
                value={watch('urlId')}
                {...register('urlId', {
                  required: true
                })}
                label="Back-half"
                placeholder="Backhalf"
              />
              {errors.urlId && (
                <p className="text-red-500 text-xs">{errors.urlId.message}</p>
              )}
              <Button
                disabled={isSubmitting || !isDirty}
                className="flex justify-end items-end"
                type="submit"
              >
                {loading && (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                )}
                Submit
              </Button>
            </div>
          </form>
          {user.userType === 'free' && (
            <div className="flex justify-end items-end">
              <Button className="w-6/12 ">
                <Link to={'/pricing'}>Upgrade to Premium</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AnalyticsPage;
