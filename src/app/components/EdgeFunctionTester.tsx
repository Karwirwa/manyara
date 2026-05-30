/**
 * Edge Function Tester Component
 * Tests Sanity CMS connection through Supabase Edge Function
 */

import { useState } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface TestResult {
  status: 'idle' | 'loading' | 'success' | 'error';
  statusCode?: number;
  data?: any;
  error?: string;
  timestamp?: string;
  url?: string;
}

export function EdgeFunctionTester() {
  const [results, setResults] = useState<Record<string, TestResult>>({});

  const endpoints = [
    {
      name: 'Health Check',
      path: '/health',
      method: 'GET',
      description: 'Basic health check endpoint'
    },
    {
      name: 'Sanity Products (via server)',
      path: '/server/sanity-products',
      method: 'GET',
      description: 'Fetch products from Sanity CMS via /server/ path'
    },
    {
      name: 'Sanity Products (via make-server)',
      path: '/make-server-5cb00c7d/sanity-products',
      method: 'GET',
      description: 'Fetch products from Sanity CMS via /make-server-5cb00c7d/ path'
    },
    {
      name: 'Sanity Raw Data',
      path: '/server/sanity-raw',
      method: 'GET',
      description: 'Raw unprocessed data from Sanity'
    },
    {
      name: 'KV Store Products',
      path: '/server/kv-products',
      method: 'GET',
      description: 'Products stored in KV store'
    }
  ];

  const testEndpoint = async (endpoint: typeof endpoints[0]) => {
    const key = endpoint.name;
    
    setResults(prev => ({
      ...prev,
      [key]: { status: 'loading' }
    }));

    try {
      const url = `https://${projectId}.supabase.co/functions/v1${endpoint.path}`;
      
      console.log(`🧪 Testing: ${endpoint.name}`);
      console.log(`🔗 URL: ${url}`);
      
      const response = await fetch(url, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      const data = await response.json();
      
      setResults(prev => ({
        ...prev,
        [key]: {
          status: response.ok ? 'success' : 'error',
          statusCode: response.status,
          data,
          timestamp: new Date().toISOString(),
          url
        }
      }));
      
      console.log(`✅ ${endpoint.name} response:`, data);
    } catch (error) {
      console.error(`❌ ${endpoint.name} error:`, error);
      
      setResults(prev => ({
        ...prev,
        [key]: {
          status: 'error',
          error: (error as Error).message,
          timestamp: new Date().toISOString()
        }
      }));
    }
  };

  const testAll = async () => {
    for (const endpoint of endpoints) {
      await testEndpoint(endpoint);
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#800020] via-[#556B2F] to-[#800020] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
          <h1 className="text-4xl font-bold text-[#FFFFF0] mb-4">
            Edge Function Tester
          </h1>
          <p className="text-[#F5F5DC] mb-4">
            Test your Supabase Edge Function endpoints for MANYARA
          </p>
          
          <div className="bg-black/30 rounded-lg p-4 font-mono text-sm space-y-2 mb-6">
            <div className="text-[#F5F5DC]">
              <span className="text-white/60">Project ID:</span> {projectId}
            </div>
            <div className="text-[#F5F5DC]">
              <span className="text-white/60">Base URL:</span> https://{projectId}.supabase.co/functions/v1
            </div>
            <div className="text-[#F5F5DC]">
              <span className="text-white/60">Anon Key:</span> {publicAnonKey.substring(0, 40)}...
            </div>
          </div>

          <button
            onClick={testAll}
            className="bg-gradient-to-r from-[#800020] to-[#556B2F] text-[#FFFFF0] px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Test All Endpoints
          </button>
        </div>

        {/* Endpoints Grid */}
        <div className="grid gap-6">
          {endpoints.map((endpoint) => {
            const result = results[endpoint.name];
            const isLoading = result?.status === 'loading';
            const isSuccess = result?.status === 'success';
            const isError = result?.status === 'error';

            return (
              <div
                key={endpoint.name}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
              >
                {/* Endpoint Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-[#FFFFF0] mb-2">
                      {endpoint.name}
                    </h3>
                    <p className="text-[#F5F5DC] text-sm mb-3">
                      {endpoint.description}
                    </p>
                    <div className="font-mono text-sm text-[#F5F5DC] bg-black/30 rounded px-3 py-2 inline-block">
                      {endpoint.method} {endpoint.path}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => testEndpoint(endpoint)}
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      isLoading
                        ? 'bg-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#800020] to-[#556B2F] hover:opacity-90'
                    } text-[#FFFFF0]`}
                  >
                    {isLoading ? 'Testing...' : 'Test'}
                  </button>
                </div>

                {/* Result */}
                {result && (
                  <div className="mt-4">
                    {/* Status Badge */}
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          isSuccess
                            ? 'bg-green-500/20 text-green-300 border border-green-500/50'
                            : isError
                            ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                            : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50'
                        }`}
                      >
                        {isLoading && '⏳ Loading...'}
                        {isSuccess && `✅ Success (${result.statusCode})`}
                        {isError && `❌ Error ${result.statusCode ? `(${result.statusCode})` : ''}`}
                      </span>
                      
                      {result.timestamp && (
                        <span className="text-[#F5F5DC] text-sm">
                          {new Date(result.timestamp).toLocaleTimeString()}
                        </span>
                      )}
                    </div>

                    {/* URL */}
                    {result.url && (
                      <div className="mb-3 p-2 bg-black/30 rounded font-mono text-xs text-[#F5F5DC] break-all">
                        {result.url}
                      </div>
                    )}

                    {/* Data Preview */}
                    {result.data && (
                      <div className="bg-black/50 rounded-lg p-4 overflow-auto max-h-96">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[#F5F5DC] font-semibold text-sm">Response:</span>
                          {result.data.products && (
                            <span className="text-green-300 text-sm">
                              {result.data.products.length} products found
                            </span>
                          )}
                        </div>
                        <pre className="text-[#F5F5DC] text-xs font-mono overflow-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </div>
                    )}

                    {/* Error Message */}
                    {result.error && (
                      <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                        <p className="text-red-300 font-mono text-sm">
                          {result.error}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-[#FFFFF0] mb-4">
            Troubleshooting Guide
          </h2>
          <div className="space-y-3 text-[#F5F5DC]">
            <div>
              <strong className="text-white">404 Not Found:</strong> The Edge Function path is incorrect or not deployed.
              Check your Supabase dashboard to verify the function name.
            </div>
            <div>
              <strong className="text-white">401 Unauthorized:</strong> The Anon Key might be invalid.
              Verify it in your Supabase project settings.
            </div>
            <div>
              <strong className="text-white">500 Server Error:</strong> The Edge Function has a bug or Sanity connection issue.
              Check the Edge Function logs in Supabase dashboard.
            </div>
            <div>
              <strong className="text-white">CORS Error:</strong> Make sure CORS is enabled in the Edge Function code.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
