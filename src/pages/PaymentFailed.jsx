import React from 'react';

const PaymentFailed = () => {
  return (
    <section className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-500">Payment Failed</h1>
        <p className="text-xl text-gray-500 mt-4">
          Your payment was not successful. Please try again.
        </p>
      </div>
    </section>
  );
};

export default PaymentFailed;
