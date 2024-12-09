import Razorpay from 'razorpay';

export async function POST(req) {
  try {
    const { amount, currency = 'INR' } = await req.json();

    // Initialize Razorpay instance
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Create an order
    const options = {
      amount: amount * 100, // Amount in paise
      currency: currency,
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    return Response.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to create order',
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
