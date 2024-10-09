import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Button,
  InputDiv,
  CardHeader,
  CardFooter,
  Label,
  Input,
  PassStrengthBar,
  Spinner,
  CardTitle,
  Dialog,
  DialogTrigger,
  DialogContent
} from '@/components/Index';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useAuthStore } from '@/store/useAuthStore';

import { FileUpload } from '@/components/ui/file-upload';
import { AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { passwordStrength } from 'check-password-strength';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const passwordSchema = z.object({
  oldPassword: z.string().nonempty("password can't be empty"),
  newPassword: z
    .string()
    .nonempty("new password can't be empty")
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/, {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character '
    })
});

const UpdateUser = () => {
  const { toast } = useToast();

  const { user, setUser, currentUser, loading: authLoader } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty, isTouched, isSubmitSuccessful, isSubmitting },
    watch,
    reset
  } = useForm({
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || ''
    }
  });

  if (!user || authLoader) {
    return <Spinner />;
  }

  const updateUserDetails = async (data) => {
    setLoading(true);
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/users/edit`,
        {
          fullName: data.fullName
        },
        {
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

  useEffect(() => {
    if (isSubmitSuccessful) {
      currentUser();
    }
  }, [isSubmitSuccessful, currentUser, setUser]);

  return (
    <form onSubmit={handleSubmit(updateUserDetails)}>
      <InputDiv
        label="Display name"
        placeholder="enter your fullname"
        value={watch('fullName')}
        {...register('fullName')}
      />
      <p className="text-red-500">{errors.fullName?.message}</p>
      <InputDiv label="Email " value={watch('email')} disabled />
      <div className="flex justify-end items-end">
        <Button
          disabled={
            isSubmitSuccessful || isSubmitting || (!isDirty && !isTouched)
          }
          type="submit"
        >
          {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
          Save
        </Button>
      </div>
    </form>
  );
};

const ChangePassword = () => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,

    formState: { errors, isDirty, isSubmitting }
  } = useForm({
    resolver: zodResolver(passwordSchema)
  });
  const { loading, changePass, user } = useAuthStore();

  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false
  });
  const [passStrength, setPassStrength] = useState(-1);

  const handleChangePassword = async ({ oldPassword, newPassword }) => {
    try {
      await changePass(user.email, oldPassword, newPassword);
      toast({
        title: 'Password Changed Successfully'
      });
    } catch (error) {
      console.log('change password error', error);
      toast({
        variant: 'destructive',

        title: error?.response?.data.message || 'something went wrong'
      });
    }
  };
  return (
    <div className="my-10">
      <div className="flex mb-3 text-red-500">
        <AlertTriangle className="mr-3" />
        Danger Zone
      </div>
      <Card>
        <CardHeader className="text-center font-bold">
          Change Password
        </CardHeader>
        <form onSubmit={handleSubmit(handleChangePassword)}>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between md:space-x-6">
              <div className="relative grid w-full items-center gap-1.5 mb-5">
                <Label htmlFor="oldPassword">Old Password: </Label>
                <Input
                  id="oldPassword"
                  type={showPassword.oldPassword ? 'text' : 'password'}
                  placeholder="enter your password"
                  {...register('oldPassword')}
                />
                <div className="absolute bottom-1 right-2 flex items-center">
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        oldPassword: !showPassword.oldPassword
                      }))
                    }
                    className="rounded-full  mt-10 w-7 h-7 flex items-center justify-center hover:bg-gray-400 focus:outline-none"
                  >
                    {showPassword.oldPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>
              <div className="relative grid w-full items-center gap-1.5">
                <Label htmlFor="password">New Password: </Label>
                <Input
                  label="password"
                  type={showPassword.newPassword ? 'text' : 'password'}
                  placeholder="enter new password"
                  {...register('newPassword')}
                  onChange={(e) => {
                    e.target.value !== ''
                      ? setPassStrength(passwordStrength(e.target.value).id)
                      : setPassStrength(-1);
                  }}
                />
                <div className="absolute bottom-5 right-2 flex items-center">
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        newPassword: !showPassword.newPassword
                      }))
                    }
                    className="rounded-full  mt-10 w-7 h-7 flex items-center justify-center hover:bg-gray-400 focus:outline-none"
                  >
                    {showPassword.newPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                <PassStrengthBar passStrength={passStrength} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <p className="text-red-600">
              {errors.oldPassword?.message || errors.newPassword?.message}
            </p>
            <Button
              disabled={isSubmitting || !isDirty}
              type="submit"
              variant={'destructive'}
            >
              {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
              Change Password
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

const SettingPage = () => {
  const { fetchCurrentUser } = useCurrentUser();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const { user, setUser, loading: authLoader, currentUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty, isTouched, isSubmitSuccessful, isSubmitting },
    watch,
    reset
  } = useForm({
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || ''
    }
  });

  useEffect(() => {
    currentUser();
  }, []);

  if (!user || authLoader) {
    return <Spinner />;
  }

  const handleFileUpload = async (files) => {
    if (files.length === 0) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', files[0]);
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/users/avatar`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setUser({ ...user, avatar: response.data.data.avatar });
      toast({
        title: `${response.data.message}`
      });
      setLoading(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'error',
        description: `${error.response?.data?.message}`
      });
      setLoading(false);
    }
  };

  const cancelSubscription = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/subscription/cancel`,
        {},
        {
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
        description:
          `${error?.response?.data.message}` || 'something went wrong'
      });
      setLoading(false);
    }
  };

  return (
    <div className="sm:col-span-10">
      <Card className="w-full ">
        <CardContent className="py-4">
          <form>
            <div className="flex space-x-3">
              <FileUpload onChange={handleFileUpload} />
            </div>
            <p className="text-red-600">{errors.avatar?.message}</p>
            <div className="flex justify-end items-end">
              <Button
                className="flex items-center mt-2"
                type="button"
                disabled={loading}
              >
                {loading && (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update
              </Button>
            </div>
          </form>
          <UpdateUser />
        </CardContent>
      </Card>

      <Card className="w-full my-3">
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <span>Current Plan:</span>
            <Badge variant="secondary" className="ml-2">
              {user.userType.toUpperCase()}
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          {user.userType === 'free' && (
            <Link to={'/pricing'}>
              <Button className="mt-2">Upgrade</Button>
            </Link>
          )}
        </CardFooter>
      </Card>
      <ChangePassword />
    </div>
  );
};

export default SettingPage;
