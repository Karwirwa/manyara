import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: () => void;
  onCancel: () => void;
}

// Admin password (In production, use environment variables or backend authentication)
const ADMIN_PASSWORD = 'MANYARA2026';

export function AdminLogin({ onSuccess, onCancel }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate authentication delay
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        // Store authentication in sessionStorage (expires when browser closes)
        sessionStorage.setItem('manyara_admin_auth', 'true');
        onSuccess();
      } else {
        setError('Invalid password. Please try again.');
        setPassword('');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#800020]/30 to-[#556B2F]/20 rounded-3xl blur-2xl"></div>
        
        {/* Login card */}
        <div className="relative glass-card rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#800020]/20 mb-4">
              <Lock className="w-8 h-8 text-[#FFFFF0]" />
            </div>
            <h2 
              className="text-3xl text-[#FFFFF0] mb-2"
              style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 400 }}
            >
              Admin Access
            </h2>
            <p className="text-[#FFFFF0]/60 text-sm">
              Enter password to access admin panel
            </p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-[#FFFFF0]/80 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full px-4 py-3 bg-[#FFFFF0]/10 border border-[#FFFFF0]/20 rounded-lg text-[#FFFFF0] placeholder-[#FFFFF0]/40 focus:outline-none focus:border-[#800020]/50 focus:ring-2 focus:ring-[#800020]/20 transition-all"
                  placeholder="Enter admin password"
                  autoFocus
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FFFFF0]/60 hover:text-[#FFFFF0] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-400 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400 mr-2"></span>
                  {error}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-6 py-3 bg-[#FFFFF0]/10 hover:bg-[#FFFFF0]/20 text-[#FFFFF0] rounded-lg transition-all duration-300 border border-[#FFFFF0]/20"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-[#800020] hover:bg-[#800020]/90 text-[#FFFFF0] rounded-lg transition-all duration-300 shadow-lg hover:shadow-[#800020]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || !password}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  'Access Admin Panel'
                )}
              </button>
            </div>
          </form>

          {/* Security note */}
          <p className="mt-6 text-center text-xs text-[#FFFFF0]/40">
            🔒 Secure access · Session expires on browser close
          </p>
        </div>
      </div>
    </div>
  );
}
