import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  InputDiv,
  Spinner,
  AnalyticsChart
} from '@/components/Index';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useToast } from '@/components/ui/use-toast';

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
  const token = localStorage.getItem('accessToken');
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

  const [sevenDaysLoading, setSevenDaysLoading] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalViews, setTotalViews] = useState(Number);

  const urlDetails = async () => {
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
      setValue('urlId', response.data.data.urlId);
    } catch (error) {
      console.log(error);
    }
  };

  const updateBachHalf = async (data) => {
    setLoading(true);
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/url/back-half/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );
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
    setSevenDaysLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/url/sevenDays/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );
      //   console.log(response.data.data);
      const dates = [];
      const clicks = [];
      response.data.data.forEach((data) => {
        dates.push(data._id);
        clicks.push(data.clicks);
      });
      const barColors = 'rgba(34, 179, 87, 1)';
      new Chart('sevenDaysAnalytics', {
        type: 'bar',
        data: {
          labels: dates,
          datasets: [
            {
              backgroundColor: barColors,
              data: clicks,
              label: 'Clicks'
            }
          ]
        },
        options: {
          legend: { display: true },
          title: {
            display: true,
            text: 'Seven Days Clicks Analytics'
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  precision: 0
                }
              }
            ]
          }
        }
      });
      setSevenDaysLoading(false);
    } catch (error) {
      console.log(error);
      setSevenDaysLoading(false);
    }
  };

  const urlAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/url/analytics/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );
      const osClicks = [];
      const deviceClicks = [];
      const browserClicks = [];
      //   console.log(response.data.data);
      response.data.data.map((data) => {
        osClicks.push(data.linuxVisits, data.windowsVisits, data.androidVisits);
        deviceClicks.push(
          data.mobileVisits,
          data.ipadVisits,
          data.desktopVisits
        );
        browserClicks.push(data.chromeVisits, data.safariClicks);
        setTotalViews(data.totalVisits);
      });
      // console.log(totalViews);

      const barColors = 'rgba(34, 179, 87, 1)';
      new Chart('osAnalytics', {
        type: 'horizontalBar',
        data: {
          labels: ['🐧 Linux', '🪟 Windows', '📱 Android'],
          datasets: [
            {
              backgroundColor: barColors,
              data: osClicks,
              label: 'Operating System'
            }
          ]
        },
        options: {
          legend: { display: true },
          title: {
            display: false
          },
          scales: {
            xAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  precision: 0,
                  align: 'end'
                }
              }
            ]
          }
        }
      });

      new Chart('deviceAnalytics', {
        type: 'horizontalBar',
        data: {
          labels: ['📱 Mobile', '📲 Ipad', '💻 Desktop'],
          datasets: [
            {
              backgroundColor: barColors,
              data: deviceClicks,
              label: 'Device Clicks'
            }
          ]
        },
        options: {
          legend: { display: true },
          title: {
            display: false
          },
          scales: {
            xAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  precision: 0,
                  align: 'center'
                }
              }
            ]
          }
        }
      });
      new Chart('browserAnalytics', {
        type: 'horizontalBar',
        data: {
          labels: ['🌎 Chrome', '🌐 Safari'],
          datasets: [
            {
              backgroundColor: barColors,
              data: browserClicks,
              label: 'browser Clicks'
            }
          ]
        },
        options: {
          legend: { display: true },
          title: {
            display: false
          },
          scales: {
            xAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  precision: 0,
                  align: 'center'
                }
              }
            ]
          }
        }
      });
      setAnalyticsLoading(false);
    } catch (error) {
      console.log(error);
      setAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    sevenDaysAnalytics();
    urlAnalytics();
    urlDetails();
  }, []);

  return (
    <>
      <h1 className="h2">Analytics</h1>
      {sevenDaysLoading && (
        <div className="flex justify-center items-center">
          <Spinner />
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <AnalyticsChart
            id="sevenDaysAnalytics"
            width="full"
            maxWidth="xl"
            height="54"
          />
        </div>
        <div>
          <Card className="h-[120px] border border-green-800">
            <CardHeader>
              <CardTitle>Total Views</CardTitle>
            </CardHeader>
            <CardContent className="h3">{totalViews}</CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 my-3">
        <div className="flex-col sm:col-span-4">
          <h3 className="h3 my-3">Operating Systems</h3>
          {analyticsLoading && (
            <div className="">
              <Spinner />
            </div>
          )}
          <AnalyticsChart
            className=""
            id="osAnalytics"
            width="full"
            maxWidth="md"
            height="52"
          />
        </div>
        <div className="flex-col sm:col-span-4">
          <h3 className="h3 my-3">Devices</h3>
          {analyticsLoading && (
            <div className="">
              <Spinner />
            </div>
          )}
          <AnalyticsChart
            id="deviceAnalytics"
            width="full"
            maxWidth="md"
            height="52"
          />
        </div>
        <div className="flex-col sm:col-span-4">
          <h3 className="h3 my-3">Browsers</h3>
          {analyticsLoading && (
            <div className="">
              <Spinner />
            </div>
          )}
          <AnalyticsChart
            id="browserAnalytics"
            width="full"
            maxWidth="md"
            height="52"
          />
        </div>
      </div>
      <div className="border border-dotted rounded border-green-500 p-5">
        <p className="h3 my-3 ">Edit Link</p>
        <div className="grid grid-4 gap-3 sm:grid-cols-2">
          <p className="mb-5 font-semibold">Backhalf</p>
          <form onSubmit={handleSubmit(updateBachHalf)}>
            <div className="space-y-3">
              <InputDiv
                label="Domain"
                placeholder={`${import.meta.env.VITE_DOMAIN}`}
                disabled
              />
              <InputDiv
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
        </div>
      </div>
    </>
  );
};

export default AnalyticsPage;
