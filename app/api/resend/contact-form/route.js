import ContactTemplate from '@/components/resend/contact/ContactTemplate';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { fullName, mobile, email, message} = body;

    if (!fullName || !mobile || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }


    // Send notification email to the admin
    const response = await resend.emails.send({
      from: 'Medicmode <noreply@medicmode.com>',
      to: ['contact@medicmode.com'],
      subject: `Contact Form Submission by ${fullName}`,
      react: ContactTemplate({ fullName, mobile, email, message}),
    });

    if (response.error) {
      console.error('Resend API Error:', response.error);
      return new Response(JSON.stringify({ error: 'Failed to send email' }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, data: { response } }), { status: 200 });

  } catch (error) {
    console.error('Server Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
