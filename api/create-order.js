import process from 'node:process';
import Razorpay from 'razorpay';

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

  const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_TUPBdxOO32AKd1';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || 'kxCOHz6gJHknD4iScB9c9n2g';

  try {
    const { amount, currency = 'INR', receipt, notes } = req.body || {};

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required.' });
    }

    const parsedAmount = parseInt(amount, 10);

    // Validate amount >= 100 paise (minimum ₹1.00)
    if (isNaN(parsedAmount) || parsedAmount < 100) {
      return res.status(400).json({
        error: 'Amount must be at least 100 paise (₹1.00).'
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
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    if (error?.statusCode === 401 || error?.error?.code === 'BAD_REQUEST_ERROR' && error?.error?.description?.includes('auth')) {
      return res.status(401).json({ error: 'Razorpay authentication failed.' });
    }
    return res.status(500).json({
      error: error?.error?.description || error.message || 'Failed to create Razorpay order.'
    });
  }
}
