import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReloadIcon } from '@radix-ui/react-icons';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
  InputDiv
} from '@/components/Index';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/store/useAuthStore';

const emailSchema = z.object({
  email: z
    .string()
    .nonempty({ message: 'Email is required' })
    .email({ message: 'Invalid email address' })
});

const ForgotPassword = () => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      email: ''
    },
    resolver: zodResolver(emailSchema)
  });
  const { loading, sendPasswordResetEmail } = useAuthStore();

  const resetPasswordHandler = async ({ email }) => {
    try {
      const response = await sendPasswordResetEmail(email);
      toast({
        title: response.data.message
      });
    } catch (error) {
      console.log(`reset password email error: ${error}`);
      toast({
        variant: 'destructive',
        title: 'error',
        description: `${error.response.data.message}`
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit(resetPasswordHandler)}>
        <Card className=" p-5">
          <CardTitle className="mb-3">Forgot Password</CardTitle>
          <CardDescription className="mb-5">
            Enter your email address and we we'll send you a link to reset your
            password
          </CardDescription>
          <CardContent>
            <InputDiv
              label="Email Address"
              placeholder="example@gmail.com"
              {...register('email')}
            />
            <p className="text-red-600">{errors.email?.message}</p>
          </CardContent>
          <CardFooter>
            <Button
              diabled={isSubmitting}
              type="submit"
              className="w-full space-x-3"
            >
              {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
              Send Reset Link
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default ForgotPassword;
