import nodemailer from 'nodemailer';

export async function POST(request) {
  const formData = await request.json();

  const { userDetails, purchaseDetails } = formData;

  // Validation
  if (!userDetails || !purchaseDetails) {
    return new Response(JSON.stringify({ message: "Missing user or purchase details." }), { status: 400 });
  }

  // Nodemailer setup for Zoho Mail SMTP
  const transporter = nodemailer.createTransport({
    host: "smtppro.zoho.in",
    secure: true,
    port: 465,
    auth: {
      user: process.env.ZOHO_USER, // Your Zoho email address
      pass: process.env.ZOHO_PASS, // Your Zoho SMTP password
    },
  });

  // Construct the email body
  const emailBody = `
    <p><strong>Course Purchased:</strong> ${purchaseDetails.courseTitle}</p>
    <p><strong>User Name:</strong> ${userDetails.firstName} ${userDetails.lastName}</p>
    <p><strong>User Email:</strong> ${userDetails.email}</p>
    <p><strong>User Phone:</strong> ${userDetails.phone}</p>
    <p><strong>Purchase Date:</strong> ${purchaseDetails.purchaseDate}</p>
    <p><strong>Payment Amount:</strong> Rs. ${purchaseDetails.paymentAmount}</p>
    <p><strong>Payment ID:</strong> ${purchaseDetails.paymentId}</p>
    <p><strong>Payment Status:</strong> ${purchaseDetails.paymentStatus}</p>
  `;

  // Prepare the email options
  const mailOptions = {
    from: process.env.ZOHO_USER, // The 'from' address (Zoho email)
    to: 'contact@medicmode.com', // The recipient email address
    subject: `New Course Purchase: ${purchaseDetails.courseTitle}`,
    html: emailBody, // The email body
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    return new Response(JSON.stringify({ message: "Purchase details sent successfully!" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "There was an error submitting purchase details. Please try again." }), { status: 500 });
  }
}
