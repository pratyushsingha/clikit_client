import { Github, HandCoins, Menu } from 'lucide-react';

import { Link, NavLink, useNavigate } from 'react-router-dom';

import {
  Button,
  Separator,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  SidebarItems
} from './Index';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { ModeToggle } from '@/components/Index';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from './ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { RainbowButton } from './ui/rainbow-button';

const Navbar = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { logout, user, isAuthenticated, currentUser } = useAuthStore();

  const logoutUser = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.log('logout error:', error);
      toast({
        variant: 'destructive',
        title: 'error',
        description: `${error?.response?.data.message}`
      });
    }
  };

  return (
    <nav className="flex justify-between mx-10 my-10">
      <div className="flex space-x-3">
        {isAuthenticated && (
          <Sheet>
            <SheetTrigger>
              <Button variant="ghost" className="block md:hidden">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-5">
              <SheetHeader className="mb-8">
                <SheetTitle className="text-xl font-semibold">
                  CLIKIT
                </SheetTitle>
              </SheetHeader>
              <div className="space-y-6">
                {SidebarItems.map((item) => (
                  <NavLink
                    to={item.path}
                    className="block p-4 rounded-lg hover:bg-[#1C1917] transition-all duration-300"
                    key={item.title}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="">{item.icon}</span>
                      <span className="font-medium">{item.title}</span>
                    </div>
                  </NavLink>
                ))}
                <NavLink
                  to="/pricing"
                  className="block p-4 rounded-lg hover:bg-[#1C1917] transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <span className="">
                      <HandCoins />
                    </span>
                    <span className="font-medium">Pricing</span>
                  </div>
                </NavLink>
                <Separator />
                <NavLink
                  href={'https://github.com/pratyushsingha/clikit'}
                  className="block p-4 rounded-lg hover:bg-[#1C1917] transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <span className="">
                      <Github />
                    </span>
                    <span className="font-medium">Github</span>
                  </div>
                </NavLink>
              </div>
            </SheetContent>
          </Sheet>
        )}

        <Link to={'/'}>
          <p className="h2 cursor-pointer">CLIKIT</p>
        </Link>
      </div>
      <div className="flex space-x-4">
        <Link className="hidden md:block" to={'/pricing'}>
          <RainbowButton variant="ghost">Pricing</RainbowButton>
        </Link>

        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar>
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.fullName.split('')[0]}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer">
                  <Link to="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-500 cursor-pointer"
                  onClick={logoutUser}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link to={'/login'}>
            <Button>Login</Button>
          </Link>
        )}

        <Separator className="hidden md:block" orientation="vertical" />
        <a
          className="hidden md:block"
          href="https://github.com/pratyushsingha/tinytap_frontend"
          target="_blank"
        >
          <Button variant="ghost" className="rounded-full">
            <Github />
          </Button>
        </a>
        <Separator orientation="vertical" />
        <ModeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
