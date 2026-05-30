/**
 * Data Source Indicator
 * Shows Sanity CMS connection status
 */

import { useState, useEffect } from 'react';

export function DataSourceIndicator() {
  const [isVisible, setIsVisible] = useState(true);
  const [dataSource, setDataSource] = useState<'loading' | 'sanity' | 'error'>('loading');

  useEffect(() => {
    // Check console logs to determine data source
    const checkDataSource = () => {
      // Listen for product fetch logs
      const originalLog = console.log;
      const originalError = console.error;
      
      console.log = (...args) => {
        const message = args.join(' ');
        if (message.includes('Loaded') && message.includes('products from Sanity')) {
          setDataSource('sanity');
        }
        originalLog.apply(console, args);
      };

      console.error = (...args) => {
        const message = args.join(' ');
        if (message.includes('CORS ERROR') || message.includes('Sanity API error')) {
          setDataSource('error');
        }
        originalError.apply(console, args);
      };

      // Restore after 3 seconds
      setTimeout(() => {
        console.log = originalLog;
        console.error = originalError;
        if (dataSource === 'loading') {
          setDataSource('sanity'); // Assume Sanity if no error logs detected
        }
      }, 3000);
    };

    checkDataSource();

    // Auto-hide after 8 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 glassmorphism px-4 py-2 rounded-lg border border-[#F5F5DC]/20 shadow-lg">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${
          dataSource === 'loading' ? 'bg-blue-400' :
          dataSource === 'sanity' ? 'bg-green-400' : 'bg-red-400'
        } animate-pulse`} />
        <div className="text-xs text-[#FFFFF0]/80">
          {dataSource === 'loading' && (
            <>
              <span className="font-semibold">Connecting to Sanity CMS...</span>
            </>
          )}
          {dataSource === 'sanity' && (
            <>
              <span className="font-semibold">✓ Connected to Sanity CMS</span>
              <span className="mx-2">•</span>
              <span className="text-[#F5F5DC]/60">Project: ximq2iuj</span>
            </>
          )}
          {dataSource === 'error' && (
            <>
              <span className="font-semibold">⚠️ Sanity CMS Connection Issue</span>
              <span className="mx-2">•</span>
              <span className="text-[#F5F5DC]/60">Check console for details</span>
            </>
          )}
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-2 text-[#FFFFF0]/40 hover:text-[#FFFFF0]/80"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
