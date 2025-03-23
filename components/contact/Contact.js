"use client"
import { useState } from 'react';
import Image from 'next/image'; // Use Next.js Image component
import './Contact.css';
import { toast, Toaster } from 'sonner';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneIcon from '@mui/icons-material/Phone';
import { PulseLoader } from 'react-spinners';
import { Button } from 'primereact/button';

const Contact = () => {
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true)
    try {
      const response = await fetch('/api/resend/contact-form', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, mobile, email, message  }) 
      });
  
      const data = await response.json();
  
      if (response.ok) {
        toast.success('Contact form submitted successfully!', { duration: 3000 });
  
        // Reset form fields
        setFullName('');
        setMobile('');
        setEmail('');
        setMessage('');
      } else {
        throw new Error(data.error || 'Failed to send enquiry');
      }
    } catch (error) {
      toast.error('Failed to send enquiry. Please try again.', { duration: 3000 });
    } finally {
      setSubmitted(false);
    }
  };

  const contacts = [
    {
      name: 'Jabez - Founder & CEO',
      phone: '+91 95519 43040',
      email: 'jabez@medicmode.com'
    },
    {
      name: 'Praisy Abigail - COO',
      phone: '+91 73584 56059',
      email: 'praisyabigail@medicmode.com'
    },
    {
      name: 'Sivanesh - CFO',
      phone: '+91 82206 86855',
      email: 'sivanesh@medicmode.com'
    }
  ];

  return (
    <div className="contact-container">
      <Toaster position="top-center" richColors />
      <div className="contact">
        <Image src='/assets/contact/contactheader.jpg' alt="Contact Header" width={1920} height={800} />
        <div className="contact-text">
          <div className="contact-heading">
            <h1>GET IN <span style={{color:'var(--orange)'}}>TOUCH WITH US</span></h1>
            <p>Your thoughts and inquiries are important to us! Don&apos;t hesitate to contact our team for assistance or to share your ideas.</p>
          </div>
          <div className="contact-info">
            <div className="contact-address">
              <div className="addr">
                <Image src='/assets/contact/serviceIcon.png' alt="Service Icon" width={50} height={50} className='addr-image' />
                <p>Services available in <br />Chennai, Bangalore, Hyderabad, Mangalore, Coimbatore & Trichy</p>
                <div className='contact-icon' style={{marginTop:'8px'}}>
                <MailOutlineIcon />
                  <p>For Support and Enquiry: <a href="mailto:contact@medicmode.com">contact@medicmode.com</a></p>
                </div>
              </div>
              {contacts.map((contact, index) => (
                <div className="addr" key={index}>
                  <h3 style={{color:'var(--orange)', marginBottom:'15px'}}>{contact.name}</h3>
                  <div className='contact-icon'>
                    <PhoneIcon />
                    <p>{contact.phone}</p>
                  </div>
                  <div className='contact-icon'>
                    <MailOutlineIcon />
                    <p><a href={`mailto:${contact.email}`}>{contact.email}</a></p>
                  </div>
                </div>
              ))}
            </div>
            <div className="contact-form">
              <h2>Connect with Us</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <textarea
                  placeholder="Write a message..."
                  rows="3"
                  style={{ resize: 'vertical', width: 'auto' }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
                <Button 
                        className="enquiry-btn" 
                        type="submit" 
                        label={submitted ? <PulseLoader color={"var(--light-green)"} submitted={submitted} size={6}/> : "Submit"} 
                        disabled={submitted} 
                      />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
