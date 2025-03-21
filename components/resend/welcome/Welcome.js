import React from 'react';

const EmailTemplate = ({ firstName }) => (
  <div>
    <h1>Welcome to MedicMode, {firstName}!</h1>
    <p>Thank you for signing in and joining our community. We are excited to have you on board!</p>
    <p>At MedicMode, we are dedicated to providing valuable resources and support. If you have any questions, feel free to reach out.</p>
    <p>With Regards and Thanks,</p>
    <p><strong>MedicMode Team</strong></p>
  </div>
);

export default EmailTemplate;
