import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { X, Smartphone, CheckCircle, Loader2, CreditCard, Banknote, DollarSign, Shield, FileText, MessageCircle } from 'lucide-react';
import { GiftWrapModal } from './GiftWrapModal';
import { LegalModal } from './LegalModal';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
}

export function PaymentModal({ isOpen, onClose, total }: PaymentModalProps) {
  const { clearCart, setIsOpen: setCartOpen } = useCart();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentStep, setPaymentStep] = useState<'method' | 'phone' | 'processing' | 'success' | 'gift-wrap'>('method');
  const [selectedMethod, setSelectedMethod] = useState<'mpesa' | 'visa' | 'bank' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showGiftWrap, setShowGiftWrap] = useState(false);
  const [giftWrapCost, setGiftWrapCost] = useState(0);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<'privacy' | 'terms' | 'contact'>('privacy');

  if (!isOpen) return null;

  const handlePayment = async () => {
    if (selectedMethod === 'mpesa' && !phoneNumber) return;
    
    setIsLoading(true);
    setPaymentStep('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentStep('success');
      setIsLoading(false);
      
      // Show gift wrap modal after successful payment
      setTimeout(() => {
        setShowGiftWrap(true);
      }, 2000);
    }, 3000);
  };

  const handleGiftWrapDecision = (wantGiftWrap: boolean) => {
    if (wantGiftWrap) {
      setGiftWrapCost(250);
    }
    
    // Complete the order after gift wrap decision
    setTimeout(() => {
      clearCart();
      setCartOpen(false);
      onClose();
      setPaymentStep('method');
      setSelectedMethod(null);
      setPhoneNumber('');
      setShowGiftWrap(false);
      setGiftWrapCost(0);
    }, 1000);
  };

  const handleClose = () => {
    if (paymentStep !== 'processing') {
      onClose();
      setPaymentStep('method');
      setSelectedMethod(null);
      setPhoneNumber('');
      setShowGiftWrap(false);
      setGiftWrapCost(0);
    }
  };

  const openLegalModal = (tab: 'privacy' | 'terms' | 'contact') => {
    setLegalModalTab(tab);
    setShowLegalModal(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F5F5DC]/10 via-[#F5F5DC]/5 to-transparent rounded-3xl blur-xl scale-105"></div>
        
        {/* Main modal content */}
        <div className="relative glass-card rounded-3xl p-8 shadow-2xl">
          {/* Inner gradient glow */}
          <div className="absolute inset-0 manyara-gradient rounded-3xl opacity-20"></div>
          
          <div className="relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 
                className="text-2xl text-[#FFFFF0]/90"
                style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
              >
                {paymentStep === 'method' ? 'Choose Payment Method' :
                 paymentStep === 'phone' ? `Pay with ${selectedMethod?.toUpperCase()}` : 
                 paymentStep === 'processing' ? 'Processing Payment' : 'Payment Successful'}
              </h2>
              {paymentStep !== 'processing' && (
                <button
                  onClick={handleClose}
                  className="p-2 rounded-full bg-[#F5F5DC]/10 hover:bg-[#F5F5DC]/20 transition-all duration-300"
                >
                  <X className="w-5 h-5 text-[#FFFFF0]/70" />
                </button>
              )}
            </div>

            {/* Payment Steps */}
            {paymentStep === 'method' && (
              <>
                {/* Order Summary */}
                <div className="glass-panel rounded-2xl p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[#FFFFF0]/70">Total Amount:</span>
                    <span 
                      className="text-xl text-[#FFFFF0] font-medium"
                      style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                    >
                      KSh {(total * 130).toLocaleString()} {/* Approximate USD to KSh conversion */}
                    </span>
                  </div>
                  <div className="text-[#FFFFF0]/50 text-xs mt-1">
                    ≈ ${total.toFixed(2)} USD
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="space-y-4 mb-8">
                  <p className="text-[#FFFFF0]/70 text-sm mb-4">Select your preferred payment method:</p>
                  
                  {/* M-Pesa */}
                  <button
                    onClick={() => setSelectedMethod('mpesa')}
                    className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                      selectedMethod === 'mpesa'
                        ? 'border-[#00A651] bg-[#00A651]/10'
                        : 'border-[#F5F5DC]/20 bg-[#F5F5DC]/5 hover:border-[#00A651]/50'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-[#00A651]/20 flex items-center justify-center">
                        <Smartphone className="w-6 h-6 text-[#00A651]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[#FFFFF0]/90 font-medium">M-Pesa</p>
                        <p className="text-[#FFFFF0]/60 text-sm">Pay with your mobile money</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedMethod === 'mpesa' 
                          ? 'border-[#00A651] bg-[#00A651]' 
                          : 'border-[#F5F5DC]/30'
                      }`}>
                        {selectedMethod === 'mpesa' && (
                          <div className="w-2 h-2 bg-[#FFFFF0] rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Visa/Mastercard */}
                  <button
                    onClick={() => setSelectedMethod('visa')}
                    className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                      selectedMethod === 'visa'
                        ? 'border-[#1A1F71] bg-[#1A1F71]/10'
                        : 'border-[#F5F5DC]/20 bg-[#F5F5DC]/5 hover:border-[#1A1F71]/50'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-[#1A1F71]/20 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-[#1A1F71]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[#FFFFF0]/90 font-medium">Credit/Debit Card</p>
                        <p className="text-[#FFFFF0]/60 text-sm">Visa, Mastercard, American Express</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedMethod === 'visa' 
                          ? 'border-[#1A1F71] bg-[#1A1F71]' 
                          : 'border-[#F5F5DC]/30'
                      }`}>
                        {selectedMethod === 'visa' && (
                          <div className="w-2 h-2 bg-[#FFFFF0] rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Bank Transfer */}
                  <button
                    onClick={() => setSelectedMethod('bank')}
                    className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                      selectedMethod === 'bank'
                        ? 'border-[#800020] bg-[#800020]/10'
                        : 'border-[#F5F5DC]/20 bg-[#F5F5DC]/5 hover:border-[#800020]/50'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-[#800020]/20 flex items-center justify-center">
                        <Banknote className="w-6 h-6 text-[#800020]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[#FFFFF0]/90 font-medium">Bank Transfer</p>
                        <p className="text-[#FFFFF0]/60 text-sm">Direct bank deposit or online banking</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedMethod === 'bank' 
                          ? 'border-[#800020] bg-[#800020]' 
                          : 'border-[#F5F5DC]/30'
                      }`}>
                        {selectedMethod === 'bank' && (
                          <div className="w-2 h-2 bg-[#FFFFF0] rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </button>
                </div>

                {/* Legal Links */}
                <div className="border-t border-[#F5F5DC]/10 pt-6 mb-6">
                  <p className="text-[#FFFFF0]/60 text-xs text-center mb-4">
                    By continuing, you agree to our terms and policies:
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 text-xs">
                    <button
                      onClick={() => openLegalModal('privacy')}
                      className="flex items-center space-x-1 text-[#800020] hover:text-[#800020]/80 transition-colors duration-300"
                    >
                      <Shield className="w-3 h-3" />
                      <span>Privacy Policy</span>
                    </button>
                    <button
                      onClick={() => openLegalModal('terms')}
                      className="flex items-center space-x-1 text-[#556B2F] hover:text-[#556B2F]/80 transition-colors duration-300"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Terms & Conditions</span>
                    </button>
                    <button
                      onClick={() => openLegalModal('contact')}
                      className="flex items-center space-x-1 text-[#800020] hover:text-[#800020]/80 transition-colors duration-300"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>Contact Us</span>
                    </button>
                  </div>
                </div>

                {/* Continue Button */}
                <div className="relative">
                  <div className={`absolute inset-0 rounded-full blur-sm scale-110 ${
                    selectedMethod ? 'bg-[#800020]/20' : 'bg-[#F5F5DC]/10'
                  }`}></div>
                  <Button
                    onClick={() => selectedMethod && setPaymentStep('phone')}
                    disabled={!selectedMethod}
                    className={`relative w-full py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg tracking-wide ${
                      selectedMethod
                        ? 'bg-gradient-to-r from-[#800020] to-[#800020]/80 hover:from-[#800020]/90 hover:to-[#800020] text-[#FFFFF0] border-0 hover:shadow-[#800020]/25'
                        : 'bg-[#F5F5DC]/20 text-[#FFFFF0]/50 border border-[#F5F5DC]/30 cursor-not-allowed'
                    }`}
                  >
                    Continue to Payment
                  </Button>
                </div>
              </>
            )}

            {paymentStep === 'phone' && (
              <>
                {/* Payment Method Logo Area */}
                <div className="text-center mb-8">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    selectedMethod === 'mpesa' ? 'bg-[#00A651]/20' :
                    selectedMethod === 'visa' ? 'bg-[#1A1F71]/20' :
                    'bg-[#800020]/20'
                  }`}>
                    {selectedMethod === 'mpesa' && <Smartphone className="w-10 h-10 text-[#00A651]" />}
                    {selectedMethod === 'visa' && <CreditCard className="w-10 h-10 text-[#1A1F71]" />}
                    {selectedMethod === 'bank' && <Banknote className="w-10 h-10 text-[#800020]" />}
                  </div>
                  <p className="text-[#FFFFF0]/70 text-sm">
                    {selectedMethod === 'mpesa' && 'Enter your M-Pesa number to receive a payment prompt'}
                    {selectedMethod === 'visa' && 'Enter your card details to complete payment'}
                    {selectedMethod === 'bank' && 'Bank transfer instructions will be provided'}
                  </p>
                </div>

                {/* Order Summary */}
                <div className="glass-panel rounded-2xl p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[#FFFFF0]/70">Total Amount:</span>
                    <span 
                      className="text-xl text-[#FFFFF0] font-medium"
                      style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                    >
                      KSh {(total * 130).toLocaleString()} {/* Approximate USD to KSh conversion */}
                    </span>
                  </div>
                  <div className="text-[#FFFFF0]/50 text-xs mt-1">
                    ≈ ${total.toFixed(2)} USD
                  </div>
                </div>

                {/* Payment Input Fields */}
                <div className="space-y-4 mb-6">
                  {selectedMethod === 'mpesa' && (
                    <>
                      <label className="text-[#FFFFF0]/70 text-sm block">
                        M-Pesa Phone Number *
                      </label>
                      <Input
                        type="tel"
                        placeholder="254XXXXXXXXX"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="bg-[#F5F5DC]/5 border-[#F5F5DC]/20 text-[#FFFFF0] placeholder:text-[#FFFFF0]/40 focus:border-[#800020]/50 rounded-xl text-lg py-3"
                      />
                      <p className="text-[#FFFFF0]/50 text-xs">
                        Format: 254712345678 (without + sign)
                      </p>
                    </>
                  )}

                  {selectedMethod === 'visa' && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-[#FFFFF0]/70 text-sm block mb-2">Card Number *</label>
                        <Input
                          placeholder="1234 5678 9012 3456"
                          className="bg-[#F5F5DC]/5 border-[#F5F5DC]/20 text-[#FFFFF0] placeholder:text-[#FFFFF0]/40 focus:border-[#800020]/50 rounded-xl"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[#FFFFF0]/70 text-sm block mb-2">Expiry Date *</label>
                          <Input
                            placeholder="MM/YY"
                            className="bg-[#F5F5DC]/5 border-[#F5F5DC]/20 text-[#FFFFF0] placeholder:text-[#FFFFF0]/40 focus:border-[#800020]/50 rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="text-[#FFFFF0]/70 text-sm block mb-2">CVV *</label>
                          <Input
                            placeholder="123"
                            className="bg-[#F5F5DC]/5 border-[#F5F5DC]/20 text-[#FFFFF0] placeholder:text-[#FFFFF0]/40 focus:border-[#800020]/50 rounded-xl"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[#FFFFF0]/70 text-sm block mb-2">Cardholder Name *</label>
                        <Input
                          placeholder="John Doe"
                          className="bg-[#F5F5DC]/5 border-[#F5F5DC]/20 text-[#FFFFF0] placeholder:text-[#FFFFF0]/40 focus:border-[#800020]/50 rounded-xl"
                        />
                      </div>
                    </div>
                  )}

                  {selectedMethod === 'bank' && (
                    <div className="glass-panel rounded-2xl p-4">
                      <h4 className="text-[#FFFFF0]/90 font-medium mb-3">Bank Transfer Details</h4>
                      <div className="space-y-2 text-sm text-[#FFFFF0]/70">
                        <div className="flex justify-between">
                          <span>Bank:</span>
                          <span className="text-[#FFFFF0]/90">KCB Bank Kenya</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Account Name:</span>
                          <span className="text-[#FFFFF0]/90">MANYARA Limited</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Account Number:</span>
                          <span className="text-[#FFFFF0]/90 font-mono">1234567890</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Reference:</span>
                          <span className="text-[#800020] font-mono">MAN{Date.now().toString().slice(-6)}</span>
                        </div>
                      </div>
                      <p className="text-[#FFFFF0]/50 text-xs mt-3">
                        Please use the reference number when making the transfer
                      </p>
                    </div>
                  )}
                </div>

                {/* Payment Button */}
                <div className="relative">
                  <div className={`absolute inset-0 rounded-full blur-sm scale-110 ${
                    selectedMethod === 'mpesa' ? 'bg-[#00A651]/20' :
                    selectedMethod === 'visa' ? 'bg-[#1A1F71]/20' :
                    'bg-[#800020]/20'
                  }`}></div>
                  <Button
                    onClick={handlePayment}
                    disabled={selectedMethod === 'mpesa' ? (!phoneNumber || phoneNumber.length < 12) : false}
                    className={`relative w-full border-0 rounded-full py-3 transition-all duration-300 hover:scale-105 shadow-lg tracking-wide disabled:opacity-50 disabled:cursor-not-allowed text-white ${
                      selectedMethod === 'mpesa' 
                        ? 'bg-gradient-to-r from-[#00A651] to-[#00A651]/80 hover:from-[#00A651]/90 hover:to-[#00A651] hover:shadow-[#00A651]/25'
                        : selectedMethod === 'visa'
                        ? 'bg-gradient-to-r from-[#1A1F71] to-[#1A1F71]/80 hover:from-[#1A1F71]/90 hover:to-[#1A1F71] hover:shadow-[#1A1F71]/25'
                        : 'bg-gradient-to-r from-[#800020] to-[#800020]/80 hover:from-[#800020]/90 hover:to-[#800020] hover:shadow-[#800020]/25'
                    }`}
                  >
                    {selectedMethod === 'mpesa' && 'Send M-Pesa Request'}
                    {selectedMethod === 'visa' && 'Process Card Payment'}
                    {selectedMethod === 'bank' && 'Confirm Bank Transfer'}
                  </Button>
                </div>
              </>
            )}

            {paymentStep === 'processing' && (
              <div className="text-center py-8">
                <div className="w-20 h-20 rounded-full bg-[#00A651]/20 flex items-center justify-center mx-auto mb-6">
                  <Loader2 className="w-10 h-10 text-[#00A651] animate-spin" />
                </div>
                <h3 
                  className="text-xl text-[#FFFFF0]/90 mb-4"
                  style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                >
                  Processing Payment
                </h3>
                <p className="text-[#FFFFF0]/70 mb-2">
                  {selectedMethod === 'mpesa' && 'Check your phone for M-Pesa prompt'}
                  {selectedMethod === 'visa' && 'Securing your card payment...'}
                  {selectedMethod === 'bank' && 'Verifying bank transfer...'}
                </p>
                <p className="text-[#FFFFF0]/50 text-sm">
                  {selectedMethod === 'mpesa' && 'Enter your M-Pesa PIN to complete the transaction'}
                  {selectedMethod === 'visa' && 'Please wait while we process your payment'}
                  {selectedMethod === 'bank' && 'We will confirm your transfer shortly'}
                </p>
                
                {/* Processing Steps */}
                <div className="mt-8 space-y-3">
                  <div className="flex items-center space-x-3 text-[#FFFFF0]/60">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${
                      selectedMethod === 'mpesa' ? 'bg-[#00A651]' :
                      selectedMethod === 'visa' ? 'bg-[#1A1F71]' :
                      'bg-[#800020]'
                    }`}></div>
                    <span className="text-sm">
                      {selectedMethod === 'mpesa' && `Payment request sent to ${phoneNumber}`}
                      {selectedMethod === 'visa' && 'Processing card payment...'}
                      {selectedMethod === 'bank' && 'Awaiting bank confirmation...'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-[#FFFFF0]/40">
                    <div className="w-2 h-2 bg-[#F5F5DC]/30 rounded-full"></div>
                    <span className="text-sm">
                      {selectedMethod === 'mpesa' && 'Waiting for PIN entry...'}
                      {selectedMethod === 'visa' && 'Verifying with bank...'}
                      {selectedMethod === 'bank' && 'Please allow 2-3 minutes...'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {paymentStep === 'success' && (
              <div className="text-center py-8">
                <div className="w-20 h-20 rounded-full bg-[#00A651]/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-[#00A651]" />
                </div>
                <h3 
                  className="text-xl text-[#FFFFF0]/90 mb-4"
                  style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                >
                  Payment Successful!
                </h3>
                <p className="text-[#FFFFF0]/70 mb-6">
                  Thank you for your purchase. Your order has been confirmed.
                </p>
                
                {/* Order Details */}
                <div className="glass-panel rounded-2xl p-4 mb-6 text-left">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#FFFFF0]/60">Transaction ID:</span>
                      <span className="text-[#FFFFF0]/90 font-mono text-sm">MP{Date.now()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#FFFFF0]/60">Amount Paid:</span>
                      <span className="text-[#00A651] font-medium">KSh {(total * 130).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#FFFFF0]/60">Payment Method:</span>
                      <span className="text-[#FFFFF0]/90">
                        {selectedMethod === 'mpesa' && 'M-Pesa'}
                        {selectedMethod === 'visa' && 'Credit Card'}
                        {selectedMethod === 'bank' && 'Bank Transfer'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-[#FFFFF0]/50 text-sm">
                  You will receive an SMS confirmation shortly.
                  <br />
                  This window will close automatically.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gift Wrap Modal */}
      <GiftWrapModal 
        isOpen={showGiftWrap}
        onClose={() => setShowGiftWrap(false)}
        onConfirm={handleGiftWrapDecision}
      />

      {/* Legal Modal */}
      <LegalModal 
        isOpen={showLegalModal}
        onClose={() => setShowLegalModal(false)}
        initialTab={legalModalTab}
      />
    </div>
  );
}