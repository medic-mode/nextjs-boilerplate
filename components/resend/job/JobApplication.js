import React from 'react';

const JobApplication = ({ fullName, email, contact, experience, presentOrganization, jobTitle }) => (
  <div style={{ fontFamily: 'Arial, sans-serif', color: '#333', lineHeight: '1.6' }}>
    <h1 style={{ color: '#0A4044' }}>Job Application</h1>
    <p><strong>Job Title:</strong> {jobTitle}</p>
    <p><strong>Name:</strong> {fullName}</p>
    <p><strong>Mobile No:</strong> {contact}</p>
    <p><strong>Email Id:</strong> {email}</p>
    <p><strong>Experience:</strong> {experience}</p>
    <p><strong>Present Organization:</strong> {presentOrganization}</p>
    
    <p style={{ marginTop: '20px' }}>Best Regards,</p>
    <p><strong>The Medicmode Team</strong></p>
  </div>
);

export default JobApplication;
