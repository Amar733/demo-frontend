'use client';

import { useState } from 'react';

export default function CheckoutPage() {
  const [mobile, setMobile] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
    setMobile(value);
  };

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
    setPostalCode(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle checkout logic
    console.log('Processing checkout...');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <input
              type="tel"
              placeholder="Mobile Number"
              value={mobile}
              onChange={handleMobileChange}
              pattern="\d*"
              inputMode="numeric"
              className="w-full border rounded-lg px-4 py-2"
              required
              minLength={10}
              maxLength={15}
            />
            <p className="text-xs text-gray-500 mt-1">Enter numbers only (10-15 digits)</p>
          </div>

          {/* Shipping Address */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border rounded-lg px-4 py-2"
                required
              />
              <input
                type="text"
                placeholder="Address"
                className="w-full border rounded-lg px-4 py-2"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  className="border rounded-lg px-4 py-2"
                  required
                />
                <div>
                  <input
                    type="text"
                    placeholder="Postal Code"
                    value={postalCode}
                    onChange={handlePostalCodeChange}
                    pattern="\d*"
                    inputMode="numeric"
                    className="border rounded-lg px-4 py-2 w-full"
                    required
                    minLength={4}
                    maxLength={10}
                  />
                  <p className="text-xs text-gray-500 mt-1">Numbers only</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Payment</h2>
            <p className="text-gray-600 mb-4">Payment integration coming soon...</p>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Place Order
          </button>
        </form>

        {/* Order Summary */}
        <div className="border rounded-lg p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <p className="text-gray-600">Your cart items will appear here</p>
        </div>
      </div>
    </div>
  );
}
