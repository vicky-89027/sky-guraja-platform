import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';

const router = Router();

// 1. Create Razorpay Order
router.post('/create-order', async (req: Request, res: Response) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body || {};

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required.' });
    }

    const parsedAmount = parseInt(amount, 10);

    // Validate amount >= 100 paise (min ₹1.00)
    if (isNaN(parsedAmount) || parsedAmount < 100) {
      return res.status(400).json({
        error: 'Amount must be at least 100 paise (₹1.00).'
      });
    }

    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_TUPPim0Wc6PVBF';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'kxCOHz6gJHknD4iScB9c9n2g';

    if (!keyId || !keySecret) {
      return res.status(401).json({
        error: 'Razorpay credentials not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.'
      });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });

    const options = {
      amount: parsedAmount,
      currency: currency || 'INR',
      receipt: receipt || `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      notes: notes || {}
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      order_id: order.id,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    if (error?.statusCode === 401) {
      return res.status(401).json({ error: 'Razorpay authentication failed.' });
    }
    return res.status(500).json({
      error: error?.error?.description || error.message || 'Failed to create Razorpay order.'
    });
  }
});

// 2. Verify Razorpay Payment Signature
router.post('/verify-payment', (req: Request, res: Response) => {
  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'kxCOHz6gJHknD4iScB9c9n2g';

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_id,
      payment_id,
      signature
    } = req.body || {};

    const orderId = razorpay_order_id || order_id;
    const paymentId = razorpay_payment_id || payment_id;
    const receivedSignature = razorpay_signature || signature;

    // Validate missing fields
    if (!orderId || !paymentId || !receivedSignature) {
      return res.status(400).json({
        error: 'Missing required parameters: razorpay_order_id, razorpay_payment_id, razorpay_signature'
      });
    }

    // Generate expected HMAC-SHA256 signature
    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body.toString())
      .digest('hex');

    const isMatch = expectedSignature === receivedSignature;

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment signature. Payment verification failed.',
        verified: false
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Payment signature verified successfully.',
      verified: true,
      order_id: orderId,
      payment_id: paymentId
    });
  } catch (error: any) {
    console.error('Error verifying payment signature:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error during payment verification.'
    });
  }
});

export default router;
