import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Loader2, CheckCircle, XCircle, ArrowLeft, Phone, CreditCard } from 'lucide-react';
import { createOrder } from '../utils/supabase/orderService';
import { initiatePesapalPayment, generateOrderId } from '../utils/pesapal/pesapalService';
import type { OrderItem } from '../utils/sanity/types';

const DELIVERY_FEE = 300;

interface CheckoutFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  nearestMajorTown: string;
  nearestLandmark: string;
  cityTown: string;
  county: string;
  additionalNotes: string;
  paymentMethod: 'mpesa' | 'bank_transfer' | 'paypal' | 'pesapal';
}

export function CheckoutPage({ onBack }: { onBack: () => void }) {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    nearestMajorTown: '',
    nearestLandmark: '',
    cityTown: '',
    county: '',
    additionalNotes: '',
    paymentMethod: 'mpesa',
  });
  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const subtotal = getCartTotal();
  const total = subtotal + DELIVERY_FEE;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name as keyof CheckoutFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutFormData> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^(\+?254|0)?[17]\d{8}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Invalid Kenyan phone number (e.g., 0712345678)';
    }
    if (!formData.nearestMajorTown.trim()) newErrors.nearestMajorTown = 'Nearest major town is required';
    if (!formData.cityTown.trim()) newErrors.cityTown = 'City/Town is required';
    if (!formData.county.trim()) newErrors.county = 'County is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatPhoneNumber = (phone: string): string => {
    // Convert to format 254XXXXXXXXX
    let cleaned = phone.replace(/\s/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.substring(1);
    } else if (cleaned.startsWith('+')) {
      cleaned = cleaned.substring(1);
    } else if (!cleaned.startsWith('254')) {
      cleaned = '254' + cleaned;
    }
    return cleaned;
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      setErrorMessage('Please fill in all required fields correctly');
      return;
    }

    setProcessing(true);
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      console.log('🛒 Starting checkout process...');
      console.log('Cart items:', cartItems.length);
      console.log('Total amount:', total);
      console.log('Payment method:', formData.paymentMethod);

      // Prepare order items
      const orderItems: OrderItem[] = cartItems.map(item => ({
        product_id: item.productId,
        product_name: item.productName,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: typeof item.unitPrice === 'number' ? item.unitPrice : parseFloat(item.unitPrice.replace(/[^0-9.]/g, ''))
      }));

      const deliveryAddress = `${formData.nearestLandmark}, ${formData.nearestMajorTown}, ${formData.cityTown}, ${formData.county}${formData.additionalNotes ? ` - ${formData.additionalNotes}` : ''}`;

      console.log('📦 Order items prepared:', orderItems);
      console.log('📍 Delivery address:', deliveryAddress);

      if (formData.paymentMethod === 'mpesa') {
        console.log('💳 Processing M-Pesa payment...');
        // For M-Pesa, you would integrate with your Edge Function
        // For now, create order with pending status
        const order = await createOrder({
          customerName: formData.fullName,
          customerEmail: formData.email,
          customerPhone: formData.phoneNumber,
          deliveryAddress,
          paymentMethod: 'mpesa',
          totalAmount: total,
          items: orderItems,
          mpesaTransactionId: `MPESA-${Date.now()}-PENDING`
        });

        console.log('✅ M-Pesa order created successfully:', order.id);
        setOrderId(order.id);
        setPaymentStatus('success');
        clearCart();
        
      } else if (formData.paymentMethod === 'bank_transfer') {
        console.log('🏦 Processing Bank Transfer order...');
        const order = await createOrder({
          customerName: formData.fullName,
          customerEmail: formData.email,
          customerPhone: formData.phoneNumber,
          deliveryAddress,
          paymentMethod: 'bank_transfer',
          totalAmount: total,
          items: orderItems
        });

        console.log('✅ Bank Transfer order created successfully:', order.id);
        setOrderId(order.id);
        setPaymentStatus('success');
        clearCart();
        
      } else if (formData.paymentMethod === 'paypal') {
        console.log('💳 Processing PayPal payment...');
        const order = await createOrder({
          customerName: formData.fullName,
          customerEmail: formData.email,
          customerPhone: formData.phoneNumber,
          deliveryAddress,
          paymentMethod: 'paypal',
          totalAmount: total,
          items: orderItems
        });

        console.log('✅ PayPal order created successfully:', order.id);
        setOrderId(order.id);
        setPaymentStatus('success');
        clearCart();

      } else if (formData.paymentMethod === 'pesapal') {
        console.log('💳 Processing Pesapal payment...');

        // Generate unique order ID for Pesapal
        const pesapalOrderId = generateOrderId();

        console.log('📦 Initiating Pesapal payment with order ID:', pesapalOrderId);

        // Initiate Pesapal payment (this will redirect the user)
        await initiatePesapalPayment({
          orderId: pesapalOrderId,
          amount: total,
          description: `MANYARA Order - ${cartItems.length} items`,
          customerEmail: formData.email,
          customerPhone: formatPhoneNumber(formData.phoneNumber),
          customerName: formData.fullName,
          orderData: {
            customerName: formData.fullName,
            deliveryAddress,
            items: orderItems,
          },
        });

        // Note: Code after this won't execute because user will be redirected
        // Order status will be updated via IPN callback
        console.log('🔗 Redirecting to Pesapal payment page...');
      }

    } catch (error: any) {
      console.error('❌ Payment error:', error);
      setPaymentStatus('failed');
      setErrorMessage(error.message || 'Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A0A0A] to-[#0A0A0A] pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl text-[#FFFFF0] mb-3 sm:mb-4" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
              Order Confirmed!
            </h2>
            <p className="text-base sm:text-lg text-[#FFFFF0]/80 mb-4 sm:mb-6">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
            <div className="bg-[#FFFFF0]/5 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
              <p className="text-xs sm:text-sm text-[#FFFFF0]/60 mb-2">Order ID</p>
              <p className="text-xl sm:text-2xl text-[#F5F5DC] break-all">{orderId}</p>
            </div>
            <p className="text-sm sm:text-base text-[#FFFFF0]/60 mb-6 sm:mb-8">
              A confirmation email has been sent to <span className="text-[#F5F5DC] break-all">{formData.email}</span>
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-[#800020] to-[#556B2F] text-[#FFFFF0] rounded-xl hover:shadow-lg hover:shadow-[#800020]/20 transition-all text-sm sm:text-base"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A0A0A] to-[#0A0A0A] pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#FFFFF0]/60 hover:text-[#FFFFF0] mb-6 sm:mb-8 transition-colors text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Back to Cart</span>
        </button>

        {/* Header */}
        <div className="mb-8 sm:mb-10 md:mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#FFFFF0] mb-3 sm:mb-4" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
            Checkout
          </h1>
          <p className="text-sm sm:text-base text-[#FFFFF0]/60">Complete your order with secure payment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
              <h2 className="text-xl sm:text-2xl text-[#FFFFF0] mb-4 sm:mb-6" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                Delivery Information
              </h2>

              {errorMessage && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 sm:gap-3">
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-400 text-xs sm:text-sm">{errorMessage}</p>
                </div>
              )}

              <div className="space-y-4 sm:space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-[#FFFFF0]/80 mb-2 text-sm">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-[#FFFFF0]/5 border ${
                      errors.fullName ? 'border-red-500' : 'border-[#FFFFF0]/20'
                    } rounded-lg text-[#FFFFF0] focus:outline-none focus:border-[#F5F5DC] transition-colors`}
                    placeholder="Jane Doe"
                  />
                  {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[#FFFFF0]/80 mb-2 text-sm">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-[#FFFFF0]/5 border ${
                      errors.email ? 'border-red-500' : 'border-[#FFFFF0]/20'
                    } rounded-lg text-[#FFFFF0] focus:outline-none focus:border-[#F5F5DC] transition-colors`}
                    placeholder="jane@example.com"
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-[#FFFFF0]/80 mb-2 text-sm">
                    M-Pesa Phone Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-[#FFFFF0]/5 border ${
                      errors.phoneNumber ? 'border-red-500' : 'border-[#FFFFF0]/20'
                    } rounded-lg text-[#FFFFF0] focus:outline-none focus:border-[#F5F5DC] transition-colors`}
                    placeholder="0712345678"
                  />
                  {errors.phoneNumber && <p className="text-red-400 text-sm mt-1">{errors.phoneNumber}</p>}
                  <p className="text-[#FFFFF0]/40 text-xs mt-1">
                    This number will receive the M-Pesa payment prompt
                  </p>
                </div>

                {/* Nearest Major Town */}
                <div>
                  <label className="block text-[#FFFFF0]/80 mb-2 text-sm">
                    Nearest Major Town <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="nearestMajorTown"
                    value={formData.nearestMajorTown}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-[#FFFFF0]/5 border ${
                      errors.nearestMajorTown ? 'border-red-500' : 'border-[#FFFFF0]/20'
                    } rounded-lg text-[#FFFFF0] focus:outline-none focus:border-[#F5F5DC] transition-colors`}
                    placeholder="Nairobi"
                  />
                  {errors.nearestMajorTown && <p className="text-red-400 text-sm mt-1">{errors.nearestMajorTown}</p>}
                </div>

                {/* Nearest Landmark */}
                <div>
                  <label className="block text-[#FFFFF0]/80 mb-2 text-sm">
                    Nearest Landmark
                  </label>
                  <input
                    type="text"
                    name="nearestLandmark"
                    value={formData.nearestLandmark}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#FFFFF0]/5 border border-[#FFFFF0]/20 rounded-lg text-[#FFFFF0] focus:outline-none focus:border-[#F5F5DC] transition-colors"
                    placeholder="Near Sarit Centre"
                  />
                </div>

                {/* City/Town and County */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#FFFFF0]/80 mb-2 text-sm">
                      City/Town <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="cityTown"
                      value={formData.cityTown}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-[#FFFFF0]/5 border ${
                        errors.cityTown ? 'border-red-500' : 'border-[#FFFFF0]/20'
                      } rounded-lg text-[#FFFFF0] focus:outline-none focus:border-[#F5F5DC] transition-colors`}
                      placeholder="Nairobi"
                    />
                    {errors.cityTown && <p className="text-red-400 text-sm mt-1">{errors.cityTown}</p>}
                  </div>

                  <div>
                    <label className="block text-[#FFFFF0]/80 mb-2 text-sm">
                      County <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="county"
                      value={formData.county}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-[#FFFFF0]/5 border ${
                        errors.county ? 'border-red-500' : 'border-[#FFFFF0]/20'
                      } rounded-lg text-[#FFFFF0] focus:outline-none focus:border-[#F5F5DC] transition-colors`}
                      placeholder="Nairobi County"
                    />
                    {errors.county && <p className="text-red-400 text-sm mt-1">{errors.county}</p>}
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-[#FFFFF0]/80 mb-2 text-sm">
                    Additional Delivery Notes (Optional)
                  </label>
                  <textarea
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-[#FFFFF0]/5 border border-[#FFFFF0]/20 rounded-lg text-[#FFFFF0] focus:outline-none focus:border-[#F5F5DC] transition-colors resize-none"
                    placeholder="Any special instructions for delivery..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary & Payment */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:sticky lg:top-24 space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl text-[#FFFFF0]" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-2 sm:space-y-3 max-h-48 sm:max-h-60 overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-2 sm:gap-3 pb-2 sm:pb-3 border-b border-[#FFFFF0]/10">
                    <div className="w-10 h-14 sm:w-12 sm:h-16 rounded overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-[#FFFFF0] truncate">{item.productName}</p>
                      <p className="text-[10px] sm:text-xs text-[#FFFFF0]/60">
                        {item.size} • {item.color} • Qty: {item.quantity}
                      </p>
                      <p className="text-xs sm:text-sm text-[#F5F5DC] mt-1">{item.unitPrice}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between text-sm sm:text-base text-[#FFFFF0]/80">
                  <span>Subtotal</span>
                  <span>KSh {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base text-[#FFFFF0]/80">
                  <span>Delivery Fee</span>
                  <span>KSh {DELIVERY_FEE.toLocaleString()}</span>
                </div>
                <div className="h-px bg-[#FFFFF0]/10"></div>
                <div className="flex justify-between text-lg sm:text-xl text-[#FFFFF0]">
                  <span>Total</span>
                  <span>KSh {total.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-3">
                <label className="block text-[#FFFFF0]/80 text-sm mb-3">
                  Payment Method <span className="text-red-400">*</span>
                </label>
                
                {/* M-Pesa Option */}
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'mpesa' }))}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    formData.paymentMethod === 'mpesa'
                      ? 'border-[#556B2F] bg-[#556B2F]/10'
                      : 'border-[#FFFFF0]/10 hover:border-[#FFFFF0]/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#556B2F]" />
                    <div className="flex-1">
                      <p className="text-[#FFFFF0]">M-Pesa</p>
                      <p className="text-xs text-[#FFFFF0]/60">Pay with your phone - Instant confirmation</p>
                    </div>
                    {formData.paymentMethod === 'mpesa' && (
                      <div className="w-5 h-5 rounded-full bg-[#556B2F] flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-[#FFFFF0]" />
                      </div>
                    )}
                  </div>
                  {formData.paymentMethod === 'mpesa' && (
                    <p className="text-xs text-[#FFFFF0]/40 mt-2 pl-8">
                      Till Number: <span className="text-[#F5F5DC]">7121042</span>
                    </p>
                  )}
                </button>

                {/* Bank Transfer Option */}
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'bank_transfer' }))}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    formData.paymentMethod === 'bank_transfer'
                      ? 'border-[#556B2F] bg-[#556B2F]/10'
                      : 'border-[#FFFFF0]/10 hover:border-[#FFFFF0]/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-[#800020]" />
                    <div className="flex-1">
                      <p className="text-[#FFFFF0]">Bank Transfer</p>
                      <p className="text-xs text-[#FFFFF0]/60">Direct bank payment</p>
                    </div>
                    {formData.paymentMethod === 'bank_transfer' && (
                      <div className="w-5 h-5 rounded-full bg-[#556B2F] flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-[#FFFFF0]" />
                      </div>
                    )}
                  </div>
                  {formData.paymentMethod === 'bank_transfer' && (
                    <div className="text-xs text-[#FFFFF0]/60 mt-3 pl-8 space-y-1">
                      <p className="text-[#FFFFF0]/40">Bank details will be provided after order confirmation</p>
                    </div>
                  )}
                </button>

                {/* PayPal Option */}
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'paypal' }))}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    formData.paymentMethod === 'paypal'
                      ? 'border-[#556B2F] bg-[#556B2F]/10'
                      : 'border-[#FFFFF0]/10 hover:border-[#FFFFF0]/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 flex items-center justify-center text-[#F5F5DC]">💳</div>
                    <div className="flex-1">
                      <p className="text-[#FFFFF0]">PayPal</p>
                      <p className="text-xs text-[#FFFFF0]/60">Pay with PayPal</p>
                    </div>
                    {formData.paymentMethod === 'paypal' && (
                      <div className="w-5 h-5 rounded-full bg-[#556B2F] flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-[#FFFFF0]" />
                      </div>
                    )}
                  </div>
                  {formData.paymentMethod === 'paypal' && (
                    <p className="text-xs text-[#FFFFF0]/40 mt-2 pl-8">
                      Available worldwide
                    </p>
                  )}
                </button>

                {/* Pesapal Option */}
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'pesapal' }))}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    formData.paymentMethod === 'pesapal'
                      ? 'border-[#556B2F] bg-[#556B2F]/10'
                      : 'border-[#FFFFF0]/10 hover:border-[#FFFFF0]/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-[#0066CC]" />
                    <div className="flex-1">
                      <p className="text-[#FFFFF0]">Pesapal</p>
                      <p className="text-xs text-[#FFFFF0]/60">Card, Mobile Money & More</p>
                    </div>
                    {formData.paymentMethod === 'pesapal' && (
                      <div className="w-5 h-5 rounded-full bg-[#556B2F] flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-[#FFFFF0]" />
                      </div>
                    )}
                  </div>
                  {formData.paymentMethod === 'pesapal' && (
                    <p className="text-xs text-[#FFFFF0]/40 mt-2 pl-8">
                      Secure payment gateway - Cards, M-Pesa, Airtel Money accepted
                    </p>
                  )}
                </button>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={processing || paymentStatus === 'processing'}
                className="w-full py-3 sm:py-4 bg-gradient-to-r from-[#800020] to-[#556B2F] text-[#FFFFF0] rounded-xl hover:shadow-lg hover:shadow-[#800020]/20 transition-all flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    {formData.paymentMethod === 'mpesa' && <Phone className="w-4 h-4 sm:w-5 sm:h-5" />}
                    {formData.paymentMethod === 'bank_transfer' && <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />}
                    {formData.paymentMethod === 'paypal' && <span>💳</span>}
                    {formData.paymentMethod === 'pesapal' && <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />}
                    <span>
                      {formData.paymentMethod === 'mpesa' && 'Pay with M-Pesa'}
                      {formData.paymentMethod === 'bank_transfer' && 'Complete Order'}
                      {formData.paymentMethod === 'paypal' && 'Place Order'}
                      {formData.paymentMethod === 'pesapal' && 'Pay with Pesapal'}
                    </span>
                  </>
                )}
              </button>

              {paymentStatus === 'processing' && (
                <div className="p-3 sm:p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-blue-400 text-xs sm:text-sm text-center">
                    Check your phone for the M-Pesa prompt...
                  </p>
                </div>
              )}

              {/* Trust Badges */}
              <div className="pt-3 sm:pt-4 border-t border-[#FFFFF0]/10 space-y-1.5 sm:space-y-2">
                <div className="flex items-center gap-2 text-[10px] sm:text-xs text-[#FFFFF0]/60">
                  <div className="w-1.5 h-1.5 bg-[#F5F5DC] rounded-full"></div>
                  <span>Secure M-Pesa Payment</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] sm:text-xs text-[#FFFFF0]/60">
                  <div className="w-1.5 h-1.5 bg-[#F5F5DC] rounded-full"></div>
                  <span>Discreet Packaging Guaranteed</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] sm:text-xs text-[#FFFFF0]/60">
                  <div className="w-1.5 h-1.5 bg-[#F5F5DC] rounded-full"></div>
                  <span>No Returns Policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}