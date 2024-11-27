import nodemailer from 'nodemailer';

export async function POST(request) {
  const formData = await request.formData();

  const fullName = formData.get('fullName');
  const email = formData.get('email');
  const contact = formData.get('contact');
  const experience = formData.get('experience');
  const presentOrganization = formData.get('presentOrganization');
  const resume = formData.get('resume');  // This is a File object
  const jobTitle = formData.get('jobTitle');

  // Validation
  if (!fullName || !email || !contact || !resume) {
    return new Response(JSON.stringify({ message: "Please fill all required fields and upload a resume." }), { status: 400 });
  }

  // Read the resume file and convert it to a Buffer
  const resumeBuffer = await resume.arrayBuffer();
  const resumeName = resume.name;

  // Nodemailer setup
  const transporter = nodemailer.createTransport({
    host: "smtppro.zoho.in",
    secure: true,
    port: 465,
    auth: {
      user: process.env.ZOHO_USER,
      pass: process.env.ZOHO_PASS,
    },
  });

  const emailBody = `
    <p><strong>Full Name:</strong> ${fullName}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Contact Number:</strong> ${contact}</p>
    <p><strong>Experience:</strong> ${experience} </p>
    <p><strong>Present Organization:</strong> ${presentOrganization}</p>
  `;

  // Prepare the email data with the resume as an attachment
  const mailOptions = {
    from: process.env.ZOHO_USER,
    to: process.env.ZOHO_USER,  // Send to the same email or another email
    subject: `Job Application for ${jobTitle}`,
    html: emailBody,
    attachments: resume
      ? [
          {
            filename: resumeName,
            content: Buffer.from(resumeBuffer),
          },
        ]
      : [],
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);
    return new Response(JSON.stringify({ message: "Application submitted successfully!" }), { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ message: "There was an error submitting your application. Please try again." }), { status: 500 });
  }
}
