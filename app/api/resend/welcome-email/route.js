import EmailTemplate from '@/components/resend/welcome/Welcome'; // Adjust path if needed
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json(); // Parse request body
    const { firstName, email } = body;

    if (!firstName || !email) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'Medicmode <noreply@medicmode.com>',
      to: [email],
      replyTo: 'contact@medicmode.com',
      subject: 'Welcome to Medicmode!',
      react: EmailTemplate({ firstName }),
    });

    if (error) {
      console.error('Resend API Error:', error);
      return new Response(JSON.stringify({ error: 'Failed to send email' }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, data }), { status: 200 });
  } catch (error) {
    console.error('Server Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
