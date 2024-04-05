import { Link, Settings } from 'lucide-react';

export const SidebarItems = [
  { _id: 1, title: 'My Links', path: '/dashboard/', icon: <Link /> },
  {
    _id: 2,
    title: 'Settings',
    path: '/dashboard/settings',
    icon: <Settings />
  }
];
