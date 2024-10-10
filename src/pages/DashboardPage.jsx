import { useEffect, useState } from 'react';
import {
  Container,
  Input,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Separator,
  QrDialog,
  Switch,
  Spinner
} from '@/components/Index';
import moment from 'moment';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { ReloadIcon } from '@radix-ui/react-icons';
import { BadgePlus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useDebounce } from '@uidotdev/usehooks';
import { useAuthStore } from '@/store/useAuthStore';
import { useQrcode } from '@/hooks/useQrcode';
import usePaginationStore from '@/store/usePaginationStore';
import { useUrlStore } from '@/store/useUrlStore';
import { useDomainStore } from '@/store/domainStore';

const shortUrlSchema = z.object({
  url: z
    .string()
    .nonempty("URL can't be empty")
    .url({ message: 'Invalid URL' }),
  domainId: z
    .string()
    .optional()
    .refine(
      (value) => {
        return value === undefined || /^[a-fA-F0-9]{24}$/.test(value);
      },
      {
        message: 'Invalid Domain ID.'
      }
    ),
  expiredIn: z
    .string()
    .optional()
    .transform((str) => (str ? new Date(str) : undefined))
});

const DashboardPage = () => {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const [isExpirationTime, setIsExpirationTime] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchLoader, setSearchLoader] = useState(false);
  const [sortFilter, setSortFilter] = useState('all');

  const { qrcode, generateQrCode } = useQrcode();
  const { progress, setProgress, setLoading, loading } = useAuthStore();
  const { dashboardPageNo, setDashboardPageNo } = usePaginationStore();
  const { domains, loading: domainLoader, getAllDomains } = useDomainStore();
  const {
    shortUrl,
    deleteUrl,
    loading: urlLoader,
    userUrls,
    urls,
    searchUrls,
    shortUrlByDomain
  } = useUrlStore();

  const form = useForm({
    defaultValues: {
      url: '',
      domainId: '',
      expiredIn: ''
    },
    resolver: zodResolver(shortUrlSchema)
  });

  const fetchUserUrls = async () => {
    try {
      await userUrls();
    } catch (error) {
      console.log(error);
      toast({
        variant: 'destructive',
        title: 'error',
        description: `${error.response.data.message}`
      });
    }
  };

  const shortUrlHandler = async ({ url, domainId, expiredIn }) => {
    try {
      if (domainId !== undefined) {
        await shortUrlByDomain(url, domainId, expiredIn);
      } else {
        await shortUrl(url, expiredIn);
      }
      setOpenDialog(false);
      toast({
        title: 'url shortened successfully'
      });
      form.reset();
    } catch (error) {
      console.error('Error shortening URL:', error);
      toast({
        variant: 'destructive',
        title: 'error',
        description: `${error.response.data.message}`
      });
    }
  };

  useEffect(() => {
    fetchUserUrls();
  }, [dashboardPageNo]);

  useEffect(() => {
    getAllDomains();
  }, []);

  useEffect(() => {
    const fetchSearchUrls = async () => {
      if (!debouncedQuery) return fetchUserUrls();
      setSearchLoader(true);
      try {
        await searchUrls(debouncedQuery);
        setSearchLoader(false);
      } catch (error) {
        console.log(error);
        toast({
          variant: 'destructive',
          title: 'error',
          description: `${error.response.data.message}`
        });
        setSearchLoader(false);
      }
    };
    fetchSearchUrls();
  }, [debouncedQuery]);

  const sortUrls = () => {
    if (!urls || !urls.urls) return [];

    switch (sortFilter) {
      case 'custom':
        console.log(urls);
        return urls.urls.filter((url) => url.customUrl);
      case 'random':
        return urls.urls.filter((url) => !url.customUrl);
      case 'all':
      default:
        return urls.urls;
    }
  };

  return (
    <Container className="sm:col-span-10">
      <div className="flex justify-between">
        <div className="flex space-x-2 md:w-1/3 w-2/3">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search..."
            className=""
          />
          {searchLoader && <Spinner />}
        </div>
        <div className="flex space-x-3">
          <Select
            defaultValue={sortFilter}
            value={sortFilter}
            onValueChange={setSortFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="custom">Custom links</SelectItem>
              <SelectItem value="random">Random links</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button className="hover:bg-green-400">
                <div className="flex space-x-2">
                  <BadgePlus className="self-center" />
                  <span className="hidden md:block">Create</span>
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Link</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(shortUrlHandler)}>
                  <div className="grid gap-4 py-4">
                    <FormField
                      control={form.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Destination URL</FormLabel>
                          <Input
                            placeholder="This Should Be A Very Long URL..."
                            {...field}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="domainId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Domain</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a domain" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {domains.length > 0 ? (
                                domains.map((domain) => (
                                  <SelectItem
                                    value={domain._id}
                                    key={domain._id}
                                  >
                                    {domain.url}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem disabled>
                                  No domain found
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-center items-center space-x-3 my-2">
                      <Separator className="w-32" />
                      <span className="text-white">optional</span>
                      <Separator className="w-32" />
                    </div>
                    <div className="flex justify-between">
                      <p>Expiration Date</p>
                      <Switch
                        defaultChecked={isExpirationTime}
                        onCheckedChange={() => {
                          setIsExpirationTime((prev) => !prev);
                        }}
                      />
                    </div>
                    {isExpirationTime && (
                      <input
                        className="dark:bg-black"
                        type="date"
                        {...form.register('expiredIn')}
                      />
                    )}
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                    >
                      {urlLoader && (
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Create
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {sortUrls().length > 0 ? (
        sortUrls().map((url) => (
          <div
            key={url._id}
            className="dark:bg-[#1C1917] bg-slate-200  rounded-lg p-3 my-3"
          >
            <div className="flex justify-between">
              <a href={`${url.shortenUrl}`} target="_blank">
                <div className="flex mx-3">
                  <img
                    className="md:h-8 md:w-8 w-6 h-6 rounded-full self-center mr-2"
                    src={url.logo}
                    alt={url.originalUrl}
                  />
                  <div className="">
                    <p className="flex justify-start font-bold text-xs md:text-base">
                      {url.shortenUrl}
                    </p>
                    <p className="text-sm flex justify-start">
                      {url?.originalUrl?.slice(0, 30)}...
                    </p>
                  </div>
                </div>
              </a>
              <div className="flex space-x-5">
                <div className="hidden md:block space-y-1">
                  <p className="text-sm">{moment(url.expiredIn).format('L')}</p>
                  <p className="text-xs text-center">expires at</p>
                </div>
                <div className="hidden md:block space-y-1">
                  <p className="text-sm">{moment(url.createdAt).format('L')}</p>
                  <p className="text-xs text-center">created at</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <svg
                        width={15}
                        height={15}
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.625 2.5C8.625 3.12132 8.12132 3.625 7.5 3.625C6.87868 3.625 6.375 3.12132 6.375 2.5C6.375 1.87868 6.87868 1.375 7.5 1.375C8.12132 1.375 8.625 1.87868 8.625 2.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM7.5 13.625C8.12132 13.625 8.625 13.1213 8.625 12.5C8.625 11.8787 8.12132 11.375 7.5 11.375C6.87868 11.375 6.375 11.8787 6.375 12.5C6.375 13.1213 6.87868 13.625 7.5 13.625Z"
                          fill="currentColor"
                          fillRule="evenodd"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuGroup>
                      <Link to={`/dashboard/analytics/${url._id}`}>
                        <DropdownMenuItem className="cursor-pointer">
                          Analytics
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem
                        onClick={() =>
                          window.navigator.clipboard.writeText(url.shortenUrl)
                        }
                        className="cursor-pointer"
                      >
                        Copy{' '}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Dialog>
                          <DialogTrigger asChild>
                            <button onClick={() => generateQrCode(url._id)}>
                              QrCode
                            </button>
                          </DialogTrigger>
                          <QrDialog shortenedUrl={url} qrcode={qrcode} />
                        </Dialog>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-500 cursor-pointer"
                        onClick={() => deleteUrl(url._id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ))
      ) : urlLoader ? (
        <div className="my-3 text-center">
          <Spinner />
        </div>
      ) : (
        <p className="my-3 text-center">No urls found</p>
      )}

      <div className="flex justify-center space-x-2">
        <Button
          disabled={urls.hasPrevPage === false}
          onClick={() => setDashboardPageNo(dashboardPageNo - 1)}
        >
          Prev {'<<'}
        </Button>
        <Button
          disabled={urls.hasNextPage === false}
          onClick={() => setDashboardPageNo(dashboardPageNo + 1)}
        >
          Next {'>>'}
        </Button>
      </div>
    </Container>
  );
};

export default DashboardPage;
