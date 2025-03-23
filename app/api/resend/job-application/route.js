import { Resend } from 'resend';
import JobApplication from '@/components/resend/job/JobApplication';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { fullName, email, contact, experience, presentOrganization, jobTitle, resume } = await req.json();

    if (!fullName || !email || !contact || !resume) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'Medicmode <noreply@medicmode.com>',
      to: ['contact@medicmode.com'], 
      subject: `Job Application Received`,
      react: JobApplication({ fullName, email, contact, experience, presentOrganization, jobTitle }),
      attachments: [
        {
          content: resume.content, 
          filename: resume.filename, 
        },
      ],
    });

    if (error) {
      console.error('Resend API Error:', error);
      return new Response(JSON.stringify({ error: 'Failed to send email' }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, message: 'Application submitted successfully!' }), { status: 200 });
  } catch (error) {
    console.error('Server Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
