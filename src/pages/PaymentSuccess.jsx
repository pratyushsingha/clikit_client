import { Button } from '@/components/Index';
import { Link, useSearchParams } from 'react-router-dom';

const PaymentSuccess = () => {
  const [ref] = useSearchParams();
  return (
    <section className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-500">
          Payment Successful
        </h1>
        <p className="text-xl text-gray-500 mt-4">
          Your payment was successful. Your reference number is:{' '}
          <code>{ref}.</code>
        </p>
        <Link to={'/'}>
          <Button className="my-3">Home</Button>
        </Link>
      </div>
    </section>
  );
};

export default PaymentSuccess;
