export default async function handler(req, res) {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    try {
      const { paymentId } = req.query;
      if (!paymentId) {
        return res.status(400).json({ error: 'Payment ID is required' });
      }
  
      const razorpayApiUrl = `https://api.razorpay.com/v1/payments/${paymentId}`;
  
      const paymentResponse = await fetch(razorpayApiUrl, {
        method: 'GET',
        headers: {
          Authorization: `Basic ${Buffer.from(`${process.env.RAZORPAY_USERNAME}:${process.env.RAZORPAY_PASSWORD}`).toString('base64')}`,
        },
      });
  
      if (!paymentResponse.ok) {
        throw new Error('Failed to fetch payment status');
      }
  
      const paymentStatus = await paymentResponse.json();
      res.status(200).json(paymentStatus);
    } catch (error) {
      console.error('Error fetching payment status:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  