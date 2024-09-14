import Container from '@/components/Container';
import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import {
  AppContext,
  Button,
  Input,
  InputDiv,
  Spinner
} from '@/components/Index';
import { BadgePlus } from 'lucide-react';
import moment from 'moment';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { QrDialog } from '@/components/Index';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

const ManageDomain = () => {
  const { toast } = useToast();
  const { domainId } = useParams();
  const [domainDetails, setDomainDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [urls, setUrls] = useState([]);
  const { progress, setProgress, generateQrCode, qrcode } =
    useContext(AppContext);

  const handlePrevClick = () => {
    setPage((prev) => prev - 1);
  };

  const handleNextClick = () => {
    setPage((prev) => prev + 1);
  };

  const fetchDomainDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/domain/${domainId}`,
        {
          withCredentials: true
        }
      );
      console.log(response.data.data);
      setDomainDetails(response.data.data);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Something went wrong'
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyDomainOwnership = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/domain/${domainId}/verify`,
        {
          withCredentials: true
        }
      );
      setDomainDetails((prev) => ({
        ...prev,
        isDomainVerified: true
      }));
    } catch (error) {
      toast({
        title: 'Pending',
        description: 'domain verification is still pending please wait !!'
      });
    }
  };

  const getUrlsByDomain = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/url/domain/${domainId}`,
        {
          withCredentials: true
        }
      );
      console.log(response.data.data);
      setUrls(response.data.data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchDomainDetails();
  }, []);

  useEffect(() => {
    verifyDomainOwnership();
  }, [domainDetails.isDomainVerified]);

  useEffect(() => {
    getUrlsByDomain();
  }, [domainId]);

  return (
    <Container className="sm:col-span-10 justify-center items-center">
      {loading && <Spinner />}

      {!loading && domainDetails.isDomainVerified === false ? (
        <div>
          <p className="text-xs">
            To be able to use your links you need to set up DNS records at your
            domain registrar account. You can already create and share branded
            links, but they will start to work after you complete the setup.
            Here are general instructions:
          </p>
          <Collapsible className="bg-[#1C1917] px-3 py-3 my-3 rounded-lg">
            <CollapsibleTrigger>
              DNS SETUP INSTRUCTION FOR DOMAIN{' '}
            </CollapsibleTrigger>
            <CollapsibleContent className="my-4">
              <hr />
              <p className="my-2 font-serif">
                You can forward these instructions to a tech person in your
                company. Need help? Contact us at support@tinytap.live
              </p>
              <hr />
              <p className="my-9 font-serif">
                These instructions will guide you in setting up domain
                test.pratyushsingh.me to create short links by SHORT.IO. After
                setup, the domain will point all HTTP and HTTPS requests to
                SHORT.IO servers, so that's how short links will work.
              </p>
              <p className="font-serif">
                Step 1: Go to your domain registrar, sign in, and locate the
                domain DNS Manage section.
              </p>
              <p className="font-serif">
                Step 2: Create a new type <code>TXT</code> record with a name{' '}
                <code>{domainDetails.txtRecord?.name}</code> (no quotes) and
                value <code>{domainDetails.txtRecord?.value}</code> (no quotes).
                Save changes.
              </p>
              <div className="my-5 font-serif">
                <p className="mb-2">So you will see a new record:</p>
                <span className="flex space-x-3">
                  <code>{domainDetails.txtRecord?.recordType}</code>{' '}
                  <code>{domainDetails.txtRecord?.name}</code>
                  {'      '}
                  <code>{domainDetails.txtRecord?.value}</code>
                </span>
              </div>
              <p className="my-3 font-serif">
                Done! Now wait for the server's updates; it might take 1-2
                hours. We will notify you by email.
              </p>

              <div className="flex justify-end items-end space-x-3">
                <Button>Copy</Button>
                <Button onClick={verifyDomainOwnership}>Refresh</Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      ) : (
        <div className="flex flex-col space-y-4">
          <div className="flex w-full space-x-3">
            <Input
              className="w-full md:w-7/12"
              placeholder="Paste a long URL here..."
            />
            <Button>
              <BadgePlus />
            </Button>
          </div>
          <div className="w-full md:w-11/12 flex flex-col space-y-3">
            {urls.urlCount > 0 ? (
              urls.urls.map((url) => (
                <div
                  key={url._id}
                  className="dark:bg-[#1C1917] bg-slate-200  rounded-lg p-3 my-3"
                >
                  <div className="flex justify-between">
                    <a href={`https://${url.customUrl}`} target="_blank">
                      <div className="flex mx-3">
                        <img
                          className="md:h-8 md:w-8 w-6 h-6 rounded-full self-center mr-2"
                          src={url.logo}
                          alt={url.originalUrl}
                        />
                        <div className="">
                          <p className="flex justify-start font-bold text-xs md:text-base">
                            {url.customUrl}
                          </p>
                          <p className="text-sm flex justify-start">
                            {url?.originalUrl?.slice(0, 30)}...
                          </p>
                        </div>
                      </div>
                    </a>
                    <div className="flex space-x-5">
                      <div className="hidden md:block space-y-1">
                        <p className="text-sm">
                          {moment(url.expiredIn).format('L')}
                        </p>
                        <p className="text-xs text-center">expires at</p>
                      </div>
                      <div className="hidden md:block space-y-1">
                        <p className="text-sm">
                          {moment(url.createdAt).format('L')}
                        </p>
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
                                window.navigator.clipboard.writeText(
                                  url.shortenUrl
                                )
                              }
                              className="cursor-pointer"
                            >
                              Copy{' '}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <button
                                    onClick={() => generateQrCode(url._id)}
                                  >
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
            ) : loading ? (
              <div className="my-3 text-center">
                <Spinner />
              </div>
            ) : (
              <p className="my-3 text-center">No urls found</p>
            )}
          </div>
          <div className="flex justify-center space-x-2">
            <Button
              disabled={urls.hasPrevPage === false}
              onClick={handlePrevClick}
            >
              Prev {'<<'}
            </Button>
            <Button
              disabled={urls.hasNextPage === false}
              onClick={handleNextClick}
            >
              Next {'>>'}
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default ManageDomain;
