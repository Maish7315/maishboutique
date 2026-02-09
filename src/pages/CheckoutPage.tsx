import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Check, 
  CreditCard, 
  Phone, 
  MapPin, 
  Truck, 
  Wallet,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrderContext';
import { formatPrice } from '@/data/products';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Delivery zones with pricing
const DELIVERY_ZONES = [
  { id: 'narok-town', name: 'Narok Town', price: 0, description: 'Free delivery within town' },
  { id: 'narok-county', name: 'Narok County', price: 200, description: 'Delivery to other areas in Narok County' },
  { id: 'nairobi', name: 'Nairobi', price: 350, description: 'Doorstep delivery in Nairobi' },
  { id: 'other', name: 'Other Counties', price: 500, description: 'Delivery to other counties in Kenya' },
];

// Payment methods
const PAYMENT_METHODS = [
  {
    id: 'mpesa',
    name: 'M-Pesa',
    icon: 'M',
    description: 'Pay via STK push or manually',
    color: '#4CAF50',
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    icon: 'COD',
    description: 'Pay when you receive your order',
    color: '#FF9800',
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: '💳',
    description: 'Visa, Mastercard',
    color: '#1a1f71',
  },
];

type CheckoutStep = 'shipping' | 'payment' | 'confirmation';

interface ShippingInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  county: string;
  town: string;
  address: string;
  instructions: string;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const { addOrder } = useOrders();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [selectedZone, setSelectedZone] = useState(DELIVERY_ZONES[0]);
  const [selectedPayment, setSelectedPayment] = useState(PAYMENT_METHODS[0]);
  const [promoApplied, setPromoApplied] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    county: '',
    town: '',
    address: '',
    instructions: '',
  });

  const [errors, setErrors] = useState<Partial<ShippingInfo>>({});

  const discount = promoApplied ? subtotal * 0.4 : 0;
  const finalTotal = subtotal - discount + selectedZone.price;

  const validateShipping = () => {
    const newErrors: Partial<ShippingInfo> = {};
    
    if (!shippingInfo.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!shippingInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!shippingInfo.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!shippingInfo.county.trim()) newErrors.county = 'County is required';
    if (!shippingInfo.town.trim()) newErrors.town = 'Town is required';
    if (!shippingInfo.address.trim()) newErrors.address = 'Address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToPayment = () => {
    if (validateShipping()) {
      setCurrentStep('payment');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Generate order number
      const orderNum = 'MF-' + Date.now().toString(36).toUpperCase();
      
      // Save order to Supabase
      await addOrder({
        orderNumber: orderNum,
        customer: {
          firstName: shippingInfo.firstName,
          lastName: shippingInfo.lastName,
          phone: shippingInfo.phone,
          email: shippingInfo.email,
        },
        shipping: {
          county: shippingInfo.county,
          town: shippingInfo.town,
          address: shippingInfo.address,
          instructions: shippingInfo.instructions,
        },
        items: items.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor.name,
          colorHex: item.selectedColor.hex,
          image: item.product.images[0]?.src || '',
        })),
        payment: {
          method: selectedPayment.name,
          status: selectedPayment.id === 'cod' ? 'cod' : 'pending',
        },
        delivery: {
          zone: selectedZone.name,
          price: selectedZone.price,
          status: 'pending',
        },
        pricing: {
          subtotal,
          discount,
          delivery: selectedZone.price,
          total: finalTotal,
        },
        status: 'pending',
      });
      
      setOrderNumber(orderNum);
      setOrderPlaced(true);
      clearCart();
      setCurrentStep('confirmation');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error placing order:', error);
      setSubmitError('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 'payment') {
      setCurrentStep('shipping');
    } else if (currentStep === 'confirmation') {
      setCurrentStep('payment');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center mb-6">
            <CreditCard className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold">No Items to Checkout</h1>
          <p className="text-muted-foreground mt-2">
            Add some items to your cart first
          </p>
          <Button size="lg" className="mt-6" asChild>
            <Link to="/">Start Shopping</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md w-full"
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-success/10 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-14 h-14 text-success" />
          </div>
          <h1 className="font-display text-2xl font-bold text-success mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-muted-foreground mb-6">
            Thank you for your order. We'll process it right away.
          </p>
          
          <div className="bg-card rounded-xl border border-border p-5 mb-6">
            <p className="text-sm text-muted-foreground mb-1">Order Number</p>
            <p className="font-mono text-xl font-bold">{orderNumber}</p>
          </div>

          <div className="bg-muted/50 rounded-xl p-4 mb-6 text-left">
            <h3 className="font-semibold mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Items:</span>
                <span>{items.length} products</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span>{selectedZone.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment:</span>
                <span>{selectedPayment.name}</span>
              </div>
              <div className="border-t border-border pt-2 mt-2 flex justify-between font-semibold">
                <span>Total:</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button size="lg" className="w-full" asChild>
              <Link to="/">Continue Shopping</Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full" asChild>
              <Link to="/categories">Browse Categories</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-transition">
      {/* Header */}
      <div className="sticky top-16 md:top-20 z-30 bg-background border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="touch-target flex items-center justify-center hover:bg-muted rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="font-display text-lg md:text-2xl font-semibold">Checkout</h1>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {currentStep === 'shipping' && 'Step 1 of 2 - Shipping Details'}
                  {currentStep === 'payment' && 'Step 2 of 2 - Payment Method'}
                  {currentStep === 'confirmation' && 'Order Confirmed'}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mt-4">
            {['shipping', 'payment'].map((step, index) => (
              <React.Fragment key={step}>
                <div
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                    currentStep === step
                      ? 'bg-primary text-primary-foreground'
                      : index < ['shipping', 'payment'].indexOf(currentStep)
                      ? 'bg-success/10 text-success'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {index < ['shipping', 'payment'].indexOf(currentStep) ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-current/20 flex items-center justify-center text-xs">
                      {index + 1}
                    </span>
                  )}
                  <span className="hidden sm:inline">{step === 'shipping' ? 'Shipping' : 'Payment'}</span>
                </div>
                {index < 1 && (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Shipping Step */}
              {currentStep === 'shipping' && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {/* Contact Info */}
                  <div className="bg-card rounded-xl border border-border p-5">
                    <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Phone className="w-5 h-5 text-primary" />
                      Contact Information
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">First Name *</label>
                        <input
                          type="text"
                          value={shippingInfo.firstName}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                          className={cn(
                            'w-full h-11 px-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20',
                            errors.firstName ? 'border-destructive' : 'border-border'
                          )}
                          placeholder="First name"
                        />
                        {errors.firstName && (
                          <p className="text-destructive text-sm mt-1">{errors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Last Name *</label>
                        <input
                          type="text"
                          value={shippingInfo.lastName}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                          className={cn(
                            'w-full h-11 px-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20',
                            errors.lastName ? 'border-destructive' : 'border-border'
                          )}
                          placeholder="Last name"
                        />
                        {errors.lastName && (
                          <p className="text-destructive text-sm mt-1">{errors.lastName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          value={shippingInfo.phone}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                          className={cn(
                            'w-full h-11 px-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20',
                            errors.phone ? 'border-destructive' : 'border-border'
                          )}
                          placeholder="07XX XXX XXX"
                        />
                        {errors.phone && (
                          <p className="text-destructive text-sm mt-1">{errors.phone}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Email (Optional)</label>
                        <input
                          type="email"
                          value={shippingInfo.email}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                          className="w-full h-11 px-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20"
                          placeholder="email@example.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="bg-card rounded-xl border border-border p-5">
                    <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      Delivery Address
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium mb-1">County *</label>
                        <select
                          value={shippingInfo.county}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, county: e.target.value })}
                          className={cn(
                            'w-full h-11 px-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20',
                            errors.county ? 'border-destructive' : 'border-border'
                          )}
                        >
                          <option value="">Select county</option>
                          <option value="Narok">Narok</option>
                          <option value="Nairobi">Nairobi</option>
                          <option value="Kajiado">Kajiado</option>
                          <option value="Mombasa">Mombasa</option>
                          <option value="Kisumu">Kisumu</option>
                          <option value="Nakuru">Nakuru</option>
                          <option value="Eldoret">Eldoret</option>
                          <option value="Other">Other</option>
                        </select>
                        {errors.county && (
                          <p className="text-destructive text-sm mt-1">{errors.county}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Town/Area *</label>
                        <input
                          type="text"
                          value={shippingInfo.town}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, town: e.target.value })}
                          className={cn(
                            'w-full h-11 px-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20',
                            errors.town ? 'border-destructive' : 'border-border'
                          )}
                          placeholder="e.g., Narok Town, Kileleshwa"
                        />
                        {errors.town && (
                          <p className="text-destructive text-sm mt-1">{errors.town}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Street Address *</label>
                        <input
                          type="text"
                          value={shippingInfo.address}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                          className={cn(
                            'w-full h-11 px-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20',
                            errors.address ? 'border-destructive' : 'border-border'
                          )}
                          placeholder="House number, street name"
                        />
                        {errors.address && (
                          <p className="text-destructive text-sm mt-1">{errors.address}</p>
                        )}
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium mb-1">Special Instructions (Optional)</label>
                        <textarea
                          value={shippingInfo.instructions}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, instructions: e.target.value })}
                          className="w-full h-20 px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 resize-none"
                          placeholder="Any special delivery instructions..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Zone */}
                  <div className="bg-card rounded-xl border border-border p-5">
                    <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Truck className="w-5 h-5 text-primary" />
                      Delivery Method
                    </h2>
                    <div className="space-y-3">
                      {DELIVERY_ZONES.map((zone) => (
                        <label
                          key={zone.id}
                          className={cn(
                            'flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors',
                            selectedZone.id === zone.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="deliveryZone"
                              checked={selectedZone.id === zone.id}
                              onChange={() => setSelectedZone(zone)}
                              className="w-4 h-4 text-primary"
                            />
                            <div>
                              <p className="font-medium">{zone.name}</p>
                              <p className="text-sm text-muted-foreground">{zone.description}</p>
                            </div>
                          </div>
                          <p className="font-semibold">
                            {zone.price === 0 ? 'FREE' : formatPrice(zone.price)}
                          </p>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Button size="lg" className="w-full h-12" onClick={handleContinueToPayment}>
                    Continue to Payment
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              )}

              {/* Payment Step */}
              {currentStep === 'payment' && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {/* Payment Methods */}
                  <div className="bg-card rounded-xl border border-border p-5">
                    <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Wallet className="w-5 h-5 text-primary" />
                      Payment Method
                    </h2>
                    <div className="space-y-3">
                      {PAYMENT_METHODS.map((method) => (
                        <label
                          key={method.id}
                          className={cn(
                            'flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors',
                            selectedPayment.id === method.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="paymentMethod"
                              checked={selectedPayment.id === method.id}
                              onChange={() => setSelectedPayment(method)}
                              className="w-4 h-4 text-primary"
                            />
                            <div>
                              <p className="font-medium">{method.name}</p>
                              <p className="text-sm text-muted-foreground">{method.description}</p>
                            </div>
                          </div>
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: method.color }}
                          >
                            {method.icon}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* M-Pesa Instructions */}
                  {selectedPayment.id === 'mpesa' && (
                    <div className="bg-muted/50 rounded-xl p-5 border border-border">
                      <h3 className="font-semibold mb-3">How to Pay with M-Pesa</h3>
                      <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                        <li>Click "Place Order" below</li>
                        <li>You will receive an STK push on your phone</li>
                        <li>Enter your M-Pesa PIN</li>
                        <li>Confirm the payment</li>
                        <li>You'll receive a confirmation message</li>
                      </ol>
                      <p className="text-sm mt-3">
                        <strong>Or:</strong> Send money to <strong>PayBill: 123456</strong>, Account: <strong>MAISH</strong>
                      </p>
                    </div>
                  )}

                  {/* COD Instructions */}
                  {selectedPayment.id === 'cod' && (
                    <div className="bg-muted/50 rounded-xl p-5 border border-border">
                      <h3 className="font-semibold mb-3">Cash on Delivery</h3>
                      <p className="text-sm text-muted-foreground">
                        Pay with cash when your order is delivered to your doorstep. 
                        Please have the exact amount ready for a smoother experience.
                      </p>
                    </div>
                  )}

                  {/* Order Summary Preview */}
                  <div className="bg-card rounded-xl border border-border p-5">
                    <h3 className="font-semibold mb-3">Order Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Items ({items.length})</span>
                        <span>{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery ({selectedZone.name})</span>
                        <span>{selectedZone.price === 0 ? 'FREE' : formatPrice(selectedZone.price)}</span>
                      </div>
                      <div className="border-t border-border pt-2 flex justify-between font-semibold">
                        <span>Total</span>
                        <span>{formatPrice(finalTotal)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button 
                      size="lg" 
                      className="w-full h-12" 
                      onClick={handlePlaceOrder}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Processing...
                        </>
                      ) : (
                        `Place Order - ${formatPrice(finalTotal)}`
                      )}
                    </Button>
                    <Button size="lg" variant="outline" className="w-full" onClick={handleBack}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Shipping
                    </Button>
                  </div>
                  {submitError && (
                    <p className="text-destructive text-sm text-center">{submitError}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border p-5 sticky top-36">
              <h2 className="font-semibold text-lg mb-4">Order Summary</h2>

              {/* Items Preview */}
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {items.slice(0, 3).map((item) => (
                  <div key={`${item.product.id}-${item.selectedSize}`} className="flex gap-3">
                    <div className="w-14 h-18 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.images[0]?.src}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.selectedColor.name} / {item.selectedSize}
                      </p>
                      <p className="text-sm font-semibold">{formatPrice(item.product.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
                {items.length > 3 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{items.length - 3} more items
                  </p>
                )}
              </div>

              <div className="border-t border-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-success">
                    <span>Discount (40%)</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span>
                    {selectedZone.price === 0 ? 'FREE' : formatPrice(selectedZone.price)}
                  </span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Promo Code */}
              {!promoApplied && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Have a promo code?</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setPromoApplied(true)}
                  >
                    Apply MAISH40 for 40% off
                  </Button>
                </div>
              )}

              {promoApplied && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-success text-sm">✓ MAISH40 applied - 40% off!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
