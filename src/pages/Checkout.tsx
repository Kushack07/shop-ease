import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, CheckCircle } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { apiHelper } from '@/utils/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  });

  const cartTotal = getTotal();
  const shipping = cartTotal > 50 ? 0 : 5.99;
  const tax = cartTotal * 0.08;
  const finalTotal = cartTotal + shipping + tax;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setStep('confirmation');
      clearCart();
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleCardChange = (field: string, value: string) => {
    setCardDetails(prev => ({ ...prev, [field]: value }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">
            Please log in to checkout
          </h2>
          <Button onClick={() => navigate('/login')}>
            Login to Continue
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0 && step !== 'confirmation') {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">
            Your cart is empty
          </h2>
          <Button onClick={() => navigate('/products')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center space-x-2 ${
              step === 'shipping' ? 'text-primary-600' : 'text-secondary-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'shipping' ? 'bg-primary-600 text-white' : 'bg-secondary-200'
              }`}>
                1
              </div>
              <span className="hidden sm:block">Shipping</span>
            </div>
            <div className="w-8 h-0.5 bg-secondary-200"></div>
            <div className={`flex items-center space-x-2 ${
              step === 'payment' ? 'text-primary-600' : 'text-secondary-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'payment' ? 'bg-primary-600 text-white' : 'bg-secondary-200'
              }`}>
                2
              </div>
              <span className="hidden sm:block">Payment</span>
            </div>
            <div className="w-8 h-0.5 bg-secondary-200"></div>
            <div className={`flex items-center space-x-2 ${
              step === 'confirmation' ? 'text-primary-600' : 'text-secondary-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'confirmation' ? 'bg-primary-600 text-white' : 'bg-secondary-200'
              }`}>
                3
              </div>
              <span className="hidden sm:block">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 'shipping' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Truck className="h-5 w-5" />
                    <span>Shipping Address</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleShippingSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="First Name"
                        value={shippingAddress.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                      />
                      <Input
                        label="Last Name"
                        value={shippingAddress.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                      />
                    </div>
                    <Input
                      label="Address"
                      value={shippingAddress.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="City"
                        value={shippingAddress.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        required
                      />
                      <Input
                        label="State"
                        value={shippingAddress.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="ZIP Code"
                        value={shippingAddress.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        required
                      />
                      <Input
                        label="Phone"
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Continue to Payment
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {step === 'payment' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Payment Method</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-secondary-700">
                        Payment Method
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            value="card"
                            checked={paymentMethod === 'card'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="text-primary-600"
                          />
                          <span>Credit Card</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            value="paypal"
                            checked={paymentMethod === 'paypal'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="text-primary-600"
                          />
                          <span>PayPal</span>
                        </label>
                      </div>
                    </div>

                    {paymentMethod === 'card' && (
                      <div className="space-y-4">
                        <Input
                          label="Card Number"
                          value={cardDetails.number}
                          onChange={(e) => handleCardChange('number', e.target.value)}
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label="Expiry Date"
                            value={cardDetails.expiry}
                            onChange={(e) => handleCardChange('expiry', e.target.value)}
                            placeholder="MM/YY"
                            required
                          />
                          <Input
                            label="CVC"
                            value={cardDetails.cvc}
                            onChange={(e) => handleCardChange('cvc', e.target.value)}
                            placeholder="123"
                            required
                          />
                        </div>
                        <Input
                          label="Cardholder Name"
                          value={cardDetails.name}
                          onChange={(e) => handleCardChange('name', e.target.value)}
                          required
                        />
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      loading={isProcessing}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : 'Place Order'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {step === 'confirmation' && (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-secondary-900 mb-2">
                    Order Confirmed!
                  </h2>
                  <p className="text-secondary-600 mb-6">
                    Thank you for your purchase. Your order has been successfully placed.
                  </p>
                  <div className="space-y-4">
                    <Button onClick={() => navigate('/orders')} className="w-full">
                      View Orders
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/products')} className="w-full">
                      Continue Shopping
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div className="flex-1">
                        <div className="font-medium text-secondary-900">
                          {item.product.name}
                        </div>
                        <div className="text-secondary-600">
                          Qty: {item.quantity}
                        </div>
                      </div>
                      <span className="font-medium">
                        {apiHelper.formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-secondary-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-600">Subtotal</span>
                    <span className="font-medium">{apiHelper.formatCurrency(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-600">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? 'Free' : apiHelper.formatCurrency(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-600">Tax</span>
                    <span className="font-medium">{apiHelper.formatCurrency(tax)}</span>
                  </div>
                  <div className="border-t border-secondary-200 pt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>{apiHelper.formatCurrency(finalTotal)}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Address Preview */}
                {step === 'payment' && (
                  <div className="border-t border-secondary-200 pt-4">
                    <h4 className="font-medium text-secondary-900 mb-2">Shipping to:</h4>
                    <div className="text-sm text-secondary-600">
                      <div>{shippingAddress.firstName} {shippingAddress.lastName}</div>
                      <div>{shippingAddress.address}</div>
                      <div>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</div>
                      <div>{shippingAddress.country}</div>
                      <div>{shippingAddress.phone}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
