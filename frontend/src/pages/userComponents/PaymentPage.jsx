import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use this for navigation
import toast from 'react-hot-toast';
import { CreditCard, Smartphone, Truck, Building, ShoppingCart, User } from 'lucide-react';

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [upiId, setUpiId] = useState('');
  const [bank, setBank] = useState('');
  const [billingDetails, setBillingDetails] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
  });

  const navigate = useNavigate();

  const handleBillingChange = (e) => {
    setBillingDetails({ ...billingDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Payment method:', paymentMethod);
    console.log('Billing details:', billingDetails);
    if (paymentMethod === 'upi') {
      console.log('UPI ID:', upiId);
    } else if (paymentMethod === 'netbanking') {
      console.log('Selected Bank:', bank);
    }
    // Show success toast and redirect
    toast.success('Booking successful! \n Redirecting to home page...');
    setTimeout(() => {
      navigate('/');
    }, 3000); // Wait 3 seconds before redirecting
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Checkout</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3">
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Billing Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="fullName"
                value={billingDetails.fullName}
                onChange={handleBillingChange}
                placeholder="Full Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="email"
                name="email"
                value={billingDetails.email}
                onChange={handleBillingChange}
                placeholder="Email Address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                name="address"
                value={billingDetails.address}
                onChange={handleBillingChange}
                placeholder="Address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                name="city"
                value={billingDetails.city}
                onChange={handleBillingChange}
                placeholder="City"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                name="zipCode"
                value={billingDetails.zipCode}
                onChange={handleBillingChange}
                placeholder="ZIP Code"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Method
            </h2>
            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="creditcard"
                  checked={paymentMethod === 'creditcard'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="form-radio text-blue-600"
                />
                <CreditCard className="w-6 h-6 text-gray-600" />
                <span className="text-gray-700">Credit/Debit Card</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="form-radio text-blue-600"
                />
                <Smartphone className="w-6 h-6 text-gray-600" />
                <span className="text-gray-700">UPI</span>
              </label>

              {paymentMethod === 'upi' && (
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="Enter UPI ID"
                  className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              )}

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="netbanking"
                  checked={paymentMethod === 'netbanking'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="form-radio text-blue-600"
                />
                <Building className="w-6 h-6 text-gray-600" />
                <span className="text-gray-700">Net Banking</span>
              </label>

              {paymentMethod === 'netbanking' && (
                <select
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                  className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Bank</option>
                  <option value="sbi">State Bank of India</option>
                  <option value="hdfc">HDFC Bank</option>
                  <option value="icici">ICICI Bank</option>
                  <option value="axis">Axis Bank</option>
                </select>
              )}

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="form-radio text-blue-600"
                />
                <Truck className="w-6 h-6 text-gray-600" />
                <span className="text-gray-700">Cash on Delivery</span>
              </label>
            </div>

            <button
              type="submit"
              className="mt-6 w-full bg-slate-800 text-white font-bold py-3 px-4 rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-250 ease-in-out"
            >
              Place Order
            </button>
          </form>
        </div>
        <div className="md:w-1/3">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Order Summary
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>&#8377;99.99</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>&#8377;5.00</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>&#8377;10.00</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>&#8377;114.99</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
