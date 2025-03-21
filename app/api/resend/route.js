import  EmailTemplate  from '../../../components/resend/welcome/Welcome';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Medicmode <admin@medicmode.com>',
      to: ['medicmode.official@gmail.com'],
      subject: 'Welcome to Medicmode!',
      react: EmailTemplate({ firstName: 'Jabez' }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}