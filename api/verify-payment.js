import process from 'node:process';
import crypto from 'crypto';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Only POST is supported.' });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET || 'kxCOHz6gJHknD4iScB9c9n2g';

  try {
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
  } catch (error) {
    console.error('Error verifying payment signature:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error during payment verification.'
    });
  }
}
