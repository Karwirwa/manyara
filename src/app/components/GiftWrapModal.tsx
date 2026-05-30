import { useState } from 'react';
import { Button } from './ui/button';
import { X, Gift, Sparkles } from 'lucide-react';

interface GiftWrapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (wantGiftWrap: boolean) => void;
}

export function GiftWrapModal({ isOpen, onClose, onConfirm }: GiftWrapModalProps) {
  const [selectedOption, setSelectedOption] = useState<'yes' | 'no' | null>(null);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedOption) {
      onConfirm(selectedOption === 'yes');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg">
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
                className="text-3xl text-[#FFFFF0]/90"
                style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
              >
                Gift Wrapping
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-[#F5F5DC]/10 hover:bg-[#F5F5DC]/20 transition-all duration-300"
              >
                <X className="w-5 h-5 text-[#FFFFF0]/70" />
              </button>
            </div>

            {/* Gift wrap illustration */}
            <div className="text-center mb-8">
              <div className="w-24 h-24 rounded-full bg-[#800020]/20 flex items-center justify-center mx-auto mb-4 relative">
                <Gift className="w-12 h-12 text-[#800020]" />
                <Sparkles className="w-6 h-6 text-[#F5F5DC]/60 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <p className="text-[#FFFFF0]/80 text-lg mb-2">
                Make it extra special
              </p>
              <p className="text-[#FFFFF0]/60 text-sm">
                Would you like your MANYARA lingerie beautifully gift wrapped?
              </p>
            </div>

            {/* Gift wrap details */}
            <div className="glass-panel rounded-2xl p-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#FFFFF0]/70">Premium Gift Wrapping:</span>
                  <span className="text-[#800020] font-medium">+KSh 250</span>
                </div>
                <div className="text-[#FFFFF0]/60 text-sm space-y-2">
                  <p>• Elegant MANYARA signature box</p>
                  <p>• Luxury tissue paper & satin ribbon</p>
                  <p>• Personalized gift card (optional)</p>
                  <p>• Discreet packaging for privacy</p>
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-4 mb-8">
              <button
                onClick={() => setSelectedOption('yes')}
                className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                  selectedOption === 'yes'
                    ? 'border-[#800020] bg-[#800020]/10'
                    : 'border-[#F5F5DC]/20 bg-[#F5F5DC]/5 hover:border-[#800020]/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#FFFFF0]/90 font-medium">Yes, please gift wrap</p>
                    <p className="text-[#FFFFF0]/60 text-sm">Add beautiful presentation (+KSh 250)</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedOption === 'yes' 
                      ? 'border-[#800020] bg-[#800020]' 
                      : 'border-[#F5F5DC]/30'
                  }`}>
                    {selectedOption === 'yes' && (
                      <div className="w-2 h-2 bg-[#FFFFF0] rounded-full"></div>
                    )}
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSelectedOption('no')}
                className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                  selectedOption === 'no'
                    ? 'border-[#556B2F] bg-[#556B2F]/10'
                    : 'border-[#F5F5DC]/20 bg-[#F5F5DC]/5 hover:border-[#556B2F]/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#FFFFF0]/90 font-medium">No thank you</p>
                    <p className="text-[#FFFFF0]/60 text-sm">Standard discreet packaging</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedOption === 'no' 
                      ? 'border-[#556B2F] bg-[#556B2F]' 
                      : 'border-[#F5F5DC]/30'
                  }`}>
                    {selectedOption === 'no' && (
                      <div className="w-2 h-2 bg-[#FFFFF0] rounded-full"></div>
                    )}
                  </div>
                </div>
              </button>
            </div>

            {/* Confirm button */}
            <div className="relative">
              <div className={`absolute inset-0 rounded-full blur-sm scale-110 ${
                selectedOption ? 'bg-[#800020]/20' : 'bg-[#F5F5DC]/10'
              }`}></div>
              <Button
                onClick={handleConfirm}
                disabled={!selectedOption}
                className={`relative w-full py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg tracking-wide ${
                  selectedOption
                    ? 'bg-gradient-to-r from-[#800020] to-[#800020]/80 hover:from-[#800020]/90 hover:to-[#800020] text-[#FFFFF0] border-0 hover:shadow-[#800020]/25'
                    : 'bg-[#F5F5DC]/20 text-[#FFFFF0]/50 border border-[#F5F5DC]/30 cursor-not-allowed'
                }`}
              >
                Continue with Selection
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
