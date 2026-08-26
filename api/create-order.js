import process from 'node:process';
import { Buffer } from 'node:buffer';

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

  const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_TUPpBnksFT8u59';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || 'n8uTFFsr2Gr2lmqsQ4wHHFe7';

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { amount, currency = 'INR', receipt, notes } = body;

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

    // Direct official Razorpay Orders REST API call (zero ESM/CJS runtime crash risk on Vercel)
    const authHeader = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`;

    const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({
        amount: parsedAmount,
        currency: currency || 'INR',
        receipt: receipt || `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        notes: notes || {}
      })
    });

    const data = await rzpResponse.json();

    if (!rzpResponse.ok) {
      console.error('Razorpay API error response:', data);
      return res.status(rzpResponse.status).json({
        error: data?.error?.description || 'Razorpay order creation failed.'
      });
    }

    return res.status(200).json({
      success: true,
      order_id: data.id,
      id: data.id,
      amount: data.amount,
      currency: data.currency,
      receipt: data.receipt,
      status: data.status
    });
  } catch (error) {
    console.error('Server error creating Razorpay order:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error while creating Razorpay order.'
    });
  }
}
