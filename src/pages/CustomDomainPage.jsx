import { Button, Container, InputDiv, Spinner } from '@/components/Index';
import { useToast } from '@/components/ui/use-toast';
import { useDomainStore } from '@/store/domainStore';
import { useAuthStore } from '@/store/useAuthStore';
import { instructions } from '@/utils/Index';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Settings } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

const domainSchema = z.object({
  domain: z
    .string()
    .nonempty("Domain can't be empty")
    .regex(
      /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,6}?$/,
      { message: 'Invalid domain or subdomain' }
    )
});

const CustomDomainPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(domainSchema)
  });
  const { user, currentUser, loading: authLoader } = useAuthStore();
  const { addDomain, getAllDomains, domains, loading } = useDomainStore();

  useEffect(() => {
    getAllDomains().catch((error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          `${error.response?.data?.message}` || 'Something went wrong'
      });
    });
  }, [getAllDomains]);

  const handleAddDomain = async ({ domain }) => {
    try {
      const response = await addDomain({ domain });
      navigate(`/dashboard/custom-domains/${response.data.data._id}`);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          `${error.response?.data?.message}` || 'Something went wrong'
      });
    }
  };

  if (!user || authLoader) {
    return <Spinner />;
  }

  return (
    <Container className="sm:col-span-10 justify-center items-center">
      <h1 className="flex justify-center items-center text-xl md:text-2xl font-bold">
        Brand your links with a custom domain
      </h1>
      <div className="flex justify-center items-center">
        <img
          className="w-4/12"
          src="https://app.bitly.com/s/bbt2/images/custom-domain-backhalf.png"
          alt=""
        />
        <div className="text-sm">
          {instructions.map((instruction) => (
            <section key={instruction.id} className="flex space-x-3">
              <Check className="text-green-500 text-xs" />
              <p>{instruction.title}</p>
            </section>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(handleAddDomain)}>
        <div className="flex space-x-3">
          <InputDiv
            disabled={user?.userType === 'free' && domains.length > 0}
            className="w-full"
            label="Add a domain"
            placeholder="yourbrand.co"
            {...register('domain')}
          />
          {user.userType === 'free' && domains.length > 0 ? (
            <Link to={'/pricing'}>
              <button
                type="button"
                className="flex space-x-3 self-center mt-7 h-10 animate-shimmer items-center justify-center rounded-md border border-green-600 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
              >
                💎
                <span>Upgrade</span>
              </button>
            </Link>
          ) : (
            <Button className="self-center mt-5">Add</Button>
          )}
        </div>
      </form>
      {errors.domain && (
        <p className="text-red-600 text-xs">{errors.domain?.message}</p>
      )}
      <span className="text-xs">Try entering your brand or product name</span>
      {loading && <Spinner />}
      {domains.length > 0 ? (
        domains.map((domain) => (
          <div
            key={domain._id}
            className="dark:bg-[#1C1917] bg-slate-200 rounded-lg p-3 my-3"
          >
            <div className="flex justify-between py-1 px-2">
              <div>
                <p className="self-center font-bold mb-2">{domain.url}</p>
                <Button
                  variant={domain.isDomainVerified ? '' : 'destructive'}
                  className="rounded-full text-xs"
                >
                  {domain.isDomainVerified ? 'Configured' : 'Not configured'}
                </Button>
              </div>
              <Button className="self-center" variant="ghost">
                <Link to={`/dashboard/custom-domains/${domain._id}`}>
                  <Settings />
                </Link>
              </Button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center">No domains found</p>
      )}
    </Container>
  );
};

export default CustomDomainPage;
