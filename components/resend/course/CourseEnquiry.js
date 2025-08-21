import React from 'react';

const CourseEnquiry = ({ fullName, mobile, email, message , courseTitle }) => (
  <div style={{ fontFamily: 'Arial, sans-serif', color: '#333', lineHeight: '1.6' }}>
    <h1 style={{ color: '#0A4044' }}>Course Enquiry</h1>
    <p><strong>Course:</strong> {courseTitle}</p>
    <p><strong>Name:</strong> {fullName}</p>
    <p><strong>Mobile No:</strong> {mobile}</p>
    <p><strong>Email Id:</strong> {email}</p>
    <p><strong>Message:</strong> {message}</p>
    <p style={{ marginTop: '20px' }}>Best Regards,</p>
    <p><strong>The Medicmode Team</strong></p>
  </div>
);

export default CourseEnquiry;
