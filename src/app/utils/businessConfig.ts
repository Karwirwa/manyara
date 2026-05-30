/**
 * Business Configuration - Backend Only
 * These details are used for order processing, email notifications, and backend operations
 * DO NOT display these on the frontend
 */

export const BUSINESS_CONFIG = {
  // Contact Information (Backend use only)
  email: 'rastamousequeen@gmail.com',
  phone: '0797040512',
  phoneFormatted: '+254 797 040 512',
  
  // Payment Details (Backend use only)
  mpesa: {
    tillNumber: '7121042',
    businessName: 'MANYARA Intimates',
  },
  
  bank: {
    name: 'Equity Bank',
    accountNumber: '0370177352420',
    accountName: 'Rispah Karwirwa',
    branch: 'Equity Bank Kenya',
  },
  
  paypal: {
    email: 'rastamousequeen@gmail.com', // PayPal email
  },
  
  // Business Details
  businessName: 'MANYARA Luxury Lingerie',
  location: 'Nairobi, Kenya',
  
  // Social Media (Public)
  social: {
    instagram: 'https://www.instagram.com/manyara_intimates/',
    facebook: 'https://web.facebook.com/profile.php?id=61574430731029',
  },
};

/**
 * Get bank transfer instructions for customer emails
 * @param orderReference - Unique order reference number
 * @returns Formatted bank transfer instructions
 */
export function getBankTransferInstructions(orderReference: string): string {
  return `
Bank Transfer Details:

Bank: ${BUSINESS_CONFIG.bank.name}
Account Name: ${BUSINESS_CONFIG.bank.accountName}
Account Number: ${BUSINESS_CONFIG.bank.accountNumber}
Branch: ${BUSINESS_CONFIG.bank.branch}

Reference: ${orderReference}

Please include the reference number when making your transfer and send proof of payment to ${BUSINESS_CONFIG.email}
  `.trim();
}

/**
 * Get M-Pesa payment instructions
 * @returns Formatted M-Pesa instructions
 */
export function getMpesaInstructions(): string {
  return `
M-Pesa Payment Instructions:

1. Go to M-Pesa menu
2. Select Lipa na M-Pesa
3. Select Buy Goods and Services
4. Enter Till Number: ${BUSINESS_CONFIG.mpesa.tillNumber}
5. Enter the amount
6. Enter your M-Pesa PIN
7. You will receive a confirmation SMS

Business Name: ${BUSINESS_CONFIG.mpesa.businessName}
  `.trim();
}

/**
 * Get PayPal payment instructions
 * @returns Formatted PayPal instructions
 */
export function getPayPalInstructions(): string {
  return `
PayPal Payment Instructions:

Send payment to: ${BUSINESS_CONFIG.paypal.email}

Please include your order reference number in the payment note.
  `.trim();
}
