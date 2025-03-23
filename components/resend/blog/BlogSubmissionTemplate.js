import React from 'react';

const BlogSubmissionTemplate = ({ author, title }) => (
  <div style={{ fontFamily: 'Arial, sans-serif', color: '#333', lineHeight: '1.6' }}>
    <h1 style={{ color: '#0A4044' }}>Thank You for Your Submission, {author}!</h1>
    
    <p>We have received your blog post titled <strong>&quot;{title}&quot;</strong>. 🎉</p>
    
    <p>Our team will review your submission shortly, ensuring it meets our content guidelines. Once approved, your blog will be published on our website.</p>
    
    <p>We appreciate your valuable contribution to <strong>Medicmode</strong>. Your insights help enrich our community and empower fellow healthcare professionals.</p>
    
    <p>If you have any questions or wish to make any edits, feel free to reach out to us at <a href="mailto:contact@medicmode.com" style={{ color: '#0A4044', textDecoration: 'none', fontWeight: 'bold' }}>contact@medicmode.com</a>.</p>
    
    <p>Thank you for being a part of <strong>Medicmode</strong>. We look forward to sharing your work with our audience! 🚀</p>
    
    <p style={{ marginTop: '20px', marginBottom:'5px' }}>Best Regards,</p>
    <p><strong>The Medicmode Team</strong></p>
  </div>
);

export default BlogSubmissionTemplate;
