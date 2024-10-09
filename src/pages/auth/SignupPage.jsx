import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { passwordStrength } from 'check-password-strength';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ReloadIcon } from '@radix-ui/react-icons';

import {
  InputDiv,
  PassStrengthBar,
  Container,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Label,
  Input,
  Button
} from '@/components/Index';
import { useToast } from '@/components/ui/use-toast';
import { useAuthStore } from '@/store/useAuthStore';

const SignupSchema = z
  .object({
    fullName: z
      .string()
      .min(3, { message: 'Full name must be at least 3 characters long' })
      .max(50, { message: 'Full name must not exceed 50 characters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/, {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character '
      }),
    cnfPassword: z.string()
  })
  .refine(({ password, cnfPassword }) => password === cnfPassword, {
    message: "password doesn't match",
    path: ['cnfPassword']
  });

const SignupPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setValue
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      cnfPassword: ''
    },
    resolver: zodResolver(SignupSchema)
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passStrength, setPassStrength] = useState(-1);
  const { progress, setProgress, loading, setLoading, signup } = useAuthStore();

  const signUpHandler = async ({ fullName, email, password }) => {
    try {
      const response = await signup(fullName, email, password);

      setTimeout(() => {
        navigate('/login');
      }, 3000);
      setLoading(false);
      setProgress(progress + 100);
    } catch (error) {
      console.log(error);
      toast({
        variant: 'destructive',
        title: 'error',
        description:
          `${error.response?.data?.message}` || 'something went wrong'
      });
    }
  };

  return (
    <Container className="flex justify-center items-center mt-20">
      <Card className="w-[400px]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Tinytap</CardTitle>
          <CardDescription>Create Account</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(signUpHandler)}>
            <InputDiv
              label="fullName"
              placeholder="enter your name"
              {...register('fullName', {
                required: true
              })}
            />
            <p className="text-red-600">{errors.fullName?.message}</p>
            <InputDiv
              label="Email"
              placeholder="enter your email"
              {...register('email', {
                required: true
              })}
            />
            <p className="text-red-600">{errors.email?.message}</p>
            <div className="relative grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="password">Password: </Label>
              <Input
                label="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="enter your password"
                {...register('password', {
                  required: true
                })}
                onChange={(e) => {
                  e.target.value !== ''
                    ? setPassStrength(passwordStrength(e.target.value).id)
                    : setPassStrength(-1);
                }}
              />
              <div className="absolute bottom-1 right-2 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="rounded-full  mt-10 w-7 h-7 flex items-center justify-center hover:bg-gray-400 focus:outline-none"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>
            <PassStrengthBar passStrength={passStrength} />
            <p className="text-red-600">{errors.password?.message}</p>
            <InputDiv
              label="confirm password"
              type={!showPassword && 'password'}
              placeholder="confirm password"
              {...register('cnfPassword', {
                required: true
              })}
            />
            <p className="text-red-600">{errors.cnfPassword?.message}</p>
            <div>
              <Button disabled={isSubmitting} className="w-full">
                {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                create account
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="justify-center flex-col space-y-3">
          <div className="flex">
            <p>Already have an account? ‎ </p>
            <Link
              to="/login"
              className="font-semibold leading-6 text-[#22C55E] hover:text-green-600 hover:underline"
            >
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </Container>
  );
};

export default SignupPage;
