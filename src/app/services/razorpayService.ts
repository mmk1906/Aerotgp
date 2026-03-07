// Razorpay Payment Service
// Note: In production, create orders and verify payments on the backend for security

// Environment Variables (Add these to your environment configuration)
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'YOUR_RAZORPAY_KEY_ID';
const RAZORPAY_KEY_SECRET = import.meta.env.VITE_RAZORPAY_KEY_SECRET || 'YOUR_RAZORPAY_KEY_SECRET';

// Extend Window interface for Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

// Load Razorpay SDK
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export interface RazorpayOrderData {
  amount: number; // in rupees
  currency?: string;
  receipt?: string;
  notes?: Record<string, any>;
}

export interface RazorpayPaymentOptions {
  key: string;
  amount: number; // in paise (multiply rupees by 100)
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id?: string;
  handler: (response: RazorpayPaymentResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, any>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

// Create Razorpay Order (Mock implementation for frontend)
// In production, this should be called from your backend
export const createRazorpayOrder = async (data: RazorpayOrderData): Promise<any> => {
  // This is a mock implementation
  // In production, call your backend API to create the order using Razorpay's Orders API
  
  console.warn('⚠️ MOCK: Creating Razorpay order on frontend. In production, create orders on backend!');
  
  return {
    id: `order_${Date.now()}`,
    entity: 'order',
    amount: data.amount * 100, // Convert to paise
    amount_paid: 0,
    amount_due: data.amount * 100,
    currency: data.currency || 'INR',
    receipt: data.receipt || `receipt_${Date.now()}`,
    status: 'created',
    notes: data.notes || {},
  };
};

// Verify Payment (Mock implementation for frontend)
// In production, this MUST be verified on the backend for security
export const verifyRazorpayPayment = async (
  paymentId: string,
  orderId?: string,
  signature?: string
): Promise<boolean> => {
  // This is a mock implementation
  // In production, send these details to your backend to verify using Razorpay's signature verification
  
  console.warn('⚠️ MOCK: Verifying payment on frontend. In production, verify on backend!');
  
  // Mock verification (always returns true in this demo)
  // In production, use crypto to verify the signature on backend:
  // const crypto = require('crypto');
  // const generatedSignature = crypto
  //   .createHmac('sha256', RAZORPAY_KEY_SECRET)
  //   .update(orderId + '|' + paymentId)
  //   .digest('hex');
  // return generatedSignature === signature;
  
  return Promise.resolve(true);
};

// Initialize Razorpay Payment
export const initiateRazorpayPayment = async (
  options: Omit<RazorpayPaymentOptions, 'key'>,
  onSuccess: (response: RazorpayPaymentResponse) => void,
  onFailure: (error: any) => void
): Promise<void> => {
  try {
    // Load Razorpay script
    const isLoaded = await loadRazorpayScript();
    
    if (!isLoaded) {
      throw new Error('Failed to load Razorpay SDK');
    }

    // Create Razorpay payment instance
    const razorpayOptions: RazorpayPaymentOptions = {
      key: RAZORPAY_KEY_ID,
      ...options,
      handler: async (response: RazorpayPaymentResponse) => {
        try {
          // Verify payment
          const isVerified = await verifyRazorpayPayment(
            response.razorpay_payment_id,
            response.razorpay_order_id,
            response.razorpay_signature
          );

          if (isVerified) {
            onSuccess(response);
          } else {
            onFailure(new Error('Payment verification failed'));
          }
        } catch (error) {
          onFailure(error);
        }
      },
      theme: {
        color: options.theme?.color || '#3b82f6', // Blue theme matching aerospace design
      },
      modal: {
        ondismiss: () => {
          onFailure(new Error('Payment cancelled by user'));
        },
      },
    };

    const razorpay = new window.Razorpay(razorpayOptions);
    razorpay.open();
  } catch (error) {
    onFailure(error);
  }
};

// Helper function to format amount (rupees to paise)
export const formatAmountForRazorpay = (amountInRupees: number): number => {
  return Math.round(amountInRupees * 100);
};

// Helper function to format amount (paise to rupees)
export const formatAmountFromRazorpay = (amountInPaise: number): number => {
  return amountInPaise / 100;
};

// Get Razorpay Key ID (for public use)
export const getRazorpayKeyId = (): string => {
  return RAZORPAY_KEY_ID;
};
