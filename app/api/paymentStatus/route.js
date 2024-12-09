import { NextResponse } from 'next/server';

export async function GET(request) {
  const url = new URL(request.url);
  const paymentId = url.searchParams.get('paymentId'); // Extract paymentId from query params
  console.log(paymentId)
  if (!paymentId) {
    return NextResponse.json({ error: 'paymentId is required' }, { status: 400 });
  }

  const razorpayApiKey = process.env.RAZORPAY_KEY_ID;
  const razorpayApiSecret = process.env.RAZORPAY_KEY_SECRET;

  const auth = Buffer.from(`${razorpayApiKey}:${razorpayApiSecret}`).toString('base64');

  try {
    const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    });

  

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch payment status' }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching payment status:', error);
    return NextResponse.json({ error: 'Error fetching payment status' }, { status: 500 });
  }
}
