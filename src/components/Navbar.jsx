import { Github } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import {
  Button,
  Separator,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  AppContext
} from './Index';
import { ModeToggle } from '@/components/Index';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser, setUser, user } = useContext(AppContext);

  const logoutUser = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/logout`,
        {},
        { withCredentials: true }
      );
      localStorage.removeItem('accessToken');
      console.log(response);
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    currentUser();
  }, [setUser]);
  return (
    <nav className="flex justify-between mx-10 my-10">
      <Link to={'/'}>
        <p className="h2 cursor-pointer">Tinytap</p>
      </Link>
      <div className="flex space-x-4">
        {localStorage.getItem('accessToken') ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full">
                <img
                  className="h-10 w-10 rounded-full"
                  src={user?.avatar}
                  alt={user?.fullName}
                />
              </button>
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
