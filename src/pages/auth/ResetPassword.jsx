import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  Button,
  InputDiv,
  CardFooter,
  Label,
  Input,
  CardTitle,
  CardDescription,
  PassStrengthBar
} from '@/components/Index';
import { Eye, EyeOff } from 'lucide-react';

import { passwordStrength } from 'check-password-strength';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { z } from 'zod';

const passwordSchema = z.object({
  password: z
    .string()
    .nonempty("new password can't be empty")
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/, {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character '
    })
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [urlParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [passStrength, setPassStrength] = useState(-1);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm({
    defaultValues: {
      email: urlParams.get('email'),
      password: ''
    },
    resolver: zodResolver(passwordSchema)
  });

  const resetPassword = async ({ password }) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/users/reset-password`,
        {
          email: urlParams.get('email'),
          password,
          token: urlParams.get('token')
        }
      );
      toast({
        title: response.data.message
      });
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.log('reset password error: ', error);
      toast({
        variant: 'destructive',
        title: 'error',
        description: `${error.response.data.message}`
      });
    }
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit(resetPassword)}>
        <Card className="w-[400px] p-5">
          <CardTitle className="mb-3 text-center text-xl">
            Reset Password
          </CardTitle>
          <CardDescription className="mb-3 text-center">
            Enter your new password
          </CardDescription>
          <CardContent>
            <InputDiv disabled label="Email Address" value={watch('email')} />
            <div className="relative grid w-full items-center gap-1.5">
              <Label htmlFor="password">Password </Label>
              <Input
                label="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="enter new password"
                {...register('password')}
                onChange={(e) => {
                  e.target.value !== ''
                    ? setPassStrength(passwordStrength(e.target.value).id)
                    : setPassStrength(-1);
                }}
              />
              <div className="absolute bottom-5 right-2 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="rounded-full  mt-10 w-7 h-7 flex items-center justify-center hover:bg-gray-400 focus:outline-none"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              <PassStrengthBar passStrength={passStrength} />
            </div>
            <p className="text-red-600">{errors.password?.message}</p>
          </CardContent>
          <CardFooter>
            <Button
              disabled={isSubmitting || Object.keys(errors).length > 0}
              type="submit"
              className="w-full"
            >
              Submit
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default ResetPassword;
