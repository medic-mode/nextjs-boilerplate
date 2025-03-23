import BlogSubmissionTemplate from '@/components/resend/blog/BlogSubmissionTemplate';
import AdminNotificationTemplate from '@/components/resend/blog/AdminNotificationTemplate';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { author, userEmail, title } = body;

    if (!author || !userEmail || !title) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    // Send confirmation email to the user
    const userEmailResponse = await resend.emails.send({
      from: 'Medicmode <noreply@medicmode.com>',
      to: [userEmail],
      replyTo: 'contact@medicmode.com',
      subject: 'Blog Submission Has Been Received!',
      react: BlogSubmissionTemplate({ author, title }),
    });

    // Send notification email to the admin
    const adminEmailResponse = await resend.emails.send({
      from: 'Medicmode <noreply@medicmode.com>',
      to: ['admin@medicmode.com'],
      subject: `New Blog Submission: ${title}`,
      react: AdminNotificationTemplate({ author, userEmail, title }),
    });

    if (userEmailResponse.error || adminEmailResponse.error) {
      console.error('Resend API Error:', userEmailResponse.error || adminEmailResponse.error);
      return new Response(JSON.stringify({ error: 'Failed to send email' }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, data: { userEmailResponse, adminEmailResponse } }), { status: 200 });

  } catch (error) {
    console.error('Server Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
