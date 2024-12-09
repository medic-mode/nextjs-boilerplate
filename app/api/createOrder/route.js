import Razorpay from 'razorpay';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { amount, currency = 'INR' } = req.body;

  try {
    // Initialize Razorpay instance
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Public key
      key_secret: process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET,    // Secret key
    });

    // Create an order with the specified amount
    const options = {
      amount: amount * 100, // Razorpay requires the amount in the smallest currency unit (paise for INR)
      currency: currency,
      receipt: `receipt_${Date.now()}`, // Unique receipt ID
      payment_capture: 1, // Auto-capture payments
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message,
    });
  }
}
