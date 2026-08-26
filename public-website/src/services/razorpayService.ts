declare global {
  interface Window {
    Razorpay?: any;
  }
}

export interface RazorpayOrderResponse {
  success: boolean;
  order_id: string;
  id?: string;
  amount: number;
  currency: string;
  receipt?: string;
}

export interface RazorpayVerificationResponse {
  success: boolean;
  message?: string;
  verified: boolean;
  order_id?: string;
  payment_id?: string;
}

export interface CheckoutOptions {
  amount: number; // in Rupees
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  campaignTitle?: string;
  onSuccess: (paymentData: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  onFailure?: (error: any) => void;
  onDismiss?: () => void;
}

const RAZORPAY_KEY_ID =
  import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TUPpBnksFT8u59';
const MERCHANT_NAME =
  import.meta.env.VITE_RAZORPAY_MERCHANT_NAME || 'Sri Krishna Yadav Youth Guraja';
const THEME_COLOR = import.meta.env.VITE_RAZORPAY_THEME_COLOR || '#D4A244';

// Helper to ensure Razorpay script is loaded in the DOM
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      return resolve(true);
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// STEP 1: Call Backend to Create Order (amount in paise >= 100)
export async function createRazorpayOrder(
  amountInRupees: number,
  receiptTag?: string,
  notes?: Record<string, string>
): Promise<RazorpayOrderResponse> {
  const amountInPaise = Math.round(amountInRupees * 100);

  if (amountInPaise < 100) {
    throw new Error('Minimum contribution amount is ₹1.00 (100 paise).');
  }

  const payload = {
    amount: amountInPaise,
    currency: 'INR',
    receipt: receiptTag || `rcpt_${Date.now()}`,
    notes: notes || {}
  };

  // Try API endpoints with fallback for both serverless & Express backend
  const endpoints = ['/api/create-order', '/api/razorpay/create-order'];
  let lastError: any = null;

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          order_id: data.order_id || data.id,
          id: data.id || data.order_id,
          amount: data.amount,
          currency: data.currency || 'INR',
          receipt: data.receipt
        };
      } else {
        const errorData = await response.json().catch(() => ({}));
        lastError = new Error(errorData.error || errorData.message || `Request failed with status ${response.status}`);
      }
    } catch (err: any) {
      lastError = err;
    }
  }

  throw lastError || new Error('Failed to create Razorpay order from backend.');
}

// STEP 3: Call Backend to Verify Payment Signature (HMAC SHA-256)
export async function verifyRazorpayPayment(
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
): Promise<RazorpayVerificationResponse> {
  const payload = {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  };

  const endpoints = ['/api/verify-payment', '/api/razorpay/verify-payment'];
  let lastError: any = null;

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (response.ok && data.success) {
        return data;
      } else {
        lastError = new Error(data.error || data.message || 'Payment signature verification failed');
      }
    } catch (err: any) {
      lastError = err;
    }
  }

  throw lastError || new Error('Payment signature verification failed.');
}

// STEP 2: Open Standard Razorpay Checkout Modal
export async function launchRazorpayStandardCheckout(
  options: CheckoutOptions
): Promise<void> {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded || !window.Razorpay) {
    throw new Error('Razorpay Checkout SDK failed to load. Please check your internet connection.');
  }

  // 1. Create order on backend
  const order = await createRazorpayOrder(
    options.amount,
    `sky_${Date.now()}`,
    {
      donor_name: options.donorName,
      donor_phone: options.donorPhone,
      campaign: options.campaignTitle || 'General Youth Seva Fund'
    }
  );

  // 2. Open standard checkout modal with order_id
  const rzpOptions = {
    key: RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    name: MERCHANT_NAME,
    description: options.campaignTitle || 'Sri Krishna Yadav Youth Guraja Contribution',
    image: '/favicon.svg',
    order_id: order.order_id,
    prefill: {
      name: options.donorName,
      email: options.donorEmail,
      contact: options.donorPhone
    },
    notes: {
      organization: 'Sri Krishna Yadav Youth Guraja',
      campaign: options.campaignTitle || 'General Seva Fund'
    },
    theme: {
      color: THEME_COLOR
    },
    modal: {
      ondismiss: () => {
        if (options.onDismiss) {
          options.onDismiss();
        }
      }
    },
    handler: async (response: {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
    }) => {
      try {
        // 3. Verify signature on backend
        const verification = await verifyRazorpayPayment(
          response.razorpay_order_id,
          response.razorpay_payment_id,
          response.razorpay_signature
        );

        if (verification.success) {
          options.onSuccess(response);
        } else {
          if (options.onFailure) {
            options.onFailure(new Error('Payment signature verification failed.'));
          }
        }
      } catch (err) {
        if (options.onFailure) {
          options.onFailure(err);
        }
      }
    }
  };

  const rzp = new window.Razorpay(rzpOptions);

  rzp.on('payment.failed', (response: any) => {
    console.error('Razorpay payment failed:', response.error);
    if (options.onFailure) {
      options.onFailure(new Error(response?.error?.description || 'Payment transaction failed.'));
    }
  });

  rzp.open();
}
