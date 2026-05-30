/**
 * Edge Function Test Script
 * Copy and paste this into your browser console to test Edge Function endpoints
 */

// Configuration
const PROJECT_ID = 'trtqbruuzdvlmzrzwrot';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydHFicnV1emR2bG16cnp3cm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNTEwMTQsImV4cCI6MjA3NDkyNzAxNH0.b9Acm1wfXbbcDOfqa6ygoQznj_QGJV9bB9bve5kPYYQ';
const BASE_URL = `https://${PROJECT_ID}.supabase.co/functions/v1`;

// Test function
async function testEdgeFunction(functionPath, endpoint) {
  const url = `${BASE_URL}${functionPath}${endpoint}`;
  
  console.log(`\n🧪 Testing: ${functionPath}${endpoint}`);
  console.log(`🔗 URL: ${url}`);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      console.log(`✅ SUCCESS!`);
      
      if (data.products) {
        console.log(`📦 Products Found: ${data.products.length}`);
        console.log(`📷 First Product:`, data.products[0]);
      }
      
      console.log(`📄 Full Response:`, data);
    } else {
      console.log(`❌ FAILED`);
      console.log(`🔴 Error:`, data);
    }
    
    return { success: response.ok, status: response.status, data };
  } catch (error) {
    console.log(`❌ NETWORK ERROR`);
    console.error(`🔴 Error:`, error);
    return { success: false, error: error.message };
  }
}

// Run all tests
async function runAllTests() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎀 MANYARA Edge Function Tester 🎀');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const tests = [
    { path: '/server', endpoint: '/health' },
    { path: '/server', endpoint: '/sanity-products' },
    { path: '/server', endpoint: '/sanity-raw' },
    { path: '/make-server-5cb00c7d', endpoint: '/health' },
    { path: '/make-server-5cb00c7d', endpoint: '/sanity-products' },
  ];
  
  const results = [];
  
  for (const test of tests) {
    const result = await testEdgeFunction(test.path, test.endpoint);
    results.push({ ...test, ...result });
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 TEST SUMMARY');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  results.forEach((result, index) => {
    const icon = result.success ? '✅' : '❌';
    const status = result.status || 'ERROR';
    console.log(`${icon} Test ${index + 1}: ${result.path}${result.endpoint} - ${status}`);
  });
  
  const successfulTests = results.filter(r => r.success);
  
  if (successfulTests.length > 0) {
    console.log('\n🎉 SUCCESSFUL ENDPOINTS:');
    successfulTests.forEach(test => {
      console.log(`   ✅ ${BASE_URL}${test.path}${test.endpoint}`);
    });
  } else {
    console.log('\n⚠️ NO SUCCESSFUL ENDPOINTS FOUND');
    console.log('   Check your Supabase Edge Functions dashboard to verify deployment');
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  return results;
}

// Run the tests
console.log('Starting Edge Function tests...\n');
runAllTests();
