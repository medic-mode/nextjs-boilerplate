"use client"
import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase'; 
import { doc, getDoc, updateDoc  } from 'firebase/firestore'; 
import './CourseDetail.css';
import { Rating } from '@mui/material';
import emailjs from 'emailjs-com';
import { toast, Toaster } from 'sonner';
import { GridLoader } from 'react-spinners';

import Image from 'next/image';
import { useAuth } from '../AuthContext';
import BuyCourse from '../buycourse/BuyCourse';
import Link from 'next/link';

const CourseDetail = ({slug}) => {

  const { logged } = useAuth();

  const courseId = slug

  const [course, setCourse] = useState(null); 
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const courseRef = doc(db, 'courses', courseId); 
        const docSnapshot = await getDoc(courseRef); 

        if (docSnapshot.exists()) {
          setCourse(docSnapshot.data()); 
        } else {
          console.log('No such document!'); 
        }
      } catch (error) {
        console.error('Error fetching course details:', error); 
      } finally {
        setLoading(false); 
      }
    };

    fetchCourseDetails(); 
// eslint-disable-next-line
  }, [courseId]); 

  

  if (loading || !course) {
    return (
      <div className="loading-container">
        <GridLoader color={"#0A4044"} loading={loading} size={10} />
      </div>
    );
  }

  const capitalizeFirstLetter = (mode) => {
    return mode
      .split(',')
      .map(item => item.trim()) // Trim any extra whitespace
      .map(item => item.charAt(0).toUpperCase() + item.slice(1)) // Capitalize first letter
      .join(', '); // Join them back with a comma and space
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const templateParams = {
        fullName,
        mobile,
        email,
        message,
      };
  
      // Replace these with your own EmailJS service ID, template ID, and user ID
      const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const TEMPLATE_ID = process.env.NEXT_PUBLIC_COURSE_FORM_TEMPLATE;
      const USER_ID = process.env.NEXT_PUBLIC_EMAILJS_USER_ID;
  
      emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, USER_ID)
        .then((response) => {
          toast.success('Enquiry sent successfully!', {
            duration: 3000 
          });
          // Reset form fields
          setFullName('');
          setMobile('');
          setEmail('');
          setMessage('');
        }, (error) => {
          toast.error('Failed to send enquiry. Please try again.', {
            duration: 3000 
          });
        });
    };

    const updateRating = async (courseId, newRating) => {
      try {
        const courseDoc = doc(db, 'courses', courseId);
        await updateDoc(courseDoc, { ratingValue: newRating });
        toast.success('Thank you for rating our course.');
      } catch (error) {
        console.error("Error updating rating: ", error);
      }
    };

  return (
    <div className='course-detail-container'>
      <Toaster position="top-center" richColors /> 
      <div className="course-detail">
        <div className="course-detail-header">
          <header>
            <div className="course-col1">
              <h1>{course.courseTitle}</h1>
              <div
                className="course-description"
                dangerouslySetInnerHTML={{ __html: course.courseDescription }}
              />
              <div className="date-rating">
              <p>
                {course.updatedDate
                  ? `Last updated: ${new Date(course.updatedDate).toLocaleDateString('en-GB')}`
                  : `Created on: ${new Date(course.dateCreated).toLocaleDateString('en-GB')}`}
              </p>
              <div style={{display:'flex' , alignItems:'center'}}>
              {logged ? (
                    <Rating
                    className='rating'
                    name="simple-controlled"
                    value={course.ratingValue || 0} 
                    precision={0.5}
                    onChange={(event, newValue) => {
                      if (newValue > 3.5) {
                        updateRating(course.id, newValue);
                      }
                      toast.success("Thank you for rating our course.");
                    }}
                  />
                  ) : (
                    <div onClick={() => toast.info("Please login to rate our course.")}>
                      <Rating
                        className="rating"
                        name="half-rating-read"
                        defaultValue={course.ratingValue}
                        precision={0.5}
                        readOnly
                        style={{ marginTop: '10px' }}
                      />
                    </div>
                  )} 
              </div>
              </div>
              
              <div className="course-icons">
                <div className="course-icon">
                  <Image src="/assets/courses/clock.svg" alt='clock-icon' className="svg-icon-clock" width={60} height={60} />
                  <div className='course-icon-para'>
                  <p style={{color:'var(--orange)', fontWeight: 600}}>Duration</p>
                    <p>{course.duration.hours} hours</p>
                  </div>
                </div>
                {course.mode === 'online' ? (
                  <div className="course-icon">
                    <Image src="/assets/courses/online.svg" alt='online-icon' className="svg-icon" width={70} height={70} />
                    <div className='course-icon-para'>
                      <p style={{ color: 'var(--orange)', fontWeight: 600 }}>Training Mode</p>
                      <p>{capitalizeFirstLetter(course.mode)}</p>
                    </div>
                  </div>
                ) : course.mode === 'offline' ? (
                  <div className="course-icon">
                    <Image src="/assets/courses/offline.svg" alt='offline-icon'  className="svg-icon" width={70} height={70}  style={{marginRight:'5px'}}/>
                    <div className='course-icon-para'>
                      <p style={{ color: 'var(--orange)', fontWeight: 600 }}>Training Mode</p>
                      <p>{capitalizeFirstLetter(course.mode)}</p>
                    </div>
                  </div>
                ) : course.mode === 'online,offline' ? (
                  <div className="course-icon">
                    <Image src="/assets/courses/online.svg" alt='online-icon' className="svg-icon" width={70} height={70} />
                    <div className='course-icon-para'>
                      <p style={{ color: 'var(--orange)', fontWeight: 600 }}>Training Mode</p>
                      <p>{capitalizeFirstLetter(course.mode)}</p>
                    </div>
                  </div>
                ) : null} 
                
                
                <div className="course-icon">
                <Image src="/assets/courses/price.svg" alt='price-icon' className="svg-icon" width={70} height={70} style={{marginRight: '-5px'}}/>
                  <div className='course-icon-para'>
                  <p style={{color:'var(--orange)', fontWeight: 600}}>Price</p>
                  <p style={{ fontWeight: 600 }}>
                    {course.priceDetail === 'Free' ? (
                      <>Free</>
                    ) : course.priceDetail === 'Contact Us' ? (
                      <Link href="/contact" style={{ textDecoration: 'none', color: 'inherit' }}>
                        Contact Us
                      </Link>
                    ) : (
                      <>₹ {course.price}</>
                    )}
                  </p>
                  </div>
                </div>
                
              </div>
			  {course.priceDetail === 'Paid' && <BuyCourse id={courseId} price={course.price} title={course.courseTitle}/>}
            </div>
            <div className="course-col2">
              <img src={course.thumbnail} alt="thumbnai" />
            </div>
          </header>
        </div>
        <div className='course-detail-main'>
          <main>
            <div className="course-topics">
            <h1>What you will learn</h1>
            <ul>
              {course.topics
                .match(/<p>(.*?)<\/p>/g) // Match all <p>...</p> pairs
                ?.map((topic, index) => (
                  <li key={index}>
                    <Image src="/assets/courses/checkbox.svg" alt="checkbox" width={15}  height={15}/>
                    <span dangerouslySetInnerHTML={{ __html: topic.replace(/<\/?p>/g, '').trim() }} />
                  </li>
                ))}
            </ul>
            </div>
            {course.highlights && (
              <div className="course-highlights">
            <h1>Featured highlights of this course</h1>
            <ul>
              {course.highlights
                .match(/<p>(.*?)<\/p>/g) // Match all <p>...</p> pairs
                ?.map((topic, index) => (
                  <li key={index}>
                    <Image src="/assets/courses/checkbox.svg" alt="checkbox" width={15}  height={15}/>
                    <span dangerouslySetInnerHTML={{ __html: topic.replace(/<\/?p>/g, '').trim() }} />
                  </li>
                ))}
            </ul>
            </div>
            )}
            
          </main>
          <main>
          <div className="course-enquiry">
            <h1>Quick Enquiry</h1>
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
              style={{ resize: 'vertical', width: 'auto'}}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <button className='enquiry-btn' type="submit">Enquire now</button>
          </form>
          </div>
          </main>
        </div>
      </div> 
    </div>
  );
};

export default CourseDetail;
