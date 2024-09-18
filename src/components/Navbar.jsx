import { Github } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import {
  Button,
  Separator,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './Index';
import { ModeToggle } from '@/components/Index';
import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from './ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const Navbar = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated, user, isAuthenticated } = useAuthStore();

  const logoutUser = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/logout`,
        {},
        { withCredentials: true }
      );
      setUser(null);
      setIsAuthenticated(false);
      navigate('/');
    } catch (error) {
      console.log('logout error:', error);
      toast({
        variant: 'destructive',
        title: 'error',
        description: `${error.response.data.message}`
      });
    }
  };

  return (
    <nav className="flex justify-between mx-10 my-10">
      <Link to={'/'}>
        <p className="h2 cursor-pointer">CLIKIT</p>
      </Link>
      <div className="flex space-x-4">
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar>
                <AvatarImage src={user?.avatar || user?.avatar} />
                <AvatarFallback>
                  {user?.fullName.split('')[0].toUpperCase()}
                </AvatarFallback>
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

        <Separator orientation="vertical" />
        <a
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
