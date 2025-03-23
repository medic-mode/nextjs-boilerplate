import React from 'react';

const AdminNotificationTemplate = ({ author, userEmail, title }) => (
  <div style={{ fontFamily: 'Arial, sans-serif', color: '#333', lineHeight: '1.6' }}>
    <h1 style={{ color: '#0A4044' }}>New Blog Submission</h1>
    <p>A new blog post has been submitted. Please review and publish it.</p>
    <p><strong>Author:</strong> {author}</p>
    <p><strong>Title:</strong> {title}</p>
    <p><strong>User Email:</strong> {userEmail}</p>
    <p style={{ marginTop: '20px' }}>Best Regards,</p>
    <p><strong>The Medicmode Team</strong></p>
  </div>
);

export default AdminNotificationTemplate;
