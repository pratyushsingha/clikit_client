import { Check, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { pricingData } from '@/utils/Index';
import { useState } from 'react';
import axios from 'axios';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useToast } from '@/components/ui/use-toast';
import { useAuthStore } from '@/store/useAuthStore';

const PricingPage = () => {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const subscriptionCheckoutHandler = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Please login to subscribe'
      });
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/subscription/subscribe`,
        {
          withCredentials: true
        }
      );
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: parseInt(50000),
        currency: 'INR',
        name: 'Clikit',
        description: 'short urls in seconds',
        image:
          'https://utfs.io/f/glvA31ChFgm40Kf0YTbLTHqgCOaNA8ypZu6IiRV24ltBjmrf',
        subscription_id: data.data.id,
        callback_url: `${import.meta.env.VITE_BACKEND_URL}/subscription/verify`,
        prefill: {
          name: user.fullName,
          email: user.email,
          contact: user.email
        },
        notes: {
          address: 'Razorpay Corporate Office'
        },
        theme: {
          color: '#22c55e'
        }
      };
      console.log(options, data.data);

      const paymentObj = new window.Razorpay(options);

      paymentObj.open();
      setLoading(false);
    } catch (error) {
      console.error('Razorpay payment error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-8 text-white justify-center">
      {pricingData.map((plan, index) => (
        <Card key={index} className="w-full md:w-1/3">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold">{plan.title}</div>
                <div className="text-sm text-zinc-400">{plan.subtitle}</div>
              </div>
              {plan.featured && <Badge variant="secondary">Featured</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline mb-4">
              <span className="text-5xl font-extrabold">₹ {plan.price}</span>
              <span className="ml-2 text-sm line-through text-zinc-500">
                ₹ {plan.originalPrice}
              </span>
              <span className="ml-2 text-sm text-zinc-400">
                {plan.discount}
              </span>
            </div>
            {plan.price === 0 ? (
              <Button disabled className="w-full mb-6">
                {plan.buttonText}
              </Button>
            ) : (
              <Button
                disabled={loading || user?.userType === 'premium'}
                onClick={subscriptionCheckoutHandler}
                className="w-full mb-6 space-x-2"
              >
                {loading && (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                )}
                {user?.userType === 'premium' && (
                  <CheckCheck className="mr-2 h-4 w-4" />
                )}
                {user?.userType === 'premium'
                  ? 'Already Subscribed'
                  : plan.buttonText}
              </Button>
            )}
            <ul className="space-y-2">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          {plan.extraFeatures && plan.extraFeatures.length > 0 && (
            <CardFooter>
              <div className="w-full pt-4 border-t border-zinc-800">
                <div className="flex flex-col cursor-pointer">
                  {plan.extraFeatures.map((feature, index) => (
                    <div key={index} className="flex">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      <span key={index} className="text-sm mb-1">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
};

export default PricingPage;
