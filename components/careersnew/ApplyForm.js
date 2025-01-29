'use client'
import { toast, Toaster } from 'sonner';
import CloseIcon from '@mui/icons-material/Close';
import { useRef, useState } from 'react';
import './ApplyForm.css'
import { PulseLoader } from 'react-spinners';

const ApplyForm = ({ isOpen, onClose, jobTitle }) => {

  const [mailSent, setMailSent] = useState(false)

  const formRef = useRef();

  const [formData, setFormData] = useState({
    jobTitle: jobTitle,
    fullName: '',
    email: '',
    contact: '',
    experience: 'Fresher',
    presentOrganization: '',
    resume: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type (e.g., PDF) and size (e.g., max 5MB)
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a valid PDF resume.');
        return;
      }
      // if (file.size > 5 * 1024 * 1024) { // 5MB limit
      //   toast.error('Resume file size should not exceed 5MB.');
      //   return;
      // }
    }
    setFormData((prevData) => ({ ...prevData, resume: file }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    setMailSent(true)
  
    const { fullName, email, contact, experience, presentOrganization, resume, jobTitle } = formData;
  
    // Form validation
    if (!fullName || !email || !contact || !resume) {
      toast.error("Please fill all required fields and upload a resume.");
      return;
    }
  
    const formDataToSend = new FormData();
    formDataToSend.append('fullName', fullName);
    formDataToSend.append('email', email);
    formDataToSend.append('contact', contact);
    formDataToSend.append('experience', experience);
    formDataToSend.append('presentOrganization', presentOrganization);
    formDataToSend.append('resume', resume); // Ensure the file is appended here
    formDataToSend.append('jobTitle', jobTitle);
  
    try {
      const response = await fetch('/api/sendApplication', {
        method: 'POST',
        body: formDataToSend,
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setMailSent(false)
        toast.success(result.message);
        setFormData({
          jobTitle,
          fullName: '',
          email: '',
          contact: '',
          experience: 'Fresher',
          presentOrganization: '',
          resume: null,
        });
        onClose();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('There was an error submitting your application. Please try again.');
      console.error('Error:', error);
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <Toaster position="top-center" richColors />
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}><CloseIcon /></button>
        <h2>Apply for the Job</h2>
        <form ref={formRef} onSubmit={handleFormSubmit} className="apply-form">
          <div>
            <label htmlFor="fullName">Full Name</label>
            <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="contact">Contact Number</label>
            <input type="tel" id="contact" name="contact" value={formData.contact} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="experience">Experience</label>
            <select id="experience" name="experience" value={formData.experience} onChange={handleChange} required>
              <option value="Fresher">Fresher</option>
              <option value="1-3 years">1-3 years</option>
              <option value="4-6 years">4-6 years</option>
              <option value="6+ years">6+ years</option>
            </select>
          </div>
          <div>
            <label htmlFor="presentOrganization">Present Organization (If applicable)</label>
            <input type="text" id="presentOrganization" name="presentOrganization" value={formData.presentOrganization} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="resume">Upload Resume</label>
            <input type="file" id="resume" name="resume" onChange={handleFileChange} required />
          </div>
          <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
            {mailSent ? (<PulseLoader color={"#0A4044"} mailSent={mailSent} size={6}/>) : (
              <button type="submit">Submit Application</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyForm;
