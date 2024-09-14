import { Cable, Link, Settings } from 'lucide-react';

export const SidebarItems = [
  { _id: 1, title: 'My Links', path: '/dashboard', icon: <Link /> },
  {
    _id: 2,
    title: 'Settings',
    path: '/dashboard/settings',
    icon: <Settings />
  },
  {
    _id: 3,
    title: 'Branded Links',
    path: '/dashboard/custom-domains',
    icon: <Cable />
  }
];

export const instructions = [
  {
    id: 1,
    title: 'Replace the url in your short links with your own unique domain'
  },
  {
    id: 2,
    title: 'Help people recognize and trust your links'
  },
  {
    id: 3,
    title: 'Build brand awareness and get up to 17% more clicks'
  }
];

export const osConfig = {
  clicks: {
    label: 'Clicks'
  },
  linux: {
    label: 'Linux',
    color: 'hsl(var(--chart-1))'
  },
  android: {
    label: 'Android',
    color: 'hsl(var(--chart-2))'
  },
  windows: {
    label: 'Windows',
    color: 'hsl(var(--chart-3))'
  }
};

export const deviceConfig = {
  clicks: {
    label: 'Clicks'
  },
  mobile: {
    label: 'Mobile',
    color: 'hsl(var(--chart-1))'
  },
  ipad: {
    label: 'Ipad',
    color: 'hsl(var(--chart-3))'
  },
  iphone: {
    label: 'Iphone',
    color: 'hsl(var(--chart-2))'
  }
};

export const browserConfig = {
  clicks: {
    label: 'Clicks'
  },
  safari: {
    label: 'Safari',
    color: 'hsl(var(--chart-1))'
  },
  chrome: {
    label: 'Chrome',
    color: 'hsl(var(--chart-3))'
  }
};

export const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))'
  }
};

export const pricingData = [
  {
    title: 'Free Plan',
    subtitle: 'Basic Access',
    price: 0,
    originalPrice: 50,
    discount: '100% OFF',
    buttonText: 'Get Started for Free',
    features: [
      'Add up to 2 custom domains',
      'Shorten unlimited URLs',
      'Basic analytics (total clicks)',
      'SSL for custom domains'
    ],
    extraFeatures: [
      'Basic link management (edit or delete links)',
      'Email support'
    ]
  },
  {
    title: 'Pro Plan',
    subtitle: 'Monthly Subscription',
    price: 50,
    originalPrice: 87,
    discount: '43% OFF',
    buttonText: 'Upgrade to Pro',
    featured: true,
    features: [
      'Unlimited custom domains',
      'Advanced analytics (clicks, location)',
      'Remove branding from URLs',
      'Custom URL slugs'
    ],
    extraFeatures: [
      'Priority email support',
      'No URL expiration limits',
      'Early access to new features'
    ]
  }
];
