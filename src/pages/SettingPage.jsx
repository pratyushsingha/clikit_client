import { useContext, useEffect, useState } from 'react';
import {
  AppContext,
  Card,
  CardContent,
  Button,
  InputDiv
} from '@/components/Index';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { ReloadIcon } from '@radix-ui/react-icons';
import useAuth from '@/hooks/useAuth';

const UpdateUser = () => {
  const { toast } = useToast();
  const { user, currentUser, setUser } = useContext(AppContext);
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty, isTouched, isSubmitSuccessful, isSubmitting },
    watch
  } = useForm({
    defaultValues: {
      fullName: user?.fullName,
      email: user?.email
    }
  });

  const updateUserDetails = async (data) => {
    setLoading(true);
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/users/edit`,
        {
          fullName: data.fullName
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
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
    isSubmitSuccessful && currentUser();
  }, [isSubmitSuccessful, setUser]);

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

const SettingPage = () => {
  const { toast } = useToast();
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentUser, user } = useContext(AppContext);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty, isTouched, isSubmitSuccessful, isSubmitting },
    watch
  } = useForm({
    defaultValues: {
      avatar: '',
      fullName: user.fullName,
      email: user.email
    }
  });
  const { avatar } = watch();
  const updateAvatar = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', data.avatar[0]);
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/users/avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );
      toast({
        title: `${response.data.message}`
      });
      setLoading(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'error',
        description: `${error.response.data.message}`
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (avatar) {
      const imageUrl = URL.createObjectURL(avatar[0]);
      setPreviewImage(imageUrl);
      // console.log(avatar[0], imageUrl);
    } else {
      setPreviewImage(user.avatar);
    }
  }, [avatar]);

  useEffect(() => {
    isSubmitSuccessful && currentUser();
  }, [isSubmitSuccessful]);

  useEffect(() => {
    currentUser();
  }, []);

  return (
    <div className="sm:col-span-10">
      <div className="grid grid-4 gap-2 sm:grid-cols-2">
        <div>
          <p className="h3">Personal Information</p>
          <span className="text-sm text-slate-500">
            Update your personal information
          </span>
        </div>
        <Card className="w-[350px] md:w-[500px]">
          <CardContent className="py-4">
            <form onSubmit={handleSubmit(updateAvatar)}>
              <div className="flex space-x-3">
                {previewImage && (
                  <img
                    className="w-20 h-20 rounded"
                    src={previewImage}
                    alt="preview"
                  />
                )}
                <input
                  className="self-center"
                  accept="image/png, image/jpg, image/jpeg"
                  type="file"
                  {...register('avatar')}
                />
              </div>
              <p className="text-red-600">{errors.avatar?.message}</p>
              <div className="flex justify-end items-end">
                <Button
                  className="flex items-center"
                  type="submit"
                  disabled={
                    isSubmitSuccessful ||
                    isSubmitting ||
                    (!isDirty && !isTouched)
                  }
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
      </div>
    </div>
  );
};

export default SettingPage;
