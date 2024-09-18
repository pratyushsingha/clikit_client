import PassStrengthBar from './PassStrengthBar';
import { Label } from './ui/label';
import { Input } from './ui/input';
import InputDiv from './InputDiv';
import Container from './Container';
import SignupPage from '@/pages/auth/SignupPage';
import ThemeProvider from './theme-provider';
import App from '@/App';
import LoginPage from '@/pages/auth/LoginPage';
import HomePage from '@/pages/HomePage';
import ModeToggle from './mode-toggle';
import DashboardPage from '@/pages/DashboardPage';
import SettingPage from '@/pages/SettingPage';
import Sidebar from './Sidebar';
import { SidebarItems } from '@/utils/Index';
import AnalyticsChart from '@/components/AnalyticsChart';
import DashboardLayout from './DashboardLayout';
import AuthLayout from './AuthLayout';
import AnalyticsPage from '@/pages/AnalyticsPage';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';
// import { Toaster } from './ui/toaster';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import QrDialog from '@/components/QrDialog';
import Spinner from '@/components/loader/Spinner';
import { Switch } from '@/components/ui/switch';
import { Toaster } from './ui/toaster';

export {
  PassStrengthBar,
  Label,
  Input,
  InputDiv,
  Container,
  SignupPage,
  ThemeProvider,
  App,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  Toaster,
  LoginPage,
  Checkbox,
  Separator,
  HomePage,
  ModeToggle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DashboardPage,
  SettingPage,
  Sidebar,
  SidebarItems,
  QrDialog,
  Switch,
  Spinner,
  AnalyticsChart,
  DashboardLayout,
  AuthLayout,
  AnalyticsPage
};
