import React from 'react';

const EmailTemplate = ({ firstName }) => (
  <div style={{ fontFamily: 'Arial, sans-serif', color: '#333', lineHeight: '1.6' }}>
    <h1 style={{ color: '#0A4044' }}>Welcome to Medicmode, {firstName}!</h1>
    <p>We are delighted to welcome you to <strong>Medicmode</strong>. Thank you for signing in and becoming a part of our growing community of healthcare professionals and enthusiasts.</p>
    <p>At <strong>Medicmode</strong>, we are committed to providing high-quality resources, insightful content, and a supportive network to help you stay informed and excel in your field.</p>
    <p>If you have any questions, need assistance, or simply want to explore more about what we offer, feel free to reach out to us at <a href="mailto:contact@medicmode.com" style={{ color: '#0A4044', textDecoration: 'none', fontWeight: 'bold' }}>contact@medicmode.com</a>.</p>
    <p>We look forward to being a valuable part of your journey.</p>
    <p style={{ marginTop: '20px' }}>Best Regards,</p>
    <p><strong>The Medicmode Team</strong></p>
  </div>
);

export default EmailTemplate;
